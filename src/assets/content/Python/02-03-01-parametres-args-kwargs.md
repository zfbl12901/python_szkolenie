---
title: "Paramètres (*args, **kwargs)"
order: 2.03.01
parent: "02-03-fonctions-citoyens-premiere-classe.md"
tags: ["python", "fonctions", "parametres"]
---

# Paramètres (*args, **kwargs)

Python permet de définir des fonctions avec un nombre variable d'arguments grâce à `*args` et `**kwargs`. Cette fonctionnalité est puissante et très utilisée dans le code Pythonic.

## Concepts de base

En Python, vous pouvez définir des fonctions qui acceptent un nombre variable d'arguments :

- **`*args`** : Récupère les arguments positionnels supplémentaires sous forme de tuple
- **`**kwargs`** : Récupère les arguments nommés supplémentaires sous forme de dictionnaire

Les noms `args` et `kwargs` sont des conventions, vous pouvez utiliser d'autres noms, mais ces conventions sont universellement reconnues.

## *args (arguments positionnels variables)

### Syntaxe de base

`*args` permet de capturer un nombre variable d'arguments positionnels :

```python
def fonction(*args):
    print(f"Nombre d'arguments: {len(args)}")
    print(f"Arguments: {args}")
    print(f"Type: {type(args)}")  # <class 'tuple'>

fonction(1, 2, 3)
# Nombre d'arguments: 3
# Arguments: (1, 2, 3)
# Type: <class 'tuple'>

fonction("a", "b", "c", "d")
# Nombre d'arguments: 4
# Arguments: ('a', 'b', 'c', 'd')
# Type: <class 'tuple'>
```

### Utilisation pratique

```python
# Fonction qui additionne tous les arguments
def additionner(*args):
    total = 0
    for nombre in args:
        total += nombre
    return total

print(additionner(1, 2, 3))        # 6
print(additionner(10, 20, 30, 40)) # 100
print(additionner())                # 0 (aucun argument)

# Version plus Pythonic avec sum()
def additionner(*args):
    return sum(args)
```

### Combinaison avec arguments normaux

Vous pouvez combiner des arguments normaux avec `*args` :

```python
def afficher_info(nom, *scores):
    print(f"Nom: {nom}")
    print(f"Scores: {scores}")
    moyenne = sum(scores) / len(scores) if scores else 0
    print(f"Moyenne: {moyenne}")

afficher_info("Alice", 10, 20, 30)
# Nom: Alice
# Scores: (10, 20, 30)
# Moyenne: 20.0

afficher_info("Bob", 15, 25)
# Nom: Bob
# Scores: (15, 25)
# Moyenne: 20.0
```

**Important** : `*args` doit venir **après** les arguments positionnels normaux.

```python
# ✅ Correct
def fonction(nom, *args):
    pass

# ❌ Erreur de syntaxe
# def fonction(*args, nom):
#     pass
```

### Déballage avec *

Vous pouvez aussi utiliser `*` pour déballer une séquence en arguments :

```python
def afficher(a, b, c):
    print(f"a={a}, b={b}, c={c}")

# Appel normal
afficher(1, 2, 3)  # a=1, b=2, c=3

# Déballage d'une liste
liste = [1, 2, 3]
afficher(*liste)  # a=1, b=2, c=3

# Déballage d'un tuple
tuple = (10, 20, 30)
afficher(*tuple)  # a=10, b=20, c=30
```

## **kwargs (arguments nommés variables)

### Syntaxe de base

`**kwargs` permet de capturer un nombre variable d'arguments nommés (keyword arguments) :

```python
def fonction(**kwargs):
    print(f"Nombre d'arguments: {len(kwargs)}")
    print(f"Arguments: {kwargs}")
    print(f"Type: {type(kwargs)}")  # <class 'dict'>

fonction(nom="Alice", age=30, ville="Paris")
# Nombre d'arguments: 3
# Arguments: {'nom': 'Alice', 'age': 30, 'ville': 'Paris'}
# Type: <class 'dict'>
```

### Utilisation pratique

