---
title: "Méthodes statiques et de classe"
order: 3.01.03
parent: "03-01-classes-et-objets.md"
tags: ["python", "methodes", "statique", "classe"]
---

# Méthodes statiques et de classe

Python offre trois types de méthodes : les méthodes d'instance, les méthodes de classe et les méthodes statiques. Chacune a son rôle et ses cas d'usage spécifiques.

## Concepts de base

En Python, il existe trois types de méthodes :

1. **Méthodes d'instance** : Reçoivent `self` comme premier paramètre, accèdent aux attributs d'instance
2. **Méthodes de classe** (`@classmethod`) : Reçoivent `cls` comme premier paramètre, accèdent aux attributs de classe
3. **Méthodes statiques** (`@staticmethod`) : Ne reçoivent ni `self` ni `cls`, sont indépendantes de la classe

Comprendre quand utiliser chaque type est essentiel pour écrire du code Pythonic.

## Méthodes d'instance

### Caractéristiques

Les méthodes d'instance sont les méthodes "normales" que vous utilisez le plus souvent. Elles :
- Reçoivent `self` comme premier paramètre
- Accèdent aux attributs d'instance via `self`
- Sont appelées sur une instance : `instance.methode()`

```python
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
    
    def presenter(self):  # Méthode d'instance
        return f"Je suis {self.nom}, j'ai {self.age} ans"
    
    def vieillir(self, annees=1):  # Méthode d'instance
        self.age += annees

alice = Personne("Alice", 30)
print(alice.presenter())  # "Je suis Alice, j'ai 30 ans"
alice.vieillir(5)
print(alice.presenter())  # "Je suis Alice, j'ai 35 ans"
```

### Quand utiliser

Utilisez des méthodes d'instance quand :
- Vous avez besoin d'accéder aux attributs d'instance (`self.attribut`)
- Le comportement dépend de l'état de l'instance
- Vous travaillez avec les données spécifiques à une instance

```python
class Compte:
    def __init__(self, titulaire, solde=0):
        self.titulaire = titulaire
        self.solde = solde
    
    def deposer(self, montant):  # Méthode d'instance
        self.solde += montant
    
    def retirer(self, montant):  # Méthode d'instance
        if self.solde >= montant:
            self.solde -= montant
            return True
        return False
    
    def obtenir_solde(self):  # Méthode d'instance
        return self.solde
```

## Méthodes de classe (@classmethod)

### Caractéristiques

Les méthodes de classe :
- Reçoivent `cls` (la classe) comme premier paramètre au lieu de `self`
- Sont décorées avec `@classmethod`
- Accèdent aux attributs de classe via `cls`
- Peuvent être appelées sur la classe ou l'instance

```python
class Personne:
    population = 0  # Attribut de classe
    
    def __init__(self, nom):
        self.nom = nom
        Personne.population += 1
    
    @classmethod
    def obtenir_population(cls):
        """Retourne le nombre total de personnes."""
        return cls.population
    
    @classmethod
    def creer_anonyme(cls):
        """Crée une personne anonyme."""
        return cls("Anonyme")

# Appel via la classe
print(Personne.obtenir_population())  # 0

alice = Personne("Alice")
bob = Personne("Bob")

# Appel via la classe
print(Personne.obtenir_population())  # 2

# Appel via l'instance (fonctionne aussi)
print(alice.obtenir_population())  # 2

# Factory method
anonyme = Personne.creer_anonyme()
print(anonyme.nom)  # "Anonyme"
```

### Cas d'usage principaux

#### 1. Factory methods (constructeurs alternatifs)

```python
class Date:
    def __init__(self, jour, mois, annee):
        self.jour = jour
        self.mois = mois
        self.annee = annee
    
    @classmethod
    def depuis_string(cls, date_string):
        """Crée une Date depuis une chaîne 'JJ/MM/AAAA'."""
        jour, mois, annee = map(int, date_string.split('/'))
        return cls(jour, mois, annee)
    
    @classmethod
    def aujourdhui(cls):
        """Crée une Date pour aujourd'hui."""
        from datetime import date
        aujourdhui = date.today()
        return cls(aujourdhui.day, aujourdhui.month, aujourdhui.year)

# Utilisation
date1 = Date(15, 3, 2024)  # Constructeur normal
date2 = Date.depuis_string("20/03/2024")  # Factory method
date3 = Date.aujourdhui()  # Factory method

print(date2.jour, date2.mois, date2.annee)  # 20 3 2024
```

#### 2. Accès aux attributs de classe

```python
class Configuration:
    version = "1.0.0"
    environnement = "production"
    
    @classmethod
    def obtenir_info(cls):
        """Retourne les informations de configuration."""
        return {
            "version": cls.version,
            "environnement": cls.environnement
        }
    
    @classmethod
    def changer_environnement(cls, env):
        """Change l'environnement pour toute la classe."""
        cls.environnement = env

print(Configuration.obtenir_info())
# {'version': '1.0.0', 'environnement': 'production'}

Configuration.changer_environnement("development")
print(Configuration.environnement)  # "development"
```

