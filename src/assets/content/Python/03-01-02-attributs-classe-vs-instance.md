---
title: "Attributs de classe vs d'instance"
order: 3.01.02
parent: "03-01-classes-et-objets.md"
tags: ["python", "attributs", "classe", "instance"]
---

# Attributs de classe vs d'instance

Comprendre la différence entre attributs de classe et attributs d'instance est crucial pour éviter les bugs subtils. C'est l'un des concepts les plus importants et les plus mal compris en POO Python.

## Concepts de base

En Python, il existe deux types d'attributs :

- **Attributs d'instance** : Appartiennent à chaque instance individuelle
- **Attributs de classe** : Partagés par toutes les instances de la classe

Cette distinction est fondamentale et peut causer des bugs subtils si mal comprise.

## Attributs d'instance

### Définition

Les attributs d'instance sont des variables qui appartiennent à **chaque instance individuelle**. Chaque objet a sa propre copie de ces attributs.

```python
class Personne:
    def __init__(self, nom, age):
        # Attributs d'instance (créés avec self.)
        self.nom = nom
        self.age = age

# Chaque instance a ses propres attributs
alice = Personne("Alice", 30)
bob = Personne("Bob", 25)

print(alice.nom)  # "Alice"
print(bob.nom)     # "Bob"
print(alice.age)   # 30
print(bob.age)     # 25

# Les attributs sont indépendants
alice.age = 31
print(alice.age)   # 31
print(bob.age)     # 25 (inchangé)
```

### Caractéristiques

- **Créés avec `self.`** : `self.attribut = valeur`
- **Uniques par instance** : Chaque objet a sa propre copie
- **Modifiables indépendamment** : Modifier un attribut d'une instance n'affecte pas les autres

```python
class Compte:
    def __init__(self, titulaire, solde=0):
        self.titulaire = titulaire  # Attribut d'instance
        self.solde = solde          # Attribut d'instance

compte1 = Compte("Alice", 1000)
compte2 = Compte("Bob", 500)

compte1.solde += 100
print(compte1.solde)  # 1100
print(compte2.solde)  # 500 (inchangé)
```

### Ajout d'attributs dynamiquement

En Python, vous pouvez ajouter des attributs d'instance à tout moment :

```python
class Personne:
    def __init__(self, nom):
        self.nom = nom

alice = Personne("Alice")
alice.age = 30  # Ajout d'un attribut après création
alice.ville = "Paris"  # Ajout d'un autre attribut

print(alice.nom)   # "Alice"
print(alice.age)   # 30
print(alice.ville) # "Paris"

# Ces attributs n'existent que pour cette instance
bob = Personne("Bob")
# bob.age  # ❌ AttributeError: 'Personne' object has no attribute 'age'
```

## Attributs de classe

### Définition

Les attributs de classe sont des variables définies **au niveau de la classe**, partagées par **toutes les instances**.

```python
class Personne:
    # Attribut de classe (défini au niveau de la classe)
    espece = "Homo sapiens"
    population = 0
    
    def __init__(self, nom):
        self.nom = nom  # Attribut d'instance
        Personne.population += 1  # Accès à l'attribut de classe

alice = Personne("Alice")
bob = Personne("Bob")

# Toutes les instances partagent l'attribut de classe
print(alice.espece)  # "Homo sapiens"
print(bob.espece)     # "Homo sapiens"
print(Personne.espece)  # "Homo sapiens" (accès via la classe)

# Modification partagée
print(Personne.population)  # 2 (compteur partagé)
```

### Caractéristiques

- **Définis au niveau de la classe** : Pas besoin de `self.`
- **Partagés par toutes les instances** : Une seule copie pour toute la classe
- **Accessibles via la classe ou l'instance** : `Classe.attribut` ou `instance.attribut`

