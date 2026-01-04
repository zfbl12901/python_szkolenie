---
title: "Anti-patterns d'architecture"
order: 15.02
parent: "15-anti-patterns-python.md"
tags: ["python", "anti-patterns", "architecture", "coupling", "exceptions", "global-state"]
---

# Anti-patterns d'architecture

Les anti-patterns d'architecture affectent la structure globale de l'application et rendent le code difficile à maintenir et tester.

## Vue d'ensemble

Cette section explore :

- **Tight coupling entre modules** : Réduit la réutilisabilité
- **Magic numbers / hardcoding** : Préférer constantes ou configs
- **Ignoring exceptions (except: pass)** : Crash silencieux et debugging impossible
- **Overusing global state** : Fuite de dépendances, difficile à tester

## Concepts clés

Les anti-patterns d'architecture créent des problèmes à long terme qui sont difficiles à corriger une fois le code en production.
