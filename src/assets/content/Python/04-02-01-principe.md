---
title: "Principe"
order: 4.02.01
parent: "04-02-decorateurs.md"
tags: ["python", "decorateurs", "principe", "fonctions"]
---

# Principe

Comprendre le principe fondamental des décorateurs est essentiel pour les utiliser et les créer efficacement. Les décorateurs sont l'un des concepts les plus élégants et puissants de Python.

## Concepts de base

Un **décorateur** est une fonction qui prend une fonction en paramètre et retourne une nouvelle fonction, généralement en ajoutant ou modifiant le comportement de la fonction originale. Les décorateurs exploitent le fait que les fonctions sont des objets de première classe en Python.

## Fonctions comme objets

### Les fonctions sont des objets

En Python, les fonctions sont des objets comme les autres :

```python
def ma_fonction():
    return "Hello"

# Fonction comme objet
print(type(ma_fonction))  # <class 'function'>
print(ma_fonction)        # <function ma_fonction at 0x...>

# Assignation
autre_reference = ma_fonction
print(autre_reference())  # "Hello"

# Passage en paramètre
def appeler_fonction(func):
    return func()

print(appeler_fonction(ma_fonction))  # "Hello"
```

### Fonctions dans des structures de données

```python
def additionner(a, b):
    return a + b

def multiplier(a, b):
    return a * b

# Liste de fonctions
operations = [additionner, multiplier]

for op in operations:
    print(op(5, 3))  # 8, puis 15
```

### Fonctions retournées par des fonctions

```python
def creer_fonction():
    def fonction_interne():
        return "Fonction interne"
    return fonction_interne

fonction = creer_fonction()
print(fonction())  # "Fonction interne"
```

## Syntaxe @decorator

### Syntaxe de base

La syntaxe `@decorator` est un sucre syntaxique qui simplifie l'utilisation des décorateurs :

```python
def mon_decorateur(func):
    def wrapper():
        print("Avant l'appel")
        resultat = func()
        print("Après l'appel")
        return resultat
    return wrapper

# Avec @decorator (syntaxe recommandée)
@mon_decorateur
def ma_fonction():
    print("Fonction exécutée")
    return "Résultat"

# Équivalent à :
# ma_fonction = mon_decorateur(ma_fonction)

ma_fonction()
# Avant l'appel
# Fonction exécutée
# Après l'appel
```

### Ce qui se passe réellement

```python
# Ce que vous écrivez
@mon_decorateur
def ma_fonction():
    pass

# Ce que Python fait réellement
def ma_fonction():
    pass
ma_fonction = mon_decorateur(ma_fonction)
```

## Décorateurs simples

### Exemple 1 : Décorateur de timing

```python
import time

def mesurer_temps(func):
    """Décorateur qui mesure le temps d'exécution."""
    def wrapper(*args, **kwargs):
        start = time.time()
        resultat = func(*args, **kwargs)
        temps = time.time() - start
        print(f"{func.__name__} a pris {temps:.4f} secondes")
        return resultat
    return wrapper

@mesurer_temps
def fonction_lente():
    time.sleep(1)
    return "Terminé"

resultat = fonction_lente()
# fonction_lente a pris 1.0000 secondes
```

### Exemple 2 : Décorateur de logging

```python
def logger(func):
    """Décorateur qui log les appels de fonction."""
    def wrapper(*args, **kwargs):
        print(f"Appel de {func.__name__} avec args={args}, kwargs={kwargs}")
        resultat = func(*args, **kwargs)
        print(f"{func.__name__} a retourné {resultat}")
        return resultat
    return wrapper

@logger
def additionner(a, b):
    return a + b

resultat = additionner(5, 3)
# Appel de additionner avec args=(5, 3), kwargs={}
# additionner a retourné 8
```

### Exemple 3 : Décorateur de validation

