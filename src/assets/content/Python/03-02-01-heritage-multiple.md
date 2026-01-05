---
title: "Héritage multiple"
order: 3.02.01
parent: "03-02-modele-objet-python.md"
tags: ["python", "heritage", "multiple", "inheritance"]
---

# Héritage multiple

Python supporte l'héritage multiple, permettant à une classe d'hériter de plusieurs classes parentes. C'est une fonctionnalité puissante mais qui peut créer de la complexité si mal utilisée.

## Concepts de base

L'**héritage multiple** permet à une classe d'hériter de plusieurs classes parentes simultanément. Contrairement à des langages comme Java (qui n'a que l'héritage simple), Python permet cette flexibilité.

```python
class Parent1:
    def methode1(self):
        return "Méthode de Parent1"

class Parent2:
    def methode2(self):
        return "Méthode de Parent2"

class Enfant(Parent1, Parent2):
    pass

enfant = Enfant()
print(enfant.methode1())  # "Méthode de Parent1"
print(enfant.methode2())  # "Méthode de Parent2"
```

## Syntaxe de l'héritage multiple

### Syntaxe de base

```python
class ClasseEnfant(Parent1, Parent2, Parent3):
    pass
```

L'ordre des parents est important : il détermine le MRO (Method Resolution Order).

```python
class A:
    def methode(self):
        return "A"

class B:
    def methode(self):
        return "B"

class C(A, B):  # A est vérifié avant B
    pass

class D(B, A):  # B est vérifié avant A
    pass

c = C()
print(c.methode())  # "A" (A est en premier)

d = D()
print(d.methode())  # "B" (B est en premier)
```

### Exemple pratique : Mixins

Les mixins sont un cas d'usage courant de l'héritage multiple :

```python
# Mixin : classe qui ajoute des fonctionnalités
class Serialisable:
    def to_dict(self):
        """Convertit l'objet en dictionnaire."""
        return {k: v for k, v in self.__dict__.items() 
                if not k.startswith('_')}

class Loggable:
    def log(self, message):
        """Log un message avec le nom de la classe."""
        print(f"[{self.__class__.__name__}] {message}")

# Classe principale
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

# Classe qui hérite de Personne et utilise les mixins
class Utilisateur(Personne, Serialisable, Loggable):
    def __init__(self, nom, age, email):
        super().__init__(nom, age)
        self.email = email

user = Utilisateur("Alice", 30, "alice@example.com")
user.log("Utilisateur créé")  # [Utilisateur] Utilisateur créé
print(user.to_dict())  # {'nom': 'Alice', 'age': 30, 'email': 'alice@example.com'}
```

## Résolution des conflits

### Conflit de noms de méthodes

Quand plusieurs parents ont la même méthode, Python utilise le MRO pour déterminer laquelle appeler :

```python
class Parent1:
    def methode(self):
        return "Parent1"

class Parent2:
    def methode(self):
        return "Parent2"

class Enfant(Parent1, Parent2):
    pass

enfant = Enfant()
print(enfant.methode())  # "Parent1" (premier parent dans la liste)

# Vérifier le MRO
print(Enfant.__mro__)
# (<class '__main__.Enfant'>, <class '__main__.Parent1'>, 
#  <class '__main__.Parent2'>, <class 'object'>)
```

### Appel explicite avec super()

`super()` permet d'appeler la méthode du parent suivant dans le MRO :

```python
class A:
    def methode(self):
        print("A")
        super().methode()  # Appelle le parent suivant dans le MRO

class B:
    def methode(self):
        print("B")

class C(A, B):
    def methode(self):
        print("C")
        super().methode()  # Appelle A.methode()

c = C()
c.methode()
# C
# A
# B
```

### Diamond problem (problème du diamant)

Le "diamond problem" survient quand une classe hérite de deux classes qui héritent elles-mêmes d'une même classe parente :

```python
class GrandParent:
    def methode(self):
        return "GrandParent"

class Parent1(GrandParent):
    def methode(self):
        return "Parent1"

class Parent2(GrandParent):
    def methode(self):
        return "Parent2"

class Enfant(Parent1, Parent2):
    pass

enfant = Enfant()
print(enfant.methode())  # "Parent1" (selon le MRO)

# MRO : Enfant -> Parent1 -> Parent2 -> GrandParent -> object
print(Enfant.__mro__)
```

Python résout ce problème avec l'algorithme C3 qui garantit un ordre cohérent.

## Cas d'usage

### 1. Mixins pour ajouter des fonctionnalités

