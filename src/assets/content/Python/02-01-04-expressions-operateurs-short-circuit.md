---
title: "Expressions, opérateurs, short-circuit"
order: 2.01.04
parent: "02-01-syntaxe-et-modele-de-base.md"
tags: ["python", "expressions", "operateurs", "short-circuit", "logique"]
---

# Expressions, opérateurs, short-circuit

Python offre une riche palette d'opérateurs pour manipuler les données. Comprendre ces opérateurs et le mécanisme d'évaluation en court-circuit (short-circuit) est essentiel pour écrire du code efficace et Pythonic.

## Opérateurs arithmétiques

Les opérateurs arithmétiques de base sont similaires à d'autres langages :

```python
# Addition
resultat = 10 + 5        # 15

# Soustraction
resultat = 10 - 5        # 5

# Multiplication
resultat = 10 * 5        # 50

# Division (toujours float)
resultat = 10 / 3        # 3.3333333333333335

# Division entière
resultat = 10 // 3       # 3

# Modulo (reste de la division)
resultat = 10 % 3        # 1

# Puissance
resultat = 2 ** 3        # 8
resultat = 10 ** 2       # 100
```

### Opérateurs d'affectation composés

```python
x = 10
x += 5   # Équivalent à x = x + 5
print(x) # 15

x -= 3   # x = x - 3
x *= 2   # x = x * 2
x /= 4   # x = x / 4
x //= 2  # x = x // 2
x %= 3   # x = x % 3
x **= 2  # x = x ** 2
```

## Opérateurs de comparaison

Les opérateurs de comparaison retournent toujours un booléen (`True` ou `False`) :

```python
# Égalité
5 == 5        # True
5 == 3        # False

# Inégalité
5 != 3        # True
5 != 5        # False

# Comparaisons numériques
5 > 3         # True
5 < 3         # False
5 >= 5        # True
5 <= 3        # False

# Comparaisons de chaînes (ordre lexicographique)
"abc" < "def" # True
"abc" > "def" # False
```

### Comparaisons en chaîne

Python permet les comparaisons en chaîne :

```python
# ✅ Valide en Python
if 0 < x < 10:
    print("x est entre 0 et 10")

# Équivalent à
if 0 < x and x < 10:
    print("x est entre 0 et 10")

# Exemple pratique
age = 25
if 18 <= age < 65:
    print("Personne active")
```

## Opérateurs logiques

Python utilise les mots-clés `and`, `or`, `not` (pas de `&&`, `||`, `!` comme en C/Java).

### `and` (ET logique)

```python
# Retourne le premier élément "falsy" ou le dernier élément
print(True and True)   # True
print(True and False)  # False
print(False and True)  # False
print(False and False) # False

# Comportement avec valeurs non-booléennes
print(5 and 10)        # 10 (retourne le dernier si tout est truthy)
print(0 and 10)        # 0 (retourne le premier falsy)
print("" and "hello")  # "" (chaîne vide est falsy)
```

### `or` (OU logique)

```python
# Retourne le premier élément "truthy" ou le dernier élément
print(True or True)    # True
print(True or False)   # True
print(False or True)   # True
print(False or False)  # False

# Comportement avec valeurs non-booléennes
print(5 or 10)         # 5 (retourne le premier truthy)
print(0 or 10)         # 10 (retourne le premier truthy trouvé)
print("" or "hello")   # "hello"
```

### `not` (NON logique)

```python
print(not True)        # False
print(not False)       # True
print(not 0)           # True
print(not 5)           # False
print(not "")          # True
print(not "hello")     # False
```

## Évaluation en court-circuit (Short-circuit)

L'évaluation en court-circuit est un mécanisme où Python arrête l'évaluation d'une expression dès qu'il peut déterminer le résultat final.

### Avec `and`

```python
# Si le premier élément est falsy, Python ne vérifie pas le second
def fonction_couteuse():
    print("Cette fonction est exécutée")
    return True

False and fonction_couteuse()  # La fonction n'est JAMAIS appelée
True and fonction_couteuse()   # La fonction EST appelée
```

### Avec `or`

```python
# Si le premier élément est truthy, Python ne vérifie pas le second
True or fonction_couteuse()   # La fonction n'est JAMAIS appelée
False or fonction_couteuse()  # La fonction EST appelée
```

### Cas d'usage pratiques

#### 1. Vérification de None avant accès

```python
# ✅ Utilisation du short-circuit
def obtenir_longueur(liste):
    return liste and len(liste) or 0

# Mieux encore avec une condition explicite
def obtenir_longueur(liste):
    return len(liste) if liste else 0

# Ou avec l'opérateur walrus (Python 3.8+)
def obtenir_longueur(liste):
    return len(liste) if (liste := liste) else 0
```

#### 2. Valeur par défaut

```python
# Si config est None ou vide, utiliser la valeur par défaut
valeur = config or "valeur_par_defaut"

# Équivalent à
if config:
    valeur = config
else:
    valeur = "valeur_par_defaut"
```

#### 3. Vérification d'existence avant accès

```python
# Éviter une KeyError
if "clé" in dictionnaire and dictionnaire["clé"] > 10:
    print("OK")

# Avec get() (plus Pythonic)
if dictionnaire.get("clé", 0) > 10:
    print("OK")
```

## Opérateurs d'identité

Les opérateurs `is` et `is not` vérifient l'identité (même objet en mémoire), pas l'égalité :

```python
# Identité
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)  # True (valeurs égales)
print(a is b)  # False (objets différents)
print(a is c)  # True (même objet)

# None doit toujours être comparé avec is
if valeur is None:
    print("Valeur est None")

# ❌ Ne faites jamais ça
if valeur == None:  # PEP 8: utiliser 'is' pour None
    print("Mauvais style")
```