#### 3. Héritage et polymorphisme

```python
class Animal:
    espece = "Animal"
    
    @classmethod
    def obtenir_espece(cls):
        return cls.espece

class Chien(Animal):
    espece = "Canis lupus"

class Chat(Animal):
    espece = "Felis catus"

# Utilisation du polymorphisme
chien = Chien()
chat = Chat()

print(chien.obtenir_espece())  # "Canis lupus" (utilise cls de Chien)
print(chat.obtenir_espece())   # "Felis catus" (utilise cls de Chat)
```

## Méthodes statiques (@staticmethod)

### Caractéristiques

Les méthodes statiques :
- Ne reçoivent ni `self` ni `cls`
- Sont décorées avec `@staticmethod`
- N'ont pas accès aux attributs d'instance ni de classe
- Sont des fonctions "normales" mais logiquement liées à la classe

```python
class Math:
    @staticmethod
    def additionner(a, b):
        """Fonction utilitaire liée à la classe Math."""
        return a + b
    
    @staticmethod
    def multiplier(a, b):
        """Fonction utilitaire liée à la classe Math."""
        return a * b

# Appel via la classe
resultat = Math.additionner(5, 3)  # 8

# Appel via l'instance (fonctionne aussi)
math = Math()
resultat = math.multiplier(4, 2)  # 8
```

### Cas d'usage principaux

#### 1. Fonctions utilitaires liées à la classe

```python
class Validateur:
    @staticmethod
    def est_email_valide(email):
        """Vérifie si une adresse email est valide."""
        return "@" in email and "." in email.split("@")[1]
    
    @staticmethod
    def est_telephone_valide(telephone):
        """Vérifie si un numéro de téléphone est valide."""
        return telephone.isdigit() and len(telephone) == 10

# Utilisation
if Validateur.est_email_valide("alice@example.com"):
    print("Email valide")
```

#### 2. Groupement logique

```python
class Formatage:
    @staticmethod
    def formater_prix(montant):
        """Formate un montant en prix."""
        return f"{montant:.2f} €"
    
    @staticmethod
    def formater_date(jour, mois, annee):
        """Formate une date."""
        return f"{jour:02d}/{mois:02d}/{annee}"

# Utilisation
prix = Formatage.formater_prix(19.99)  # "19.99 €"
date = Formatage.formater_date(5, 3, 2024)  # "05/03/2024"
```

#### 3. Fonctions qui n'ont pas besoin d'état

```python
class Calculatrice:
    @staticmethod
    def calculer_moyenne(nombres):
        """Calcule la moyenne d'une liste de nombres."""
        if not nombres:
            return 0
        return sum(nombres) / len(nombres)
    
    @staticmethod
    def est_pair(nombre):
        """Vérifie si un nombre est pair."""
        return nombre % 2 == 0

# Utilisation
moyenne = Calculatrice.calculer_moyenne([10, 20, 30])  # 20.0
print(Calculatrice.est_pair(4))  # True
```

## Quand utiliser chaque type

### Tableau comparatif

| Type | Premier paramètre | Accès à l'instance | Accès à la classe | Cas d'usage |
|------|-------------------|---------------------|-------------------|-------------|
| **Méthode d'instance** | `self` | ✅ Oui | ✅ Oui (via `self.__class__`) | Travailler avec les données de l'instance |
| **Méthode de classe** | `cls` | ❌ Non | ✅ Oui | Factory methods, accès aux attributs de classe |
| **Méthode statique** | Aucun | ❌ Non | ❌ Non | Fonctions utilitaires liées à la classe |

### Règles de décision

**Utilisez une méthode d'instance si :**
- Vous avez besoin d'accéder à `self.attribut`
- Le comportement dépend de l'état de l'instance
- Vous modifiez l'état de l'instance

**Utilisez une méthode de classe si :**
- Vous voulez créer des constructeurs alternatifs (factory methods)
- Vous avez besoin d'accéder aux attributs de classe
- Vous voulez que le comportement soit polymorphique avec l'héritage

**Utilisez une méthode statique si :**
- La fonction est logiquement liée à la classe mais n'a pas besoin d'état
- Vous voulez grouper des fonctions utilitaires
- La fonction ne dépend ni de l'instance ni de la classe

## Exemples pratiques

### Exemple complet : Classe avec les trois types

