---
title: "Types primitifs et mutabilité"
order: 2.01.03
parent: "02-01-syntaxe-et-modele-de-base.md"
tags: ["python", "types", "mutabilite", "immutable", "primitifs"]
---

# Types primitifs et mutabilité

Comprendre la distinction entre types mutables et immutables est l'un des concepts les plus importants en Python. Cette distinction affecte profondément le comportement de votre code et peut être source de bugs si mal comprise.

## Qu'est-ce que la mutabilité ?

La **mutabilité** détermine si un objet peut être modifié après sa création :

- **Immutable** : L'objet ne peut pas être modifié. Toute "modification" crée un nouvel objet.
- **Mutable** : L'objet peut être modifié en place, sans créer de nouvel objet.

## Types immutables en Python

Les types immutables ne peuvent pas être modifiés après leur création. Toute opération qui semble modifier l'objet crée en réalité un nouvel objet.

### 1. int (entiers)

```python
x = 42
print(id(x))  # Adresse mémoire de l'objet

x = x + 1     # Crée un nouvel objet
print(id(x))  # Nouvelle adresse mémoire (objet différent)

# Les petits entiers sont mis en cache par Python
a = 256
b = 256
print(a is b)  # True (même objet en cache)

c = 257
d = 257
print(c is d)  # False (pas de cache pour les grands entiers)
```

### 2. float (nombres à virgule)

```python
x = 3.14
x = x + 1.0   # Crée un nouvel objet
```

### 3. str (chaînes de caractères)

```python
texte = "Hello"
print(id(texte))  # Adresse mémoire

texte = texte + " World"  # Crée une nouvelle chaîne
print(id(texte))  # Nouvelle adresse mémoire

# Les chaînes n'ont pas de méthode pour modifier en place
# texte[0] = "h"  # ❌ TypeError: 'str' object does not support item assignment
```

### 4. tuple (tuples)

```python
point = (1, 2)
# point[0] = 10  # ❌ TypeError: 'tuple' object does not support item assignment

# Pour "modifier" un tuple, il faut créer un nouveau tuple
point = (10, point[1])  # Crée un nouveau tuple
```

### 5. bool (booléens)

```python
vrai = True
faux = False
# Ce sont des instances uniques (singletons)
print(True is True)  # True
```

### 6. frozenset (ensembles immutables)

```python
ensemble_immutable = frozenset([1, 2, 3])
# ensemble_immutable.add(4)  # ❌ AttributeError
```

## Types mutables en Python

Les types mutables peuvent être modifiés en place, sans créer de nouvel objet.

### 1. list (listes)

```python
ma_liste = [1, 2, 3]
print(id(ma_liste))  # Adresse mémoire

ma_liste.append(4)    # Modifie l'objet en place
print(id(ma_liste))   # Même adresse mémoire

ma_liste[0] = 10      # Modifie l'objet en place
print(ma_liste)       # [10, 2, 3, 4]
```

### 2. dict (dictionnaires)

```python
mon_dict = {"a": 1, "b": 2}
print(id(mon_dict))

mon_dict["c"] = 3     # Modifie l'objet en place
mon_dict["a"] = 10    # Modifie l'objet en place
print(id(mon_dict))   # Même adresse mémoire
```

### 3. set (ensembles)

```python
mon_set = {1, 2, 3}
print(id(mon_set))

mon_set.add(4)        # Modifie l'objet en place
mon_set.remove(1)     # Modifie l'objet en place
print(id(mon_set))    # Même adresse mémoire
```

## Implications pratiques

### Piège classique : arguments par défaut mutables

```python
# ❌ DANGER : Bug classique
def ajouter_element(element, liste=[]):
    liste.append(element)
    return liste

print(ajouter_element(1))  # [1]
print(ajouter_element(2))  # [1, 2] ⚠️ La liste persiste!
print(ajouter_element(3))  # [1, 2, 3] ⚠️ Encore pire!

# ✅ Solution : Utiliser None
def ajouter_element(element, liste=None):
    if liste is None:
        liste = []
    liste.append(element)
    return liste

print(ajouter_element(1))  # [1]
print(ajouter_element(2))  # [2] ✅ Nouvelle liste à chaque fois
```

### Références et copies

```python
# Types immutables : pas de problème
a = 10
b = a
a = 20
print(a)  # 20
print(b)  # 10 (inchangé)

# Types mutables : attention aux références!
liste1 = [1, 2, 3]
liste2 = liste1      # Référence, pas copie
liste1.append(4)
print(liste1)        # [1, 2, 3, 4]
print(liste2)        # [1, 2, 3, 4] ⚠️ Modifié aussi!

# ✅ Copie superficielle
liste3 = liste1.copy()
# ou
liste3 = list(liste1)
# ou
liste3 = liste1[:]

liste1.append(5)
print(liste1)        # [1, 2, 3, 4, 5]
print(liste3)        # [1, 2, 3, 4] ✅ Inchangé
```