```python
# Fonction qui affiche des informations utilisateur
def creer_utilisateur(**kwargs):
    utilisateur = {}
    for cle, valeur in kwargs.items():
        utilisateur[cle] = valeur
    return utilisateur

user1 = creer_utilisateur(nom="Alice", age=30, email="alice@example.com")
print(user1)  # {'nom': 'Alice', 'age': 30, 'email': 'alice@example.com'}

user2 = creer_utilisateur(nom="Bob", ville="Lyon")
print(user2)  # {'nom': 'Bob', 'ville': 'Lyon'}
```

### Combinaison avec arguments normaux

```python
def afficher_profil(nom, **infos):
    print(f"Nom: {nom}")
    print("Informations supplémentaires:")
    for cle, valeur in infos.items():
        print(f"  {cle}: {valeur}")

afficher_profil("Alice", age=30, ville="Paris", profession="Ingénieur")
# Nom: Alice
# Informations supplémentaires:
#   age: 30
#   ville: Paris
#   profession: Ingénieur
```

### Déballage avec **

Vous pouvez déballer un dictionnaire en arguments nommés :

```python
def afficher_info(nom, age, ville):
    print(f"{nom}, {age} ans, habite à {ville}")

# Appel normal
afficher_info("Alice", 30, "Paris")

# Déballage d'un dictionnaire
dico = {"nom": "Bob", "age": 25, "ville": "Lyon"}
afficher_info(**dico)  # Bob, 25 ans, habite à Lyon
```

## Combinaison des deux

### Ordre des paramètres

L'ordre correct est :
1. Arguments positionnels normaux
2. `*args`
3. Arguments nommés avec valeurs par défaut
4. `**kwargs`

```python
def fonction_complete(nom, *args, age=0, **kwargs):
    print(f"Nom: {nom}")
    print(f"Args: {args}")
    print(f"Age: {age}")
    print(f"Kwargs: {kwargs}")

fonction_complete("Alice", 1, 2, 3, age=30, ville="Paris", profession="Ingénieur")
# Nom: Alice
# Args: (1, 2, 3)
# Age: 30
# Kwargs: {'ville': 'Paris', 'profession': 'Ingénieur'}
```

### Exemple complet

```python
def logger(message, *args, niveau="INFO", **metadata):
    """
    Fonction de logging flexible.
    
    Args:
        message: Message principal
        *args: Arguments additionnels à formater dans le message
        niveau: Niveau de log (par défaut "INFO")
        **metadata: Métadonnées supplémentaires
    """
    message_formate = message.format(*args) if args else message
    print(f"[{niveau}] {message_formate}")
    if metadata:
        print(f"Métadonnées: {metadata}")

# Utilisation
logger("Utilisateur {} connecté", "Alice")
# [INFO] Utilisateur Alice connecté

logger("Erreur survenue", "Erreur critique", niveau="ERROR", code=500, timestamp="2024-01-01")
# [ERROR] Erreur survenue
# Métadonnées: {'code': 500, 'timestamp': '2024-01-01'}
```

## Cas d'usage pratiques

### 1. Wrapper de fonction

```python
def mesurer_temps(func):
    """Décorateur qui mesure le temps d'exécution."""
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        resultat = func(*args, **kwargs)
        temps = time.time() - start
        print(f"{func.__name__} a pris {temps:.4f} secondes")
        return resultat
    return wrapper

@mesurer_temps
def calculer(n):
    return sum(range(n))

calculer(1000000)
```

### 2. Fonction de configuration flexible

```python
def configurer_app(**options):
    """Configure une application avec des options flexibles."""
    config = {
        "host": "localhost",
        "port": 8000,
        "debug": False
    }
    # Met à jour avec les options fournies
    config.update(options)
    return config

# Utilisation
config1 = configurer_app()  # Valeurs par défaut
config2 = configurer_app(port=9000, debug=True)  # Personnalisé
```

### 3. Délégation d'arguments

```python
class Logger:
    def __init__(self, nom, *args, **kwargs):
        self.nom = nom
        self.args = args
        self.kwargs = kwargs
    
    def log(self, message, *args, **kwargs):
        # Combine les arguments de __init__ et de log
        tous_args = self.args + args
        tous_kwargs = {**self.kwargs, **kwargs}
        print(f"[{self.nom}] {message.format(*tous_args)}")
        if tous_kwargs:
            print(f"  {tous_kwargs}")

logger = Logger("APP", prefix="[SYSTEM]")
logger.log("Utilisateur {} connecté", "Alice", timestamp="2024-01-01")
```

