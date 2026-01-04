---
title: "OpenAI API"
order: 1
parent: "21-llm-exploitation.md"
tags: ["python", "ia", "llm", "openai", "gpt"]
---

# OpenAI API

## Introduction

OpenAI propose une API puissante pour accéder à ses modèles de langage, notamment GPT-3.5 et GPT-4. Cette API est l'une des plus utilisées pour intégrer l'IA dans les applications.

## Installation et configuration

### Installation

```bash
pip install openai
```

### Configuration de la clé API

```python
import os
from openai import OpenAI

# Méthode 1 : Variable d'environnement (recommandé)
os.environ["OPENAI_API_KEY"] = "sk-votre-clé-api"
client = OpenAI()

# Méthode 2 : Directement dans le code (non recommandé pour la production)
client = OpenAI(api_key="sk-votre-clé-api")
```

### Fichier .env (recommandé)

```bash
# .env
OPENAI_API_KEY=sk-votre-clé-api
```

```python
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

## Modèles disponibles

### GPT-3.5-turbo

- **Avantages** : Rapide, économique, bon pour la plupart des cas
- **Limite de contexte** : 16,385 tokens
- **Coût** : ~$0.0015 par 1K tokens d'entrée

### GPT-4

- **Avantages** : Plus puissant, meilleur raisonnement
- **Limite de contexte** : 8,192 tokens (GPT-4) ou 128,000 tokens (GPT-4-turbo)
- **Coût** : Plus cher que GPT-3.5

### GPT-4-turbo

- **Avantages** : Version optimisée, contexte très large
- **Limite de contexte** : 128,000 tokens
- **Idéal pour** : Documents longs, analyse approfondie

## Premier appel simple

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Explique-moi Python en une phrase"}
    ]
)

print(response.choices[0].message.content)
# Output: Python est un langage de programmation interprété, de haut niveau...
```

## Structure des messages

### Conversation simple

```python
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "Tu es un assistant Python expert."},
        {"role": "user", "content": "Comment créer une liste en Python ?"},
        {"role": "assistant", "content": "Tu peux créer une liste avec des crochets..."},
        {"role": "user", "content": "Et pour ajouter un élément ?"}
    ]
)
```

### Exemple complet avec gestion d'erreurs

```python
from openai import OpenAI
from openai import RateLimitError, APIError
import time

client = OpenAI()

def chat_openai(messages, model="gpt-3.5-turbo", max_retries=3):
    """Appel OpenAI avec retry automatique"""
    
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content
            
        except RateLimitError:
            if attempt < max_retries - 1:
                wait = (2 ** attempt)  # Backoff exponentiel
                print(f"Limite atteinte, attente {wait}s...")
                time.sleep(wait)
            else:
                raise
                
        except APIError as e:
            print(f"Erreur API: {e}")
            raise
    
    return None

# Utilisation
messages = [
    {"role": "system", "content": "Tu es un assistant utile."},
    {"role": "user", "content": "Explique-moi les listes Python"}
]

reponse = chat_openai(messages)
print(reponse)
```

## Paramètres importants

### Temperature

Contrôle la créativité (0.0 = déterministe, 2.0 = très créatif)

```python
# Code Python (basse température)
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Écris une fonction pour trier une liste"}],
    temperature=0.2  # Précis et déterministe
)

# Création de contenu (haute température)
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Écris une histoire créative"}],
    temperature=1.2  # Créatif
)
```

### Max tokens

Limite la longueur de la réponse

```python
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Résume ce texte..."}],
    max_tokens=100  # Réponse courte
)
```

### Top P (nucleus sampling)

Alternative à temperature pour contrôler la diversité

```python
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Génère des idées"}],
    top_p=0.9  # Considère les 90% de tokens les plus probables
)
```

## Cas d'usage pratiques

### 1. Assistant de code

```python
def assistant_code(question, code_existant=""):
    """Assistant pour aider avec le code"""
    
    prompt = f"""
    Tu es un expert Python. Réponds à cette question de programmation.
    
    Question: {question}
    
    Code existant:
    ```python
    {code_existant}
    ```
    
    Fournis une explication claire avec un exemple de code.
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Tu es un expert Python qui explique clairement."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    
    return response.choices[0].message.content

# Utilisation
reponse = assistant_code(
    "Comment utiliser les décorateurs en Python ?",
    code_existant="def ma_fonction(): pass"
)
print(reponse)
```

### 2. Générateur de tests unitaires

```python
def generer_tests(fonction_code):
    """Génère des tests unitaires pour une fonction"""
    
    prompt = f"""
    Génère des tests unitaires complets pour cette fonction Python.
    Utilise pytest.
    
    Fonction:
    ```python
    {fonction_code}
    ```
    
    Fournis des tests pour les cas normaux, limites et erreurs.
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Tu es un expert en tests Python."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )
    
    return response.choices[0].message.content

# Exemple
fonction = """
def calculer_moyenne(nombres):
    if not nombres:
        raise ValueError("La liste ne peut pas être vide")
    return sum(nombres) / len(nombres)
"""

tests = generer_tests(fonction)
print(tests)
```

