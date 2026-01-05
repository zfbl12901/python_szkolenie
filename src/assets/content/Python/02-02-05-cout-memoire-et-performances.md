---
title: "Coût mémoire et performances"
order: 2.02.05
parent: "02-02-types-natifs-en-profondeur.md"
tags: ["python", "performance", "memoire"]
---

# Coût mémoire et performances

Comprendre le coût mémoire et les performances des types natifs Python permet d'optimiser ses applications. Python est souvent critiqué pour sa performance, mais une bonne compréhension des structures de données permet d'écrire du code efficace.

## Concepts de base

Python est un langage de haut niveau qui ajoute une couche d'abstraction. Cela a un coût en mémoire et en performance, mais offre une grande flexibilité. Comprendre ces compromis est essentiel pour optimiser votre code.

## Coût mémoire des types

### Taille de base des objets

En Python, chaque objet a un coût mémoire de base (overhead) pour stocker les métadonnées :

```python
import sys

# Taille des objets de base
print(sys.getsizeof(1))        # ~28 bytes (int)
print(sys.getsizeof(1.0))     # ~24 bytes (float)
print(sys.getsizeof(""))       # ~49 bytes (str vide)
print(sys.getsizeof([]))       # ~56 bytes (list vide)
print(sys.getsizeof({}))       # ~232 bytes (dict vide)
print(sys.getsizeof(set()))    # ~216 bytes (set vide)
print(sys.getsizeof(()))       # ~40 bytes (tuple vide)
```

**Note** : Ces valeurs peuvent varier selon la version de Python et la plateforme.

### Coût mémoire des collections

```python
import sys

# Liste vide
liste_vide = []
print(sys.getsizeof(liste_vide))  # ~56 bytes

# Liste avec éléments
liste = [1, 2, 3, 4, 5]
print(sys.getsizeof(liste))  # Plus que 56 bytes (dépend du nombre d'éléments)

# Dictionnaire
dico_vide = {}
print(sys.getsizeof(dico_vide))  # ~232 bytes (overhead important)

# Chaîne de caractères
chaine = "Hello"
print(sys.getsizeof(chaine))  # ~54 bytes (dépend de la longueur)
```

### Comparaison mémoire : list vs tuple

```python
import sys

# Listes et tuples ont un overhead similaire
liste = [1, 2, 3, 4, 5]
tuple = (1, 2, 3, 4, 5)

print(sys.getsizeof(liste))  # Légèrement plus que tuple (mutabilité)
print(sys.getsizeof(tuple))   # Légèrement moins que list

# Pour de grandes séquences, la différence est négligeable
grande_liste = list(range(1000))
grand_tuple = tuple(range(1000))

print(sys.getsizeof(grande_liste))  # ~8056 bytes
print(sys.getsizeof(grand_tuple))   # ~8040 bytes
```

### Coût mémoire des dictionnaires

Les dictionnaires ont un overhead important mais offrent des lookups O(1) :

```python
import sys

# Dictionnaire vide
dico_vide = {}
print(sys.getsizeof(dico_vide))  # ~232 bytes

# Dictionnaire avec éléments
dico = {"a": 1, "b": 2, "c": 3}
print(sys.getsizeof(dico))  # Plus que 232 bytes

# Les dictionnaires allouent plus d'espace que nécessaire
# pour maintenir de bonnes performances de lookup
```

## Complexité algorithmique

### Complexité des opérations courantes

#### Listes

| Opération | Complexité | Description |
|-----------|------------|-------------|
| `len(liste)` | O(1) | Longueur |
| `liste[i]` | O(1) | Accès par index |
| `liste.append(x)` | O(1) amorti | Ajout à la fin |
| `liste.insert(i, x)` | O(n) | Insertion à l'index i |
| `liste.pop()` | O(1) | Suppression à la fin |
| `liste.pop(i)` | O(n) | Suppression à l'index i |
| `x in liste` | O(n) | Recherche |
| `liste.sort()` | O(n log n) | Tri |

```python
# Exemple : append est O(1) amorti
liste = []
for i in range(1000000):
    liste.append(i)  # Efficace

# Exemple : insert est O(n)
liste = list(range(100000))
liste.insert(0, 999)  # Lent (déplace tous les éléments)
```

#### Dictionnaires

| Opération | Complexité | Description |
|-----------|------------|-------------|
| `len(dico)` | O(1) | Nombre de clés |
| `dico[key]` | O(1) | Accès par clé |
| `dico[key] = value` | O(1) | Insertion/modification |
| `del dico[key]` | O(1) | Suppression |
| `key in dico` | O(1) | Vérification d'appartenance |

