---
title: "Prompt Engineering Avancé"
order: 24
parent: "20-ia-introduction.md"
tags: ["python", "ia", "prompt-engineering", "llm", "optimization"]
---

# Prompt Engineering Avancé

## Introduction

Le **Prompt Engineering** est l'art de formuler des prompts pour obtenir les meilleures réponses des LLM. Un bon prompt peut transformer une réponse moyenne en réponse excellente.

## Principes fondamentaux

### 1. Être spécifique

```python
# ❌ MAUVAIS : Trop vague
prompt = "Explique Python"

# ✅ BON : Spécifique
prompt = """
Explique Python en 3 points :
1. Qu'est-ce que Python ?
2. Pourquoi l'utiliser ?
3. Un exemple de code simple
"""
```

### 2. Fournir du contexte

```python
# ❌ MAUVAIS : Pas de contexte
prompt = "Traduis : I'll be back"

# ✅ BON : Avec contexte
prompt = """
Contexte : Citation d'un film de science-fiction avec Arnold Schwarzenegger
Traduis en français : "I'll be back"
"""
```

### 3. Structurer la réponse

```python
# ✅ BON : Structure claire
prompt = """
Analyse ce code Python et fournis :
1. Les bugs potentiels
2. Les améliorations possibles
3. Un exemple de code amélioré

Code:
```python
{code}
```
"""
```

## Techniques avancées

### 1. Few-shot Learning

Fournir des exemples pour guider le modèle :

```python
prompt = """
Tu es un expert en classification de sentiment.

Exemples :
Texte: "J'adore ce produit !"
Sentiment: Positif

Texte: "Ce produit est terrible."
Sentiment: Négatif

Texte: "Le produit fonctionne."
Sentiment: Neutre

Maintenant, classe ce texte :
Texte: "{texte_utilisateur}"
Sentiment:
"""
```

### 2. Chain of Thought

Encourager le raisonnement étape par étape :

```python
prompt = """
Résous ce problème mathématique étape par étape.

Problème : Si 3 pommes coûtent 2€, combien coûtent 12 pommes ?

Réfléchis étape par étape :
1. D'abord, calcule le prix d'une pomme
2. Ensuite, multiplie par le nombre de pommes demandé
3. Donne la réponse finale
"""
```

### 3. Role Playing

Donner un rôle au modèle :

```python
prompt = """
Tu es un expert Python avec 20 ans d'expérience.
Tu expliques les concepts de manière simple et claire.
Tu donnes toujours des exemples pratiques.

Question : {question}
"""
```

### 4. Templates réutilisables

```python
class PromptTemplates:
    @staticmethod
    def assistant_code(question, code=""):
        return f"""
Tu es un expert Python qui aide les développeurs.

Question: {question}

Code existant:
```python
{code}
```

Fournis:
1. Une explication claire
2. Un exemple de code
3. Les bonnes pratiques
"""
    
    @staticmethod
    def analyseur_code(code):
        return f"""
Analyse ce code Python et identifie:
1. Bugs potentiels
2. Améliorations de performance
3. Améliorations de lisibilité

Code:
```python
{code}
```
"""
    
    @staticmethod
    def generateur_tests(fonction):
        return f"""
Génère des tests unitaires complets avec pytest pour cette fonction.

Fonction:
```python
{fonction}
```

Inclus des tests pour:
- Cas normaux
- Cas limites
- Cas d'erreur
"""

# Utilisation
template = PromptTemplates.assistant_code(
    "Comment utiliser les décorateurs ?",
    code="def ma_fonction(): pass"
)
```

## Optimisation des prompts

### 1. Itération et test

```python
def tester_prompt(prompt, test_cases):
    """Teste un prompt avec plusieurs cas"""
    from openai import OpenAI
    client = OpenAI()
    
    resultats = []
    for test_case in test_cases:
        prompt_complet = prompt.format(**test_case)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt_complet}]
        )
        resultats.append({
            "input": test_case,
            "output": response.choices[0].message.content
        })
    
    return resultats

# Tester
test_cases = [
    {"question": "Qu'est-ce qu'une liste ?"},
    {"question": "Comment créer un dictionnaire ?"}
]

resultats = tester_prompt(
    "Explique-moi {question} en Python",
    test_cases
)
```

### 2. A/B Testing

```python
def comparer_prompts(prompt1, prompt2, question):
    """Compare deux versions de prompts"""
    from openai import OpenAI
    client = OpenAI()
    
    reponse1 = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt1.format(question=question)}]
    )
    
    reponse2 = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt2.format(question=question)}]
    )
    
    return {
        "prompt1": reponse1.choices[0].message.content,
        "prompt2": reponse2.choices[0].message.content
    }
```

## Exemples de prompts optimisés

### Assistant de code

```python
PROMPT_ASSISTANT_CODE = """
Tu es un expert Python avec 15 ans d'expérience.
Tu expliques les concepts de manière claire et concise.
Tu donnes toujours des exemples pratiques et du code fonctionnel.

Contexte de l'utilisateur:
- Niveau: {niveau}
- Contexte: {contexte}

Question: {question}

Code existant (si applicable):
```python
{code}
```

Fournis une réponse structurée:
1. Explication courte (2-3 phrases)
2. Exemple de code commenté
3. Points importants à retenir
"""
```

### Générateur de documentation

```python
PROMPT_DOCUMENTATION = """
Génère une documentation Python professionnelle au format docstring.

Fonction:
```python
{code}
```

Format de sortie:
```python
def fonction(...):
    \"\"\"
    Description courte (une ligne).
    
    Args:
        param1 (type): Description
        param2 (type): Description
    
    Returns:
        type: Description
    
    Raises:
        ExceptionType: Quand cela se produit
    
    Example:
        >>> exemple_utilisation()
        résultat_attendu
    \"\"\"
```
"""
```

### Analyseur de code

```python
PROMPT_ANALYSE_CODE = """
Analyse ce code Python de manière approfondie.

Code:
```python
{code}
```

Fournis une analyse structurée:

## 1. Bugs et erreurs potentielles
[Liste des bugs avec explications]

## 2. Améliorations de performance
[Suggestions d'optimisation]

## 3. Améliorations de lisibilité
[Suggestions pour rendre le code plus lisible]

## 4. Bonnes pratiques
[Recommandations selon les PEP 8]

## 5. Code amélioré
```python
[Code amélioré avec commentaires]
```
"""
```

## Bonnes pratiques

### ✅ À faire

- Être spécifique et clair
- Fournir du contexte
- Structurer les réponses attendues
- Tester et itérer
- Utiliser des exemples (few-shot)

### ❌ À éviter

- Prompts trop vagues
- Manque de contexte
- Instructions contradictoires
- Prompts trop longs sans structure
- Ne pas tester différents formats

## Ressources

- **OpenAI Prompt Engineering Guide** : https://platform.openai.com/docs/guides/prompt-engineering
- **Anthropic Prompt Library** : https://docs.anthropic.com/claude/prompt-library
- **Prompt Engineering Guide** : https://www.promptingguide.ai