### 3. Traducteur contextuel

```python
def traduire(texte, langue_cible, contexte=""):
    """Traduction avec contexte"""
    
    prompt = f"""
    Traduis ce texte en {langue_cible}.
    
    Contexte: {contexte}
    Texte: {texte}
    
    Fournis une traduction naturelle et contextuellement appropriée.
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )
    
    return response.choices[0].message.content
```

### 4. Analyseur de code

```python
def analyser_code(code):
    """Analyse du code pour détecter des problèmes"""
    
    prompt = f"""
    Analyse ce code Python et identifie :
    1. Les bugs potentiels
    2. Les améliorations possibles
    3. Les bonnes pratiques à appliquer
    4. Les optimisations
    
    Code:
    ```python
    {code}
    ```
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Tu es un expert en code review Python."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    
    return response.choices[0].message.content
```

## Streaming (réponses en temps réel)

Pour les réponses longues, utilisez le streaming :

```python
def chat_streaming(messages):
    """Chat avec streaming pour voir la réponse en temps réel"""
    
    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stream=True
    )
    
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="", flush=True)
    print()  # Nouvelle ligne à la fin

# Utilisation
messages = [
    {"role": "user", "content": "Raconte-moi une histoire courte sur l'IA"}
]
chat_streaming(messages)
```

## Gestion des coûts

### Suivi des tokens

```python
def chat_avec_compteur(messages):
    """Chat avec suivi des tokens utilisés"""
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    
    # Informations sur l'utilisation
    usage = response.usage
    print(f"Tokens d'entrée: {usage.prompt_tokens}")
    print(f"Tokens de sortie: {usage.completion_tokens}")
    print(f"Total: {usage.total_tokens}")
    
    # Estimation du coût (GPT-3.5-turbo)
    cout_entree = (usage.prompt_tokens / 1000) * 0.0015
    cout_sortie = (usage.completion_tokens / 1000) * 0.002
    cout_total = cout_entree + cout_sortie
    
    print(f"Coût estimé: ${cout_total:.4f}")
    
    return response.choices[0].message.content
```

### Optimisation

```python
def optimiser_prompt(texte, max_tokens=1000):
    """Tronque intelligemment le texte pour économiser des tokens"""
    from tiktoken import encoding_for_model
    
    encoding = encoding_for_model("gpt-3.5-turbo")
    tokens = encoding.encode(texte)
    
    if len(tokens) > max_tokens:
        # Garder le début et la fin
        tokens_debut = tokens[:max_tokens // 2]
        tokens_fin = tokens[-max_tokens // 2:]
        texte_debut = encoding.decode(tokens_debut)
        texte_fin = encoding.decode(tokens_fin)
        return f"{texte_debut}...\n\n[Texte tronqué]\n\n...{texte_fin}"
    
    return texte
```

## Fonctions (Function Calling)

OpenAI permet de définir des fonctions que le modèle peut appeler :

```python
import json

# Définir les fonctions disponibles
fonctions = [
    {
        "name": "obtenir_meteo",
        "description": "Obtient la météo pour une ville donnée",
        "parameters": {
            "type": "object",
            "properties": {
                "ville": {
                    "type": "string",
                    "description": "Le nom de la ville"
                },
                "unite": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "L'unité de température"
                }
            },
            "required": ["ville"]
        }
    }
]

def obtenir_meteo(ville, unite="celsius"):
    """Fonction simulée pour obtenir la météo"""
    # En production, appelleriez une vraie API météo
    return f"25°C à {ville}"

# Appel avec function calling
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Quel temps fait-il à Paris ?"}
    ],
    functions=fonctions,
    function_call="auto"
)

message = response.choices[0].message

# Si le modèle veut appeler une fonction
if message.function_call:
    function_name = message.function_call.name
    function_args = json.loads(message.function_call.arguments)
    
    if function_name == "obtenir_meteo":
        resultat = obtenir_meteo(**function_args)
        
        # Envoyer le résultat au modèle
        messages.append(message)
        messages.append({
            "role": "function",
            "name": function_name,
            "content": resultat
        })
        
        # Obtenir la réponse finale
        second_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        
        print(second_response.choices[0].message.content)
```

## Bonnes pratiques

### ✅ À faire

- Utiliser des variables d'environnement pour les clés API
- Gérer les erreurs (RateLimitError, APIError)
- Limiter les tokens pour contrôler les coûts
- Utiliser GPT-3.5-turbo pour la plupart des cas
- Tester avec différents paramètres (temperature, etc.)

### ❌ À éviter

- Hardcoder les clés API
- Ignorer la gestion d'erreurs
- Utiliser GPT-4 pour tout (coûteux)
- Oublier de limiter les tokens
- Ne pas valider les réponses

## Ressources

- **Documentation officielle** : https://platform.openai.com/docs
- **Guide de pricing** : https://openai.com/pricing
- **Playground** : https://platform.openai.com/playground
- **Exemples** : https://github.com/openai/openai-python
