---
title: "FastAPI"
order: 8.01.02
parent: "08-01-web-frameworks.md"
tags: ["python", "fastapi", "api", "async"]
---

# FastAPI

FastAPI est un framework moderne, rapide et basé sur les standards modernes pour construire des APIs avec Python. Il combine la simplicité de Flask avec la performance et les fonctionnalités modernes.

## Concepts de base

**FastAPI** est conçu pour être :
- **Rapide** : Performance comparable à Node.js et Go
- **Moderne** : Basé sur les standards Python 3.6+ (type hints, async/await)
- **Automatique** : Documentation interactive automatique
- **Type-safe** : Validation automatique avec Pydantic

### Philosophie FastAPI

- **Standards modernes** : OpenAPI, JSON Schema, OAuth2
- **Type hints** : Utilise les annotations de type Python
- **Async natif** : Support complet de `async/await`
- **Documentation automatique** : Swagger UI et ReDoc intégrés

## Installation et configuration

### Installation

```bash
# Installer FastAPI et un serveur ASGI
pip install fastapi uvicorn[standard]

# Ou avec Poetry
poetry add fastapi uvicorn[standard]
```

### Application minimale

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}
```

Exécution :

```bash
# Développement
uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

La documentation interactive est disponible à :
- Swagger UI : `http://127.0.0.1:8000/docs`
- ReDoc : `http://127.0.0.1:8000/redoc`

## Routes et endpoints

### Routes de base

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/items")
def create_item():
    return {"message": "Item created"}

@app.put("/items/{item_id}")
def update_item(item_id: int):
    return {"item_id": item_id, "message": "Updated"}

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    return {"message": "Deleted"}
```

### Paramètres de chemin

```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

# Types de paramètres
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}

@app.get("/files/{file_path:path}")
def read_file(file_path: str):
    return {"file_path": file_path}
```

### Paramètres de requête

```python
from typing import Optional

@app.get("/items/")
def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

@app.get("/users/{user_id}")
def get_user(
    user_id: int,
    q: Optional[str] = None,
    short: bool = False
):
    return {
        "user_id": user_id,
        "q": q,
        "short": short
    }
```

## Validation automatique avec Pydantic

### Modèles Pydantic

```python
from pydantic import BaseModel, EmailStr
from typing import Optional

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

class User(BaseModel):
    email: EmailStr
    full_name: str
    age: Optional[int] = None

@app.post("/items/")
def create_item(item: Item):
    return item

@app.post("/users/")
def create_user(user: User):
    return user
```

### Validation automatique

FastAPI valide automatiquement les données :

```python
# ✅ Requête valide
POST /items/
{
    "name": "Laptop",
    "price": 999.99,
    "tax": 0.2
}

# ❌ Requête invalide (retourne 422)
POST /items/
{
    "name": "Laptop",
    "price": "not-a-number"  # Erreur de validation
}
```

### Modèles imbriqués

```python
from typing import List

class Item(BaseModel):
    name: str
    price: float

class Order(BaseModel):
    user_id: int
    items: List[Item]
    total: float

@app.post("/orders/")
def create_order(order: Order):
    return order
```

## Documentation automatique

### Documentation interactive

FastAPI génère automatiquement :
- **Swagger UI** : `/docs` - Interface interactive
- **ReDoc** : `/redoc` - Documentation alternative
- **OpenAPI JSON** : `/openapi.json` - Schéma OpenAPI

### Personnaliser la documentation

```python
from fastapi import FastAPI

app = FastAPI(
    title="Mon API",
    description="Description de mon API",
    version="1.0.0",
    docs_url="/api-docs",  # Changer l'URL de Swagger
    redoc_url="/api-redoc"  # Changer l'URL de ReDoc
)
```

### Ajouter des descriptions

```python
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str = Field(..., description="Nom de l'article")
    price: float = Field(..., gt=0, description="Prix en euros")
    tax: Optional[float] = Field(None, ge=0, le=1, description="Taux de taxe")

@app.post(
    "/items/",
    response_model=Item,
    summary="Créer un article",
    description="Crée un nouvel article dans le système",
    response_description="L'article créé"
)
def create_item(item: Item):
    return item
```

## Performance et async

### Endpoints asynchrones

```python
import asyncio
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    await asyncio.sleep(0.1)  # Opération I/O simulée
    return {"Hello": "World"}

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    # Opération asynchrone (DB, API externe, etc.)
    data = await fetch_data_from_db(item_id)
    return {"item_id": item_id, "data": data}
```

### Mélanger sync et async

```python
# Endpoint synchrone (bloquant)
@app.get("/sync")
def sync_endpoint():
    return {"message": "Synchronous"}