```python
class Compte:
    # Attribut de classe
    taux_interet = 0.05
    nombre_comptes = 0
    
    def __init__(self, titulaire, solde=0):
        # Attributs d'instance
        self.titulaire = titulaire
        self.solde = solde
        Compte.nombre_comptes += 1
    
    # Méthode d'instance
    def deposer(self, montant):
        """Dépose de l'argent sur le compte."""
        self.solde += montant
    
    # Méthode d'instance
    def calculer_interet(self):
        """Calcule les intérêts pour ce compte."""
        return self.solde * Compte.taux_interet
    
    # Méthode de classe
    @classmethod
    def creer_compte_epargne(cls, titulaire, solde=0):
        """Crée un compte épargne avec un taux différent."""
        compte = cls(titulaire, solde)
        compte.taux_interet = 0.03  # Taux spécial pour épargne
        return compte
    
    # Méthode de classe
    @classmethod
    def obtenir_nombre_comptes(cls):
        """Retourne le nombre total de comptes."""
        return cls.nombre_comptes
    
    # Méthode statique
    @staticmethod
    def valider_montant(montant):
        """Valide qu'un montant est positif."""
        return montant > 0
    
    # Méthode statique
    @staticmethod
    def formater_solde(solde):
        """Formate un solde pour l'affichage."""
        return f"{solde:.2f} €"

# Utilisation
compte1 = Compte("Alice", 1000)
compte1.deposer(500)  # Méthode d'instance

compte2 = Compte.creer_compte_epargne("Bob", 2000)  # Méthode de classe

if Compte.valider_montant(100):  # Méthode statique
    compte1.deposer(100)

print(Compte.obtenir_nombre_comptes())  # 2
print(Compte.formater_solde(compte1.solde))  # "1600.00 €"
```

## Pièges courants

### Piège 1 : Confusion entre @classmethod et @staticmethod

```python
class Exemple:
    valeur_classe = 10
    
    @classmethod
    def methode_classe(cls):
        return cls.valeur_classe  # ✅ Accès à l'attribut de classe
    
    @staticmethod
    def methode_statique():
        # return valeur_classe  # ❌ Erreur : valeur_classe n'est pas défini
        return Exemple.valeur_classe  # ✅ Doit utiliser le nom de la classe
```

### Piège 2 : Utiliser @staticmethod au lieu de fonction normale

```python
# ⚠️ Si la fonction n'a vraiment rien à voir avec la classe
class Utilitaire:
    @staticmethod
    def additionner(a, b):
        return a + b

# ✅ Préférable : fonction normale
def additionner(a, b):
    return a + b

# Ou dans un module utilitaire
# utilitaire.py
def additionner(a, b):
    return a + b
```

### Piège 3 : Oublier cls dans @classmethod

```python
# ❌ Erreur
class Exemple:
    @classmethod
    def methode(cls):
        return Exemple.valeur  # Utilise le nom de la classe directement

# ✅ Correct (utilise cls pour le polymorphisme)
class Exemple:
    @classmethod
    def methode(cls):
        return cls.valeur  # Utilise cls pour fonctionner avec l'héritage
```

## Bonnes pratiques

### 1. Utilisez @classmethod pour les factory methods

```python
class Date:
    def __init__(self, jour, mois, annee):
        self.jour = jour
        self.mois = mois
        self.annee = annee
    
    @classmethod
    def depuis_timestamp(cls, timestamp):
        """Crée une Date depuis un timestamp."""
        # ... logique de conversion
        return cls(jour, mois, annee)
```

### 2. Utilisez @staticmethod pour les fonctions utilitaires

```python
class Validateur:
    @staticmethod
    def est_email_valide(email):
        """Vérifie la validité d'un email."""
        return "@" in email
```

### 3. Documentez le type de méthode

```python
class Exemple:
    def methode_instance(self):
        """Méthode d'instance qui utilise self."""
        pass
    
    @classmethod
    def methode_classe(cls):
        """Méthode de classe qui utilise cls."""
        pass
    
    @staticmethod
    def methode_statique():
        """Méthode statique indépendante."""
        pass
```

## Points clés à retenir

- ✅ **Méthodes d'instance** : Reçoivent `self`, accèdent aux attributs d'instance
- ✅ **Méthodes de classe** (`@classmethod`) : Reçoivent `cls`, accèdent aux attributs de classe, utiles pour les factory methods
- ✅ **Méthodes statiques** (`@staticmethod`) : Ne reçoivent ni `self` ni `cls`, fonctions utilitaires liées à la classe
- ✅ Utilisez `@classmethod` pour créer des constructeurs alternatifs
- ✅ Utilisez `@staticmethod` pour des fonctions utilitaires logiquement liées à la classe
- ✅ Les méthodes de classe sont polymorphiques avec l'héritage (utilisent `cls`)
- ✅ Choisissez le bon type selon vos besoins : accès à l'instance, à la classe, ou aucun

Maîtriser ces trois types de méthodes vous permettra d'écrire du code plus organisé et plus Pythonic. Chaque type a son rôle et ses cas d'usage spécifiques.
