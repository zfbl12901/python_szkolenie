---
title: "Fonctions lambda (et quand ne PAS les utiliser)"
order: 2.03.05
parent: "02-03-fonctions-citoyens-premiere-classe.md"
tags: ["python", "lambda", "fonctions"]
---

# Fonctions lambda (et quand ne PAS les utiliser)

Les fonctions lambda permettent de créer des fonctions anonymes, mais elles ne sont pas toujours la meilleure solution. Comprendre quand les utiliser et quand les éviter est essentiel pour écrire du code Pythonic.

## Concepts de base

Une fonction **lambda** est une fonction anonyme (sans nom) définie avec le mot-clé `lambda`. Elle peut prendre des arguments et retourner une valeur, mais est limitée à une seule expression.

### Syntaxe de base

```python
# Syntaxe : lambda arguments: expression

# Fonction normale
def additionner(a, b):
    return a + b

# Fonction lambda équivalente
additionner = lambda a, b: a + b

# Utilisation identique
print(additionner(5, 3))  # 8
```

### Caractéristiques

- **Anonyme** : Pas de nom (sauf si assignée à une variable)
- **Une seule expression** : Pas de `return` explicite, pas de blocs multiples
- **Limite** : Ne peut contenir que des expressions, pas des statements

```python
# ✅ Valide : une expression
carre = lambda x: x ** 2

# ❌ Invalide : plusieurs statements
# lambda x: print(x); return x * 2  # SyntaxError

# ❌ Invalide : if/else complexe
# lambda x: if x > 0: return x else: return -x  # SyntaxError
```

## Quand utiliser les lambda

### 1. Fonctions de courte durée (callbacks)

Les lambda sont parfaites pour des fonctions simples utilisées une seule fois :

```python
# Avec sorted()
nombres = [3, 1, 4, 1, 5, 9, 2, 6]
tri_par_carre = sorted(nombres, key=lambda x: x ** 2)
print(tri_par_carre)  # [1, 1, 2, 3, 4, 5, 6, 9]

# Avec map()
nombres = [1, 2, 3, 4, 5]
carres = list(map(lambda x: x ** 2, nombres))
print(carres)  # [1, 4, 9, 16, 25]

# Avec filter()
nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
pairs = list(filter(lambda x: x % 2 == 0, nombres))
print(pairs)  # [2, 4, 6, 8, 10]
```

### 2. Fonctions de tri personnalisées

```python
# Tri par longueur de chaîne
mots = ["python", "java", "c", "javascript", "go"]
tri_par_longueur = sorted(mots, key=lambda mot: len(mot))
print(tri_par_longueur)  # ['c', 'go', 'java', 'python', 'javascript']

# Tri par attribut d'objet
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

personnes = [
    Personne("Alice", 30),
    Personne("Bob", 25),
    Personne("Charlie", 35)
]

tri_par_age = sorted(personnes, key=lambda p: p.age)
for p in tri_par_age:
    print(f"{p.nom}: {p.age}")
```

### 3. Fonctions de transformation simples

```python
# Transformation simple
nombres = [1, 2, 3, 4, 5]
doubles = list(map(lambda x: x * 2, nombres))
print(doubles)  # [2, 4, 6, 8, 10]

# Avec plusieurs arguments
a = [1, 2, 3]
b = [4, 5, 6]
sommes = list(map(lambda x, y: x + y, a, b))
print(sommes)  # [5, 7, 9]
```

### 4. Dans les list comprehensions (rare)

```python
# Généralement, les list comprehensions sont préférables
nombres = [1, 2, 3, 4, 5]
carres = [x ** 2 for x in nombres]  # ✅ Préférable

# Mais parfois lambda peut être utile
fonctions = [lambda x: x * i for i in range(5)]
# ⚠️ Attention au piège des closures (voir section closures)
```

## Quand NE PAS utiliser les lambda

### 1. Fonctions complexes

