---
title: "list, tuple, set, dict"
order: 2.02.03
parent: "02-02-types-natifs-en-profondeur.md"
tags: ["python", "collections", "structures"]
---

# list, tuple, set, dict

Les collections Python (list, tuple, set, dict) sont au cœur de la programmation Python. Chacune a ses caractéristiques et cas d'usage. Comprendre leurs différences et savoir quand utiliser laquelle est essentiel pour écrire du code Pythonic.

## Concepts de base

Python offre quatre types de collections principales :

- **`list`** : Séquence ordonnée et mutable (peut être modifiée)
- **`tuple`** : Séquence ordonnée et immutable (ne peut pas être modifiée)
- **`set`** : Collection non ordonnée d'éléments uniques, mutable
- **`dict`** : Dictionnaire (clé-valeur), mutable, ordonné depuis Python 3.7

Chacune a ses avantages et ses cas d'usage spécifiques.

## list (listes)

### Caractéristiques

Les listes sont des séquences **ordonnées** et **mutables**. Elles peuvent contenir des éléments de types différents.

```python
# Création de listes
liste1 = [1, 2, 3, 4, 5]
liste2 = ["a", "b", "c"]
liste3 = [1, "hello", 3.14, True]  # Types mixtes
liste4 = []  # Liste vide
liste5 = list()  # Liste vide (constructeur)

print(type(liste1))  # <class 'list'>
```

### Accès et modification

```python
liste = [10, 20, 30, 40, 50]

# Accès par index
print(liste[0])   # 10 (premier élément)
print(liste[-1])  # 50 (dernier élément)
print(liste[2])   # 30

# Modification par index
liste[0] = 100
print(liste)  # [100, 20, 30, 40, 50]

# Slicing (comme pour les strings)
print(liste[1:3])    # [20, 30]
print(liste[:3])     # [100, 20, 30]
print(liste[2:])     # [30, 40, 50]
print(liste[::-1])   # [50, 40, 30, 20, 100] (inverse)
```

### Méthodes de modification

```python
liste = [1, 2, 3]

# append() : ajoute un élément à la fin
liste.append(4)
print(liste)  # [1, 2, 3, 4]

# insert() : insère à un index spécifique
liste.insert(1, 10)
print(liste)  # [1, 10, 2, 3, 4]

# extend() : ajoute plusieurs éléments
liste.extend([5, 6, 7])
print(liste)  # [1, 10, 2, 3, 4, 5, 6, 7]

# remove() : enlève la première occurrence
liste.remove(10)
print(liste)  # [1, 2, 3, 4, 5, 6, 7]

# pop() : enlève et retourne un élément (par défaut le dernier)
dernier = liste.pop()
print(dernier)  # 7
print(liste)    # [1, 2, 3, 4, 5, 6]

premier = liste.pop(0)
print(premier)  # 1
print(liste)    # [2, 3, 4, 5, 6]

# clear() : vide la liste
liste.clear()
print(liste)  # []
```

### Méthodes d'information

```python
liste = [1, 2, 3, 2, 4, 2]

# len() : longueur
print(len(liste))  # 6

# count() : compte les occurrences
print(liste.count(2))  # 3

# index() : trouve l'index d'un élément
print(liste.index(2))      # 1 (première occurrence)
print(liste.index(2, 2))    # 3 (à partir de l'index 2)

# in : vérifie l'appartenance
print(3 in liste)   # True
print(10 in liste)  # False
```

### Méthodes de tri et manipulation

```python
liste = [3, 1, 4, 1, 5, 9, 2, 6]

# sort() : trie sur place (modifie la liste)
liste.sort()
print(liste)  # [1, 1, 2, 3, 4, 5, 6, 9]

# sort() avec reverse
liste.sort(reverse=True)
print(liste)  # [9, 6, 5, 4, 3, 2, 1, 1]

# sorted() : retourne une nouvelle liste triée (ne modifie pas l'original)
liste = [3, 1, 4, 1, 5]
nouvelle = sorted(liste)
print(liste)    # [3, 1, 4, 1, 5] (inchangée)
print(nouvelle) # [1, 1, 3, 4, 5]

# reverse() : inverse l'ordre sur place
liste = [1, 2, 3, 4]
liste.reverse()
print(liste)  # [4, 3, 2, 1]
```

### List comprehensions

Les list comprehensions sont une façon Pythonic de créer des listes :

```python
# Syntaxe de base : [expression for item in iterable]
carres = [x**2 for x in range(10)]
print(carres)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Avec condition
pairs = [x for x in range(10) if x % 2 == 0]
print(pairs)  # [0, 2, 4, 6, 8]

# Nested (imbriquées)
matrice = [[i*j for j in range(3)] for i in range(3)]
print(matrice)  # [[0, 0, 0], [0, 1, 2], [0, 2, 4]]
```

