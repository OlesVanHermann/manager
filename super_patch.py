#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
super_patch.py – Applique des patchs "minimaux" de façon robuste, idempotente et transactionnelle par fichier; lit STDIN, accepte '***' alias de '---', tolère '+++ manquant', gère /dev/null, évite les 'misordered hunks' via application séquentielle et ANCRE correctement les groupes grâce aux lignes de CONTEXTE.

VERSION CORRIGÉE :
- FIX #1: Ancrage intelligent avec lookahead/lookbehind pour insertions pures
- FIX #2: Détection zones dangereuses (après 'def', 'return [', signatures)
- FIX #3: Capture context_after pour ancrage précis groupes mixtes
- FIX #4: Validation syntaxique Python après chaque application avec rollback
- FIX #5: Recherche contextuelle avec score de confiance (before+after)
- FIX #6: Insertion avant signature quand context_after contient def/class
- FIX #7: Ancrage strict par proximité (context_after IMMÉDIATEMENT après context_before)
- FIX #8: Pas de fallback si context_after fourni mais non trouvé
- FIX #9: Chercher TOUTES les occurrences de context_before jusqu'à trouver match avec context_after
- FIX #10: Transformation insertion pure en remplacement avec contexte étendu (3 lignes avant/après)
- FIX #11: Déplacements de lignes (g_minus ≈ g_plus) divisés en 2 passes: suppression puis insertion
- FIX #12: Flush correct quand contexte intermédiaire sépare deux blocs d'insertion
- FIX #13: Ancrage par contexte explicite — chaque section -/+ transformée en remplacement complet avec 1-3 lignes de contexte avant/après incluses dans les lignes - et +
- FIX #14: Comparaison tolérante aux espaces de début — fallback avec normalisation whitespace si match exact échoue
- FIX #15: Reconstruction précise de new_block — anchor_before/after lus depuis fichier, seul g_plus ajusté avec indent_delta
- FIX #16: Détection des patchs no-op (g_minus == g_plus) avec avertissement
- FIX #17: Affichage diff -u automatique après application pour visualiser les modifications
"""

import sys, os, re, tempfile, subprocess, shutil
from typing import List, Tuple, Optional, Dict

# ===== CONFIGURATION =====
CONTEXT_ANCHOR_MIN = 1
CONTEXT_ANCHOR_MAX = 3

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
    """Découper un hunk en groupes séquentiels (context_before, minus, plus, context_after); FIX #12: flush quand contexte intermédiaire sépare deux blocs; hunk->list tuples."""
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
            if cur_minus or cur_plus:
                cur_context_after.append(l[1:])
            else:
                if cur_context_after:
                    cur_context_before = cur_context_after.copy()
                    cur_context_after = []
                cur_context_before.append(l[1:])
        elif l.startswith("-"):
            if cur_context_after and not cur_minus and not cur_plus:
                cur_context_before = cur_context_after.copy()
                cur_context_after = []
            elif cur_plus:
                flush()
            cur_minus.append(l[1:])
        elif l.startswith("+"):
            if cur_context_after and not cur_minus and not cur_plus:
                cur_context_before = cur_context_after.copy()
                cur_context_after = []
            cur_plus.append(l[1:])
        else:
            flush()
            cur_context_before.append(l)

    flush()
    return groups

# ===== FIX #16: DÉTECTION NO-OP =====
def _is_noop_group(g_minus: List[str], g_plus: List[str]) -> bool:
    """Détecter si un groupe est un no-op (g_minus == g_plus); (minus,plus)->bool."""
    if not g_minus and not g_plus:
        return True
    if len(g_minus) != len(g_plus):
        return False
    return g_minus == g_plus

