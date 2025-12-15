---
title: "Fonctions"
order: 4
parent: null
tags: ["python", "basics", "functions"]
---

# Fonctions

Les fonctions permettent d'organiser et de réutiliser du code. Elles sont essentielles pour créer des programmes modulaires et maintenables.

## Définition de fonction

### Fonction simple

```python
def dire_bonjour():
    """Affiche un message de salutation"""
    print("Bonjour !")

dire_bonjour()  # Appel de la fonction
```

### Structure d'une fonction

```python
def nom_fonction(parametres):
    """
    Docstring : description de la fonction
    """
    # Corps de la fonction
    return valeur  # Optionnel
```

## Fonctions avec paramètres

### Paramètres positionnels

```python
def saluer(nom):
    print(f"Bonjour, {nom} !")

saluer("Alice")  # Bonjour, Alice !
```

### Plusieurs paramètres

```python
def additionner(a, b):
    return a + b

resultat = additionner(5, 3)
print(resultat)  # 8
```

### Ordre des paramètres

```python
def creer_email(nom, domaine, extension="com"):
    return f"{nom}@{domaine}.{extension}"

email1 = creer_email("alice", "example")  # alice@example.com
email2 = creer_email("bob", "test", "org")  # bob@test.org
```

## Valeurs par défaut

```python
def saluer(nom="Utilisateur", formal=False):
    if formal:
        print(f"Bonjour, Monsieur/Madame {nom} !")
    else:
        print(f"Salut {nom} !")

saluer()  # Salut Utilisateur !
saluer("Bob")  # Salut Bob !
saluer("Alice", formal=True)  # Bonjour, Monsieur/Madame Alice !
```

### Attention : valeurs mutables par défaut

```python
# ❌ MAUVAIS : liste mutable comme valeur par défaut
def ajouter_item(item, liste=[]):
    liste.append(item)
    return liste

# ✅ BON : utiliser None
def ajouter_item(item, liste=None):
    if liste is None:
        liste = []
    liste.append(item)
    return liste
```

## Arguments nommés (keyword arguments)

```python
def creer_personne(nom, age, ville="Paris", email=None):
    personne = {
        "nom": nom,
        "age": age,
        "ville": ville
    }
    if email:
        personne["email"] = email
    return personne

# Appel avec arguments nommés (ordre n'importe pas)
personne1 = creer_personne(age=30, nom="Alice", ville="Lyon")
personne2 = creer_personne(nom="Bob", age=25, email="bob@example.com")
```

## Retour de valeurs

### Return simple

```python
def additionner(a, b):
    return a + b

resultat = additionner(5, 3)
```

### Return multiple

```python
def diviser(a, b):
    quotient = a // b
    reste = a % b
    return quotient, reste

q, r = diviser(17, 5)  # q=3, r=2
```

### Return None (implicite)

```python
def afficher_message(msg):
    print(msg)
    # Pas de return explicite, retourne None

resultat = afficher_message("Hello")
print(resultat)  # None
```

## Types de paramètres

### *args : arguments positionnels variables

```python
def additionner_tous(*args):
    """Additionne tous les arguments"""
    total = 0
    for nombre in args:
        total += nombre
    return total

somme = additionner_tous(1, 2, 3, 4, 5)  # 15
```

### **kwargs : arguments nommés variables

```python
def creer_profil(**kwargs):
    """Crée un profil avec des arguments nommés arbitraires"""
    profil = {}
    for cle, valeur in kwargs.items():
        profil[cle] = valeur
    return profil

profil = creer_profil(nom="Alice", age=25, ville="Paris")
# {"nom": "Alice", "age": 25, "ville": "Paris"}
```

### Combinaison

```python
def fonction_complete(obligatoire, *args, defaut="valeur", **kwargs):
    print(f"Obligatoire: {obligatoire}")
    print(f"Args: {args}")
    print(f"Défaut: {defaut}")
    print(f"Kwargs: {kwargs}")

fonction_complete(1, 2, 3, defaut="autre", extra="valeur")
```

## Docstrings

```python
def calculer_moyenne(nombres):
    """
    Calcule la moyenne d'une liste de nombres.
    
    Args:
        nombres (list): Liste de nombres
        
    Returns:
        float: La moyenne des nombres
        
    Raises:
        ValueError: Si la liste est vide
    """
    if not nombres:
        raise ValueError("La liste ne peut pas être vide")
    return sum(nombres) / len(nombres)
```

