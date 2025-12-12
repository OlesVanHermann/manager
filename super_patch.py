#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
super_patch.py – Applique des patchs "minimaux" de façon robuste, idempotente et transactionnelle par fichier; lit STDIN, accepte '***' alias de '---', tolère '+++ manquant', gère /dev/null, évite les 'misordered hunks' via application séquentielle et ANCRE correctement les groupes uniquement '+' grâce aux lignes de CONTEXTE.

VERSION CORRIGÉE :
- FIX #4: Validation syntaxique Python après chaque application avec rollback
- FIX #2: Détection zones dangereuses (après 'def', 'return [', signatures)
- FIX #3: Capture context_after pour ancrage précis groupes mixtes
- FIX #1: Ancrage intelligent avec lookahead/lookbehind pour insertions pures
- FIX #5: Recherche contextuelle avec score de confiance (before+after)
- FIX #6: Insertion avant signature quand context_after contient def/class
- FIX #7: Ancrage strict par proximité (context_after IMMÉDIATEMENT après context_before)
- FIX #8: Pas de fallback si context_after fourni mais non trouvé
- FIX #9: Chercher TOUTES les occurrences de context_before jusqu'à trouver match avec context_after
- FIX #10: Transformation insertion pure en remplacement avec contexte étendu (3 lignes avant/après)
- FIX #11: Déplacements de lignes (g_minus ≈ g_plus) divisés en 2 passes: suppression puis insertion
- FIX #12: Flush correct quand contexte intermédiaire sépare deux blocs d'insertion
"""

import sys, os, re, tempfile, subprocess, shutil
from typing import List, Tuple, Optional, Dict

# ===== CONFIGURATION =====
CONTEXT_LINES_BEFORE = 3
CONTEXT_LINES_AFTER = 3
MOVE_SIMILARITY_THRESHOLD = 0.5  # Seuil d'intersection pour détecter un déplacement

# ===== UTILITAIRES FICHIERS/TEXTE =====
def read_file_lines(path: str) -> List[str]:
    """Lire toutes les lignes d'un fichier en UTF-8; path->list[str]."""
    with open(path, "r", encoding="utf-8") as f:
        return f.readlines()

# ===== VALIDATION SYNTAXIQUE =====
def _validate_python_syntax(file_path: str) -> bool:
    """Vérifier que le fichier Python est syntaxiquement valide; path->bool."""
    if not file_path.endswith(".py"):
        return True
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        compile(content, file_path, 'exec')
        return True
    except SyntaxError as e:
        sys.stderr.write(f"[SYNTAX ERROR] {file_path}:{e.lineno}: {e.msg}\n")
        if e.text:
            sys.stderr.write(f"  Ligne: {e.text.strip()}\n")
        return False
    except Exception as e:
        sys.stderr.write(f"[VALIDATION WARN] {file_path}: {e}\n")
        return True

# ===== NORMALISATION DES CHEMINS =====
def normalize_old_path(header_path: str) -> str:
    """Normaliser OLD depuis l'entête: conserve absolu, supprime 'a/'; s->str."""
    p = (header_path or "").strip()
    if p.startswith("/"):
        return p
    if p.startswith("a/"):
        return p[2:]
    return p

def normalize_new_path(header_path: str) -> str:
    """Normaliser NEW depuis l'entête: conserve absolu, supprime 'b/'; s->str."""
    p = (header_path or "").strip()
    if p.startswith("/"):
        return p
    if p.startswith("b/"):
        return p[2:]
    return p

# ===== PARSING HEADERS /@@ =====
def _parse_hunk_start_pair(raw_header: str) -> Tuple[Optional[int], Optional[int]]:
    """Extraire (old_start,new_start) depuis @@ -a,b +c,d @@; header->(int 1-based|None, int 1-based|None)."""
    try:
        m = re.search(r'@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@', raw_header or '')
        if m:
            return int(m.group(1)), int(m.group(2))
    except Exception:
        pass
    return None, None