```python
class Comparable:
    """Mixin pour ajouter la comparaison."""
    def __eq__(self, other):
        if not isinstance(other, self.__class__):
            return False
        return self.__dict__ == other.__dict__

class Hashable:
    """Mixin pour rendre hashable."""
    def __hash__(self):
        return hash(tuple(sorted(self.__dict__.items())))

class Personne(Comparable, Hashable):
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

alice = Personne("Alice", 30)
bob = Personne("Bob", 25)

print(alice == bob)  # False (grâce au mixin Comparable)
print(hash(alice))   # Hash calculé (grâce au mixin Hashable)
```

### 2. Héritage multiple pour combiner des interfaces

```python
class Volant:
    def voler(self):
        return "Je vole"

class Nageant:
    def nager(self):
        return "Je nage"

class Canard(Volant, Nageant):
    pass

canard = Canard()
print(canard.voler())  # "Je vole"
print(canard.nager())  # "Je nage"
```

### 3. Héritage multiple avec classes abstraites

```python
from abc import ABC, abstractmethod

class Forme(ABC):
    @abstractmethod
    def aire(self):
        pass

class Colorable:
    def __init__(self, couleur="noir"):
        self.couleur = couleur

class Cercle(Forme, Colorable):
    def __init__(self, rayon, couleur="rouge"):
        Colorable.__init__(self, couleur)
        self.rayon = rayon
    
    def aire(self):
        return 3.14159 * self.rayon ** 2

cercle = Cercle(5, "bleu")
print(cercle.aire())    # 78.53975
print(cercle.couleur)   # "bleu"
```

## Pièges courants

### Piège 1 : Ordre des parents important

```python
class A:
    def methode(self):
        return "A"

class B:
    def methode(self):
        return "B"

# ⚠️ L'ordre change le comportement
class C1(A, B):
    pass

class C2(B, A):
    pass

print(C1().methode())  # "A"
print(C2().methode())  # "B"
```

### Piège 2 : Appels super() complexes

```python
class A:
    def __init__(self):
        print("A")
        super().__init__()

class B:
    def __init__(self):
        print("B")
        super().__init__()

class C(A, B):
    def __init__(self):
        print("C")
        super().__init__()

c = C()
# C
# A
# B
# (object.__init__ est appelé en dernier)
```

### Piège 3 : Conflits non résolus

```python
# ⚠️ Si le MRO ne peut pas être résolu, Python lève une erreur
class A:
    pass

class B(A):
    pass

class C(A, B):  # ❌ TypeError: Cannot create a consistent method resolution order
    pass
```

## Bonnes pratiques

### 1. Utilisez des mixins pour des fonctionnalités réutilisables

```python
# ✅ Bon : mixin réutilisable
class JSONSerialisable:
    def to_json(self):
        import json
        return json.dumps(self.__dict__)

class Personne(JSONSerialisable):
    def __init__(self, nom):
        self.nom = nom
```

### 2. Documentez l'ordre des parents

```python
class Enfant(Parent1, Parent2):
    """
    Classe qui hérite de Parent1 et Parent2.
    
    Note: Parent1 est vérifié avant Parent2 dans le MRO.
    """
    pass
```

### 3. Utilisez super() de manière cohérente

```python
class A:
    def methode(self):
        print("A")
        super().methode()  # ✅ Utilise super() pour la chaîne

class B:
    def methode(self):
        print("B")

class C(A, B):
    def methode(self):
        print("C")
        super().methode()  # ✅ Utilise super()
```

### 4. Évitez les hiérarchies trop complexes

```python
# ⚠️ Trop complexe
class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass
class E(B, C): pass
class F(D, E): pass
class G(F, C): pass  # Difficile à comprendre

# ✅ Préférez la composition pour la complexité
```

## Points clés à retenir

- ✅ Python supporte l'**héritage multiple** : une classe peut hériter de plusieurs parents
- ✅ L'**ordre des parents** détermine le MRO (Method Resolution Order)
- ✅ Les **mixins** sont un cas d'usage courant pour ajouter des fonctionnalités
- ✅ `super()` appelle le parent suivant dans le MRO
- ✅ Le **diamond problem** est résolu par l'algorithme C3
- ✅ Utilisez l'héritage multiple avec **modération** : préférez la composition pour la complexité
- ✅ Documentez l'ordre des parents si important

L'héritage multiple est puissant mais peut créer de la complexité. Utilisez-le judicieusement, surtout pour les mixins et les interfaces. Pour des cas complexes, préférez souvent la composition.
