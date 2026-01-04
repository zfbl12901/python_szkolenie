---
title: "Pythonic Design Patterns"
order: 14.05
parent: "14-design-patterns-architectures.md"
tags: ["python", "pythonic", "design-patterns", "idiomatic", "duck-typing"]
---

# Pythonic Design Patterns

En Python, il est important d'adapter les patterns classiques à l'idiome du langage plutôt que de copier aveuglément les patterns d'autres langages.

## Vue d'ensemble

Cette section explore :

- **Exploiter duck typing** : Moins de patterns "stricts" qu'en Java
- **Préférer les fonctions first-class** : Pour Strategy / Command
- **Utiliser context managers** : Pour Resource management → pattern RAII Pythonique

## Concepts clés

Python offre des fonctionnalités qui rendent certains patterns classiques moins nécessaires ou permettent des implémentations plus simples et idiomatiques.
