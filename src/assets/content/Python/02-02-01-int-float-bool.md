---
title: "int, float, bool"
order: 2.02.01
parent: "02-02-types-natifs-en-profondeur.md"
tags: ["python", "types", "numeriques", "bool"]
---

# int, float, bool

Les types numériques et booléens de Python offrent des fonctionnalités intéressantes et des pièges à connaître. Bien que simples en apparence, ils cachent des subtilités importantes.

## Type int (entiers)

### Caractéristiques

En Python 3, `int` n'a pas de limite de taille (contrairement à Python 2 qui avait `int` et `long`). Les entiers peuvent être aussi grands que la mémoire le permet.

```python
# Pas de limite de taille
grand_nombre = 10 ** 1000
print(grand_nombre)  # Fonctionne sans problème

# Représentation en différentes bases
binaire = 0b1010      # 10 en binaire
octal = 0o755         # 493 en octal
hexadecimal = 0xFF   # 255 en hexadécimal

print(binaire, octal, hexadecimal)
```

### Opérations arithmétiques

```python
a = 10
b = 3

# Division entière
resultat = a // b     # 3

# Modulo (reste)
reste = a % b         # 1

# Puissance
puissance = a ** b    # 1000

# Divmod (retourne quotient et reste)
quotient, reste = divmod(a, b)  # (3, 1)
```

### Méthodes utiles

```python
nombre = 42

# Conversion en différentes bases
print(bin(nombre))    # '0b101010'
print(oct(nombre))    # '0o52'
print(hex(nombre))    # '0x2a'

# Vérifications
print(nombre.bit_length())  # 6 (nombre de bits nécessaires)
print((1024).bit_length())  # 11
```

### Cache des petits entiers

Python met en cache les petits entiers (-5 à 256) pour optimiser les performances :

```python
a = 256
b = 256
print(a is b)  # True (même objet en cache)

c = 257
d = 257
print(c is d)  # False (pas de cache pour les grands entiers)
```

## Type float (nombres à virgule flottante)

### Caractéristiques

Les `float` en Python suivent la norme IEEE 754 (double précision, 64 bits). Ils ont une précision limitée et peuvent causer des problèmes d'arrondi.

```python
# Représentation
pi = 3.14159
scientifique = 1.5e3  # 1500.0
negatif = -42.5

# Précision limitée
print(0.1 + 0.2)  # 0.30000000000000004 (pas exactement 0.3!)
```

### Pièges des nombres à virgule flottante

```python
# ❌ Ne comparez jamais directement des floats
if 0.1 + 0.2 == 0.3:
    print("Égal")  # Ne s'exécutera pas!

# ✅ Utilisez une tolérance
epsilon = 1e-9
if abs((0.1 + 0.2) - 0.3) < epsilon:
    print("Égal")  # S'exécutera

# Ou utilisez math.isclose() (Python 3.5+)
import math
if math.isclose(0.1 + 0.2, 0.3):
    print("Égal")
```

### Valeurs spéciales

```python
import math

# Infini
infini = float('inf')
print(infini > 1000)  # True

# Moins l'infini
moins_infini = float('-inf')

# NaN (Not a Number)
nan = float('nan')
print(nan == nan)     # False (NaN n'est jamais égal à lui-même)
print(math.isnan(nan))  # True
```

### Méthodes utiles

```python
import math

x = 3.7

# Arrondis
print(round(x))        # 4 (arrondi standard)
print(math.floor(x))   # 3 (arrondi vers le bas)
print(math.ceil(x))    # 4 (arrondi vers le haut)
print(math.trunc(x))   # 3 (troncature)

# Valeurs absolues
print(abs(-5.5))       # 5.5

# Puissances et racines
print(math.sqrt(16))   # 4.0
print(math.pow(2, 3))  # 8.0
```

## Type bool (booléens)

### Caractéristiques

`bool` est une sous-classe de `int`. `True` vaut `1` et `False` vaut `0`. Ce sont des singletons (une seule instance de chaque).

```python
# Valeurs booléennes
vrai = True
faux = False

# True et False sont des singletons
print(True is True)    # True
print(False is False)  # True

# Héritage de int
print(True == 1)       # True
print(False == 0)       # True
print(True + True)     # 2 (mais évitez de faire ça!)
```

### Valeurs truthy et falsy

