---
title: "Patterns de création"
order: 14.01
parent: "14-design-patterns-architectures.md"
tags: ["python", "design-patterns", "creation", "singleton", "factory", "builder"]
---

# Patterns de création

Les patterns de création gèrent l'instanciation d'objets. En Python, certains patterns classiques sont moins nécessaires grâce aux fonctionnalités du langage.

## Vue d'ensemble

Cette section explore :

- **Singleton** : Rare en Python (modules + variables globales suffisent souvent)
- **Factory / Factory Method** : Pour créer des objets dynamiquement selon des paramètres
- **Builder** : Utile pour objets complexes (souvent via dataclasses et méthodes chainables)

## Concepts clés

En Python, les modules et les fonctions first-class rendent certains patterns de création moins nécessaires qu'en Java ou C++.
