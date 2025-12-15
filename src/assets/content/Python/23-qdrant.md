---
title: "Qdrant - Base de Données Vectorielle"
order: 23
parent: "20-ia-introduction.md"
tags: ["python", "ia", "qdrant", "vector-db", "similarity-search"]
---

# Qdrant - Base de Données Vectorielle

## Introduction

Qdrant est une base de données vectorielle open-source optimisée pour la recherche par similarité. Elle permet de stocker des embeddings et de rechercher rapidement des vecteurs similaires.

## Pourquoi Qdrant ?

- **Performance** : Recherche ultra-rapide même avec des millions de vecteurs
- **Scalabilité** : Gère de grandes quantités de données
- **Filtrage** : Recherche avec métadonnées
- **Open-source** : Gratuit et modifiable

## Installation

### Installation du serveur

```bash
# Avec Docker (recommandé)
docker run -p 6333:6333 qdrant/qdrant

# Ou télécharger depuis https://qdrant.tech/documentation/guides/installation
```

### Installation du client Python

```bash
pip install qdrant-client
```

## Concepts de base

### Collection

Une **collection** est un groupe de vecteurs avec la même dimension.

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

# Connexion au serveur
client = QdrantClient(host="localhost", port=6333)

# Créer une collection
client.create_collection(
    collection_name="ma_collection",
    vectors_config=VectorParams(
        size=384,  # Dimension des embeddings
        distance=Distance.COSINE  # Métrique de distance
    )
)
```

### Points

Un **point** est un vecteur avec un ID et optionnellement des métadonnées.

```python
from qdrant_client.models import PointStruct

# Créer un point
point = PointStruct(
    id=1,
    vector=[0.1, 0.2, 0.3, ...],  # Embedding de 384 dimensions
    payload={
        "texte": "Python est un langage de programmation",
        "categorie": "programmation"
    }
)

# Ajouter le point à la collection
client.upsert(
    collection_name="ma_collection",
    points=[point]
)
```

## Cas d'usage pratiques

### 1. Stockage et recherche de documents

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer

# Initialisation
client = QdrantClient(host="localhost", port=6333)
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Créer la collection si elle n'existe pas
try:
    client.create_collection(
        collection_name="documents",
        vectors_config=VectorParams(
            size=384,
            distance=Distance.COSINE
        )
    )
except Exception:
    pass  # Collection existe déjà

# Documents à indexer
documents = [
    {"id": 1, "texte": "Python est un langage de programmation"},
    {"id": 2, "texte": "Les listes Python sont mutables"},
    {"id": 3, "texte": "Les fonctions Python peuvent retourner plusieurs valeurs"}
]

# Générer les embeddings et ajouter à Qdrant
points = []
for doc in documents:
    embedding = model.encode(doc["texte"]).tolist()
    point = PointStruct(
        id=doc["id"],
        vector=embedding,
        payload={"texte": doc["texte"]}
    )
    points.append(point)

# Ajouter tous les points
client.upsert(collection_name="documents", points=points)

# Recherche
requete = "Comment utiliser Python ?"
embedding_requete = model.encode(requete).tolist()

resultats = client.search(
    collection_name="documents",
    query_vector=embedding_requete,
    limit=3
)

for resultat in resultats:
    print(f"Score: {resultat.score:.2f}")
    print(f"Texte: {resultat.payload['texte']}")
    print()
```

### 2. Recherche avec filtres

```python
from qdrant_client.models import Filter, FieldCondition, MatchValue

# Recherche avec filtre sur les métadonnées
resultats = client.search(
    collection_name="documents",
    query_vector=embedding_requete,
    query_filter=Filter(
        must=[
            FieldCondition(
                key="categorie",
                match=MatchValue(value="programmation")
            )
        ]
    ),
    limit=5
)
```

### 3. Système de recommandation

