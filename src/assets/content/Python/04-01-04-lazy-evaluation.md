---
title: "Lazy evaluation"
order: 4.01.04
parent: "04-01-iterateurs-et-generateurs.md"
tags: ["python", "lazy", "evaluation", "performance"]
---

# Lazy evaluation

L'évaluation paresseuse (lazy evaluation) consiste à ne calculer les valeurs que lorsqu'elles sont nécessaires, optimisant ainsi la mémoire et les performances. C'est un concept fondamental en Python, notamment avec les générateurs.

## Concepts de base

L'**évaluation paresseuse** (lazy evaluation) s'oppose à l'**évaluation stricte** (eager evaluation) :

- **Évaluation stricte** : Toutes les valeurs sont calculées immédiatement
- **Évaluation paresseuse** : Les valeurs sont calculées seulement quand elles sont demandées

Python utilise principalement l'évaluation stricte, mais les générateurs permettent l'évaluation paresseuse.

## Principe de l'évaluation paresseuse

### Évaluation stricte (eager)

```python
# Évaluation stricte : tout est calculé immédiatement
liste = [i ** 2 for i in range(1000000)]
# Tous les 1 million de carrés sont calculés maintenant

# Utilisation
print(liste[0])  # 0 (déjà calculé)
```

### Évaluation paresseuse (lazy)

```python
# Évaluation paresseuse : calculé à la demande
gen = (i ** 2 for i in range(1000000))
# Rien n'est calculé encore

# Utilisation
print(next(gen))  # 0 (calculé maintenant)
print(next(gen))  # 1 (calculé maintenant)
# Seulement les valeurs demandées sont calculées
```

## Avantages

### 1. Économie de mémoire

```python
import sys

# Évaluation stricte : toute la liste en mémoire
liste = [i ** 2 for i in range(1000000)]
print(sys.getsizeof(liste) / 1024 / 1024)  # ~8 MB

# Évaluation paresseuse : seulement l'objet générateur
gen = (i ** 2 for i in range(1000000))
print(sys.getsizeof(gen) / 1024)  # ~0.1 KB
```

### 2. Calculs évités

Si vous n'utilisez pas toutes les valeurs, les calculs inutiles sont évités :

```python
def carres_eager(n):
    """Évaluation stricte."""
    resultat = []
    for i in range(n):
        print(f"Calcul de {i}²")
        resultat.append(i ** 2)
    return resultat

def carres_lazy(n):
    """Évaluation paresseuse."""
    for i in range(n):
        print(f"Calcul de {i}²")
        yield i ** 2

# Évaluation stricte : tous calculés
liste = carres_eager(10)
print(liste[0])  # Tous les 10 calculs déjà faits

# Évaluation paresseuse : seulement ce qui est demandé
gen = carres_lazy(10)
print(next(gen))  # Seulement 1 calcul
print(next(gen))  # Seulement 1 calcul de plus
```

### 3. Séquences infinies

L'évaluation paresseuse permet des séquences infinies :

```python
def nombres_naturels():
    """Génère les nombres naturels à l'infini."""
    i = 0
    while True:
        yield i
        i += 1

gen = nombres_naturels()
for i, nombre in enumerate(gen):
    if i >= 10:
        break
    print(nombre)  # 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

### 4. Pipeline efficace

Les pipelines avec évaluation paresseuse sont très efficaces :

```python
def nombres():
    for i in range(1000000):
        yield i

def filtrer_pairs(gen):
    for n in gen:
        if n % 2 == 0:
            yield n

def multiplier(gen, facteur):
    for n in gen:
        yield n * facteur

# Pipeline : tout est paresseux
pipeline = multiplier(filtrer_pairs(nombres()), 3)

# Seulement les 5 premières valeurs sont calculées
for i, valeur in enumerate(pipeline):
    if i >= 5:
        break
    print(valeur)  # 0, 6, 12, 18, 24
```

## Cas d'usage

### 1. Traitement de fichiers volumineux

```python
def lire_fichier_lazy(nom_fichier):
    """Lit un fichier ligne par ligne (paresseux)."""
    with open(nom_fichier) as f:
        for ligne in f:
            yield ligne.rstrip('\n')

# Traitement ligne par ligne sans charger tout en mémoire
for ligne in lire_fichier_lazy("gros_fichier.txt"):
    if "erreur" in ligne:
        print(ligne)  # Traite seulement les lignes nécessaires
```

### 2. Filtrage et transformation

```python
def filtrer_lazy(iterable, condition):
    """Filtre paresseusement."""
    for item in iterable:
        if condition(item):
            yield item

def transformer_lazy(iterable, fonction):
    """Transforme paresseusement."""
    for item in iterable:
        yield fonction(item)

# Pipeline paresseux
nombres = range(1000000)
pairs = filtrer_lazy(nombres, lambda x: x % 2 == 0)
carres = transformer_lazy(pairs, lambda x: x ** 2)

