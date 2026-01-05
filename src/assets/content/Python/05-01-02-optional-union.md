---
title: "Optional, Union"
order: 5.01.02
parent: "05-01-typage-statique-optionnel.md"
tags: ["python", "optional", "union", "types"]
---

# Optional, Union

`Optional` et `Union` permettent de représenter des types qui peuvent avoir plusieurs formes ou être absents. Ce sont des outils essentiels pour modéliser la réalité du code où les valeurs peuvent être de types différents ou manquantes.

## Concepts de base

En Python, il est courant qu'une variable puisse :
- Avoir plusieurs types possibles (`Union`)
- Être absente ou None (`Optional`)

Ces types permettent de modéliser ces situations de manière explicite et vérifiable.

## Optional (type optionnel)

### Définition

`Optional[T]` est équivalent à `Union[T, None]`. Il indique qu'une valeur peut être de type `T` ou `None`.

```python
from typing import Optional

def trouver_index(liste: list[int], valeur: int) -> Optional[int]:
    """
    Trouve l'index d'une valeur dans une liste.
    
    Returns:
        L'index si trouvé, None sinon
    """
    try:
        return liste.index(valeur)
    except ValueError:
        return None

# Utilisation
nombres = [1, 2, 3, 4, 5]
index = trouver_index(nombres, 3)
if index is not None:
    print(f"Trouvé à l'index {index}")  # Trouvé à l'index 2
else:
    print("Non trouvé")
```

### Cas d'usage courants

#### 1. Valeurs par défaut None

```python
from typing import Optional

def creer_utilisateur(
    nom: str,
    email: Optional[str] = None
) -> dict[str, str]:
    """Crée un utilisateur avec email optionnel."""
    utilisateur = {"nom": nom}
    if email is not None:
        utilisateur["email"] = email
    return utilisateur

# Utilisation
user1 = creer_utilisateur("Alice")  # email=None
user2 = creer_utilisateur("Bob", "bob@example.com")  # email fourni
```

#### 2. Retour optionnel

```python
from typing import Optional

def obtenir_config(cle: str) -> Optional[str]:
    """Récupère une configuration, peut retourner None."""
    config = {"host": "localhost", "port": "8000"}
    return config.get(cle)

# Utilisation
host = obtenir_config("host")
if host:
    print(f"Host: {host}")
```

#### 3. Attributs optionnels

```python
from typing import Optional

class Personne:
    def __init__(
        self,
        nom: str,
        age: Optional[int] = None,
        email: Optional[str] = None
    ):
        self.nom: str = nom
        self.age: Optional[int] = age
        self.email: Optional[str] = email
```

### Syntaxe moderne (Python 3.10+)

Depuis Python 3.10, vous pouvez utiliser `|` au lieu de `Optional` :

```python
# Python 3.10+
def trouver_index(liste: list[int], valeur: int) -> int | None:
    """Trouve l'index, peut retourner None."""
    try:
        return liste.index(valeur)
    except ValueError:
        return None

# Équivalent à Optional[int]
from typing import Optional

def trouver_index_ancien(liste: list[int], valeur: int) -> Optional[int]:
    """Version avec Optional."""
    # ...
```

## Union (union de types)

### Définition

`Union[T1, T2, ...]` indique qu'une valeur peut être de l'un des types spécifiés.

```python
from typing import Union

def traiter_valeur(valeur: Union[int, str]) -> str:
    """Traite une valeur qui peut être int ou str."""
    return str(valeur)

# Utilisation
print(traiter_valeur(42))      # "42"
print(traiter_valeur("hello")) # "hello"
```

### Syntaxe moderne (Python 3.10+)

```python
# Python 3.10+
def traiter_valeur(valeur: int | str) -> str:
    """Traite une valeur qui peut être int ou str."""
    return str(valeur)

# Équivalent à Union[int, str]
from typing import Union

def traiter_valeur_ancien(valeur: Union[int, str]) -> str:
    """Version avec Union."""
    # ...
```

### Cas d'usage

#### 1. Plusieurs types acceptés

```python
from typing import Union

def formater(valeur: Union[int, float, str]) -> str:
    """Formate une valeur numérique ou chaîne."""
    if isinstance(valeur, (int, float)):
        return f"{valeur:.2f}"
    return str(valeur)

print(formater(42))      # "42.00"
print(formater(3.14))    # "3.14"
print(formater("test"))  # "test"
```

#### 2. Retour de types différents

```python
from typing import Union

def parser_valeur(texte: str) -> Union[int, float, str]:
    """Parse une valeur, retourne le type approprié."""
    try:
        if '.' in texte:
            return float(texte)
        return int(texte)
    except ValueError:
        return texte  # Retourne la chaîne si parsing échoue

print(parser_valeur("42"))     # 42 (int)
print(parser_valeur("3.14"))   # 3.14 (float)
print(parser_valeur("hello"))  # "hello" (str)
```

#### 3. Types de collection différents