## Portée des variables (scope)

### Variables locales vs globales

```python
x = 10  # Variable globale

def fonction():
    x = 20  # Variable locale (masque la globale)
    print(f"Local: {x}")

fonction()  # Local: 20
print(f"Global: {x}")  # Global: 10

# Modifier une variable globale
def modifier_globale():
    global x
    x = 30

modifier_globale()
print(x)  # 30
```

## Fonctions lambda (fonctions anonymes)

### Syntaxe de base

```python
# Fonction normale
def carre(x):
    return x ** 2

# Fonction lambda équivalente
carre = lambda x: x ** 2

print(carre(5))  # 25
```

### Utilisation avec map, filter, sorted

```python
nombres = [1, 2, 3, 4, 5]

# map : applique une fonction à chaque élément
carres = list(map(lambda x: x ** 2, nombres))
# [1, 4, 9, 16, 25]

# filter : filtre les éléments
pairs = list(filter(lambda x: x % 2 == 0, nombres))
# [2, 4]

# sorted : tri avec fonction de clé
personnes = [{"nom": "Alice", "age": 25}, {"nom": "Bob", "age": 30}]
triees = sorted(personnes, key=lambda p: p["age"])
```

### Limites des lambdas

```python
# ✅ OK : expression simple
lambda x: x * 2

# ❌ Pas OK : instructions multiples (utiliser une fonction normale)
# lambda x: print(x); return x * 2  # Erreur
```

## Fonctions d'ordre supérieur

### Fonction qui prend une fonction en paramètre

```python
def appliquer_operation(nombres, operation):
    """Applique une opération à chaque nombre"""
    return [operation(n) for n in nombres]

def doubler(x):
    return x * 2

def carre(x):
    return x ** 2

nombres = [1, 2, 3, 4, 5]
doubles = appliquer_operation(nombres, doubler)  # [2, 4, 6, 8, 10]
carres = appliquer_operation(nombres, carre)     # [1, 4, 9, 16, 25]
```

### Fonction qui retourne une fonction

```python
def creer_multiplicateur(facteur):
    """Crée une fonction qui multiplie par un facteur"""
    def multiplier(nombre):
        return nombre * facteur
    return multiplier

multiplier_par_2 = creer_multiplicateur(2)
multiplier_par_5 = creer_multiplicateur(5)

print(multiplier_par_2(10))  # 20
print(multiplier_par_5(10))   # 50
```

## Décorateurs (introduction)

```python
def logger(func):
    """Décorateur qui log les appels de fonction"""
    def wrapper(*args, **kwargs):
        print(f"Appel de {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@logger
def saluer(nom):
    print(f"Bonjour {nom} !")

saluer("Alice")
# Appel de saluer
# Bonjour Alice !
```

## Exemples pratiques

### Validation de données

```python
def valider_email(email):
    """Valide un format d'email basique"""
    if "@" not in email:
        return False
    if "." not in email.split("@")[1]:
        return False
    return True

if valider_email("alice@example.com"):
    print("Email valide")
```

### Calcul récursif

```python
def factorielle(n):
    """Calcule la factorielle de n (récursif)"""
    if n <= 1:
        return 1
    return n * factorielle(n - 1)

print(factorielle(5))  # 120
```

### Gestion d'erreurs dans les fonctions

```python
def diviser(a, b):
    """Divise a par b avec gestion d'erreur"""
    if b == 0:
        raise ValueError("Division par zéro impossible")
    return a / b

try:
    resultat = diviser(10, 0)
except ValueError as e:
    print(f"Erreur : {e}")
```

## Bonnes pratiques

1. **Noms descriptifs** : `calculer_moyenne` plutôt que `calc`
2. **Une fonction, une responsabilité** : chaque fonction fait une chose
3. **Docstrings** : documentez vos fonctions
4. **Paramètres par défaut** : utilisez `None` pour les valeurs mutables
5. **Éviter les effets de bord** : préférez retourner des valeurs plutôt que modifier des variables globales
6. **Fonctions courtes** : idéalement moins de 20-30 lignes
7. **Type hints** (optionnel mais recommandé) : `def additionner(a: int, b: int) -> int:`

Les fonctions sont la base de la programmation modulaire. Maîtrisez-les bien avant de passer à la programmation orientée objet !