## tuple (tuples)

### Caractéristiques

Les tuples sont des séquences **ordonnées** et **immutables**. Ils sont souvent utilisés pour regrouper des données liées.

```python
# Création de tuples
tuple1 = (1, 2, 3)
tuple2 = ("a", "b", "c")
tuple3 = 1, 2, 3  # Parenthèses optionnelles
tuple4 = (42,)     # Tuple avec un seul élément (virgule obligatoire)
tuple5 = ()        # Tuple vide

print(type(tuple1))  # <class 'tuple'>
```

### Pourquoi utiliser des tuples ?

1. **Immutabilité** : Garantit que les données ne seront pas modifiées
2. **Hashabilité** : Peuvent être utilisés comme clés de dictionnaire
3. **Performance** : Légèrement plus rapides que les listes
4. **Sémantique** : Indiquent que les données sont fixes

```python
# Exemple : coordonnées (ne changent pas)
point = (10, 20)
# point[0] = 5  # ❌ TypeError: 'tuple' object does not support item assignment

# Exemple : retour multiple de fonction
def obtenir_nom_age():
    return "Alice", 30  # Retourne un tuple

nom, age = obtenir_nom_age()  # Déballage (unpacking)
print(nom)  # "Alice"
print(age)  # 30
```

### Opérations sur les tuples

```python
tuple1 = (1, 2, 3)
tuple2 = (4, 5, 6)

# Concaténation (crée un nouveau tuple)
tuple3 = tuple1 + tuple2
print(tuple3)  # (1, 2, 3, 4, 5, 6)

# Répétition
tuple4 = tuple1 * 2
print(tuple4)  # (1, 2, 3, 1, 2, 3)

# Accès par index
print(tuple1[0])   # 1
print(tuple1[-1])  # 3

# Slicing
print(tuple1[1:])  # (2, 3)

# in : vérifie l'appartenance
print(2 in tuple1)  # True

# Méthodes disponibles
print(tuple1.count(2))  # 1
print(tuple1.index(2))  # 1
```

### Déballage (unpacking)

```python
# Déballage simple
point = (10, 20)
x, y = point
print(x, y)  # 10 20

# Déballage avec * (Python 3)
nombres = (1, 2, 3, 4, 5)
premier, *milieu, dernier = nombres
print(premier)  # 1
print(milieu)   # [2, 3, 4] (liste)
print(dernier)  # 5

# Échange de variables (utilise des tuples)
a, b = 10, 20
a, b = b, a  # Échange
print(a, b)  # 20 10
```

## set (ensembles)

### Caractéristiques

Les ensembles sont des collections **non ordonnées** d'éléments **uniques**. Ils sont mutables.

```python
# Création d'ensembles
set1 = {1, 2, 3, 4, 5}
set2 = set([1, 2, 3, 4, 5])  # Depuis une liste
set3 = set()  # Ensemble vide (pas {} qui est un dict!)

print(type(set1))  # <class 'set'>
```

### Propriétés des ensembles

```python
# Unicité automatique
ensemble = {1, 2, 2, 3, 3, 3}
print(ensemble)  # {1, 2, 3} (doublons supprimés)

# Non ordonné (avant Python 3.7, l'ordre peut varier)
ensemble = {3, 1, 4, 1, 5, 9}
print(ensemble)  # {1, 3, 4, 5, 9} (ordre peut varier)
```

### Opérations sur les ensembles

```python
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

# Ajout d'éléments
set1.add(5)
print(set1)  # {1, 2, 3, 4, 5}

# Ajout de plusieurs éléments
set1.update([6, 7, 8])
print(set1)  # {1, 2, 3, 4, 5, 6, 7, 8}

# Suppression
set1.remove(8)  # Lève KeyError si l'élément n'existe pas
set1.discard(9)  # Ne lève pas d'erreur si l'élément n'existe pas
element = set1.pop()  # Enlève et retourne un élément arbitraire

# Opérations ensemblistes
union = set1 | set2           # Union
intersection = set1 & set2    # Intersection
difference = set1 - set2      # Différence
symmetric_diff = set1 ^ set2  # Différence symétrique

print(union)         # {1, 2, 3, 4, 5, 6}
print(intersection)  # {3, 4}
print(difference)    # {1, 2}
print(symmetric_diff) # {1, 2, 5, 6}
```

### Cas d'usage des ensembles

