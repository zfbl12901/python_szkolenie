---
title: "Few-Shot Learning et Exemples"
order: 2
parent: "24-prompt-engineering.md"
tags: ["python", "ia", "prompt-engineering", "few-shot"]
---

# Few-Shot Learning et Exemples

## Introduction

Le **Few-Shot Learning** est une technique de prompt engineering où on fournit au modèle quelques exemples (shots) pour l'aider à comprendre le pattern et la tâche à accomplir. Cette technique est particulièrement efficace pour les tâches spécialisées ou nécessitant un format spécifique.

## Qu'est-ce que le Few-Shot Learning ?

### Concept

Au lieu de laisser le modèle deviner ce que vous voulez (zero-shot), vous lui montrez des exemples de ce que vous attendez. Le modèle apprend le pattern à partir de ces exemples.

### Avantages

- **Précision améliorée** : Le modèle comprend mieux ce qui est attendu
- **Format cohérent** : Les réponses suivent le format des exemples
- **Tâches spécialisées** : Excellent pour les domaines spécifiques
- **Moins d'ambiguïté** : Réduit les malentendus

### Quand l'utiliser

- Tâches avec format spécifique
- Classification personnalisée
- Extraction d'information structurée
- Génération selon un pattern précis

## Structure d'un prompt Few-Shot

### Format de base

```python
prompt_few_shot = """
[Instructions générales]

Exemple 1:
Input: [exemple d'entrée]
Output: [exemple de sortie]

Exemple 2:
Input: [exemple d'entrée]
Output: [exemple de sortie]

Exemple 3:
Input: [exemple d'entrée]
Output: [exemple de sortie]

Maintenant, traite ce cas:
Input: [votre entrée]
Output:
"""
```

## Exemples pratiques

### 1. Classification de sentiment

```python
def classify_sentiment(texte):
    prompt = f"""
    Tu es un expert en analyse de sentiment.
    
    Classe chaque texte comme "Positif", "Négatif" ou "Neutre".
    
    Exemples:
    
    Texte: "J'adore ce produit, il est parfait !"
    Sentiment: Positif
    
    Texte: "Ce produit est décevant et ne fonctionne pas."
    Sentiment: Négatif
    
    Texte: "Le produit est livré dans les temps."
    Sentiment: Neutre
    
    Texte: "C'est le meilleur achat que j'ai fait cette année !"
    Sentiment: Positif
    
    Texte: "Le service client est terrible, je ne recommande pas."
    Sentiment: Négatif
    
    Maintenant, classe ce texte:
    Texte: "{texte}"
    Sentiment:
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3  # Basse température pour plus de cohérence
    )
    
    return response.choices[0].message.content
```

### 2. Extraction d'information structurée

```python
def extract_information(texte):
    prompt = f"""
    Extrais les informations suivantes du texte au format JSON:
    - nom (string)
    - age (int)
    - ville (string)
    - profession (string)
    
    Exemples:
    
    Texte: "Je m'appelle Alice, j'ai 30 ans, je vis à Paris et je suis développeuse."
    JSON: {{"nom": "Alice", "age": 30, "ville": "Paris", "profession": "développeuse"}}
    
    Texte: "Bob, 25 ans, habite à Lyon et travaille comme designer."
    JSON: {{"nom": "Bob", "age": 25, "ville": "Lyon", "profession": "designer"}}
    
    Texte: "Marie est médecin, elle a 35 ans et réside à Marseille."
    JSON: {{"nom": "Marie", "age": 35, "ville": "Marseille", "profession": "médecin"}}
    
    Maintenant, extrais les informations de ce texte:
    Texte: "{texte}"
    JSON:
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    
    import json
    return json.loads(response.choices[0].message.content)
```

### 3. Génération de code selon un pattern

```python
def generate_code_pattern(description):
    prompt = f"""
    Génère du code Python selon ce pattern:
    
    Exemple 1:
    Description: "Fonction pour calculer la moyenne d'une liste"
    Code:
    ```python
    def calculer_moyenne(nombres):
        if not nombres:
            raise ValueError("La liste ne peut pas être vide")
        return sum(nombres) / len(nombres)
    ```
    
    Exemple 2:
    Description: "Fonction pour filtrer les nombres pairs"
    Code:
    ```python
    def filtrer_pairs(nombres):
        return [n for n in nombres if n % 2 == 0]
    ```
    
    Exemple 3:
    Description: "Fonction pour trouver le maximum d'une liste"
    Code:
    ```python
    def trouver_maximum(nombres):
        if not nombres:
            raise ValueError("La liste ne peut pas être vide")
        return max(nombres)
    ```
    
    Maintenant, génère le code pour:
    Description: "{description}"
    Code:
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )
    
    return response.choices[0].message.content
```

