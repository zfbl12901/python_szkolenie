---
title: "RAG (Retrieval Augmented Generation)"
order: 25
parent: "20-ia-introduction.md"
tags: ["python", "ia", "rag", "llm", "qdrant", "embeddings"]
---

# RAG (Retrieval Augmented Generation)

## Introduction

Le **RAG (Retrieval Augmented Generation)** combine la recherche d'information avec la génération de texte. Au lieu de laisser le LLM répondre uniquement avec ses connaissances d'entraînement, le RAG lui fournit un contexte pertinent depuis une base de connaissances.

## Pourquoi RAG ?

### Problèmes sans RAG

- **Connaissances figées** : Le LLM ne connaît que ce sur quoi il a été entraîné
- **Hallucinations** : Le modèle peut inventer des informations
- **Pas de sources** : Difficile de vérifier les réponses

### Avantages du RAG

- **Connaissances à jour** : Peut utiliser des documents récents
- **Réponses précises** : Basées sur des sources réelles
- **Traçabilité** : On sait d'où viennent les informations
- **Personnalisation** : Utilise votre propre base de connaissances

## Architecture RAG

```
┌─────────────┐
│  Question   │
│ Utilisateur │
└──────┬──────┘
       │
┌──────▼──────────┐
│  Génération     │
│  Embedding      │
│  de la question │
└──────┬──────────┘
       │
┌──────▼──────────┐
│  Recherche dans │
│  Base          │
│  Vectorielle    │
└──────┬──────────┘
       │
┌──────▼──────────┐
│  Documents      │
│  Pertinents     │
└──────┬──────────┘
       │
┌──────▼──────────┐
│  Construction   │
│  du Contexte   │
└──────┬──────────┘
       │
┌──────▼──────────┐
│  LLM génère     │
│  Réponse avec   │
│  Contexte       │
└──────┬──────────┘
       │
┌──────▼──────┐
│  Réponse    │
│  Finale     │
└─────────────┘
```

## Implémentation complète

### 1. Système RAG simple

```python
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from sentence_transformers import SentenceTransformer
from openai import OpenAI
import os

class RAGSimple:
    def __init__(self):
        # Initialisation des composants
        self.embedding_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        self.llm_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.qdrant_client = QdrantClient(host="localhost", port=6333)
        self.collection_name = "documents_rag"
        
        # Créer la collection si elle n'existe pas
        self._creer_collection()
    
    def _creer_collection(self):
        """Crée la collection Qdrant si elle n'existe pas"""
        try:
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=384,  # Dimension des embeddings
                    distance=Distance.COSINE
                )
            )
        except Exception:
            pass  # Collection existe déjà
    
    def indexer_document(self, doc_id, texte, metadonnees=None):
        """Indexe un document dans la base vectorielle"""
        # Générer l'embedding
        embedding = self.embedding_model.encode(texte).tolist()
        
        # Créer le point
        point = PointStruct(
            id=doc_id,
            vector=embedding,
            payload={
                "texte": texte,
                **(metadonnees or {})
            }
        )
        
        # Ajouter à Qdrant
        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=[point]
        )
    
    def rechercher_contexte(self, question, top_k=3):
        """Recherche les documents pertinents pour une question"""
        # Générer l'embedding de la question
        embedding_question = self.embedding_model.encode(question).tolist()
        
        # Rechercher dans Qdrant
        resultats = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=embedding_question,
            limit=top_k
        )
        
        return resultats
    
    def generer_reponse(self, question, top_k=3):
        """Génère une réponse en utilisant le RAG"""
        # 1. Rechercher le contexte pertinent
        resultats = self.rechercher_contexte(question, top_k)
        
        # 2. Construire le contexte
        contexte = "\n\n".join([
            f"Document {i+1}:\n{r.payload['texte']}"
            for i, r in enumerate(resultats)
        ])
        
        # 3. Construire le prompt avec contexte
        prompt = f"""
Tu es un assistant qui répond aux questions en te basant uniquement sur le contexte fourni.

Contexte:
{contexte}

Question: {question}

Instructions:
- Réponds uniquement en te basant sur le contexte
- Si l'information n'est pas dans le contexte, dis-le clairement
- Cite les documents utilisés quand c'est pertinent
"""
        
        # 4. Générer la réponse avec le LLM
        response = self.llm_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Tu es un assistant précis et utile."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3  # Basse température pour des réponses précises
        )
        
        return {
            "reponse": response.choices[0].message.content,
            "sources": [
                {
                    "texte": r.payload["texte"],
                    "score": r.score
                }
                for r in resultats
            ]
        }

# Utilisation
rag = RAGSimple()

# Indexer des documents
rag.indexer_document(1, "Python est un langage de programmation interprété, de haut niveau.")
rag.indexer_document(2, "Les listes Python sont des structures de données mutables qui peuvent contenir différents types.")
rag.indexer_document(3, "Les fonctions Python peuvent retourner plusieurs valeurs en utilisant des tuples.")

# Poser une question
resultat = rag.generer_reponse("Comment utiliser les listes Python ?")
print("Réponse:", resultat["reponse"])
print("\nSources utilisées:")
for i, source in enumerate(resultat["sources"], 1):
    print(f"{i}. Score: {source['score']:.2f}")
    print(f"   {source['texte']}")
```

### 2. RAG avec chunking de documents

Pour les documents longs, il faut les diviser en chunks :

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