# ===== PARSING DU DIFF EN ENTREE =====
def parse_diff(stdin_lines: List[str]) -> List[Dict]:
    """Parser un diff souple en [{old,new,hunks:[{raw_header,old_start,new_start,lines[]}]}]; lines->struct."""
    files: List[Dict] = []
    cur: Optional[Dict] = None
    i = 0

    def _hdr_path(s: str) -> Optional[str]:
        m = re.match(r"(?:---|\*\*\*)\s+([^\t\r\n]+)", (s or ""))
        return m.group(1).strip() if m else None

    while i < len(stdin_lines):
        line = stdin_lines[i]

        if line.startswith(("--- ", "*** ")):
            path_old = _hdr_path(line)
            path_new = None
            j = i + 1

            if j < len(stdin_lines) and stdin_lines[j].startswith("+++ "):
                m_new = re.match(r"\+\+\+\s+([^\t\r\n]+)", stdin_lines[j])
                path_new = (m_new.group(1).strip() if m_new else (path_old or ""))
                i = j + 1
            elif j < len(stdin_lines) and stdin_lines[j].startswith(("--- ", "*** ")):
                path2 = _hdr_path(stdin_lines[j])
                path_new = path2 or path_old or ""
                i = j + 1
            else:
                path_new = path_old or ""
                i = j

            cur = {"old": path_old or "", "new": path_new or "", "hunks": []}
            files.append(cur)
            continue

        if cur is not None and line.startswith("@@"):
            hunk_header = line.rstrip("\n")
            hunk_lines: List[str] = []
            i += 1
            while i < len(stdin_lines):
                l2 = stdin_lines[i]
                if l2.startswith("@@") or l2.startswith(("--- ", "*** ")):
                    break
                hunk_lines.append(l2)
                i += 1
            old_s, new_s = _parse_hunk_start_pair(hunk_header)
            cur["hunks"].append({
                "raw_header": hunk_header,
                "old_start": old_s,
                "new_start": new_s,
                "lines": hunk_lines
            })
            continue

        i += 1

    return files

# ===== NETTOYAGE /dev/null =====
def _normalize_devnull_headers(files: List[Dict]) -> None:
    """Si old==/dev/null, remplacer old par new et marquer is_creation; files->None."""
    for fe in files:
        old_hdr = (fe.get("old") or "").strip()
        new_hdr = (fe.get("new") or "").strip()
        if not old_hdr or not new_hdr:
            continue
        if old_hdr.endswith("/dev/null"):
            fe["old"] = new_hdr
            fe["is_creation"] = True

# ===== OUTILS SUR HUNKS =====
def split_groups_with_context(hunk: Dict) -> List[Tuple[List[str], List[str], List[str], List[str]]]:
    """Découper un hunk en groupes séquentiels (context_before, minus, plus, context_after) en capturant les lignes de contexte avant et après chaque groupe; FIX #12: flush quand contexte intermédiaire sépare deux blocs; hunk->list tuples."""
    lines: List[str] = hunk.get("lines") or []

    groups: List[Tuple[List[str], List[str], List[str], List[str]]] = []
    cur_context_before: List[str] = []
    cur_minus: List[str] = []
    cur_plus: List[str] = []
    cur_context_after: List[str] = []

    def flush():
        nonlocal cur_context_before, cur_minus, cur_plus, cur_context_after
        if cur_minus or cur_plus:
            groups.append((cur_context_before.copy(), cur_minus, cur_plus, cur_context_after.copy()))
            cur_context_before = cur_context_after.copy()
            cur_context_after = []
        cur_minus = []
        cur_plus = []

    for l in lines:
        if l.startswith(" "):
            # Ligne de contexte
            if cur_minus or cur_plus:
                # On était dans un bloc de changement, cette ligne est context_after
                cur_context_after.append(l[1:])
            else:
                # Pas de changement en cours
                if cur_context_after:
                    # On avait du context_after d'un groupe précédent, c'est maintenant context_before
                    cur_context_before = cur_context_after.copy()
                    cur_context_after = []
                cur_context_before.append(l[1:])
        elif l.startswith("-"):
            # FIX #12: Si on a du context_after accumulé et qu'on rencontre un nouveau -, flush d'abord
            if cur_context_after and not cur_minus and not cur_plus:
                # context_after existe mais pas de changement en cours = nouveau groupe
                cur_context_before = cur_context_after.copy()
                cur_context_after = []
            elif cur_plus:
                # On avait des + et maintenant des - : flush le groupe précédent
                flush()
            cur_minus.append(l[1:])
        elif l.startswith("+"):
            # FIX #12: Si on a du context_after accumulé et qu'on rencontre un nouveau +, flush d'abord
            if cur_context_after and not cur_minus and not cur_plus:
                # context_after existe mais pas de changement en cours = nouveau groupe séparé par contexte
                cur_context_before = cur_context_after.copy()
                cur_context_after = []
            cur_plus.append(l[1:])
        else:
            # Ligne non reconnue (rare), flush et traiter comme contexte
            flush()
            cur_context_before.append(l)

    flush()
    return groups

