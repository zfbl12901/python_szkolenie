---
title: "Veille Technologique"
order: 1
parent: null
tags: ["veille", "technologie", "actualites"]
---

# Veille Technologique

Bienvenue dans la section **Veille Technologique** !

Cette section contient des articles sur les dernières tendances, actualités et innovations dans le domaine du développement et des technologies.

## Comment ajouter un article

1. Créer un fichier `.md` dans ce répertoire
2. Ajouter le frontmatter avec les métadonnées :
   ```yaml
   ---
   title: "Titre de l'article"
   order: 1
   parent: null
   tags: ["tag1", "tag2"]
   ---
   ```
3. Ajouter le fichier dans `content.service.ts` dans la liste `veille_technos`

## Structure recommandée

- Utiliser des dates dans les noms de fichiers : `2024-01-15-nouvelle-technologie.md`
- Organiser par thèmes si nécessaire
- Ajouter des tags pertinents pour la recherche
