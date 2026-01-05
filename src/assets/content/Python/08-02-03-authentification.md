---
title: "Authentification"
order: 8.02.03
parent: "08-02-apis-services.md"
tags: ["python", "authentification", "securite", "jwt"]
---

# Authentification

Sécuriser vos APIs avec une authentification appropriée est essentiel pour protéger les données et les ressources. Python offre plusieurs méthodes pour implémenter l'authentification.

## Concepts de base

**Authentification** est le processus de vérification de l'identité d'un utilisateur. Dans le contexte des APIs, cela signifie vérifier que le client qui fait une requête est bien celui qu'il prétend être.

### Types d'authentification

- **Basic Auth** : Nom d'utilisateur/mot de passe en base64
- **Token-based** : JWT, OAuth2 tokens
- **API Keys** : Clés secrètes pour l'accès
- **OAuth2** : Délégation d'autorisation

## Méthodes d'authentification

### Basic Authentication

```python
from flask import Flask, request, jsonify
from functools import wraps
import base64

app = Flask(__name__)

# Base de données simple (en production, utiliser une vraie DB)
users = {
    'alice': 'password123',
    'bob': 'secret456'
}

def check_auth(username, password):
    """Vérifie les credentials."""
    return users.get(username) == password

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/protected')
@requires_auth
def protected():
    return jsonify({'message': 'Accès autorisé'})
```

### API Keys

```python
from flask import Flask, request, jsonify
from functools import wraps

app = Flask(__name__)

API_KEYS = {
    'sk_live_abc123': {'user_id': 1, 'permissions': ['read', 'write']},
    'sk_live_xyz789': {'user_id': 2, 'permissions': ['read']}
}

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key not in API_KEYS:
            return jsonify({'error': 'Invalid API key'}), 401
        
        request.api_key_info = API_KEYS[api_key]
        return f(*args, **kwargs)
    return decorated

@app.route('/api/data')
@require_api_key
def get_data():
    user_id = request.api_key_info['user_id']
    return jsonify({'user_id': user_id, 'data': '...'})
```

## JWT (JSON Web Tokens)

### Concepts JWT

Un JWT est composé de trois parties :
- **Header** : Type de token et algorithme
- **Payload** : Données (claims)
- **Signature** : Vérification de l'intégrité

### Installation

```bash
pip install pyjwt
# ou
pip install python-jose[cryptography]  # Pour FastAPI
```

### Création et vérification de tokens

```python
import jwt
import datetime
from functools import wraps
from flask import Flask, request, jsonify

app = Flask(__name__)
SECRET_KEY = 'your-secret-key'

def create_token(user_id, username):
    """Crée un JWT token."""
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    """Vérifie un JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_jwt(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Token missing'}), 401
        
        token = token.split(' ')[1]
        payload = verify_token(token)
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        request.user_id = payload['user_id']
        return f(*args, **kwargs)
    return decorated

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    # Vérifier les credentials (simplifié)
    if username == 'alice' and password == 'password':
        token = create_token(user_id=1, username=username)
        return jsonify({'token': token})
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/protected')
@require_jwt
def protected():
    return jsonify({'user_id': request.user_id, 'message': 'Accès autorisé'})
```

### JWT avec FastAPI

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta

app = FastAPI()

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Vérifier les credentials
    if form_data.username != "alice" or form_data.password != "password":
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}
```

## OAuth2

### OAuth2 avec FastAPI

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    username: str
    email: str
    full_name: str

def fake_decode_token(token):
    return User(
        username=token + "fakedecoded",
        email="user@example.com",
        full_name="John Doe"
    )

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
```

## Implémentation pratique

### Exemple complet avec Flask

```python
from flask import Flask, request, jsonify
from functools import wraps
import jwt
import datetime
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'

# Base de données simplifiée
users_db = {
    'alice': {
        'password_hash': generate_password_hash('password123'),
        'user_id': 1
    }
}

def create_token(user_id, username):
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Token missing'}), 401
        
        token = token.split(' ')[1]
        payload = verify_token(token)
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        request.user_id = payload['user_id']
        request.username = payload['username']
        return f(*args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username in users_db:
        return jsonify({'error': 'Username already exists'}), 400
    
    users_db[username] = {
        'password_hash': generate_password_hash(password),
        'user_id': len(users_db) + 1
    }
    
    return jsonify({'message': 'User created'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username not in users_db:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not check_password_hash(users_db[username]['password_hash'], password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = create_token(users_db[username]['user_id'], username)
    return jsonify({'token': token, 'token_type': 'Bearer'})

@app.route('/protected')
@require_auth
def protected():
    return jsonify({
        'user_id': request.user_id,
        'username': request.username,
        'message': 'Accès autorisé'
    })
```

## Bonnes pratiques de sécurité

### 1. Utilisez HTTPS en production

```python
# ✅ Toujours utiliser HTTPS en production
# Les tokens JWT doivent être transmis sur HTTPS uniquement
```

### 2. Stockez les mots de passe de manière sécurisée

```python
# ✅ Utiliser des hashs (bcrypt, argon2)
from werkzeug.security import generate_password_hash, check_password_hash

password_hash = generate_password_hash('password')
check_password_hash(password_hash, 'password')  # True
```

### 3. Expiration des tokens

```python
# ✅ Tokens avec expiration
payload = {
    'user_id': 1,
    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Court
}
```

### 4. Refresh tokens

```python
# ✅ Utiliser refresh tokens pour les sessions longues
def create_refresh_token(user_id):
    payload = {
        'user_id': user_id,
        'type': 'refresh',
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')
```

### 5. Rate limiting

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    # ...
```

### 6. Validation des entrées

```python
# ✅ Toujours valider les entrées
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post('/login')
def login(request: LoginRequest):
    # Validation automatique
    pass
```

## Points clés à retenir

- ✅ **Authentification** : Vérifier l'identité de l'utilisateur
- ✅ **JWT** : Tokens stateless et scalables
- ✅ **OAuth2** : Standard pour la délégation d'autorisation
- ✅ **Sécurité** : HTTPS, hashs de mots de passe, expiration
- ✅ **Rate limiting** : Protéger contre les attaques
- ✅ **Validation** : Toujours valider les entrées
- ✅ Parfait pour sécuriser les **APIs modernes**

L'authentification est essentielle pour protéger vos APIs. Choisissez la méthode appropriée selon vos besoins : JWT pour les APIs stateless, OAuth2 pour la délégation, ou API keys pour les services.
