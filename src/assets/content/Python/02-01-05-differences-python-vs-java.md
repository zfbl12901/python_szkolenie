---
title: "Différences Python vs Java (mental model)"
order: 2.01.05
parent: "02-01-syntaxe-et-modele-de-base.md"
tags: ["python", "java", "comparaison", "mental-model", "transition"]
---

# Différences Python vs Java (mental model)

Pour les développeurs venant de Java, comprendre les différences fondamentales de mentalité entre les deux langages est essentiel. Python et Java ont des philosophies de design très différentes, et transférer directement les patterns Java en Python mène souvent à du code non-Pythonic.

## Philosophie : Simplicité vs Rigidité

### Java : "Explicite et rigide"

```java
// Java - Tout doit être déclaré explicitement
public class Calculatrice {
    private int nombre1;
    private int nombre2;
    
    public Calculatrice(int nombre1, int nombre2) {
        this.nombre1 = nombre1;
        this.nombre2 = nombre2;
    }
    
    public int additionner() {
        return this.nombre1 + this.nombre2;
    }
}
```

### Python : "Simple et flexible"

```python
# Python - Beaucoup plus concis
class Calculatrice:
    def __init__(self, nombre1, nombre2):
        self.nombre1 = nombre1
        self.nombre2 = nombre2
    
    def additionner(self):
        return self.nombre1 + self.nombre2

# Ou encore plus simple (fonction)
def additionner(nombre1, nombre2):
    return nombre1 + nombre2
```

## Modèle d'exécution

### Java : Compilé puis exécuté

```java
// Java
// 1. Compilation : .java → .class (bytecode)
// 2. Exécution : JVM exécute le bytecode
// 3. Erreurs de type détectées à la compilation
int nombre = "texte";  // ❌ Erreur de compilation
```

### Python : Interprété directement

```python
# Python
# 1. Interprétation directe du code source
# 2. Pas d'étape de compilation séparée (sauf bytecode .pyc)
# 3. Erreurs de type détectées à l'exécution
nombre = "texte"  # ✅ Pas d'erreur, mais peut causer des bugs plus tard
nombre + 5        # ❌ TypeError à l'exécution seulement
```

## Typage : Statique vs Dynamique

### Java : Typage statique strict

```java
// Java - Types déclarés et vérifiés à la compilation
int nombre = 42;
String texte = "Hello";
// nombre = "Hello";  // ❌ Erreur de compilation

// Types génériques explicites
List<String> liste = new ArrayList<>();
liste.add("Hello");
// liste.add(42);  // ❌ Erreur de compilation
```

### Python : Typage dynamique

```python
# Python - Types déterminés à l'exécution
nombre = 42
print(type(nombre))  # <class 'int'>

nombre = "Hello"
print(type(nombre))  # <class 'str'>

# Pas de génériques obligatoires (mais annotations possibles)
liste: list[str] = []
liste.append("Hello")
liste.append(42)  # ✅ Pas d'erreur, mais peut être problématique
```

## Gestion de la mémoire

### Java : Garbage Collector explicite

```java
// Java - Garbage Collector gère la mémoire
// Pas de contrôle direct sur la destruction d'objets
Object obj = new Object();
obj = null;  // L'objet peut être garbage collected
```

### Python : Garbage Collector automatique

```python
# Python - Garbage Collector automatique (similaire)
# Mais avec comptage de références en plus
obj = object()
obj = None  # L'objet peut être garbage collected

# Python utilise aussi le comptage de références
# (en plus du garbage collector cyclique)
```

## Syntaxe : Accolades vs Indentation

### Java : Accolades obligatoires

```java
// Java
if (condition) {
    faireQuelqueChose();
    if (autreCondition) {
        faireAutreChose();
    }
}
```

### Python : Indentation obligatoire

```python
# Python
if condition:
    faire_quelque_chose()
    if autre_condition:
        faire_autre_chose()
```

