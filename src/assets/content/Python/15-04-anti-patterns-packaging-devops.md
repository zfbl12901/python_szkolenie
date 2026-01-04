---
title: "Anti-patterns de packaging / DevOps"
order: 15.04
parent: "15-anti-patterns-python.md"
tags: ["python", "anti-patterns", "packaging", "devops", "pyproject", "secrets", "deployment"]
---

# Anti-patterns de packaging / DevOps

Les anti-patterns de packaging et DevOps rendent les déploiements fragiles et peuvent exposer des secrets.

## Vue d'ensemble

Cette section explore :

- **Ignorer pyproject.toml ou requirements.txt** : Installations fragiles
- **Commiter des .pyc, __pycache__, ou secrets** : Dans le repo
- **Déployer des scripts locaux** : Comme si c'était une prod scalable

## Concepts clés

Les anti-patterns de packaging et DevOps créent des problèmes de maintenance, de sécurité et de déploiement à long terme.
