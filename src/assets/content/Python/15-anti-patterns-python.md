---
title: "Anti-patterns Python"
order: 15
parent: null
tags: ["python", "anti-patterns", "mauvaises-pratiques", "code-quality", "pythonic"]
---

# Anti-patterns Python

Cette section explore les anti-patterns courants en Python et comment les éviter pour écrire du code plus maintenable, performant et Pythonic.

## Vue d'ensemble

Cette section couvre :

- **Anti-patterns fréquents** : God Object, overusing inheritance, premature optimization, ignoring Pythonic idioms, overdecorating, mutable default arguments
- **Anti-patterns d'architecture** : Tight coupling, magic numbers, ignoring exceptions, overusing global state
- **Anti-patterns de concurrence** : Confondre threading et multiprocessing, bloquer l'event loop, créer des locks partout
- **Anti-patterns de packaging / DevOps** : Ignorer pyproject.toml, commiter des fichiers sensibles, déployer des scripts locaux

## Pourquoi c'est important

Reconnaître et éviter les anti-patterns permet d'écrire du code plus maintenable, testable et performant. Comprendre ce qu'il ne faut PAS faire est aussi important que de savoir ce qu'il faut faire.
