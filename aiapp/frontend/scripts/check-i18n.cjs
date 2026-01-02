#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const LOCALES_DIR = path.join(__dirname, '../public/locales/fr');

// Regex pour trouver les appels t('key') directs (pas les template literals avec ${})
const T_REGEX = /\bt\(\s*['"]([^'"$]+)['"]\s*[,)]/g;

// Regex pour trouver les clés dynamiques dans les objets (labelKey, i18nKey, etc.)
const DYNAMIC_KEY_REGEX = /(?:labelKey|i18nKey|titleKey|messageKey)\s*:\s*['"]([^'"$]+)['"]/g;

// Regex pour trouver les namespaces
const USE_TRANSLATION_REGEX = /useTranslation\(\s*['"]([^'"]+)['"]\s*\)/g;

// Récupérer les clés utilisées dans un fichier
function extractKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const keys = [];
  const namespaces = [];

  // Trouver les namespaces
  let match;
  while ((match = USE_TRANSLATION_REGEX.exec(content)) !== null) {
    namespaces.push(match[1]);
  }

  // Reset regex lastIndex
  T_REGEX.lastIndex = 0;
  DYNAMIC_KEY_REGEX.lastIndex = 0;

  // Trouver les clés directes t('key') - ignorer celles avec ${}
  while ((match = T_REGEX.exec(content)) !== null) {
    const key = match[1];
    if (!key.includes('$') && !key.includes('{')) {
      keys.push(key);
    }
  }

  // Trouver les clés dans les objets (labelKey: 'key', etc.)
  // SEULEMENT si le fichier contient un useTranslation() - sinon c'est un fichier de config
  if (namespaces.length > 0) {
    while ((match = DYNAMIC_KEY_REGEX.exec(content)) !== null) {
      const key = match[1];
      if (!key.includes('$') && !key.includes('{')) {
        keys.push(key);
      }
    }
  }

  return { namespaces, keys, filePath };
}

// Parcourir récursivement les fichiers source
function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      callback(fullPath);
    }
  });
}

// Vérifier si une clé existe dans un objet JSON
function keyExists(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== 'object') return false;
    current = current[part];
  }
  return current !== undefined;
}

// Charger tous les fichiers JSON de traduction (récursivement)
function loadAllTranslations(dir, prefix = '') {
  const translations = {};
  if (!fs.existsSync(dir)) return translations;
  
  fs.readdirSync(dir).forEach(f => {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const subPrefix = prefix ? `${prefix}/${f}` : f;
      const subTranslations = loadAllTranslations(fullPath, subPrefix);
      Object.assign(translations, subTranslations);
    } else if (f.endsWith('.json')) {
      const ns = prefix ? `${prefix}/${f.replace('.json', '')}` : f.replace('.json', '');
      try {
        translations[ns] = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      } catch (e) {
        console.log(`⚠️  Erreur parsing: ${fullPath}`);
      }
    }
  });
  return translations;
}

// Main
const translations = loadAllTranslations(LOCALES_DIR);
const allResults = [];

walkDir(SRC_DIR, (filePath) => {
  const result = extractKeysFromFile(filePath);
  // Ignorer les fichiers sans useTranslation (fichiers de config)
  if (result.namespaces.length > 0 && result.keys.length > 0) {
    allResults.push(result);
  }
});

console.log('=== Vérification des clés i18n ===\n');

let totalMissing = 0;
let totalMissingNs = 0;
const missingByFile = {};
const missingNamespaces = new Set();

allResults.forEach(({ namespaces, keys, filePath }) => {
  const ns = namespaces[0];
  const json = translations[ns];

  if (!json) {
    missingNamespaces.add(ns);
    totalMissingNs++;
    return;
  }

  keys.forEach(key => {
    if (!keyExists(json, key)) {
      // Essayer de trouver dans 'common' si différent
      if (ns !== 'common' && translations['common'] && keyExists(translations['common'], key)) {
        return;
      }
      // Essayer dans 'navigation'
      if (ns !== 'navigation' && translations['navigation'] && keyExists(translations['navigation'], key)) {
        return;
      }
      
      const relPath = path.relative(process.cwd(), filePath);
      if (!missingByFile[relPath]) missingByFile[relPath] = [];
      missingByFile[relPath].push({ key, ns });
      totalMissing++;
    }
  });
});

// Afficher les namespaces manquants
if (missingNamespaces.size > 0) {
  console.log('=== Namespaces manquants ===\n');
  [...missingNamespaces].sort().forEach(ns => {
    console.log(`   ⚠️  ${ns}.json`);
  });
  console.log('');
}

// Afficher les clés manquantes
if (Object.keys(missingByFile).length > 0) {
  console.log('=== Clés manquantes ===\n');
  Object.entries(missingByFile).forEach(([file, missing]) => {
    console.log(`📄 ${file}`);
    missing.forEach(({ key, ns }) => {
      console.log(`   ❌ ${ns}: "${key}"`);
    });
  });
}

// Résumé
console.log('\n=== Résumé ===');
if (totalMissing === 0 && missingNamespaces.size === 0) {
  console.log('✅ Toutes les clés i18n sont présentes.\n');
} else {
  if (missingNamespaces.size > 0) {
    console.log(`⚠️  ${missingNamespaces.size} namespace(s) manquant(s)`);
  }
  if (totalMissing > 0) {
    console.log(`❌ ${totalMissing} clé(s) manquante(s)`);
  }
  console.log('');
}

process.exit(totalMissing > 0 ? 1 : 0);
