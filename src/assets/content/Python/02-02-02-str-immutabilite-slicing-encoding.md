---
title: "str (immutabilité, slicing, encoding)"
order: 2.02.02
parent: "02-02-types-natifs-en-profondeur.md"
tags: ["python", "string", "str"]
---

# str (immutabilité, slicing, encoding)

Les chaînes de caractères en Python sont immutables et offrent des opérations puissantes comme le slicing. La gestion de l'encoding est également cruciale, surtout quand on travaille avec des données internationales.

## Concepts de base

En Python, les chaînes de caractères sont des objets de type `str`. Elles sont **immutables** : une fois créées, elles ne peuvent pas être modifiées. Toute opération qui semble modifier une chaîne crée en réalité une nouvelle chaîne.

```python
# Création de chaînes
texte1 = "Hello"
texte2 = 'World'
texte3 = """Multi-ligne
avec plusieurs
lignes"""
texte4 = '''Autre façon
de faire du
multi-ligne'''

print(type(texte1))  # <class 'str'>
```

## Immutabilité des strings

### Pourquoi l'immutabilité ?

L'immutabilité des chaînes offre plusieurs avantages :
- **Sécurité** : Pas de modification accidentelle
- **Hashabilité** : Les chaînes peuvent être utilisées comme clés de dictionnaire
- **Thread-safety** : Pas de problème de concurrence
- **Optimisations** : Python peut réutiliser les chaînes identiques

### Démonstration de l'immutabilité

```python
# Tentative de modification
texte = "Hello"
print(id(texte))  # Adresse mémoire de l'objet

# "Modification" crée un nouvel objet
texte = texte + " World"
print(id(texte))  # Nouvelle adresse mémoire (objet différent)

# Tentative de modification directe (impossible)
texte = "Hello"
# texte[0] = "h"  # ❌ TypeError: 'str' object does not support item assignment
```

### Conséquences pratiques

```python
# Concaténation inefficace (crée de nouveaux objets)
resultat = ""
for i in range(1000):
    resultat += str(i)  # Crée une nouvelle chaîne à chaque itération
    # Inefficace pour de grandes chaînes!

# ✅ Solution efficace : utiliser join()
resultat = "".join(str(i) for i in range(1000))
# ou
resultat = "".join([str(i) for i in range(1000)])
```

## Slicing et opérations sur les strings

### Accès aux caractères

```python
texte = "Hello, World!"

# Accès par index (commence à 0)
print(texte[0])   # 'H'
print(texte[1])   # 'e'
print(texte[-1])  # '!' (index négatif depuis la fin)
print(texte[-2])  # 'd'

# Index hors limites
# print(texte[100])  # ❌ IndexError: string index out of range
```

### Slicing (découpage)

Le slicing permet d'extraire une partie d'une chaîne. La syntaxe est `[start:stop:step]`.

```python
texte = "Hello, World!"

# Syntaxe de base : [start:stop]
print(texte[0:5])      # "Hello" (de l'index 0 à 4, 5 exclu)
print(texte[7:12])     # "World" (de l'index 7 à 11)

# Omission de start (début)
print(texte[:5])       # "Hello" (du début à l'index 4)

# Omission de stop (fin)
print(texte[7:])       # "World!" (de l'index 7 à la fin)

# Omission des deux (copie complète)
print(texte[:])        # "Hello, World!" (copie de toute la chaîne)

# Index négatifs
print(texte[-6:])      # "World!" (6 caractères depuis la fin)
print(texte[:-7])      # "Hello" (tout sauf les 7 derniers)
print(texte[-6:-1])    # "World" (de -6 à -1, -1 exclu)
```

### Step (pas) dans le slicing

```python
texte = "Hello, World!"

# Step positif (avance)
print(texte[::2])      # "Hlo ol!" (tous les 2 caractères)
print(texte[0:5:2])    # "Hlo" (de 0 à 4, tous les 2)

# Step négatif (recule)
print(texte[::-1])     # "!dlroW ,olleH" (inverse la chaîne)
print(texte[5:0:-1])   # ",olle" (de 5 à 1 en reculant)
```

### Exemples pratiques de slicing

```python
# Extraire le nom de domaine
email = "user@example.com"
domaine = email[email.index("@") + 1:]
print(domaine)  # "example.com"

# Extraire les 3 premiers caractères
texte = "Python"
prefixe = texte[:3]
print(prefixe)  # "Pyt"

# Inverser une chaîne
texte = "Python"
inverse = texte[::-1]
print(inverse)  # "nohtyP"

# Extraire tous les caractères pairs
texte = "0123456789"
pairs = texte[::2]
print(pairs)  # "02468"
```

### Opérations sur les strings

