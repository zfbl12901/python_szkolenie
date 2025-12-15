---
title: "Introduction à Python"
order: 1
parent: null
tags: ["python", "basics", "introduction"]
---

# Introduction à Python

Python est un langage de programmation de haut niveau, interprété et orienté objet. Créé par Guido van Rossum et publié pour la première fois en 1991, Python est devenu l'un des langages les plus populaires au monde, notamment grâce à sa simplicité et sa polyvalence.

## Pourquoi Python ?

### Avantages principaux

- **Syntaxe simple et lisible** : Le code Python ressemble presque à du pseudo-code, ce qui le rend facile à apprendre et à maintenir
- **Polyvalent** : Utilisé dans de nombreux domaines :
  - Développement web (Django, Flask, FastAPI)
  - Data Science et analyse de données (Pandas, NumPy)
  - Intelligence Artificielle et Machine Learning (TensorFlow, PyTorch, scikit-learn)
  - Automatisation et scripts
  - Applications desktop et mobiles
- **Communauté active** : Une large communauté mondiale et des milliers de bibliothèques disponibles via PyPI
- **Parfait pour l'IA** : Excellente intégration avec les outils d'IA modernes (LLM, embeddings, vector databases)
- **Multi-paradigme** : Supporte la programmation procédurale, orientée objet et fonctionnelle
- **Gratuit et open source** : Python est libre et gratuit

## Installation

### Windows

1. Visitez [python.org/downloads/](https://www.python.org/downloads/)
2. Téléchargez la dernière version stable (Python 3.11 ou supérieur)
3. Exécutez l'installateur et **cochez "Add Python to PATH"**
4. Suivez les instructions d'installation

### Vérifier l'installation

Ouvrez un terminal (PowerShell ou CMD) et tapez :

```bash
python --version
# ou
python3 --version
```

Vous devriez voir quelque chose comme : `Python 3.11.5`

### Alternative : Anaconda

Pour la Data Science et l'IA, vous pouvez utiliser [Anaconda](https://www.anaconda.com/), qui inclut Python et de nombreuses bibliothèques pré-installées.

## Environnements de développement

### Éditeurs recommandés

- **VS Code** : Gratuit, extensible, excellent support Python
- **PyCharm** : IDE complet de JetBrains (version Community gratuite)
- **Jupyter Notebook** : Parfait pour l'exploration de données et l'IA

### Configuration VS Code

1. Installez l'extension Python depuis le marketplace
2. Sélectionnez votre interpréteur Python : `Ctrl+Shift+P` → "Python: Select Interpreter"

## Premier programme

Créons notre premier programme Python. Créez un fichier `hello.py` :

```python
print("Hello, World!")
```

Exécutez-le :

```bash
python hello.py
```

C'est aussi simple que ça ! Python est conçu pour être intuitif.

## Caractéristiques du langage

### Indentation significative

Contrairement à d'autres langages, Python utilise l'indentation pour structurer le code :

```python
if True:
    print("Ceci est indenté")
    print("Ceci aussi")
print("Ceci ne l'est pas")
```

### Pas de point-virgule

Python n'utilise pas de point-virgule en fin de ligne (sauf pour mettre plusieurs instructions sur une ligne).

### Commentaires

```python
# Ceci est un commentaire sur une ligne

"""
Ceci est un commentaire
sur plusieurs lignes
"""

# Les docstrings (triple quotes) sont utilisées pour documenter les fonctions
def ma_fonction():
    """Documentation de la fonction"""
    pass
```

## Exécution interactive

Python peut être exécuté en mode interactif (REPL - Read-Eval-Print Loop) :

```bash
python
```

Puis tapez directement du code :

```python
>>> 2 + 2
4
>>> print("Bonjour")
Bonjour
>>> exit()
```

## Structure d'un programme Python

```python
# 1. Imports
import os
from datetime import datetime

# 2. Variables globales (si nécessaire)
VERSION = "1.0.0"

# 3. Définitions de fonctions/classes
def main():
    print("Programme principal")

# 4. Point d'entrée
if __name__ == "__main__":
    main()
```

## Bonnes pratiques

- **Nommage** : Utilisez des noms descriptifs en snake_case (`ma_variable`, `ma_fonction`)
- **PEP 8** : Suivez le style guide Python (PEP 8)
- **Documentation** : Documentez vos fonctions avec des docstrings
- **Gestion d'erreurs** : Utilisez try/except pour gérer les erreurs

## Prochaines étapes

Maintenant que vous avez Python installé et que vous comprenez les bases, nous allons explorer :
- Les variables et types de données
- Les structures de contrôle
- Les fonctions
- Les classes et la POO

Python est un langage puissant et amusant à apprendre. Commençons !

