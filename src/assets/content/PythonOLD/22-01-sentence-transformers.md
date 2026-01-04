---
title: "Sentence Transformers"
order: 1
parent: "22-embeddings.md"
tags: ["python", "ia", "embeddings", "sentence-transformers"]
---

# Sentence Transformers

## Introduction

Sentence Transformers est une bibliothèque Python qui permet de générer facilement des embeddings de haute qualité pour des phrases, paragraphes et documents. Elle est construite sur PyTorch et utilise des modèles pré-entraînés optimisés pour la similarité sémantique.

### Pourquoi Sentence Transformers ?

| Avantage | Description |
|----------|-------------|
| **Simplicité** | API très simple et intuitive |
| **Performance** | Modèles optimisés pour la similarité |
| **Multilingue** | Support de nombreuses langues |
| **Fine-tuning** | Possibilité d'entraîner sur vos données |
| **Gratuit** | Open source, pas d'API payante |
| **Local** | Fonctionne hors ligne |

### Comparaison avec d'autres solutions

| Solution | Avantages | Inconvénients |
|----------|-----------|---------------|
| **Sentence Transformers** | Gratuit, local, simple | Nécessite GPU pour gros volumes |
| **OpenAI Embeddings** | Très performant, géré | Payant, nécessite internet |
| **Hugging Face** | Flexible, nombreux modèles | Plus complexe à utiliser |

## Installation

### Installation de base

```bash
pip install sentence-transformers
```

### Avec support GPU (optionnel)

```bash
# Si vous avez un GPU NVIDIA
pip install sentence-transformers[gpu]

# Ou avec CUDA
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install sentence-transformers
```

### Vérification

```python
from sentence_transformers import SentenceTransformer

# Tester l'installation
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
print("✅ Sentence Transformers installé avec succès!")
```

## Utilisation de base

### Premier exemple

```python
from sentence_transformers import SentenceTransformer
import numpy as np

# Charger un modèle pré-entraîné
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Textes à encoder
textes = [
    "Le chat mange dans le jardin",
    "Le félin se nourrit à l'extérieur",
    "Python est un langage de programmation populaire"
]

# Générer les embeddings
embeddings = model.encode(textes)

print(f"Shape: {embeddings.shape}")
# Output: (3, 384) - 3 textes, 384 dimensions par embedding

print(f"Type: {type(embeddings)}")
# Output: <class 'numpy.ndarray'>

# Afficher le premier embedding
print(f"Premier embedding (5 premières dimensions): {embeddings[0][:5]}")
```

### Encodage d'un seul texte

```python
# Encoder un seul texte
texte = "Python est un langage de programmation"
embedding = model.encode(texte)

print(f"Dimension: {embedding.shape}")
# Output: (384,)
```

### Encodage avec options

```python
# Options d'encodage
embeddings = model.encode(
    textes,
    batch_size=32,           # Traiter par batch
    show_progress_bar=True,  # Afficher la barre de progression
    convert_to_numpy=True,   # Retourner un numpy array
    normalize_embeddings=True # Normaliser les vecteurs
)
```

## Modèles disponibles

### Modèles recommandés par cas d'usage

#### 1. Modèles rapides (petites applications)

```python
# MiniLM - Rapide et efficace
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
# Dimensions: 384
# Vitesse: ⚡⚡⚡
# Qualité: ⭐⭐⭐

# all-MiniLM - Multilingue
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
# Dimensions: 384
# Support: Multilingue
```

#### 2. Modèles équilibrés (usage général)

```python
# MPNet - Bon équilibre
model = SentenceTransformer('all-mpnet-base-v2')
# Dimensions: 768
# Vitesse: ⚡⚡
# Qualité: ⭐⭐⭐⭐

# DistilRoBERTa - Bon compromis
model = SentenceTransformer('all-distilroberta-v1')
# Dimensions: 768
# Vitesse: ⚡⚡
# Qualité: ⭐⭐⭐⭐
```

#### 3. Modèles performants (qualité maximale)

```python
# MPNet large - Meilleure qualité
model = SentenceTransformer('all-mpnet-base-v2')
# Dimensions: 768
# Vitesse: ⚡
# Qualité: ⭐⭐⭐⭐⭐

# Multilingual - Support multilingue
model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')
# Dimensions: 768
# Support: 50+ langues
```

### Comparaison des modèles