```python
# Concaténation
texte1 = "Hello"
texte2 = "World"
resultat = texte1 + ", " + texte2
print(resultat)  # "Hello, World"

# Répétition
texte = "Ha"
repetition = texte * 3
print(repetition)  # "HaHaHa"

# Vérification d'appartenance
texte = "Hello, World!"
print("World" in texte)      # True
print("Python" in texte)     # False
print("World" not in texte)  # False

# Comparaisons
print("abc" < "def")  # True (ordre lexicographique)
print("abc" == "abc")  # True
print("ABC" < "abc")  # True (majuscules avant minuscules en ASCII)
```

## Encoding et Unicode

### Unicode en Python 3

En Python 3, les chaînes sont **toujours en Unicode** (UTF-8 par défaut). C'est une différence majeure avec Python 2.

```python
# Chaînes Unicode
texte = "Hello"
texte_unicode = "Bonjour"
texte_emoji = "Hello 👋"
texte_chinois = "你好"

# Tous sont des str (Unicode)
print(type(texte))         # <class 'str'>
print(type(texte_unicode)) # <class 'str'>
print(type(texte_emoji))   # <class 'str'>
```

### Encodage et décodage

Pour travailler avec des fichiers ou des données binaires, vous devez encoder/décoder :

```python
# Encoder une chaîne en bytes
texte = "Hello, 世界"
bytes_utf8 = texte.encode('utf-8')
print(bytes_utf8)  # b'Hello, \xe4\xb8\x96\xe7\x95\x8c'
print(type(bytes_utf8))  # <class 'bytes'>

# Décoder des bytes en chaîne
texte_decode = bytes_utf8.decode('utf-8')
print(texte_decode)  # "Hello, 世界"

# Autres encodages
bytes_latin1 = texte.encode('latin-1', errors='ignore')
# Note: certains caractères peuvent être perdus
```

### Gestion des erreurs d'encodage

```python
# Différentes stratégies de gestion d'erreurs
texte = "Hello, 世界"

# 'strict' (par défaut) : lève une exception
try:
    bytes_latin1 = texte.encode('latin-1')
except UnicodeEncodeError:
    print("Erreur d'encodage")

# 'ignore' : ignore les caractères problématiques
bytes_ignore = texte.encode('latin-1', errors='ignore')
print(bytes_ignore)  # b'Hello, '

# 'replace' : remplace par un caractère de substitution
bytes_replace = texte.encode('latin-1', errors='replace')
print(bytes_replace)  # b'Hello, ??'

# 'xmlcharrefreplace' : remplace par des références XML
bytes_xml = texte.encode('ascii', errors='xmlcharrefreplace')
print(bytes_xml)  # b'Hello, &#19990;&#30028;'
```

### Travail avec des fichiers

```python
# Écrire dans un fichier (encodage UTF-8 par défaut)
with open('fichier.txt', 'w', encoding='utf-8') as f:
    f.write("Hello, 世界")

# Lire depuis un fichier
with open('fichier.txt', 'r', encoding='utf-8') as f:
    contenu = f.read()
    print(contenu)  # "Hello, 世界"

# Si l'encodage est inconnu
with open('fichier.txt', 'r', encoding='utf-8', errors='replace') as f:
    contenu = f.read()  # Remplace les caractères invalides par
```

## Méthodes utiles

### Méthodes de recherche

```python
texte = "Hello, World!"

# find() : trouve la première occurrence (retourne -1 si pas trouvé)
index = texte.find("World")
print(index)  # 7

# index() : trouve la première occurrence (lève ValueError si pas trouvé)
try:
    index = texte.index("World")
    print(index)  # 7
except ValueError:
    print("Non trouvé")

# count() : compte les occurrences
nombre = texte.count("l")
print(nombre)  # 3

# startswith() et endswith()
print(texte.startswith("Hello"))  # True
print(texte.endswith("!"))        # True
```

### Méthodes de modification (retournent une nouvelle chaîne)

```python
texte = "  Hello, World!  "

# strip() : enlève les espaces au début et à la fin
nettoye = texte.strip()
print(nettoye)  # "Hello, World!"

# lstrip() et rstrip() : enlève à gauche ou à droite
print(texte.lstrip())  # "Hello, World!  "
print(texte.rstrip())  # "  Hello, World!"

# upper() et lower() : change la casse
print(texte.upper())  # "  HELLO, WORLD!  "
print(texte.lower())  # "  hello, world!  "
print(texte.capitalize())  # "  hello, world!  "
print(texte.title())  # "  Hello, World!  "

# replace() : remplace des sous-chaînes
nouveau = texte.replace("World", "Python")
print(nouveau)  # "  Hello, Python!  "
```

### Méthodes de découpage

```python
texte = "apple,banana,cherry"

# split() : découpe selon un séparateur
fruits = texte.split(",")
print(fruits)  # ['apple', 'banana', 'cherry']

# splitlines() : découpe selon les lignes
texte = "Ligne 1\nLigne 2\nLigne 3"
lignes = texte.splitlines()
print(lignes)  # ['Ligne 1', 'Ligne 2', 'Ligne 3']

# join() : joint une liste de chaînes
fruits = ['apple', 'banana', 'cherry']
texte = ",".join(fruits)
print(texte)  # "apple,banana,cherry"
```