## Modèle objet : Classes partout vs Flexibilité

### Java : Tout est dans une classe

```java
// Java - Même un simple "Hello World" nécessite une classe
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### Python : Scripts simples possibles

```python
# Python - Un script simple suffit
print("Hello, World!")

# Les classes sont optionnelles
def fonction_simple():
    return "Hello"
```

## Encapsulation : Public/Private explicite vs Convention

### Java : Modificateurs d'accès stricts

```java
// Java - Modificateurs explicites
public class MaClasse {
    public int publique;
    private int privee;
    protected int protegee;
    
    // Getters/Setters souvent nécessaires
    public int getPrivee() {
        return this.privee;
    }
}
```

### Python : Convention de nommage

```python
# Python - Convention (pas de contrainte réelle)
class MaClasse:
    def __init__(self):
        self.publique = 1        # Public (convention)
        self._protegee = 2      # Protégée (convention, un underscore)
        self.__privee = 3       # "Privée" (name mangling, deux underscores)
    
    # Pas besoin de getters/setters pour des attributs simples
    @property
    def privee(self):           # Property si nécessaire
        return self.__privee
```

## Gestion des exceptions

### Java : Checked vs Unchecked

```java
// Java - Exceptions checked doivent être gérées
public void lireFichier() throws IOException {
    // IOException est checked, doit être déclarée
    FileReader file = new FileReader("fichier.txt");
}
```

### Python : Toutes les exceptions sont "unchecked"

```python
# Python - Pas de distinction checked/unchecked
def lire_fichier():
    # Pas besoin de déclarer les exceptions
    with open("fichier.txt", "r") as f:
        return f.read()
```

## Collections et itération

### Java : Boucles explicites

```java
// Java - Boucles explicites
List<String> liste = Arrays.asList("a", "b", "c");
for (int i = 0; i < liste.size(); i++) {
    System.out.println(liste.get(i));
}

// Ou enhanced for loop
for (String element : liste) {
    System.out.println(element);
}
```

### Python : Itération Pythonic

```python
# Python - Itération directe
liste = ["a", "b", "c"]
for element in liste:
    print(element)

# Avec index si nécessaire
for i, element in enumerate(liste):
    print(f"{i}: {element}")
```

## Null vs None

### Java : null partout

```java
// Java - null peut être partout
String texte = null;
if (texte != null) {
    System.out.println(texte.length());
}
```

### Python : None et valeurs par défaut

```python
# Python - None est un objet singleton
texte = None
if texte is not None:  # Utiliser 'is', pas '=='
    print(len(texte))

# Pythonic : utiliser des valeurs par défaut
def fonction(texte=None):
    texte = texte or "par défaut"
    return texte
```

## Interfaces vs Duck Typing

### Java : Interfaces explicites

```java
// Java - Interface explicite
interface Volant {
    void voler();
}

class Oiseau implements Volant {
    public void voler() {
        System.out.println("L'oiseau vole");
    }
}
```

### Python : Duck Typing

```python
# Python - "Si ça marche comme un canard, c'est un canard"
class Oiseau:
    def voler(self):
        print("L'oiseau vole")

# Pas besoin d'interface explicite
# Si l'objet a une méthode voler(), on peut l'utiliser
def faire_voler(objet):
    objet.voler()  # Fonctionne si l'objet a une méthode voler()
```

## Packages et modules

### Java : Packages stricts

```java
// Java - Structure de packages stricte
package com.monentreprise.monprojet;

import java.util.List;
import java.util.ArrayList;
```

### Python : Modules flexibles

```python
# Python - Modules simples
# fichier: mon_module.py
def ma_fonction():
    pass

# Utilisation
import mon_module
from mon_module import ma_fonction
```

## Changement de mentalité nécessaire

### 1. Moins de code boilerplate

```java
// Java - Beaucoup de code pour peu de fonctionnalité
public class Personne {
    private String nom;
    private int age;
    