# ===== DÉTECTION ET DIVISION DES DÉPLACEMENTS =====
def _lines_similarity(lines_a: List[str], lines_b: List[str]) -> float:
    """Calculer le ratio d'intersection entre deux listes de lignes; (a,b)->float 0..1."""
    if not lines_a or not lines_b:
        return 0.0
    set_a = set(l.strip() for l in lines_a if l.strip())
    set_b = set(l.strip() for l in lines_b if l.strip())
    if not set_a or not set_b:
        return 0.0
    intersection = len(set_a & set_b)
    union = len(set_a | set_b)
    return intersection / union if union > 0 else 0.0

def _split_move_groups(groups: List[Tuple[List[str], List[str], List[str], List[str]]]) -> List[Tuple[List[str], List[str], List[str], List[str]]]:
    """Pré-diviser les groupes de déplacement (g_minus ≈ g_plus) en 2 passes: suppression puis insertion; groups->groups_expanded."""
    result: List[Tuple[List[str], List[str], List[str], List[str]]] = []
    
    for ctx_before, g_minus, g_plus, ctx_after in groups:
        if g_minus and g_plus:
            similarity = _lines_similarity(g_minus, g_plus)
            if similarity >= MOVE_SIMILARITY_THRESHOLD:
                # Déplacement détecté: diviser en suppression + insertion
                # 1) Suppression avec contexte before uniquement
                result.append((ctx_before, g_minus, [], []))
                # 2) Insertion avec contexte after uniquement
                result.append(([], [], g_plus, ctx_after))
                continue
        
        # Groupe normal: garder tel quel
        result.append((ctx_before, g_minus, g_plus, ctx_after))
    
    return result

# ===== RECHERCHE BLOCS / FORMAT =====
def find_contiguous_block(haystack: List[str], needle: List[str], start_from: int = 0) -> Optional[int]:
    """Trouver l'index de needle (contigu) dans haystack à partir de start_from; ->int|None."""
    if not needle:
        return start_from
    n = len(needle)
    for start in range(start_from, len(haystack) - n + 1):
        if haystack[start:start+n] == needle:
            return start
    return None

def find_best_context_match(haystack: List[str], context_before: List[str], context_after: List[str], start_from: int = 0) -> Optional[int]:
    """Trouver le meilleur match en cherchant TOUTES les occurrences de context_before et vérifiant que context_after suit immédiatement; (haystack,before,after,start)->int|None."""
    if context_before and context_after:
        search_pos = start_from
        while True:
            before_idx = find_contiguous_block(haystack, context_before, search_pos)
            if before_idx is None:
                break
            
            candidate_idx = before_idx + len(context_before)
            after_end = candidate_idx + len(context_after)
            if after_end <= len(haystack):
                if haystack[candidate_idx:after_end] == context_after:
                    return candidate_idx
            
            search_pos = before_idx + 1
        
        if start_from > 0:
            search_pos = 0
            while search_pos < start_from:
                before_idx = find_contiguous_block(haystack, context_before, search_pos)
                if before_idx is None or before_idx >= start_from:
                    break
                
                candidate_idx = before_idx + len(context_before)
                after_end = candidate_idx + len(context_after)
                if after_end <= len(haystack):
                    if haystack[candidate_idx:after_end] == context_after:
                        return candidate_idx
                
                search_pos = before_idx + 1
        
        return None
    
    if context_before:
        idx = find_contiguous_block(haystack, context_before, start_from)
        if idx is not None:
            return idx + len(context_before)
    
    return None

