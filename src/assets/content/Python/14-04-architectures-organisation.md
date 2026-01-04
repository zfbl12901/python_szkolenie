---
title: "Architectures et organisation"
order: 14.04
parent: "14-design-patterns-architectures.md"
tags: ["python", "architecture", "monolithe", "microservices", "clean-architecture", "mvc"]
---

# Architectures et organisation

Les architectures définissent la structure globale d'une application et l'organisation du code.

## Vue d'ensemble

Cette section explore :

- **Monolithes modulaires** : Package/module + __init__.py
- **Clean architecture / hexagonal** : Domain / Application / Interface
- **Microservices** : Avec FastAPI ou Flask, souvent accompagné de message queues (RabbitMQ, Kafka)
- **Event-driven** : Via asyncio ou Celery pour tâches asynchrones
- **Layered / MVC** : Django suit un pattern similaire à MVC mais adapté Python

## Concepts clés

Choisir la bonne architecture dépend de la taille du projet, de l'équipe et des contraintes techniques.
