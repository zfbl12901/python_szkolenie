---
title: "Variables et Types de Données"
order: 2
parent: null
tags: ["python", "basics", "variables"]
---

# Variables et Types de Données

En Python, les variables sont créées simplement en leur assignant une valeur. Python détermine automatiquement le type (typage dynamique), ce qui rend le code plus simple mais nécessite de faire attention aux types lors des opérations.

## Création de variables

```python
# Pas besoin de déclarer le type
nom = "Alice"
age = 25
taille = 1.75
```

### Règles de nommage

- Commence par une lettre ou un underscore
- Peut contenir des lettres, chiffres et underscores
- Sensible à la casse (`age` ≠ `Age`)
- Ne peut pas être un mot-clé Python (`if`, `for`, `def`, etc.)

```python
# Valide
nom_utilisateur = "Alice"
_age = 25
nom2 = "Bob"

# Invalide
2nom = "Alice"  # Erreur : ne peut pas commencer par un chiffre
nom-utilisateur = "Alice"  # Erreur : tiret non autorisé
```

## Types numériques

### Entiers (int)

```python
age = 25
nombre_negatif = -10
grand_nombre = 1000000
# Python 3 supporte les entiers de taille arbitraire
tres_grand = 10**100
```

### Nombres décimaux (float)

```python
prix = 19.99
temperature = -5.5
scientifique = 1.5e3  # 1500.0
```

### Nombres complexes

```python
z = 3 + 4j
partie_reelle = z.real  # 3.0
partie_imaginaire = z.imag  # 4.0
```

### Opérations numériques

```python
a, b = 10, 3

# Opérations de base
somme = a + b        # 13
difference = a - b   # 7
produit = a * b      # 30
quotient = a / b     # 3.333...
division_entiere = a // b  # 3
reste = a % b        # 1
puissance = a ** b   # 1000

# Opérations avec assignation
a += 5  # équivalent à a = a + 5
```

## Chaînes de caractères (str)

### Création

```python
# Guillemets simples ou doubles
nom = "Python"
message = 'Bonjour le monde'

# Chaînes multi-lignes
description = """Ceci est une
chaîne sur plusieurs
lignes"""

# f-strings (formatage moderne, Python 3.6+)
nom = "Alice"
age = 25
message = f"Bonjour, je m'appelle {nom} et j'ai {age} ans"
```

### Opérations sur les chaînes

```python
# Concaténation
prenom = "Alice"
nom = "Dupont"
nom_complet = prenom + " " + nom  # "Alice Dupont"

# Répétition
separateur = "-" * 20  # "--------------------"

# Accès aux caractères
texte = "Python"
premier = texte[0]      # "P"
dernier = texte[-1]     # "n" (indexation négative)
sous_chaine = texte[0:3]  # "Pyt" (slicing)

# Méthodes utiles
texte.upper()           # "PYTHON"
texte.lower()           # "python"
texte.capitalize()      # "Python"
texte.replace("P", "J") # "Jython"
texte.split("t")        # ["Py", "hon"]
len(texte)              # 6
```

## Booléens (bool)

```python
est_actif = True
est_complete = False

# Opérations booléennes
resultat = True and False  # False
resultat = True or False   # True
resultat = not True        # False

# Conversion
bool(1)   # True
bool(0)   # False
bool("")  # False
bool("texte")  # True
```

## Collections

### Listes (list) - Mutables

```python
# Création
fruits = ["pomme", "banane", "orange"]
nombres = [1, 2, 3, 4, 5]
mixte = [1, "deux", 3.0, True]

# Accès
premier = fruits[0]        # "pomme"
dernier = fruits[-1]       # "orange"
sous_liste = fruits[1:3]   # ["banane", "orange"]

# Modification
fruits.append("kiwi")      # Ajoute à la fin
fruits.insert(1, "mangue")  # Insère à l'index 1
fruits.remove("banane")     # Supprime la première occurrence
fruits.pop()                # Supprime et retourne le dernier élément

# Méthodes utiles
len(fruits)                 # Longueur
fruits.sort()              # Trie sur place
fruits.reverse()           # Inverse l'ordre
fruits.count("pomme")      # Compte les occurrences
```

