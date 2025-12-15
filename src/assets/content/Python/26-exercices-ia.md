---
title: "Exercices et Projets - Intelligence Artificielle"
order: 26
parent: "20-ia-introduction.md"
tags: ["python", "exercices", "ia", "projects", "llm", "qdrant"]
---

# Exercices et Projets - Intelligence Artificielle

## Préparation

Avant de commencer, installez les dépendances :

```bash
pip install openai sentence-transformers qdrant-client numpy scikit-learn
```

Créez un fichier `.env` avec vos clés API :

```bash
OPENAI_API_KEY=votre-clé-openai
```

## Exercices LLM

### Exercice 1 : Premier chatbot avec OpenAI

**Objectif** : Créer un chatbot simple qui répond aux questions.

**Instructions** :
1. Créez une classe `ChatbotSimple` qui utilise l'API OpenAI
2. Le chatbot doit garder un historique de conversation
3. Implémentez une méthode `repondre(question)` qui retourne la réponse

**Solution de base** :

```python
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

class ChatbotSimple:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.historique = []
    
    def repondre(self, question):
        # Ajouter la question à l'historique
        self.historique.append({"role": "user", "content": question})
        
        # Appeler l'API
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Tu es un assistant Python utile."},
                *self.historique
            ]
        )
        
        reponse = response.choices[0].message.content
        self.historique.append({"role": "assistant", "content": reponse})
        
        return reponse

# Test
chatbot = ChatbotSimple()
print(chatbot.repondre("Qu'est-ce qu'une fonction lambda en Python ?"))
print(chatbot.repondre("Peux-tu me donner un exemple ?"))
```

**Améliorations à ajouter** :
- Limiter la taille de l'historique (garder seulement les 10 derniers messages)
- Gestion des erreurs (RateLimitError, etc.)
- Format de sortie plus joli

### Exercice 2 : Générateur de contenu avec prompts

**Objectif** : Créer un générateur de contenu qui utilise différents templates de prompts.

**Instructions** :
1. Créez une classe `GenerateurContenu` avec différents types de génération
2. Implémentez des méthodes pour :
   - Générer un article
   - Générer un résumé
   - Générer des idées créatives

**Solution de base** :

```python
class GenerateurContenu:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    def generer_article(self, sujet, style="professionnel", longueur=500):
        prompt = f"""
        Écris un article sur le sujet suivant :
        
        Sujet: {sujet}
        Style: {style}
        Longueur: {longueur} mots
        
        L'article doit avoir une introduction, un développement et une conclusion.
        """
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=longueur * 2
        )
        
        return response.choices[0].message.content
    
    def generer_resume(self, texte):
        prompt = f"""
        Résume ce texte en 3-5 phrases clés :
        
        {texte}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=150
        )
        
        return response.choices[0].message.content
    
    def generer_idees(self, sujet, nombre=5):
        prompt = f"""
        Génère {nombre} idées créatives sur le sujet suivant :
        
        Sujet: {sujet}
        
        Format: Liste numérotée avec une phrase par idée.
        """
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=1.2,
            max_tokens=200
        )
        
        return response.choices[0].message.content

# Test
generateur = GenerateurContenu()
print(generateur.generer_article("L'intelligence artificielle", "professionnel", 300))
print(generateur.generer_idees("Applications de l'IA", 3))
```

### Exercice 3 : Fine-tuning de prompts

**Objectif** : Créer un système qui teste et optimise différents prompts.

**Instructions** :
1. Créez une fonction qui teste plusieurs variations de prompts
2. Comparez les résultats et identifiez le meilleur prompt
3. Implémentez un système de scoring pour évaluer les réponses

**Solution de base** :

```python
def tester_prompts(question, prompts):
    """Teste plusieurs prompts et retourne les résultats"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    resultats = []
    
    for i, prompt_template in enumerate(prompts):
        prompt = prompt_template.format(question=question)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        resultats.append({
            "prompt_num": i + 1,
            "prompt": prompt_template,
            "reponse": response.choices[0].message.content,
            "tokens": response.usage.total_tokens
        })
    
    return resultats

# Test avec différents prompts
question = "Explique-moi les listes Python"
prompts = [
    "Explique {question}",
    "Tu es un expert Python. Explique {question} de manière claire.",
    "Explique {question} avec un exemple de code pratique."
]

resultats = tester_prompts(question, prompts)
for r in resultats:
    print(f"\nPrompt {r['prompt_num']}:")
    print(f"Tokens: {r['tokens']}")
    print(f"Réponse: {r['reponse'][:100]}...")
```

## Exercices Embeddings

### Exercice 1 : Génération d'embeddings de texte

**Objectif** : Créer un système qui génère des embeddings pour des textes.

