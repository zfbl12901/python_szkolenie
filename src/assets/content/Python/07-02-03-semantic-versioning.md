---
title: "Semantic versioning"
order: 7.02.03
parent: "07-02-packaging.md"
tags: ["python", "versioning", "semver", "releases"]
---

# Semantic versioning

Le semantic versioning (SemVer) est un système de numérotation des versions qui communique clairement les changements entre les versions. C'est le standard de facto pour la gestion des versions de logiciels.

## Concepts de base

Le **semantic versioning** utilise un format à trois nombres : **MAJOR.MINOR.PATCH** (ex: 1.2.3)

- **MAJOR** : Changements incompatibles avec les versions précédentes
- **MINOR** : Nouvelles fonctionnalités compatibles avec les versions précédentes
- **PATCH** : Corrections de bugs compatibles

Ce système permet aux utilisateurs de comprendre l'impact d'une mise à jour.

## Format de version

### Structure de base

```
MAJOR.MINOR.PATCH

Exemples:
1.0.0  # Version majeure initiale
1.1.0  # Nouvelle fonctionnalité
1.1.1  # Correction de bug
2.0.0  # Version majeure (breaking changes)
```

### Exemples pratiques

```python
# Version initiale
version = "0.1.0"  # Première version (pas encore stable)

# Corrections de bugs
version = "0.1.1"  # Bug fix
version = "0.1.2"  # Autre bug fix

# Nouvelles fonctionnalités
version = "0.2.0"  # Nouvelle fonctionnalité
version = "0.3.0"  # Autre nouvelle fonctionnalité

# Version stable
version = "1.0.0"  # Première version stable

# Corrections après stable
version = "1.0.1"  # Bug fix
version = "1.0.2"  # Bug fix

# Nouvelles fonctionnalités
version = "1.1.0"  # Nouvelle fonctionnalité (rétrocompatible)
version = "1.2.0"  # Autre nouvelle fonctionnalité

# Breaking changes
version = "2.0.0"  # Changements incompatibles
```

## Règles de versioning

### MAJOR (X.0.0)

Incrémentez MAJOR quand vous introduisez des **changements incompatibles** :

```python
# Version 1.x.x
def fonction(parametre):
    return parametre * 2

# Version 2.0.0 (breaking change)
def fonction(parametre, multiplicateur=2):  # ⚠️ Signature changée
    return parametre * multiplicateur

# Les utilisateurs doivent modifier leur code
```

**Exemples de breaking changes** :
- Suppression d'une fonction publique
- Changement de signature d'une fonction
- Changement de format de données
- Suppression de dépendances

### MINOR (x.Y.0)

Incrémentez MINOR quand vous ajoutez des **fonctionnalités rétrocompatibles** :

```python
# Version 1.0.0
def fonction(parametre):
    return parametre * 2

# Version 1.1.0 (nouvelle fonctionnalité, rétrocompatible)
def fonction(parametre):
    return parametre * 2

def nouvelle_fonction(parametre):  # ✅ Nouvelle fonction, pas de breaking change
    return parametre * 3

# Le code existant continue de fonctionner
```

**Exemples de changements MINOR** :
- Ajout d'une nouvelle fonction
- Ajout d'un paramètre optionnel
- Nouvelle fonctionnalité rétrocompatible

### PATCH (x.y.Z)

Incrémentez PATCH pour les **corrections de bugs rétrocompatibles** :

```python
# Version 1.0.0 (bug)
def diviser(a, b):
    return a / b  # ⚠️ Ne gère pas b=0

# Version 1.0.1 (bug fix)
def diviser(a, b):
    if b == 0:
        raise ValueError("Division par zéro")
    return a / b  # ✅ Bug corrigé

# Rétrocompatible (même interface)
```

