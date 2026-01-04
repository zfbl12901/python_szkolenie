---
title: "Contexte d'exécution"
order: 4.03
parent: "04-python-avance.md"
tags: ["python", "context", "with", "resources"]
---

# 9. Contexte d'exécution

Les context managers permettent de gérer les ressources de manière élégante et sûre, garantissant leur libération même en cas d'erreur.

## Vue d'ensemble

Cette section couvre :

- `with` : La déclaration de gestion de contexte
- Context managers : Les objets qui gèrent les contextes
- Gestion des ressources : Ouvrir/fermer, acquérir/libérer
- Création de context managers custom : Créer ses propres context managers

## Concepts clés

Les context managers garantissent que les ressources sont correctement libérées, même en cas d'exception, rendant le code plus robuste et sûr.
