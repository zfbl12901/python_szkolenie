---
title: "Annotations de types"
order: 2.03.03
parent: "02-03-fonctions-citoyens-premiere-classe.md"
tags: ["python", "types", "annotations"]
---

# Annotations de types

Les annotations de types permettent de documenter les types attendus, améliorant la lisibilité et permettant l'analyse statique. Introduites dans Python 3.5 et améliorées depuis, elles sont devenues un standard dans le code Python moderne.

## Concepts de base

Les annotations de types en Python sont **optionnelles** et **non vérifiées à l'exécution**. Elles servent principalement à :
- **Documenter** le code pour les développeurs
- **Permettre l'analyse statique** avec des outils comme `mypy` ou `pyright`
- **Améliorer l'autocomplétion** dans les IDE

Contrairement à des langages comme Java ou C++, Python ne force pas le respect des types à l'exécution.

## Syntaxe des annotations

### Annotations de base

```python
# Annotations pour les paramètres et le retour
def additionner(a: int, b: int) -> int:
    return a + b

# Annotations pour les variables (Python 3.6+)
age: int = 30
nom: str = "Alice"
```

### Types de base

```python
# Types primitifs
def fonction(nombre: int, texte: str, decimal: float, booleen: bool) -> str:
    return f"{texte}: {nombre}"

# Collections de base
def traiter_liste(nombres: list) -> list:
    return [x * 2 for x in nombres]

def obtenir_valeur(dico: dict, cle: str) -> str:
    return dico.get(cle, "")
```

### Utilisation du module typing

Pour des annotations plus précises, utilisez le module `typing` :

```python
from typing import List, Dict, Tuple, Set, Optional, Union

# List avec type d'éléments
def traiter_nombres(nombres: List[int]) -> List[int]:
    return [x * 2 for x in nombres]

# Dict avec types de clés et valeurs
def obtenir_ages(utilisateurs: Dict[str, int]) -> List[int]:
    return list(utilisateurs.values())

# Tuple avec types des éléments
def obtenir_coordonnees() -> Tuple[float, float]:
    return (10.5, 20.3)

# Set avec type d'éléments
def obtenir_nombres_uniques(nombres: Set[int]) -> List[int]:
    return sorted(list(nombres))
```

## Module typing

### Types de collections

```python
from typing import List, Dict, Tuple, Set

# List[int] : liste d'entiers
def trier_nombres(nombres: List[int]) -> List[int]:
    return sorted(nombres)

# Dict[str, int] : dictionnaire clé=str, valeur=int
def compter_mots(texte: str) -> Dict[str, int]:
    mots = texte.split()
    return {mot: mots.count(mot) for mot in set(mots)}

# Tuple[int, str, float] : tuple avec 3 éléments typés
def obtenir_info() -> Tuple[int, str, float]:
    return (42, "Alice", 3.14)

# Set[str] : ensemble de chaînes
def obtenir_mots_uniques(texte: str) -> Set[str]:
    return set(texte.split())
```

### Optional et Union

```python
from typing import Optional, Union

# Optional[T] est équivalent à Union[T, None]
def trouver_element(liste: List[int], valeur: int) -> Optional[int]:
    """Retourne l'index ou None si non trouvé."""
    try:
        return liste.index(valeur)
    except ValueError:
        return None

# Union permet plusieurs types possibles
def traiter_valeur(valeur: Union[int, str]) -> str:
    return str(valeur)

# Union simplifiée avec | (Python 3.10+)
def traiter_valeur(valeur: int | str) -> str:
    return str(valeur)
```

### Any, Callable, et autres

```python
from typing import Any, Callable, Iterable, Iterator

# Any : n'importe quel type
def accepter_tout(valeur: Any) -> Any:
    return valeur

# Callable : fonction
def appliquer(fonction: Callable[[int, int], int], a: int, b: int) -> int:
    return fonction(a, b)

# Iterable : quelque chose qu'on peut itérer
def sommer(nombres: Iterable[int]) -> int:
    return sum(nombres)

# Iterator : itérateur
def parcourir(iterateur: Iterator[int]) -> List[int]:
    return list(iterateur)
```

