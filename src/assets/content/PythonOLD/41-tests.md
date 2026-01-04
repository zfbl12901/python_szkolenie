---
title: "Tests et Qualité de Code"
order: 41
parent: null
tags: ["python", "tests", "quality", "pytest", "unittest"]
---

# Tests et Qualité de Code

## Introduction

Les tests sont essentiels pour garantir la qualité, la fiabilité et la maintenabilité du code. Un code bien testé est plus facile à refactorer, à faire évoluer et donne confiance lors des déploiements.

### Pourquoi tester ?

| Avantage | Description |
|----------|-------------|
| **Confiance** | Déployer sans crainte de casser quelque chose |
| **Documentation** | Les tests documentent le comportement attendu |
| **Refactoring** | Modifier le code en toute sécurité |
| **Qualité** | Détecter les bugs tôt dans le cycle |
| **Design** | Encourage un meilleur design (testable = modulaire) |
| **Régression** | Éviter que les bugs corrigés ne reviennent |

### La pyramide des tests

```
                    ┌─────────────┐
                    │     E2E     │  ← Peu nombreux, lents
                    │   (UI/API)  │
                    └─────────────┘
                  ┌───────────────────┐
                  │   INTÉGRATION     │  ← Moyennement nombreux
                  │  (Composants)     │
                  └───────────────────┘
              ┌─────────────────────────────┐
              │      TESTS UNITAIRES        │  ← Nombreux, rapides
              │       (Fonctions)           │
              └─────────────────────────────┘
```

**Principe** : Plus on monte dans la pyramide, moins on a de tests (mais plus ils sont complets).

### Types de tests

| Type | Scope | Vitesse | Quantité |
|------|-------|---------|----------|
| **Unitaires** | Fonction/Méthode | Très rapide | 70% |
| **Intégration** | Plusieurs composants | Moyen | 20% |
| **E2E** | Application complète | Lent | 10% |
| **Performance** | Benchmarks | Variable | Ad-hoc |
| **Sécurité** | Vulnérabilités | Moyen | Ad-hoc |

## Frameworks de tests Python

### pytest (Recommandé)

Le framework le plus populaire et moderne.

```python
# test_example.py
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0
```

**Avantages** :
- ✅ Syntaxe simple (assert natif)
- ✅ Fixtures puissantes
- ✅ Plugins nombreux
- ✅ Découverte automatique des tests
- ✅ Rapports détaillés

### unittest (Standard Library)

Framework intégré à Python.

```python
# test_example.py
import unittest

class TestMath(unittest.TestCase):
    def test_add(self):
        self.assertEqual(2 + 3, 5)
    
    def test_subtract(self):
        self.assertEqual(5 - 3, 2)

if __name__ == '__main__':
    unittest.main()
```

**Avantages** :
- ✅ Pas de dépendance externe
- ✅ Style xUnit familier
- ✅ Bien documenté

### Autres frameworks

| Framework | Usage |
|-----------|-------|
| **doctest** | Tests dans les docstrings |
| **nose2** | Extension de unittest |
| **hypothesis** | Property-based testing |
| **Robot Framework** | Tests d'acceptation |

## Concepts clés

### Test-Driven Development (TDD)

```
┌─────────────────────────────────────────────────┐
│              CYCLE TDD                          │
│                                                 │
│   1. RED    →   2. GREEN   →   3. REFACTOR    │
│   Écrire       Faire          Améliorer        │
│   un test      passer         le code          │
│   qui échoue   le test                         │
│                                                 │
│        ↓            ↓              ↓            │
│        └────────────┴──────────────┘            │
│                    ↓                            │
│                 RÉPÉTER                         │
└─────────────────────────────────────────────────┘
```

**Exemple TDD** :

```python
# 1. RED - Écrire le test d'abord
def test_calculate_discount():
    assert calculate_discount(100, 10) == 90
    assert calculate_discount(50, 20) == 40

# 2. GREEN - Implémenter le minimum
def calculate_discount(price, discount_percent):
    return price - (price * discount_percent / 100)

# 3. REFACTOR - Améliorer
def calculate_discount(price, discount_percent):
    """Calcule le prix après réduction"""
    if not 0 <= discount_percent <= 100:
        raise ValueError("Discount must be between 0 and 100")
    return price * (1 - discount_percent / 100)
```

### Arrange-Act-Assert (AAA)

Pattern pour structurer les tests :

```python
def test_user_registration():
    # ARRANGE - Préparer les données
    username = "john_doe"
    email = "john@example.com"
    
    # ACT - Exécuter l'action
    user = register_user(username, email)
    
    # ASSERT - Vérifier le résultat
    assert user.username == username
    assert user.email == email
    assert user.is_active is True
```

### Fixtures

Préparer l'environnement de test :

```python
import pytest

@pytest.fixture
def database():
    """Fixture pour créer une DB de test"""
    db = create_test_database()
    yield db  # Fournir la DB aux tests
    db.cleanup()  # Nettoyer après les tests

def test_user_creation(database):
    user = database.create_user("john")
    assert user.name == "john"
```

