---
title: "Closures"
order: 2.03.04
parent: "02-03-fonctions-citoyens-premiere-classe.md"
tags: ["python", "closures", "functional"]
---

# Closures

Les closures permettent à une fonction interne d'accéder aux variables de la fonction englobante, même après que cette dernière ait terminé son exécution. C'est un concept fondamental de la programmation fonctionnelle et très utilisé en Python.

## Concepts de base

Une **closure** est une fonction qui "capture" des variables de son environnement (scope) externe. En Python, cela se produit naturellement quand une fonction interne référence des variables de la fonction externe.

### Exemple simple

```python
def fonction_externe(x):
    # Variable de la fonction externe
    def fonction_interne(y):
        # Accède à x de la fonction externe
        return x + y
    return fonction_interne

# Création d'une closure
additionner_5 = fonction_externe(5)
print(additionner_5(3))  # 8 (5 + 3)
print(additionner_5(10)) # 15 (5 + 10)

# Une autre closure avec une valeur différente
additionner_10 = fonction_externe(10)
print(additionner_10(3))  # 13 (10 + 3)
```

### Ce qui se passe

1. `fonction_externe(5)` crée une fonction interne qui "capture" la valeur `x = 5`
2. Cette fonction interne est retournée
3. Même après que `fonction_externe` ait terminé, la fonction interne garde accès à `x`
4. Chaque appel à `fonction_externe` crée une nouvelle closure avec sa propre valeur de `x`

## Comment fonctionnent les closures

### Capture des variables

```python
def creer_multiplicateur(facteur):
    def multiplier(nombre):
        return nombre * facteur  # facteur est capturé
    return multiplier

double = creer_multiplicateur(2)
triple = creer_multiplicateur(3)

print(double(5))   # 10 (5 * 2)
print(triple(5))   # 15 (5 * 3)
```

### Variables capturées vs locales

```python
def fonction_externe():
    variable_capturee = "capturée"
    
    def fonction_interne():
        variable_locale = "locale"
        # Accède à variable_capturee
        return f"{variable_capturee} et {variable_locale}"
    
    return fonction_interne

closure = fonction_externe()
print(closure())  # "capturée et locale"
```

### Inspection des closures

Vous pouvez inspecter les variables capturées :

```python
def creer_fonction(nom):
    def fonction_interne():
        return f"Bonjour {nom}"
    return fonction_interne

f = creer_fonction("Alice")
print(f.__closure__)  # Tuple de cellules
print(f.__closure__[0].cell_contents)  # "Alice"
```

## Cas d'usage

### 1. Fonctions de configuration

```python
def creer_validateur(min_val, max_val):
    """Crée une fonction de validation pour une plage de valeurs."""
    def valider(valeur):
        if valeur < min_val or valeur > max_val:
            raise ValueError(f"Valeur doit être entre {min_val} et {max_val}")
        return valeur
    return valider

# Création de validateurs spécialisés
valider_age = creer_validateur(0, 150)
valider_score = creer_validateur(0, 100)

print(valider_age(30))    # 30 ✅
# print(valider_age(200)) # ❌ ValueError

print(valider_score(85))  # 85 ✅
# print(valider_score(150)) # ❌ ValueError
```

### 2. Fonctions avec état

```python
def creer_compteur():
    """Crée un compteur avec état privé."""
    compte = 0  # État privé
    
    def incrementer():
        nonlocal compte  # Nécessaire pour modifier
        compte += 1
        return compte
    
    def obtenir_valeur():
        return compte
    
    def reset():
        nonlocal compte
        compte = 0
    
    # Retourne un dictionnaire avec les fonctions
    return {
        "incrementer": incrementer,
        "valeur": obtenir_valeur,
        "reset": reset
    }

compteur = creer_compteur()
print(compteur["incrementer"]())  # 1
print(compteur["incrementer"]())  # 2
print(compteur["valeur"]())        # 2
compteur["reset"]()
print(compteur["valeur"]())        # 0
```

### 3. Décorateurs

Les décorateurs utilisent les closures :

```python
def retry(max_tentatives=3):
    """Décorateur qui réessaie une fonction en cas d'échec."""
    def decorateur(func):
        def wrapper(*args, **kwargs):
            for tentative in range(max_tentatives):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if tentative == max_tentatives - 1:
                        raise
                    print(f"Tentative {tentative + 1} échouée, réessai...")
        return wrapper
    return decorateur

@retry(max_tentatives=3)
def fonction_risquee():
    import random
    if random.random() < 0.7:
        raise ValueError("Échec aléatoire")
    return "Succès"

# La fonction sera réessayée jusqu'à 3 fois
```

### 4. Callbacks et handlers

```python
def creer_handler(prefixe):
    """Crée un handler avec un préfixe personnalisé."""
    def handler(message):
        print(f"[{prefixe}] {message}")
    return handler

logger_info = creer_handler("INFO")
logger_error = creer_handler("ERROR")

logger_info("Application démarrée")    # [INFO] Application démarrée
logger_error("Une erreur est survenue")  # [ERROR] Une erreur est survenue
```

### 5. Mémoïsation (cache)

```python
def creer_cache():
    """Crée une fonction avec cache intégré."""
    cache = {}  # Cache privé
    
    def fonction_avec_cache(n):
        if n in cache:
            print(f"Cache hit pour {n}")
            return cache[n]
        print(f"Calcul pour {n}")
        resultat = n * 2  # Calcul coûteux simulé
        cache[n] = resultat
        return resultat
    
    return fonction_avec_cache

calculer = creer_cache()
print(calculer(5))  # Calcul pour 5, retourne 10
print(calculer(5))  # Cache hit pour 5, retourne 10
```

## Pièges courants