```python
# Dictionnaires : lookups très rapides
dico = {i: i*2 for i in range(1000000)}

# O(1) - très rapide
valeur = dico[500000]  # Instantané

# Comparé à une liste (O(n))
liste = list(range(1000000))
# Trouver l'index de 500000 nécessite de parcourir la liste
```

#### Ensembles

| Opération | Complexité | Description |
|-----------|------------|-------------|
| `len(set)` | O(1) | Taille |
| `x in set` | O(1) | Vérification d'appartenance |
| `set.add(x)` | O(1) | Ajout |
| `set.remove(x)` | O(1) | Suppression |

```python
# Ensembles : vérifications d'appartenance très rapides
grand_ensemble = set(range(1000000))

# O(1) - très rapide
if 500000 in grand_ensemble:  # Instantané
    print("Trouvé")

# Comparé à une liste (O(n))
grande_liste = list(range(1000000))
if 500000 in grande_liste:  # Doit parcourir la liste
    print("Trouvé")
```

## Optimisations courantes

### 1. Utilisez des sets pour les vérifications d'appartenance

```python
# ❌ Lent : O(n) pour chaque vérification
mots_interdits = ["spam", "scam", "fraud", "virus"]
if mot in mots_interdits:  # O(n)
    print("Mot interdit")

# ✅ Rapide : O(1) pour chaque vérification
mots_interdits = {"spam", "scam", "fraud", "virus"}
if mot in mots_interdits:  # O(1)
    print("Mot interdit")
```

### 2. Utilisez des dictionnaires pour les lookups

```python
# ❌ Lent : recherche linéaire
def trouver_prix_produit(nom, produits):
    for produit in produits:
        if produit["nom"] == nom:
            return produit["prix"]
    return None

# ✅ Rapide : lookup O(1)
def trouver_prix_produit(nom, produits_dict):
    return produits_dict.get(nom)  # O(1)
```

### 3. Évitez les concaténations répétées de chaînes

```python
# ❌ Lent : O(n²) - crée une nouvelle chaîne à chaque itération
resultat = ""
for i in range(10000):
    resultat += str(i)

# ✅ Rapide : O(n) - utilise join()
resultat = "".join(str(i) for i in range(10000))
```

### 4. Utilisez des list comprehensions

```python
# ❌ Moins efficace
resultat = []
for x in range(1000):
    if x % 2 == 0:
        resultat.append(x * 2)

# ✅ Plus efficace
resultat = [x * 2 for x in range(1000) if x % 2 == 0]
```

### 5. Pré-allouez les listes si vous connaissez la taille

```python
# Si vous connaissez la taille finale
taille = 10000
liste = [0] * taille  # Pré-allocation

# Puis remplissez
for i in range(taille):
    liste[i] = i * 2
```

### 6. Utilisez des générateurs pour les grandes séquences

```python
# ❌ Charge tout en mémoire
nombres = [x**2 for x in range(10000000)]  # Beaucoup de mémoire

# ✅ Génère à la demande
nombres = (x**2 for x in range(10000000))  # Peu de mémoire
```

## Outils de profiling

### sys.getsizeof() - Taille mémoire

```python
import sys

# Taille d'un objet
liste = [1, 2, 3, 4, 5]
print(sys.getsizeof(liste))  # Taille en bytes

# Taille récursive (pour les conteneurs)
def taille_recursive(obj, seen=None):
    if seen is None:
        seen = set()
    obj_id = id(obj)
    if obj_id in seen:
        return 0
    seen.add(obj_id)
    taille = sys.getsizeof(obj)
    if isinstance(obj, dict):
        taille += sum(taille_recursive(k, seen) + taille_recursive(v, seen)
                     for k, v in obj.items())
    elif isinstance(obj, (list, tuple, set)):
        taille += sum(taille_recursive(item, seen) for item in obj)
    return taille

liste = [[1, 2], [3, 4], [5, 6]]
print(taille_recursive(liste))
```

### timeit - Mesure de performance

```python
import timeit

# Comparer deux approches
def methode_lente():
    resultat = ""
    for i in range(1000):
        resultat += str(i)
    return resultat

def methode_rapide():
    return "".join(str(i) for i in range(1000))

# Mesurer le temps
temps_lent = timeit.timeit(methode_lente, number=1000)
temps_rapide = timeit.timeit(methode_rapide, number=1000)

print(f"Lent: {temps_lent:.4f}s")
print(f"Rapide: {temps_rapide:.4f}s")
print(f"Ratio: {temps_lent / temps_rapide:.2f}x plus rapide")
```

