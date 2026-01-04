---
title: "Développement d'Applications Python"
order: 30
parent: null
tags: ["python", "applications", "web", "desktop"]
---

# Développement d'Applications Python

## Introduction

Python n'est pas seulement un langage pour le scripting et l'analyse de données. C'est aussi un excellent choix pour développer des applications complètes : applications web, APIs REST, applications desktop, applications mobiles et même des jeux !

## Types d'applications Python

### 1. Applications Web

Les applications web Python permettent de créer des sites dynamiques et des APIs.

**Frameworks populaires :**
- **Flask** : Micro-framework léger et flexible
- **FastAPI** : Moderne, rapide, idéal pour les APIs
- **Django** : Framework complet "batteries included"

### 2. APIs REST

Les APIs REST permettent à différentes applications de communiquer entre elles.

**Outils :**
- **FastAPI** : Performance et documentation automatique
- **Flask-RESTful** : Extension Flask pour les APIs
- **Django REST Framework** : Pour les projets Django

### 3. Applications Desktop

Applications avec interface graphique pour Windows, macOS et Linux.

**Bibliothèques :**
- **Tkinter** : Inclus avec Python, simple
- **PyQt/PySide** : Puissant et professionnel
- **Kivy** : Moderne, multi-plateforme

### 4. Applications Mobiles

Développer des apps iOS et Android avec Python.

**Frameworks :**
- **Kivy** : Framework Python natif
- **BeeWare** : Compile vers natif
- **React Native + Python** : Backend Python

### 5. Jeux 2D

Créer des jeux vidéo avec Python.

**Bibliothèques :**
- **Pygame** : La plus populaire
- **Arcade** : Moderne et simple
- **Panda3D** : Pour les jeux 3D

## Architecture d'une application

### Structure de base

```
mon_application/
├── app.py                 # Point d'entrée
├── requirements.txt       # Dépendances
├── config.py             # Configuration
├── models/               # Modèles de données
├── views/                # Vues/Contrôleurs
├── templates/            # Templates HTML (web)
├── static/               # Fichiers statiques (CSS, JS)
└── tests/               # Tests
```

### Exemple de structure Flask

```python
# app.py
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
```

### Exemple de structure FastAPI

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Concepts fondamentaux

### 1. Routes et endpoints

Les routes définissent les URLs accessibles dans votre application.

```python
# Flask
@app.route('/users/<int:user_id>')
def get_user(user_id):
    return f"User {user_id}"

# FastAPI
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}
```

### 2. Requêtes HTTP

Gérer les différentes méthodes HTTP (GET, POST, PUT, DELETE).

```python
# Flask
@app.route('/api/users', methods=['GET', 'POST'])
def users():
    if request.method == 'POST':
        # Créer un utilisateur
        return create_user(request.json)
    else:
        # Lister les utilisateurs
        return get_all_users()

# FastAPI
@app.post("/api/users")
def create_user(user: User):
    # Créer un utilisateur
    return {"message": "User created"}

@app.get("/api/users")
def get_users():
    # Lister les utilisateurs
    return {"users": []}
```

### 3. Templates et rendu

Pour les applications web, utiliser des templates pour générer du HTML.

```python
# Flask
from flask import render_template

@app.route('/')
def index():
    return render_template('index.html', title="Accueil")

# Template Jinja2 (index.html)
# <h1>{{ title }}</h1>
```

### 4. Gestion des données

Utiliser des bases de données pour stocker les informations.

```python
# Exemple avec SQLite
import sqlite3

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE
        )
    ''')
    conn.commit()
    conn.close()
```

## Bonnes pratiques

### 1. Structure de projet

```python
# ✅ BON : Structure organisée
mon_app/
├── app/
│   ├── __init__.py
│   ├── routes.py
│   ├── models.py
│   └── config.py
├── tests/
├── requirements.txt
└── README.md

# ❌ MAUVAIS : Tout dans un fichier
mon_app.py  # 1000+ lignes
```

### 2. Configuration

```python
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key'
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    DEBUG = os.environ.get('FLASK_ENV') == 'development'

# Utilisation
app.config.from_object(Config)
```