### Mocking

Simuler des dépendances externes :

```python
from unittest.mock import Mock, patch

def test_send_email():
    # Mock du service email
    with patch('myapp.email.send') as mock_send:
        mock_send.return_value = True
        
        result = send_welcome_email("user@example.com")
        
        assert result is True
        mock_send.assert_called_once_with("user@example.com", "Welcome!")
```

## Couverture de code

### Mesurer la couverture

```bash
# Installer pytest-cov
pip install pytest-cov

# Lancer les tests avec couverture
pytest --cov=myapp tests/

# Générer un rapport HTML
pytest --cov=myapp --cov-report=html tests/

# Rapport détaillé
pytest --cov=myapp --cov-report=term-missing tests/
```

### Interpréter la couverture

```
Name                Stmts   Miss  Cover   Missing
-------------------------------------------------
myapp/__init__.py       4      0   100%
myapp/models.py        45      5    89%   23-27
myapp/views.py         67     12    82%   45, 67-78
myapp/utils.py         23      0   100%
-------------------------------------------------
TOTAL                 139     17    88%
```

**Objectifs** :
- 🎯 **80%+** : Bon niveau de couverture
- 🎯 **90%+** : Excellent niveau
- ⚠️ **100%** : Pas toujours nécessaire (coût/bénéfice)

### Configuration coverage

```ini
# .coveragerc
[run]
source = myapp
omit = 
    */tests/*
    */venv/*
    */__pycache__/*

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
    if __name__ == .__main__.:
    if TYPE_CHECKING:
```

## Qualité de code

### Linters

**flake8** : Vérification de style

```bash
pip install flake8
flake8 myapp/

# Configuration
# .flake8
[flake8]
max-line-length = 100
exclude = .git,__pycache__,venv
ignore = E203,W503
```

**pylint** : Analyse statique avancée

```bash
pip install pylint
pylint myapp/

# Configuration
# .pylintrc
[MASTER]
max-line-length=100

[MESSAGES CONTROL]
disable=C0111,R0903
```

**mypy** : Vérification des types

```bash
pip install mypy
mypy myapp/

# mypy.ini
[mypy]
python_version = 3.11
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True
```

### Formatters

**black** : Formatage automatique

```bash
pip install black
black myapp/

# pyproject.toml
[tool.black]
line-length = 100
target-version = ['py311']
```

**isort** : Tri des imports

```bash
pip install isort
isort myapp/

# .isort.cfg
[settings]
profile = black
line_length = 100
```

### Pre-commit hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.12.0
    hooks:
      - id: black

  - repo: https://github.com/pycqa/isort
    rev: 5.13.0
    hooks:
      - id: isort

  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.7.1
    hooks:
      - id: mypy
```

```bash
# Installation
pip install pre-commit
pre-commit install

# Exécution manuelle
pre-commit run --all-files
```

## Organisation des tests

### Structure recommandée

```
mon_projet/
│
├── myapp/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   └── utils.py
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Fixtures partagées
│   │
│   ├── unit/                # Tests unitaires
│   │   ├── __init__.py
│   │   ├── test_models.py
│   │   ├── test_views.py
│   │   └── test_utils.py
│   │
│   ├── integration/         # Tests d'intégration
│   │   ├── __init__.py
│   │   ├── test_api.py
│   │   └── test_database.py
│   │
│   └── e2e/                 # Tests end-to-end
│       ├── __init__.py
│       └── test_user_flow.py
│
├── pytest.ini               # Configuration pytest
├── .coveragerc             # Configuration coverage
└── requirements-dev.txt    # Dépendances de test
```

### Conventions de nommage

```python
# Fichiers de test
test_*.py  ou  *_test.py

# Fonctions de test
def test_function_name():
    pass

# Classes de test
class TestClassName:
    def test_method_name(self):
        pass

# Fixtures
@pytest.fixture
def fixture_name():
    pass
```

## Continuous Testing

### Configuration pytest.ini

```ini
# pytest.ini
[pytest]
minversion = 6.0
addopts = 
    -ra
    -q
    --strict-markers
    --cov=myapp
    --cov-report=term-missing
    --cov-report=html
    --cov-fail-under=80
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
    unit: marks tests as unit tests
    smoke: marks tests as smoke tests
```

### Exécution sélective

```bash
# Tous les tests
pytest

# Tests d'un fichier
pytest tests/test_models.py

# Tests d'une classe
pytest tests/test_models.py::TestUser

# Tests d'une fonction
pytest tests/test_models.py::test_user_creation

# Tests par marker
pytest -m unit
pytest -m "not slow"
pytest -m "integration or e2e"

# Tests par nom
pytest -k "user"
pytest -k "not slow"

# Verbose
pytest -v

# Arrêter au premier échec
pytest -x