### 4. Traduction avec contexte

```python
def translate_with_context(texte, langue_cible):
    prompt = f"""
    Traduis les textes en gardant le contexte et le ton.
    
    Exemples:
    
    Texte: "I'll be back"
    Contexte: Film de science-fiction, citation d'Arnold Schwarzenegger
    Traduction: "Je reviendrai"
    
    Texte: "Break a leg!"
    Contexte: Expression idiomatique anglaise pour souhaiter bonne chance
    Traduction: "Merde !" (expression théâtrale française)
    
    Texte: "It's raining cats and dogs"
    Contexte: Expression idiomatique signifiant qu'il pleut beaucoup
    Traduction: "Il pleut des cordes"
    
    Maintenant, traduis:
    Texte: "{texte}"
    Langue cible: {langue_cible}
    Traduction:
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )
    
    return response.choices[0].message.content
```

## Nombre optimal d'exemples

### Combien d'exemples utiliser ?

**1-2 exemples (One-Shot) :**
- Tâches simples
- Pattern très clair
- Économie de tokens

**3-5 exemples (Few-Shot) :**
- Tâches moyennes
- Bon équilibre précision/coût
- **Recommandé pour la plupart des cas**

**6-10 exemples :**
- Tâches complexes
- Patterns subtils
- Plus coûteux mais plus précis

### Test du nombre optimal

```python
def trouver_nombre_optimal(task_type, test_cases):
    """Teste différents nombres d'exemples pour trouver le meilleur"""
    client = OpenAI()
    resultats = {}
    
    for n_exemples in [1, 3, 5, 7, 10]:
        # Générer n_exemples d'exemples
        exemples = generer_exemples(task_type, n_exemples)
        
        # Tester
        score = 0
        for test_case in test_cases:
            prompt = construire_prompt_few_shot(exemples, test_case)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}]
            )
            # Évaluer la réponse
            if evaluer_reponse(response.choices[0].message.content, test_case):
                score += 1
        
        resultats[n_exemples] = score / len(test_cases)
    
    return max(resultats, key=resultats.get)
```

## Qualité des exemples

### Caractéristiques de bons exemples

1. **Représentatifs** : Couvrent les cas typiques
2. **Diversifiés** : Montrent différentes variations
3. **Clairs** : Faciles à comprendre
4. **Cohérents** : Suivent le même format
5. **Pertinents** : Liés à la tâche

### Exemples de qualité

```python
# ✅ BONS EXEMPLES : Diversifiés et représentatifs
exemples_sentiment = [
    ("J'adore ce produit !", "Positif"),  # Exclamation positive
    ("Ce produit est terrible.", "Négatif"),  # Adjectif négatif
    ("Le produit fonctionne.", "Neutre"),  # Factuel
    ("C'est incroyablement bon !", "Positif"),  # Superlatif positif
    ("Je ne recommande pas.", "Négatif"),  # Négation
]

# ❌ MAUVAIS EXEMPLES : Trop similaires
exemples_mauvais = [
    ("J'aime ce produit.", "Positif"),
    ("J'adore ce produit.", "Positif"),
    ("J'apprécie ce produit.", "Positif"),  # Tous positifs, pas de diversité
]
```

## Techniques avancées

### 1. Dynamic Few-Shot

Sélectionner dynamiquement les exemples les plus pertinents :

```python
def dynamic_few_shot(query, all_examples, k=5):
    """Sélectionne les k exemples les plus pertinents"""
    # Calculer la similarité entre query et chaque exemple
    similarities = []
    for example in all_examples:
        similarity = calculate_similarity(query, example)
        similarities.append((similarity, example))
    
    # Trier et prendre les k meilleurs
    similarities.sort(reverse=True)
    selected_examples = [ex for _, ex in similarities[:k]]
    
    return construire_prompt(selected_examples, query)
```

### 2. Few-Shot avec raisonnement

Ajouter le raisonnement dans les exemples :

```python
prompt_with_reasoning = """
Analyse ce code et identifie les bugs.

Exemple 1:
Code:
```python
def divise(a, b):
    return a / b
```

Raisonnement:
- Le code ne vérifie pas si b est zéro
- Cela causera une ZeroDivisionError
- Il faut ajouter une vérification

Bugs:
1. Pas de vérification de division par zéro

Exemple 2:
Code:
```python
def get_item(liste, index):
    return liste[index]
```

Raisonnement:
- Pas de vérification si l'index est valide
- IndexError possible si index >= len(liste)
- Pas de gestion des index négatifs

Bugs:
1. Pas de vérification des limites de la liste

Maintenant, analyse ce code:
Code: {code}
Raisonnement:
Bugs:
"""
```

### 3. Few-Shot avec contre-exemples

Inclure des exemples de ce qu'il ne faut PAS faire :