### Piège 1 : Variables modifiées après la création

```python
# ❌ Problème classique
fonctions = []
for i in range(3):
    def fonction():
        return i  # i sera 2 pour toutes les fonctions!
    fonctions.append(fonction)

for f in fonctions:
    print(f())  # 2, 2, 2 ⚠️ Toutes retournent 2!

# ✅ Solution 1 : valeur par défaut
fonctions = []
for i in range(3):
    def fonction(i=i):  # Capture la valeur actuelle
        return i
    fonctions.append(fonction)

for f in fonctions:
    print(f())  # 0, 1, 2 ✅

# ✅ Solution 2 : fonction factory
def creer_fonction(i):
    def fonction():
        return i
    return fonction

fonctions = [creer_fonction(i) for i in range(3)]
for f in fonctions:
    print(f())  # 0, 1, 2 ✅
```

### Piège 2 : Modification de variables capturées

```python
def creer_compteur():
    compte = 0
    
    def incrementer():
        # compte += 1  # ❌ UnboundLocalError
        # Python pense que compte est une variable locale
        
        # ✅ Solution : utiliser nonlocal
        nonlocal compte
        compte += 1
        return compte
    
    return incrementer

compteur = creer_compteur()
print(compteur())  # 1
print(compteur())  # 2
```

### Piège 3 : Variables mutables partagées

```python
# ⚠️ Attention aux objets mutables
def creer_fonctions():
    liste = []  # Objet mutable partagé
    
    def ajouter(x):
        liste.append(x)
        return liste
    
    return ajouter

f1 = creer_fonctions()
f2 = creer_fonctions()

f1(1)
f2(2)
print(f1(3))  # [1, 3] ⚠️ f2 a aussi modifié la liste!
print(f2(4))  # [2, 4] ⚠️ f1 a aussi modifié la liste!

# Si vous voulez des listes séparées, créez-les dans chaque closure
```

## Exemples pratiques

### Exemple 1 : Générateur de fonctions mathématiques

```python
def creer_operation(operation):
    """Crée une fonction d'opération mathématique."""
    if operation == "addition":
        def op(a, b):
            return a + b
    elif operation == "multiplication":
        def op(a, b):
            return a * b
    else:
        raise ValueError(f"Opération inconnue: {operation}")
    
    return op

additionner = creer_operation("addition")
multiplier = creer_operation("multiplication")

print(additionner(5, 3))    # 8
print(multiplier(5, 3))     # 15
```

### Exemple 2 : API builder pattern

```python
def creer_api_client(base_url, api_key):
    """Crée un client API avec configuration."""
    def get(endpoint):
        import requests
        url = f"{base_url}/{endpoint}"
        headers = {"Authorization": f"Bearer {api_key}"}
        return requests.get(url, headers=headers)
    
    def post(endpoint, data):
        import requests
        url = f"{base_url}/{endpoint}"
        headers = {"Authorization": f"Bearer {api_key}"}
        return requests.post(url, json=data, headers=headers)
    
    return {"get": get, "post": post}

# Utilisation
client = creer_api_client("https://api.example.com", "secret-key")
response = client["get"]("users")
```

### Exemple 3 : Fonction partielle (alternative à functools.partial)

```python
def multiplier_par(facteur):
    """Crée une fonction qui multiplie par un facteur."""
    def multiplier(nombre):
        return nombre * facteur
    return multiplier

# Utilisation
multiplier_par_2 = multiplier_par(2)
multiplier_par_10 = multiplier_par(10)

print(multiplier_par_2(5))   # 10
print(multiplier_par_10(5))  # 50
```

## Bonnes pratiques

### 1. Utilisez `nonlocal` pour modifier les variables capturées

```python
def creer_compteur():
    compte = 0
    
    def incrementer():
        nonlocal compte  # ✅ Nécessaire
        compte += 1
        return compte
    
    return incrementer
```

### 2. Documentez les closures

```python
def creer_validateur(min_val, max_val):
    """
    Crée une fonction de validation.
    
    Args:
        min_val: Valeur minimale acceptée
        max_val: Valeur maximale acceptée
        
    Returns:
        Fonction de validation qui lève ValueError si hors limites
    """
    def valider(valeur):
        if not (min_val <= valeur <= max_val):
            raise ValueError(f"Valeur doit être entre {min_val} et {max_val}")
        return valeur
    return valider
```

### 3. Évitez les closures complexes

```python
# ⚠️ Trop complexe
def fonction_complexe(a, b, c):
    x = a + b
    y = b * c
    z = x - y
    
    def interne1():
        return z * 2
    
    def interne2():
        return interne1() + x
    
    def interne3():
        return interne2() - y
    
    return interne3

# ✅ Préférez des classes pour la complexité
class Calculateur:
    def __init__(self, a, b, c):
        self.x = a + b
        self.y = b * c
        self.z = self.x - self.y
    
    def calculer(self):
        return (self.z * 2 + self.x) - self.y
```

## Points clés à retenir

- ✅ Une **closure** est une fonction qui capture des variables de son environnement
- ✅ Les closures permettent de créer des fonctions avec **état privé**
- ✅ Utilisez `nonlocal` pour **modifier** les variables capturées
- ✅ Chaque appel à la fonction externe crée une **nouvelle closure**
- ✅ Les closures sont utilisées dans les **décorateurs**, **callbacks**, et **factories**
- ✅ Attention au piège des variables modifiées dans les boucles
- ✅ Les closures rendent le code plus **modulaire** et **réutilisable**

Les closures sont un outil puissant en Python. Elles permettent de créer des fonctions spécialisées et de gérer l'état de manière élégante. Maîtrisez-les pour écrire du code plus fonctionnel et modulaire.