```python
import time
from sentence_transformers import SentenceTransformer

textes = ["Python est un langage de programmation"] * 100

modeles = {
    'MiniLM': 'paraphrase-MiniLM-L6-v2',
    'MPNet': 'all-mpnet-base-v2',
    'DistilRoBERTa': 'all-distilroberta-v1'
}

for nom, modele_id in modeles.items():
    model = SentenceTransformer(modele_id)
    
    start = time.time()
    embeddings = model.encode(textes)
    duree = time.time() - start
    
    print(f"{nom}: {duree:.2f}s - Shape: {embeddings.shape}")
```

## Calcul de similarité

### Similarité cosinus

```python
from sentence_transformers import SentenceTransformer, util
import numpy as np

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Textes à comparer
texte1 = "Le chat mange dans le jardin"
texte2 = "Le félin se nourrit à l'extérieur"
texte3 = "Python est un langage de programmation"

# Encoder les textes
embeddings = model.encode([texte1, texte2, texte3])

# Calculer la similarité cosinus
similarite_12 = util.cos_sim(embeddings[0], embeddings[1])
similarite_13 = util.cos_sim(embeddings[0], embeddings[2])

print(f"Similarité chat/félin: {similarite_12.item():.3f}")
# Output: ~0.85 (très similaire)

print(f"Similarité chat/Python: {similarite_13.item():.3f}")
# Output: ~0.10 (très différent)
```

### Recherche de similarité

```python
# Corpus de documents
corpus = [
    "Python est un langage de programmation interprété",
    "Les listes Python sont des structures de données mutables",
    "Les fonctions Python peuvent retourner plusieurs valeurs",
    "Le chat est un animal domestique",
    "Les décorateurs Python modifient le comportement des fonctions"
]

# Requête
requete = "Comment utiliser les fonctions en Python ?"

# Encoder le corpus et la requête
corpus_embeddings = model.encode(corpus)
requete_embedding = model.encode(requete)

# Trouver les documents les plus similaires
similarites = util.cos_sim(requete_embedding, corpus_embeddings)[0]

# Obtenir les top 3
top_k = 3
indices = np.argsort(similarites)[::-1][:top_k]

print(f"\nTop {top_k} documents similaires:")
for idx in indices:
    print(f"  Score: {similarites[idx]:.3f} - {corpus[idx]}")
```

## Recherche sémantique complète

### Classe de recherche sémantique

```python
from sentence_transformers import SentenceTransformer, util
import numpy as np
from typing import List, Dict

class RechercheSemantique:
    """Système de recherche sémantique avec Sentence Transformers"""
    
    def __init__(self, model_name='paraphrase-MiniLM-L6-v2'):
        """Initialiser avec un modèle"""
        self.model = SentenceTransformer(model_name)
        self.documents = []
        self.embeddings = None
    
    def indexer(self, documents: List[str]):
        """Indexer une liste de documents"""
        self.documents = documents
        print(f"Indexation de {len(documents)} documents...")
        self.embeddings = self.model.encode(
            documents,
            show_progress_bar=True,
            batch_size=32
        )
        print("✅ Indexation terminée!")
    
    def rechercher(self, requete: str, top_k: int = 5) -> List[Dict]:
        """Rechercher les documents les plus similaires"""
        if self.embeddings is None:
            raise ValueError("Aucun document indexé. Appelez indexer() d'abord.")
        
        # Encoder la requête
        requete_embedding = self.model.encode(requete)
        
        # Calculer les similarités
        similarites = util.cos_sim(requete_embedding, self.embeddings)[0]
        
        # Obtenir les top_k
        indices = np.argsort(similarites)[::-1][:top_k]
        
        # Construire les résultats
        resultats = []
        for idx in indices:
            resultats.append({
                'document': self.documents[idx],
                'score': float(similarites[idx]),
                'index': int(idx)
            })
        
        return resultats
    
    def rechercher_avec_seuil(self, requete: str, seuil: float = 0.5) -> List[Dict]:
        """Rechercher avec un seuil de similarité minimum"""
        if self.embeddings is None:
            raise ValueError("Aucun document indexé.")
        
        requete_embedding = self.model.encode(requete)
        similarites = util.cos_sim(requete_embedding, self.embeddings)[0]
        
        # Filtrer par seuil
        indices = np.where(similarites >= seuil)[0]
        
        resultats = []
        for idx in indices:
            resultats.append({
                'document': self.documents[idx],
                'score': float(similarites[idx]),
                'index': int(idx)
            })
        
        # Trier par score décroissant
        resultats.sort(key=lambda x: x['score'], reverse=True)
        
        return resultats

# Utilisation
documents = [
    "Python est un langage de programmation interprété",
    "Les listes Python sont des structures de données mutables",
    "Les fonctions Python peuvent retourner plusieurs valeurs",
    "Le chat est un animal domestique",
    "Les décorateurs Python modifient le comportement des fonctions",
    "Les dictionnaires Python stockent des paires clé-valeur"
]

recherche = RechercheSemantique()
recherche.indexer(documents)

# Recherche
resultats = recherche.rechercher("Comment utiliser les fonctions Python ?", top_k=3)

print("\nRésultats de la recherche:")
for i, resultat in enumerate(resultats, 1):
    print(f"{i}. Score: {resultat['score']:.3f}")
    print(f"   {resultat['document']}\n")
```

