---
title: "Copies superficielles vs profondes"
order: 2.02.04
parent: "02-02-types-natifs-en-profondeur.md"
tags: ["python", "copies", "references"]
---

# Copies superficielles vs profondes

Comprendre la différence entre copies superficielles et profondes est crucial pour éviter les bugs subtils liés aux références. C'est l'un des pièges les plus courants en Python, surtout quand on travaille avec des structures de données imbriquées.

## Concepts de base

En Python, l'affectation ne crée **pas** une copie, mais une **référence** vers le même objet. Pour créer une copie, vous devez le faire explicitement. Il existe deux types de copies :

- **Copie superficielle (shallow copy)** : Copie l'objet, mais pas les objets qu'il contient
- **Copie profonde (deep copy)** : Copie récursive de l'objet et de tous les objets qu'il contient

## Le problème des références

### Affectation = référence

```python
# Affectation crée une référence, pas une copie
liste1 = [1, 2, 3]
liste2 = liste1  # liste2 référence le même objet que liste1

print(liste1 is liste2)  # True (même objet en mémoire)

# Modification affecte les deux
liste1.append(4)
print(liste1)  # [1, 2, 3, 4]
print(liste2)  # [1, 2, 3, 4] ⚠️ Modifié aussi!
```

### Pourquoi c'est important ?

Avec les types mutables (list, dict, set), les modifications affectent toutes les références. Cela peut causer des bugs subtils si vous ne comprenez pas ce mécanisme.

```python
def modifier_liste(ma_liste):
    ma_liste.append(10)  # Modifie l'objet original!

liste = [1, 2, 3]
modifier_liste(liste)
print(liste)  # [1, 2, 3, 10] ⚠️ Modifié!
```

## Copies superficielles (shallow copy)

### Qu'est-ce qu'une copie superficielle ?

Une copie superficielle crée un **nouvel objet**, mais les éléments à l'intérieur sont des **références** aux mêmes objets que l'original.

```python
import copy

liste1 = [1, 2, 3]
liste2 = liste1.copy()  # Copie superficielle
# ou
liste2 = list(liste1)   # Copie superficielle
# ou
liste2 = liste1[:]       # Copie superficielle (slicing)

print(liste1 is liste2)  # False (objets différents)

# Modification de l'original
liste1.append(4)
print(liste1)  # [1, 2, 3, 4]
print(liste2)  # [1, 2, 3] ✅ Inchangé
```

### Le piège avec les objets imbriqués

Le problème apparaît avec des structures imbriquées :

```python
# Liste contenant des listes
liste1 = [[1, 2], [3, 4]]
liste2 = liste1.copy()  # Copie superficielle

print(liste1 is liste2)  # False (objets différents)
print(liste1[0] is liste2[0])  # True ⚠️ Même objet!

# Modification d'un élément imbriqué
liste1[0].append(5)
print(liste1)  # [[1, 2, 5], [3, 4]]
print(liste2)  # [[1, 2, 5], [3, 4]] ⚠️ Modifié aussi!

# Mais modification de la liste principale
liste1.append([5, 6])
print(liste1)  # [[1, 2, 5], [3, 4], [5, 6]]
print(liste2)  # [[1, 2, 5], [3, 4]] ✅ Inchangé
```

### Méthodes de copie superficielle

```python
# Pour les listes
liste = [1, 2, 3]
copie1 = liste.copy()
copie2 = list(liste)
copie3 = liste[:]

# Pour les dictionnaires
dico = {"a": 1, "b": 2}
copie1 = dico.copy()
copie2 = dict(dico)

# Pour les ensembles
ensemble = {1, 2, 3}
copie = ensemble.copy()

# Fonction copy.copy() (générique)
import copy
liste = [1, 2, 3]
copie = copy.copy(liste)
```

### Exemple pratique : dictionnaires imbriqués

```python
# Dictionnaire avec valeurs mutables
dico1 = {
    "liste": [1, 2, 3],
    "nombre": 42
}
dico2 = dico1.copy()  # Copie superficielle

# Modification de la valeur mutable
dico1["liste"].append(4)
print(dico1)  # {'liste': [1, 2, 3, 4], 'nombre': 42}
print(dico2)  # {'liste': [1, 2, 3, 4], 'nombre': 42} ⚠️ Modifié!

# Modification de la valeur immutable
dico1["nombre"] = 100
print(dico1)  # {'liste': [1, 2, 3, 4], 'nombre': 100}
print(dico2)  # {'liste': [1, 2, 3, 4], 'nombre': 42} ✅ Inchangé
```

