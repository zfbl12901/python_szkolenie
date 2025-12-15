---
title: "Structures de Contrôle"
order: 3
parent: null
tags: ["python", "basics", "control-flow"]
---

# Structures de Contrôle

Les structures de contrôle permettent de gérer le flux d'exécution de votre programme. Elles déterminent quelles instructions sont exécutées et dans quel ordre.

## Conditions (if/elif/else)

### Structure de base

```python
age = 18

if age < 18:
    print("Mineur")
elif age < 65:
    print("Adulte")
else:
    print("Senior")
```

### Opérateurs de comparaison

```python
a, b = 10, 5

a == b   # Égalité : False
a != b   # Inégalité : True
a < b    # Inférieur : False
a > b    # Supérieur : True
a <= b   # Inférieur ou égal : False
a >= b   # Supérieur ou égal : True
```

### Opérateurs logiques

```python
age = 25
ville = "Paris"

# and : les deux conditions doivent être vraies
if age >= 18 and ville == "Paris":
    print("Adulte parisien")

# or : au moins une condition doit être vraie
if age < 18 or age > 65:
    print("Tarif réduit")

# not : inverse la condition
if not age < 18:
    print("Majeur")

# Combinaisons
if (age >= 18 and age <= 65) or ville == "Paris":
    print("Condition complexe")
```

### Conditions multiples

```python
score = 85

if score >= 90:
    note = "A"
elif score >= 80:
    note = "B"
elif score >= 70:
    note = "C"
elif score >= 60:
    note = "D"
else:
    note = "F"

print(f"Note : {note}")
```

### Opérateur ternaire

```python
age = 20
statut = "Majeur" if age >= 18 else "Mineur"

# Équivalent à :
if age >= 18:
    statut = "Majeur"
else:
    statut = "Mineur"
```

### Vérification d'appartenance

```python
fruits = ["pomme", "banane", "orange"]

# in : vérifie si un élément est dans une collection
if "pomme" in fruits:
    print("Pomme trouvée")

# not in : vérifie si un élément n'est pas dans une collection
if "kiwi" not in fruits:
    print("Kiwi non trouvé")

# Avec les dictionnaires (vérifie les clés)
personne = {"nom": "Alice", "age": 25}
if "nom" in personne:
    print(f"Nom : {personne['nom']}")
```

## Boucles

### Boucle for

#### Itérer sur une liste

```python
fruits = ["pomme", "banane", "orange"]
for fruit in fruits:
    print(fruit)
```

#### Avec range()

```python
# range(stop) : de 0 à stop-1
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(start, stop) : de start à stop-1
for i in range(2, 5):
    print(i)  # 2, 3, 4

# range(start, stop, step) : avec pas
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8
```

#### Avec enumerate()

```python
fruits = ["pomme", "banane", "orange"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 0: pomme
# 1: banane
# 2: orange

# Avec start personnalisé
for index, fruit in enumerate(fruits, start=1):
    print(f"{index}: {fruit}")
```

#### Parcourir un dictionnaire

```python
personne = {"nom": "Alice", "age": 25, "ville": "Paris"}

# Parcourir les clés
for cle in personne:
    print(cle)

# Parcourir les valeurs
for valeur in personne.values():
    print(valeur)

# Parcourir les paires (clé, valeur)
for cle, valeur in personne.items():
    print(f"{cle}: {valeur}")
```

#### Boucles imbriquées

```python
for i in range(3):
    for j in range(3):
        print(f"({i}, {j})")
# (0, 0), (0, 1), (0, 2), (1, 0), ...
```

### Boucle while

```python
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1
```

#### Boucle infinie avec break

```python
while True:
    reponse = input("Tapez 'quit' pour quitter: ")
    if reponse == "quit":
        break
    print(f"Vous avez tapé : {reponse}")
```

#### While avec else

```python
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1
else:
    print("Boucle terminée normalement")
# Le else s'exécute si la boucle se termine sans break
```

## Break et Continue

### Break : sortir de la boucle

```python
# Sortir immédiatement de la boucle
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4
```

### Continue : passer à l'itération suivante

```python
# Ignorer le reste de l'itération actuelle
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)  # 1, 3, 5, 7, 9 (seulement les impairs)
```

### Exemple pratique

```python
# Recherche dans une liste
nombres = [1, 3, 5, 7, 9, 11, 13]
recherche = 7
trouve = False

for nombre in nombres:
    if nombre == recherche:
        trouve = True
        break

if trouve:
    print(f"{recherche} trouvé !")
else:
    print(f"{recherche} non trouvé")
```

## Pass : instruction vide

```python
# Utilisé comme placeholder
if condition:
    pass  # À compléter plus tard
else:
    print("Action")

# Utile pour les structures à compléter
def fonction_a_creer():
    pass  # À implémenter
```

## Compréhensions (List/Dict/Set Comprehensions)

### List Comprehension

```python
# Créer une liste de carrés
carres = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Avec condition
pairs = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]

# Nested comprehension
matrice = [[i*j for j in range(3)] for i in range(3)]
# [[0, 0, 0], [0, 1, 2], [0, 2, 4]]
```

### Dict Comprehension

```python
# Créer un dictionnaire
carres_dict = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Avec condition
pairs_dict = {x: x*2 for x in range(10) if x % 2 == 0}
```

### Set Comprehension

```python
# Créer un ensemble
carres_set = {x**2 for x in range(5)}
# {0, 1, 4, 9, 16}
```

## Exemples pratiques

### Validation de données

```python
age = input("Quel est votre âge ? ")
try:
    age = int(age)
    if age < 0:
        print("Âge invalide")
    elif age < 18:
        print("Mineur")
    elif age < 65:
        print("Adulte")
    else:
        print("Senior")
except ValueError:
    print("Veuillez entrer un nombre valide")
```

### Menu interactif

```python
while True:
    print("\n=== Menu ===")
    print("1. Option 1")
    print("2. Option 2")
    print("3. Quitter")
    
    choix = input("Votre choix : ")
    
    if choix == "1":
        print("Option 1 sélectionnée")
    elif choix == "2":
        print("Option 2 sélectionnée")
    elif choix == "3":
        print("Au revoir !")
        break
    else:
        print("Choix invalide")
```

### Traitement de données

```python
# Filtrer et transformer une liste
nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Nombres pairs au carré
resultat = [x**2 for x in nombres if x % 2 == 0]
# [4, 16, 36, 64, 100]

# Avec boucle traditionnelle
resultat = []
for x in nombres:
    if x % 2 == 0:
        resultat.append(x**2)
```

## Bonnes pratiques

1. **Éviter les boucles infinies** : toujours avoir une condition de sortie
2. **Utiliser les compréhensions** pour des transformations simples
3. **Préférer `in`** plutôt que des boucles pour vérifier l'appartenance
4. **Nommer les variables de boucle** de manière descriptive (`fruit` plutôt que `f`)
5. **Éviter les boucles imbriquées profondes** (plus de 2-3 niveaux)

Les structures de contrôle sont essentielles pour créer des programmes dynamiques et interactifs. Maîtrisez-les bien avant de passer aux fonctions !

