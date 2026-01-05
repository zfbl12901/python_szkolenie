---
title: "__init__ et self"
order: 3.01.01
parent: "03-01-classes-et-objets.md"
tags: ["python", "init", "self", "constructeur"]
---

# __init__ et self

La méthode `__init__` est le constructeur de la classe, et `self` est la référence à l'instance courante. Comprendre ces concepts fondamentaux est essentiel pour maîtriser la POO en Python.

## Concepts de base

En Python, contrairement à des langages comme Java ou C++, il n'y a pas de "vrai" constructeur. La méthode `__init__` est appelée **après** que l'objet a été créé. Elle sert à **initialiser** l'instance, pas à la créer.

### Création d'un objet en Python

Le processus de création d'un objet en Python se fait en deux étapes :

1. **Création** : Python appelle `__new__()` pour créer l'objet
2. **Initialisation** : Python appelle `__init__()` pour initialiser l'objet

Dans la plupart des cas, vous n'avez besoin que de `__init__`.

## La méthode __init__

### Syntaxe de base

```python
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

# Création d'une instance
alice = Personne("Alice", 30)
print(alice.nom)  # "Alice"
print(alice.age)  # 30
```

### Caractéristiques de __init__

- **Nom spécial** : Commence et se termine par deux underscores (`__init__`)
- **Premier paramètre** : Toujours `self` (référence à l'instance)
- **Pas de retour** : Ne retourne rien explicitement (retourne `None` implicitement)
- **Appel automatique** : Appelée automatiquement lors de la création d'une instance

```python
class Voiture:
    def __init__(self, marque, modele):
        self.marque = marque
        self.modele = modele
        # Pas de return nécessaire (et ne doit pas retourner de valeur)

voiture = Voiture("Toyota", "Corolla")
# __init__ est appelée automatiquement ici
```

### Initialisation avec valeurs par défaut

```python
class Personne:
    def __init__(self, nom, age=0, ville="Inconnue"):
        self.nom = nom
        self.age = age
        self.ville = ville

# Utilisation avec valeurs par défaut
alice = Personne("Alice")  # age=0, ville="Inconnue"
bob = Personne("Bob", 25)  # ville="Inconnue"
charlie = Personne("Charlie", 30, "Paris")  # Tous les paramètres
```

### Initialisation conditionnelle

```python
class Compte:
    def __init__(self, titulaire, solde_initial=0):
        self.titulaire = titulaire
        if solde_initial < 0:
            raise ValueError("Le solde initial ne peut pas être négatif")
        self.solde = solde_initial
        self.actif = True

# Création
compte = Compte("Alice", 1000)
# compte = Compte("Bob", -100)  # ❌ ValueError
```

## Le paramètre self

### Qu'est-ce que self ?

`self` est une référence à l'instance courante de la classe. C'est le premier paramètre de toutes les méthodes d'instance (mais pas des méthodes statiques ou de classe).

```python
class Personne:
    def __init__(self, nom):
        # self fait référence à l'instance qui est en train d'être créée
        self.nom = nom
    
    def dire_bonjour(self):
        # self fait référence à l'instance qui appelle la méthode
        print(f"Bonjour, je suis {self.nom}")

alice = Personne("Alice")
alice.dire_bonjour()  # "Bonjour, je suis Alice"
# Quand on appelle alice.dire_bonjour(), self = alice
```

### Pourquoi self est explicite ?

Contrairement à d'autres langages (Java, C++) où `this` est implicite, Python rend `self` explicite pour :

1. **Clarté** : On voit clairement qu'on travaille avec une instance
2. **Flexibilité** : On peut passer `self` explicitement si besoin
3. **Cohérence** : Toutes les méthodes d'instance ont la même signature

```python
class Calculatrice:
    def __init__(self, valeur=0):
        self.valeur = valeur
    
    def ajouter(self, nombre):
        self.valeur += nombre
        return self  # Permet le chaînage de méthodes

calc = Calculatrice(10)
calc.ajouter(5).ajouter(3)  # Chaînage possible
print(calc.valeur)  # 18
```

### Appel explicite de self

Vous pouvez appeler une méthode avec `self` explicitement :

```python
class Personne:
    def __init__(self, nom):
        self.nom = nom
    
    def presenter(self):
        return f"Je suis {self.nom}"

alice = Personne("Alice")

# Appel normal (recommandé)
print(alice.presenter())  # "Je suis Alice"

# Appel explicite avec self (possible mais pas recommandé)
print(Personne.presenter(alice))  # "Je suis Alice"
```

## Exemples pratiques

### Exemple 1 : Classe simple

```python
class Rectangle:
    def __init__(self, largeur, hauteur):
        self.largeur = largeur
        self.hauteur = hauteur
    
    def aire(self):
        return self.largeur * self.hauteur
    
    def perimetre(self):
        return 2 * (self.largeur + self.hauteur)

rect = Rectangle(10, 5)
print(rect.aire())      # 50
print(rect.perimetre()) # 30
```

### Exemple 2 : Validation dans __init__

```python
class Email:
    def __init__(self, adresse):
        if "@" not in adresse:
            raise ValueError("Adresse email invalide")
        self.adresse = adresse
    
    def domaine(self):
        return self.adresse.split("@")[1]

# Utilisation
email = Email("alice@example.com")
print(email.domaine())  # "example.com"

# email = Email("adresse-invalide")  # ❌ ValueError
```

### Exemple 3 : Initialisation avec calculs

```python
class Cercle:
    def __init__(self, rayon):
        self.rayon = rayon
        # Calculs effectués à l'initialisation
        self.aire = 3.14159 * rayon ** 2
        self.perimetre = 2 * 3.14159 * rayon

cercle = Cercle(5)
print(cercle.aire)      # 78.53975
print(cercle.perimetre) # 31.4159
```

### Exemple 4 : Initialisation avec listes/dictionnaires

```python
class Panier:
    def __init__(self, client):
        self.client = client
        self.articles = []  # Liste vide initialisée
        self.total = 0.0
    
    def ajouter(self, article, prix):
        self.articles.append(article)
        self.total += prix

panier = Panier("Alice")
panier.ajouter("Livre", 15.99)
panier.ajouter("CD", 12.50)
print(panier.total)  # 28.49
```

### Exemple 5 : Factory pattern avec __init__

```python
class Utilisateur:
    def __init__(self, nom, email, role="utilisateur"):
        self.nom = nom
        self.email = email
        self.role = role
    
    @classmethod
    def creer_admin(cls, nom, email):
        """Méthode de classe pour créer un administrateur."""
        return cls(nom, email, role="admin")
    
    @classmethod
    def creer_moderateur(cls, nom, email):
        """Méthode de classe pour créer un modérateur."""
        return cls(nom, email, role="moderateur")

# Utilisation
admin = Utilisateur.creer_admin("Alice", "alice@example.com")
print(admin.role)  # "admin"
```

## Pièges courants

### Piège 1 : Oublier self

```python
# ❌ Erreur : oubli de self
class Personne:
    def __init__(nom, age):  # Manque self
        nom = nom  # Erreur!
        age = age

# ✅ Correct
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
```

### Piège 2 : Retourner une valeur dans __init__

```python
# ❌ Ne retournez jamais de valeur dans __init__
class Personne:
    def __init__(self, nom):
        self.nom = nom
        return self  # ❌ TypeError: __init__ should return None

# ✅ __init__ ne doit rien retourner
class Personne:
    def __init__(self, nom):
        self.nom = nom
        # Pas de return
```

### Piège 3 : Variables locales vs attributs d'instance

```python
# ❌ Variables locales (perdues après __init__)
class Personne:
    def __init__(self, nom):
        nom_local = nom  # Variable locale, pas un attribut!
        # self.nom n'existe pas

# ✅ Attributs d'instance
class Personne:
    def __init__(self, nom):
        self.nom = nom  # Attribut d'instance
```

### Piège 4 : Valeurs par défaut mutables

```python
# ❌ Dangereux : liste mutable comme valeur par défaut
class Panier:
    def __init__(self, articles=[]):  # ⚠️ Même liste partagée!
        self.articles = articles

# ✅ Solution : utiliser None
class Panier:
    def __init__(self, articles=None):
        if articles is None:
            articles = []
        self.articles = articles
```

## Bonnes pratiques

### 1. Toujours utiliser self pour les attributs d'instance

```python
# ✅ Bon
class Personne:
    def __init__(self, nom):
        self.nom = nom  # self.nom crée un attribut d'instance
```

### 2. Valider les entrées dans __init__

```python
# ✅ Validation
class Age:
    def __init__(self, valeur):
        if not isinstance(valeur, int):
            raise TypeError("L'âge doit être un entier")
        if valeur < 0 or valeur > 150:
            raise ValueError("L'âge doit être entre 0 et 150")
        self.valeur = valeur
```

### 3. Documenter __init__

```python
class Personne:
    def __init__(self, nom, age):
        """
        Initialise une personne.
        
        Args:
            nom: Nom de la personne
            age: Âge de la personne (doit être positif)
        
        Raises:
            ValueError: Si l'âge est négatif
        """
        if age < 0:
            raise ValueError("L'âge ne peut pas être négatif")
        self.nom = nom
        self.age = age
```

### 4. Initialiser tous les attributs dans __init__

```python
# ✅ Tous les attributs initialisés
class Compte:
    def __init__(self, titulaire, solde=0):
        self.titulaire = titulaire
        self.solde = solde
        self.historique = []  # Toujours initialiser
        self.actif = True
```

### 5. Utiliser des valeurs par défaut raisonnables

```python
# ✅ Valeurs par défaut claires
class Configuration:
    def __init__(self, host="localhost", port=8000, debug=False):
        self.host = host
        self.port = port
        self.debug = debug
```

## Points clés à retenir

- ✅ `__init__` est appelée **automatiquement** lors de la création d'une instance
- ✅ `__init__` **initialise** l'objet, ne le crée pas (c'est `__new__` qui le crée)
- ✅ `self` est le **premier paramètre** de toutes les méthodes d'instance
- ✅ `self` fait référence à **l'instance courante**
- ✅ `__init__` ne doit **jamais retourner de valeur** (retourne `None` implicitement)
- ✅ Utilisez `self.attribut` pour créer des **attributs d'instance**
- ✅ Évitez les **valeurs par défaut mutables** dans `__init__`
- ✅ **Validez les entrées** dans `__init__` pour éviter les états invalides

Comprendre `__init__` et `self` est fondamental pour la POO en Python. Ces concepts sont la base sur laquelle tout le reste s'appuie. Prenez le temps de bien les maîtriser avant de continuer.