def format_lines(prefix: str, lines: List[str]) -> str:
    """Formater des lignes avec préfixe diff; (prefix,lines)->str."""
    return "".join(f"{prefix}{l}" for l in lines)

# ===== AIDE / IDEMPOTENCE =====
def _is_comment_or_blank(s: str) -> bool:
    """Détecter ligne vide ou commentaire (#...); s->bool."""
    t = (s or "").lstrip()
    return (not t) or t.startswith("#")

def _compact_noncomment(lines: List[str]) -> List[str]:
    """Filtrer commentaires et lignes vides; lines->lines."""
    return [ln for ln in lines if not _is_comment_or_blank(ln)]

def _is_safe_insertion_point(old_lines: List[str], idx: int) -> bool:
    """Vérifier qu'un point d'insertion est syntaxiquement sûr (évite zones dangereuses: après signature, dans return, etc); (lines,idx)->bool."""
    if idx <= 0 or idx >= len(old_lines):
        return True
    
    prev_line = old_lines[idx - 1].strip()
    curr_line = old_lines[idx].strip() if idx < len(old_lines) else ""
    
    if prev_line.endswith(":"):
        return False
    
    if curr_line.startswith(("def ", "class ", "@")):
        return False
    
    if prev_line.startswith("return [") or prev_line == "return [":
        return False
    
    if idx >= 2:
        prev2_line = old_lines[idx - 2].strip()
        if prev2_line.endswith(":") and not prev_line:
            return False
    
    return True

def _emit_grep_hint_for_minus(old_path: str, g_minus: List[str]) -> None:
    """Imprimer et exécuter un grep d'aide (contexte) pour toutes les lignes '-'; path,lines->None."""
    try:
        pats: List[str] = []
        for x in g_minus:
            s = (x or "").rstrip("\n")
            if s.strip():
                pats.append(s)
        if not pats:
            return
        args: List[str] = ["grep", "-n", "-H", "-C10", "-F"]
        for p in pats:
            args += ["-e", p]
        args += ["--", old_path]
        try:
            sys.stderr.write(f"[ASTUCE] grep contexte ({len(pats)} motif(s)) dans: {old_path}\n")
            proc = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out = proc.stdout.decode(errors="replace")
            err = proc.stderr.decode(errors="replace")
            if out and out.strip():
                sys.stderr.write(out)
            if err and err.strip():
                sys.stderr.write(err)
        except Exception as e2:
            sys.stderr.write(f"[WARN] grep échoué: {e2}\n")
    except Exception as e:
        sys.stderr.write(f"[WARN] grep_hint erreur: {e}\n")