# Seulement les 10 premières valeurs sont calculées
for i, valeur in enumerate(carres):
    if i >= 10:
        break
    print(valeur)
```

### 3. Génération de données à la demande

```python
def generer_donnees_lazy(n):
    """Génère des données seulement quand demandées."""
    for i in range(n):
        # Calcul coûteux simulé
        donnee = calcul_complexe(i)
        yield donnee

# Utilisation
gen = generer_donnees_lazy(1000000)
for i, donnee in enumerate(gen):
    if i >= 100:  # Seulement 100 calculs effectués
        break
    traiter(donnee)
```

## Exemples pratiques

### Exemple 1 : range() est paresseux

```python
# range() est un générateur-like (paresseux)
r = range(1000000)
print(sys.getsizeof(r))  # Très petit (pas toutes les valeurs)

# Conversion en liste (évaluation stricte)
liste = list(r)
print(sys.getsizeof(liste))  # Très grand (toutes les valeurs)
```

### Exemple 2 : map() et filter() sont paresseux

```python
# map() et filter() retournent des itérateurs (paresseux)
nombres = range(1000000)
carres = map(lambda x: x ** 2, nombres)  # Paresseux
pairs = filter(lambda x: x % 2 == 0, carres)  # Paresseux

# Rien n'est calculé jusqu'à l'itération
for i, valeur in enumerate(pairs):
    if i >= 10:
        break
    print(valeur)  # Seulement 10 valeurs calculées
```

### Exemple 3 : List comprehension vs Generator expression

```python
# List comprehension : évaluation stricte
liste = [i ** 2 for i in range(1000000)]  # Tout calculé

# Generator expression : évaluation paresseuse
gen = (i ** 2 for i in range(1000000))  # Rien calculé

# Utilisation
print(liste[0])  # Déjà calculé
print(next(gen))  # Calculé maintenant
```

### Exemple 4 : Pipeline de traitement

```python
def pipeline_lazy(donnees):
    """Pipeline avec évaluation paresseuse."""
    # Étape 1 : Filtrer
    etape1 = (x for x in donnees if x > 0)
    
    # Étape 2 : Transformer
    etape2 = (x ** 2 for x in etape1)
    
    # Étape 3 : Filtrer à nouveau
    etape3 = (x for x in etape2 if x < 100)
    
    return etape3

# Utilisation
donnees = range(-50, 50)
resultat = pipeline_lazy(donnees)

# Seulement les valeurs nécessaires sont calculées
for valeur in resultat:
    print(valeur)  # Traitement paresseux
```

## Comparaison avec d'autres langages

### Haskell (évaluation paresseuse par défaut)

```haskell
-- Haskell : évaluation paresseuse par défaut
infiniteList = [1..]  -- Liste infinie, OK
take 10 infiniteList  -- Prend seulement 10 éléments
```

### Python (évaluation stricte par défaut)

```python
# Python : évaluation stricte par défaut
# liste = list(range(float('inf')))  # ❌ Impossible

# Mais avec les générateurs (paresseux)
def infinite_gen():
    i = 1
    while True:
        yield i
        i += 1

gen = infinite_gen()
premiers_10 = [next(gen) for _ in range(10)]  # ✅ Possible
```

## Bonnes pratiques

### 1. Utilisez l'évaluation paresseuse pour les grandes séquences

```python
# ✅ Générateur (paresseux)
def traiter_donnees():
    for i in range(1000000):
        yield traiter(i)

# ❌ Liste (strict)
def traiter_donnees_liste():
    return [traiter(i) for i in range(1000000)]
```

### 2. Créez des pipelines paresseux

```python
# ✅ Pipeline paresseux
def pipeline(donnees):
    etape1 = filtrer(donnees)
    etape2 = transformer(etape1)
    etape3 = agreger(etape2)
    return etape3  # Tout est paresseux
```

### 3. Convertissez en liste seulement si nécessaire

```python
gen = (i ** 2 for i in range(10))

# ✅ Conversion seulement si besoin
if besoin_liste:
    liste = list(gen)
else:
    for valeur in gen:
        traiter(valeur)
```

## Points clés à retenir

- ✅ **Évaluation paresseuse** : Calcul seulement quand nécessaire
- ✅ **Évaluation stricte** : Calcul immédiat de toutes les valeurs
- ✅ Les **générateurs** permettent l'évaluation paresseuse en Python
- ✅ L'évaluation paresseuse **économise la mémoire** et **évite les calculs inutiles**
- ✅ Permet les **séquences infinies** et les **pipelines efficaces**
- ✅ `range()`, `map()`, `filter()` sont **paresseux** en Python 3
- ✅ Les **list comprehensions** sont strictes, les **generator expressions** sont paresseuses
- ✅ Convertissez en liste seulement si **nécessaire**

L'évaluation paresseuse est un concept puissant qui permet d'optimiser la mémoire et les performances. Comprendre quand et comment l'utiliser vous permettra d'écrire du code plus efficace.
