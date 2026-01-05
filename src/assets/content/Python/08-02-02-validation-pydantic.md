---
title: "Validation (Pydantic)"
order: 8.02.02
parent: "08-02-apis-services.md"
tags: ["python", "pydantic", "validation", "schemas"]
---

# Validation (Pydantic)

Pydantic permet de valider les données en utilisant les annotations de type Python, garantissant la cohérence des données et réduisant les erreurs à l'exécution.

## Concepts de base

**Pydantic** est une bibliothèque qui utilise les annotations de type Python pour valider les données. Elle est particulièrement utile pour :
- Validation de données d'entrée (APIs, formulaires)
- Configuration d'applications
- Sérialisation/désérialisation
- Documentation automatique

### Avantages de Pydantic

- **Type hints** : Utilise les annotations Python standard
- **Validation automatique** : Valide les types et contraintes
- **Erreurs claires** : Messages d'erreur détaillés
- **Performance** : Validations rapides (écrit en Rust)
- **JSON Schema** : Génération automatique de schémas

## Modèles Pydantic

### Modèle de base

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
    email: str

# Créer une instance
user = User(name="Alice", age=30, email="alice@example.com")
print(user.name)  # "Alice"

# Validation automatique
try:
    user = User(name="Alice", age="30")  # ❌ Erreur : age doit être int
except ValidationError as e:
    print(e)
```

### Types de base

```python
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class Product(BaseModel):
    name: str
    price: float
    in_stock: bool
    tags: List[str]
    metadata: Dict[str, str]
    created_at: datetime
    description: Optional[str] = None  # Optionnel avec valeur par défaut
```

### Validation avec contraintes

```python
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class User(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=150)  # ge = >=, le = <=
    email: EmailStr  # Validation d'email automatique
    password: str = Field(..., min_length=8)
    website: Optional[str] = Field(None, regex=r'^https?://.*')
```

### Validateurs personnalisés

```python
from pydantic import BaseModel, validator
from typing import List

class User(BaseModel):
    name: str
    age: int
    email: str
    
    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Email invalide')
        return v.lower()
    
    @validator('age')
    def validate_age(cls, v):
        if v < 18:
            raise ValueError('Doit être majeur')
        return v
```

## Validation automatique

### Validation à la création

```python
from pydantic import BaseModel, ValidationError

class User(BaseModel):
    name: str
    age: int

# ✅ Validation réussie
user = User(name="Alice", age=30)

# ❌ Validation échouée
try:
    user = User(name="Alice", age="not-a-number")
except ValidationError as e:
    print(e.json())
    # [
    #   {
    #     "loc": ["age"],
    #     "msg": "value is not a valid integer",
    #     "type": "type_error.integer"
    #   }
    # ]
```

### Validation avec parse_obj

```python
# Valider depuis un dictionnaire
data = {"name": "Alice", "age": 30}
user = User.parse_obj(data)

# Valider depuis un JSON
json_data = '{"name": "Alice", "age": 30}'
user = User.parse_raw(json_data)
```

### Validation partielle

```python
from pydantic import BaseModel, ValidationError

class User(BaseModel):
    name: str
    age: int
    email: str

# Validation partielle (champs optionnels)
class UserPartial(BaseModel):
    name: str = None
    age: int = None
    email: str = None

# Ou utiliser construct()
user = User.construct(name="Alice", age=30)  # Ignore la validation
```

## Types et contraintes

### Types numériques avec contraintes

```python
from pydantic import BaseModel, Field

class Product(BaseModel):
    price: float = Field(..., gt=0)  # Strictement supérieur à 0
    discount: float = Field(0, ge=0, le=1)  # Entre 0 et 1
    quantity: int = Field(..., ge=1)  # Au moins 1
```

### Types de chaînes avec contraintes

```python
from pydantic import BaseModel, Field, EmailStr, HttpUrl

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=20, regex=r'^[a-zA-Z0-9_]+$')
    email: EmailStr
    website: HttpUrl
    bio: str = Field(None, max_length=500)
```

### Types de collection

```python
from pydantic import BaseModel
from typing import List, Set, Dict, Optional

class Order(BaseModel):
    items: List[str]  # Liste de chaînes
    tags: Set[str]  # Ensemble unique
    metadata: Dict[str, str]  # Dictionnaire
    notes: Optional[List[str]] = None  # Liste optionnelle
```

### Types de date/heure

```python
from pydantic import BaseModel
from datetime import datetime, date, time

