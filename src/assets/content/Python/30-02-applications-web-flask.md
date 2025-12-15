---
title: "Applications Web avec Flask"
order: 2
parent: "30-applications-python.md"
tags: ["python", "web", "flask", "applications"]
---

# Applications Web avec Flask

## Introduction

Flask est un micro-framework web Python léger et flexible. Il est simple à apprendre mais extensible pour créer des applications complexes.

## Pourquoi Flask ?

- **Simple** : Courbe d'apprentissage douce
- **Flexible** : Choisissez vos outils
- **Léger** : Minimaliste par défaut
- **Extensible** : Nombreuses extensions disponibles
- **Bien documenté** : Excellente documentation

## Installation

```bash
pip install flask
```

## Premier exemple

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return '<h1>Hello World!</h1>'

if __name__ == '__main__':
    app.run(debug=True)
```

## Routes de base

### Routes simples

```python
@app.route('/')
def index():
    return 'Page d\'accueil'

@app.route('/about')
def about():
    return 'À propos'
```

### Routes avec paramètres

```python
@app.route('/user/<username>')
def show_user(username):
    return f'User: {username}'

@app.route('/post/<int:post_id>')
def show_post(post_id):
    return f'Post ID: {post_id}'
```

### Méthodes HTTP

```python
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Traiter le formulaire
        return 'Connexion réussie'
    else:
        # Afficher le formulaire
        return render_template('login.html')
```

## Templates Jinja2

Flask utilise Jinja2 pour les templates.

### Structure de base

```python
from flask import render_template

@app.route('/')
def index():
    return render_template('index.html', title='Accueil')
```

### Template avec variables

```html
<!-- templates/index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
</head>
<body>
    <h1>Bienvenue, {{ username }}!</h1>
    {% if items %}
        <ul>
        {% for item in items %}
            <li>{{ item }}</li>
        {% endfor %}
        </ul>
    {% endif %}
</body>
</html>
```

### Héritage de templates

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}{% endblock %}</title>
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>

<!-- templates/index.html -->
{% extends "base.html" %}

{% block title %}Accueil{% endblock %}

{% block content %}
    <h1>Bienvenue!</h1>
{% endblock %}
```

## Gestion des formulaires

### Formulaire simple

```python
from flask import Flask, render_template, request, redirect, url_for

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']
        
        # Traiter le formulaire
        # Envoyer un email, sauvegarder en DB, etc.
        
        return redirect(url_for('thank_you'))
    
    return render_template('contact.html')
```

### Avec Flask-WTF (recommandé)

```python
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Email

class ContactForm(FlaskForm):
    name = StringField('Nom', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    message = TextAreaField('Message', validators=[DataRequired()])
    submit = SubmitField('Envoyer')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    form = ContactForm()
    if form.validate_on_submit():
        # Traiter le formulaire
        return redirect(url_for('thank_you'))
    return render_template('contact.html', form=form)
```

## Sessions et cookies

### Sessions

```python
from flask import session

app.secret_key = 'your-secret-key'

@app.route('/login', methods=['POST'])
def login():
    # Vérifier les credentials
    session['username'] = request.form['username']
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    return f'Bienvenue, {session["username"]}!'

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))
```

### Cookies

```python
from flask import make_response

@app.route('/set-cookie')
def set_cookie():
    resp = make_response('Cookie défini')
    resp.set_cookie('username', 'alice', max_age=60*60*24*365)
    return resp

@app.route('/get-cookie')
def get_cookie():
    username = request.cookies.get('username')
    return f'Username: {username}'
```

## Bases de données

### SQLite avec SQLAlchemy

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URL'] = 'sqlite:///app.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    def __repr__(self):
        return f'<User {self.username}>'

# Créer les tables
with app.app_context():
    db.create_all()

# Utilisation
@app.route('/users')
def get_users():
    users = User.query.all()
    return render_template('users.html', users=users)
```

## Exemple complet : Application de blog

```python
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URL'] = 'sqlite:///blog.db'
db = SQLAlchemy(app)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Post {self.title}>'

@app.route('/')
def index():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return render_template('index.html', posts=posts)

@app.route('/post/<int:post_id>')
def show_post(post_id):
    post = Post.query.get_or_404(post_id)
    return render_template('post.html', post=post)

@app.route('/create', methods=['GET', 'POST'])
def create_post():
    if request.method == 'POST':
        post = Post(
            title=request.form['title'],
            content=request.form['content']
        )
        db.session.add(post)
        db.session.commit()
        flash('Article créé avec succès!')
        return redirect(url_for('index'))
    return render_template('create.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
```

## Gestion des erreurs

```python
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500.html'), 500
```

## Blueprints (Organisation)

Pour les grandes applications, utilisez des Blueprints :

```python
# app/__init__.py
from flask import Flask

def create_app():
    app = Flask(__name__)
    
    from app.routes import main
    app.register_blueprint(main)
    
    return app

# app/routes.py
from flask import Blueprint

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return 'Hello World'

# run.py
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
```

## Fichiers statiques

```python
# Structure
app/
├── static/
│   ├── css/
│   ├── js/
│   └── images/
└── templates/

# Dans les templates
<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
<script src="{{ url_for('static', filename='js/app.js') }}"></script>
```

## Authentification avec Flask-Login

```python
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password_hash = db.Column(db.String(120))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and check_password_hash(user.password_hash, request.form['password']):
            login_user(user)
            return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return 'Dashboard protégé'
```

## API REST avec Flask

```python
from flask import jsonify

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'username': u.username,
        'email': u.email
    } for u in users])

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    })
```

## Tests

```python
import unittest
from app import app, db

class TestApp(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URL'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        db.create_all()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()
    
    def test_index(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
    
    def test_create_post(self):
        response = self.app.post('/create', data={
            'title': 'Test',
            'content': 'Test content'
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
```

## Déploiement

### Avec Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Avec Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
```

## Bonnes pratiques

### ✅ À faire

- Utiliser des Blueprints pour organiser
- Valider les données des formulaires
- Utiliser des variables d'environnement pour la config
- Structurer le projet proprement
- Gérer les erreurs

### ❌ À éviter

- Tout mettre dans un fichier
- Ne pas valider les entrées
- Hardcoder les secrets
- Ignorer la gestion d'erreurs
- Ne pas utiliser de templates

## Ressources

- **Documentation** : https://flask.palletsprojects.com
- **Tutoriel** : https://flask.palletsprojects.com/tutorial
- **Extensions** : https://flask.palletsprojects.com/extensions
