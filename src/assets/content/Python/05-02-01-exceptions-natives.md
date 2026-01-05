---
title: "Exceptions natives"
order: 5.02.01
parent: "05-02-gestion-erreurs.md"
tags: ["python", "exceptions", "natives", "builtin"]
---

# Exceptions natives

Python fournit une hiérarchie riche d'exceptions natives pour gérer différents types d'erreurs. Comprendre cette hiérarchie et savoir quand utiliser chaque exception est essentiel pour une gestion d'erreurs appropriée.

## Concepts de base

En Python, les exceptions sont des objets qui représentent des erreurs. Toutes les exceptions héritent de la classe `BaseException`, mais la plupart héritent de `Exception`. Le système d'exceptions permet de gérer les erreurs de manière élégante et contrôlée.

## Hiérarchie des exceptions

### Hiérarchie principale

```
BaseException
├── SystemExit
├── KeyboardInterrupt
├── GeneratorExit
└── Exception
    ├── StopIteration
    ├── StopAsyncIteration
    ├── ArithmeticError
    │   ├── FloatingPointError
    │   ├── OverflowError
    │   └── ZeroDivisionError
    ├── AssertionError
    ├── AttributeError
    ├── BufferError
    ├── EOFError
    ├── ImportError
    │   └── ModuleNotFoundError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── MemoryError
    ├── NameError
    │   └── UnboundLocalError
    ├── OSError
    │   ├── FileNotFoundError
    │   ├── PermissionError
    │   └── ...
    ├── RuntimeError
    │   └── RecursionError
    ├── SyntaxError
    │   └── IndentationError
    ├── SystemError
    ├── TypeError
    ├── ValueError
    │   └── UnicodeError
    └── Warning
```

### BaseException vs Exception

- **BaseException** : Classe de base pour toutes les exceptions (rarement utilisée directement)
- **Exception** : Classe de base pour les exceptions "normales" (utilisez celle-ci)

```python
# ❌ Ne capturez pas BaseException (capture aussi SystemExit, KeyboardInterrupt)
try:
    # ...
except BaseException:  # ⚠️ Dangereux
    pass

# ✅ Capturez Exception
try:
    # ...
except Exception:  # ✅ Correct
    pass
```

## Exceptions courantes

### ValueError

Levée quand une fonction reçoit un argument du bon type mais avec une valeur inappropriée :

```python
# Exemple
int("abc")  # ValueError: invalid literal for int() with base 10: 'abc'

# Utilisation appropriée
def calculer_racine(nombre: float) -> float:
    """Calcule la racine carrée."""
    if nombre < 0:
        raise ValueError("Le nombre doit être positif")
    return nombre ** 0.5

calculer_racine(-4)  # ValueError: Le nombre doit être positif
```

### TypeError

Levée quand une opération est appliquée à un objet d'un type inapproprié :

```python
# Exemple
"hello" + 5  # TypeError: can only concatenate str (not "int") to str

# Utilisation appropriée
def additionner(a: int, b: int) -> int:
    """Additionne deux entiers."""
    if not isinstance(a, int) or not isinstance(b, int):
        raise TypeError("Les arguments doivent être des entiers")
    return a + b

additionner("5", 3)  # TypeError: Les arguments doivent être des entiers
```

### KeyError

Levée quand une clé n'existe pas dans un dictionnaire :

```python
# Exemple
dico = {"a": 1, "b": 2}
print(dico["c"])  # KeyError: 'c'

# Gestion
try:
    valeur = dico["c"]
except KeyError:
    valeur = None

# Ou avec get()
valeur = dico.get("c")  # Retourne None si la clé n'existe pas
valeur = dico.get("c", 0)  # Retourne 0 par défaut
```

### IndexError

Levée quand un index est hors limites :

```python
# Exemple
liste = [1, 2, 3]
print(liste[10])  # IndexError: list index out of range

# Gestion
try:
    valeur = liste[10]
except IndexError:
    valeur = None

# Ou vérification
if 10 < len(liste):
    valeur = liste[10]
```

### AttributeError

Levée quand un attribut n'existe pas :

```python
# Exemple
class Personne:
    def __init__(self, nom):
        self.nom = nom

p = Personne("Alice")
print(p.age)  # AttributeError: 'Personne' object has no attribute 'age'

# Gestion
try:
    age = p.age
except AttributeError:
    age = None

# Ou avec hasattr()
if hasattr(p, "age"):
    age = p.age
```

### ZeroDivisionError

Levée lors d'une division par zéro :

```python
# Exemple
10 / 0  # ZeroDivisionError: division by zero

# Gestion
def diviser(a: float, b: float) -> float:
    """Divise deux nombres."""
    if b == 0:
        raise ZeroDivisionError("Division par zéro impossible")
    return a / b
```

### FileNotFoundError

Levée quand un fichier n'existe pas :

