---
title: "Déploiement"
order: 13.04
parent: "13-devops-production-industrialisation.md"
tags: ["python", "deploiement", "wsgi", "asgi", "gunicorn", "uvicorn", "scaling"]
---

# Déploiement

Déployer des applications Python en production nécessite de comprendre les serveurs WSGI/ASGI et les stratégies de scaling.

## Vue d'ensemble

Cette section explore :

- **WSGI vs ASGI** : Comprendre les interfaces de serveur
- **Gunicorn / Uvicorn** : Serveurs pour applications Python
- **Scaling** : Stratégies de montée en charge
- **Health checks** : Vérifier l'état de santé des applications

## Concepts clés

Un déploiement réussi nécessite le bon serveur, une configuration appropriée et des mécanismes de monitoring.