class RAGAvance:
    def __init__(self):
        self.embedding_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        self.llm_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.qdrant_client = QdrantClient(host="localhost", port=6333)
        self.collection_name = "documents_rag_chunks"
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        self._creer_collection()
    
    def indexer_document_long(self, doc_id, texte, metadonnees=None):
        """Indexe un document long en le divisant en chunks"""
        # Diviser en chunks
        chunks = self.text_splitter.split_text(texte)
        
        # Indexer chaque chunk
        points = []
        for i, chunk in enumerate(chunks):
            embedding = self.embedding_model.encode(chunk).tolist()
            
            point = PointStruct(
                id=f"{doc_id}_{i}",
                vector=embedding,
                payload={
                    "texte": chunk,
                    "doc_id": doc_id,
                    "chunk_index": i,
                    **(metadonnees or {})
                }
            )
            points.append(point)
        
        # Ajouter tous les chunks
        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=points
        )
    
    def generer_reponse(self, question, top_k=5):
        """Génère une réponse avec contexte des chunks"""
        # Rechercher les chunks pertinents
        embedding_question = self.embedding_model.encode(question).tolist()
        resultats = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=embedding_question,
            limit=top_k
        )
        
        # Construire le contexte
        contexte = "\n\n".join([
            f"Chunk {i+1} (Document {r.payload.get('doc_id', 'N/A')}):\n{r.payload['texte']}"
            for i, r in enumerate(resultats)
        ])
        
        # Générer la réponse
        response = self.llm_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Tu réponds en te basant sur le contexte fourni."},
                {"role": "user", "content": f"Contexte:\n{contexte}\n\nQuestion: {question}"}
            ],
            temperature=0.3
        )
        
        return response.choices[0].message.content
```

### 3. RAG avec filtrage

```python
from qdrant_client.models import Filter, FieldCondition, MatchValue

class RAGFiltre:
    def rechercher_avec_filtre(self, question, categorie=None, top_k=3):
        """Recherche avec filtre sur les métadonnées"""
        embedding_question = self.embedding_model.encode(question).tolist()
        
        # Construire le filtre
        query_filter = None
        if categorie:
            query_filter = Filter(
                must=[
                    FieldCondition(
                        key="categorie",
                        match=MatchValue(value=categorie)
                    )
                ]
            )
        
        # Rechercher
        resultats = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=embedding_question,
            query_filter=query_filter,
            limit=top_k
        )
        
        return resultats
```

## Améliorations avancées

### 1. Re-ranking

Réordonner les résultats pour améliorer la pertinence :

```python
from sentence_transformers import CrossEncoder

class RAGRerank:
    def __init__(self):
        self.embedding_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        self.reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
    
    def rechercher_avec_rerank(self, question, top_k=10, rerank_k=3):
        """Recherche avec re-ranking"""
        # Recherche initiale (plus de résultats)
        embedding = self.embedding_model.encode(question).tolist()
        resultats = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=embedding,
            limit=top_k
        )
        
        # Re-ranking
        pairs = [
            [question, r.payload["texte"]]
            for r in resultats
        ]
        scores = self.reranker.predict(pairs)
        
        # Trier par score de re-ranking
        resultats_rerank = sorted(
            zip(resultats, scores),
            key=lambda x: x[1],
            reverse=True
        )[:rerank_k]
        
        return [r[0] for r in resultats_rerank]
```

### 2. Hybride : Mots-clés + Sémantique

Combiner recherche par mots-clés et recherche sémantique :

```python
class RAGHybride:
    def rechercher_hybride(self, question, top_k=5):
        """Recherche hybride : mots-clés + sémantique"""
        # Recherche sémantique
        embedding = self.embedding_model.encode(question).tolist()
        resultats_semantique = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=embedding,
            limit=top_k * 2
        )
        
        # Recherche par mots-clés (exemple simplifié)
        mots_cles = question.lower().split()
        # Ici, vous pourriez faire une recherche full-text
        
        # Combiner et dédupliquer
        resultats_combines = {}
        for r in resultats_semantique:
            resultats_combines[r.id] = r
        
        # Retourner les top_k
        return list(resultats_combines.values())[:top_k]
```

## Bonnes pratiques

### ✅ À faire

- Diviser les documents longs en chunks
- Utiliser un overlap entre chunks pour le contexte
- Filtrer par métadonnées quand pertinent
- Tester différents top_k pour trouver le bon équilibre
- Valider que le contexte est pertinent

### ❌ À éviter

- Chunks trop petits (perte de contexte)
- Chunks trop grands (moins précis)
- Ne pas utiliser de métadonnées
- Ignorer la qualité des embeddings
- Ne pas valider les réponses

## Cas d'usage

### 1. Assistant de documentation

```python
# Indexer la documentation Python
rag.indexer_document(1, "Les listes Python...")
rag.indexer_document(2, "Les fonctions Python...")

# Questions sur la documentation
reponse = rag.generer_reponse("Comment créer une liste en Python ?")
```

### 2. Chatbot avec connaissances

```python
# Indexer les connaissances de l'entreprise
rag.indexer_document(1, "Politique de l'entreprise...")
rag.indexer_document(2, "Procédures...")

# Chatbot qui répond avec ces connaissances
reponse = rag.generer_reponse("Quelle est la politique de télétravail ?")
```

### 3. Système de Q&A

```python
# Indexer des FAQ
rag.indexer_document(1, "Q: Comment installer Python ? A: ...")
rag.indexer_document(2, "Q: Qu'est-ce qu'une fonction ? A: ...")

# Répondre aux questions
reponse = rag.generer_reponse("Comment installer Python ?")
```

## Ressources

- **LangChain RAG** : https://python.langchain.com/docs/use_cases/question_answering
- **Qdrant RAG** : https://qdrant.tech/articles/rag
- **Exemples** : https://github.com/langchain-ai/langchain/tree/master/templates