## Traitement par batch

### Optimisation des performances

```python
# ❌ LENT : Traiter un par un
embeddings = []
for texte in textes:
    embedding = model.encode(texte)
    embeddings.append(embedding)

# ✅ RAPIDE : Traiter par batch
embeddings = model.encode(textes, batch_size=32)

# ✅ ENCORE MIEUX : Avec normalisation
embeddings = model.encode(
    textes,
    batch_size=32,
    normalize_embeddings=True,  # Normaliser pour similarité cosinus
    show_progress_bar=True
)
```

### Gestion de grandes collections

```python
def encoder_grande_collection(textes, model, batch_size=32):
    """Encoder une grande collection de textes"""
    embeddings = []
    
    # Traiter par batch
    for i in range(0, len(textes), batch_size):
        batch = textes[i:i + batch_size]
        batch_embeddings = model.encode(
            batch,
            show_progress_bar=True,
            convert_to_numpy=True
        )
        embeddings.append(batch_embeddings)
    
    # Concaténer tous les batches
    return np.vstack(embeddings)

# Utilisation
textes = ["Texte " + str(i) for i in range(10000)]
embeddings = encoder_grande_collection(textes, model, batch_size=64)
print(f"Shape finale: {embeddings.shape}")
```

## Normalisation des embeddings

### Pourquoi normaliser ?

```python
# Sans normalisation
emb1 = model.encode("Python")
emb2 = model.encode("Python")

# Avec normalisation
emb1_norm = model.encode("Python", normalize_embeddings=True)
emb2_norm = model.encode("Python", normalize_embeddings=True)

# La similarité cosinus est plus rapide avec des vecteurs normalisés
# car cos_sim(a, b) = dot(a, b) si ||a|| = ||b|| = 1
```

### Normalisation manuelle

```python
import numpy as np

def normaliser(embeddings):
    """Normaliser des embeddings (norme L2 = 1)"""
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    return embeddings / norms

embeddings = model.encode(textes)
embeddings_norm = normaliser(embeddings)

# Vérifier
norms = np.linalg.norm(embeddings_norm, axis=1)
print(f"Normes après normalisation: {norms[:5]}")
# Output: [1. 1. 1. 1. 1.]
```

## Fine-tuning (entraînement personnalisé)

### Préparer les données

```python
from sentence_transformers import InputExample
from sentence_transformers import losses
from torch.utils.data import DataLoader

# Données d'entraînement (paires similaires)
train_examples = [
    InputExample(texts=['Python est un langage', 'Python est un langage de programmation'], label=1.0),
    InputExample(texts=['Le chat mange', 'Le félin se nourrit'], label=0.9),
    InputExample(texts=['Python est un langage', 'Le chat mange'], label=0.1),
]

# DataLoader
train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=16)
```

### Entraîner le modèle

```python
from sentence_transformers import SentenceTransformer, losses

# Charger un modèle de base
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Définir la fonction de perte
train_loss = losses.CosineSimilarityLoss(model)

# Entraîner
model.fit(
    train_objectives=[(train_dataloader, train_loss)],
    epochs=4,
    warmup_steps=100,
    output_path='./mon-modele-finetune'
)

# Sauvegarder
model.save('./mon-modele-finetune')
```

### Charger un modèle fine-tuné

```python
# Charger le modèle fine-tuné
model = SentenceTransformer('./mon-modele-finetune')

# Utiliser comme d'habitude
embeddings = model.encode(textes)
```

## Cas d'usage avancés

### 1. Clustering de documents

