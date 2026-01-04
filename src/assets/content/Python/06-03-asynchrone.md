---
title: "Asynchrone"
order: 6.03
parent: "06-performance-runtime.md"
tags: ["python", "async", "await", "asyncio"]
---

# 15. Asynchrone

La programmation asynchrone avec `async/await` permet de gérer efficacement les opérations I/O sans bloquer l'exécution.

## Vue d'ensemble

Cette section explore :

- `async / await` : La syntaxe de la programmation asynchrone
- Event loop : Le cœur de l'exécution asynchrone
- `asyncio` : Le module standard pour l'asynchrone
- Pièges classiques : Erreurs courantes à éviter
- Comparaison avec Java reactive : Différences et similitudes

## Concepts clés

L'asynchrone permet de gérer des milliers de connexions simultanées avec un seul thread, idéal pour les applications réseau et I/O.