**Instructions** :
1. Utilisez Sentence Transformers pour générer des embeddings
2. Créez une fonction qui calcule la similarité entre deux textes
3. Visualisez les embeddings (optionnel avec PCA)

**Solution** :

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class GenerateurEmbeddings:
    def __init__(self):
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
    
    def generer_embedding(self, texte):
        """Génère un embedding pour un texte"""
        return self.model.encode(texte)
    
    def similarite(self, texte1, texte2):
        """Calcule la similarité entre deux textes"""
        emb1 = self.generer_embedding(texte1)
        emb2 = self.generer_embedding(texte2)
        
        return cosine_similarity([emb1], [emb2])[0][0]
    
    def textes_similaires(self, texte_reference, textes, top_k=3):
        """Trouve les textes les plus similaires"""
        emb_ref = self.generer_embedding(texte_reference)
        embs = self.model.encode(textes)
        
        similarites = cosine_similarity([emb_ref], embs)[0]
        indices = np.argsort(similarites)[::-1][:top_k]
        
        return [
            {"texte": textes[i], "score": float(similarites[i])}
            for i in indices
        ]

# Test
generateur = GenerateurEmbeddings()

textes = [
    "Python est un langage de programmation",
    "Les listes Python sont mutables",
    "Le chat est un animal",
    "Les fonctions Python peuvent retourner plusieurs valeurs"
]

resultats = generateur.textes_similaires(
    "Comment utiliser Python ?",
    textes,
    top_k=2
)

for r in resultats:
    print(f"Score: {r['score']:.2f} - {r['texte']}")
```

### Exercice 2 : Recherche sémantique simple

**Objectif** : Créer un système de recherche sémantique.

**Instructions** :
1. Créez une classe `RechercheSemantique` qui indexe des documents
2. Implémentez une méthode de recherche qui trouve les documents les plus pertinents
3. Affichez les résultats avec leurs scores de similarité

**Solution** :

```python
class RechercheSemantique:
    def __init__(self, documents):
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        self.documents = documents
        self.embeddings = self.model.encode(documents)
    
    def rechercher(self, requete, top_k=5):
        """Recherche les documents les plus pertinents"""
        emb_requete = self.model.encode([requete])
        similarites = cosine_similarity(emb_requete, self.embeddings)[0]
        
        indices = np.argsort(similarites)[::-1][:top_k]
        
        return [
            {
                "document": self.documents[i],
                "score": float(similarites[i]),
                "index": i
            }
            for i in indices
        ]

# Test
documents = [
    "Python est un langage de programmation interprété",
    "Les listes Python sont des structures de données mutables",
    "Les fonctions Python peuvent retourner plusieurs valeurs",
    "Le chat est un animal domestique",
    "Les décorateurs Python modifient le comportement des fonctions"
]

recherche = RechercheSemantique(documents)
resultats = recherche.rechercher("Comment utiliser les fonctions Python ?", top_k=3)

for r in resultats:
    print(f"\nScore: {r['score']:.3f}")
    print(f"Document: {r['document']}")
```

## Exercices Qdrant

### Exercice 1 : Création d'une collection vectorielle

**Objectif** : Créer et peupler une collection Qdrant.

**Instructions** :
1. Démarrez Qdrant (Docker ou local)
2. Créez une collection avec des embeddings de 384 dimensions
3. Ajoutez au moins 5 documents avec leurs embeddings

**Solution** :

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer

# Connexion
client = QdrantClient(host="localhost", port=6333)
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Créer la collection
collection_name = "exercice_collection"
try:
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(
            size=384,
            distance=Distance.COSINE
        )
    )
    print(f"Collection '{collection_name}' créée")
except Exception as e:
    print(f"Collection existe déjà ou erreur: {e}")

# Documents à indexer
documents = [
    {"id": 1, "texte": "Python est un langage de programmation"},
    {"id": 2, "texte": "Les listes Python sont mutables"},
    {"id": 3, "texte": "Les fonctions Python peuvent retourner plusieurs valeurs"},
    {"id": 4, "texte": "Les décorateurs Python modifient les fonctions"},
    {"id": 5, "texte": "Le chat est un animal domestique"}
]

# Générer les embeddings et créer les points
points = []
for doc in documents:
    embedding = model.encode(doc["texte"]).tolist()
    point = PointStruct(
        id=doc["id"],
        vector=embedding,
        payload={"texte": doc["texte"]}
    )
    points.append(point)

# Ajouter à Qdrant
client.upsert(collection_name=collection_name, points=points)
print(f"{len(points)} points ajoutés à la collection")
```

### Exercice 2 : Recherche par similarité

**Objectif** : Implémenter une recherche par similarité dans Qdrant.

**Instructions** :
1. Utilisez la collection créée précédemment
2. Créez une fonction de recherche qui prend une requête et retourne les documents similaires
3. Affichez les résultats avec leurs scores

