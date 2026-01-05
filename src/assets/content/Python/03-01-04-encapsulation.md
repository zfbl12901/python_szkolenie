---
title: "Encapsulation (convention vs contrainte)"
order: 3.01.04
parent: "03-01-classes-et-objets.md"
tags: ["python", "encapsulation", "private", "public"]
---

# Encapsulation (convention vs contrainte)

En Python, l'encapsulation repose sur des conventions plutôt que sur des contraintes strictes comme dans Java ou C++. Cette approche offre plus de flexibilité mais nécessite de la discipline de la part des développeurs.

## Concepts de base

L'**encapsulation** est le principe qui consiste à cacher les détails d'implémentation d'une classe et à exposer uniquement une interface publique. En Python, contrairement à des langages comme Java ou C++, il n'y a pas de mots-clés `private`, `protected`, ou `public` stricts. Python utilise des **conventions de nommage** pour indiquer le niveau d'encapsulation.

## Conventions de nommage

Python utilise des conventions basées sur le nombre de underscores (`_`) pour indiquer la visibilité :

- **Public** : Pas d'underscore, accessible partout
- **Protected** : Un underscore (`_`), convention pour "ne pas utiliser en dehors"
- **Private** : Deux underscores (`__`), name mangling automatique

```python
class Exemple:
    # Public (accessible partout)
    attribut_public = "public"
    
    # Protected (convention, accessible mais déconseillé)
    _attribut_protected = "protected"
    
    # Private (name mangling, difficile d'accès)
    __attribut_private = "private"
```

## Public, protected, private

### Public (pas d'underscore)

Les attributs et méthodes publics sont accessibles partout, sans restriction :

```python
class Personne:
    def __init__(self, nom, age):
        self.nom = nom      # Public
        self.age = age      # Public
    
    def presenter(self):    # Méthode publique
        return f"{self.nom}, {self.age} ans"

alice = Personne("Alice", 30)
print(alice.nom)           # ✅ Accessible
print(alice.age)           # ✅ Accessible
alice.age = 31             # ✅ Modifiable
print(alice.presenter())   # ✅ Méthode accessible
```

**Caractéristiques :**
- Accessible depuis n'importe où
- Modifiable depuis n'importe où
- Partie de l'interface publique de la classe

### Protected (un underscore `_`)

Les attributs et méthodes protégés sont une **convention** : ils indiquent "pour usage interne, ne pas utiliser en dehors de la classe ou de ses sous-classes". Python ne les empêche pas d'être accédés, mais c'est une convention que les développeurs respectent.

```python
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
        self._age_reel = age  # Protected (convention)
    
    def _calculer_age_reel(self):  # Méthode protected
        """Calcule l'âge réel (méthode interne)."""
        return self._age_reel

alice = Personne("Alice", 30)

# ⚠️ Techniquement accessible, mais convention dit "ne pas utiliser"
print(alice._age_reel)              # ⚠️ Accessible mais déconseillé
print(alice._calculer_age_reel())   # ⚠️ Accessible mais déconseillé

# ✅ Utilisez plutôt l'interface publique
print(alice.age)  # ✅ Préférable
```

**Caractéristiques :**
- Accessible depuis l'extérieur (pas de restriction technique)
- Convention indiquant "usage interne"
- Utilisé pour les détails d'implémentation
- Accessible dans les sous-classes

### Private (deux underscores `__`)

Les attributs et méthodes privés utilisent le **name mangling** : Python renomme automatiquement l'attribut pour le rendre difficile d'accès depuis l'extérieur.

```python
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
        self.__age_reel = age  # Private (name mangling)
    
    def __calcul_secret(self):  # Méthode private
        """Calcul secret (méthode privée)."""
        return self.__age_reel * 2

alice = Personne("Alice", 30)

# ❌ Accès direct ne fonctionne pas
# print(alice.__age_reel)        # AttributeError
# print(alice.__calcul_secret()) # AttributeError

# ⚠️ Accès possible via name mangling (mais ne le faites pas!)
print(alice._Personne__age_reel)        # ⚠️ Fonctionne mais déconseillé
print(alice._Personne__calcul_secret()) # ⚠️ Fonctionne mais déconseillé

# ✅ Utilisez l'interface publique
print(alice.age)  # ✅ Préférable
```

**Caractéristiques :**
- Name mangling automatique : `__attribut` devient `_Classe__attribut`
- Difficile d'accès depuis l'extérieur (mais pas impossible)
- Utilisé pour éviter les conflits de noms dans les sous-classes
- **Pas vraiment privé** : toujours accessible via le name mangling

## Name mangling

