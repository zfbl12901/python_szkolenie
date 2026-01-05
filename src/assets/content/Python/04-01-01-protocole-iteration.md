---
title: "Protocole d'itération"
order: 4.01.01
parent: "04-01-iterateurs-et-generateurs.md"
tags: ["python", "iteration", "iterateur", "protocol"]
---

# Protocole d'itération

Le protocole d'itération définit comment Python parcourt les objets de manière uniforme, que ce soit une liste, un dictionnaire ou un objet personnalisé. Comprendre ce protocole est essentiel pour maîtriser les itérateurs et générateurs.

## Concepts de base

En Python, l'itération est partout : `for` loops, list comprehensions, `map()`, `filter()`, etc. Tous ces mécanismes utilisent le **protocole d'itération**, qui définit comment Python accède séquentiellement aux éléments d'un objet.

Le protocole d'itération repose sur deux concepts clés :
- **Itérable** : Un objet qui peut être parcouru (a une méthode `__iter__()`)
- **Itérateur** : Un objet qui produit les valeurs une par une (a une méthode `__next__()`)

## Le protocole iterator

### Comment Python itère

Quand vous écrivez `for item in sequence:`, Python fait ceci :

1. Appelle `iter(sequence)` pour obtenir un itérateur
2. Appelle `next(iterator)` à chaque itération pour obtenir la valeur suivante
3. Continue jusqu'à ce que `next()` lève `StopIteration`

```python
# Ce que vous écrivez
for item in [1, 2, 3]:
    print(item)

# Ce que Python fait réellement
sequence = [1, 2, 3]
iterator = iter(sequence)  # Appelle sequence.__iter__()
try:
    while True:
        item = next(iterator)  # Appelle iterator.__next__()
        print(item)
except StopIteration:
    pass  # Fin de l'itération
```

## __iter__ et __next__

### Méthode __iter__

La méthode `__iter__()` doit retourner un objet itérateur. Pour la plupart des objets, elle retourne `self` si l'objet est son propre itérateur, ou un nouvel itérateur.

```python
class MaListe:
    def __init__(self, elements):
        self.elements = elements
    
    def __iter__(self):
        """Retourne un itérateur pour cette liste."""
        return iter(self.elements)  # Utilise l'itérateur de la liste interne

ma_liste = MaListe([1, 2, 3])
for item in ma_liste:
    print(item)  # 1, 2, 3
```

### Méthode __next__

La méthode `__next__()` retourne la valeur suivante ou lève `StopIteration` quand il n'y a plus d'éléments.

```python
class Compteur:
    def __init__(self, max_val):
        self.max_val = max_val
        self.current = 0
    
    def __iter__(self):
        """L'objet est son propre itérateur."""
        return self
    
    def __next__(self):
        """Retourne la valeur suivante."""
        if self.current < self.max_val:
            self.current += 1
            return self.current - 1
        else:
            raise StopIteration  # Signale la fin de l'itération

# Utilisation
compteur = Compteur(5)
for nombre in compteur:
    print(nombre)  # 0, 1, 2, 3, 4
```

### Exemple complet : Itérateur personnalisé

```python
class Carres:
    """Itérateur qui génère les carrés des nombres."""
    def __init__(self, max_val):
        self.max_val = max_val
        self.current = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.current < self.max_val:
            resultat = self.current ** 2
            self.current += 1
            return resultat
        raise StopIteration

# Utilisation
carres = Carres(5)
for carre in carres:
    print(carre)  # 0, 1, 4, 9, 16

# Ou manuellement
carres = Carres(5)
iterator = iter(carres)
print(next(iterator))  # 0
print(next(iterator))  # 1
print(next(iterator))  # 4
```

## Itérables vs itérateurs

### Différence fondamentale

- **Itérable** : Objet qui peut être parcouru (a `__iter__()`)
- **Itérateur** : Objet qui produit les valeurs (a `__iter__()` ET `__next__()`)

**Tous les itérateurs sont itérables, mais tous les itérables ne sont pas des itérateurs.**

