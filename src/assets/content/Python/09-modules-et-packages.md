---
title: "Modules et Packages"
order: 9
parent: null
tags: ["python", "basics", "modules", "packages"]
---

# Modules et Packages

Les modules et packages permettent d'organiser et de réutiliser du code Python. Ils sont essentiels pour créer des applications modulaires et maintenables.

## Qu'est-ce qu'un Module ?

Un module est un fichier Python (`.py`) qui contient des définitions et des instructions. Il peut être importé dans d'autres fichiers Python.

### Créer un module

Créez un fichier `calculs.py` :

```python
# calculs.py
def additionner(a, b):
    return a + b

def multiplier(a, b):
    return a * b

PI = 3.14159

class Calculatrice:
    def __init__(self):
        self.historique = []
    
    def calculer(self, operation, a, b):
        if operation == "+":
            resultat = a + b
        elif operation == "-":
            resultat = a - b
        else:
            resultat = 0
        self.historique.append(f"{a} {operation} {b} = {resultat}")
        return resultat
```

### Importer un module

```python
# main.py
import calculs

resultat = calculs.additionner(5, 3)
print(resultat)  # 8

print(calculs.PI)  # 3.14159

calc = calculs.Calculatrice()
calc.calculer("+", 10, 5)
```

### Import avec alias

```python
import calculs as calc

resultat = calc.additionner(5, 3)
```

### Import sélectif

```python
from calculs import additionner, PI

resultat = additionner(5, 3)  # Pas besoin du préfixe calculs
print(PI)
```

### Import de tout (à éviter)

```python
from calculs import *  # ⚠️ À éviter : pollue l'espace de noms

resultat = additionner(5, 3)
```

## Modules Standard de Python

Python inclut une bibliothèque standard riche. Voici quelques modules couramment utilisés :

### os - Interface avec le système d'exploitation

```python
import os

# Informations sur le système
print(os.name)  # nt (Windows), posix (Linux/Mac)
print(os.getcwd())  # Répertoire courant

# Manipulation de fichiers
os.makedirs("nouveau_dossier", exist_ok=True)
os.chdir("nouveau_dossier")
os.listdir(".")  # Liste les fichiers
```

### sys - Paramètres et fonctions système

```python
import sys

print(sys.version)  # Version de Python
print(sys.platform)  # Plateforme (win32, linux, darwin)

# Arguments de ligne de commande
print(sys.argv)  # Liste des arguments

# Sortie
sys.exit(0)  # Quitter le programme
```

### datetime - Dates et heures

```python
from datetime import datetime, timedelta, date

# Date et heure actuelles
maintenant = datetime.now()
print(maintenant)  # 2024-01-15 14:30:45.123456

# Formatage
print(maintenant.strftime("%Y-%m-%d %H:%M:%S"))

# Parsing
date_str = "2024-01-15"
date_obj = datetime.strptime(date_str, "%Y-%m-%d")

# Calculs
demain = maintenant + timedelta(days=1)
hier = maintenant - timedelta(days=1)
```

### json - Manipulation JSON

```python
import json

# Python → JSON
donnees = {"nom": "Alice", "age": 25}
json_str = json.dumps(donnees)
print(json_str)  # {"nom": "Alice", "age": 25}

# JSON → Python
donnees_parsees = json.loads(json_str)
print(donnees_parsees["nom"])  # Alice

# Fichiers
with open("donnees.json", "w") as f:
    json.dump(donnees, f, indent=2)

with open("donnees.json", "r") as f:
    donnees = json.load(f)
```

### random - Génération aléatoire

```python
import random

# Nombre aléatoire
nombre = random.randint(1, 100)  # Entre 1 et 100
decimal = random.random()  # Entre 0.0 et 1.0

# Choix aléatoire
liste = ["a", "b", "c"]
choix = random.choice(liste)
echantillon = random.sample(liste, 2)  # 2 éléments aléatoires

# Mélanger
random.shuffle(liste)
```

### math - Fonctions mathématiques

```python
import math

# Constantes
print(math.pi)  # 3.14159...
print(math.e)   # 2.71828...

# Fonctions
print(math.sqrt(16))      # 4.0
print(math.pow(2, 3))     # 8.0
print(math.ceil(4.3))     # 5
print(math.floor(4.7))   # 4
print(math.factorial(5)) # 120
```

### re - Expressions régulières

```python
import re

# Recherche
texte = "Mon email est alice@example.com"
match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', texte)
if match:
    print(match.group())  # alice@example.com

# Remplacement
nouveau_texte = re.sub(r'\d+', 'X', "J'ai 25 ans")
print(nouveau_texte)  # J'ai X ans

# Trouver toutes les occurrences
nombres = re.findall(r'\d+', "J'ai 25 ans et 3 enfants")
print(nombres)  # ['25', '3']
```

