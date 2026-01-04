---
title: "Anti-patterns fréquents"
order: 15.01
parent: "15-anti-patterns-python.md"
tags: ["python", "anti-patterns", "god-object", "inheritance", "optimization", "pythonic"]
---

# Anti-patterns fréquents

Les anti-patterns fréquents en Python sont souvent le résultat de mauvaises habitudes ou de transfert de patterns d'autres langages sans adaptation.

## Vue d'ensemble

Cette section explore :

- **God Object / Module** : Tout dans une seule classe ou module
- **Overusing inheritance** : Privilégier composition et mixins
- **Premature optimization** : Écrire du Cython ou du multiprocessing avant que ce soit nécessaire
- **Ignoring Pythonic idioms** : Écrire du Java en Python (getters/setters inutiles, boucles C-style)
- **Overdecorating** : Trop de décorateurs qui rendent le code illisible
- **Mutable default arguments** : Un classique qui provoque des bugs sournois

## Concepts clés

Les anti-patterns fréquents sont souvent faciles à identifier mais difficiles à corriger une fois intégrés dans le code. Mieux vaut les éviter dès le départ.