```python
# Liste : itérable mais pas itérateur
liste = [1, 2, 3]
print(hasattr(liste, '__iter__'))  # True (itérable)
print(hasattr(liste, '__next__'))  # False (pas itérateur)

# Obtenir l'itérateur
iterator = iter(liste)
print(hasattr(iterator, '__iter__'))  # True
print(hasattr(iterator, '__next__'))  # True (itérateur)

# Utilisation
for item in liste:  # Python obtient automatiquement l'itérateur
    print(item)
```

### Exemple : Itérable qui n'est pas son propre itérateur

```python
class MaCollection:
    """Itérable qui crée un nouvel itérateur à chaque fois."""
    def __init__(self, elements):
        self.elements = elements
    
    def __iter__(self):
        """Retourne un nouvel itérateur à chaque appel."""
        return MaCollectionIterator(self.elements)

class MaCollectionIterator:
    """Itérateur pour MaCollection."""
    def __init__(self, elements):
        self.elements = elements
        self.index = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.index < len(self.elements):
            valeur = self.elements[self.index]
            self.index += 1
            return valeur
        raise StopIteration

# Utilisation
collection = MaCollection([1, 2, 3])

# Peut être itéré plusieurs fois (nouvel itérateur à chaque fois)
for item in collection:
    print(item)  # 1, 2, 3

for item in collection:
    print(item)  # 1, 2, 3 (fonctionne encore)
```

## Exemples pratiques

### Exemple 1 : Parcourir un fichier ligne par ligne

```python
class FichierLignes:
    """Itérable qui parcourt un fichier ligne par ligne."""
    def __init__(self, nom_fichier):
        self.nom_fichier = nom_fichier
    
    def __iter__(self):
        return FichierLignesIterator(self.nom_fichier)

class FichierLignesIterator:
    def __init__(self, nom_fichier):
        self.fichier = open(nom_fichier, 'r')
    
    def __iter__(self):
        return self
    
    def __next__(self):
        ligne = self.fichier.readline()
        if ligne:
            return ligne.rstrip('\n')
        self.fichier.close()
        raise StopIteration

# Utilisation
for ligne in FichierLignes("fichier.txt"):
    print(ligne)
```

### Exemple 2 : Itérateur avec état

```python
class Fibonacci:
    """Génère la suite de Fibonacci."""
    def __init__(self, max_val=None):
        self.max_val = max_val
        self.prev = 0
        self.curr = 1
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.max_val is not None and self.curr > self.max_val:
            raise StopIteration
        
        valeur = self.curr
        self.prev, self.curr = self.curr, self.prev + self.curr
        return valeur

# Utilisation
fib = Fibonacci(100)
for nombre in fib:
    print(nombre)  # 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
```

### Exemple 3 : Itérateur infini

```python
class NombresPairs:
    """Génère les nombres pairs à l'infini."""
    def __init__(self):
        self.current = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        valeur = self.current
        self.current += 2
        return valeur

# Utilisation avec limite
pairs = NombresPairs()
for i, nombre in enumerate(pairs):
    if i >= 10:  # Limite manuelle
        break
    print(nombre)  # 0, 2, 4, 6, 8, 10, 12, 14, 16, 18
```

### Exemple 4 : Itérateur avec filtrage

```python
class Filtre:
    """Itérateur qui filtre les éléments selon une condition."""
    def __init__(self, iterable, condition):
        self.iterator = iter(iterable)
        self.condition = condition
    
    def __iter__(self):
        return self
    
    def __next__(self):
        while True:
            valeur = next(self.iterator)
            if self.condition(valeur):
                return valeur
            # Continue la boucle si la condition n'est pas remplie

# Utilisation
nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
pairs = Filtre(nombres, lambda x: x % 2 == 0)
for nombre in pairs:
    print(nombre)  # 2, 4, 6, 8, 10
```

## Fonctions built-in utiles

### iter() et next()

