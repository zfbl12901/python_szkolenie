---
title: "Embeddings et Représentations Vectorielles"
order: 22
parent: "20-ia-introduction.md"
tags: ["python", "ia", "embeddings", "vectors", "nlp"]
---

# Embeddings et Représentations Vectorielles

## Qu'est-ce qu'un embedding ?

Un **embedding** est une représentation numérique d'un texte sous forme de vecteur. Les embeddings capturent le sens sémantique : deux textes similaires auront des vecteurs proches dans l'espace vectoriel.

### Exemple conceptuel

```python
# Texte 1 : "Le chat mange"
# Texte 2 : "Le félin se nourrit"
# Ces deux textes ont des embeddings similaires (proches)

# Texte 3 : "Python est un langage de programmation"
# Ce texte aura un embedding très différent
```

## Pourquoi les embeddings ?

Les embeddings permettent de :

- **Recherche sémantique** : Trouver des textes similaires par sens, pas par mots-clés
- **Recommandations** : Recommander du contenu similaire
- **Classification** : Classer des textes par similarité
- **RAG** : Trouver des documents pertinents pour un LLM

## Bibliothèques populaires

### 1. Sentence Transformers (Recommandé)

Bibliothèque simple et efficace pour générer des embeddings.

#### Installation

```bash
pip install sentence-transformers
```

#### Utilisation de base

```python
from sentence_transformers import SentenceTransformer

# Charger un modèle
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Générer des embeddings
textes = [
    "Le chat mange",
    "Le félin se nourrit",
    "Python est un langage de programmation"
]

embeddings = model.encode(textes)

print(f"Shape des embeddings: {embeddings.shape}")
# Output: (3, 384) - 3 textes, 384 dimensions

# Calculer la similarité
from sklearn.metrics.pairwise import cosine_similarity

similarite = cosine_similarity([embeddings[0]], [embeddings[1]])
print(f"Similarité entre texte 1 et 2: {similarite[0][0]:.2f}")
# Output: ~0.85 (très similaire)
```

### 2. OpenAI Embeddings

Embeddings via l'API OpenAI.

#### Installation

```bash
pip install openai
```

#### Utilisation

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def generer_embedding_openai(texte):
    """Génère un embedding avec OpenAI"""
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=texte
    )
    return np.array(response.data[0].embedding)

# Utilisation
embedding = generer_embedding_openai("Python est un langage de programmation")
print(f"Dimension: {len(embedding)}")
# Output: 1536 dimensions
```

### 3. Hugging Face Transformers

Pour plus de contrôle et de personnalisation.

```python
from transformers import AutoTokenizer, AutoModel
import torch

# Charger le modèle
tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')

def generer_embedding_hf(texte):
    """Génère un embedding avec Hugging Face"""
    inputs = tokenizer(texte, return_tensors='pt', padding=True, truncation=True)
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Moyenner les embeddings des tokens (pooling)
    embedding = outputs.last_hidden_state.mean(dim=1).squeeze()
    
    return embedding.numpy()

# Utilisation
embedding = generer_embedding_hf("Python est un langage de programmation")
print(f"Dimension: {len(embedding)}")
```

## Cas d'usage pratiques

### 1. Recherche sémantique

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class RechercheSemantique:
    def __init__(self, documents):
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        self.documents = documents
        self.embeddings = self.model.encode(documents)
    
    def rechercher(self, requete, top_k=5):
        """Recherche les documents les plus similaires"""
        # Générer l'embedding de la requête
        embedding_requete = self.model.encode([requete])
        
        # Calculer les similarités
        similarites = cosine_similarity(embedding_requete, self.embeddings)[0]
        
        # Obtenir les top_k indices
        indices = np.argsort(similarites)[::-1][:top_k]
        
        # Retourner les résultats
        resultats = []
        for idx in indices:
            resultats.append({
                "document": self.documents[idx],
                "score": float(similarites[idx])
            })
        
        return resultats

# Utilisation
documents = [
    "Python est un langage de programmation interprété",
    "Les listes Python sont des structures de données mutables",
    "Les fonctions Python peuvent retourner plusieurs valeurs",
    "Le chat est un animal domestique",
    "Les décorateurs Python modifient le comportement des fonctions"
]

recherche = RechercheSemantique(documents)
resultats = recherche.rechercher("Comment utiliser les fonctions Python ?", top_k=3)

for resultat in resultats:
    print(f"Score: {resultat['score']:.2f} - {resultat['document']}")
```

### 2. Système de recommandation