# Endpoint asynchrone (non-bloquant)
@app.get("/async")
async def async_endpoint():
    return {"message": "Asynchronous"}
```

### Exemple avec requêtes HTTP asynchrones

```python
import httpx
from fastapi import FastAPI

app = FastAPI()

@app.get("/external-data")
async def get_external_data():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com/data")
        return response.json()
```

## Dépendances et injection

### Dépendances simples

```python
from fastapi import Depends, FastAPI

app = FastAPI()

def get_db():
    db = "database_connection"
    yield db
    # Cleanup après la requête

@app.get("/items/")
def read_items(db: str = Depends(get_db)):
    return {"db": db, "items": []}
```

### Dépendances avec paramètres

```python
from fastapi import Depends, FastAPI, Header

app = FastAPI()

def get_user_agent(user_agent: str = Header(...)):
    return user_agent

@app.get("/")
def read_root(ua: str = Depends(get_user_agent)):
    return {"user_agent": ua}
```

### Classes de dépendances

```python
from fastapi import Depends, FastAPI

app = FastAPI()

class Database:
    def __init__(self):
        self.connection = "connected"
    
    def query(self, sql: str):
        return f"Result of: {sql}"

def get_database():
    db = Database()
    yield db

@app.get("/items/")
def read_items(db: Database = Depends(get_database)):
    return {"result": db.query("SELECT * FROM items")}
```

## Gestion d'erreurs

### Exceptions personnalisées

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

items = {"foo": "The Foo Wrestlers"}

@app.get("/items/{item_id}")
def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(
            status_code=404,
            detail="Item not found",
            headers={"X-Error": "There goes my error"}
        )
    return {"item": items[item_id]}
```

### Gestionnaires d'erreurs personnalisés

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

class CustomException(Exception):
    def __init__(self, name: str):
        self.name = name

@app.exception_handler(CustomException)
async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=418,
        content={"message": f"Oops! {exc.name} did something."}
    )

@app.get("/custom-exception")
def read_custom():
    raise CustomException("Something")
```

## Sécurité et authentification

### OAuth2 avec Password

```python
from fastapi import Depends, FastAPI, HTTPException, status
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
            detail="Invalid authentication credentials"
        )
    return user

@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
```

## Cas d'usage

### Cas d'usage 1 : API REST complète

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class Item(BaseModel):
    id: Optional[int] = None
    name: str
    price: float
    description: Optional[str] = None

items_db = []
next_id = 1

@app.get("/items/", response_model=List[Item])
def list_items():
    return items_db

@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int):
    item = next((i for i in items_db if i.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.post("/items/", response_model=Item, status_code=201)
def create_item(item: Item):
    global next_id
    item.id = next_id
    next_id += 1
    items_db.append(item)
    return item

@app.put("/items/{item_id}", response_model=Item)
def update_item(item_id: int, item: Item):
    existing = next((i for i in items_db if i.id == item_id), None)
    if not existing:
        raise HTTPException(status_code=404, detail="Item not found")
    
    existing.name = item.name
    existing.price = item.price
    existing.description = item.description
    return existing

@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int):
    global items_db
    item = next((i for i in items_db if i.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    items_db = [i for i in items_db if i.id != item_id]
    return None
```

### Cas d'usage 2 : API avec base de données

```python
from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    name: str
    email: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True

@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

## Bonnes pratiques

### 1. Utilisez les type hints partout

```python
# ✅ Bon
@app.get("/items/{item_id}")
def get_item(item_id: int) -> dict:
    return {"item_id": item_id}

# ❌ Éviter
@app.get("/items/{item_id}")
def get_item(item_id):
    return {"item_id": item_id}
```

### 2. Utilisez Pydantic pour la validation

```python
# ✅ Bon : validation automatique
class Item(BaseModel):
    name: str
    price: float

@app.post("/items/")
def create_item(item: Item):
    return item
```

### 3. Organisez avec des routers

```python
# routers/items.py
from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def list_items():
    return []

# main.py
from fastapi import FastAPI
from routers import items

app = FastAPI()
app.include_router(items.router, prefix="/items", tags=["items"])
```

## Points clés à retenir

- ✅ FastAPI est **rapide** et **moderne**
- ✅ **Documentation automatique** (Swagger/ReDoc)
- ✅ **Validation automatique** avec Pydantic
- ✅ Support natif de **async/await**
- ✅ Basé sur les **type hints** Python
- ✅ **Standards modernes** : OpenAPI, OAuth2, etc.
- ✅ Parfait pour les **APIs modernes** et les microservices

FastAPI est le choix idéal pour développer des APIs modernes, performantes et bien documentées en Python. Sa simplicité et ses fonctionnalités automatiques en font un framework très productif.