```python
prompt_with_negative = """
Génère une fonction Python pour calculer la factorielle.

Exemples corrects:

Input: "Fonction factorielle itérative"
Output:
```python
def factorielle(n):
    if n < 0:
        raise ValueError("n doit être positif")
    resultat = 1
    for i in range(1, n + 1):
        resultat *= i
    return resultat
```

Input: "Fonction factorielle récursive"
Output:
```python
def factorielle(n):
    if n < 0:
        raise ValueError("n doit être positif")
    if n <= 1:
        return 1
    return n * factorielle(n - 1)
```

Contre-exemple (à éviter):

Input: "Fonction factorielle"
Output:
```python
def factorielle(n):
    return n * factorielle(n - 1)  # ❌ Pas de cas de base, récursion infinie
```

Maintenant, génère:
Input: "{description}"
Output:
"""
```

## Optimisation des prompts Few-Shot

### 1. Ordre des exemples

L'ordre peut influencer les résultats :

```python
# ✅ BON : Commencer par les exemples les plus clairs
exemples_ordre = [
    exemple_simple_et_clair,  # Premier
    exemple_representatif,     # Deuxième
    exemple_complexe,          # Dernier
]

# ❌ MAUVAIS : Ordre aléatoire
exemples_desordre = [
    exemple_complexe,         # Peut confondre
    exemple_simple,
    exemple_representatif,
]
```

### 2. Format cohérent

Maintenir un format cohérent :

```python
# ✅ BON : Format cohérent
template = """
Exemple {num}:
Input: {input}
Output: {output}
"""

# ❌ MAUVAIS : Formats différents
# Exemple 1: Input: ... Output: ...
# Exemple 2: Question: ... Réponse: ...
# Exemple 3: Texte: ... Résultat: ...
```

### 3. Longueur des exemples

Équilibrer la longueur :

```python
# ✅ BON : Exemples de longueur similaire
exemples = [
    ("Court", "Court"),      # ~10 tokens
    ("Moyen texte", "Moyen"), # ~15 tokens
    ("Texte un peu plus long", "Long"), # ~20 tokens
]

# ❌ MAUVAIS : Très différents
exemples = [
    ("Court", "Court"),  # 10 tokens
    ("Très très très long texte avec beaucoup de détails...", "Long"),  # 100 tokens
]
```

## Cas d'usage avancés

### Classification multi-classe

```python
def multi_class_classification(texte, categories):
    prompt = f"""
    Classe ce texte dans une de ces catégories: {', '.join(categories)}
    
    Exemples:
    
    Texte: "Comment installer Python sur Windows ?"
    Catégorie: Installation
    
    Texte: "Quelle est la différence entre une liste et un tuple ?"
    Catégorie: Concepts
    
    Texte: "Mon code ne fonctionne pas, voici l'erreur..."
    Catégorie: Debugging
    
    Texte: "Comment optimiser les performances de mon script ?"
    Catégorie: Performance
    
    Maintenant, classe:
    Texte: "{texte}"
    Catégorie:
    """
    
    return call_llm(prompt)
```

### Génération de tests

```python
def generate_tests(function_code):
    prompt = f"""
    Génère des tests unitaires pour cette fonction.
    
    Exemple 1:
    Fonction:
    ```python
    def addition(a, b):
        return a + b
    ```
    
    Tests:
    ```python
    def test_addition_positifs():
        assert addition(2, 3) == 5
    
    def test_addition_negatifs():
        assert addition(-1, -2) == -3
    
    def test_addition_mixte():
        assert addition(5, -3) == 2
    ```
    
    Exemple 2:
    Fonction:
    ```python
    def diviser(a, b):
        if b == 0:
            raise ValueError("Division par zéro")
        return a / b
    ```
    
    Tests:
    ```python
    def test_diviser_normale():
        assert diviser(10, 2) == 5
    
    def test_diviser_zero():
        with pytest.raises(ValueError):
            diviser(10, 0)
    ```
    
    Maintenant, génère des tests pour:
    Fonction:
    ```python
    {function_code}
    ```
    
    Tests:
    """
    
    return call_llm(prompt)
```

## Bonnes pratiques

### ✅ À faire

- Utiliser 3-5 exemples pour la plupart des cas
- Choisir des exemples représentatifs et diversifiés
- Maintenir un format cohérent
- Tester différents nombres d'exemples
- Documenter les exemples efficaces

### ❌ À éviter

- Trop d'exemples (coûteux, peut confondre)
- Exemples trop similaires
- Formats incohérents
- Exemples non représentatifs
- Ne pas tester l'impact

## Ressources

- **Research Papers** : Papers sur le few-shot learning
- **Exemples** : Collections d'exemples de prompts
- **Outils** : Libraries pour gérer les exemples
