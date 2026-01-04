---
title: "Classes et Programmation Orientée Objet"
order: 8
parent: null
tags: ["python", "basics", "oop", "classes"]
---

# Classes et Programmation Orientée Objet

La Programmation Orientée Objet (POO) est un paradigme de programmation qui organise le code autour d'objets et de classes. Python supporte pleinement la POO tout en restant flexible.

## Concepts fondamentaux

- **Classe** : Modèle ou blueprint pour créer des objets
- **Objet (Instance)** : Instance concrète d'une classe
- **Attributs** : Variables qui appartiennent à un objet
- **Méthodes** : Fonctions qui appartiennent à un objet
- **Encapsulation** : Masquer les détails d'implémentation
- **Héritage** : Créer de nouvelles classes basées sur des classes existantes
- **Polymorphisme** : Utiliser une interface commune pour différents types

## Définition d'une classe

### Classe simple

```python
class Personne:
    """Représente une personne"""
    
    def __init__(self, nom, age):
        """Constructeur : initialise les attributs"""
        self.nom = nom
        self.age = age
    
    def se_presenter(self):
        """Méthode pour se présenter"""
        return f"Je m'appelle {self.nom} et j'ai {self.age} ans"

# Création d'instances
alice = Personne("Alice", 25)
bob = Personne("Bob", 30)

print(alice.se_presenter())  # Je m'appelle Alice et j'ai 25 ans
print(bob.se_presenter())    # Je m'appelle Bob et j'ai 30 ans
```

### Explication des éléments

- `class Personne:` : Définit une classe nommée `Personne`
- `__init__` : Méthode spéciale appelée lors de la création d'un objet (constructeur)
- `self` : Référence à l'instance courante (premier paramètre de toutes les méthodes)
- `self.nom`, `self.age` : Attributs d'instance

## Attributs

### Attributs d'instance

```python
class Voiture:
    def __init__(self, marque, modele, annee):
        self.marque = marque      # Attribut d'instance
        self.modele = modele
        self.annee = annee
        self.kilometrage = 0      # Attribut avec valeur par défaut

voiture1 = Voiture("Toyota", "Corolla", 2020)
voiture2 = Voiture("Honda", "Civic", 2021)

print(voiture1.marque)  # Toyota
print(voiture2.marque)  # Honda
```

### Attributs de classe

```python
class Voiture:
    # Attribut de classe (partagé par toutes les instances)
    nombre_voitures = 0
    
    def __init__(self, marque, modele):
        self.marque = marque
        self.modele = modele
        Voiture.nombre_voitures += 1  # Incrémente le compteur

voiture1 = Voiture("Toyota", "Corolla")
voiture2 = Voiture("Honda", "Civic")

print(Voiture.nombre_voitures)  # 2
```

### Attributs privés (convention)

```python
class CompteBancaire:
    def __init__(self, solde_initial):
        self.__solde = solde_initial  # Attribut "privé" (convention : double underscore)
    
    def deposer(self, montant):
        self.__solde += montant
    
    def retirer(self, montant):
        if montant <= self.__solde:
            self.__solde -= montant
        else:
            print("Solde insuffisant")
    
    def get_solde(self):
        return self.__solde

compte = CompteBancaire(1000)
compte.deposer(500)
print(compte.get_solde())  # 1500
# compte.__solde  # Erreur : AttributeError (accès direct bloqué)
```

## Méthodes

### Méthodes d'instance

```python
class Rectangle:
    def __init__(self, largeur, hauteur):
        self.largeur = largeur
        self.hauteur = hauteur
    
    def calculer_aire(self):
        """Méthode d'instance"""
        return self.largeur * self.hauteur
    
    def calculer_perimetre(self):
        return 2 * (self.largeur + self.hauteur)

rect = Rectangle(5, 3)
print(rect.calculer_aire())  # 15
```

### Méthodes de classe

```python
class Personne:
    espece = "Homo sapiens"
    
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
    
    @classmethod
    def creer_bebe(cls, nom):
        """Méthode de classe : crée une personne avec age=0"""
        return cls(nom, 0)
    
    @classmethod
    def obtenir_espece(cls):
        return cls.espece

bebe = Personne.creer_bebe("Lucas")
print(bebe.age)  # 0
print(Personne.obtenir_espece())  # Homo sapiens
```

### Méthodes statiques

```python
class Utilitaire:
    @staticmethod
    def calculer_distance(x1, y1, x2, y2):
        """Méthode statique : ne nécessite pas self ni cls"""
        return ((x2 - x1)**2 + (y2 - y1)**2)**0.5

distance = Utilitaire.calculer_distance(0, 0, 3, 4)
print(distance)  # 5.0
```

## Méthodes spéciales (magic methods)

```python
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
    
    def __str__(self):
        """Représentation string (pour print)"""
        return f"Personne(nom={self.nom}, age={self.age})"
    
    def __repr__(self):
        """Représentation officielle (pour debug)"""
        return f"Personne('{self.nom}', {self.age})"
    
    def __eq__(self, other):
        """Comparaison d'égalité"""
        if isinstance(other, Personne):
            return self.nom == other.nom and self.age == other.age
        return False
    
    def __lt__(self, other):
        """Comparaison < (pour tri)"""
        return self.age < other.age

alice = Personne("Alice", 25)
bob = Personne("Bob", 30)

print(alice)  # Personne(nom=Alice, age=25)
print(alice == bob)  # False
print(alice < bob)    # True
```

## Propriétés (getters/setters)

