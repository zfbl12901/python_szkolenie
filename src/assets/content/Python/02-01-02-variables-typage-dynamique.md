---
title: "Variables, typage dynamique"
order: 2.01.02
parent: "02-01-syntaxe-et-modele-de-base.md"
tags: ["python", "variables", "typage", "dynamique", "references"]
---

# Variables, typage dynamique

Python utilise un typage dynamique, ce qui signifie que le type d'une variable est déterminé à l'exécution et peut changer. Cette flexibilité est puissante mais nécessite une bonne compréhension du modèle de référence de Python.

## Le modèle de référence Python

En Python, il n'y a pas vraiment de "variables" au sens traditionnel. Ce que vous appelez "variable" est en réalité une **référence** à un **objet** en mémoire.

```python
# Ce que vous voyez
x = 42

# Ce qui se passe réellement
# 1. Python crée un objet entier avec la valeur 42
# 2. Python crée une référence nommée "x" qui pointe vers cet objet
```

### Tout est un objet

En Python, **tout est un objet** : les nombres, les chaînes, les fonctions, les classes, les modules. Même les types sont des objets !

```python
# Même les nombres sont des objets
x = 42
print(type(x))        # <class 'int'>
print(x.__class__)    # <class 'int'>

# Les fonctions sont des objets
def ma_fonction():
    pass

print(type(ma_fonction))  # <class 'function'>
```

## Typage dynamique vs statique

### Typage statique (Java, C++)

```java
// Java - Le type est déclaré et ne peut pas changer
int nombre = 42;
String texte = "Hello";
// nombre = "Hello";  // ❌ Erreur de compilation
```

### Typage dynamique (Python)

```python
# Python - Le type est déterminé à l'exécution et peut changer
nombre = 42
print(type(nombre))  # <class 'int'>

nombre = "Hello"
print(type(nombre))  # <class 'str'>

nombre = [1, 2, 3]
print(type(nombre))  # <class 'list'>
```

## Affectation et références

### Affectation simple

```python
x = 42
y = x  # y référence le même objet que x (pour les immutables)

print(x is y)  # True (même objet en mémoire)
```

### Comportement avec types immutables

```python
# Types immutables (int, str, tuple, etc.)
a = 10
b = a
print(a is b)  # True

a = 20  # Crée un nouvel objet, ne modifie pas l'ancien
print(a)      # 20
print(b)      # 10 (inchangé)
print(a is b) # False (objets différents)
```

### Comportement avec types mutables

```python
# Types mutables (list, dict, set, etc.)
liste1 = [1, 2, 3]
liste2 = liste1  # liste2 référence le même objet

print(liste1 is liste2)  # True

liste1.append(4)  # Modifie l'objet en place
print(liste1)     # [1, 2, 3, 4]
print(liste2)     # [1, 2, 3, 4] (modifié aussi!)
print(liste1 is liste2)  # True (toujours le même objet)
```

## Identité vs égalité

Python distingue deux concepts importants :

- **Identité** (`is`) : Est-ce le même objet en mémoire ?
- **Égalité** (`==`) : Est-ce que les valeurs sont égales ?

```python
# Exemple avec identité
a = [1, 2, 3]
b = [1, 2, 3]

print(a == b)  # True (valeurs égales)
print(a is b)  # False (objets différents en mémoire)

# Exemple avec petits entiers (optimisation Python)
x = 256
y = 256
print(x is y)  # True (Python cache les petits entiers)

x = 257
y = 257
print(x is y)  # False (pas de cache pour les grands entiers)
```

## Réaffectation vs modification

### Réaffectation (créer un nouvel objet)

```python
x = [1, 2, 3]
x = [4, 5, 6]  # Crée un nouvel objet, l'ancien peut être garbage collected
```

### Modification (changer l'objet existant)

```python
x = [1, 2, 3]
x.append(4)    # Modifie l'objet existant
x[0] = 10      # Modifie l'objet existant
```

## Portée des variables

### Variables locales vs globales

```python
# Variable globale
compteur = 0

def incrementer():
    # Variable locale
    local_var = 10
    global compteur  # Nécessaire pour modifier une variable globale
    compteur += 1
    return local_var

print(compteur)      # 0
incrementer()
print(compteur)      # 1
# print(local_var)   # ❌ NameError: name 'local_var' is not defined
```

### Règles de portée (LEGB)

Python cherche les variables dans cet ordre :
1. **L**ocal (dans la fonction)
2. **E**nclosing (fonctions englobantes)
3. **G**lobal (module)
4. **B**uilt-in (fonctions intégrées)

```python
# Exemple LEGB
x = "global"

def fonction_externe():
    x = "enclosing"
    
    def fonction_interne():
        x = "local"
        print(x)  # "local"
    
    fonction_interne()
    print(x)  # "enclosing"

fonction_externe()
print(x)  # "global"
```

## Typage dynamique : avantages et pièges

### Avantages

```python
# Flexibilité
def traiter_donnees(donnees):
    # Fonctionne avec différents types
    return len(donnees)

print(traiter_donnees("Hello"))     # 5
print(traiter_donnees([1, 2, 3]))  # 3
print(traiter_donnees({"a": 1}))    # 1
```

### Pièges

```python
# Erreur de type détectée seulement à l'exécution
def additionner(a, b):
    return a + b

print(additionner(5, 3))      # 8 ✅
print(additionner("5", "3"))  # "53" ⚠️ (concaténation, pas addition)
print(additionner(5, "3"))    # ❌ TypeError à l'exécution
```

## Typage optionnel (Python 3.5+)

Python supporte maintenant les annotations de type (optionnelles) :

```python
# Sans annotations
def calculer(a, b):
    return a + b

# Avec annotations (optionnel mais recommandé)
def calculer(a: int, b: int) -> int:
    return a + b

# Les annotations n'empêchent pas les erreurs à l'exécution
# mais aident les outils comme mypy à détecter les problèmes
```

## Bonnes pratiques

### 1. Utilisez des noms explicites

```python
# ❌ Mauvais
x = 42
lst = [1, 2, 3]

# ✅ Bon
age = 42
nombres = [1, 2, 3]
```

### 2. Évitez de changer le type d'une variable

```python
# ❌ Confus
valeur = 42
valeur = "quarante-deux"  # Changement de type

# ✅ Préférable
nombre = 42
texte = "quarante-deux"
```

### 3. Utilisez des annotations de type

```python
# ✅ Recommandé
def calculer_moyenne(nombres: list[float]) -> float:
    if not nombres:
        return 0.0
    return sum(nombres) / len(nombres)
```

### 4. Comprenez les références

```python
# Pour copier une liste (et non créer une référence)
originale = [1, 2, 3]

# ❌ Référence (même objet)
copie_reference = originale

# ✅ Copie superficielle
copie_superficielle = originale.copy()
# ou
copie_superficielle = list(originale)
# ou
copie_superficielle = originale[:]
```

## Points clés à retenir

- ✅ En Python, les "variables" sont des références à des objets
- ✅ Le typage est dynamique : le type est déterminé à l'exécution
- ✅ Tout est un objet en Python
- ✅ `is` vérifie l'identité (même objet), `==` vérifie l'égalité (valeurs)
- ✅ Les types immutables créent de nouveaux objets lors de la modification
- ✅ Les types mutables peuvent être modifiés en place
- ✅ Utilisez des annotations de type pour améliorer la lisibilité et la détection d'erreurs

Comprendre le modèle de référence de Python est crucial pour éviter des bugs subtils, notamment avec les types mutables. Prenez le temps de bien assimiler ces concepts avant de continuer.
