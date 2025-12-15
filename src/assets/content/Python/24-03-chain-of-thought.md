---
title: "Chain of Thought (CoT)"
order: 3
parent: "24-prompt-engineering.md"
tags: ["python", "ia", "prompt-engineering", "chain-of-thought"]
---

# Chain of Thought (CoT)

## Introduction

Le **Chain of Thought (CoT)** est une technique de prompt engineering qui encourage le modèle à raisonner étape par étape avant de donner la réponse finale. Cette approche améliore significativement les performances sur les tâches nécessitant un raisonnement complexe.

## Qu'est-ce que le Chain of Thought ?

### Concept

Au lieu de demander directement la réponse, on demande au modèle de montrer son raisonnement étape par étape. Cela permet au modèle de :

- **Mieux comprendre** le problème
- **Organiser sa pensée** de manière logique
- **Éviter les erreurs** de calcul ou de logique
- **Fournir des explications** transparentes

### Pourquoi ça fonctionne ?

Les LLM sont meilleurs pour suivre un raisonnement séquentiel que pour sauter directement à la réponse. Le CoT exploite cette capacité en décomposant les problèmes complexes en étapes simples.

## Types de Chain of Thought

### 1. Zero-Shot CoT

Ajouter "Réfléchis étape par étape" sans exemples :

```python
def zero_shot_cot(probleme):
    prompt = f"""
    Résous ce problème en réfléchissant étape par étape.
    
    Problème: {probleme}
    
    Réfléchis étape par étape, puis donne la réponse finale.
    """
    
    return call_llm(prompt)
```

### 2. Few-Shot CoT

Fournir des exemples de raisonnement étape par étape :

```python
def few_shot_cot(probleme):
    prompt = f"""
    Résous ces problèmes mathématiques en montrant ton raisonnement étape par étape.
    
    Exemple 1:
    Problème: Si 3 pommes coûtent 2€, combien coûtent 12 pommes ?
    
    Raisonnement:
    1. D'abord, je calcule le prix d'une pomme: 2€ / 3 = 0.67€
    2. Ensuite, je multiplie par 12: 0.67€ × 12 = 8€
    
    Réponse: 12 pommes coûtent 8€
    
    Exemple 2:
    Problème: Un train parcourt 240 km en 3 heures. Quelle est sa vitesse moyenne ?
    
    Raisonnement:
    1. La vitesse = distance / temps
    2. Vitesse = 240 km / 3 h = 80 km/h
    
    Réponse: La vitesse moyenne est de 80 km/h
    
    Maintenant, résous ce problème:
    Problème: {probleme}
    
    Raisonnement:
    Réponse:
    """
    
    return call_llm(prompt)
```

## Applications pratiques

### 1. Résolution de problèmes mathématiques

```python
def solve_math_problem(problem):
    prompt = f"""
    Résous ce problème mathématique en montrant toutes les étapes.
    
    Problème: {problem}
    
    Étapes de résolution:
    1. [Identifie les informations données]
    2. [Identifie ce qui est demandé]
    3. [Choisis la méthode/formule appropriée]
    4. [Applique la méthode étape par étape]
    5. [Vérifie ta réponse]
    
    Réponse finale:
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    
    return response.choices[0].message.content
```

### 2. Analyse de code

```python
def analyze_code_cot(code):
    prompt = f"""
    Analyse ce code Python en expliquant ton raisonnement étape par étape.
    
    Code:
    ```python
    {code}
    ```
    
    Analyse étape par étape:
    
    1. Compréhension globale:
    [Explique ce que fait le code dans son ensemble]
    
    2. Analyse ligne par ligne:
    [Analyse chaque partie importante]
    
    3. Identification des problèmes:
    [Liste les bugs, erreurs potentielles]
    
    4. Suggestions d'amélioration:
    [Propose des améliorations avec justification]
    
    5. Code amélioré:
    [Fournis le code amélioré]
    """
    
    return call_llm(prompt)
```

### 3. Debugging de code

```python
def debug_code_cot(code, error_message):
    prompt = f"""
    Débogue ce code en suivant une approche méthodique.
    
    Code:
    ```python
    {code}
    ```
    
    Erreur: {error_message}
    
    Processus de debugging:
    
    1. Compréhension de l'erreur:
    [Explique ce que signifie l'erreur]
    
    2. Localisation du problème:
    [Identifie où se trouve probablement le bug]
    
    3. Analyse de la cause:
    [Explique pourquoi l'erreur se produit]
    
    4. Solution:
    [Propose une solution avec explication]
    
    5. Code corrigé:
    [Fournis le code corrigé]
    
    6. Prévention:
    [Comment éviter ce type d'erreur à l'avenir]
    """
    
    return call_llm(prompt)
```

## Techniques avancées

### Self-Consistency avec CoT

Générer plusieurs chaînes de raisonnement :

```python
def self_consistent_cot(problem, n=5):
    """Génère plusieurs raisonnements et choisit le plus cohérent"""
    client = OpenAI()
    reasoning_chains = []
    
    for i in range(n):
        prompt = f"""
        Résous ce problème en montrant ton raisonnement étape par étape.
        
        Problème: {problem}
        
        Raisonnement étape par étape:
        """
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        reasoning_chains.append(response.choices[0].message.content)
    
    return reasoning_chains[0]
```

### CoT avec vérification

```python
def cot_with_verification(problem):
    prompt = f"""
    Résous ce problème en suivant ces étapes:
    
    Problème: {problem}
    
    1. Compréhension:
    [Explique ce que demande le problème]
    
    2. Plan:
    [Décris ton plan de résolution]
    
    3. Exécution:
    [Résous le problème étape par étape]
    
    4. Vérification:
    [Vérifie ta réponse en recalculant d'une autre manière]
    
    5. Réponse finale:
    [Donne la réponse vérifiée]
    """
    
    return call_llm(prompt)
```

## Bonnes pratiques

### ✅ À faire

- Encourager explicitement le raisonnement étape par étape
- Structurer clairement les étapes
- Demander la vérification pour les tâches importantes
- Utiliser Few-Shot CoT pour les tâches complexes

### ❌ À éviter

- Sauter directement à la réponse
- Étapes trop vagues
- Pas de vérification pour les calculs
- Ignorer les étapes intermédiaires

## Ressources

- **Research Papers** : "Chain-of-Thought Prompting Elicits Reasoning"
- **Exemples** : Collections de prompts CoT

