# Formation en Ligne - Plateforme d'Apprentissage

Plateforme d'apprentissage en ligne moderne pour la programmation, construite avec Angular 17.

## 🚀 Fonctionnalités

- 📚 Navigation hiérarchique des articles
- 🔍 Recherche avancée avec filtres
- 🌓 Mode sombre/clair
- 📱 Interface responsive
- 💾 Mode hors-ligne avec cache
- 📄 Export PDF/Markdown
- 🔄 Mode de comparaison d'articles
- 📊 Dashboard avec statistiques

## 🛠️ Technologies

- **Angular 17** - Framework frontend
- **TypeScript** - Langage de programmation
- **SCSS** - Préprocesseur CSS
- **Marked** - Parser Markdown
- **Prism.js** - Coloration syntaxique
- **RxJS** - Programmation réactive

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start

# Build de production
npm run build:prod
```

## 🚀 Déploiement

### GitHub Pages

Le projet est configuré pour être déployé automatiquement sur GitHub Pages via GitHub Actions.

1. Activez GitHub Pages dans les paramètres de votre repository :
   - Allez dans Settings > Pages
   - Source : GitHub Actions

2. Le workflow se déclenche automatiquement à chaque push sur `main` ou `master`

3. L'application sera disponible à : `https://[votre-username].github.io/[nom-du-repo]/`

### Configuration du baseHref

Si votre repository n'est pas à la racine de votre compte GitHub, modifiez le `base-href` dans `package.json` :

```json
"build:prod": "ng build --configuration production --base-href /nom-du-repo/"
```

## 📝 Structure du projet

```
src/
├── app/
│   ├── core/
│   │   └── services/      # Services Angular
│   ├── features/          # Composants de fonctionnalités
│   └── app.component.*    # Composant racine
├── assets/
│   └── content/           # Fichiers Markdown
└── styles.scss            # Styles globaux
```

## 📄 Format des articles

Les articles sont des fichiers Markdown avec frontmatter YAML :

```yaml
---
title: Titre de l'article
order: 1
parent: slug-du-parent
tags: [tag1, tag2]
---

Contenu de l'article en Markdown...
```

## 🔧 Développement

```bash
# Serveur de développement
npm start

# Build avec watch
npm run watch

# Tests
npm test
```

## 📋 Gestion des fichiers Python

La sidebar se met à jour automatiquement en fonction des fichiers présents dans `src/assets/content/Python/`. 

Pour régénérer l'index des fichiers Python après avoir ajouté ou supprimé des fichiers :

```bash
npm run generate-python-index
```

Ce script scanne le répertoire `src/assets/content/Python/` et génère un fichier `files-index.json` qui liste tous les fichiers `.md` présents. La sidebar utilise automatiquement ce fichier pour afficher les articles disponibles.

## 📄 Licence

Ce projet est privé.
