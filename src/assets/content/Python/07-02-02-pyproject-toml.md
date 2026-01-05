---
title: "pyproject.toml"
order: 7.02.02
parent: "07-02-packaging.md"
tags: ["python", "pyproject.toml", "packaging", "modern"]
---

# pyproject.toml

`pyproject.toml` est le fichier de configuration moderne standardisé pour les projets Python. Introduit dans PEP 518, il remplace progressivement `setup.py` et `setup.cfg`.

## Concepts de base

Le fichier `pyproject.toml` est le **standard moderne** pour la configuration des projets Python. Il permet de définir :
- Les métadonnées du projet
- Les dépendances
- Les outils de build
- La configuration des outils (black, pytest, mypy, etc.)

**Avantage principal** : Un seul fichier pour toute la configuration, lisible et standardisé.

## Structure de base

### Format TOML

`pyproject.toml` utilise le format TOML (Tom's Obvious Minimal Language) :

```toml
[project]
name = "mon-package"
version = "0.1.0"
description = "Description du package"
authors = [
    {name = "Votre Nom", email = "email@example.com"}
]
readme = "README.md"
requires-python = ">=3.8"
dependencies = [
    "requests>=2.25.0",
    "flask>=2.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "black>=22.0.0",
]

[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"
```

## Métadonnées du projet

### Informations de base

```toml
[project]
name = "mon-package"
version = "0.1.0"
description = "Une description courte du package"
readme = "README.md"
requires-python = ">=3.8"
license = {text = "MIT"}
authors = [
    {name = "Alice", email = "alice@example.com"},
]
maintainers = [
    {name = "Bob", email = "bob@example.com"},
]
keywords = ["web", "api", "framework"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
]
```

### URLs du projet

```toml
[project.urls]
Homepage = "https://github.com/user/package"
Documentation = "https://package.readthedocs.io"
Repository = "https://github.com/user/package"
"Bug Tracker" = "https://github.com/user/package/issues"
```

### Scripts d'entrée

```toml
[project.scripts]
mon-commande = "mon_package.cli:main"

[project.gui-scripts]
mon-gui = "mon_package.gui:main"
```

## Dépendances

### Dépendances de base

```toml
[project]
dependencies = [
    "requests>=2.25.0",
    "flask>=2.0.0",
    "django>=3.0,<4.0",
]
```

### Dépendances optionnelles

```toml
[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "black>=22.0.0",
    "mypy>=0.950",
]
test = [
    "pytest>=7.0.0",
    "pytest-cov>=4.0.0",
]
docs = [
    "sphinx>=5.0.0",
    "sphinx-rtd-theme>=1.0.0",
]
```

### Installation avec dépendances optionnelles

```bash
# Installation de base
pip install mon-package

# Avec dépendances optionnelles
pip install "mon-package[dev]"
pip install "mon-package[dev,test]"
```

## Build system

### Configuration du build

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"
```

### Avec Poetry

```toml
[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

### Avec flit

```toml
[build-system]
requires = ["flit_core>=3.2"]
build-backend = "flit_core.buildapi"
```

## Configuration des outils

### Black (formatage)

```toml
[tool.black]
line-length = 88
target-version = ['py38', 'py39', 'py310']
include = '\.pyi?$'
```

### pytest (tests)

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "-v --tb=short"
```

### mypy (type checking)

```toml
[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

### Ruff (linting)

```toml
[tool.ruff]
line-length = 88
target-version = "py38"

[tool.ruff.lint]
select = ["E", "F", "I"]
ignore = ["E501"]
```

## Exemples pratiques

### Exemple 1 : Package simple

```toml
[project]
name = "calculatrice"
version = "1.0.0"
description = "Une calculatrice simple"
readme = "README.md"
requires-python = ">=3.8"
authors = [{name = "Alice", email = "alice@example.com"}]
dependencies = []

[project.scripts]
calc = "calculatrice.cli:main"

[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"
```

### Exemple 2 : Package avec dépendances

```toml
[project]
name = "mon-api"
version = "0.1.0"
description = "API REST simple"
readme = "README.md"
requires-python = ">=3.8"
dependencies = [
    "fastapi>=0.95.0",
    "uvicorn[standard]>=0.20.0",
    "pydantic>=1.10.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "black>=22.0.0",
    "mypy>=0.950",
]

[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[tool.pytest.ini_options]
testpaths = ["tests"]

[tool.black]
line-length = 100
```

### Exemple 3 : Package avec Poetry

```toml
[tool.poetry]
name = "mon-package"
version = "0.1.0"
description = "Description"
authors = ["Votre Nom <email@example.com>"]

[tool.poetry.dependencies]
python = "^3.8"
requests = "^2.25.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.0.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

## Migration depuis setup.py

### Ancien setup.py

```python
# setup.py (ancien)
from setuptools import setup

setup(
    name="mon-package",
    version="0.1.0",
    install_requires=["requests>=2.25.0"],
    # ...
)
```

### Nouveau pyproject.toml

```toml
# pyproject.toml (moderne)
[project]
name = "mon-package"
version = "0.1.0"
dependencies = ["requests>=2.25.0"]
```

## Bonnes pratiques

### 1. Utilisez pyproject.toml pour les nouveaux projets

```toml
# ✅ Nouveau projet : utilisez pyproject.toml
[project]
name = "mon-package"
# ...
```

### 2. Centralisez la configuration

```toml
# ✅ Tout dans pyproject.toml
[project]
# Métadonnées

[tool.black]
# Configuration black

[tool.pytest.ini_options]
# Configuration pytest
```

### 3. Spécifiez requires-python

```toml
# ✅ Spécifier la version Python minimale
[project]
requires-python = ">=3.8"
```

### 4. Utilisez des dépendances optionnelles

```toml
# ✅ Organiser avec optional-dependencies
[project.optional-dependencies]
dev = ["pytest", "black"]
test = ["pytest-cov"]
```

## Points clés à retenir

- ✅ `pyproject.toml` est le **standard moderne** pour la configuration Python
- ✅ **Un seul fichier** pour métadonnées, dépendances, et configuration d'outils
- ✅ Format **TOML** (lisible et standardisé)
- ✅ Remplace progressivement `setup.py` et `setup.cfg`
- ✅ Supporté par **setuptools**, **Poetry**, **flit**, etc.
- ✅ Permet de **centraliser toute la configuration** du projet
- ✅ Utilisez-le pour **tous les nouveaux projets**

`pyproject.toml` est l'avenir du packaging Python. Il simplifie la configuration et standardise le format. Adoptez-le pour vos nouveaux projets.
