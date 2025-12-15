---
title: "Introduction à Qdrant et les Vecteurs"
order: 5
parent: "20-ia-introduction.md"
tags: ["python", "ia", "qdrant", "vecteurs", "embedding"]
---

# Introduction à Qdrant et les Vecteurs

Qdrant est une base de données vectorielle open-source, parfaite pour les applications d'IA nécessitant des recherches par similarité.

## Qu'est-ce qu'un vecteur ?

Un vecteur est une représentation numérique d'un objet (texte, image, etc.) dans un espace multidimensionnel. En IA, on utilise souvent des **embeddings** pour convertir des données en vecteurs.

## Pourquoi Qdrant ?

- **Recherche par similarité** : Trouve des éléments similaires rapidement
- **Haute performance** : Optimisé pour les recherches vectorielles
- **Intégration LLM** : Parfait pour les applications avec des modèles de langage
- **API Python** : Facile à utiliser depuis Python

## Installation

```bash
pip install qdrant-client
```

## Premier exemple

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

# Connexion à Qdrant (local)
client = QdrantClient("localhost", port=6333)

# Créer une collection
client.create_collection(
    collection_name="ma_collection",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
)
```

## Cas d'usage

- **Recherche sémantique** : Trouver des documents similaires
- **Recommandations** : Systèmes de recommandation basés sur la similarité
- **RAG (Retrieval Augmented Generation)** : Améliorer les réponses des LLM
- **Déduplication** : Trouver des contenus dupliqués