```python
def valider_positif(func):
    """Décorateur qui valide que les arguments sont positifs."""
    def wrapper(*args, **kwargs):
        for arg in args:
            if isinstance(arg, (int, float)) and arg < 0:
                raise ValueError(f"Argument négatif: {arg}")
        return func(*args, **kwargs)
    return wrapper

@valider_positif
def racine_carree(n):
    return n ** 0.5

print(racine_carree(16))  # 4.0
# print(racine_carree(-4))  # ValueError: Argument négatif: -4
```

## Exemples de base

### Exemple complet : Décorateur de cache

```python
def cache(func):
    """Décorateur qui met en cache les résultats."""
    cache_dict = {}
    
    def wrapper(*args, **kwargs):
        # Crée une clé à partir des arguments
        cle = str(args) + str(sorted(kwargs.items()))
        
        if cle in cache_dict:
            print(f"Cache hit pour {func.__name__}")
            return cache_dict[cle]
        
        print(f"Calcul pour {func.__name__}")
        resultat = func(*args, **kwargs)
        cache_dict[cle] = resultat
        return resultat
    
    return wrapper

@cache
def calculer_carre(n):
    return n ** 2

print(calculer_carre(5))  # Calcul pour calculer_carre, 25
print(calculer_carre(5))  # Cache hit pour calculer_carre, 25
```

### Exemple : Décorateur de retry

```python
import time
import random

def retry(max_tentatives=3, delai=1):
    """Décorateur qui réessaie en cas d'échec."""
    def decorateur(func):
        def wrapper(*args, **kwargs):
            for tentative in range(max_tentatives):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if tentative == max_tentatives - 1:
                        raise
                    print(f"Tentative {tentative + 1} échouée: {e}")
                    time.sleep(delai)
        return wrapper
    return decorateur

@retry(max_tentatives=3, delai=0.5)
def fonction_risquee():
    if random.random() < 0.7:
        raise ValueError("Échec aléatoire")
    return "Succès"

resultat = fonction_risquee()
```

## Préservation des métadonnées

### Problème : Perte des métadonnées

```python
def mon_decorateur(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@mon_decorateur
def ma_fonction():
    """Documentation de ma fonction."""
    pass

print(ma_fonction.__name__)  # "wrapper" ⚠️ Pas "ma_fonction"
print(ma_fonction.__doc__)   # None ⚠️ Documentation perdue
```

### Solution : functools.wraps

```python
from functools import wraps

def mon_decorateur(func):
    @wraps(func)  # ✅ Préserve les métadonnées
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@mon_decorateur
def ma_fonction():
    """Documentation de ma fonction."""
    pass

print(ma_fonction.__name__)  # "ma_fonction" ✅
print(ma_fonction.__doc__)   # "Documentation de ma fonction." ✅
```

## Décorateurs multiples

Vous pouvez appliquer plusieurs décorateurs :

```python
def decorateur1(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("Décorateur 1")
        return func(*args, **kwargs)
    return wrapper

def decorateur2(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("Décorateur 2")
        return func(*args, **kwargs)
    return wrapper

@decorateur1
@decorateur2
def ma_fonction():
    print("Fonction")

ma_fonction()
# Décorateur 1
# Décorateur 2
# Fonction
```

L'ordre est important : les décorateurs sont appliqués de bas en haut.

## Points clés à retenir

- ✅ Un **décorateur** est une fonction qui prend une fonction et retourne une fonction
- ✅ La syntaxe `@decorator` est un sucre syntaxique pour `func = decorator(func)`
- ✅ Les fonctions sont des **objets de première classe** en Python
- ✅ Utilisez `@wraps` de `functools` pour **préserver les métadonnées**
- ✅ Les décorateurs sont appliqués de **bas en haut** quand multiples
- ✅ Les décorateurs permettent d'**ajouter du comportement** sans modifier la fonction originale
- ✅ Très utile pour le **logging**, **cache**, **validation**, **timing**, etc.

Les décorateurs sont un outil puissant qui permet d'écrire du code plus modulaire et réutilisable. Maîtriser ce concept est essentiel pour devenir un expert Python.