### 3. Gestion des erreurs

```python
# Flask
@app.errorhandler(404)
def not_found(error):
    return {"error": "Not found"}, 404

@app.errorhandler(500)
def internal_error(error):
    return {"error": "Internal server error"}, 500

# FastAPI
from fastapi import HTTPException

@app.get("/users/{user_id}")
def get_user(user_id: int):
    user = find_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

### 4. Validation des données

```python
# FastAPI avec Pydantic
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: int

@app.post("/users")
def create_user(user: UserCreate):
    # Les données sont automatiquement validées
    return {"message": f"User {user.name} created"}
```

## Outils de développement

### 1. Gestion des dépendances

```bash
# Créer un environnement virtuel
python -m venv venv

# Activer
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 2. Tests

```python
# tests/test_app.py
import unittest
from app import app

class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
    
    def test_index(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
```

### 3. Débogage

```python
# Mode debug
if __name__ == '__main__':
    app.run(debug=True)  # Flask
    # uvicorn.run(app, reload=True)  # FastAPI
```

## Déploiement

### Applications web

**Options de déploiement :**
- **Heroku** : Simple, gratuit pour débuter
- **Railway** : Moderne, bon pour les APIs
- **AWS/GCP/Azure** : Pour la production
- **Docker** : Conteneurisation

### Exemple avec Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Cas d'usage

### 1. API REST pour une application mobile

```python
# FastAPI
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Task(BaseModel):
    title: str
    completed: bool = False

tasks = []

@app.post("/tasks")
def create_task(task: Task):
    tasks.append(task)
    return task

@app.get("/tasks")
def get_tasks():
    return {"tasks": tasks}
```

### 2. Application web avec authentification

```python
# Flask avec Flask-Login
from flask_login import LoginManager, login_user, logout_user

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/login', methods=['POST'])
def login():
    user = authenticate(request.form['username'], request.form['password'])
    if user:
        login_user(user)
        return redirect('/dashboard')
    return "Invalid credentials", 401
```

### 3. Application desktop simple

```python
# Tkinter
import tkinter as tk

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("Mon Application")
        
        self.label = tk.Label(root, text="Bonjour !")
        self.label.pack()
        
        self.button = tk.Button(root, text="Cliquer", command=self.on_click)
        self.button.pack()
    
    def on_click(self):
        self.label.config(text="Bouton cliqué !")

root = tk.Tk()
app = App(root)
root.mainloop()
```

## Structure de cette formation

Cette section est organisée en plusieurs modules :

1. **Applications Web** : Flask et FastAPI
2. **Applications Desktop** : Tkinter et PyQt
3. **Applications Mobiles** : Kivy et BeeWare
4. **Jeux 2D** : Pygame et Arcade
5. **Exercices et Projets** : Mise en pratique

## Prérequis

Avant de commencer, assurez-vous de maîtriser :

- ✅ **Python de base** : Variables, fonctions, classes
- ✅ **Modules et packages** : Import, organisation du code
- ✅ **Gestion des fichiers** : Lire/écrire des fichiers
- ✅ **Bases de données** : Concepts de base (optionnel)

## Installation des outils

```bash
# Applications web
pip install flask fastapi uvicorn

# Applications desktop
# Tkinter est inclus avec Python
pip install PyQt5

# Applications mobiles
pip install kivy

# Jeux
pip install pygame arcade
```

## Ressources supplémentaires

- **Flask Documentation** : https://flask.palletsprojects.com
- **FastAPI Documentation** : https://fastapi.tiangolo.com
- **PyQt Documentation** : https://www.riverbankcomputing.com/static/Docs/PyQt5
- **Pygame Documentation** : https://www.pygame.org/docs

## Prochaines étapes

1. Commencez par **"API REST avec FastAPI"** pour créer des APIs modernes
2. Explorez **"Applications Web avec Flask"** pour des sites complets
3. Découvrez **"Applications Desktop"** pour des interfaces graphiques
4. Apprenez **"Applications Mobiles"** pour iOS et Android
5. Créez des **"Jeux 2D"** avec Pygame

Bonne chance dans le développement d'applications Python ! 🚀
