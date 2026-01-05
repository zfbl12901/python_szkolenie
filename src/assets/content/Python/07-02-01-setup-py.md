---
title: "setup.py"
order: 7.02.01
parent: "07-02-packaging.md"
tags: ["python", "setup.py", "packaging", "legacy"]
---

# setup.py

`setup.py` est l'ancienne méthode de packaging Python, encore largement utilisée mais progressivement remplacée par `pyproject.toml`. Comprendre `setup.py` reste important pour maintenir des projets existants.

## Concepts de base

`setup.py` est un script Python qui utilise `setuptools` pour définir les métadonnées et la configuration d'un package. C'était la méthode standard avant l'introduction de `pyproject.toml` (PEP 518).

**Note** : Pour les nouveaux projets, préférez `pyproject.toml`. `setup.py` est présenté ici pour la compatibilité et la maintenance de projets existants.

## Structure de setup.py

### Exemple minimal

```python
from setuptools import setup

setup(
    name="mon-package",
    version="0.1.0",
    description="Description du package",
    author="Votre Nom",
    author_email="email@example.com",
    py_modules=["mon_module"],  # Modules Python simples
    # ou
    packages=["mon_package"],  # Packages avec __init__.py
)
```

### Exemple complet

```python
from setuptools import setup, find_packages

setup(
    name="mon-package",
    version="0.1.0",
    description="Une description courte",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="Votre Nom",
    author_email="email@example.com",
    url="https://github.com/user/package",
    license="MIT",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
    python_requires=">=3.8",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.0",
        "flask>=2.0.0",
    ],
    extras_require={
        "dev": ["pytest>=7.0.0", "black>=22.0.0"],
        "test": ["pytest-cov>=4.0.0"],
    },
    entry_points={
        "console_scripts": [
            "mon-commande=mon_package.cli:main",
        ],
    },
)
```

## Métadonnées du package

### Informations de base

```python
setup(
    name="mon-package",  # Nom du package (utilisé par pip install)
    version="0.1.0",     # Version (suivre semantic versioning)
    description="Description courte",
    long_description=open("README.md").read(),
    author="Votre Nom",
    author_email="email@example.com",
    url="https://github.com/user/package",
    license="MIT",
)
```

### Classifiers

Les classifiers aident à catégoriser le package sur PyPI :

```python
classifiers=[
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Topic :: Software Development :: Libraries",
]
```

## Dépendances

### install_requires

```python
setup(
    install_requires=[
        "requests>=2.25.0",
        "flask>=2.0.0",
        "django>=3.0,<4.0",
    ],
)
```

### extras_require

```python
setup(
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "black>=22.0.0",
            "mypy>=0.950",
        ],
        "test": [
            "pytest-cov>=4.0.0",
        ],
        "docs": [
            "sphinx>=5.0.0",
        ],
    },
)

# Installation avec extras
# pip install mon-package[dev]
# pip install mon-package[dev,test]
```

## Installation et distribution

### Installation en mode développement

```bash
# Installation en mode "editable"
pip install -e .

# Les modifications sont immédiatement visibles
# Utile pour le développement
```

### Build du package

```bash
# Installer build
pip install build

# Créer les distributions
python -m build

# Génère :
# dist/mon-package-0.1.0.tar.gz (source)
# dist/mon_package-0.1.0-py3-none-any.whl (wheel)
```

### Installation locale

```bash
# Installer depuis le répertoire
pip install .

# Ou depuis le wheel
pip install dist/mon_package-0.1.0-py3-none-any.whl
```

## Migration vers pyproject.toml

### Ancien setup.py

```python
# setup.py
from setuptools import setup

setup(
    name="mon-package",
    version="0.1.0",
    install_requires=["requests>=2.25.0"],
)
```

### Nouveau pyproject.toml

```toml
# pyproject.toml
[project]
name = "mon-package"
version = "0.1.0"
dependencies = ["requests>=2.25.0"]

[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"
```

### Migration progressive

Vous pouvez garder `setup.py` minimal et utiliser `pyproject.toml` :

```python
# setup.py (minimal, pour compatibilité)
from setuptools import setup

setup()
```

```toml
# pyproject.toml (configuration principale)
[project]
name = "mon-package"
version = "0.1.0"
# ...
```

## Exemples pratiques

### Exemple 1 : Package simple

```python
# setup.py
from setuptools import setup

setup(
    name="calculatrice",
    version="1.0.0",
    py_modules=["calculatrice"],
    entry_points={
        "console_scripts": [
            "calc=calculatrice:main",
        ],
    },
)
```

### Exemple 2 : Package avec structure

```python
# setup.py
from setuptools import setup, find_packages

setup(
    name="mon-api",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.95.0",
        "uvicorn>=0.20.0",
    ],
    extras_require={
        "dev": ["pytest>=7.0.0"],
    },
)
```

### Exemple 3 : Package avec données

```python
# setup.py
from setuptools import setup

setup(
    name="mon-package",
    version="0.1.0",
    packages=["mon_package"],
    package_data={
        "mon_package": ["data/*.json", "templates/*.html"],
    },
    include_package_data=True,
)
```

## Bonnes pratiques

### 1. Utilisez pyproject.toml pour les nouveaux projets

```python
# ⚠️ Ancien : setup.py
# ✅ Nouveau : pyproject.toml
```

### 2. Si vous devez utiliser setup.py

```python
# ✅ Utilisez find_packages() pour découvrir automatiquement
from setuptools import setup, find_packages

setup(
    packages=find_packages(),
)
```

### 3. Spécifiez python_requires

```python
# ✅ Spécifier la version Python minimale
setup(
    python_requires=">=3.8",
)
```

### 4. Utilisez long_description depuis README

```python
# ✅ Lire depuis README.md
setup(
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
)
```

## Points clés à retenir

- ✅ `setup.py` est l'**ancienne méthode** de packaging
- ✅ **Préférez pyproject.toml** pour les nouveaux projets
- ✅ `setup.py` reste utilisé pour la **compatibilité** avec d'anciens projets
- ✅ Utilisez `find_packages()` pour **découvrir automatiquement** les packages
- ✅ `install_requires` définit les **dépendances de production**
- ✅ `extras_require` définit les **dépendances optionnelles**
- ✅ `entry_points` permet de créer des **scripts en ligne de commande**

`setup.py` est encore largement utilisé mais est progressivement remplacé par `pyproject.toml`. Comprendre les deux est utile pour maintenir des projets existants et créer de nouveaux packages.