```python
class Compte:
    # Attributs de classe
    taux_interet = 0.05  # 5% par défaut
    nombre_comptes = 0
    
    def __init__(self, titulaire, solde=0):
        self.titulaire = titulaire
        self.solde = solde
        Compte.nombre_comptes += 1
    
    def calculer_interet(self):
        return self.solde * Compte.taux_interet

compte1 = Compte("Alice", 1000)
compte2 = Compte("Bob", 500)

# Tous les comptes partagent le même taux
print(compte1.calculer_interet())  # 50.0
print(compte2.calculer_interet())  # 25.0

# Modification du taux (affecte tous les comptes)
Compte.taux_interet = 0.06
print(compte1.calculer_interet())  # 60.0 (modifié)
print(compte2.calculer_interet())  # 30.0 (modifié)

print(Compte.nombre_comptes)  # 2 (compteur partagé)
```

## Différences et pièges

### Piège 1 : Masquage d'attribut de classe

Si vous assignez un attribut de classe via une instance, vous créez un **nouvel attribut d'instance** qui masque l'attribut de classe :

```python
class Personne:
    espece = "Homo sapiens"  # Attribut de classe

alice = Personne()
bob = Personne()

# Accès normal (via l'attribut de classe)
print(alice.espece)  # "Homo sapiens"
print(bob.espece)    # "Homo sapiens"

# Masquage : création d'un attribut d'instance
alice.espece = "Alien"  # Crée un attribut d'instance pour alice

print(alice.espece)  # "Alien" (attribut d'instance)
print(bob.espece)    # "Homo sapiens" (attribut de classe inchangé)
print(Personne.espece)  # "Homo sapiens" (attribut de classe inchangé)

# Pour modifier l'attribut de classe, utilisez la classe
Personne.espece = "Homo sapiens sapiens"
print(bob.espece)    # "Homo sapiens sapiens" (modifié)
print(alice.espece)  # "Alien" (toujours l'attribut d'instance)
```

### Piège 2 : Attributs de classe mutables

**Attention** : Si un attribut de classe est **mutable** (list, dict, set), toutes les instances partagent le même objet !

```python
# ❌ BUG CLASSIQUE
class Personne:
    amis = []  # Attribut de classe mutable
    
    def __init__(self, nom):
        self.nom = nom
    
    def ajouter_ami(self, ami):
        self.amis.append(ami)  # ⚠️ Modifie l'attribut de classe partagé!

alice = Personne("Alice")
bob = Personne("Bob")

alice.ajouter_ami("Charlie")
print(alice.amis)  # ['Charlie']
print(bob.amis)    # ['Charlie'] ⚠️ Bob a aussi Charlie!

bob.ajouter_ami("David")
print(alice.amis)  # ['Charlie', 'David'] ⚠️ Alice a aussi David!

# ✅ Solution : utiliser un attribut d'instance
class Personne:
    def __init__(self, nom):
        self.nom = nom
        self.amis = []  # Attribut d'instance (nouvelle liste pour chaque instance)
    
    def ajouter_ami(self, ami):
        self.amis.append(ami)

alice = Personne("Alice")
bob = Personne("Bob")

alice.ajouter_ami("Charlie")
print(alice.amis)  # ['Charlie']
print(bob.amis)    # [] ✅ Liste séparée
```

### Piège 3 : Confusion entre accès via classe et instance

```python
class Compte:
    taux = 0.05  # Attribut de classe

compte = Compte()

# Accès via l'instance (recommandé pour la lecture)
print(compte.taux)  # 0.05

# Modification via la classe (pour modifier tous)
Compte.taux = 0.06
print(compte.taux)  # 0.06

# Modification via l'instance (crée un attribut d'instance)
compte.taux = 0.07  # Masque l'attribut de classe
print(compte.taux)  # 0.07 (attribut d'instance)
print(Compte.taux)  # 0.06 (attribut de classe inchangé)
```

## Cas d'usage

### Attributs de classe : quand les utiliser

#### 1. Constantes partagées

```python
class Configuration:
    # Constantes partagées par toutes les instances
    VERSION = "1.0.0"
    MAX_CONNECTIONS = 100
    TIMEOUT = 30
    
    def __init__(self, host):
        self.host = host

config1 = Configuration("server1")
config2 = Configuration("server2")

print(config1.VERSION)  # "1.0.0"
print(config2.VERSION)  # "1.0.0"
```

