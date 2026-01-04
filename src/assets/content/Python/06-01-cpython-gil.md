---
title: "CPython et le GIL"
order: 6.01
parent: "06-performance-runtime.md"
tags: ["python", "cpython", "gil", "performance"]
---

# 13. CPython et le GIL

Le Global Interpreter Lock (GIL) est l'un des aspects les plus controversés de Python. Comprendre son fonctionnement et ses impacts est essentiel.

## Vue d'ensemble

Cette section explore :

- Fonctionnement du GIL : Comment le GIL fonctionne dans CPython
- Impacts réels : Les conséquences pratiques du GIL
- Quand s'en soucier (et quand non) : Identifier les cas où le GIL est un problème

## Concepts clés

Le GIL permet à un seul thread d'exécuter du bytecode Python à la fois, ce qui simplifie la gestion de la mémoire mais limite le parallélisme CPU.