## Copies profondes (deep copy)

### Qu'est-ce qu'une copie profonde ?

Une copie profonde crée un **nouvel objet** et **récursivement** copie tous les objets qu'il contient. C'est une copie complètement indépendante.

```python
import copy

liste1 = [[1, 2], [3, 4]]
liste2 = copy.deepcopy(liste1)  # Copie profonde

print(liste1 is liste2)      # False (objets différents)
print(liste1[0] is liste2[0])  # False ✅ Objets différents!

# Modification de l'original
liste1[0].append(5)
print(liste1)  # [[1, 2, 5], [3, 4]]
print(liste2)  # [[1, 2], [3, 4]] ✅ Inchangé!
```

### Quand utiliser une copie profonde ?

Utilisez `copy.deepcopy()` quand :
- Vous avez des structures de données imbriquées
- Vous voulez une copie complètement indépendante
- Les modifications dans la copie ne doivent pas affecter l'original

```python
import copy

# Structure complexe
donnees = {
    "utilisateurs": [
        {"nom": "Alice", "scores": [10, 20, 30]},
        {"nom": "Bob", "scores": [15, 25, 35]}
    ],
    "config": {"theme": "dark", "lang": "fr"}
}

# Copie profonde
backup = copy.deepcopy(donnees)

# Modification de l'original
donnees["utilisateurs"][0]["scores"].append(40)
donnees["config"]["theme"] = "light"

print(donnees["utilisateurs"][0]["scores"])  # [10, 20, 30, 40]
print(backup["utilisateurs"][0]["scores"])    # [10, 20, 30] ✅ Inchangé
print(backup["config"]["theme"])              # "dark" ✅ Inchangé
```

## Comparaison visuelle

### Structure simple (pas de problème)

```python
# Liste simple
liste1 = [1, 2, 3]
liste2 = liste1.copy()  # Copie superficielle suffit

liste1.append(4)
print(liste1)  # [1, 2, 3, 4]
print(liste2)  # [1, 2, 3] ✅ OK
```

### Structure imbriquée (problème avec shallow copy)

```python
# Liste imbriquée
liste1 = [[1, 2], [3, 4]]

# Copie superficielle
liste2_shallow = liste1.copy()
liste1[0].append(5)
print(liste2_shallow)  # [[1, 2, 5], [3, 4]] ⚠️ Modifié!

# Copie profonde
import copy
liste2_deep = copy.deepcopy(liste1)
liste1[0].append(6)
print(liste2_deep)  # [[1, 2, 5], [3, 4]] ✅ Inchangé!
```

## Quand utiliser chaque type

### Utilisez une copie superficielle quand :

- Les éléments sont immutables (int, str, tuple, etc.)
- Vous voulez juste copier la structure principale
- Performance est importante (deepcopy est plus lent)

```python
# Exemple : liste de nombres (immutables)
nombres = [1, 2, 3, 4, 5]
copie = nombres.copy()  # Copie superficielle suffit
```

### Utilisez une copie profonde quand :

- Vous avez des structures imbriquées avec des objets mutables
- Vous voulez une copie complètement indépendante
- Vous modifiez les éléments imbriqués

```python
# Exemple : liste de listes
matrice = [[1, 2], [3, 4], [5, 6]]
copie = copy.deepcopy(matrice)  # Copie profonde nécessaire
```

## Exemples et pièges courants

### Piège 1 : Arguments par défaut mutables

```python
# ❌ Dangereux
def ajouter_element(element, liste=[]):
    liste.append(element)
    return liste

print(ajouter_element(1))  # [1]
print(ajouter_element(2))  # [1, 2] ⚠️ La liste persiste!

# ✅ Solution : utiliser None et créer une nouvelle liste
def ajouter_element(element, liste=None):
    if liste is None:
        liste = []
    liste.append(element)
    return liste

# ✅ Ou créer une copie
def ajouter_element(element, liste=[]):
    liste = liste.copy()  # Copie superficielle
    liste.append(element)
    return liste
```

### Piège 2 : Modification accidentelle