**Solution** :

```python
def rechercher_similarite(requete, top_k=3):
    """Recherche des documents similaires"""
    # Générer l'embedding de la requête
    embedding = model.encode(requete).tolist()
    
    # Rechercher dans Qdrant
    resultats = client.search(
        collection_name=collection_name,
        query_vector=embedding,
        limit=top_k
    )
    
    return resultats

# Test
requete = "Comment utiliser Python ?"
resultats = rechercher_similarite(requete, top_k=3)

print(f"Résultats pour: '{requete}'\n")
for i, resultat in enumerate(resultats, 1):
    print(f"{i}. Score: {resultat.score:.3f}")
    print(f"   Texte: {resultat.payload['texte']}\n")
```

### Exercice 3 : Filtrage avec métadonnées

**Objectif** : Ajouter des métadonnées et filtrer les recherches.

**Instructions** :
1. Ajoutez des métadonnées (catégorie, date, etc.) aux documents
2. Implémentez une recherche avec filtre sur les métadonnées
3. Testez avec différents filtres

**Solution** :

```python
from qdrant_client.models import Filter, FieldCondition, MatchValue

# Ajouter des documents avec métadonnées
documents_avec_meta = [
    {"id": 6, "texte": "Introduction à Python", "categorie": "débutant", "niveau": 1},
    {"id": 7, "texte": "Les décorateurs avancés", "categorie": "avancé", "niveau": 3},
    {"id": 8, "texte": "Les bases de Python", "categorie": "débutant", "niveau": 1}
]

points_meta = []
for doc in documents_avec_meta:
    embedding = model.encode(doc["texte"]).tolist()
    point = PointStruct(
        id=doc["id"],
        vector=embedding,
        payload={
            "texte": doc["texte"],
            "categorie": doc["categorie"],
            "niveau": doc["niveau"]
        }
    )
    points_meta.append(point)

client.upsert(collection_name=collection_name, points=points_meta)

# Recherche avec filtre
def rechercher_avec_filtre(requete, categorie=None, top_k=3):
    """Recherche avec filtre sur les métadonnées"""
    embedding = model.encode(requete).tolist()
    
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
    
    resultats = client.search(
        collection_name=collection_name,
        query_vector=embedding,
        query_filter=query_filter,
        limit=top_k
    )
    
    return resultats

# Test avec filtre
resultats = rechercher_avec_filtre("Apprendre Python", categorie="débutant")
print("Résultats filtrés (catégorie: débutant):")
for r in resultats:
    print(f"- {r.payload['texte']} (score: {r.score:.3f})")
```

## Projets complets

### Projet 1 : Assistant IA personnalisé

**Objectif** : Créer un assistant IA complet avec mémoire et personnalisation.

**Fonctionnalités à implémenter** :
- Conversation avec historique
- Personnalisation du comportement
- Gestion des erreurs
- Export de la conversation

**Structure suggérée** :

```python
class AssistantPersonnalise:
    def __init__(self, personnalite="utile"):
        # Initialisation
        pass
    
    def definir_personnalite(self, description):
        # Définir la personnalité
        pass
    
    def converser(self, message):
        # Conversation avec historique
        pass
    
    def exporter_conversation(self, fichier):
        # Exporter l'historique
        pass
```

### Projet 2 : Système de recommandation basé sur embeddings

**Objectif** : Créer un système qui recommande du contenu similaire.

**Fonctionnalités** :
- Indexation de contenu
- Recommandations basées sur la similarité
- Interface simple (CLI ou web)

### Projet 3 : Chatbot avec mémoire (RAG)

**Objectif** : Créer un chatbot RAG complet.

**Fonctionnalités** :
- Indexation de documents
- Recherche de contexte
- Génération de réponses avec contexte
- Affichage des sources

**Structure suggérée** :

```python
class ChatbotRAG:
    def __init__(self):
        # Initialiser Qdrant, embeddings, LLM
        pass
    
    def indexer_documents(self, documents):
        # Indexer des documents
        pass
    
    def poser_question(self, question):
        # Rechercher contexte + générer réponse
        pass
```

## Conseils pour les projets

1. **Commencez simple** : Implémentez d'abord les fonctionnalités de base
2. **Testez régulièrement** : Testez chaque fonctionnalité au fur et à mesure
3. **Gérez les erreurs** : Ajoutez la gestion d'erreurs dès le début
4. **Documentez** : Commentez votre code
5. **Itérez** : Améliorez progressivement

## Ressources supplémentaires

- **Documentation OpenAI** : https://platform.openai.com/docs
- **Sentence Transformers** : https://www.sbert.net
- **Qdrant** : https://qdrant.tech/documentation
- **Exemples GitHub** : Recherchez des projets RAG sur GitHub

Bon courage avec vos exercices ! 🚀