### Copies superficielles vs profondes

```python
# Copie superficielle
liste1 = [[1, 2], [3, 4]]
liste2 = liste1.copy()  # Copie superficielle

liste1[0].append(5)     # Modifie la liste imbriquée
print(liste1)           # [[1, 2, 5], [3, 4]]
print(liste2)           # [[1, 2, 5], [3, 4]] ⚠️ Modifié aussi!

# ✅ Copie profonde
import copy
liste3 = copy.deepcopy(liste1)
liste1[0].append(6)
print(liste1)           # [[1, 2, 5, 6], [3, 4]]
print(liste3)           # [[1, 2, 5], [3, 4]] ✅ Inchangé
```

## Utilisation dans les fonctions

### Comportement avec types immutables

```python
def modifier_nombre(x):
    x = x + 10  # Crée un nouvel objet
    return x

nombre = 5
resultat = modifier_nombre(nombre)
print(nombre)    # 5 (inchangé)
print(resultat)  # 15
```

### Comportement avec types mutables

```python
def modifier_liste(ma_liste):
    ma_liste.append(10)  # Modifie l'objet en place
    return ma_liste

liste = [1, 2, 3]
resultat = modifier_liste(liste)
print(liste)     # [1, 2, 3, 10] ⚠️ Modifié!
print(resultat)  # [1, 2, 3, 10]
```

## Hashabilité

Les objets immutables sont **hashables** (peuvent être utilisés comme clés de dictionnaire), les objets mutables ne le sont généralement pas.

```python
# ✅ Types immutables sont hashables
dico = {
    "clé": "valeur",      # str est hashable
    42: "nombre",         # int est hashable
    (1, 2): "tuple",      # tuple est hashable
    frozenset([1, 2]): "set"  # frozenset est hashable
}

# ❌ Types mutables ne sont pas hashables
# dico = {
#     [1, 2]: "liste"     # TypeError: unhashable type: 'list'
#     {1, 2}: "set"       # TypeError: unhashable type: 'set'
#     {"a": 1}: "dict"    # TypeError: unhashable type: 'dict'
# }
```

## Performance et mémoire

### Types immutables

- **Avantage** : Sécurité (pas de modification accidentelle)
- **Avantage** : Peuvent être mis en cache/réutilisés
- **Inconvénient** : Création de nouveaux objets peut être coûteuse

```python
# Concaténation de chaînes (inefficace)
resultat = ""
for i in range(1000):
    resultat += str(i)  # Crée une nouvelle chaîne à chaque itération

# ✅ Plus efficace : utiliser join
resultat = "".join(str(i) for i in range(1000))
```

### Types mutables

- **Avantage** : Modification en place (efficace)
- **Inconvénient** : Risque de modification accidentelle

## Tableau récapitulatif

| Type | Mutable ? | Hashable ? | Exemple |
|------|-----------|------------|---------|
| `int` | ❌ | ✅ | `42` |
| `float` | ❌ | ✅ | `3.14` |
| `str` | ❌ | ✅ | `"hello"` |
| `tuple` | ❌ | ✅ | `(1, 2, 3)` |
| `bool` | ❌ | ✅ | `True` |
| `frozenset` | ❌ | ✅ | `frozenset([1, 2])` |
| `list` | ✅ | ❌ | `[1, 2, 3]` |
| `dict` | ✅ | ❌ | `{"a": 1}` |
| `set` | ✅ | ❌ | `{1, 2, 3}` |

## Bonnes pratiques

### 1. Utilisez des tuples pour les données immutables

```python
# ✅ Bon : tuple pour une coordonnée (ne change pas)
point = (10, 20)

# ⚠️ Moins bon : liste pour une coordonnée (peut être modifiée)
point = [10, 20]
```

### 2. Évitez les arguments par défaut mutables

```python
# ❌ Dangereux
def fonction(liste=[]):
    ...

# ✅ Sécurisé
def fonction(liste=None):
    if liste is None:
        liste = []
    ...
```

### 3. Faites des copies explicites quand nécessaire

```python
# Si vous voulez modifier sans affecter l'original
def traiter_donnees(donnees):
    donnees = donnees.copy()  # Copie explicite
    donnees.append("traitement")
    return donnees
```

## Points clés à retenir

- ✅ **Immutable** : `int`, `float`, `str`, `tuple`, `bool`, `frozenset`
- ✅ **Mutable** : `list`, `dict`, `set`
- ✅ Les objets immutables sont hashables (clés de dict)
- ✅ Les objets mutables peuvent être modifiés en place
- ✅ Attention aux références avec les types mutables
- ✅ Utilisez `copy()` pour les copies superficielles, `deepcopy()` pour les copies profondes
- ✅ Évitez les arguments par défaut mutables dans les fonctions

La compréhension de la mutabilité est fondamentale en Python. C'est souvent la source de bugs subtils, notamment avec les listes et dictionnaires. Prenez le temps de bien maîtriser ces concepts.
