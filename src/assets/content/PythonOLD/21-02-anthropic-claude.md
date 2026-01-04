---
title: "Anthropic Claude API"
order: 2
parent: "21-llm-exploitation.md"
tags: ["python", "ia", "llm", "anthropic", "claude"]
---

# Anthropic Claude API

## Introduction

Anthropic Claude est un modèle de langage développé par Anthropic, conçu pour être utile, inoffensif et honnête. Claude excelle particulièrement dans les tâches de raisonnement, d'analyse de documents longs et de génération de code.

## Installation et configuration

### Installation

```bash
pip install anthropic
```

### Configuration

```python
import os
from anthropic import Anthropic

# Méthode recommandée : Variable d'environnement
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-votre-clé-api"
client = Anthropic()

# Ou directement
client = Anthropic(api_key="sk-ant-votre-clé-api")
```

### Fichier .env

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-votre-clé-api
```

```python
from dotenv import load_dotenv
import os
from anthropic import Anthropic

load_dotenv()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
```

## Modèles disponibles

### Claude 3 Opus

- **Le plus puissant** : Meilleur pour les tâches complexes
- **Contexte** : 200,000 tokens
- **Idéal pour** : Analyse approfondie, raisonnement complexe

### Claude 3 Sonnet

- **Équilibre performance/coût** : Bon compromis
- **Contexte** : 200,000 tokens
- **Idéal pour** : La plupart des cas d'usage

### Claude 3 Haiku

- **Rapide et économique** : Le plus rapide
- **Contexte** : 200,000 tokens
- **Idéal pour** : Tâches simples, réponses rapides

## Premier appel simple

```python
from anthropic import Anthropic

client = Anthropic()

message = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explique-moi Python en une phrase"}
    ]
)

print(message.content[0].text)
```

## Structure des messages

### Conversation simple

```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Comment créer une liste en Python ?"
        }
    ]
)

print(response.content[0].text)
```

### Conversation avec historique

```python
messages = [
    {
        "role": "user",
        "content": "Qu'est-ce qu'une fonction lambda en Python ?"
    }
]

# Première réponse
response1 = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    messages=messages
)

# Ajouter la réponse à l'historique
messages.append({
    "role": "assistant",
    "content": response1.content[0].text
})

# Continuer la conversation
messages.append({
    "role": "user",
    "content": "Peux-tu me donner un exemple pratique ?"
})

response2 = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    messages=messages
)

print(response2.content[0].text)
```

## Paramètres importants

### Temperature

```python
# Code Python (basse température)
response = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    temperature=0.2,  # Précis
    messages=[{"role": "user", "content": "Écris une fonction Python"}]
)

# Création de contenu (haute température)
response = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    temperature=1.0,  # Créatif
    messages=[{"role": "user", "content": "Écris une histoire créative"}]
)
```

### Max tokens

```python
response = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=500,  # Réponse courte
    messages=[{"role": "user", "content": "Résume ce texte..."}]
)
```

### System prompt

Claude supporte un system prompt pour définir le comportement :

```python
response = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    system="Tu es un expert Python qui explique les concepts simplement.",
    messages=[
        {"role": "user", "content": "Explique-moi les décorateurs"}
    ]
)
```

## Cas d'usage pratiques

### 1. Analyse de documents longs

Claude excelle avec les documents longs grâce à son contexte de 200K tokens :

```python
def analyser_document(texte_long):
    """Analyse un document long avec Claude"""
    
    response = client.messages.create(
        model="claude-3-opus-20240229",  # Opus pour documents complexes
        max_tokens=4096,
        system="Tu es un expert en analyse de documents.",
        messages=[
            {
                "role": "user",
                "content": f"""
                Analyse ce document et fournis :
                1. Un résumé exécutif
                2. Les points clés
                3. Les recommandations
                
                Document:
                {texte_long}
                """
            }
        ]
    )
    
    return response.content[0].text
```

### 2. Assistant de code avancé

```python
def assistant_code_avance(question, code_existant=""):
    """Assistant code avec Claude"""
    
    prompt = f"""
    Tu es un expert Python. Aide-moi avec cette question :
    
    Question: {question}
    
    Code existant:
    ```python
    {code_existant}
    ```
    
    Fournis :
    1. Une explication claire
    2. Un exemple de code
    3. Les bonnes pratiques à suivre
    """
    
    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=2048,
        temperature=0.3,
        system="Tu es un expert Python qui explique clairement.",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.content[0].text
```

### 3. Générateur de documentation

```python
def generer_documentation(code):
    """Génère de la documentation pour du code"""
    
    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=2048,
        system="Tu génères de la documentation Python professionnelle.",
        messages=[
            {
                "role": "user",
                "content": f"""
                Génère une documentation complète pour cette fonction :
                
                ```python
                {code}
                ```
                
                Inclus :
                - Description
                - Paramètres
                - Valeur de retour
                - Exemples d'utilisation
                - Cas d'erreur
                """
            }
        ]
    )
    
    return response.content[0].text