```python
# 1. Supprimer les doublons d'une liste
liste = [1, 2, 2, 3, 3, 3, 4]
unique = list(set(liste))
print(unique)  # [1, 2, 3, 4] (ordre peut varier)

# 2. Vérification d'appartenance rapide (O(1) vs O(n) pour les listes)
mots_interdits = {"spam", "scam", "fraud"}
if "spam" in mots_interdits:  # Très rapide
    print("Mot interdit")

# 3. Trouver les éléments communs
liste1 = [1, 2, 3, 4, 5]
liste2 = [4, 5, 6, 7, 8]
communs = set(liste1) & set(liste2)
print(communs)  # {4, 5}
```

### frozenset (ensembles immutables)

```python
# frozenset : ensemble immutable (hashable)
frozen = frozenset([1, 2, 3, 4])
# frozen.add(5)  # ❌ AttributeError

# Peut être utilisé comme clé de dictionnaire
dico = {frozen: "valeur"}
print(dico)  # {frozenset({1, 2, 3, 4}): 'valeur'}
```

## dict (dictionnaires)

### Caractéristiques

Les dictionnaires sont des collections de paires **clé-valeur**. Ils sont **mutables** et **ordonnés** depuis Python 3.7 (l'ordre d'insertion est préservé).

```python
# Création de dictionnaires
dico1 = {"nom": "Alice", "age": 30, "ville": "Paris"}
dico2 = dict(nom="Bob", age=25, ville="Lyon")
dico3 = dict([("nom", "Charlie"), ("age", 35)])
dico4 = {}  # Dictionnaire vide

print(type(dico1))  # <class 'dict'>
```

### Accès et modification

```python
dico = {"nom": "Alice", "age": 30}

# Accès par clé
print(dico["nom"])  # "Alice"
# print(dico["prenom"])  # ❌ KeyError si la clé n'existe pas

# Accès sécurisé avec get()
print(dico.get("nom"))        # "Alice"
print(dico.get("prenom"))    # None (pas d'erreur)
print(dico.get("prenom", "Inconnu"))  # "Inconnu" (valeur par défaut)

# Modification
dico["age"] = 31  # Modifie si existe
dico["ville"] = "Paris"  # Ajoute si n'existe pas

# Suppression
del dico["ville"]
age = dico.pop("age")  # Enlève et retourne la valeur
dico.pop("inexistant", "défaut")  # Retourne "défaut" si clé absente
```

### Méthodes utiles

```python
dico = {"a": 1, "b": 2, "c": 3}

# keys() : toutes les clés
print(list(dico.keys()))  # ['a', 'b', 'c']

# values() : toutes les valeurs
print(list(dico.values()))  # [1, 2, 3]

# items() : toutes les paires (clé, valeur)
print(list(dico.items()))  # [('a', 1), ('b', 2), ('c', 3)]

# Parcours
for cle in dico:
    print(cle, dico[cle])

for cle, valeur in dico.items():
    print(cle, valeur)

# update() : met à jour avec un autre dictionnaire
dico.update({"d": 4, "e": 5})
print(dico)  # {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}

# clear() : vide le dictionnaire
dico.clear()
print(dico)  # {}
```

### Dictionary comprehensions

```python
# Syntaxe : {key: value for item in iterable}
carres = {x: x**2 for x in range(5)}
print(carres)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Avec condition
pairs = {x: x*2 for x in range(10) if x % 2 == 0}
print(pairs)  # {0: 0, 2: 4, 4: 8, 6: 12, 8: 16}

# Inversion clé-valeur
dico = {"a": 1, "b": 2, "c": 3}
inverse = {v: k for k, v in dico.items()}
print(inverse)  # {1: 'a', 2: 'b', 3: 'c'}
```

### Clés de dictionnaire

Les clés doivent être **hashables** (immutables) :

```python
# ✅ Clés valides (immutables)
dico = {
    "string": 1,
    42: 2,
    (1, 2): 3,
    frozenset([1, 2]): 4
}

# ❌ Clés invalides (mutables)
# dico = {
#     [1, 2]: 1,      # TypeError: unhashable type: 'list'
#     {1, 2}: 2,      # TypeError: unhashable type: 'set'
#     {"a": 1}: 3     # TypeError: unhashable type: 'dict'
# }
```

## Comparaison et choix

### Tableau récapitulatif

