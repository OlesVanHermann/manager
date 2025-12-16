#!/bin/bash
# Détecte les clés i18n manquantes dans les fichiers JSON

echo "=== Recherche des clés i18n utilisées dans le code ==="

# Extraire toutes les clés t('...') et t("...") du code
grep -rhoP "t\(['\"][\w./:-]+['\"]\)" src/ | \
  sed "s/t(['\"]//g" | sed "s/['\"])//g" | \
  sort -u > /tmp/used_keys.txt

echo "Clés trouvées dans le code: $(wc -l < /tmp/used_keys.txt)"

echo ""
echo "=== Vérification des clés manquantes par namespace ==="

# Pour chaque namespace trouvé
for ns in $(cat /tmp/used_keys.txt | grep "/" | cut -d'/' -f1-3 | sort -u); do
  json_file="public/locales/fr/${ns}.json"
  if [ -f "$json_file" ]; then
    echo ""
    echo "--- $ns ---"
    # Extraire les clés de ce namespace
    grep "^${ns}/" /tmp/used_keys.txt | sed "s|^${ns}/||" | while read key; do
      # Convertir la clé dotée en chemin jq
      jq_path=$(echo "$key" | sed 's/\./"]["/g' | sed 's/^/["/' | sed 's/$/"]/')
      result=$(jq -r "$jq_path // \"__MISSING__\"" "$json_file" 2>/dev/null)
      if [ "$result" = "__MISSING__" ] || [ "$result" = "null" ]; then
        echo "  ❌ MANQUANTE: $key"
      fi
    done
  else
    echo ""
    echo "--- $ns ---"
    echo "  ⚠️  Fichier manquant: $json_file"
  fi
done

echo ""
echo "=== Terminé ==="
