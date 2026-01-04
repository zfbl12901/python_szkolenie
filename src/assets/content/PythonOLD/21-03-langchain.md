---
title: "LangChain - Framework pour LLM"
order: 3
parent: "21-llm-exploitation.md"
tags: ["python", "ia", "llm", "langchain", "framework"]
---

# LangChain - Framework pour LLM

## Introduction

LangChain est un framework Python qui simplifie le développement d'applications avec des LLM. Il fournit des abstractions pour chaîner des appels, gérer la mémoire, intégrer des outils externes, et construire des applications RAG.

## Installation

```bash
pip install langchain openai
# Ou pour des fonctionnalités avancées
pip install langchain[all]
```

## Concepts fondamentaux

### 1. LLM Chains

Une chain permet de chaîner plusieurs opérations :

```python
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Initialiser le LLM
llm = OpenAI(temperature=0.7)

# Créer un template de prompt
template = """
Tu es un expert Python. Explique ce concept simplement.

Concept: {concept}
"""

prompt = PromptTemplate(
    input_variables=["concept"],
    template=template
)

# Créer une chain
chain = LLMChain(llm=llm, prompt=prompt)

# Utiliser la chain
reponse = chain.run("décorateurs")
print(reponse)
```

### 2. Chat Models

LangChain supporte les modèles de chat modernes :

```python
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

chat = ChatOpenAI(temperature=0.7)

messages = [
    SystemMessage(content="Tu es un assistant Python expert."),
    HumanMessage(content="Explique-moi les générateurs")
]

reponse = chat(messages)
print(reponse.content)
```

### 3. Prompts et Templates

```python
from langchain.prompts import ChatPromptTemplate

template = ChatPromptTemplate.from_messages([
    ("system", "Tu es un {role}"),
    ("user", "{question}")
])

prompt = template.format_messages(
    role="expert Python",
    question="Comment utiliser les listes ?"
)

chat = ChatOpenAI()
reponse = chat(prompt)
print(reponse.content)
```

## Cas d'usage pratiques

### 1. Assistant simple

```python
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from langchain.memory import ConversationBufferMemory

class AssistantSimple:
    def __init__(self):
        self.llm = ChatOpenAI(temperature=0.7)
        self.memory = ConversationBufferMemory()
    
    def repondre(self, question):
        # Construire les messages avec mémoire
        messages = [
            SystemMessage(content="Tu es un assistant Python utile."),
        ]
        
        # Ajouter l'historique
        if self.memory.chat_memory.messages:
            messages.extend(self.memory.chat_memory.messages)
        
        # Ajouter la nouvelle question
        messages.append(HumanMessage(content=question))
        
        # Obtenir la réponse
        reponse = self.llm(messages)
        
        # Sauvegarder dans la mémoire
        self.memory.save_context(
            {"input": question},
            {"output": reponse.content}
        )
        
        return reponse.content

# Utilisation
assistant = AssistantSimple()
print(assistant.repondre("Qu'est-ce qu'une fonction lambda ?"))
print(assistant.repondre("Peux-tu me donner un exemple ?"))
```

### 2. Chain de traitement de texte

```python
from langchain.chains import LLMChain, SimpleSequentialChain
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI

llm = OpenAI(temperature=0.7)

# Chain 1 : Générer une idée
prompt_idee = PromptTemplate(
    input_variables=["sujet"],
    template="Génère une idée créative sur {sujet}"
)
chain_idee = LLMChain(llm=llm, prompt=prompt_idee)

# Chain 2 : Développer l'idée
prompt_developpement = PromptTemplate(
    input_variables=["idee"],
    template="Développe cette idée en un paragraphe : {idee}"
)
chain_developpement = LLMChain(llm=llm, prompt=prompt_developpement)

# Chaîner les deux
chain_complete = SimpleSequentialChain(
    chains=[chain_idee, chain_developpement],
    verbose=True
)

resultat = chain_complete.run("l'intelligence artificielle")
print(resultat)
```

### 3. Agents avec outils

Les agents peuvent utiliser des outils externes :

```python
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI

llm = OpenAI(temperature=0)

# Définir des outils
def calculatrice(expression):
    """Évalue une expression mathématique"""
    try:
        return str(eval(expression))
    except:
        return "Erreur dans l'expression"

outils = [
    Tool(
        name="Calculatrice",
        func=calculatrice,
        description="Utile pour les calculs mathématiques. Entrée: expression mathématique en Python."
    )
]

# Créer un agent
agent = initialize_agent(
    outils,
    llm,
    agent="zero-shot-react-description",
    verbose=True
)

# Utiliser l'agent
reponse = agent.run("Quel est le résultat de 15 * 23 + 45 ?")
print(reponse)
```

## Intégration avec des bases de données vectorielles

### Avec Qdrant

```python
from langchain.vectorstores import Qdrant
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter

# Préparer les documents
documents = ["Document 1...", "Document 2..."]

# Diviser en chunks
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.create_documents(documents)

# Créer les embeddings
embeddings = OpenAIEmbeddings()

# Créer la base vectorielle
qdrant = Qdrant.from_documents(
    texts,
    embeddings,
    location=":memory:",  # En mémoire, ou URL pour serveur
    collection_name="ma_collection"
)

# Recherche
resultats = qdrant.similarity_search("question sur Python", k=3)
```

## RAG avec LangChain

```python
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.vectorstores import Qdrant
from langchain.embeddings import OpenAIEmbeddings

# Préparer la base vectorielle (voir exemple précédent)
vectorstore = Qdrant(...)

# Créer la chain RAG
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# Poser une question
reponse = qa_chain.run("Qu'est-ce que Python ?")
print(reponse)
```

## Gestion de la mémoire

### ConversationBufferMemory

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()
memory.save_context(
    {"input": "Bonjour"},
    {"output": "Salut ! Comment puis-je t'aider ?"}
)

print(memory.load_memory_variables({}))
```

### ConversationSummaryMemory

```python
from langchain.memory import ConversationSummaryMemory
from langchain.llms import OpenAI

llm = OpenAI()
memory = ConversationSummaryMemory(llm=llm)

memory.save_context(
    {"input": "J'aime Python"},
    {"output": "C'est super ! Python est un excellent langage."}
)

print(memory.load_memory_variables({}))
```

## Bonnes pratiques

### ✅ À faire

- Utiliser les chains pour organiser le code
- Profiter de la mémoire pour les conversations
- Utiliser les agents pour des tâches complexes
- Intégrer avec des bases vectorielles pour le RAG

### ❌ À éviter

- Ne pas utiliser LangChain pour des cas simples (overhead)
- Ignorer la gestion de la mémoire
- Ne pas optimiser les prompts dans les chains

## Ressources

- **Documentation** : https://python.langchain.com
- **GitHub** : https://github.com/langchain-ai/langchain
- **Exemples** : https://github.com/langchain-ai/langchain/tree/master/templates