| Type | Ordre | Mutable | Duplicatas | Hashable | Cas d'usage |
|------|-------|---------|------------|----------|-------------|
| `list` | ✅ | ✅ | ✅ | ❌ | Séquence modifiable, ordre important |
| `tuple` | ✅ | ❌ | ✅ | ✅ | Données fixes, clés de dict, retour multiple |
| `set` | ❌ | ✅ | ❌ | ❌ | Éléments uniques, opérations ensemblistes |
| `frozenset` | ❌ | ❌ | ❌ | ✅ | Ensemble immutable, clé de dict |
| `dict` | ✅* | ✅ | ❌ (clés) | ❌ | Association clé-valeur, lookup rapide |

*Depuis Python 3.7, les dictionnaires préservent l'ordre d'insertion.

### Quand utiliser chaque type ?

**Utilisez `list` quand :**
- Vous avez besoin d'une séquence ordonnée modifiable
- L'ordre des éléments est important
- Vous avez besoin d'indexer par position
- Les doublons sont acceptables

**Utilisez `tuple` quand :**
- Les données ne doivent pas changer (immutabilité)
- Vous voulez utiliser comme clé de dictionnaire
- Vous retournez plusieurs valeurs d'une fonction
- Performance légèrement meilleure que list

**Utilisez `set` quand :**
- Vous avez besoin d'éléments uniques
- Vous faites des opérations ensemblistes (union, intersection, etc.)
- Vous avez besoin de vérifications d'appartenance rapides (O(1))
- L'ordre n'est pas important

**Utilisez `dict` quand :**
- Vous avez besoin d'associations clé-valeur
- Vous avez besoin de lookups rapides par clé (O(1))
- Vous voulez représenter des structures de données complexes
- L'ordre d'insertion est important (Python 3.7+)

## Pièges courants

### 1. Confusion entre list et tuple

```python
# Liste (mutable)
liste = [1, 2, 3]
liste[0] = 10  # ✅ OK

# Tuple (immutable)
tuple = (1, 2, 3)
# tuple[0] = 10  # ❌ TypeError
```

### 2. Ensemble vide vs dictionnaire vide

```python
# Dictionnaire vide
dico = {}  # type: dict

# Ensemble vide (doit utiliser set())
ensemble = set()  # type: set
# ensemble = {}  # ❌ C'est un dict, pas un set!
```

### 3. Modification d'une liste pendant l'itération

```python
# ❌ Dangereux
liste = [1, 2, 3, 4, 5]
for item in liste:
    if item % 2 == 0:
        liste.remove(item)  # Peut causer des problèmes

# ✅ Solution : créer une copie ou utiliser une list comprehension
liste = [1, 2, 3, 4, 5]
liste = [item for item in liste if item % 2 != 0]
```

### 4. Clés de dictionnaire mutables

```python
# ❌ Ne fonctionne pas
# dico = {[1, 2]: "valeur"}  # TypeError

# ✅ Utilisez un tuple
dico = {(1, 2): "valeur"}  # OK
```

## Bonnes pratiques

### 1. Utilisez des list comprehensions

```python
# ✅ Pythonic
carres = [x**2 for x in range(10)]

# ❌ Moins Pythonic
carres = []
for x in range(10):
    carres.append(x**2)
```

### 2. Préférez get() pour les dictionnaires

```python
# ✅ Sécurisé
valeur = dico.get("cle", "defaut")

# ⚠️ Peut lever KeyError
# valeur = dico["cle"]  # Si la clé n'existe pas
```

### 3. Utilisez des tuples pour les données fixes

```python
# ✅ Sémantique claire
point = (10, 20)  # Coordonnées (ne changent pas)

# ⚠️ Moins clair
point = [10, 20]  # Liste (peut être modifiée)
```

### 4. Utilisez des sets pour l'unicité

```python
# ✅ Efficace et clair
mots_uniques = set(liste_de_mots)

# ❌ Moins efficace
mots_uniques = []
for mot in liste_de_mots:
    if mot not in mots_uniques:
        mots_uniques.append(mot)
```

## Points clés à retenir

- ✅ **`list`** : Séquence ordonnée mutable, permet les doublons
- ✅ **`tuple`** : Séquence ordonnée immutable, hashable, pour données fixes
- ✅ **`set`** : Collection non ordonnée d'éléments uniques, opérations ensemblistes
- ✅ **`dict`** : Association clé-valeur, ordonné depuis Python 3.7
- ✅ Utilisez des list/tuple comprehensions pour créer des collections
- ✅ Les clés de dictionnaire doivent être hashables (immutables)
- ✅ Les sets sont optimaux pour les vérifications d'appartenance (O(1))
- ✅ Choisissez le bon type selon vos besoins : mutabilité, ordre, unicité

Maîtriser ces collections est fondamental en Python. Chaque type a ses avantages et ses cas d'usage. Prenez le temps de bien comprendre leurs différences pour écrire du code efficace et Pythonic.