def _is_noop_group_fuzzy(g_minus: List[str], g_plus: List[str]) -> bool:
    """Détecter si un groupe est un no-op même avec différences de whitespace; (minus,plus)->bool."""
    if not g_minus and not g_plus:
        return True
    if len(g_minus) != len(g_plus):
        return False
    for m, p in zip(g_minus, g_plus):
        if m.strip() != p.strip():
            return False
    return True

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
        if _is_noop_group(g_minus, g_plus):
            result.append((ctx_before, g_minus, g_plus, ctx_after))
            continue
        
        if g_minus and g_plus:
            similarity = _lines_similarity(g_minus, g_plus)
            if similarity >= 0.5:
                result.append((ctx_before, g_minus, [], []))
                result.append(([], [], g_plus, ctx_after))
                continue
        result.append((ctx_before, g_minus, g_plus, ctx_after))
    
    return result

# ===== FIX #14: NORMALISATION WHITESPACE =====
def _normalize_line_whitespace(line: str) -> str:
    """Normaliser une ligne: préserver le contenu, normaliser les espaces de début; line->str."""
    return line.lstrip()

def _lines_match_fuzzy(haystack_lines: List[str], needle_lines: List[str]) -> bool:
    """Comparer deux listes de lignes avec tolérance whitespace au début; (h,n)->bool."""
    if len(haystack_lines) != len(needle_lines):
        return False
    for h, n in zip(haystack_lines, needle_lines):
        if _normalize_line_whitespace(h) != _normalize_line_whitespace(n):
            return False
    return True

def _compute_indent_delta(haystack_line: str, needle_line: str) -> int:
    """Calculer la différence d'indentation entre deux lignes; (h,n)->int (positif si haystack plus indenté)."""
    h_indent = len(haystack_line) - len(haystack_line.lstrip())
    n_indent = len(needle_line) - len(needle_line.lstrip())
    return h_indent - n_indent

def _adjust_lines_indent(lines: List[str], delta: int) -> List[str]:
    """Ajuster l'indentation de toutes les lignes; (lines,delta)->lines."""
    result: List[str] = []
    for l in lines:
        if delta > 0:
            result.append(" " * delta + l)
        elif delta < 0:
            current_indent = len(l) - len(l.lstrip())
            remove = min(current_indent, -delta)
            result.append(l[remove:])
        else:
            result.append(l)
    return result

# ===== RECHERCHE BLOCS =====
def find_contiguous_block(haystack: List[str], needle: List[str], start_from: int = 0) -> Optional[int]:
    """Trouver l'index de needle (contigu) dans haystack à partir de start_from (match exact); ->int|None."""
    if not needle:
        return start_from
    n = len(needle)
    for start in range(start_from, len(haystack) - n + 1):
        if haystack[start:start+n] == needle:
            return start
    return None

def find_contiguous_block_fuzzy(haystack: List[str], needle: List[str], start_from: int = 0) -> Tuple[Optional[int], int, bool]:
    """Trouver l'index de needle dans haystack avec fallback tolérant whitespace; retourne (index, indent_delta, was_fuzzy); ->tuple."""
    if not needle:
        return start_from, 0, False
    
    exact_idx = find_contiguous_block(haystack, needle, start_from)
    if exact_idx is not None:
        return exact_idx, 0, False
    
    n = len(needle)
    for start in range(start_from, len(haystack) - n + 1):
        if _lines_match_fuzzy(haystack[start:start+n], needle):
            delta = 0
            for h, ne in zip(haystack[start:start+n], needle):
                if ne.strip():
                    delta = _compute_indent_delta(h, ne)
                    break
            return start, delta, True
    
    if start_from > 0:
        for start in range(0, start_from):
            if _lines_match_fuzzy(haystack[start:start+n], needle):
                delta = 0
                for h, ne in zip(haystack[start:start+n], needle):
                    if ne.strip():
                        delta = _compute_indent_delta(h, ne)
                        break
                return start, delta, True
    
    return None, 0, False

def find_all_occurrences(haystack: List[str], needle: List[str]) -> List[int]:
    """Trouver tous les index où needle apparaît dans haystack (exact); ->list[int]."""
    if not needle:
        return []
    results: List[int] = []
    n = len(needle)
    for start in range(len(haystack) - n + 1):
        if haystack[start:start+n] == needle:
            results.append(start)
    return results