### Méthodes de vérification

```python
# isdigit() : vérifie si tous les caractères sont des chiffres
print("123".isdigit())    # True
print("12a".isdigit())    # False

# isalpha() : vérifie si tous les caractères sont des lettres
print("Hello".isalpha())  # True
print("Hello123".isalpha()) # False

# isalnum() : vérifie si tous les caractères sont alphanumériques
print("Hello123".isalnum()) # True
print("Hello 123".isalnum()) # False (espace)

# isspace() : vérifie si tous les caractères sont des espaces
print("   ".isspace())    # True
print("  a  ".isspace())  # False

# isupper() et islower() : vérifie la casse
print("HELLO".isupper())  # True
print("hello".islower())  # True
```

### Formatage de chaînes

```python
# f-strings (Python 3.6+, recommandé)
nom = "Alice"
age = 30
message = f"Je m'appelle {nom} et j'ai {age} ans"
print(message)  # "Je m'appelle Alice et j'ai 30 ans"

# Expressions dans les f-strings
a = 10
b = 20
resultat = f"{a} + {b} = {a + b}"
print(resultat)  # "10 + 20 = 30"

# format() (alternative)
message = "Je m'appelle {} et j'ai {} ans".format(nom, age)
print(message)  # "Je m'appelle Alice et j'ai 30 ans"

# % (ancien style, à éviter)
message = "Je m'appelle %s et j'ai %d ans" % (nom, age)
print(message)  # "Je m'appelle Alice et j'ai 30 ans"
```

## Pièges courants

### 1. Concaténation inefficace

```python
# ❌ Inefficace pour de grandes chaînes
resultat = ""
for i in range(10000):
    resultat += str(i)

# ✅ Efficace
resultat = "".join(str(i) for i in range(10000))
```

### 2. Confusion entre bytes et str

```python
# str (Unicode)
texte = "Hello"
print(type(texte))  # <class 'str'>

# bytes (binaire)
donnees = b"Hello"
print(type(donnees))  # <class 'bytes'>

# Ne pas mélanger
# texte + donnees  # ❌ TypeError: can only concatenate str to str

# Convertir
texte_from_bytes = donnees.decode('utf-8')
bytes_from_text = texte.encode('utf-8')
```

### 3. Index hors limites

```python
texte = "Hello"
# print(texte[10])  # ❌ IndexError

# ✅ Vérifier avant
if len(texte) > 10:
    print(texte[10])
```

### 4. Modifications "sur place"

```python
# ❌ Ne fonctionne pas comme prévu
texte = "Hello"
texte.upper()  # Retourne une nouvelle chaîne, ne modifie pas texte
print(texte)  # "Hello" (inchangé)

# ✅ Assigner le résultat
texte = texte.upper()
print(texte)  # "HELLO"
```

## Bonnes pratiques

### 1. Utilisez f-strings pour le formatage

```python
# ✅ Moderne et lisible
nom = "Alice"
age = 30
message = f"Bonjour {nom}, vous avez {age} ans"

# ❌ Ancien style
message = "Bonjour %s, vous avez %d ans" % (nom, age)
```

### 2. Utilisez join() pour la concaténation

```python
# ✅ Efficace
mots = ["Hello", "World", "Python"]
texte = " ".join(mots)

# ❌ Inefficace
texte = ""
for mot in mots:
    texte += mot + " "
```

### 3. Spécifiez toujours l'encodage avec les fichiers

```python
# ✅ Explicite
with open('fichier.txt', 'r', encoding='utf-8') as f:
    contenu = f.read()

# ⚠️ Dépend de la configuration système
with open('fichier.txt', 'r') as f:
    contenu = f.read()
```

### 4. Utilisez des raw strings pour les regex

```python
import re

# ✅ Raw string (évite les problèmes d'échappement)
pattern = r"\d+"

# ⚠️ String normale (nécessite plus d'échappement)
pattern = "\\d+"
```

## Points clés à retenir

- ✅ Les chaînes sont **immutables** : toute modification crée un nouvel objet
- ✅ Utilisez `join()` pour concaténer efficacement plusieurs chaînes
- ✅ Le slicing `[start:stop:step]` est puissant et flexible
- ✅ Python 3 utilise Unicode par défaut (UTF-8)
- ✅ Distinguez `str` (Unicode) et `bytes` (binaire)
- ✅ Utilisez f-strings pour le formatage (Python 3.6+)
- ✅ Spécifiez toujours l'encodage lors de la lecture/écriture de fichiers
- ✅ Les méthodes de chaîne retournent de nouvelles chaînes, elles ne modifient pas l'original

Les chaînes de caractères sont l'un des types les plus utilisés en Python. Maîtriser le slicing, l'encodage et les méthodes courantes vous permettra d'écrire du code efficace et robuste.