```python
# iter() : obtient un itérateur
liste = [1, 2, 3]
iterator = iter(liste)

# next() : obtient la valeur suivante
print(next(iterator))  # 1
print(next(iterator))  # 2
print(next(iterator))  # 3
# print(next(iterator))  # StopIteration

# next() avec valeur par défaut
iterator = iter([1, 2])
print(next(iterator, "fin"))  # 1
print(next(iterator, "fin"))  # 2
print(next(iterator, "fin"))  # "fin" (pas d'erreur)
```

### enumerate()

```python
liste = ["a", "b", "c"]
for index, valeur in enumerate(liste):
    print(f"{index}: {valeur}")  # 0: a, 1: b, 2: c
```

### zip()

```python
noms = ["Alice", "Bob", "Charlie"]
ages = [30, 25, 35]

for nom, age in zip(noms, ages):
    print(f"{nom}: {age}")  # Alice: 30, Bob: 25, Charlie: 35
```

## Pièges courants

### Piège 1 : Itérer plusieurs fois sur un itérateur épuisé

```python
# ⚠️ Itérateur épuisé
iterator = iter([1, 2, 3])
for item in iterator:
    print(item)  # 1, 2, 3

# L'itérateur est épuisé
for item in iterator:
    print(item)  # Rien ne s'affiche!

# ✅ Solution : utiliser un itérable
liste = [1, 2, 3]
for item in liste:
    print(item)  # 1, 2, 3
for item in liste:
    print(item)  # 1, 2, 3 (fonctionne encore)
```

### Piège 2 : Modifier une collection pendant l'itération

```python
# ❌ Dangereux
liste = [1, 2, 3, 4, 5]
for item in liste:
    if item % 2 == 0:
        liste.remove(item)  # ⚠️ Peut causer des problèmes

# ✅ Solution : créer une copie ou utiliser une list comprehension
liste = [1, 2, 3, 4, 5]
liste = [item for item in liste if item % 2 != 0]
print(liste)  # [1, 3, 5]
```

### Piège 3 : Oublier StopIteration

```python
# ❌ Oubli de StopIteration
class MauvaisIterateur:
    def __iter__(self):
        return self
    
    def __next__(self):
        # Pas de StopIteration → boucle infinie!
        return 1

# ✅ Correct
class BonIterateur:
    def __init__(self, max_val):
        self.max_val = max_val
        self.current = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.current < self.max_val:
            self.current += 1
            return self.current - 1
        raise StopIteration  # ✅ Important!
```

## Bonnes pratiques

### 1. Utilisez des générateurs pour les séquences grandes

```python
# ✅ Générateur (efficace en mémoire)
def nombres_carres(n):
    for i in range(n):
        yield i ** 2

# ❌ Liste (consomme toute la mémoire)
def nombres_carres_liste(n):
    return [i ** 2 for i in range(n)]
```

### 2. Implémentez __iter__ et __next__ correctement

```python
class BonIterateur:
    def __iter__(self):
        return self  # Si l'objet est son propre itérateur
    
    def __next__(self):
        # Logique de génération
        # ...
        raise StopIteration  # Quand terminé
```

### 3. Documentez le comportement

```python
class MaCollection:
    """
    Collection itérable.
    
    Peut être itérée plusieurs fois (crée un nouvel itérateur à chaque fois).
    """
    def __iter__(self):
        return MaCollectionIterator(self.elements)
```

## Points clés à retenir

- ✅ **Itérable** : Objet avec `__iter__()` qui peut être parcouru
- ✅ **Itérateur** : Objet avec `__iter__()` ET `__next__()` qui produit les valeurs
- ✅ `for item in sequence` appelle `iter(sequence)` puis `next()` jusqu'à `StopIteration`
- ✅ Tous les itérateurs sont itérables, mais pas l'inverse
- ✅ Un itérateur épuisé ne peut plus être utilisé (créez-en un nouveau)
- ✅ `StopIteration` signale la fin de l'itération
- ✅ Utilisez des générateurs pour les grandes séquences (économie de mémoire)

Comprendre le protocole d'itération est fondamental pour maîtriser les itérateurs et générateurs. C'est la base sur laquelle tout le reste s'appuie.