```python
class SystemeRecommandation:
    def __init__(self):
        self.client = QdrantClient(host="localhost", port=6333)
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        self.collection = "articles"
    
    def indexer_article(self, article_id, contenu, metadonnees=None):
        """Indexe un article"""
        embedding = self.model.encode(contenu).tolist()
        
        point = PointStruct(
            id=article_id,
            vector=embedding,
            payload={
                "contenu": contenu,
                **(metadonnees or {})
            }
        )
        
        self.client.upsert(
            collection_name=self.collection,
            points=[point]
        )
    
    def recommander(self, article_id, top_k=5):
        """Recommandation basée sur la similarité"""
        # Récupérer l'article actuel
        article = self.client.retrieve(
            collection_name=self.collection,
            ids=[article_id]
        )[0]
        
        # Rechercher des articles similaires
        resultats = self.client.search(
            collection_name=self.collection,
            query_vector=article.vector,
            limit=top_k + 1  # +1 pour exclure l'article actuel
        )
        
        # Filtrer l'article actuel
        recommandations = [r for r in resultats if r.id != article_id][:top_k]
        
        return [
            {
                "id": r.id,
                "score": r.score,
                "contenu": r.payload["contenu"]
            }
            for r in recommandations
        ]

# Utilisation
reco = SystemeRecommandation()
reco.indexer_article(1, "Introduction à Python", {"categorie": "débutant"})
reco.indexer_article(2, "Les listes en Python", {"categorie": "débutant"})
reco.indexer_article(3, "Les fonctions Python", {"categorie": "intermédiaire"})

recommandations = reco.recommander(article_id=1, top_k=2)
for rec in recommandations:
    print(f"Article {rec['id']}: {rec['contenu']} (score: {rec['score']:.2f})")
```

## Intégration avec RAG

```python
class RAGQdrant:
    def __init__(self):
        self.client = QdrantClient(host="localhost", port=6333)
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        self.collection = "documents_rag"
    
    def indexer_document(self, doc_id, texte, metadonnees=None):
        """Indexe un document pour le RAG"""
        embedding = self.model.encode(texte).tolist()
        
        point = PointStruct(
            id=doc_id,
            vector=embedding,
            payload={
                "texte": texte,
                **(metadonnees or {})
            }
        )
        
        self.client.upsert(
            collection_name=self.collection,
            points=[point]
        )
    
    def rechercher_contexte(self, question, top_k=3):
        """Recherche le contexte pertinent pour une question"""
        embedding_question = self.model.encode(question).tolist()
        
        resultats = self.client.search(
            collection_name=self.collection,
            query_vector=embedding_question,
            limit=top_k
        )
        
        # Construire le contexte
        contexte = "\n\n".join([
            r.payload["texte"] for r in resultats
        ])
        
        return contexte

# Utilisation avec LLM
from openai import OpenAI

rag = RAGQdrant()
rag.indexer_document(1, "Python est un langage de programmation...")
rag.indexer_document(2, "Les listes Python sont des structures...")

# Rechercher le contexte
contexte = rag.rechercher_contexte("Comment utiliser les listes Python ?")

# Utiliser avec un LLM
client = OpenAI()
reponse = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "Tu réponds en te basant sur le contexte fourni."},
        {"role": "user", "content": f"Contexte:\n{contexte}\n\nQuestion: Comment utiliser les listes Python ?"}
    ]
)

print(reponse.choices[0].message.content)
```

## Gestion des collections

### Lister les collections

```python
collections = client.get_collections()
for collection in collections.collections:
    print(collection.name)
```

### Informations sur une collection

```python
info = client.get_collection("ma_collection")
print(f"Points: {info.points_count}")
print(f"Vectors config: {info.config.params.vectors}")
```

### Supprimer une collection

```python
client.delete_collection("ma_collection")
```

## Bonnes pratiques

### ✅ À faire

- Utiliser des métadonnées pour le filtrage
- Choisir la bonne métrique de distance (COSINE pour la plupart des cas)
- Indexer les documents par batch
- Utiliser des filtres pour affiner les recherches

### ❌ À éviter

- Ne pas utiliser de métadonnées (perte de flexibilité)
- Ignorer la dimension des embeddings
- Indexer un par un (lent)

## Ressources

- **Documentation** : https://qdrant.tech/documentation
- **GitHub** : https://github.com/qdrant/qdrant
- **Exemples** : https://github.com/qdrant/qdrant/tree/master/examples