    public Personne(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }
    
    public String getNom() {
        return this.nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    // ... getters/setters pour age
}
```

```python
# Python - Dataclass (Python 3.7+)
from dataclasses import dataclass

@dataclass
class Personne:
    nom: str
    age: int
    # Getters, setters, __init__, __repr__, __eq__ générés automatiquement
```

### 2. Privilégier la simplicité

```java
// Java - Pattern souvent utilisé
if (objet != null && objet.getValeur() != null) {
    traiter(objet.getValeur());
}
```

```python
# Python - Plus simple
if objet and objet.valeur:
    traiter(objet.valeur)

# Ou avec l'opérateur walrus
if (valeur := objet.valeur if objet else None):
    traiter(valeur)
```

### 3. Utiliser les fonctionnalités Python

```java
// Java - Créer une liste filtrée
List<String> resultats = new ArrayList<>();
for (String element : liste) {
    if (element.startsWith("A")) {
        resultats.add(element);
    }
}
```

```python
# Python - List comprehension
resultats = [element for element in liste if element.startswith("A")]

# Ou avec filter
resultats = list(filter(lambda x: x.startswith("A"), liste))
```

## Pièges courants pour les développeurs Java

### 1. Essayer de forcer le typage statique

```python
# ❌ Ne pas essayer de reproduire Java
def fonction(nombre: int) -> int:
    # Le typage est optionnel, pas forcé
    return nombre + "texte"  # Pas d'erreur à l'exécution immédiate
```

### 2. Utiliser des getters/setters partout

```python
# ❌ Style Java
class Personne:
    def __init__(self, nom):
        self._nom = nom
    
    def get_nom(self):
        return self._nom
    
    def set_nom(self, nom):
        self._nom = nom

# ✅ Style Python
class Personne:
    def __init__(self, nom):
        self.nom = nom  # Accès direct, simple

# Si validation nécessaire plus tard, utiliser @property
class Personne:
    def __init__(self, nom):
        self._nom = nom
    
    @property
    def nom(self):
        return self._nom
    
    @nom.setter
    def nom(self, valeur):
        if not valeur:
            raise ValueError("Le nom ne peut pas être vide")
        self._nom = valeur
```

### 3. Ignorer les list comprehensions

```python
# ❌ Style Java
resultats = []
for i in range(10):
    if i % 2 == 0:
        resultats.append(i * 2)

# ✅ Style Python
resultats = [i * 2 for i in range(10) if i % 2 == 0]
```

## Points clés à retenir

- ✅ **Python est plus simple** : Moins de code boilerplate, syntaxe plus concise
- ✅ **Typage dynamique** : Pas de déclaration de types obligatoire (mais annotations possibles)
- ✅ **Duck typing** : Pas besoin d'interfaces explicites
- ✅ **Indentation** : Pas d'accolades, l'indentation structure le code
- ✅ **Scripts simples** : Pas besoin de classes pour tout
- ✅ **Conventions** : Utilisez les conventions Python (PEP 8)
- ✅ **Pythonic** : Apprenez les idiomes Python (list comprehensions, context managers, etc.)
- ✅ **Moins de getters/setters** : Accès direct aux attributs, properties si nécessaire

## Transition progressive

Pour faciliter la transition :

1. **Lisez du code Python** : Familiarisez-vous avec le style Pythonic
2. **Utilisez les outils** : `black` pour le formatage, `mypy` pour le type checking
3. **Pratiquez** : Réécrivez du code Java en Python
4. **Apprenez les idiomes** : List comprehensions, generators, context managers
5. **Acceptez la flexibilité** : Python est moins rigide que Java, c'est une force

Le changement de mentalité est important : Python privilégie la simplicité et la lisibilité plutôt que la rigidité et l'explicite. Une fois cette transition faite, vous apprécierez la productivité accrue que Python offre.