# Mode parallèle
pytest -n auto
```

## Bonnes pratiques

### ✅ À faire

1. **Tests indépendants** : Chaque test doit pouvoir s'exécuter seul
2. **Tests déterministes** : Même input = même output
3. **Tests rapides** : Les tests unitaires doivent être très rapides
4. **Noms explicites** : `test_user_cannot_login_with_wrong_password()`
5. **Un concept par test** : Tester une seule chose à la fois
6. **Arrange-Act-Assert** : Structurer clairement les tests
7. **Fixtures réutilisables** : DRY pour la préparation des tests
8. **Coverage significatif** : Tester les cas limites et erreurs
9. **Tests dans le CI** : Automatiser l'exécution
10. **Documentation** : Commenter les tests complexes

### ❌ À éviter

1. **Tests dépendants** : Un test ne doit pas dépendre d'un autre
2. **Tests flaky** : Tests qui échouent aléatoirement
3. **Tests trop lents** : Optimiser ou marquer comme `@slow`
4. **Tester l'implémentation** : Tester le comportement, pas le code
5. **Ignorer les tests qui échouent** : Corriger ou supprimer
6. **Pas de tests pour les bugs** : Toujours ajouter un test de régression
7. **Mocking excessif** : Ne pas tout mocker
8. **Tests incompréhensibles** : Clarté avant concision
9. **Duplication** : Utiliser des fixtures et helpers
10. **Oublier les cas limites** : Tester les erreurs et edge cases

## Contenu de cette section

Cette section couvre tous les aspects des tests en Python :

### 📖 Modules théoriques

1. **[Pytest - Framework de Tests](41-01-pytest.md)**
   - Installation et configuration
   - Fixtures et parametrize
   - Plugins essentiels
   - Mocking et patching

2. **[Tests Unitaires](41-02-tests-unitaires.md)**
   - Principes des tests unitaires
   - TDD en pratique
   - Tester différents types de code
   - Exemples complets

3. **[Tests d'Intégration](41-03-tests-d-integration.md)**
   - Tests avec base de données
   - Tests d'API
   - Tests avec dépendances externes
   - Docker pour les tests

## Parcours recommandé

### Niveau 1 : Fondations (1 semaine)
- Comprendre les types de tests
- Écrire des tests simples avec pytest
- Mesurer la couverture de code
- Configurer les linters

### Niveau 2 : Intermédiaire (2 semaines)
- Maîtriser les fixtures pytest
- Pratiquer le TDD
- Tests d'intégration avec DB
- Mocking avancé

### Niveau 3 : Avancé (2 semaines)
- Tests de performance
- Property-based testing
- Tests E2E
- CI/CD avec tests automatisés

## Métriques de qualité

### Code Quality Score

```python
# Calculer un score de qualité
def calculate_quality_score():
    metrics = {
        'coverage': 85,        # % de couverture
        'pylint': 9.2,        # Score pylint (0-10)
        'complexity': 3.5,    # Complexité cyclomatique moyenne
        'duplicates': 2,      # % de code dupliqué
        'violations': 5       # Nombre de violations
    }
    
    score = (
        metrics['coverage'] * 0.3 +
        metrics['pylint'] * 10 * 0.3 +
        (10 - metrics['complexity']) * 10 * 0.2 +
        (100 - metrics['duplicates']) * 0.1 +
        max(0, 100 - metrics['violations'] * 2) * 0.1
    )
    
    return round(score, 2)
```

### Objectifs

| Métrique | Objectif | Excellent |
|----------|----------|-----------|
| **Coverage** | 80% | 90%+ |
| **Pylint** | 8.0 | 9.5+ |
| **Complexity** | < 10 | < 5 |
| **Duplicates** | < 5% | < 2% |
| **Build time** | < 5min | < 2min |

## Outils complémentaires

### Analyse de code

```bash
# Complexité cyclomatique
pip install radon
radon cc myapp/ -a

# Duplication de code
pip install pylint
pylint --disable=all --enable=duplicate-code myapp/

# Sécurité
pip install bandit
bandit -r myapp/

# Dépendances vulnérables
pip install safety
safety check
```

### Documentation

```bash
# Générer la documentation
pip install sphinx
sphinx-quickstart
sphinx-build -b html docs/ docs/_build/

# Docstring coverage
pip install interrogate
interrogate myapp/
```

## Ressources

- **pytest** : https://docs.pytest.org
- **unittest** : https://docs.python.org/3/library/unittest.html
- **Coverage.py** : https://coverage.readthedocs.io
- **Test Driven Development** : Kent Beck
- **Clean Code** : Robert C. Martin
- **Working Effectively with Legacy Code** : Michael Feathers

## Conclusion

Les tests et la qualité de code ne sont pas optionnels pour du code professionnel. Ils sont un investissement qui se rentabilise rapidement en :
- 🚀 Réduisant les bugs en production
- 💰 Diminuant le temps de debugging
- 🔄 Facilitant le refactoring
- 📈 Améliorant la maintenabilité
- 😌 Augmentant la confiance de l'équipe**"Code without tests is broken by design"** - Jacob Kaplan-Moss