```python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def celsius(self):
        """Getter pour celsius"""
        return self._celsius
    
    @celsius.setter
    def celsius(self, valeur):
        """Setter pour celsius avec validation"""
        if valeur < -273.15:
            raise ValueError("Température impossible")
        self._celsius = valeur
    
    @property
    def fahrenheit(self):
        """Propriété calculée"""
        return self._celsius * 9/5 + 32

temp = Temperature(25)
print(temp.celsius)      # 25
print(temp.fahrenheit)   # 77.0
temp.celsius = 30
print(temp.fahrenheit)   # 86.0
```

## Héritage

### Héritage simple

```python
class Animal:
    def __init__(self, nom, espece):
        self.nom = nom
        self.espece = espece
    
    def faire_du_bruit(self):
        return "L'animal fait du bruit"
    
    def se_presenter(self):
        return f"Je suis {self.nom}, un {self.espece}"

class Chien(Animal):
    def __init__(self, nom, race):
        super().__init__(nom, "chien")  # Appelle le constructeur parent
        self.race = race
    
    def faire_du_bruit(self):
        """Override : redéfinit la méthode parent"""
        return "Woof ! Woof !"

class Chat(Animal):
    def __init__(self, nom):
        super().__init__(nom, "chat")
    
    def faire_du_bruit(self):
        return "Miaou !"

chien = Chien("Rex", "Labrador")
chat = Chat("Minou")

print(chien.se_presenter())  # Je suis Rex, un chien
print(chien.faire_du_bruit())  # Woof ! Woof !
print(chat.faire_du_bruit())   # Miaou !
```

### Héritage multiple

```python
class Volant:
    def voler(self):
        return "Je vole !"

class Nageur:
    def nager(self):
        return "Je nage !"

class Canard(Volant, Nageur):
    def __init__(self, nom):
        self.nom = nom

canard = Canard("Donald")
print(canard.voler())  # Je vole !
print(canard.nager())  # Je nage !
```

## Polymorphisme

```python
class Forme:
    def calculer_aire(self):
        raise NotImplementedError("Sous-classe doit implémenter")

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

# Polymorphisme : même interface, comportements différents
formes = [Rectangle(5, 3), Cercle(4), Rectangle(2, 2)]

for forme in formes:
    print(f"Aire : {forme.calculer_aire()}")
# Aire : 15
# Aire : 50.26544
# Aire : 4
```

## Composition vs Héritage

### Composition (has-a)

```python
class Moteur:
    def demarrer(self):
        return "Moteur démarré"

class Voiture:
    def __init__(self):
        self.moteur = Moteur()  # Composition : Voiture a un Moteur
    
    def demarrer(self):
        return self.moteur.demarrer()

voiture = Voiture()
print(voiture.demarrer())  # Moteur démarré
```

### Héritage (is-a)

```python
class Vehicule:
    def demarrer(self):
        return "Véhicule démarré"

class Voiture(Vehicule):  # Héritage : Voiture est un Véhicule
    pass

voiture = Voiture()
print(voiture.demarrer())  # Véhicule démarré
```

## Exemple complet : Système de bibliothèque

```python
class Livre:
    def __init__(self, titre, auteur, isbn):
        self.titre = titre
        self.auteur = auteur
        self.isbn = isbn
        self.disponible = True
    
    def emprunter(self):
        if self.disponible:
            self.disponible = False
            return True
        return False
    
    def retourner(self):
        self.disponible = True
    
    def __str__(self):
        statut = "Disponible" if self.disponible else "Emprunté"
        return f"{self.titre} par {self.auteur} - {statut}"

class Membre:
    def __init__(self, nom, numero):
        self.nom = nom
        self.numero = numero
        self.livres_empruntes = []
    
    def emprunter_livre(self, livre):
        if livre.emprunter():
            self.livres_empruntes.append(livre)
            return True
        return False
    
    def retourner_livre(self, livre):
        if livre in self.livres_empruntes:
            livre.retourner()
            self.livres_empruntes.remove(livre)
            return True
        return False

# Utilisation
livre1 = Livre("Python pour débutants", "A. Auteur", "123-456")
membre1 = Membre("Alice", "M001")

membre1.emprunter_livre(livre1)
print(livre1)  # Python pour débutants par A. Auteur - Emprunté
print(f"Livres empruntés : {len(membre1.livres_empruntes)}")  # 1

membre1.retourner_livre(livre1)
print(livre1)  # Python pour débutants par A. Auteur - Disponible
```

## Bonnes pratiques

1. **Nommage** : Classes en PascalCase (`MaClasse`)
2. **Une classe, une responsabilité** : Principe de responsabilité unique
3. **Composition > Héritage** : Préférez la composition quand c'est possible
4. **Docstrings** : Documentez vos classes et méthodes
5. **Encapsulation** : Utilisez des attributs privés (`__attribut`) pour l'encapsulation
6. **Méthodes spéciales** : Implémentez `__str__` et `__repr__` pour un meilleur débogage
7. **Type hints** (optionnel) : `class Personne: def __init__(self, nom: str, age: int) -> None:`

## Avantages de la POO

- **Réutilisabilité** : Code réutilisable via l'héritage
- **Organisation** : Code mieux structuré et organisé
- **Maintenabilité** : Plus facile à maintenir et modifier
- **Modularité** : Composants indépendants et testables
- **Abstraction** : Masquer la complexité derrière des interfaces simples

La POO est un outil puissant pour créer des applications complexes et maintenables. Maîtrisez ces concepts pour devenir un développeur Python expérimenté !