**Exemples de changements PATCH** :
- Correction de bugs
- Corrections de documentation
- Améliorations de performance (sans changement d'API)

## Pré-versions et métadonnées

### Pré-versions

Pour les versions en développement :

```python
# Versions de développement
version = "1.0.0-alpha.1"   # Alpha
version = "1.0.0-beta.1"    # Beta
version = "1.0.0-rc.1"      # Release candidate
version = "1.0.0"            # Version finale
```

### Métadonnées de build

```python
# Avec métadonnées de build
version = "1.0.0+build.123"
version = "1.0.0+20230101"
```

## Utilisation en Python

### Dans pyproject.toml

```toml
[project]
name = "mon-package"
version = "1.2.3"  # Semantic versioning
```

### Dans setup.py

```python
setup(
    name="mon-package",
    version="1.2.3",  # Semantic versioning
)
```

### Dans le code Python

```python
# mon_package/__init__.py
__version__ = "1.2.3"

# Utilisation
import mon_package
print(mon_package.__version__)  # "1.2.3"
```

### Avec setuptools_scm

Automatiser la version depuis Git :

```toml
# pyproject.toml
[build-system]
requires = ["setuptools>=61.0", "setuptools-scm"]
build-backend = "setuptools.build_meta"

[tool.setuptools_scm]
```

```python
# setup.py
from setuptools import setup

setup(
    use_scm_version=True,  # Version depuis les tags Git
)
```

## Exemples pratiques

### Exemple 1 : Cycle de développement

```python
# Développement initial
version = "0.1.0"  # Première version

# Ajout de fonctionnalités
version = "0.2.0"  # Nouvelles fonctionnalités
version = "0.3.0"  # Encore des fonctionnalités

# Version stable
version = "1.0.0"  # Première version stable

# Maintenance
version = "1.0.1"  # Bug fix
version = "1.0.2"  # Bug fix
version = "1.1.0"  # Nouvelle fonctionnalité
version = "1.2.0"  # Nouvelle fonctionnalité

# Breaking changes
version = "2.0.0"  # Changements incompatibles
```

### Exemple 2 : Décision de version

```python
# Changement : Suppression d'une fonction
# Avant (1.5.0)
def ancienne_fonction():
    pass

# Après
# fonction supprimée

# ✅ Version : 2.0.0 (MAJOR - breaking change)
```

```python
# Changement : Ajout d'une fonction
# Avant (1.5.0)
def fonction():
    pass

# Après
def fonction():
    pass

def nouvelle_fonction():  # Nouvelle fonction
    pass

# ✅ Version : 1.6.0 (MINOR - nouvelle fonctionnalité)
```

```python
# Changement : Correction de bug
# Avant (1.5.0)
def fonction():
    return None  # ⚠️ Bug

# Après
def fonction():
    return "correct"  # ✅ Bug corrigé

# ✅ Version : 1.5.1 (PATCH - bug fix)
```

## Bonnes pratiques

### 1. Commencez à 0.1.0

```python
# ✅ Bon : commencer à 0.1.0
version = "0.1.0"  # Première version

# ⚠️ Moins bon : commencer à 1.0.0
version = "1.0.0"  # Implique que c'est stable
```

### 2. Passez à 1.0.0 pour la stabilité

```python
# ✅ Quand l'API est stable
version = "1.0.0"  # Version stable
```

### 3. Documentez les breaking changes

```python
# CHANGELOG.md
## [2.0.0] - 2024-01-01
### Breaking Changes
- Suppression de `ancienne_fonction()`
- Changement de signature de `fonction()`

## [1.2.0] - 2023-12-01
### Added
- Nouvelle fonction `nouvelle_fonction()`

## [1.1.1] - 2023-11-01
### Fixed
- Correction du bug dans `fonction()`
```

### 4. Utilisez des tags Git

```bash
# Créer un tag pour une version
git tag v1.2.3
git push --tags

# Vérifier les tags
git tag -l
```

## Comparaison de versions

### En Python

```python
from packaging import version

# Comparer des versions
v1 = version.parse("1.2.3")
v2 = version.parse("1.3.0")

print(v1 < v2)  # True
print(v1 >= v2)  # False

# Vérifier une plage
v = version.parse("1.2.3")
print("1.0.0" <= str(v) < "2.0.0")  # True
```

### Dans les dépendances

```toml
# pyproject.toml
[project]
dependencies = [
    "requests>=2.25.0,<3.0.0",  # Compatible avec 2.x, pas 3.x
]
```

## Points clés à retenir

- ✅ Format : **MAJOR.MINOR.PATCH** (ex: 1.2.3)
- ✅ **MAJOR** : Changements incompatibles (breaking changes)
- ✅ **MINOR** : Nouvelles fonctionnalités rétrocompatibles
- ✅ **PATCH** : Corrections de bugs rétrocompatibles
- ✅ Commencez à **0.1.0** pour les projets en développement
- ✅ Passez à **1.0.0** quand l'API est stable
- ✅ **Documentez les breaking changes** dans le CHANGELOG
- ✅ Utilisez des **tags Git** pour marquer les versions

Le semantic versioning est essentiel pour communiquer clairement les changements. Il permet aux utilisateurs de comprendre l'impact d'une mise à jour et de prendre des décisions éclairées.
