---
title: "Typage statique optionnel"
order: 5.01
parent: "05-typage-qualite-robustesse.md"
tags: ["python", "typage", "typing", "type-hints"]
---

# 10. Typage statique optionnel

Python supporte le typage statique optionnel via les annotations de type, permettant d'améliorer la qualité du code sans perdre la flexibilité du langage.

## Vue d'ensemble

Cette section couvre :

- `typing` : Le module standard pour le typage
- `Optional`, `Union` : Types optionnels et unions
- `TypedDict` : Dictionnaires typés
- `Protocol` : Typage structurel
- `MyPy`, `Pyright` : Outils de vérification de type

## Concepts clés

Le typage statique optionnel permet de documenter le code, d'améliorer l'IDE et de détecter des erreurs avant l'exécution, tout en restant compatible avec le code non typé.
