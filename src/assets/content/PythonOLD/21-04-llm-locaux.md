---
title: "LLM Locaux"
order: 4
parent: "21-llm-exploitation.md"
tags: ["python", "ia", "llm", "local", "llama", "mistral"]
---

# LLM Locaux

## Introduction

Les LLM locaux permettent d'exécuter des modèles de langage sur votre propre machine, sans dépendre d'APIs externes. Cela offre plus de contrôle, de confidentialité et peut être plus économique à long terme.

## Avantages des LLM locaux

- **Confidentialité** : Données restent sur votre machine
- **Coûts** : Pas de coûts par requête
- **Contrôle** : Personnalisation complète
- **Hors ligne** : Fonctionne sans internet

## Inconvénients

- **Ressources** : Nécessite une GPU puissante
- **Performance** : Plus lent que les APIs cloud
- **Qualité** : Modèles généralement moins performants

## Outils populaires

### 1. Ollama (Recommandé pour débuter)

Ollama simplifie l'exécution de LLM locaux.

#### Installation

```bash
# Télécharger depuis https://ollama.ai
# Ou avec Docker
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

#### Utilisation avec Python

```python
import requests
import json

def appeler_ollama(prompt, model="llama2"):
    """Appelle un modèle via Ollama"""
    
    url = "http://localhost:11434/api/generate"
    
    data = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    response = requests.post(url, json=data)
    return response.json()["response"]

# Utilisation
reponse = appeler_ollama("Explique-moi Python en une phrase")
print(reponse)
```

### 2. Llama.cpp

Bibliothèque C++ optimisée pour exécuter des modèles.

#### Installation

```bash
pip install llama-cpp-python
```

#### Utilisation

```python
from llama_cpp import Llama

# Charger le modèle
llm = Llama(
    model_path="./models/llama-2-7b-chat.gguf",
    n_ctx=2048,  # Taille du contexte
    n_threads=4  # Nombre de threads
)

# Générer du texte
response = llm(
    "Q: Explique-moi Python\nA:",
    max_tokens=100,
    temperature=0.7,
    stop=["Q:", "\n"]
)

print(response["choices"][0]["text"])
```

### 3. Transformers (Hugging Face)

Bibliothèque Python pour charger et utiliser des modèles.

#### Installation

```bash
pip install transformers torch
```

#### Utilisation

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Charger le modèle
model_name = "mistralai/Mistral-7B-Instruct-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)

# Générer du texte
prompt = "Explique-moi Python en une phrase"
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

with torch.no_grad():
    outputs = model.generate(
        inputs.input_ids,
        max_length=100,
        temperature=0.7
    )

reponse = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(reponse)
```

## Modèles recommandés

### Pour débuter

- **Llama 2 7B** : Bon équilibre performance/taille
- **Mistral 7B** : Performant et efficace
- **Phi-2** : Petit mais performant

### Pour production

- **Llama 2 13B/70B** : Plus puissant
- **Mistral 7B/8x7B** : Très performant
- **Code Llama** : Spécialisé pour le code

## Exemple complet : Assistant local

```python
from llama_cpp import Llama
import os

class AssistantLocal:
    def __init__(self, model_path):
        self.llm = Llama(
            model_path=model_path,
            n_ctx=2048,
            n_threads=4,
            verbose=False
        )
        self.historique = []
    
    def repondre(self, question):
        # Construire le prompt avec historique
        prompt = self._construire_prompt(question)
        
        # Générer la réponse
        response = self.llm(
            prompt,
            max_tokens=200,
            temperature=0.7,
            stop=["Human:", "\n\n"]
        )
        
        reponse = response["choices"][0]["text"].strip()
        
        # Mettre à jour l'historique
        self.historique.append(("Human", question))
        self.historique.append(("Assistant", reponse))
        
        return reponse
    
    def _construire_prompt(self, question):
        prompt = "Tu es un assistant Python utile.\n\n"
        
        # Ajouter l'historique
        for role, texte in self.historique[-4:]:  # Derniers 4 échanges
            prompt += f"{role}: {texte}\n"
        
        prompt += f"Human: {question}\nAssistant:"
        return prompt

# Utilisation
assistant = AssistantLocal("./models/llama-2-7b-chat.gguf")
print(assistant.repondre("Qu'est-ce qu'une fonction lambda ?"))
```

## Optimisation des performances

### Utiliser une GPU

```python
# Avec CUDA
from llama_cpp import Llama

llm = Llama(
    model_path="./models/llama-2-7b-chat.gguf",
    n_gpu_layers=35  # Nombre de couches sur GPU
)
```

### Quantisation

Réduire la précision pour économiser de la mémoire :

```python
# Utiliser un modèle quantifié (plus petit, plus rapide)
llm = Llama(
    model_path="./models/llama-2-7b-chat-q4_0.gguf",  # Quantifié
    n_ctx=2048
)
```

## Comparaison : Local vs Cloud

| Critère | Local | Cloud (API) |
|---------|-------|-------------|
| Confidentialité | ✅ Haute | ❌ Données envoyées |
| Coûts | ✅ Gratuit après achat | ❌ Payant par requête |
| Performance | ⚠️ Dépend du hardware | ✅ Très rapide |
| Qualité | ⚠️ Modèles plus petits | ✅ Meilleurs modèles |
| Maintenance | ❌ À gérer | ✅ Géré par le fournisseur |

## Quand utiliser des LLM locaux

**Utilisez des LLM locaux pour :**
- Données sensibles/confidentielles
- Applications hors ligne
- Volume élevé de requêtes
- Personnalisation profonde

**Utilisez des APIs cloud pour :**
- Prototypage rapide
- Besoin de modèles très performants
- Pas de ressources GPU
- Applications nécessitant une haute disponibilité

## Ressources

- **Ollama** : https://ollama.ai
- **Llama.cpp** : https://github.com/ggerganov/llama.cpp
- **Hugging Face** : https://huggingface.co
- **Modèles** : https://huggingface.co/models
