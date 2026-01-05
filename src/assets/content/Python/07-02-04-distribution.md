---
title: "Distribution"
order: 7.02.04
parent: "07-02-packaging.md"
tags: ["python", "distribution", "pypi", "packaging"]
---

# Distribution

Distribuer vos packages Python permet de les partager avec d'autres développeurs, que ce soit publiquement sur PyPI ou en interne dans votre organisation.

## Concepts de base

La **distribution** d'un package Python consiste à :
1. **Builder** le package (créer les fichiers de distribution)
2. **Publier** le package sur un dépôt (PyPI public ou privé)
3. Permettre aux autres d'**installer** votre package avec `pip install`

## Build du package

### Avec build (moderne)

```bash
# Installer build
pip install build

# Builder le package
python -m build

# Génère dans dist/
# - mon-package-0.1.0.tar.gz (source distribution)
# - mon_package-0.1.0-py3-none-any.whl (wheel)
```

### Avec setuptools (ancien)

```bash
# Installer les outils
pip install setuptools wheel

# Builder
python setup.py sdist bdist_wheel

# Génère dans dist/
```

### Avec Poetry

```bash
# Builder avec Poetry
poetry build

# Génère dans dist/
```

## Distribution sur PyPI

### Préparation

```bash
# 1. Créer un compte sur PyPI
# https://pypi.org/account/register/

# 2. Créer un token API
# https://pypi.org/manage/account/token/

# 3. Configurer les credentials
# ~/.pypirc
[pypi]
username = __token__
password = pypi-xxxxxxxxxxxxx
```

### Publication avec twine

```bash
# Installer twine
pip install twine

# Vérifier le package avant publication
twine check dist/*

# Publier sur PyPI de test
twine upload --repository testpypi dist/*

# Publier sur PyPI officiel
twine upload dist/*
```

### Publication avec Poetry

```bash
# Configurer les credentials
poetry config pypi-token.pypi pypi-xxxxxxxxxxxxx

# Publier
poetry publish

# Ou sur un dépôt spécifique
poetry publish --repository private-pypi
```

## Distribution interne

### Serveur PyPI privé

Utilisez un serveur PyPI privé (comme devpi, pypiserver) :

```bash
# Configurer l'index
pip config set global.index-url https://pypi.internal.com/simple

# Publier
twine upload --repository internal dist/*
```

### Distribution via Git

```bash
# Installation depuis Git
pip install git+https://github.com/user/package.git

# Version spécifique
pip install git+https://github.com/user/package.git@v1.0.0
```

### Distribution via fichiers

```bash
# Distribuer les fichiers wheel/sdist
# Les utilisateurs installent avec :
pip install package-1.0.0-py3-none-any.whl
# ou
pip install package-1.0.0.tar.gz
```

## Exemples pratiques

### Exemple 1 : Publication complète

```bash
# 1. Préparer le package
# pyproject.toml ou setup.py configuré

# 2. Builder
python -m build

# 3. Vérifier
twine check dist/*

# 4. Tester sur TestPyPI
twine upload --repository testpypi dist/*

# 5. Installer depuis TestPyPI pour tester
pip install --index-url https://test.pypi.org/simple/ mon-package

# 6. Publier sur PyPI officiel
twine upload dist/*
```

### Exemple 2 : Workflow avec Poetry

```bash
# 1. Configurer pyproject.toml
poetry init
# Remplir les métadonnées

# 2. Builder
poetry build

# 3. Publier
poetry publish

# Ou avec token
poetry config pypi-token.pypi pypi-xxxxxxxxxxxxx
poetry publish
```

## Bonnes pratiques

### 1. Testez sur TestPyPI d'abord

```bash
# ✅ Toujours tester sur TestPyPI
twine upload --repository testpypi dist/*
pip install --index-url https://test.pypi.org/simple/ mon-package
```

### 2. Vérifiez avant de publier

```bash
# ✅ Vérifier le package
twine check dist/*
```

### 3. Utilisez des versions sémantiques

```python
# ✅ Semantic versioning
version = "1.2.3"  # MAJOR.MINOR.PATCH
```

### 4. Documentez les changements

```markdown
# CHANGELOG.md
## [1.2.0] - 2024-01-01
### Added
- Nouvelle fonctionnalité X

## [1.1.1] - 2023-12-01
### Fixed
- Correction du bug Y
```

## Points clés à retenir

- ✅ **Builder** le package avec `python -m build` ou `poetry build`
- ✅ **Tester** sur TestPyPI avant PyPI officiel
- ✅ Utiliser **twine** pour publier sur PyPI
- ✅ **Vérifier** le package avec `twine check` avant publication
- ✅ Utiliser des **versions sémantiques** (1.2.3)
- ✅ **Documenter** les changements dans CHANGELOG.md
- ✅ Pour distribution interne, utiliser un **serveur PyPI privé**

Distribuer vos packages permet de les partager et de les réutiliser. Suivez les bonnes pratiques pour une distribution professionnelle et fiable.