### Comment ça fonctionne

Le name mangling transforme les noms commençant par `__` (mais ne se terminant pas par `__`) :

```python
class Exemple:
    def __init__(self):
        self.__attribut = "privé"  # Devient _Exemple__attribut

exemple = Exemple()

# ❌ Accès direct
# print(exemple.__attribut)  # AttributeError

# ⚠️ Accès via name mangling (ne le faites pas!)
print(exemple._Exemple__attribut)  # "privé"
```

### Pourquoi le name mangling ?

Le name mangling sert principalement à **éviter les conflits de noms** dans l'héritage :

```python
class Parent:
    def __init__(self):
        self.__valeur = "parent"  # Devient _Parent__valeur

class Enfant(Parent):
    def __init__(self):
        super().__init__()
        self.__valeur = "enfant"  # Devient _Enfant__valeur (pas de conflit!)

enfant = Enfant()
print(enfant._Parent__valeur)    # "parent"
print(enfant._Enfant__valeur)     # "enfant"
```

Sans name mangling, il y aurait un conflit. Avec le name mangling, chaque classe a son propre attribut.

## Exemples pratiques

### Exemple 1 : Classe avec différents niveaux d'encapsulation

```python
class Compte:
    # Attribut de classe public
    taux_interet = 0.05
    
    def __init__(self, titulaire, solde=0):
        # Attributs publics
        self.titulaire = titulaire
        self.solde = solde
        
        # Attribut protected (convention)
        self._historique = []  # Pour usage interne
        
        # Attribut private (name mangling)
        self.__code_secret = None  # Vraiment privé
    
    # Méthode publique
    def deposer(self, montant):
        """Dépose de l'argent (interface publique)."""
        if self._valider_montant(montant):  # Utilise méthode protected
            self.solde += montant
            self._ajouter_operation("dépôt", montant)
            return True
        return False
    
    # Méthode protected (convention)
    def _valider_montant(self, montant):
        """Valide un montant (usage interne)."""
        return montant > 0
    
    def _ajouter_operation(self, type_op, montant):
        """Ajoute une opération à l'historique (usage interne)."""
        self._historique.append((type_op, montant))
    
    # Méthode private (name mangling)
    def __generer_code_secret(self):
        """Génère un code secret (vraiment privé)."""
        import random
        return random.randint(1000, 9999)
    
    # Méthode publique qui utilise la méthode private
    def definir_code_secret(self):
        """Définit un code secret (interface publique)."""
        self.__code_secret = self.__generer_code_secret()
        return "Code secret défini"
    
    def verifier_code(self, code):
        """Vérifie le code secret."""
        return self.__code_secret == code

# Utilisation
compte = Compte("Alice", 1000)

# ✅ Interface publique
compte.deposer(500)
print(compte.solde)  # 1500

# ⚠️ Protected (accessible mais déconseillé)
print(compte._historique)  # [('dépôt', 500)]

# ❌ Private (name mangling nécessaire)
# print(compte.__code_secret)  # AttributeError
compte.definir_code_secret()
print(compte.verifier_code(1234))  # False (code généré aléatoirement)
```

### Exemple 2 : Propriétés (@property)

Les propriétés permettent de créer une interface publique pour des attributs privés :

```python
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self._age = age  # Protected (convention)
    
    @property
    def age(self):
        """Getter pour l'âge."""
        return self._age
    
    @age.setter
    def age(self, valeur):
        """Setter pour l'âge avec validation."""
        if valeur < 0:
            raise ValueError("L'âge ne peut pas être négatif")
        if valeur > 150:
            raise ValueError("L'âge ne peut pas dépasser 150")
        self._age = valeur

alice = Personne("Alice", 30)

# ✅ Utilisation comme un attribut public
print(alice.age)  # 30

# ✅ Setter avec validation
alice.age = 31
print(alice.age)  # 31

# ❌ Validation empêche les valeurs invalides
# alice.age = -5  # ValueError: L'âge ne peut pas être négatif
```

### Exemple 3 : Encapsulation avec méthodes privées

```python
class Calculatrice:
    def __init__(self):
        self._resultat = 0  # Protected
    
    def additionner(self, nombre):
        """Additionne un nombre (interface publique)."""
        self._resultat = self.__calculer(self._resultat, nombre, "+")
        return self._resultat
    
    def multiplier(self, nombre):
        """Multiplie par un nombre (interface publique)."""
        self._resultat = self.__calculer(self._resultat, nombre, "*")
        return self._resultat
    
    def __calculer(self, a, b, operation):  # Private
        """Effectue le calcul (détail d'implémentation privé)."""
        if operation == "+":
            return a + b
        elif operation == "*":
            return a * b
        else:
            raise ValueError(f"Opération inconnue: {operation}")

calc = Calculatrice()
print(calc.additionner(10))  # 10
print(calc.multiplier(3))    # 30

# ❌ Méthode privée non accessible
# calc.__calculer(5, 3, "+")  # AttributeError
```