### 4. Fonction wrapper pour API

```python
def appeler_api(endpoint, *args, **params):
    """Appelle une API avec des paramètres flexibles."""
    import requests
    
    # Construit l'URL avec les arguments positionnels
    url = f"https://api.example.com/{endpoint}/{'/'.join(map(str, args))}"
    
    # Ajoute les paramètres de requête
    response = requests.get(url, params=params)
    return response.json()

# Utilisation
resultat = appeler_api("users", 123, "profile", format="json", include="details")
```

## Pièges courants

### 1. Ordre incorrect des paramètres

```python
# ❌ Erreur de syntaxe
# def fonction(*args, nom):
#     pass

# ✅ Correct
def fonction(nom, *args):
    pass
```

### 2. Conflit de noms dans kwargs

```python
def fonction(**kwargs):
    # Si vous passez un argument nommé 'kwargs', cela crée un conflit
    pass

# Évitez de passer 'kwargs' comme argument nommé
# fonction(kwargs={...})  # ⚠️ Peut être confus
```

### 3. Déballage incorrect

```python
def fonction(a, b, c):
    pass

liste = [1, 2]
# fonction(*liste)  # ❌ TypeError: pas assez d'arguments

# ✅ Vérifiez la longueur
if len(liste) == 3:
    fonction(*liste)
```

### 4. Mélange args et kwargs dans le déballage

```python
def fonction(a, b, c, d=4, e=5):
    print(a, b, c, d, e)

args = [1, 2, 3]
kwargs = {"d": 10, "e": 20}

# ✅ Déballage correct
fonction(*args, **kwargs)  # 1 2 3 10 20
```

## Bonnes pratiques

### 1. Utilisez des noms explicites dans la documentation

```python
def fonction(*args, **kwargs):
    """
    Fonction avec arguments variables.
    
    Args:
        *args: Arguments positionnels additionnels
        **kwargs: Arguments nommés additionnels
            - option1: Description de option1
            - option2: Description de option2
    """
    pass
```

### 2. Validez les arguments si nécessaire

```python
def additionner(*args):
    """Additionne des nombres."""
    if not args:
        raise ValueError("Au moins un argument est requis")
    
    if not all(isinstance(x, (int, float)) for x in args):
        raise TypeError("Tous les arguments doivent être des nombres")
    
    return sum(args)
```

### 3. Utilisez des valeurs par défaut raisonnables

```python
def configurer(**kwargs):
    config = {
        "timeout": 30,
        "retries": 3,
        "debug": False
    }
    config.update(kwargs)
    return config
```

### 4. Documentez les kwargs attendus

```python
def creer_utilisateur(nom, **kwargs):
    """
    Crée un utilisateur.
    
    Args:
        nom: Nom de l'utilisateur
        **kwargs: Options additionnelles
            - age: Âge de l'utilisateur
            - email: Email de l'utilisateur
            - ville: Ville de résidence
    """
    utilisateur = {"nom": nom}
    utilisateur.update(kwargs)
    return utilisateur
```

## Points clés à retenir

- ✅ `*args` capture les arguments positionnels supplémentaires dans un tuple
- ✅ `**kwargs` capture les arguments nommés supplémentaires dans un dictionnaire
- ✅ L'ordre correct : arguments normaux, `*args`, arguments avec défaut, `**kwargs`
- ✅ Utilisez `*` pour déballer une séquence en arguments positionnels
- ✅ Utilisez `**` pour déballer un dictionnaire en arguments nommés
- ✅ Les noms `args` et `kwargs` sont des conventions, pas des mots-clés
- ✅ Très utile pour les wrappers, décorateurs, et fonctions flexibles
- ✅ Documentez les kwargs attendus pour améliorer la lisibilité

Maîtriser `*args` et `**kwargs` est essentiel pour écrire du code Python flexible et réutilisable. Ces fonctionnalités sont largement utilisées dans les bibliothèques Python et permettent de créer des APIs élégantes.