### cProfile - Profiling détaillé

```python
import cProfile

def fonction_a_profiler():
    resultat = []
    for i in range(10000):
        resultat.append(i * 2)
    return resultat

# Profiler
cProfile.run('fonction_a_profiler()')
```

## Exemples de benchmarks

### Comparaison list vs set pour l'appartenance

```python
import timeit

# Préparation
grande_liste = list(range(100000))
grand_ensemble = set(range(100000))

# Test avec liste
def test_liste():
    return 50000 in grande_liste

# Test avec ensemble
def test_ensemble():
    return 50000 in grand_ensemble

temps_liste = timeit.timeit(test_liste, number=10000)
temps_ensemble = timeit.timeit(test_ensemble, number=10000)

print(f"Liste: {temps_liste:.4f}s")
print(f"Ensemble: {temps_ensemble:.4f}s")
print(f"Ensemble est {temps_liste / temps_ensemble:.0f}x plus rapide")
```

### Comparaison concaténation vs join

```python
import timeit

def concat_lente():
    resultat = ""
    for i in range(10000):
        resultat += str(i)
    return resultat

def concat_rapide():
    return "".join(str(i) for i in range(10000))

temps_lent = timeit.timeit(concat_lente, number=100)
temps_rapide = timeit.timeit(concat_rapide, number=100)

print(f"Concaténation: {temps_lent:.4f}s")
print(f"Join: {temps_rapide:.4f}s")
print(f"Join est {temps_lent / temps_rapide:.0f}x plus rapide")
```

## Pièges de performance

### 1. Vérifications d'appartenance répétées dans une liste

```python
# ❌ Lent : O(n) à chaque fois
liste = list(range(100000))
for i in range(1000):
    if i in liste:  # O(n) à chaque itération
        pass

# ✅ Rapide : O(1) à chaque fois
ensemble = set(range(100000))
for i in range(1000):
    if i in ensemble:  # O(1) à chaque itération
        pass
```

### 2. Modifications répétées au début d'une liste

```python
# ❌ Lent : O(n) à chaque insertion
liste = []
for i in range(10000):
    liste.insert(0, i)  # Déplace tous les éléments

# ✅ Rapide : O(1) à chaque ajout
liste = []
for i in range(10000):
    liste.append(i)  # Ajoute à la fin
liste.reverse()  # Inverse une fois à la fin
```

### 3. Copies inutiles

```python
# ❌ Copie inutile
def traiter(liste):
    liste = liste.copy()  # Copie même si pas nécessaire
    return [x * 2 for x in liste]

# ✅ Pas de copie si pas de modification
def traiter(liste):
    return [x * 2 for x in liste]  # Pas de copie nécessaire
```

## Bonnes pratiques

### 1. Choisissez la bonne structure de données

```python
# Pour vérifications d'appartenance : set
mots_uniques = set(liste_de_mots)

# Pour lookups par clé : dict
prix_produits = {nom: prix for nom, prix in produits}

# Pour séquence ordonnée : list
resultats = [calcul(x) for x in donnees]
```

### 2. Évitez les optimisations prématurées

```python
# ✅ Lisible d'abord
resultat = [x * 2 for x in range(100) if x % 2 == 0]

# Optimisez seulement si nécessaire (après profiling)
```

### 3. Utilisez des générateurs pour les grandes séquences

```python
# ✅ Générateur (peu de mémoire)
nombres = (x**2 for x in range(10000000))
for carre in nombres:
    traiter(carre)
```

### 4. Profitez des optimisations Python

```python
# Python optimise certaines opérations
# Utilisez les built-ins quand possible
somme = sum(range(1000))  # Optimisé en C
maximum = max(liste)      # Optimisé en C
```

## Points clés à retenir

- ✅ Les dictionnaires et ensembles offrent des lookups O(1)
- ✅ Les listes ont des insertions/suppressions O(n) au début/milieu
- ✅ Utilisez `join()` pour concaténer des chaînes (pas `+=`)
- ✅ Utilisez des sets pour les vérifications d'appartenance fréquentes
- ✅ Utilisez des générateurs pour les grandes séquences
- ✅ Profilez avant d'optimiser (mesurez, n'assumez pas)
- ✅ Choisissez la bonne structure de données pour votre cas d'usage
- ✅ Les list comprehensions sont généralement plus rapides que les boucles

Comprendre les performances des types natifs Python vous permettra d'écrire du code plus efficace. N'oubliez pas : "Premature optimization is the root of all evil" - optimisez seulement après avoir identifié les goulots d'étranglement réels.