### Tuples (tuple) - Immuables

```python
# Création
coordonnees = (10, 20)
point = 10, 20  # Parenthèses optionnelles
singleton = (42,)  # Notez la virgule !

# Accès (comme les listes)
x = coordonnees[0]  # 10
y = coordonnees[1]  # 20

# Déballage (unpacking)
x, y = coordonnees

# Utilisation : données qui ne doivent pas changer
```

### Dictionnaires (dict) - Paires clé-valeur

```python
# Création
personne = {
    "nom": "Alice",
    "age": 30,
    "ville": "Paris"
}

# Accès
nom = personne["nom"]           # "Alice"
age = personne.get("age", 0)    # 30 (avec valeur par défaut)

# Modification
personne["age"] = 31
personne["email"] = "alice@example.com"  # Ajoute une nouvelle clé
personne.pop("ville")  # Supprime et retourne la valeur

# Méthodes utiles
personne.keys()    # Toutes les clés
personne.values()  # Toutes les valeurs
personne.items()   # Toutes les paires (clé, valeur)

# Parcours
for cle, valeur in personne.items():
    print(f"{cle}: {valeur}")
```

### Ensembles (set) - Collections non ordonnées, uniques

```python
# Création
nombres = {1, 2, 3, 4, 5}
fruits = set(["pomme", "banane", "orange"])

# Opérations
nombres.add(6)           # Ajoute un élément
nombres.remove(1)        # Supprime (erreur si absent)
nombres.discard(1)       # Supprime (pas d'erreur si absent)

# Opérations ensemblistes
a = {1, 2, 3}
b = {3, 4, 5}
union = a | b            # {1, 2, 3, 4, 5}
intersection = a & b      # {3}
difference = a - b        # {1, 2}
```

## Vérifier et obtenir le type

```python
age = 25
nom = "Python"

# Vérifier le type
type(age)        # <class 'int'>
type(nom)        # <class 'str'>
isinstance(age, int)  # True
isinstance(age, str)  # False
```

## Conversion de types (casting)

```python
# Conversion explicite
age = 25
age_str = str(age)           # "25"
nombre = int("42")           # 42
decimal = float("3.14")      # 3.14
booleen = bool(1)            # True

# Conversion de collections
liste = [1, 2, 3]
tuple_liste = tuple(liste)  # (1, 2, 3)
ensemble = set(liste)        # {1, 2, 3}

# Attention aux conversions
int("abc")  # Erreur : ValueError
int("42.5")  # Erreur : ValueError (utiliser float d'abord)
```

## Variables spéciales

### None

```python
# None représente l'absence de valeur
valeur = None

if valeur is None:
    print("Pas de valeur")
```

### Constantes (convention)

```python
# Par convention, les constantes sont en MAJUSCULES
PI = 3.14159
VERSION = "1.0.0"
MAX_CONNECTIONS = 100
```

## Bonnes pratiques

1. **Noms descriptifs** : `age_utilisateur` plutôt que `a`
2. **Constantes en majuscules** : `MAX_SIZE = 1000`
3. **Éviter les types mixtes** dans les listes si possible
4. **Utiliser des f-strings** pour le formatage (Python 3.6+)
5. **Vérifier les types** avec `isinstance()` plutôt que `type()`

## Exemple pratique

```python
# Gestion d'un utilisateur
utilisateur = {
    "nom": "Alice",
    "age": 25,
    "emails": ["alice@example.com", "alice.pro@example.com"],
    "actif": True
}

# Affichage formaté
message = f"""
Utilisateur : {utilisateur['nom']}
Âge : {utilisateur['age']} ans
Emails : {', '.join(utilisateur['emails'])}
Statut : {'Actif' if utilisateur['actif'] else 'Inactif'}
"""
print(message)
```

Maintenant que vous maîtrisez les variables et types, passons aux structures de contrôle pour gérer le flux d'exécution de vos programmes !