### Generics (Python 3.9+)

Depuis Python 3.9, vous pouvez utiliser les types de collections natifs directement :

```python
# Python 3.9+ : utilisez list, dict, etc. directement
def traiter_nombres(nombres: list[int]) -> list[int]:
    return [x * 2 for x in nombres]

def obtenir_ages(utilisateurs: dict[str, int]) -> list[int]:
    return list(utilisateurs.values())

# Python < 3.9 : utilisez typing.List, typing.Dict
from typing import List, Dict

def traiter_nombres(nombres: List[int]) -> List[int]:
    return [x * 2 for x in nombres]
```

## Annotations avancées

### TypeVar (génériques)

```python
from typing import TypeVar, Generic

T = TypeVar('T')

def premier_element(liste: list[T]) -> T:
    return liste[0]

# Utilisation
nombres: list[int] = [1, 2, 3]
premier: int = premier_element(nombres)  # Type inféré : int

mots: list[str] = ["a", "b", "c"]
premier_mot: str = premier_element(mots)  # Type inféré : str
```

### TypedDict

Pour les dictionnaires avec des clés spécifiques :

```python
from typing import TypedDict

class UtilisateurDict(TypedDict):
    nom: str
    age: int
    email: str

def creer_utilisateur() -> UtilisateurDict:
    return {
        "nom": "Alice",
        "age": 30,
        "email": "alice@example.com"
    }
```

### Protocol (duck typing)

```python
from typing import Protocol

class Dessinable(Protocol):
    def dessiner(self) -> None: ...

def afficher(obj: Dessinable) -> None:
    obj.dessiner()

# Toute classe avec une méthode dessiner() est compatible
class Cercle:
    def dessiner(self) -> None:
        print("Dessine un cercle")

afficher(Cercle())  # OK
```

## Outils d'analyse statique

### mypy

`mypy` est l'outil d'analyse statique le plus populaire pour Python :

```bash
# Installation
pip install mypy

# Vérification d'un fichier
mypy mon_fichier.py

# Vérification d'un projet
mypy .
```

```python
# Exemple avec mypy
def additionner(a: int, b: int) -> int:
    return a + b

# mypy détectera cette erreur
resultat = additionner("hello", "world")  # Erreur de type
```

### pyright / Pylance

`pyright` (utilisé par Pylance dans VS Code) est un autre outil puissant :

```python
# pyright détecte aussi les erreurs de type
def multiplier(a: int, b: int) -> int:
    return a * b

# Erreur détectée
resultat = multiplier("a", "b")  # Type error
```

### Configuration

Créez un fichier `mypy.ini` ou `pyproject.toml` :

```ini
# mypy.ini
[mypy]
python_version = 3.9
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True
```

```toml
# pyproject.toml
[tool.mypy]
python_version = "3.9"
warn_return_any = true
disallow_untyped_defs = true
```

## Bonnes pratiques

### 1. Annoter progressivement

Vous n'avez pas besoin d'annoter tout votre code d'un coup :

```python
# Commencez par les fonctions publiques
def fonction_publique(parametre: int) -> str:
    return str(parametre)

# Puis les fonctions internes importantes
def _fonction_interne(donnees: list[int]) -> None:
    pass
```

### 2. Utiliser des alias pour les types complexes

```python
from typing import Dict, List

# Alias pour simplifier
UserDict = Dict[str, Any]
UserList = List[UserDict]

def traiter_utilisateurs(utilisateurs: UserList) -> UserList:
    return utilisateurs
```

### 3. Documenter avec docstrings ET annotations

