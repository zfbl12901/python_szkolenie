---
title: "Prompt Engineering"
order: 7
parent: "24-prompt-engineering.md"
tags: ["python", "ia", "llm", "prompt-engineering"]
---

# Prompt Engineering

Le prompt engineering est l'art de formuler des instructions pour obtenir les meilleures réponses des modèles de langage (LLM).

## Principes de base

### 1. Être spécifique

❌ **Mauvais** :
```
Résume ce texte
```

✅ **Bon** :
```
Résume ce texte en 3 phrases maximum, en mettant l'accent sur les points techniques principaux.
```

### 2. Fournir du contexte

```python
prompt = """
Tu es un expert en Python. 
Analyse ce code et identifie les problèmes de performance :

[code ici]
"""
```

### 3. Utiliser des exemples (Few-shot learning)

```python
prompt = """
Traduis les phrases suivantes en français :

Exemple 1:
Input: "Hello"
Output: "Bonjour"

Exemple 2:
Input: "Good morning"
Output: "Bonjour"

Maintenant traduis:
Input: "How are you?"
Output:
"""
```

## Techniques avancées

### Chain of Thought (CoT)

```python
prompt = """
Résous ce problème étape par étape :

Problème: Si j'ai 5 pommes et j'en mange 2, combien m'en reste-t-il ?

Réfléchissons étape par étape:
1. J'ai initialement 5 pommes
2. Je mange 2 pommes
3. Donc il me reste 5 - 2 = 3 pommes

Réponse: 3 pommes
"""
```

### Rôle et personnalité

```python
prompt = """
Tu es un développeur Python senior avec 10 ans d'expérience.
Tu es pédagogue et tu expliques les concepts de manière claire.

Explique-moi les décorateurs en Python.
"""
```

## Intégration avec Python

### OpenAI

```python
from openai import OpenAI

client = OpenAI(api_key="votre-cle")

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "Tu es un expert Python."},
        {"role": "user", "content": "Explique les générateurs en Python."}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)
```

### LangChain

```python
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

template = """
Tu es un expert en {domaine}.
Explique {concept} de manière claire et concise.
"""

prompt = PromptTemplate(
    input_variables=["domaine", "concept"],
    template=template
)

llm = OpenAI(temperature=0.7)
resultat = llm(prompt.format(domaine="Python", concept="les décorateurs"))
```

## Bonnes pratiques

1. **Itérer** : Testez différents prompts et améliorez-les
2. **Mesurer** : Évaluez la qualité des réponses
3. **Documenter** : Gardez une trace des prompts qui fonctionnent
4. **Réutiliser** : Créez des templates pour les cas courants