# ===== CONSTRUCTION DIFF POUR UN GROUPE =====
def _build_single_group_diff(old_hdr: str, new_hdr: str, old_lines: List[str], context_before: List[str], g_minus: List[str], g_plus: List[str], context_after: List[str], search_from: int, old_path: str = "") -> Tuple[str, int, bool]:
    """Construire diff unifié minimal pour un seul groupe (contexte_before, minus, plus, contexte_after); retourne (diff_text, new_search_from, already_applied); (headers,lines,context,group,start,path)->(str,int,bool)."""
    out_chunks: List[str] = []
    out_chunks.append(f"--- {old_hdr}\n")
    out_chunks.append(f"+++ {new_hdr}\n")

    if not g_minus and not g_plus:
        return "", search_from, True

    if not g_minus and g_plus:
        g_plus_code = _compact_noncomment(g_plus)
        if g_plus_code and find_contiguous_block(old_lines, g_plus_code, start_from=0) is not None:
            return "", search_from, True

        start_idx: Optional[int] = None
        
        if context_after:
            first_after_line = context_after[0].strip() if context_after else ""
            if first_after_line.startswith(("def ", "class ", "@")):
                after_idx = find_contiguous_block(old_lines, context_after, start_from=search_from)
                if after_idx is None:
                    after_idx = find_contiguous_block(old_lines, context_after, start_from=0)
                if after_idx is not None:
                    if after_idx > 0 and old_lines[after_idx - 1].strip() == "":
                        start_idx = after_idx
                    else:
                        start_idx = after_idx
        
        if start_idx is None and (context_before or context_after):
            best_idx = find_best_context_match(old_lines, context_before, context_after, search_from)
            if best_idx is not None:
                candidate_idx = best_idx
                
                if context_before:
                    last_context = context_before[-1].strip() if context_before else ""
                    if last_context.endswith(":"):
                        while candidate_idx < len(old_lines) and old_lines[candidate_idx].strip():
                            candidate_idx += 1
                
                if candidate_idx < len(old_lines):
                    next_line = old_lines[candidate_idx].strip()
                    if next_line.startswith("def ") or next_line.startswith("class "):
                        start_idx = candidate_idx
                    else:
                        if _is_safe_insertion_point(old_lines, candidate_idx):
                            start_idx = candidate_idx
                        else:
                            safe_idx = candidate_idx
                            while safe_idx < len(old_lines) and not _is_safe_insertion_point(old_lines, safe_idx):
                                safe_idx += 1
                            if safe_idx < len(old_lines):
                                start_idx = safe_idx
                            else:
                                safe_idx = candidate_idx - 1
                                while safe_idx > 0 and not _is_safe_insertion_point(old_lines, safe_idx):
                                    safe_idx -= 1
                                start_idx = max(0, safe_idx)
                else:
                    start_idx = candidate_idx
            else:
                if context_after:
                    sys.stderr.write("[ERREUR] Impossible de trouver le contexte d'ancrage (before+after non adjacents).\n")
                    if context_before:
                        sys.stderr.write(f"Contexte avant (première ligne): {context_before[0][:60]}...\n")
                    if context_after:
                        sys.stderr.write(f"Contexte après (première ligne): {context_after[0][:60]}...\n")
                    sys.stderr.write("Les lignes de contexte avant et après doivent être adjacentes dans le fichier.\n")
                    raise RuntimeError("context mismatch")
                
                best_idx = find_best_context_match(old_lines, context_before, context_after, 0)
                if best_idx is not None:
                    start_idx = best_idx

        if start_idx is None:
            start_idx = min(search_from, len(old_lines))

        ctx_start = max(0, start_idx - CONTEXT_LINES_BEFORE)
        ctx_end = min(len(old_lines), start_idx + CONTEXT_LINES_AFTER)
        
        lines_before_ctx = old_lines[ctx_start:start_idx]
        lines_after_ctx = old_lines[start_idx:ctx_end]
        
        old_count = len(lines_before_ctx) + len(lines_after_ctx)
        new_count = len(lines_before_ctx) + len(g_plus) + len(lines_after_ctx)
        
        out_chunks.append(f"@@ -{ctx_start+1},{old_count} +{ctx_start+1},{new_count} @@\n")
        out_chunks.extend(["-" + l for l in lines_before_ctx])
        out_chunks.extend(["-" + l for l in lines_after_ctx])
        out_chunks.extend(["+" + l for l in lines_before_ctx])
        out_chunks.extend(["+" + l for l in g_plus])
        out_chunks.extend(["+" + l for l in lines_after_ctx])
        
        new_search = start_idx + len(g_plus)
        return "".join(out_chunks), new_search, False

    if g_minus and not g_plus:
        start_idx = find_contiguous_block(old_lines, g_minus, start_from=search_from)
        if start_idx is None:
            start_idx0 = find_contiguous_block(old_lines, g_minus, start_from=0)
            if start_idx0 is not None:
                start_idx = start_idx0
            else:
                sys.stderr.write("[ERREUR] Bloc '-' non trouvé pour suppression (groupe scindé).\n")
                sys.stderr.write("Bloc attendu:\n" + format_lines("-", g_minus))
                _emit_grep_hint_for_minus(old_path, g_minus)
                raise RuntimeError("minus block not found")
        out_chunks.append(f"@@ -{start_idx+1},{len(g_minus)} +{start_idx+1},0 @@\n")
        out_chunks.extend(["-" + l for l in g_minus])
        return "".join(out_chunks), start_idx, False

    if g_minus and g_plus:
        start_idx = find_contiguous_block(old_lines, g_minus, start_from=search_from)
        if start_idx is None:
            start_idx0 = find_contiguous_block(old_lines, g_minus, start_from=0)
            if start_idx0 is not None:
                start_idx = start_idx0
            else:
                if find_contiguous_block(old_lines, g_plus, start_from=0) is not None:
                    return "", search_from, True
                g_plus_code = _compact_noncomment(g_plus)
                if g_plus_code and find_contiguous_block(old_lines, g_plus_code, start_from=0) is not None:
                    return "", search_from, True
                sys.stderr.write("[ERREUR] Bloc '-' non trouvé pour remplacement (groupe scindé).\n")
                sys.stderr.write("Bloc attendu:\n" + format_lines("-", g_minus))
                _emit_grep_hint_for_minus(old_path, g_minus)
                raise RuntimeError("minus block not found")
        out_chunks.append(f"@@ -{start_idx+1},{len(g_minus)} +{start_idx+1},{len(g_plus)} @@\n")
        out_chunks.extend(["-" + l for l in g_minus])
        out_chunks.extend(["+" + l for l in g_plus])
        return "".join(out_chunks), start_idx + len(g_minus), False

    return "", search_from, True

