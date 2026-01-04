---
title: "Indentation et blocs"
order: 2.01.01
parent: "02-01-syntaxe-et-modele-de-base.md"
tags: ["python", "syntaxe", "indentation", "blocs", "structure"]
---

# Indentation et blocs

En Python, l'indentation n'est pas seulement une question de style : elle définit la structure du code et les blocs logiques. C'est l'une des caractéristiques les plus distinctives de Python et l'une des premières choses à maîtriser.

## Pourquoi l'indentation ?

Contrairement à des langages comme Java, C++ ou JavaScript qui utilisent des accolades `{}` pour délimiter les blocs, Python utilise l'indentation. Cette approche a plusieurs avantages :

- **Lisibilité forcée** : Le code est automatiquement bien formaté
- **Moins de caractères** : Pas besoin d'accolades ouvrantes/fermantes
- **Cohérence** : Impossible d'avoir un code mal indenté qui fonctionne

## Règles fondamentales

### 1. L'indentation définit les blocs

Chaque niveau d'indentation définit un nouveau bloc. Python recommande (PEP 8) d'utiliser **4 espaces** par niveau d'indentation.

```python
# Exemple de bloc avec indentation
if condition:
    print("La condition est vraie")
    print("Ceci est dans le même bloc")
    if autre_condition:
        print("Bloc imbriqué - 8 espaces")
print("Ceci est en dehors du bloc if")
```

### 2. Cohérence obligatoire

Tous les éléments d'un même bloc doivent avoir la même indentation :

```python
# ✅ Correct
if x > 0:
    print("Positif")
    print("Toujours positif")

# ❌ Erreur : IndentationError
if x > 0:
    print("Positif")
  print("Mauvaise indentation")  # IndentationError!
```

### 3. Pas de mélange tabs/espaces

Python 3 interdit le mélange de tabs et d'espaces. Choisissez l'un ou l'autre (PEP 8 recommande les espaces).

```python
# ❌ Ne faites jamais ça
if x > 0:
    print("Espaces")  # 4 espaces
	print("Tab")      # 1 tab - ERREUR!
```

## Exemples pratiques

### Blocs conditionnels

```python
age = 18

if age >= 18:
    print("Vous êtes majeur")
    if age >= 65:
        print("Vous êtes retraité")
else:
    print("Vous êtes mineur")
```

### Boucles

```python
# Boucle for
for i in range(5):
    print(f"Itération {i}")
    if i == 2:
        print("  Milieu de la boucle")

# Boucle while
compteur = 0
while compteur < 3:
    print(f"Compteur: {compteur}")
    compteur += 1
```

### Fonctions

```python
def calculer_carre(nombre):
    resultat = nombre ** 2
    if resultat > 100:
        print("Le carré est grand")
    return resultat
```

### Classes

```python
class Personne:
    def __init__(self, nom):
        self.nom = nom
    
    def dire_bonjour(self):
        print(f"Bonjour, je suis {self.nom}")
        if self.nom == "Alice":
            print("  C'est une personne spéciale!")
```

## Indentation et structures complexes

### Try/except

```python
try:
    resultat = 10 / 0
    print("Ceci ne s'exécutera jamais")
except ZeroDivisionError:
    print("Division par zéro détectée")
    print("Gestion de l'erreur")
finally:
    print("Ceci s'exécute toujours")
```

### With (context managers)

```python
with open("fichier.txt", "r") as f:
    contenu = f.read()
    print("Fichier lu")
    # Le fichier sera automatiquement fermé ici
```

## Erreurs courantes

### 1. IndentationError

```python
# ❌ Erreur
def ma_fonction():
print("Oubli d'indentation")  # IndentationError

# ✅ Correct
def ma_fonction():
    print("Bien indenté")
```

### 2. Indentation incohérente

```python
# ❌ Erreur
if x > 0:
    print("Ligne 1")
  print("Ligne 2")  # IndentationError: unindent does not match

# ✅ Correct
if x > 0:
    print("Ligne 1")
    print("Ligne 2")
```

### 3. Indentation après deux-points

```python
# ❌ Erreur
if x > 0:
print("Oubli d'indenter après :")

# ✅ Correct
if x > 0:
    print("Bien indenté après :")
```

## Bonnes pratiques

### 1. Utilisez 4 espaces (PEP 8)

```python
# ✅ Recommandé
def fonction():
    if condition:
        faire_quelque_chose()

# ⚠️ Évitez (2 espaces fonctionnent mais ne sont pas recommandés)
def fonction():
  if condition:
    faire_quelque_chose()
```

### 2. Configurez votre éditeur

Configurez votre éditeur pour :
- Convertir les tabs en espaces
- Afficher les espaces (pour voir l'indentation)
- Utiliser 4 espaces par défaut

### 3. Utilisez un linter

Des outils comme `black` ou `ruff` peuvent automatiquement formater votre code :

```bash
# Installer black
pip install black

# Formater un fichier
black mon_fichier.py
```

## Comparaison avec d'autres langages

### Java / C++ / JavaScript

```java
// Java - Utilise des accolades
if (x > 0) {
    System.out.println("Positif");
    if (y > 0) {
        System.out.println("Les deux sont positifs");
    }
}
```

```python
# Python - Utilise l'indentation
if x > 0:
    print("Positif")
    if y > 0:
        print("Les deux sont positifs")
```

## Avantages de l'indentation Python

1. **Code plus lisible** : Impossible d'avoir du code mal formaté qui fonctionne
2. **Moins de caractères** : Pas besoin d'accolades
3. **Cohérence forcée** : Tous les développeurs Python utilisent le même style
4. **Moins d'erreurs** : Pas de problème d'accolades manquantes ou mal fermées

## Exercice pratique

Essayez de réécrire ce code Java en Python :

```java
// Java
public void afficherNombres() {
    for (int i = 0; i < 10; i++) {
        if (i % 2 == 0) {
            System.out.println(i + " est pair");
        } else {
            System.out.println(i + " est impair");
        }
    }
}
```

**Solution Python** :

```python
def afficher_nombres():
    for i in range(10):
        if i % 2 == 0:
            print(f"{i} est pair")
        else:
            print(f"{i} est impair")
```

## Points clés à retenir

- ✅ L'indentation définit les blocs en Python (pas d'accolades)
- ✅ Utilisez 4 espaces par niveau (PEP 8)
- ✅ Ne mélangez jamais tabs et espaces
- ✅ Tous les éléments d'un bloc doivent avoir la même indentation
- ✅ Après un deux-points `:`, vous devez indenter
- ✅ Configurez votre éditeur pour gérer l'indentation automatiquement

L'indentation est l'une des premières choses à maîtriser en Python. Une fois que vous êtes à l'aise avec ce concept, le reste de la syntaxe Python devient beaucoup plus naturel.