## Bonnes pratiques

### 1. Utilisez le niveau d'encapsulation approprié

```python
class Exemple:
    # Public : partie de l'interface publique
    def methode_publique(self):
        pass
    
    # Protected : pour usage interne ou sous-classes
    def _methode_protected(self):
        pass
    
    # Private : vraiment interne, éviter les conflits
    def __methode_private(self):
        pass
```

### 2. Respectez les conventions

```python
# ✅ Bon : respecter la convention protected
class Exemple:
    def __init__(self):
        self._attribut_interne = "interne"
    
    def utiliser_attribut(self):
        return self._attribut_interne  # ✅ Utilisation interne OK

# ⚠️ Éviter : accéder au protected depuis l'extérieur
exemple = Exemple()
# print(exemple._attribut_interne)  # ⚠️ Déconseillé
```

### 3. Utilisez @property pour l'encapsulation

```python
class Exemple:
    def __init__(self):
        self._valeur = 0
    
    @property
    def valeur(self):
        return self._valeur
    
    @valeur.setter
    def valeur(self, val):
        if val < 0:
            raise ValueError("Valeur doit être positive")
        self._valeur = val
```

### 4. Documentez l'interface publique

```python
class Compte:
    def deposer(self, montant):
        """
        Dépose de l'argent sur le compte.
        
        Args:
            montant: Montant à déposer (doit être positif)
        
        Returns:
            True si le dépôt a réussi, False sinon
        
        Raises:
            ValueError: Si le montant est négatif
        """
        # Implémentation...
        pass
```

## Pièges courants

### Piège 1 : Penser que __ est vraiment privé

```python
class Exemple:
    def __init__(self):
        self.__secret = "secret"

exemple = Exemple()

# ⚠️ Toujours accessible via name mangling
print(exemple._Exemple__secret)  # "secret"

# Ne comptez pas sur __ pour la sécurité réelle
```

### Piège 2 : Utiliser __ partout

```python
# ❌ Trop de privé (rend le code difficile à tester et étendre)
class Exemple:
    def __init__(self):
        self.__a = 1
        self.__b = 2
        self.__c = 3
    
    def __methode1(self):
        pass
    
    def __methode2(self):
        pass

# ✅ Utilisez __ seulement quand nécessaire (éviter conflits)
class Exemple:
    def __init__(self):
        self.a = 1  # Public si c'est l'interface
        self._b = 2  # Protected si usage interne
        self.__c = 3  # Private seulement si risque de conflit
```

### Piège 3 : Ignorer les conventions

```python
# ❌ Ignorer les conventions
class Exemple:
    def __init__(self):
        self.attribut_interne = "interne"  # Devrait être _attribut_interne

# ✅ Respecter les conventions
class Exemple:
    def __init__(self):
        self._attribut_interne = "interne"  # Convention respected
```

## Comparaison avec d'autres langages

### Java / C++

```java
// Java : contraintes strictes
public class Exemple {
    public int publique;      // Accessible partout
    protected int protegee;   // Accessible dans la classe et sous-classes
    private int privee;       // Accessible uniquement dans la classe
}
```

### Python

```python
# Python : conventions
class Exemple:
    def __init__(self):
        self.publique = 1        # Convention : public
        self._protegee = 2       # Convention : protected
        self.__privee = 3        # Name mangling : private (mais accessible)
```

## Points clés à retenir

- ✅ **Public** : Pas d'underscore, partie de l'interface publique
- ✅ **Protected** (`_`) : Convention pour "usage interne", accessible mais déconseillé
- ✅ **Private** (`__`) : Name mangling, difficile d'accès mais pas impossible
- ✅ Python utilise des **conventions**, pas des contraintes strictes
- ✅ Respectez les conventions : ne pas accéder aux `_` depuis l'extérieur
- ✅ Utilisez `@property` pour créer une interface publique propre
- ✅ Le name mangling sert principalement à **éviter les conflits** dans l'héritage
- ✅ **Ne comptez pas sur `__` pour la sécurité** : c'est une convention, pas une protection réelle

L'encapsulation en Python repose sur la confiance et les conventions. C'est une approche pragmatique qui offre de la flexibilité tout en encourageant les bonnes pratiques. Respectez ces conventions pour écrire du code maintenable et Pythonic.