```python
def calculer_moyenne(nombres: list[float]) -> float:
    """
    Calcule la moyenne d'une liste de nombres.
    
    Args:
        nombres: Liste de nombres à moyenner
        
    Returns:
        La moyenne des nombres
        
    Raises:
        ValueError: Si la liste est vide
    """
    if not nombres:
        raise ValueError("La liste ne peut pas être vide")
    return sum(nombres) / len(nombres)
```

### 4. Utiliser Optional explicitement

```python
from typing import Optional

# ✅ Clair
def trouver_index(liste: list[int], valeur: int) -> Optional[int]:
    try:
        return liste.index(valeur)
    except ValueError:
        return None

# ⚠️ Moins clair (mais valide)
def trouver_index(liste: list[int], valeur: int) -> int | None:
    # ...
```

### 5. Éviter Any sauf si nécessaire

```python
# ❌ Trop permissif
def traiter(valeur: Any) -> Any:
    return valeur

# ✅ Plus précis
def traiter(valeur: int | str) -> str:
    return str(valeur)
```

## Limitations et pièges

### Les annotations ne sont pas vérifiées à l'exécution

```python
def additionner(a: int, b: int) -> int:
    return a + b

# Ceci fonctionne à l'exécution (pas d'erreur)
resultat = additionner("hello", "world")  # "helloworld"
# Mais mypy/pyright détecteront l'erreur
```

### Compatibilité avec les anciennes versions

```python
from typing import List, Dict  # Python < 3.9
# ou
list[int]  # Python 3.9+

# Utilisez __future__ pour la compatibilité
from __future__ import annotations  # Python 3.7+
```

### Performance

Les annotations n'ont **aucun impact** sur les performances à l'exécution. Elles sont ignorées par l'interpréteur Python (sauf si vous utilisez des outils comme `typing.get_type_hints()`).

## Exemples pratiques

### Fonction avec types complexes

```python
from typing import List, Dict, Optional, Tuple

def analyser_texte(
    texte: str,
    mots_cles: Optional[List[str]] = None
) -> Dict[str, int]:
    """
    Analyse un texte et compte les occurrences des mots-clés.
    
    Args:
        texte: Texte à analyser
        mots_cles: Liste de mots-clés à chercher. Si None, compte tous les mots.
        
    Returns:
        Dictionnaire avec les mots-clés et leur nombre d'occurrences
    """
    if mots_cles is None:
        mots_cles = texte.split()
    
    resultat: Dict[str, int] = {}
    mots = texte.lower().split()
    
    for mot_cle in mots_cles:
        resultat[mot_cle] = mots.count(mot_cle.lower())
    
    return resultat
```

### Classe avec annotations

```python
from typing import List, Optional

class Utilisateur:
    def __init__(self, nom: str, age: int, emails: Optional[List[str]] = None):
        self.nom: str = nom
        self.age: int = age
        self.emails: List[str] = emails if emails is not None else []
    
    def ajouter_email(self, email: str) -> None:
        if email not in self.emails:
            self.emails.append(email)
    
    def obtenir_emails(self) -> List[str]:
        return self.emails.copy()
```

## Points clés à retenir

- ✅ Les annotations de types sont **optionnelles** et **non vérifiées à l'exécution**
- ✅ Elles améliorent la **lisibilité** et permettent l'**analyse statique**
- ✅ Utilisez le module `typing` pour des types complexes
- ✅ `Optional[T]` est équivalent à `Union[T, None]`
- ✅ Python 3.9+ permet d'utiliser `list[int]` au lieu de `List[int]`
- ✅ Utilisez `mypy` ou `pyright` pour vérifier vos annotations
- ✅ Annotez progressivement, commencez par les fonctions publiques
- ✅ Documentez avec docstrings ET annotations
- ✅ Évitez `Any` sauf si vraiment nécessaire

Les annotations de types sont devenues un standard dans le code Python moderne. Elles améliorent significativement la maintenabilité et la détection d'erreurs, surtout dans les projets de grande taille.
