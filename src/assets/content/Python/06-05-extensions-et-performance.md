---
title: "Quand Python n'est pas suffisant"
order: 6.05
parent: "06-performance-runtime.md"
tags: ["python", "extensions", "cython", "c", "rust", "go", "performance"]
---

# Quand Python n'est pas suffisant

Parfois, Python seul n'est pas suffisant pour atteindre les performances requises. Les extensions C, Cython, NumPy, PyPy et l'offloading vers d'autres langages offrent des solutions.

## Vue d'ensemble

Cette section explore :

- **C extensions** : Écrire des extensions en C pour Python
- **Cython** : Compiler du code Python-like en C
- **NumPy (vectorisation)** : Utiliser la vectorisation pour les calculs numériques
- **PyPy** : Interpréteur Python alternatif avec JIT
- **Offloading (Rust / C / Go)** : Déléguer des parties critiques à d'autres langages

## Concepts clés

Comprendre quand et comment utiliser des extensions ou d'autres langages permet d'atteindre des performances maximales tout en conservant la productivité de Python pour le reste du code.