```python
# Exemple
with open("fichier_inexistant.txt") as f:
    pass  # FileNotFoundError: [Errno 2] No such file or directory

# Gestion
try:
    with open("fichier.txt") as f:
        contenu = f.read()
except FileNotFoundError:
    print("Fichier non trouvé")
    contenu = ""
```

### ImportError / ModuleNotFoundError

Levée quand un module ne peut pas être importé :

```python
# Exemple
import module_inexistant  # ModuleNotFoundError: No module named 'module_inexistant'

# Gestion
try:
    import module_optionnel
except ModuleNotFoundError:
    module_optionnel = None
    print("Module optionnel non disponible")
```

## Quand utiliser chaque exception

### ValueError vs TypeError

```python
# TypeError : mauvais type
def additionner(a: int, b: int):
    if not isinstance(a, int):
        raise TypeError(f"a doit être int, reçu {type(a)}")

# ValueError : bon type, mauvaise valeur
def calculer_racine(nombre: float):
    if nombre < 0:
        raise ValueError("Le nombre doit être positif")
```

### KeyError vs AttributeError

```python
# KeyError : clé de dictionnaire
dico = {"a": 1}
dico["b"]  # KeyError

# AttributeError : attribut d'objet
obj = object()
obj.attribut  # AttributeError
```

## Exemples pratiques

### Exemple 1 : Validation avec ValueError

```python
def valider_age(age: int) -> None:
    """Valide un âge."""
    if not isinstance(age, int):
        raise TypeError(f"L'âge doit être un entier, reçu {type(age)}")
    if age < 0:
        raise ValueError("L'âge ne peut pas être négatif")
    if age > 150:
        raise ValueError("L'âge ne peut pas dépasser 150")

# Utilisation
try:
    valider_age(-5)
except ValueError as e:
    print(f"Erreur de valeur: {e}")
```

### Exemple 2 : Gestion de fichiers

```python
def lire_fichier(nom_fichier: str) -> str:
    """Lit un fichier avec gestion d'erreurs."""
    try:
        with open(nom_fichier, 'r') as f:
            return f.read()
    except FileNotFoundError:
        raise FileNotFoundError(f"Fichier '{nom_fichier}' non trouvé")
    except PermissionError:
        raise PermissionError(f"Permission refusée pour '{nom_fichier}'")
    except OSError as e:
        raise OSError(f"Erreur d'E/S: {e}")
```

### Exemple 3 : Accès sécurisé aux données

```python
def obtenir_valeur(dico: dict, cle: str, valeur_par_defaut=None):
    """Obtient une valeur d'un dictionnaire de manière sécurisée."""
    try:
        return dico[cle]
    except KeyError:
        return valeur_par_defaut

# Utilisation
config = {"host": "localhost"}
host = obtenir_valeur(config, "host", "127.0.0.1")  # "localhost"
port = obtenir_valeur(config, "port", 8000)  # 8000 (valeur par défaut)
```

## Bonnes pratiques

### 1. Utilisez l'exception la plus spécifique

```python
# ✅ Spécifique
try:
    valeur = dico["cle"]
except KeyError:
    valeur = None

# ⚠️ Trop général
try:
    valeur = dico["cle"]
except Exception:  # Capture tout
    valeur = None
```

### 2. Ne masquez pas les erreurs

```python
# ❌ Masque l'erreur
try:
    operation_risquee()
except:
    pass  # ⚠️ Ignore toutes les erreurs

# ✅ Gestion appropriée
try:
    operation_risquee()
except ValueError as e:
    logger.error(f"Erreur de valeur: {e}")
    # Gérer l'erreur
```

### 3. Documentez les exceptions levées

```python
def diviser(a: float, b: float) -> float:
    """
    Divise deux nombres.
    
    Args:
        a: Numérateur
        b: Dénominateur
        
    Returns:
        Résultat de la division
        
    Raises:
        ZeroDivisionError: Si b est zéro
        TypeError: Si les arguments ne sont pas numériques
    """
    if b == 0:
        raise ZeroDivisionError("Division par zéro")
    return a / b
```

## Points clés à retenir

- ✅ **ValueError** : Bon type, mauvaise valeur
- ✅ **TypeError** : Mauvais type
- ✅ **KeyError** : Clé absente d'un dictionnaire
- ✅ **IndexError** : Index hors limites
- ✅ **AttributeError** : Attribut absent
- ✅ **FileNotFoundError** : Fichier introuvable
- ✅ Utilisez l'exception **la plus spécifique** possible
- ✅ **Documentez** les exceptions que votre fonction peut lever
- ✅ Ne **masquez pas** les erreurs avec `except: pass`

Comprendre les exceptions natives et savoir quand les utiliser est essentiel pour une gestion d'erreurs appropriée. Cela rend votre code plus robuste et plus facile à déboguer.
