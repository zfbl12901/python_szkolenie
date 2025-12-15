# Programmation Orientée Objet (POO)

La Programmation Orientée Objet est un paradigme de programmation basé sur le concept d'objets.

## Concepts fondamentaux

### Classe

Une classe est un modèle ou un plan pour créer des objets :

```python
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
    
    def se_presenter(self):
        return f"Je m'appelle {self.nom} et j'ai {self.age} ans"

# Création d'une instance
alice = Personne("Alice", 25)
print(alice.se_presenter())
```

### Objet (Instance)

Un objet est une instance concrète d'une classe :

```python
personne1 = Personne("Alice", 25)
personne2 = Personne("Bob", 30)
```

## Les quatre piliers de la POO

### 1. Encapsulation

L'encapsulation consiste à regrouper les données et les méthodes dans une classe :

```python
class CompteBancaire:
    def __init__(self, solde_initial):
        self._solde = solde_initial  # Attribut privé (convention)
    
    def deposer(self, montant):
        if montant > 0:
            self._solde += montant
    
    def retirer(self, montant):
        if 0 < montant <= self._solde:
            self._solde -= montant
    
    def obtenir_solde(self):
        return self._solde
```

### 2. Héritage

L'héritage permet à une classe d'hériter des attributs et méthodes d'une autre classe :

```python
class Animal:
    def __init__(self, nom):
        self.nom = nom
    
    def faire_du_bruit(self):
        return "L'animal fait du bruit"

class Chien(Animal):
    def faire_du_bruit(self):
        return f"{self.nom} aboie : Wouf !"

class Chat(Animal):
    def faire_du_bruit(self):
        return f"{self.nom} miaule : Miaou !"

# Utilisation
rex = Chien("Rex")
print(rex.faire_du_bruit())  # "Rex aboie : Wouf !"
```

### 3. Polymorphisme

Le polymorphisme permet d'utiliser une interface commune pour différents types :

```python
def faire_parler(animal):
    print(animal.faire_du_bruit())

rex = Chien("Rex")
felix = Chat("Félix")

faire_parler(rex)   # "Rex aboie : Wouf !"
faire_parler(felix) # "Félix miaule : Miaou !"
```

### 4. Abstraction

L'abstraction consiste à cacher les détails d'implémentation :

```python
from abc import ABC, abstractmethod

class Forme(ABC):
    @abstractmethod
    def calculer_aire(self):
        pass

class Rectangle(Forme):
    def __init__(self, largeur, hauteur):
        self.largeur = largeur
        self.hauteur = hauteur
    
    def calculer_aire(self):
        return self.largeur * self.hauteur

class Cercle(Forme):
    def __init__(self, rayon):
        self.rayon = rayon
    
    def calculer_aire(self):
        return 3.14159 * self.rayon ** 2
```

## Avantages de la POO

1. **Réutilisabilité** : Le code peut être réutilisé via l'héritage
2. **Maintenabilité** : Le code est mieux organisé et plus facile à maintenir
3. **Modularité** : Chaque classe représente un module indépendant
4. **Extensibilité** : Facile d'ajouter de nouvelles fonctionnalités

## Bonnes pratiques

- Utilisez des noms de classes en PascalCase
- Documentez vos classes avec des docstrings
- Privilégiez la composition à l'héritage quand c'est possible
- Respectez le principe de responsabilité unique