```python
# ❌ Bug subtil
def traiter_donnees(donnees):
    donnees["resultat"] = "traitement"  # Modifie l'original!
    return donnees

dico = {"entree": "donnees"}
resultat = traiter_donnees(dico)
print(dico)  # {"entree": "donnees", "resultat": "traitement"} ⚠️ Modifié!

# ✅ Solution : copie
def traiter_donnees(donnees):
    donnees = donnees.copy()  # Copie superficielle
    donnees["resultat"] = "traitement"
    return donnees
```

### Piège 3 : Structures imbriquées

```python
# ❌ Copie superficielle insuffisante
config = {
    "parametres": {"timeout": 30, "retries": 3},
    "cache": {"size": 100, "ttl": 3600}
}
backup = config.copy()

config["parametres"]["timeout"] = 60
print(backup["parametres"]["timeout"])  # 60 ⚠️ Modifié!

# ✅ Solution : copie profonde
import copy
backup = copy.deepcopy(config)
config["parametres"]["timeout"] = 60
print(backup["parametres"]["timeout"])  # 30 ✅ Inchangé
```

### Piège 4 : Listes de dictionnaires

```python
# ❌ Tous les dictionnaires sont la même référence
liste = [{}] * 3
liste[0]["cle"] = "valeur"
print(liste)  # [{'cle': 'valeur'}, {'cle': 'valeur'}, {'cle': 'valeur'}] ⚠️

# ✅ Solution : créer des objets distincts
liste = [{} for _ in range(3)]
liste[0]["cle"] = "valeur"
print(liste)  # [{'cle': 'valeur'}, {}, {}] ✅
```

## Performance

### Coût des copies

- **Copie superficielle** : O(n) où n est le nombre d'éléments de premier niveau
- **Copie profonde** : O(n) où n est le nombre total d'objets (récursif)

```python
import copy
import time

# Grande structure
grande_liste = [[i] for i in range(10000)]

# Copie superficielle (rapide)
start = time.time()
copie_shallow = grande_liste.copy()
temps_shallow = time.time() - start

# Copie profonde (plus lente)
start = time.time()
copie_deep = copy.deepcopy(grande_liste)
temps_deep = time.time() - start

print(f"Shallow: {temps_shallow:.4f}s")
print(f"Deep: {temps_deep:.4f}s")
```

## Bonnes pratiques

### 1. Comprenez quand vous avez besoin d'une copie

```python
# Si vous ne modifiez pas, pas besoin de copie
def lire_donnees(donnees):
    return donnees["valeur"]  # Pas de modification, pas de copie nécessaire

# Si vous modifiez, créez une copie
def modifier_donnees(donnees):
    donnees = donnees.copy()  # Copie si structure simple
    # ou
    donnees = copy.deepcopy(donnees)  # Copie profonde si imbriquée
    donnees["modifie"] = True
    return donnees
```

### 2. Utilisez copy.copy() pour la clarté

```python
import copy

# Plus explicite que .copy()
liste = [1, 2, 3]
copie = copy.copy(liste)  # Clair que c'est une copie
```

### 3. Documentez vos intentions

```python
def traiter_donnees(donnees):
    """
    Traite les données et retourne un résultat.
    
    Note: Crée une copie profonde pour éviter de modifier l'original.
    """
    donnees = copy.deepcopy(donnees)
    # ... traitement ...
    return donnees
```

### 4. Testez avec des structures imbriquées

```python
# Test pour vérifier que votre copie fonctionne
original = [[1, 2], [3, 4]]
copie = copy.deepcopy(original)

original[0].append(5)
assert copie[0] == [1, 2]  # Vérifie que la copie n'est pas modifiée
```

## Points clés à retenir

- ✅ L'affectation crée une **référence**, pas une copie
- ✅ **Copie superficielle** : copie l'objet mais pas les objets qu'il contient
- ✅ **Copie profonde** : copie récursive de tout
- ✅ Utilisez `copy.copy()` pour les copies superficielles
- ✅ Utilisez `copy.deepcopy()` pour les copies profondes
- ✅ Les copies superficielles suffisent pour les structures simples avec éléments immutables
- ✅ Les copies profondes sont nécessaires pour les structures imbriquées avec objets mutables
- ✅ Les copies profondes sont plus lentes que les copies superficielles
- ✅ Testez toujours que vos copies fonctionnent comme prévu

Comprendre les copies est essentiel pour éviter des bugs subtils. Prenez le temps de bien maîtriser ces concepts, surtout quand vous travaillez avec des structures de données complexes.