```python
# ❌ Lambda trop complexe (illisible)
trier = lambda x: sorted(x, key=lambda y: (y[1], -y[0])) if isinstance(x, list) else x

# ✅ Fonction normale (lisible)
def trier_complexe(x):
    if not isinstance(x, list):
        return x
    return sorted(x, key=lambda y: (y[1], -y[0]))
```

### 2. Fonctions réutilisables

```python
# ❌ Lambda assignée à une variable (utilisez def)
additionner = lambda a, b: a + b

# ✅ Fonction normale
def additionner(a, b):
    return a + b
```

**Règle** : Si vous devez donner un nom à une lambda, utilisez `def` à la place.

### 3. Fonctions avec documentation

```python
# ❌ Lambda ne peut pas avoir de docstring
calculer = lambda x: x * 2

# ✅ Fonction normale avec documentation
def calculer(x):
    """
    Multiplie un nombre par 2.
    
    Args:
        x: Nombre à multiplier
        
    Returns:
        Le nombre multiplié par 2
    """
    return x * 2
```

### 4. Fonctions avec plusieurs expressions

```python
# ❌ Impossible avec lambda
def traiter_donnees(donnees):
    if not donnees:
        return []
    resultat = []
    for item in donnees:
        if item > 0:
            resultat.append(item * 2)
    return resultat

# Lambda ne peut pas faire ça
```

### 5. Débogage difficile

```python
# ❌ Lambda : pas de nom pour le débogage
fonctions = [lambda x: x * i for i in range(3)]
# En cas d'erreur, difficile de savoir quelle lambda a échoué

# ✅ Fonction normale : nom clair
def multiplier_par_i(x, i):
    return x * i

fonctions = [lambda x, i=i: multiplier_par_i(x, i) for i in range(3)]
```

## Alternatives aux lambda

### 1. List comprehensions (souvent meilleur)

```python
# ❌ Lambda avec map
nombres = [1, 2, 3, 4, 5]
carres = list(map(lambda x: x ** 2, nombres))

# ✅ List comprehension (plus Pythonic)
carres = [x ** 2 for x in nombres]

# ❌ Lambda avec filter
pairs = list(filter(lambda x: x % 2 == 0, nombres))

# ✅ List comprehension avec condition
pairs = [x for x in nombres if x % 2 == 0]
```

### 2. Fonctions normales

```python
# ❌ Lambda complexe
trier = lambda personnes: sorted(personnes, key=lambda p: (p.age, p.nom))

# ✅ Fonction normale
def trier_personnes(personnes):
    """Trie les personnes par âge puis par nom."""
    return sorted(personnes, key=lambda p: (p.age, p.nom))
```

### 3. operator module

Pour des opérations simples, le module `operator` peut être plus clair :

```python
from operator import add, mul, itemgetter, attrgetter

# ❌ Lambda
somme = lambda a, b: a + b
produit = lambda a, b: a * b

# ✅ operator module
somme = add
produit = mul

# Avec sorted
personnes = [("Alice", 30), ("Bob", 25)]
tri_par_age = sorted(personnes, key=itemgetter(1))  # Plus clair que lambda

# Avec attributs
tri_par_age = sorted(personnes, key=attrgetter('age'))
```

## Pièges courants

### Piège 1 : Variables capturées dans les boucles

```python
# ❌ Problème classique
fonctions = [lambda x: x * i for i in range(3)]
for f in fonctions:
    print(f(2))  # 4, 4, 4 ⚠️ Toutes utilisent i=2 (dernière valeur)

# ✅ Solution 1 : valeur par défaut
fonctions = [lambda x, i=i: x * i for i in range(3)]
for f in fonctions:
    print(f(2))  # 0, 2, 4 ✅

# ✅ Solution 2 : fonction normale
def creer_multiplicateur(i):
    return lambda x: x * i

fonctions = [creer_multiplicateur(i) for i in range(3)]
for f in fonctions:
    print(f(2))  # 0, 2, 4 ✅
```