```python
from sklearn.cluster import KMeans
import numpy as np

def clusteriser_documents(documents, n_clusters=3, model_name='paraphrase-MiniLM-L6-v2'):
    """Grouper des documents similaires"""
    model = SentenceTransformer(model_name)
    
    # Encoder les documents
    embeddings = model.encode(documents, show_progress_bar=True)
    
    # Clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(embeddings)
    
    # Organiser par cluster
    resultats = {}
    for i, cluster_id in enumerate(clusters):
        if cluster_id not in resultats:
            resultats[cluster_id] = []
        resultats[cluster_id].append({
            'document': documents[i],
            'index': i
        })
    
    return resultats, kmeans

# Utilisation
documents = [
    "Python est un langage de programmation",
    "Java est un langage orienté objet",
    "Les chats sont des animaux",
    "Les chiens sont des animaux domestiques",
    "Les listes Python sont mutables",
    "Les tableaux Java ont une taille fixe"
]

clusters, kmeans = clusteriser_documents(documents, n_clusters=2)

for cluster_id, docs in clusters.items():
    print(f"\nCluster {cluster_id}:")
    for doc in docs:
        print(f"  - {doc['document']}")
```

### 2. Détection de duplicatas

```python
def detecter_duplicatas(documents, seuil=0.95):
    """Détecter les documents dupliqués ou très similaires"""
    model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
    embeddings = model.encode(documents, normalize_embeddings=True)
    
    # Calculer toutes les paires de similarités
    similarites = util.cos_sim(embeddings, embeddings)
    
    # Trouver les paires au-dessus du seuil
    duplicatas = []
    for i in range(len(documents)):
        for j in range(i + 1, len(documents)):
            if similarites[i][j] >= seuil:
                duplicatas.append({
                    'doc1': documents[i],
                    'doc2': documents[j],
                    'similarite': float(similarites[i][j])
                })
    
    return duplicatas

# Utilisation
documents = [
    "Python est un langage de programmation",
    "Python est un langage de programmation",  # Duplicata exact
    "Python est un langage de programmation populaire",  # Très similaire
    "Le chat mange dans le jardin"
]

duplicatas = detecter_duplicatas(documents, seuil=0.9)
for dup in duplicatas:
    print(f"Similarité: {dup['similarite']:.3f}")
    print(f"  Doc1: {dup['doc1']}")
    print(f"  Doc2: {dup['doc2']}\n")
```

### 3. Recommandation de contenu

```python
class SystemeRecommandation:
    """Système de recommandation basé sur la similarité sémantique"""
    
    def __init__(self, articles, model_name='paraphrase-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
        self.articles = articles
        self.embeddings = self.model.encode(
            [a['contenu'] for a in articles],
            normalize_embeddings=True
        )
    
    def recommander(self, article_id, top_k=5):
        """Recommandation basée sur la similarité"""
        # Trouver l'index de l'article
        idx = next(i for i, a in enumerate(self.articles) if a['id'] == article_id)
        
        # Calculer les similarités
        similarites = util.cos_sim(
            self.embeddings[idx:idx+1],
            self.embeddings
        )[0]
        
        # Exclure l'article actuel
        similarites[idx] = -1
        
        # Obtenir les top_k
        indices = np.argsort(similarites)[::-1][:top_k]
        
        return [
            {
                'article': self.articles[i],
                'score': float(similarites[i])
            }
            for i in indices
        ]

# Utilisation
articles = [
    {'id': 1, 'contenu': 'Introduction à Python'},
    {'id': 2, 'contenu': 'Les listes en Python'},
    {'id': 3, 'contenu': 'Les fonctions Python'},
    {'id': 4, 'contenu': 'Les décorateurs Python'},
    {'id': 5, 'contenu': 'La programmation orientée objet en Python'}
]

reco = SystemeRecommandation(articles)
recommandations = reco.recommander(article_id=1, top_k=3)

print("Recommandations:")
for rec in recommandations:
    print(f"  Score: {rec['score']:.3f} - {rec['article']['contenu']}")
```

## Optimisation et performance

### Utilisation du GPU

```python
import torch

# Vérifier si GPU disponible
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"Device: {device}")

# Charger le modèle sur GPU
model = SentenceTransformer('paraphrase-MiniLM-L6-v2', device=device)

# Encoder (sera plus rapide sur GPU)
embeddings = model.encode(textes)
```

### Mise en cache des embeddings

