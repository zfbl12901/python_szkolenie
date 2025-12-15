---
title: "Génération d'Embeddings"
order: 6
parent: "22-embeddings.md"
tags: ["python", "ia", "embeddings", "nlp"]
---

# Génération d'Embeddings

Les embeddings transforment du texte (ou d'autres données) en vecteurs numériques que les modèles d'IA peuvent comprendre.

## Qu'est-ce qu'un embedding ?

Un embedding est une représentation vectorielle dense qui capture le sens sémantique d'un texte. Des textes similaires auront des embeddings proches dans l'espace vectoriel.

## Bibliothèques populaires

### Sentence Transformers

```python
from sentence_transformers import SentenceTransformer

# Charger un modèle
model = SentenceTransformer('all-MiniLM-L6-v2')

# Générer un embedding
texte = "Python est un langage de programmation"
embedding = model.encode(texte)

print(f"Dimension: {len(embedding)}")  # 384
```

### OpenAI Embeddings

```python
from openai import OpenAI

client = OpenAI(api_key="votre-cle")

response = client.embeddings.create(
    model="text-embedding-ada-002",
    input="Python est un langage de programmation"
)

embedding = response.data[0].embedding
```

### Hugging Face

```python
from transformers import AutoTokenizer, AutoModel
import torch

tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')

inputs = tokenizer("Python est un langage", return_tensors="pt")
with torch.no_grad():
    outputs = model(**inputs)
    embedding = outputs.last_hidden_state.mean(dim=1).squeeze()
```

## Utilisation avec Qdrant

```python
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct

# Générer des embeddings pour plusieurs textes
textes = [
    "Python est un langage de programmation",
    "Java est un langage orienté objet",
    "JavaScript est utilisé pour le web"
]

embeddings = [model.encode(texte) for texte in textes]

# Ajouter à Qdrant
points = [
    PointStruct(
        id=idx,
        vector=embedding.tolist(),
        payload={"texte": texte}
    )
    for idx, (embedding, texte) in enumerate(zip(embeddings, textes))
]

client.upsert(collection_name="ma_collection", points=points)
```