### Piège 2 : Lambda trop complexes

```python
# ❌ Illisible
process = lambda x: (x * 2 if x > 0 else 0) if isinstance(x, (int, float)) else None

# ✅ Lisible
def process(x):
    if not isinstance(x, (int, float)):
        return None
    return x * 2 if x > 0 else 0
```

### Piège 3 : Assignation à une variable

```python
# ❌ Si vous assignez, utilisez def
additionner = lambda a, b: a + b

# ✅ Préférable
def additionner(a, b):
    return a + b
```

## Bonnes pratiques

### 1. Utilisez lambda pour des fonctions très simples et courtes

```python
# ✅ OK : très simple
tri = sorted(nombres, key=lambda x: abs(x))

# ❌ Trop complexe
tri = sorted(nombres, key=lambda x: abs(x) if x != 0 else float('inf'))
```

### 2. Préférez les list comprehensions

```python
# ✅ List comprehension
carres = [x ** 2 for x in nombres if x > 0]

# ⚠️ Lambda avec map et filter (moins lisible)
carres = list(map(lambda x: x ** 2, filter(lambda x: x > 0, nombres)))
```

### 3. Utilisez def pour les fonctions nommées

```python
# ❌ Lambda nommée
additionner = lambda a, b: a + b

# ✅ Fonction normale
def additionner(a, b):
    return a + b
```

### 4. Documentez avec des fonctions normales

```python
# ❌ Lambda ne peut pas être documentée
calculer = lambda x: x * 2

# ✅ Fonction documentée
def calculer(x):
    """Multiplie par 2."""
    return x * 2
```

## Exemples pratiques

### Exemple 1 : Tri personnalisé

```python
# Tri par plusieurs critères
personnes = [
    {"nom": "Alice", "age": 30, "score": 85},
    {"nom": "Bob", "age": 25, "score": 90},
    {"nom": "Charlie", "age": 30, "score": 80}
]

# Tri par âge puis par score (décroissant)
tri = sorted(personnes, key=lambda p: (p["age"], -p["score"]))
for p in tri:
    print(p)
```

### Exemple 2 : Filtrage et transformation

```python
# Filtrer et transformer en une ligne (mais list comprehension est mieux)
nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
carres_pairs = list(map(lambda x: x ** 2, filter(lambda x: x % 2 == 0, nombres)))

# ✅ Mieux avec list comprehension
carres_pairs = [x ** 2 for x in nombres if x % 2 == 0]
```

### Exemple 3 : Callbacks simples

```python
def appliquer_operation(nombres, operation):
    """Applique une opération à une liste de nombres."""
    return [operation(n) for n in nombres]

# Utilisation avec lambda
resultat = appliquer_operation([1, 2, 3, 4], lambda x: x ** 2)
print(resultat)  # [1, 4, 9, 16]
```

## Points clés à retenir

- ✅ Utilisez **lambda** pour des fonctions **très simples** et **courtes**
- ✅ Utilisez **lambda** dans des contextes où la fonction n'est utilisée **qu'une fois**
- ✅ **Évitez lambda** si vous devez lui donner un nom (utilisez `def`)
- ✅ **Évitez lambda** pour des fonctions complexes (utilisez `def`)
- ✅ **Préférez les list comprehensions** aux lambda avec `map`/`filter`
- ✅ Attention au **piège des variables capturées** dans les boucles
- ✅ Les lambda ne peuvent contenir qu'**une seule expression**
- ✅ Les lambda ne peuvent pas avoir de **docstring**

Les fonctions lambda sont un outil utile, mais souvent surutilisé. En Python, les list comprehensions et les fonctions normales sont généralement plus lisibles et plus Pythonic. Utilisez lambda avec parcimonie, seulement quand cela améliore vraiment la lisibilité.