def find_all_occurrences_fuzzy(haystack: List[str], needle: List[str]) -> List[Tuple[int, int]]:
    """Trouver tous les index où needle apparaît (fuzzy); retourne list[(index, indent_delta)]; ->list[tuple]."""
    if not needle:
        return []
    results: List[Tuple[int, int]] = []
    n = len(needle)
    for start in range(len(haystack) - n + 1):
        if _lines_match_fuzzy(haystack[start:start+n], needle):
            delta = 0
            for h, ne in zip(haystack[start:start+n], needle):
                if ne.strip():
                    delta = _compute_indent_delta(h, ne)
                    break
            results.append((start, delta))
    return results

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

# ===== FIX #13 + #14 + #15 + #16: CONSTRUCTION DIFF =====
def _build_single_group_diff(old_hdr: str, new_hdr: str, old_lines: List[str], context_before: List[str], g_minus: List[str], g_plus: List[str], context_after: List[str], search_from: int, old_path: str = "") -> Tuple[str, int, bool]:
    """Construire diff unifié avec ancrage explicite, tolérance whitespace, reconstruction précise et détection no-op; retourne (diff_text, new_search_from, already_applied); (headers,lines,context,group,start,path)->(str,int,bool)."""
    
    if not g_minus and not g_plus:
        return "", search_from, True

    if _is_noop_group(g_minus, g_plus):
        sys.stderr.write(f"[WARN] Patch no-op détecté: les lignes - et + sont identiques, aucune modification.\n")
        if g_minus:
            preview = g_minus[0].rstrip()[:60]
            sys.stderr.write(f"  Première ligne: {preview}...\n")
        return "", search_from, True
    
    if _is_noop_group_fuzzy(g_minus, g_plus) and g_minus != g_plus:
        sys.stderr.write(f"[WARN] Patch quasi no-op: seul le whitespace diffère entre - et +.\n")

    anchor_before_count = min(CONTEXT_ANCHOR_MAX, max(CONTEXT_ANCHOR_MIN, len(context_before)))
    anchor_after_count = min(CONTEXT_ANCHOR_MAX, max(CONTEXT_ANCHOR_MIN, len(context_after)))
    
    anchor_before = context_before[-anchor_before_count:] if context_before else []
    anchor_after = context_after[:anchor_after_count] if context_after else []

    old_block = anchor_before + g_minus + anchor_after

    if g_plus:
        new_block_check = anchor_before + g_plus + anchor_after
        new_block_code = _compact_noncomment(new_block_check)
        if new_block_code:
            fuzzy_new = find_all_occurrences_fuzzy(old_lines, new_block_code)
            if fuzzy_new:
                return "", search_from, True
        idx, _, _ = find_contiguous_block_fuzzy(old_lines, new_block_check, 0)
        if idx is not None:
            if g_minus:
                old_idx, _, _ = find_contiguous_block_fuzzy(old_lines, old_block, 0)
                if old_idx is None:
                    return "", search_from, True

    if old_block:
        occurrences = find_all_occurrences_fuzzy(old_lines, old_block)
        indent_delta = 0
        
        if not occurrences:
            if not g_minus and anchor_before and anchor_after:
                combined = anchor_before + anchor_after
                occ_combined = find_all_occurrences_fuzzy(old_lines, combined)
                if occ_combined:
                    occurrences = occ_combined
                    old_block = combined
                    anchor_before_count = len(anchor_before)
                    anchor_after_count = len(anchor_after)
            
            if not occurrences:
                sys.stderr.write(f"[ERREUR] Bloc non trouvé pour patch.\n")
                sys.stderr.write(f"Bloc recherché ({len(old_block)} lignes):\n")
                sys.stderr.write(format_lines("  ", old_block[:10]))
                if len(old_block) > 10:
                    sys.stderr.write(f"  ... ({len(old_block) - 10} lignes supplémentaires)\n")
                if g_minus:
                    _emit_grep_hint_for_minus(old_path, g_minus)
                return "", search_from, False
        
        best_idx = None
        best_delta = 0
        for occ_idx, occ_delta in occurrences:
            if occ_idx >= search_from:
                best_idx = occ_idx
                best_delta = occ_delta
                break
        if best_idx is None and occurrences:
            best_idx, best_delta = occurrences[0]
        
        if best_idx is None:
            sys.stderr.write(f"[ERREUR] Aucune occurrence valide trouvée.\n")
            return "", search_from, False
        
        start_idx = best_idx
        indent_delta = best_delta
        
        exact_occurrences = find_all_occurrences(old_lines, old_block)
        if start_idx not in exact_occurrences:
            sys.stderr.write(f"[WARN] Match fuzzy (différence d'indentation: {indent_delta} espaces) à la ligne {start_idx + 1}\n")
        
        file_anchor_before = old_lines[start_idx:start_idx + len(anchor_before)]
        g_minus_start = start_idx + len(anchor_before)
        file_g_minus = old_lines[g_minus_start:g_minus_start + len(g_minus)] if g_minus else []
        anchor_after_start = g_minus_start + len(g_minus)
        file_anchor_after = old_lines[anchor_after_start:anchor_after_start + len(anchor_after)]
        
        old_block = file_anchor_before + file_g_minus + file_anchor_after
        adjusted_g_plus = _adjust_lines_indent(g_plus, indent_delta) if g_plus else []
        new_block = file_anchor_before + adjusted_g_plus + file_anchor_after
    else:
        start_idx = search_from
        new_block = g_plus

    out_chunks: List[str] = []
    out_chunks.append(f"--- {old_hdr}\n")
    out_chunks.append(f"+++ {new_hdr}\n")
    
    old_count = len(old_block)
    new_count = len(new_block)
    
    out_chunks.append(f"@@ -{start_idx+1},{old_count} +{start_idx+1},{new_count} @@\n")
    out_chunks.extend(["-" + l for l in old_block])
    out_chunks.extend(["+" + l for l in new_block])
    
    new_search = start_idx + len(new_block)
    return "".join(out_chunks), new_search, False

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
# FIX #17: Variable globale pour stocker les backups créés (pour diff final)
_all_backups: Dict[str, str] = {}