## Opérateurs d'appartenance

Les opérateurs `in` et `not in` vérifient l'appartenance :

```python
# Dans une liste
liste = [1, 2, 3, 4, 5]
print(3 in liste)      # True
print(10 in liste)     # False
print(3 not in liste)  # False

# Dans une chaîne
texte = "Hello World"
print("Hello" in texte)    # True
print("hello" in texte)    # False (sensible à la casse)

# Dans un dictionnaire (vérifie les clés)
dico = {"a": 1, "b": 2}
print("a" in dico)         # True
print(1 in dico)           # False (1 n'est pas une clé)
print(1 in dico.values())  # True (1 est une valeur)
```

## Opérateurs bit à bit

Pour les opérations au niveau des bits :

```python
# ET bit à bit
print(5 & 3)   # 1 (0101 & 0011 = 0001)

# OU bit à bit
print(5 | 3)   # 7 (0101 | 0011 = 0111)

# XOR bit à bit
print(5 ^ 3)   # 6 (0101 ^ 0011 = 0110)

# Décalage à gauche
print(5 << 1)  # 10 (0101 << 1 = 1010)

# Décalage à droite
print(5 >> 1)  # 2 (0101 >> 1 = 0010)

# Complément (inversion des bits)
print(~5)      # -6
```

## Opérateurs spéciaux Python

### Opérateur walrus `:=` (Python 3.8+)

Permet d'assigner une valeur dans une expression :

```python
# Avant Python 3.8
n = len(liste)
if n > 10:
    print(f"Liste trop longue: {n} éléments")

# Avec l'opérateur walrus
if (n := len(liste)) > 10:
    print(f"Liste trop longue: {n} éléments")

# Utile dans les boucles
while (ligne := fichier.readline()) != "":
    traiter(ligne)
```

### Opérateur de déballage `*` et `**`

```python
# Déballage de séquence
nombres = [1, 2, 3]
print(*nombres)  # Équivalent à print(1, 2, 3)

# Déballage de dictionnaire
dico = {"a": 1, "b": 2}
autre_dico = {"c": 3, **dico}  # {"c": 3, "a": 1, "b": 2}
```

## Priorité des opérateurs

Python suit un ordre de priorité (du plus prioritaire au moins prioritaire) :

1. `()` (parenthèses)
2. `**` (puissance)
3. `*`, `/`, `//`, `%` (multiplication, division)
4. `+`, `-` (addition, soustraction)
5. `==`, `!=`, `<`, `>`, `<=`, `>=`, `is`, `is not`, `in`, `not in` (comparaisons)
6. `not` (NON logique)
7. `and` (ET logique)
8. `or` (OU logique)

```python
# Utilisez des parenthèses pour clarifier
resultat = (2 + 3) * 4      # 20
resultat = 2 + 3 * 4        # 14 (multiplication avant addition)

# Pour les opérateurs logiques
if x > 0 and x < 10 or y == 0:  # Ambigu
    pass

if (x > 0 and x < 10) or y == 0:  # ✅ Clair
    pass
```

## Expressions conditionnelles (ternaire)

Python supporte les expressions conditionnelles (opérateur ternaire) :

```python
# Syntaxe
valeur = valeur_si_vrai if condition else valeur_si_faux

# Exemple
age = 20
statut = "majeur" if age >= 18 else "mineur"
print(statut)  # "majeur"

# Équivalent à
if age >= 18:
    statut = "majeur"
else:
    statut = "mineur"
```

### Expressions ternaires imbriquées

```python
# ⚠️ Peut devenir illisible
resultat = "positif" if x > 0 else "négatif" if x < 0 else "zéro"

# ✅ Préférable pour la lisibilité
if x > 0:
    resultat = "positif"
elif x < 0:
    resultat = "négatif"
else:
    resultat = "zéro"
```

## Exemples pratiques

### Validation avec short-circuit

```python
def valider_utilisateur(nom, age, email):
    # Toutes les conditions doivent être vraies
    return (nom and len(nom) > 0 and 
            age and age >= 18 and 
            email and "@" in email)

# Si nom est vide, les autres vérifications ne sont pas faites
```

### Valeur par défaut intelligente

```python
# Utiliser la première valeur non-vide
nom = nom_utilisateur or nom_par_defaut or "Anonyme"

# Équivalent à
if nom_utilisateur:
    nom = nom_utilisateur
elif nom_par_defaut:
    nom = nom_par_defaut
else:
    nom = "Anonyme"
```

### Vérification d'existence

```python
# Vérifier si une clé existe et a une valeur
if "clé" in dico and dico["clé"]:
    traiter(dico["clé"])

# Plus Pythonic avec get()
if dico.get("clé"):
    traiter(dico["clé"])
```

## Points clés à retenir

- ✅ Python utilise `and`, `or`, `not` (pas `&&`, `||`, `!`)
- ✅ L'évaluation en court-circuit optimise les performances
- ✅ `is` vérifie l'identité, `==` vérifie l'égalité
- ✅ Utilisez `is None` pour comparer avec None
- ✅ `in` vérifie l'appartenance dans les séquences
- ✅ Les comparaisons en chaîne sont possibles : `0 < x < 10`
- ✅ Utilisez des parenthèses pour clarifier la priorité
- ✅ L'opérateur walrus `:=` permet l'assignation dans les expressions (Python 3.8+)

Maîtriser les opérateurs Python et comprendre l'évaluation en court-circuit vous permettra d'écrire du code plus efficace et plus Pythonic.
