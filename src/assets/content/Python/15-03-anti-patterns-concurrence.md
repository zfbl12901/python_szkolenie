---
title: "Anti-patterns de concurrence"
order: 15.03
parent: "15-anti-patterns-python.md"
tags: ["python", "anti-patterns", "concurrence", "threading", "multiprocessing", "asyncio", "locks"]
---

# Anti-patterns de concurrence

Les anti-patterns de concurrence peuvent causer des problèmes de performance, des deadlocks et des bugs difficiles à reproduire.

## Vue d'ensemble

Cette section explore :

- **Confondre threading et multiprocessing** : Sans comprendre le GIL
- **Bloquer l'event loop asyncio** : Avec du code synchronisé
- **Créer des locks partout "au cas où"** : Deadlocks ou contention

## Concepts clés

La concurrence en Python nécessite une compréhension approfondie du GIL, de l'event loop et des mécanismes de synchronisation pour éviter les pièges.
