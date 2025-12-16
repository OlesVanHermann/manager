#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const LOCALES_DIR = path.join(__dirname, '../public/locales/fr');

// Regex pour trouver les appels t()
const T_REGEX = /\bt\(\s*['"`]([^'"`]+)['"`]/g;
const USE_TRANSLATION_REGEX = /useTranslation\(\s*['"`]([^'"`]+)['"`]\s*\)/g;

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

  // Trouver les clés
  while ((match = T_REGEX.exec(content)) !== null) {
    keys.push(match[1]);
  }

  return { namespaces, keys, filePath };
}

// Parcourir récursivement les fichiers
function walkDir(dir, callback) {
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

// Main
const allResults = [];
walkDir(SRC_DIR, (filePath) => {
  const result = extractKeysFromFile(filePath);
  if (result.keys.length > 0) {
    allResults.push(result);
  }
});

console.log('=== Clés i18n manquantes ===\n');

let totalMissing = 0;
const missingByFile = {};

allResults.forEach(({ namespaces, keys, filePath }) => {
  if (namespaces.length === 0) return;

  const ns = namespaces[0]; // Premier namespace trouvé
  const jsonPath = path.join(LOCALES_DIR, `${ns}.json`);

  if (!fs.existsSync(jsonPath)) {
    console.log(`⚠️  Fichier manquant: ${jsonPath}`);
    return;
  }

  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  keys.forEach(key => {
    if (!keyExists(json, key)) {
      const relPath = path.relative(process.cwd(), filePath);
      if (!missingByFile[relPath]) missingByFile[relPath] = [];
      missingByFile[relPath].push({ key, ns });
      totalMissing++;
    }
  });
});

Object.entries(missingByFile).forEach(([file, missing]) => {
  console.log(`\n📄 ${file}`);
  missing.forEach(({ key, ns }) => {
    console.log(`   ❌ ${ns}: "${key}"`);
  });
});

console.log(`\n=== Total: ${totalMissing} clé(s) manquante(s) ===`);
process.exit(totalMissing > 0 ? 1 : 0);
