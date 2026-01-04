const fs = require('fs');
const path = require('path');

const pythonDir = path.join(__dirname, '../src/assets/content/Python');
const outputFile = path.join(__dirname, '../src/assets/content/Python/files-index.json');

// Lire tous les fichiers .md dans le répertoire Python
const files = fs.readdirSync(pythonDir)
  .filter(file => file.endsWith('.md') && file !== 'files-index.json')
  .sort(); // Trier pour avoir un ordre cohérent

// Écrire le fichier index
fs.writeFileSync(outputFile, JSON.stringify(files, null, 2), 'utf8');

console.log(`✅ Index généré : ${files.length} fichiers trouvés`);
console.log(`📄 Fichier créé : ${outputFile}`);