```python
class SystemeRecommandation:
    def __init__(self, articles):
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        self.articles = articles
        self.embeddings = self.model.encode([a['contenu'] for a in articles])
    
    def recommander(self, article_id, top_k=5):
        """Recommandation basée sur la similarité"""
        # Trouver l'embedding de l'article actuel
        idx = next(i for i, a in enumerate(self.articles) if a['id'] == article_id)
        embedding_actuel = self.embeddings[idx]
        
        # Calculer les similarités
        similarites = cosine_similarity([embedding_actuel], self.embeddings)[0]
        
        # Exclure l'article actuel et obtenir les top_k
        similarites[idx] = -1  # Exclure l'article actuel
        indices = np.argsort(similarites)[::-1][:top_k]
        
        return [self.articles[i] for i in indices]

# Utilisation
articles = [
    {"id": 1, "contenu": "Introduction à Python"},
    {"id": 2, "contenu": "Les listes en Python"},
    {"id": 3, "contenu": "Les fonctions Python"},
    {"id": 4, "contenu": "Les décorateurs Python"},
    {"id": 5, "contenu": "La programmation orientée objet en Python"}
]

reco = SystemeRecommandation(articles)
recommandations = reco.recommander(article_id=1, top_k=3)

for article in recommandations:
    print(f"Recommandé: {article['contenu']}")
```

### 3. Clustering de documents

```python
from sklearn.cluster import KMeans

def clusteriser_documents(documents, n_clusters=3):
    """Groupe des documents similaires"""
    model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
    embeddings = model.encode(documents)
    
    # Clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    clusters = kmeans.fit_predict(embeddings)
    
    # Organiser par cluster
    resultats = {}
    for i, cluster_id in enumerate(clusters):
        if cluster_id not in resultats:
            resultats[cluster_id] = []
        resultats[cluster_id].append(documents[i])
    
    return resultats

# Utilisation
documents = [
    "Python est un langage de programmation",
    "Java est un langage orienté objet",
    "Les chats sont des animaux",
    "Les chiens sont des animaux domestiques",
    "Les listes Python sont mutables"
]

clusters = clusteriser_documents(documents, n_clusters=2)
for cluster_id, docs in clusters.items():
    print(f"\nCluster {cluster_id}:")
    for doc in docs:
        print(f"  - {doc}")
```

## Mesure de similarité

### Cosine Similarity (Recommandé)

Mesure l'angle entre deux vecteurs (0 = identique, 1 = orthogonal).

```python
from sklearn.metrics.pairwise import cosine_similarity

def similarite_cosine(embedding1, embedding2):
    """Calcule la similarité cosinus entre deux embeddings"""
    return cosine_similarity([embedding1], [embedding2])[0][0]

# Exemple
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
emb1 = model.encode("Le chat mange")
emb2 = model.encode("Le félin se nourrit")
emb3 = model.encode("Python est un langage")

print(f"Chat/Félin: {similarite_cosine(emb1, emb2):.2f}")  # ~0.85
print(f"Chat/Python: {similarite_cosine(emb1, emb3):.2f}")  # ~0.10
```

### Distance euclidienne

```python
from scipy.spatial.distance import euclidean

def distance_euclidienne(embedding1, embedding2):
    """Calcule la distance euclidienne"""
    return euclidean(embedding1, embedding2)

# Plus la distance est petite, plus c'est similaire
distance = distance_euclidienne(emb1, emb2)
print(f"Distance: {distance:.2f}")
```

## Optimisation

### Batch processing

```python
# ✅ BON : Traiter plusieurs textes en une fois
embeddings = model.encode(textes, batch_size=32)

# ❌ MAUVAIS : Boucle sur chaque texte
embeddings = [model.encode(texte) for texte in textes]
```

### Mise en cache

```python
import pickle
import hashlib

cache = {}

def embedding_avec_cache(texte, model):
    """Génère un embedding avec cache"""
    # Créer un hash du texte
    texte_hash = hashlib.md5(texte.encode()).hexdigest()
    
    if texte_hash in cache:
        return cache[texte_hash]
    
    embedding = model.encode(texte)
    cache[texte_hash] = embedding
    
    return embedding

# Sauvegarder le cache
def sauvegarder_cache(cache, fichier="embeddings_cache.pkl"):
    with open(fichier, 'wb') as f:
        pickle.dump(cache, f)
```

## Bonnes pratiques

### ✅ À faire

- Utiliser Sentence Transformers pour la plupart des cas
- Traiter les textes par batch pour la performance
- Normaliser les embeddings si nécessaire
- Choisir le bon modèle selon le cas d'usage

### ❌ À éviter

- Ne pas traiter les textes un par un (lent)
- Ignorer la normalisation si nécessaire
- Utiliser des modèles trop grands pour des tâches simples

## Modèles recommandés

- **`paraphrase-MiniLM-L6-v2`** : Rapide, bon pour la plupart des cas
- **`all-mpnet-base-v2`** : Plus performant, plus lent
- **`text-embedding-ada-002`** : OpenAI, très performant (payant)

## Prochaines étapes

Maintenant que vous maîtrisez les embeddings :

1. Découvrez **Qdrant** pour stocker et rechercher des embeddings
2. Apprenez le **RAG** pour combiner embeddings et LLM
3. Explorez les **techniques avancées** de recherche vectorielle