```

### 4. Analyse de code et suggestions

```python
def analyser_et_suggérer(code):
    """Analyse le code et suggère des améliorations"""
    
    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=2048,
        system="Tu es un expert en code review Python.",
        messages=[
            {
                "role": "user",
                "content": f"""
                Analyse ce code et fournis :
                1. Les bugs potentiels
                2. Les améliorations de performance
                3. Les améliorations de lisibilité
                4. Les bonnes pratiques à appliquer
                
                Code:
                ```python
                {code}
                ```
                """
            }
        ]
    )
    
    return response.content[0].text
```

## Gestion des erreurs

```python
from anthropic import Anthropic, APIError, RateLimitError
import time

def appel_claude_robuste(messages, max_retries=3):
    """Appel Claude avec gestion d'erreurs et retry"""
    
    client = Anthropic()
    
    for attempt in range(max_retries):
        try:
            response = client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1024,
                messages=messages
            )
            return response.content[0].text
            
        except RateLimitError:
            if attempt < max_retries - 1:
                wait = (2 ** attempt)
                print(f"Limite atteinte, attente {wait}s...")
                time.sleep(wait)
            else:
                raise Exception("Trop de tentatives")
                
        except APIError as e:
            print(f"Erreur API: {e}")
            if attempt < max_retries - 1:
                time.sleep(1)
            else:
                raise
                
        except Exception as e:
            print(f"Erreur inattendue: {e}")
            raise
    
    return None
```

## Streaming

Claude supporte le streaming pour les réponses en temps réel :

```python
def chat_streaming(messages):
    """Chat avec streaming"""
    
    with client.messages.stream(
        model="claude-3-sonnet-20240229",
        max_tokens=1024,
        messages=messages
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
    print()  # Nouvelle ligne

# Utilisation
messages = [
    {"role": "user", "content": "Raconte-moi une histoire sur l'IA"}
]
chat_streaming(messages)
```

## Gestion des coûts

### Suivi de l'utilisation

```python
def chat_avec_compteur(messages):
    """Chat avec suivi des tokens"""
    
    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=1024,
        messages=messages
    )
    
    # Informations sur l'utilisation
    usage = response.usage
    print(f"Tokens d'entrée: {usage.input_tokens}")
    print(f"Tokens de sortie: {usage.output_tokens}")
    
    # Estimation du coût (Claude 3 Sonnet)
    # Prix approximatif : $3/million tokens entrée, $15/million tokens sortie
    cout_entree = (usage.input_tokens / 1_000_000) * 3
    cout_sortie = (usage.output_tokens / 1_000_000) * 15
    cout_total = cout_entree + cout_sortie
    
    print(f"Coût estimé: ${cout_total:.6f}")
    
    return response.content[0].text
```

## Comparaison avec OpenAI

### Avantages de Claude

- **Contexte très large** : 200K tokens vs 128K pour GPT-4-turbo
- **Meilleur raisonnement** : Excelle dans les tâches analytiques
- **Analyse de documents** : Très bon pour les documents longs
- **Sécurité** : Conçu pour être plus sûr et moins biaisé

### Quand utiliser Claude vs GPT

**Utilisez Claude pour :**
- Analyse de documents longs
- Raisonnement complexe
- Code review approfondi
- Tâches nécessitant un contexte très large

**Utilisez GPT pour :**
- Tâches générales rapides
- Quand le coût est un facteur important
- Intégration avec des outils existants (plus d'écosystème)

## Bonnes pratiques

### ✅ À faire

- Utiliser Claude 3 Sonnet pour la plupart des cas
- Utiliser Claude 3 Opus pour les tâches complexes
- Profiter du grand contexte pour les documents longs
- Utiliser le system prompt pour définir le comportement
- Gérer les erreurs et les limites de taux

### ❌ À éviter

- Ne pas utiliser le system prompt (perte de contrôle)
- Ignorer la gestion d'erreurs
- Utiliser Opus pour tout (plus cher)
- Ne pas optimiser les prompts

## Exemple complet : Assistant de code

```python
from anthropic import Anthropic
import os

class AssistantCode:
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.historique = []
    
    def demander(self, question, code=""):
        """Pose une question sur le code"""
        
        prompt = f"""
        Question: {question}
        
        Code:
        ```python
        {code}
        ```
        """
        
        messages = self.historique + [{"role": "user", "content": prompt}]
        
        response = self.client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=2048,
            system="Tu es un expert Python qui explique clairement avec des exemples.",
            messages=messages,
            temperature=0.3
        )
        
        reponse = response.content[0].text
        
        # Mettre à jour l'historique
        self.historique.append({"role": "user", "content": prompt})
        self.historique.append({"role": "assistant", "content": reponse})
        
        return reponse

# Utilisation
assistant = AssistantCode()
print(assistant.demander("Comment utiliser les décorateurs ?"))
print(assistant.demander("Peux-tu me donner un exemple pratique ?"))
```

## Ressources

- **Documentation officielle** : https://docs.anthropic.com
- **Guide de pricing** : https://www.anthropic.com/pricing
- **Console** : https://console.anthropic.com
- **Exemples** : https://github.com/anthropics/anthropic-sdk-python