En Python, toutes les valeurs peuvent être évaluées comme booléennes :

**Valeurs falsy** (évaluées comme `False`) :
- `None`
- `False`
- `0` (int, float, complex)
- `""` (chaîne vide)
- `[]` (liste vide)
- `{}` (dictionnaire vide)
- `set()` (ensemble vide)

**Tout le reste est truthy** (évalué comme `True`)

```python
# Exemples
if 0:
    print("Ne s'exécute pas")

if []:
    print("Ne s'exécute pas")

if "hello":
    print("S'exécute")  # ✅

if [1, 2, 3]:
    print("S'exécute")  # ✅
```

### Conversion en booléen

```python
# Fonction bool()
print(bool(0))      # False
print(bool(1))      # True
print(bool(""))     # False
print(bool("hello")) # True
print(bool([]))     # False
print(bool([1]))    # True
```

### Utilisation pratique

```python
# Vérification d'existence
liste = [1, 2, 3]
if liste:  # Plus Pythonic que len(liste) > 0
    print("Liste non vide")

# Valeur par défaut
nom = nom_utilisateur or "Anonyme"  # Si nom_utilisateur est falsy

# Vérification de None
if valeur is not None:  # Utiliser 'is', pas '=='
    traiter(valeur)
```

## Conversions entre types

### Conversions explicites

```python
# Vers int
print(int(3.7))        # 3 (troncature)
print(int("42"))       # 42
print(int("1010", 2))  # 10 (binaire vers décimal)

# Vers float
print(float(42))       # 42.0
print(float("3.14"))   # 3.14

# Vers bool
print(bool(0))         # False
print(bool(1))         # True
print(bool(""))        # False
print(bool("hello"))   # True
```

### Conversions implicites

```python
# Python convertit automatiquement dans les opérations
resultat = 5 + 3.14    # float (5.0 + 3.14)
print(type(resultat))  # <class 'float'>

# Mais attention aux chaînes
# print(5 + "3")       # ❌ TypeError
print(5 + int("3"))    # ✅ 8
```

## Opérations et comparaisons

### Opérateurs de comparaison

```python
a = 10
b = 3

print(a == b)   # False
print(a != b)   # True
print(a < b)    # False
print(a > b)    # True
print(a <= b)   # False
print(a >= b)   # True
```

### Comparaisons en chaîne

```python
# Python permet les comparaisons en chaîne
if 0 < x < 10:
    print("x est entre 0 et 10")

# Équivalent à
if 0 < x and x < 10:
    print("x est entre 0 et 10")
```

## Bonnes pratiques

### 1. Utilisez `math.isclose()` pour comparer des floats

```python
import math

# ❌ Mauvais
if a == b:  # Peut échouer avec des floats

# ✅ Bon
if math.isclose(a, b):
    pass
```

### 2. Utilisez des entiers pour les calculs monétaires

```python
# ❌ Mauvais (imprécision des floats)
prix = 19.99
total = prix * 100  # Peut avoir des erreurs d'arrondi

# ✅ Bon (utiliser des centimes)
prix_centimes = 1999
total_centimes = prix_centimes * 100
total_euros = total_centimes / 100
```

### 3. Utilisez les valeurs truthy/falsy intelligemment

```python
# ❌ Moins Pythonic
if len(liste) > 0:
    traiter(liste)

# ✅ Plus Pythonic
if liste:
    traiter(liste)
```

### 4. Évitez les conversions booléennes implicites dans les calculs

```python
# ❌ Confus
resultat = True + True  # 2, mais pas clair

# ✅ Explicite
resultat = 1 + 1  # 2, clair
```

## Points clés à retenir

- ✅ `int` n'a pas de limite de taille en Python 3
- ✅ Les `float` ont une précision limitée (utilisez `math.isclose()` pour comparer)
- ✅ `bool` hérite de `int` (`True == 1`, `False == 0`)
- ✅ Toutes les valeurs sont truthy sauf les valeurs falsy explicites
- ✅ Utilisez `is` pour comparer avec `None`, pas `==`
- ✅ Les petits entiers (-5 à 256) sont mis en cache par Python
- ✅ Évitez les comparaisons directes de floats, utilisez une tolérance

Ces types de base sont simples mais cachent des subtilités importantes. Maîtrisez-les bien avant de passer aux types plus complexes.