### collections - Structures de données avancées

```python
from collections import Counter, defaultdict, deque, namedtuple

# Counter : compte les occurrences
compteur = Counter([1, 2, 2, 3, 3, 3])
print(compteur)  # Counter({3: 3, 2: 2, 1: 1})
print(compteur.most_common(2))  # [(3, 3), (2, 2)]

# defaultdict : dictionnaire avec valeur par défaut
dd = defaultdict(int)
dd["a"] += 1  # Pas besoin de vérifier si la clé existe
print(dd["a"])  # 1

# deque : file double face
file = deque([1, 2, 3])
file.appendleft(0)  # Ajoute au début
file.append(4)      # Ajoute à la fin
print(file)  # deque([0, 1, 2, 3, 4])

# namedtuple : tuple avec noms
Personne = namedtuple("Personne", ["nom", "age"])
alice = Personne("Alice", 25)
print(alice.nom)  # Alice
```

## Packages

Un package est un dossier contenant plusieurs modules. Il permet d'organiser le code en hiérarchie.

### Structure d'un package

```
mon_package/
├── __init__.py      # Fichier qui fait du dossier un package
├── module1.py
├── module2.py
└── sous_package/
    ├── __init__.py
    └── module3.py
```

### Créer un package

1. Créez un dossier `mon_package`
2. Créez un fichier `__init__.py` (peut être vide)

```python
# mon_package/__init__.py
# Ce fichier peut être vide ou contenir des imports

# Import des modules du package
from .module1 import fonction1
from .module2 import classe1

# Définir ce qui est exporté
__all__ = ["fonction1", "classe1"]
```

### Utiliser un package

```python
# Import du package
import mon_package

# Import d'un module du package
from mon_package import module1

# Import d'une fonction spécifique
from mon_package.module1 import fonction1

# Import avec alias
import mon_package.module1 as mod1
```

### Package avec sous-packages

```python
# Structure
mon_package/
├── __init__.py
├── utils/
│   ├── __init__.py
│   └── helpers.py
└── models/
    ├── __init__.py
    └── user.py

# Utilisation
from mon_package.utils.helpers import fonction_utilitaire
from mon_package.models.user import User
```

## __init__.py

Le fichier `__init__.py` est spécial :

- **Indique que le dossier est un package** (obligatoire en Python < 3.3)
- **S'exécute lors de l'import du package**
- **Peut contenir des initialisations**
- **Peut exporter des éléments du package**

### Exemple d'__init__.py

```python
# mon_package/__init__.py

# Imports pour faciliter l'utilisation
from .module1 import fonction1, fonction2
from .module2 import Classe1

# Variables du package
VERSION = "1.0.0"
AUTEUR = "Alice"

# Initialisation
print(f"Package mon_package version {VERSION} chargé")

# Définir __all__ pour contrôler les exports
__all__ = ["fonction1", "fonction2", "Classe1", "VERSION"]
```

## Chemins d'import

Python cherche les modules dans cet ordre :

