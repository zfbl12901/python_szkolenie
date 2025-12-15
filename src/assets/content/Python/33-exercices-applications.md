---
title: "Exercices et Projets - Applications"
order: 33
parent: null
tags: ["python", "exercices", "applications", "web", "mobile", "games"]
---

# Exercices et Projets - Applications

## Préparation

Installez les dépendances nécessaires :

```bash
pip install flask fastapi uvicorn pygame kivy
```

## Exercices Applications Web

### Exercice 1 : API REST simple avec FastAPI

**Objectif** : Créer une API REST pour gérer une liste de produits.

**Instructions** :
1. Créez une API avec les endpoints suivants :
   - `GET /products` : Liste tous les produits
   - `GET /products/{id}` : Récupère un produit
   - `POST /products` : Crée un produit
   - `PUT /products/{id}` : Met à jour un produit
   - `DELETE /products/{id}` : Supprime un produit

2. Utilisez Pydantic pour valider les données

**Solution de base** :

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class Product(BaseModel):
    id: Optional[int] = None
    name: str
    price: float
    description: Optional[str] = None

products_db = []
next_id = 1

@app.get("/products", response_model=List[Product])
def get_products():
    return products_db

@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int):
    product = next((p for p in products_db if p.id == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/products", response_model=Product, status_code=201)
def create_product(product: Product):
    global next_id
    product.id = next_id
    next_id += 1
    products_db.append(product)
    return product

@app.put("/products/{product_id}", response_model=Product)
def update_product(product_id: int, product_update: Product):
    product = next((p for p in products_db if p.id == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.name = product_update.name
    product.price = product_update.price
    product.description = product_update.description
    return product

@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int):
    global products_db
    product = next((p for p in products_db if p.id == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    products_db = [p for p in products_db if p.id != product_id]
    return None
```

**Améliorations à ajouter** :
- Ajouter une base de données (SQLite)
- Ajouter la pagination
- Ajouter la recherche par nom
- Ajouter l'authentification

### Exercice 2 : Application Flask avec base de données

**Objectif** : Créer une application Flask avec SQLite pour gérer des notes.

**Instructions** :
1. Créez une application Flask
2. Utilisez SQLAlchemy pour la base de données
3. Créez des routes pour :
   - Afficher toutes les notes
   - Créer une note
   - Modifier une note
   - Supprimer une note

**Solution de base** :

```python
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URL'] = 'sqlite:///notes.db'
db = SQLAlchemy(app)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/')
def index():
    notes = Note.query.order_by(Note.created_at.desc()).all()
    return render_template('index.html', notes=notes)

@app.route('/create', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        note = Note(
            title=request.form['title'],
            content=request.form['content']
        )
        db.session.add(note)
        db.session.commit()
        flash('Note créée avec succès!')
        return redirect(url_for('index'))
    return render_template('create.html')

@app.route('/edit/<int:note_id>', methods=['GET', 'POST'])
def edit(note_id):
    note = Note.query.get_or_404(note_id)
    if request.method == 'POST':
        note.title = request.form['title']
        note.content = request.form['content']
        db.session.commit()
        flash('Note modifiée avec succès!')
        return redirect(url_for('index'))
    return render_template('edit.html', note=note)

@app.route('/delete/<int:note_id>', methods=['POST'])
def delete(note_id):
    note = Note.query.get_or_404(note_id)
    db.session.delete(note)
    db.session.commit()
    flash('Note supprimée!')
    return redirect(url_for('index'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
```

### Exercice 3 : Authentification et sessions

**Objectif** : Ajouter un système d'authentification à l'application Flask.

**Instructions** :
1. Créez un modèle User
2. Implémentez l'inscription et la connexion
3. Protégez les routes avec `@login_required`
4. Utilisez Flask-Login pour gérer les sessions

**Solution de base** :

```python
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        user = User(
            username=request.form['username'],
            email=request.form['email'],
            password_hash=generate_password_hash(request.form['password'])
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return redirect(url_for('index'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and check_password_hash(user.password_hash, request.form['password']):
            login_user(user)
            return redirect(url_for('index'))
        flash('Identifiants invalides')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))
```

## Exercices Applications Mobiles

### Exercice 1 : Première app Kivy

**Objectif** : Créer une application Kivy simple avec plusieurs écrans.

**Instructions** :
1. Créez une application avec deux écrans
2. Ajoutez un bouton pour naviguer entre les écrans
3. Utilisez le KV Language pour l'interface

**Solution de base** :

```python
from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label

class HomeScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        layout = BoxLayout(orientation='vertical', padding=20)
        layout.add_widget(Label(text='Écran d\'accueil', font_size=24))
        btn = Button(text='Aller à l\'écran 2', size_hint_y=0.3)
        btn.bind(on_press=self.go_to_screen2)
        layout.add_widget(btn)
        self.add_widget(layout)
    
    def go_to_screen2(self, instance):
        self.manager.current = 'screen2'

class Screen2(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        layout = BoxLayout(orientation='vertical', padding=20)
        layout.add_widget(Label(text='Écran 2', font_size=24))
        btn = Button(text='Retour', size_hint_y=0.3)
        btn.bind(on_press=self.go_home)
        layout.add_widget(btn)
        self.add_widget(layout)
    
    def go_home(self, instance):
        self.manager.current = 'home'

class MyApp(App):
    def build(self):
        sm = ScreenManager()
        sm.add_widget(HomeScreen(name='home'))
        sm.add_widget(Screen2(name='screen2'))
        return sm

MyApp().run()
```

### Exercice 2 : Interface utilisateur mobile

**Objectif** : Créer une interface utilisateur complète avec formulaires.

**Instructions** :
1. Créez un formulaire de contact
2. Validez les entrées
3. Affichez un message de confirmation

## Exercices Jeux 2D

### Exercice 1 : Premier jeu avec Pygame

**Objectif** : Créer un jeu simple où un joueur évite des obstacles.

**Instructions** :
1. Créez un joueur qui peut se déplacer
2. Ajoutez des obstacles qui tombent
3. Détectez les collisions
4. Ajoutez un système de score

**Solution de base** :

```python
import pygame
import random
import sys

pygame.init()

WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Évite les obstacles")
clock = pygame.time.Clock()

# Couleurs
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)

# Joueur
player_size = 50
player_x = WIDTH // 2
player_y = HEIGHT - 100
player_speed = 5

# Obstacles
obstacles = []
obstacle_speed = 3
spawn_timer = 0

# Score
score = 0
font = pygame.font.Font(None, 36)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Contrôles
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] and player_x > 0:
        player_x -= player_speed
    if keys[pygame.K_RIGHT] and player_x < WIDTH - player_size:
        player_x += player_speed
    
    # Spawn d'obstacles
    spawn_timer += 1
    if spawn_timer >= 60:  # Toutes les secondes
        obstacles.append({
            'x': random.randint(0, WIDTH - 50),
            'y': 0,
            'size': 50
        })
        spawn_timer = 0
    
    # Mouvement des obstacles
    for obstacle in obstacles[:]:
        obstacle['y'] += obstacle_speed
        if obstacle['y'] > HEIGHT:
            obstacles.remove(obstacle)
            score += 1
    
    # Collisions
    for obstacle in obstacles:
        if (player_x < obstacle['x'] + obstacle['size'] and
            player_x + player_size > obstacle['x'] and
            player_y < obstacle['y'] + obstacle['size'] and
            player_y + player_size > obstacle['y']):
            running = False
    
    # Rendu
    screen.fill(BLACK)
    pygame.draw.rect(screen, GREEN, (player_x, player_y, player_size, player_size))
    for obstacle in obstacles:
        pygame.draw.rect(screen, RED, (obstacle['x'], obstacle['y'], obstacle['size'], obstacle['size']))
    
    score_text = font.render(f"Score: {score}", True, WHITE)
    screen.blit(score_text, (10, 10))
    
    pygame.display.flip()
    clock.tick(60)

# Game Over
game_over_text = font.render(f"Game Over! Score: {score}", True, WHITE)
screen.blit(game_over_text, (WIDTH // 2 - 150, HEIGHT // 2))
pygame.display.flip()
pygame.time.wait(2000)

pygame.quit()
sys.exit()
```

### Exercice 2 : Mécaniques de mouvement

**Objectif** : Implémenter un système de mouvement avec accélération et friction.

### Exercice 3 : Système de collisions

**Objectif** : Créer un système de collisions avancé avec différents types d'objets.

## Projets complets

### Projet 1 : Application web complète avec API

**Objectif** : Créer une application web complète avec frontend et backend.

**Fonctionnalités** :
- API REST avec FastAPI
- Interface web avec Flask
- Base de données SQLite
- Authentification
- CRUD complet

### Projet 2 : Application mobile fonctionnelle

**Objectif** : Créer une application mobile complète avec Kivy.

**Fonctionnalités** :
- Plusieurs écrans
- Stockage local des données
- Interface utilisateur moderne
- Gestion des erreurs

### Projet 3 : Jeu 2D complet avec menu et niveaux

**Objectif** : Créer un jeu 2D complet avec Pygame.

**Fonctionnalités** :
- Menu principal
- Plusieurs niveaux
- Système de sauvegarde
- Sons et musique
- Interface utilisateur

## Conseils pour les projets

1. **Commencez simple** : Implémentez d'abord les fonctionnalités de base
2. **Testez régulièrement** : Testez chaque fonctionnalité au fur et à mesure
3. **Organisez le code** : Utilisez des classes et modules
4. **Documentez** : Commentez votre code
5. **Itérez** : Améliorez progressivement

## Ressources supplémentaires

- **Flask** : https://flask.palletsprojects.com
- **FastAPI** : https://fastapi.tiangolo.com
- **Pygame** : https://www.pygame.org
- **Kivy** : https://kivy.org

Bon courage avec vos exercices ! 🚀