def backup_file_once(src: str, backups: Dict[str, str]) -> None:
    """Créer une sauvegarde horodatée unique si absente; (src,backups)->None."""
    if src in backups:
        return
    ts = __import__("datetime").datetime.now().strftime("%Y%m%dT%H%M%S")
    dst = f"{src}.{ts}"
    try:
        shutil.copy2(src, dst)
        backups[src] = dst
        _all_backups[src] = dst
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
        # Retirer du dict global si rollback
        if src in _all_backups:
            del _all_backups[src]
    except Exception as e:
        sys.stderr.write(f"[WARN] Échec restauration {src} depuis {bak}: {e}\n")

# ===== APPLICATION SEQUENTIELLE PAR FICHIER =====
def apply_file_sequential(file_entry: Dict) -> int:
    """Appliquer séquentiellement les groupes d'un fichier avec validation syntaxique et pré-division des déplacements; entry->rc."""
    old_hdr, new_hdr = file_entry["old"], file_entry["new"]
    old_path = normalize_old_path(old_hdr)

    is_creation = bool(file_entry.get("is_creation"))
    try:
        current_lines = [] if is_creation else read_file_lines(old_path)
    except FileNotFoundError:
        sys.stderr.write(f"[ERREUR] Fichier source introuvable: {old_path}\n")
        return 1

    all_groups: List[Tuple[List[str], List[str], List[str], List[str]]] = []
    for hk in file_entry.get("hunks") or []:
        all_groups.extend(split_groups_with_context(hk))
    if not all_groups:
        return 0

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

# FIX #17: Afficher diff -u pour chaque fichier modifié
for src, bak in _all_backups.items():
    if os.path.exists(src) and os.path.exists(bak):
        sys.stdout.write(f"\n")
        sys.stdout.flush()
        subprocess.run(["diff", "-u", bak, src])

sys.stdout.write("\n" * 10)
sys.stdout.flush()
