---
title: "API REST avec FastAPI"
order: 1
parent: "30-applications-python.md"
tags: ["python", "web", "api", "fastapi", "rest"]
---

# API REST avec FastAPI

## Introduction

FastAPI est un framework web moderne et rapide pour construire des APIs REST avec Python. Il est basé sur les standards modernes (OpenAPI, JSON Schema) et offre des performances excellentes.

## Pourquoi FastAPI ?

- **Performance** : Aussi rapide que Node.js et Go
- **Documentation automatique** : Swagger UI intégré
- **Validation automatique** : Basé sur Pydantic
- **Type hints** : Support natif des annotations de type
- **Asynchrone** : Support natif de async/await

## Installation

```bash
pip install fastapi uvicorn
```

## Premier exemple

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

# Lancer le serveur
# uvicorn main:app --reload
```

## Types de routes

### GET - Récupérer des données

```python
@app.get("/users")
def get_users():
    return {"users": ["Alice", "Bob", "Charlie"]}

@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id, "name": "Alice"}
```

### POST - Créer des données

```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str

@app.post("/users")
def create_user(user: UserCreate):
    # Traiter la création
    return {"message": f"User {user.name} created", "user": user}
```

### PUT - Mettre à jour

```python
class UserUpdate(BaseModel):
    name: str = None
    email: str = None

@app.put("/users/{user_id}")
def update_user(user_id: int, user: UserUpdate):
    return {"message": f"User {user_id} updated", "user": user}
```

### DELETE - Supprimer

```python
@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    return {"message": f"User {user_id} deleted"}
```

## Modèles Pydantic

Pydantic permet la validation automatique des données.

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(..., ge=0, le=120)
    created_at: datetime = datetime.now()

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True
```

## Exemple complet : API de gestion de tâches

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="API de Gestion de Tâches")

# Modèle de données
class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = datetime.now()

# Base de données en mémoire (remplacer par une vraie DB en production)
tasks_db = []
next_id = 1

# Routes

@app.get("/")
def root():
    return {"message": "API de Gestion de Tâches"}

@app.get("/tasks", response_model=List[Task])
def get_tasks(completed: Optional[bool] = None):
    """Récupère toutes les tâches, optionnellement filtrées par statut"""
    if completed is not None:
        return [task for task in tasks_db if task.completed == completed]
    return tasks_db

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int):
    """Récupère une tâche par son ID"""
    task = next((t for t in tasks_db if t.id == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task: Task):
    """Crée une nouvelle tâche"""
    global next_id
    task.id = next_id
    next_id += 1
    tasks_db.append(task)
    return task

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: Task):
    """Met à jour une tâche"""
    task = next((t for t in tasks_db if t.id == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.title = task_update.title
    task.description = task_update.description
    task.completed = task_update.completed
    return task

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    """Supprime une tâche"""
    global tasks_db
    task = next((t for t in tasks_db if t.id == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    tasks_db = [t for t in tasks_db if t.id != task_id]
    return None
```

## Requêtes avec paramètres

### Query parameters

```python
@app.get("/items")
def get_items(skip: int = 0, limit: int = 10, search: Optional[str] = None):
    """Récupère des items avec pagination et recherche"""
    items = ["item1", "item2", "item3"]
    
    if search:
        items = [item for item in items if search.lower() in item.lower()]
    
    return {
        "items": items[skip:skip+limit],
        "total": len(items),
        "skip": skip,
        "limit": limit
    }

# Utilisation: GET /items?skip=0&limit=5&search=item
```

### Path parameters

```python
@app.get("/users/{user_id}/posts/{post_id}")
def get_user_post(user_id: int, post_id: int):
    return {"user_id": user_id, "post_id": post_id}
```

## Validation et erreurs

### Validation automatique

FastAPI valide automatiquement les types :

```python
@app.get("/items/{item_id}")
def get_item(item_id: int):  # item_id doit être un int
    return {"item_id": item_id}

# GET /items/abc → Erreur 422 (validation error)
# GET /items/123 → OK
```

### Gestion des erreurs

```python
from fastapi import HTTPException, status

@app.get("/users/{user_id}")
def get_user(user_id: int):
    user = find_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found"
        )
    return user

# Erreurs personnalisées
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"message": str(exc)}
    )
```

## Documentation automatique

FastAPI génère automatiquement la documentation :

- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc
- **OpenAPI JSON** : http://localhost:8000/openapi.json

### Personnaliser la documentation

```python
app = FastAPI(
    title="Mon API",
    description="Description de mon API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

@app.get("/items", summary="Récupère les items", tags=["items"])
def get_items():
    """
    Récupère tous les items disponibles.
    
    - **skip**: Nombre d'items à sauter
    - **limit**: Nombre maximum d'items à retourner
    """
    return {"items": []}
```

## Support asynchrone

FastAPI supporte nativement async/await :

```python
import asyncio
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    await asyncio.sleep(1)  # Opération asynchrone
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    # Peut appeler des fonctions async
    data = await fetch_data_from_db(item_id)
    return {"item_id": item_id, "data": data}
```

## Intégration avec bases de données

### SQLite avec SQLAlchemy

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

## Authentification

### JWT (JSON Web Tokens)

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

@app.get("/users/me")
def read_users_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}
```

## CORS (Cross-Origin Resource Sharing)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Tests

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_create_task():
    response = client.post("/tasks", json={
        "title": "Test task",
        "description": "Test description"
    })
    assert response.status_code == 201
    assert response.json()["title"] == "Test task"
```

## Déploiement

### Avec Uvicorn

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Avec Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Bonnes pratiques

### ✅ À faire

- Utiliser Pydantic pour la validation
- Documenter les endpoints
- Gérer les erreurs proprement
- Utiliser async pour les opérations I/O
- Structurer le code en modules

### ❌ À éviter

- Ignorer la validation des données
- Ne pas documenter les APIs
- Gérer les erreurs de manière générique
- Bloquer avec des opérations synchrones
- Tout mettre dans un seul fichier

## Ressources

- **Documentation officielle** : https://fastapi.tiangolo.com
- **Tutoriel** : https://fastapi.tiangolo.com/tutorial
- **Exemples** : https://github.com/tiangolo/fastapi/tree/master/docs_src
