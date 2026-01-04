---
title: "Concurrence et parallélisme"
order: 6.02
parent: "06-performance-runtime.md"
tags: ["python", "concurrence", "parallelisme", "threading", "multiprocessing"]
---

# 14. Concurrence et parallélisme

Python offre plusieurs mécanismes pour gérer la concurrence et le parallélisme : threading, multiprocessing et concurrent.futures.

## Vue d'ensemble

Cette section explore :

- **Concurrence (I/O)** : Threads et GIL, asyncio vs threads, frameworks async web
- **Parallélisme (CPU)** : multiprocessing, process pools, partage mémoire, sérialisation inter-process
- `threading` : Threads pour la concurrence
- `multiprocessing` : Processus pour le parallélisme
- `concurrent.futures` : API unifiée pour threads et processus
- Cas d'usage CPU vs I/O : Choisir la bonne approche

## Concepts clés

Comprendre la différence entre concurrence et parallélisme, et savoir quand utiliser threads vs processus, est essentiel pour optimiser les performances.