```python
import pickle
import hashlib
import os

class EmbeddingCache:
    """Cache pour les embeddings"""
    
    def __init__(self, cache_dir='./embeddings_cache'):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)
        self.cache = {}
        self._load_cache()
    
    def _get_hash(self, texte):
        """Générer un hash pour le texte"""
        return hashlib.md5(texte.encode('utf-8')).hexdigest()
    
    def _get_cache_path(self, texte_hash):
        """Chemin du fichier de cache"""
        return os.path.join(self.cache_dir, f"{texte_hash}.pkl")
    
    def get(self, texte):
        """Récupérer un embedding depuis le cache"""
        texte_hash = self._get_hash(texte)
        
        if texte_hash in self.cache:
            return self.cache[texte_hash]
        
        cache_path = self._get_cache_path(texte_hash)
        if os.path.exists(cache_path):
            with open(cache_path, 'rb') as f:
                embedding = pickle.load(f)
            self.cache[texte_hash] = embedding
            return embedding
        
        return None
    
    def set(self, texte, embedding):
        """Sauvegarder un embedding dans le cache"""
        texte_hash = self._get_hash(texte)
        self.cache[texte_hash] = embedding
        
        cache_path = self._get_cache_path(texte_hash)
        with open(cache_path, 'wb') as f:
            pickle.dump(embedding, f)
    
    def _load_cache(self):
        """Charger tous les fichiers de cache"""
        if not os.path.exists(self.cache_dir):
            return
        
        for filename in os.listdir(self.cache_dir):
            if filename.endswith('.pkl'):
                texte_hash = filename[:-4]
                cache_path = os.path.join(self.cache_dir, filename)
                with open(cache_path, 'rb') as f:
                    self.cache[texte_hash] = pickle.load(f)

# Utilisation avec cache
cache = EmbeddingCache()
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def encoder_avec_cache(texte):
    """Encoder avec cache"""
    # Vérifier le cache
    embedding = cache.get(texte)
    if embedding is not None:
        return embedding
    
    # Encoder et mettre en cache
    embedding = model.encode(texte)
    cache.set(texte, embedding)
    return embedding

# Premier appel : encode
emb1 = encoder_avec_cache("Python est un langage")
# Deuxième appel : depuis le cache
emb2 = encoder_avec_cache("Python est un langage")
```

## Comparaison avec d'autres modèles

### Benchmark de performance

```python
import time
from sentence_transformers import SentenceTransformer

textes = ["Python est un langage de programmation"] * 100

modeles = {
    'MiniLM-L6': 'paraphrase-MiniLM-L6-v2',
    'MPNet': 'all-mpnet-base-v2',
    'DistilRoBERTa': 'all-distilroberta-v1'
}

resultats = {}

for nom, modele_id in modeles.items():
    print(f"\nTest de {nom}...")
    model = SentenceTransformer(modele_id)
    
    # Test de vitesse
    start = time.time()
    embeddings = model.encode(textes, batch_size=32)
    duree = time.time() - start
    
    resultats[nom] = {
        'duree': duree,
        'dimensions': embeddings.shape[1],
        'vitesse': len(textes) / duree
    }
    
    print(f"  Durée: {duree:.2f}s")
    print(f"  Dimensions: {embeddings.shape[1]}")
    print(f"  Vitesse: {len(textes)/duree:.1f} textes/s")

# Afficher le résumé
print("\n" + "="*50)
print("Résumé des performances:")
for nom, stats in resultats.items():
    print(f"{nom}: {stats['vitesse']:.1f} textes/s, {stats['dimensions']}D")
```

## Bonnes pratiques

### ✅ À faire

1. **Choisir le bon modèle** : MiniLM pour vitesse, MPNet pour qualité
2. **Traiter par batch** : Toujours utiliser `batch_size`
3. **Normaliser** : `normalize_embeddings=True` pour similarité cosinus
4. **Mettre en cache** : Pour les textes répétés
5. **Utiliser GPU** : Si disponible pour gros volumes
6. **Gérer la mémoire** : Traiter par chunks pour très grandes collections

### ❌ À éviter

1. **Traiter un par un** : Très lent, utiliser batch
2. **Modèle trop gros** : Choisir selon le besoin
3. **Oublier la normalisation** : Important pour similarité
4. **Pas de cache** : Recalculer inutilement
5. **GPU inutilisé** : Vérifier `torch.cuda.is_available()`

## Ressources

- **Documentation officielle** : https://www.sbert.net/
- **Modèles disponibles** : https://www.sbert.net/docs/pretrained_models.html
- **GitHub** : https://github.com/UKPLab/sentence-transformers
- **Paper** : Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks

## Prochaines étapes

Maintenant que vous maîtrisez Sentence Transformers :

1. **Qdrant** : Stocker et rechercher efficacement les embeddings
2. **RAG** : Combiner avec des LLM pour la génération
3. **Fine-tuning** : Adapter les modèles à vos données
4. **Production** : Optimiser pour la mise en production