# ===== WRAPPERS PATCH =====
def _patch_base_args(diff_text: str) -> List[str]:
    """Construire les arguments de base pour patch -p0 (et -d / si chemins absolus); text->args."""
    patch_bin = shutil.which("patch") or "patch"
    base = [patch_bin, "-p0", "--batch"]
    if any(line.startswith(("--- /", "+++ /")) for line in diff_text.splitlines()):
        base += ["-d", "/"]
    return base

def _apply_diff_text(diff_text: str) -> Tuple[int, str, str]:
    """Exécuter patch --dry-run puis patch; text->(rc,stdout,stderr)."""
    with tempfile.NamedTemporaryFile("w+", delete=False) as tmp:
        tmp.write(diff_text)
        tmp_path = tmp.name
    try:
        base_args = _patch_base_args(diff_text)
        dry = base_args + ["--dry-run", "-i", tmp_path]
        p1 = subprocess.run(dry, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if p1.returncode != 0:
            return p1.returncode, p1.stdout.decode(errors="replace"), p1.stderr.decode(errors="replace")
        p2 = subprocess.run(base_args + ["-i", tmp_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return p2.returncode, p2.stdout.decode(errors="replace"), p2.stderr.decode(errors="replace")
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass

# ===== BACKUP / RESTORE =====
def backup_file_once(src: str, backups: Dict[str, str]) -> None:
    """Créer une sauvegarde horodatée unique si absente; (src,backups)->None."""
    if src in backups:
        return
    ts = __import__("datetime").datetime.now().strftime("%Y%m%dT%H%M%S")
    dst = f"{src}.{ts}"
    try:
        shutil.copy2(src, dst)
        backups[src] = dst
        print(f"[BACKUP] {src} -> {dst}")
    except Exception as e:
        sys.stderr.write(f"[WARN] Sauvegarde échouée pour {src}: {e}\n")

def restore_from_backup(src: str, backups: Dict[str, str]) -> None:
    """Restaurer un fichier depuis sa sauvegarde si existante; (src,backups)->None."""
    bak = backups.get(src)
    if not bak:
        return
    try:
        shutil.copy2(bak, src)
        print(f"[ROLLBACK] Restauration: {bak} -> {src}")
    except Exception as e:
        sys.stderr.write(f"[WARN] Échec restauration {src} depuis {bak}: {e}\n")

# ===== APPLICATION SEQUENTIELLE PAR FICHIER =====
def apply_file_sequential(file_entry: Dict) -> int:
    """Appliquer séquentiellement les groupes d'un fichier pour éviter 'misordered hunks' avec validation syntaxique et pré-division des déplacements; entry->rc."""
    old_hdr, new_hdr = file_entry["old"], file_entry["new"]
    old_path = normalize_old_path(old_hdr)

    is_creation = bool(file_entry.get("is_creation"))
    try:
        current_lines = [] if is_creation else read_file_lines(old_path)
    except FileNotFoundError:
        sys.stderr.write(f"[ERREUR] Fichier source introuvable: {old_path}\n")
        return 1

    # Collecter tous les groupes de tous les hunks
    all_groups: List[Tuple[List[str], List[str], List[str], List[str]]] = []
    for hk in file_entry.get("hunks") or []:
        all_groups.extend(split_groups_with_context(hk))
    if not all_groups:
        return 0

    # FIX #11: Pré-diviser les groupes de déplacement (g_minus ≈ g_plus)
    all_groups = _split_move_groups(all_groups)

    backups: Dict[str, str] = {}
    search_from = 0
    old_exists_before = os.path.exists(old_path)

    for gi in range(len(all_groups)):
        try:
            context_before, g_minus, g_plus, context_after = all_groups[gi]
            diff_text, new_search, already = _build_single_group_diff(
                old_hdr, new_hdr, current_lines, context_before, g_minus, g_plus, context_after, search_from, old_path
            )
        except RuntimeError:
            return 1

        if not diff_text:
            if already:
                print("[INFO] Groupe déjà appliqué: skip.")
                continue
            else:
                continue

        if old_exists_before and not backups:
            backup_file_once(old_path, backups)

        rc, out, err = _apply_diff_text(diff_text)
        if rc != 0:
            sys.stderr.write("==== ERREUR patch (hunk séquentiel) ====\n")
            sys.stderr.write(out)
            sys.stderr.write(err)
            sys.stderr.write("=> ROLLBACK fichier en cours…\n")
            if backups:
                restore_from_backup(old_path, backups)
            if (not old_exists_before) and os.path.exists(old_path):
                try:
                    os.remove(old_path)
                    print(f"[ROLLBACK] Suppression fichier créé: {old_path}")
                except Exception as e:
                    sys.stderr.write(f"[WARN] Échec suppression {old_path}: {e}\n")
            sys.stderr.write("=======================================\n")
            return rc

        if not _validate_python_syntax(old_path):
            sys.stderr.write("==== ERREUR SYNTAXE détectée après patch ====\n")
            sys.stderr.write(f"=> ROLLBACK fichier: {old_path}\n")
            if backups:
                restore_from_backup(old_path, backups)
            if (not old_exists_before) and os.path.exists(old_path):
                try:
                    os.remove(old_path)
                    print(f"[ROLLBACK] Suppression fichier créé: {old_path}")
                except Exception as e:
                    sys.stderr.write(f"[WARN] Échec suppression {old_path}: {e}\n")
            sys.stderr.write("============================================\n")
            return 1

        try:
            current_lines = read_file_lines(old_path)
        except FileNotFoundError:
            current_lines = []

        search_from = new_search

    return 0

# ===== PILOTAGE GLOBAL =====
def apply_all(files: List[Dict]) -> int:
    """Appliquer séquentiellement tous les fichiers; files->rc global."""
    for fe in files:
        rc = apply_file_sequential(fe)
        if rc != 0:
            return rc
    return 0

# ===== MAIN =====
stdin_text = sys.stdin.read()
if not stdin_text.strip():
    sys.stderr.write("Aucun diff reçu sur STDIN.\n")
    sys.exit(1)

files = parse_diff(stdin_text.splitlines(keepends=True))
if not files:
    sys.stderr.write("Diff invalide ou vide.\n")
    sys.exit(1)

_normalize_devnull_headers(files)

rc = apply_all(files)
if rc != 0:
    sys.exit(rc)

sys.stdout.write("\n" * 10)
sys.stdout.flush()