#### 2. Compteurs et statistiques

```python
class Voiture:
    nombre_voitures = 0  # Compteur partagé
    
    def __init__(self, marque, modele):
        self.marque = marque
        self.modele = modele
        Voiture.nombre_voitures += 1
    
    @classmethod
    def obtenir_nombre_total(cls):
        return cls.nombre_voitures

v1 = Voiture("Toyota", "Corolla")
v2 = Voiture("Honda", "Civic")

print(Voiture.nombre_voitures)  # 2
print(Voiture.obtenir_nombre_total())  # 2
```

#### 3. Valeurs par défaut

```python
class Utilisateur:
    role_par_defaut = "utilisateur"  # Valeur par défaut partagée
    
    def __init__(self, nom, role=None):
        self.nom = nom
        self.role = role if role is not None else Utilisateur.role_par_defaut

user1 = Utilisateur("Alice")
user2 = Utilisateur("Bob")

print(user1.role)  # "utilisateur"
print(user2.role)  # "utilisateur"

# Modification de la valeur par défaut
Utilisateur.role_par_defaut = "invite"
user3 = Utilisateur("Charlie")
print(user3.role)  # "invite"
```

### Attributs d'instance : quand les utiliser

#### 1. Données spécifiques à chaque objet

```python
class Personne:
    def __init__(self, nom, age, email):
        # Données uniques à chaque personne
        self.nom = nom
        self.age = age
        self.email = email

alice = Personne("Alice", 30, "alice@example.com")
bob = Personne("Bob", 25, "bob@example.com")
```

#### 2. État mutable spécifique

```python
class Panier:
    def __init__(self, client):
        self.client = client
        self.articles = []  # Liste unique pour chaque panier
        self.total = 0.0

panier1 = Panier("Alice")
panier2 = Panier("Bob")

panier1.articles.append("Livre")
print(panier1.articles)  # ['Livre']
print(panier2.articles)  # [] (liste séparée)
```

## Bonnes pratiques

### 1. Utilisez des attributs de classe pour les constantes

```python
class Math:
    PI = 3.14159
    E = 2.71828
    
    @staticmethod
    def cercle_aire(rayon):
        return Math.PI * rayon ** 2
```

### 2. Évitez les attributs de classe mutables

```python
# ❌ Dangereux
class Personne:
    amis = []  # Partagé par toutes les instances

# ✅ Préférable
class Personne:
    def __init__(self):
        self.amis = []  # Liste unique par instance
```

### 3. Utilisez des noms explicites

```python
class Compte:
    # Attribut de classe : nom en majuscules pour les constantes
    TAUX_INTERET_DEFAUT = 0.05
    
    def __init__(self, titulaire):
        # Attribut d'instance : nom en minuscules
        self.titulaire = titulaire
        self.solde = 0
```

### 4. Accédez aux attributs de classe via la classe pour les modifier

```python
class Compte:
    taux = 0.05
    
    def __init__(self, titulaire):
        self.titulaire = titulaire

# ✅ Modification via la classe
Compte.taux = 0.06

# ⚠️ Modification via l'instance (crée un attribut d'instance)
compte = Compte("Alice")
compte.taux = 0.07  # Masque l'attribut de classe pour cette instance
```

## Points clés à retenir

- ✅ **Attributs d'instance** : Créés avec `self.`, uniques à chaque instance
- ✅ **Attributs de classe** : Définis au niveau de la classe, partagés par toutes les instances
- ✅ **Masquage** : Assigner via une instance crée un attribut d'instance qui masque l'attribut de classe
- ✅ **Attributs mutables** : Évitez les attributs de classe mutables (list, dict, set)
- ✅ **Accès** : Utilisez `Classe.attribut` pour modifier un attribut de classe
- ✅ **Constantes** : Utilisez des attributs de classe pour les constantes partagées
- ✅ **Compteurs** : Utilisez des attributs de classe pour les compteurs et statistiques

Comprendre cette distinction est essentiel pour éviter des bugs subtils. Prenez le temps de bien maîtriser ces concepts avant de continuer.