```python
from typing import Union, List, Dict

def traiter_donnees(
    donnees: Union[List[int], Dict[str, int]]
) -> int:
    """Traite des données qui peuvent être une liste ou un dict."""
    if isinstance(donnees, list):
        return sum(donnees)
    else:
        return sum(donnees.values())

print(traiter_donnees([1, 2, 3]))           # 6
print(traiter_donnees({"a": 1, "b": 2}))    # 3
```

## Différences et cas d'usage

### Optional vs Union

```python
from typing import Optional, Union

# Optional[T] est équivalent à Union[T, None]
def fonction1(valeur: Optional[int]) -> None:
    pass

def fonction2(valeur: Union[int, None]) -> None:
    pass

# Les deux sont équivalents, mais Optional est plus lisible
```

### Quand utiliser Optional

Utilisez `Optional` quand une valeur peut être absente (None) :

```python
from typing import Optional

def rechercher(nom: str) -> Optional[dict]:
    """Recherche un utilisateur, peut retourner None."""
    # ...
    if trouve:
        return {"nom": nom, "age": 30}
    return None
```

### Quand utiliser Union

Utilisez `Union` quand une valeur peut être de plusieurs types (mais pas None) :

```python
from typing import Union

def calculer(a: Union[int, float], b: Union[int, float]) -> float:
    """Calcule avec des nombres entiers ou décimaux."""
    return float(a) + float(b)
```

## Exemples pratiques

### Exemple 1 : API avec réponse optionnelle

```python
from typing import Optional, Dict, Any

def appeler_api(endpoint: str) -> Optional[Dict[str, Any]]:
    """
    Appelle une API, peut retourner None en cas d'erreur.
    
    Returns:
        Les données de l'API ou None si erreur
    """
    try:
        # Simulation d'appel API
        if endpoint == "users":
            return {"users": [{"id": 1, "name": "Alice"}]}
        return None
    except Exception:
        return None

# Utilisation
reponse = appeler_api("users")
if reponse:
    print(reponse["users"])
else:
    print("Erreur API")
```

### Exemple 2 : Parser flexible

```python
from typing import Union, List

def parser_nombre(valeur: Union[int, str, float]) -> float:
    """Parse un nombre de différents types."""
    if isinstance(valeur, (int, float)):
        return float(valeur)
    return float(valeur)

def parser_liste(valeur: Union[str, List[str]]) -> List[str]:
    """Parse une liste de chaînes."""
    if isinstance(valeur, str):
        return valeur.split(",")
    return valeur
```

### Exemple 3 : Configuration flexible

```python
from typing import Union, Optional, Dict, List

def charger_config(
    source: Union[str, Dict[str, any]]
) -> Optional[Dict[str, any]]:
    """
    Charge une configuration depuis une source.
    
    Args:
        source: Chemin de fichier (str) ou dict de configuration
        
    Returns:
        Configuration ou None si erreur
    """
    if isinstance(source, dict):
        return source
    # Charger depuis fichier...
    return None
```

## Bonnes pratiques

### 1. Préférez Optional pour None

```python
# ✅ Plus lisible
from typing import Optional

def fonction(valeur: Optional[int]) -> None:
    pass

# ⚠️ Moins lisible
from typing import Union

def fonction(valeur: Union[int, None]) -> None:
    pass
```

### 2. Vérifiez les types avec isinstance

```python
from typing import Union

def traiter(valeur: Union[int, str]) -> str:
    """Traite une valeur int ou str."""
    if isinstance(valeur, int):
        return f"Nombre: {valeur}"
    return f"Texte: {valeur}"
```

### 3. Utilisez la syntaxe moderne si Python 3.10+

```python
# ✅ Python 3.10+ (plus lisible)
def fonction(valeur: int | str | None) -> str:
    pass

# ⚠️ Ancienne syntaxe
from typing import Union, Optional

def fonction(valeur: Optional[Union[int, str]]) -> str:
    pass
```

### 4. Documentez les cas None

```python
from typing import Optional

def trouver_element(liste: list[int], valeur: int) -> Optional[int]:
    """
    Trouve l'index d'une valeur.
    
    Returns:
        L'index si trouvé, None si la valeur n'est pas dans la liste
    """
    try:
        return liste.index(valeur)
    except ValueError:
        return None
```

## Points clés à retenir

- ✅ `Optional[T]` est équivalent à `Union[T, None]`
- ✅ Utilisez `Optional` pour les valeurs qui peuvent être **None**
- ✅ Utilisez `Union` pour les valeurs qui peuvent être de **plusieurs types**
- ✅ Python 3.10+ permet `int | str` au lieu de `Union[int, str]`
- ✅ Python 3.10+ permet `int | None` au lieu de `Optional[int]`
- ✅ Vérifiez les types avec `isinstance()` dans le code
- ✅ Documentez quand et pourquoi une valeur peut être None

`Optional` et `Union` sont essentiels pour modéliser la flexibilité du code Python tout en gardant la sécurité de type. Utilisez-les pour rendre votre code plus explicite et vérifiable.