1. **Répertoire courant**
2. **PYTHONPATH** (variable d'environnement)
3. **Répertoires standards** (site-packages)
4. **Répertoires dans sys.path**

### Modifier sys.path

```python
import sys
sys.path.append("/chemin/vers/mon/module")

import mon_module
```

### PYTHONPATH

```bash
# Linux/Mac
export PYTHONPATH="/chemin/vers/mes/modules:$PYTHONPATH"

# Windows
set PYTHONPATH=C:\chemin\vers\mes\modules;%PYTHONPATH%
```

## Import relatif vs absolu

### Import absolu

```python
# Depuis n'importe où
from mon_package.module1 import fonction1
```

### Import relatif

```python
# Dans mon_package/module2.py
from .module1 import fonction1      # Même niveau
from ..autre_package import truc    # Niveau parent
from .sous_package.module3 import x # Sous-package
```

## Packages tiers (PyPI)

### Installation avec pip

```bash
# Installer un package
pip install requests

# Installer depuis requirements.txt
pip install -r requirements.txt

# Installer une version spécifique
pip install requests==2.31.0

# Mettre à jour
pip install --upgrade requests

# Désinstaller
pip uninstall requests
```

### Packages populaires

```python
# requests - Requêtes HTTP
import requests
response = requests.get("https://api.example.com/data")
print(response.json())

# pandas - Manipulation de données
import pandas as pd
df = pd.read_csv("donnees.csv")
print(df.head())

# numpy - Calculs numériques
import numpy as np
array = np.array([1, 2, 3, 4, 5])
print(array.mean())

# flask/fastapi - Frameworks web
from fastapi import FastAPI
app = FastAPI()
```

### Créer un requirements.txt

```txt
# requirements.txt
requests>=2.31.0
pandas>=2.0.0
numpy>=1.24.0
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
```

## Exemple pratique : Créer un package

### Structure

```
mon_projet/
├── main.py
└── utils/
    ├── __init__.py
    ├── validators.py
    ├── formatters.py
    └── helpers.py
```

### Contenu des fichiers

```python
# utils/validators.py
def valider_email(email):
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def valider_age(age):
    return isinstance(age, int) and 0 <= age <= 150

# utils/formatters.py
def formater_nom(nom):
    return nom.strip().title()

def formater_telephone(tel):
    return tel.replace(" ", "").replace("-", "")

# utils/helpers.py
def generer_id():
    import uuid
    return str(uuid.uuid4())

# utils/__init__.py
from .validators import valider_email, valider_age
from .formatters import formater_nom, formater_telephone
from .helpers import generer_id

__all__ = [
    "valider_email",
    "valider_age",
    "formater_nom",
    "formater_telephone",
    "generer_id"
]

# main.py
from utils import valider_email, formater_nom, generer_id

email = "alice@example.com"
if valider_email(email):
    print(f"Email valide : {email}")

nom = formater_nom("  alice dupont  ")
print(nom)  # Alice Dupont

id_unique = generer_id()
print(id_unique)
```

## Bonnes pratiques

### 1. Organisation

```
projet/
├── main.py
├── config.py
├── models/
│   ├── __init__.py
│   └── user.py
├── utils/
│   ├── __init__.py
│   └── helpers.py
└── tests/
    ├── __init__.py
    └── test_models.py
```

### 2. Imports organisés

```python
# 1. Imports standard
import os
import sys
from datetime import datetime

# 2. Imports tiers
import requests
import pandas as pd

# 3. Imports locaux
from mon_package import fonction
from mon_package.utils import helper
```

### 3. Éviter les imports circulaires

```python
# ❌ MAUVAIS
# module1.py
from module2 import fonction2

# module2.py
from module1 import fonction1  # Import circulaire !

# ✅ BON : Utiliser des imports locaux
def fonction1():
    from module2 import fonction2  # Import dans la fonction
    return fonction2()
```

### 4. Utiliser __all__

```python
# module.py
def fonction_publique():
    pass

def _fonction_privee():
    pass

__all__ = ["fonction_publique"]  # Exporte seulement fonction_publique
```

### 5. Documentation des modules

```python
"""
Module de calculs mathématiques.

Ce module fournit des fonctions pour effectuer
des opérations mathématiques de base.
"""

def additionner(a, b):
    """Additionne deux nombres."""
    return a + b
```

## Vérifier et déboguer les imports

### Vérifier si un module existe

```python
import importlib.util

def module_existe(nom_module):
    spec = importlib.util.find_spec(nom_module)
    return spec is not None

print(module_existe("os"))      # True
print(module_existe("inexistant"))  # False
```

### Lister les modules installés

```python
import pkgutil

# Lister tous les modules installés
for importer, modname, ispkg in pkgutil.iter_modules():
    print(modname)
```

### Reload un module

```python
import importlib
import mon_module

# Recharger le module (utile en développement)
importlib.reload(mon_module)
```

## Exemples avancés

### Package avec configuration

```python
# config/__init__.py
import os

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///db.sqlite")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

# Utilisation
from config import Config
print(Config.DATABASE_URL)
```

### Package avec factory pattern

```python
# factory/__init__.py
def creer_connexion(type_db):
    if type_db == "mysql":
        from .mysql import MySQLConnection
        return MySQLConnection()
    elif type_db == "postgres":
        from .postgres import PostgresConnection
        return PostgresConnection()
    else:
        raise ValueError(f"Type de DB inconnu : {type_db}")

# Utilisation
from factory import creer_connexion
conn = creer_connexion("mysql")
```

## Résumé

- **Module** : Fichier `.py` avec du code réutilisable
- **Package** : Dossier avec `__init__.py` contenant des modules
- **Import** : Utilisez `import`, `from ... import`, ou `import ... as`
- **Bibliothèque standard** : Modules inclus avec Python (os, sys, json, etc.)
- **Packages tiers** : Installez avec `pip` depuis PyPI
- **Organisation** : Structurez votre code en packages logiques
- **Bonnes pratiques** : Organisez les imports, évitez les imports circulaires, documentez

Les modules et packages sont la base de la programmation modulaire en Python. Maîtrisez-les pour créer des applications bien structurées et maintenables !