class Event(BaseModel):
    name: str
    start_date: date
    start_time: time
    created_at: datetime
```

## Intégration avec FastAPI

### Utilisation dans FastAPI

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserCreate(BaseModel):
    name: str
    email: str
    age: int

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    age: int

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate):
    # user est automatiquement validé
    # Si invalide, FastAPI retourne 422 avec les erreurs
    return {
        "id": 1,
        **user.dict()
    }
```

### Validation des paramètres de requête

```python
from fastapi import FastAPI, Query
from pydantic import BaseModel

app = FastAPI()

@app.get("/users")
def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(None, min_length=1, max_length=50)
):
    return {"page": page, "limit": limit, "search": search}
```

### Validation des paramètres de chemin

```python
from fastapi import FastAPI, Path

app = FastAPI()

@app.get("/users/{user_id}")
def get_user(
    user_id: int = Path(..., ge=1, description="ID de l'utilisateur")
):
    return {"user_id": user_id}
```

## Modèles avancés

### Modèles imbriqués

```python
from pydantic import BaseModel
from typing import List

class Address(BaseModel):
    street: str
    city: str
    zip_code: str

class User(BaseModel):
    name: str
    email: str
    address: Address
    addresses: List[Address]  # Liste d'adresses
```

### Héritage de modèles

```python
from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
```

### Modèles avec Config

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: str
    
    class Config:
        # Permettre les noms de champs avec underscore
        allow_population_by_field_name = True
        # Exemple de valeur
        schema_extra = {
            "example": {
                "name": "Alice",
                "email": "alice@example.com"
            }
        }
```

### Modèles avec alias

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str = Field(..., alias="full_name")
    age: int = Field(..., alias="user_age")
    
    class Config:
        allow_population_by_field_name = True

# Utilisation
user = User(full_name="Alice", user_age=30)
print(user.name)  # "Alice"
```

## Exemples pratiques

### Exemple 1 : Validation d'API

```python
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Les mots de passe ne correspondent pas')
        return v

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    
    class Config:
        orm_mode = True  # Pour utiliser avec SQLAlchemy
```

### Exemple 2 : Configuration d'application

```python
from pydantic import BaseModel, Field
from typing import Optional

class DatabaseConfig(BaseModel):
    host: str
    port: int = Field(5432, ge=1, le=65535)
    database: str
    username: str
    password: str
    pool_size: int = Field(10, ge=1)

class AppConfig(BaseModel):
    debug: bool = False
    secret_key: str
    database: DatabaseConfig
    redis_url: Optional[str] = None

# Utilisation
config = AppConfig(
    debug=True,
    secret_key="secret",
    database={
        "host": "localhost",
        "database": "mydb",
        "username": "user",
        "password": "pass"
    }
)
```

### Exemple 3 : Validation de formulaire

```python
from pydantic import BaseModel, validator
from typing import List

class ProductForm(BaseModel):
    name: str
    price: float
    category: str
    tags: List[str]
    stock: int
    
    @validator('price')
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError('Le prix doit être positif')
        return round(v, 2)
    
    @validator('stock')
    def validate_stock(cls, v):
        if v < 0:
            raise ValueError('Le stock ne peut pas être négatif')
        return v
```

## Bonnes pratiques

### 1. Utilisez des modèles séparés pour créer et répondre

```python
# ✅ Bon
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    # Pas de password dans la réponse
```

### 2. Utilisez Field pour les contraintes

```python
# ✅ Bon
age: int = Field(..., ge=0, le=150)

# ❌ Éviter
age: int  # Pas de validation
```

### 3. Validez tôt

```python
# ✅ Bon : Validation à l'entrée
@app.post("/users")
def create_user(user: UserCreate):  # Validé automatiquement
    return create_user_in_db(user)
```

### 4. Messages d'erreur personnalisés

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    age: int = Field(..., ge=18, description="L'utilisateur doit être majeur")
```

## Points clés à retenir

- ✅ Pydantic utilise les **type hints Python**
- ✅ **Validation automatique** des types et contraintes
- ✅ **Messages d'erreur clairs** et détaillés
- ✅ **Performance** élevée (écrit en Rust)
- ✅ **Intégration native** avec FastAPI
- ✅ **JSON Schema** automatique
- ✅ Parfait pour la **validation de données** dans les APIs

Pydantic est devenu le standard pour la validation de données en Python, particulièrement avec FastAPI. Il combine la simplicité des annotations Python avec une validation robuste et performante.
