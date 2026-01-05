---
title: "unittest"
order: 5.03.01
parent: "05-03-tests-qualite.md"
tags: ["python", "unittest", "tests", "framework"]
---

# unittest

`unittest` est le framework de tests standard de Python, inspiré de JUnit, fourni dans la bibliothèque standard. C'est un outil robuste et complet pour écrire et exécuter des tests.

## Concepts de base

`unittest` fournit :
- Une structure de tests basée sur les classes
- Des assertions pour vérifier les résultats
- Des fixtures pour la configuration et le nettoyage
- La découverte automatique de tests
- L'exécution de tests avec rapport détaillé

## Structure des tests

### Classe de test de base

Les tests héritent de `unittest.TestCase` :

```python
import unittest

class TestCalculatrice(unittest.TestCase):
    """Tests pour la classe Calculatrice."""
    
    def test_addition(self):
        """Test de l'addition."""
        resultat = 2 + 3
        self.assertEqual(resultat, 5)
    
    def test_soustraction(self):
        """Test de la soustraction."""
        resultat = 5 - 3
        self.assertEqual(resultat, 2)
```

### Méthodes de test

Les méthodes de test doivent commencer par `test_` :

```python
import unittest

class TestExemples(unittest.TestCase):
    def test_simple(self):
        """Test simple."""
        self.assertTrue(True)
    
    def test_nombre(self):
        """Test avec un nombre."""
        self.assertEqual(2 + 2, 4)
    
    # ❌ Ne sera pas exécuté (ne commence pas par test_)
    def verification(self):
        self.assertTrue(False)
```

## Assertions

### Assertions de base

```python
import unittest

class TestAssertions(unittest.TestCase):
    def test_assert_equal(self):
        """Vérifie l'égalité."""
        self.assertEqual(2 + 2, 4)
        self.assertEqual("hello", "hello")
    
    def test_assert_not_equal(self):
        """Vérifie l'inégalité."""
        self.assertNotEqual(2 + 2, 5)
    
    def test_assert_true(self):
        """Vérifie qu'une valeur est True."""
        self.assertTrue(True)
        self.assertTrue(1 == 1)
    
    def test_assert_false(self):
        """Vérifie qu'une valeur est False."""
        self.assertFalse(False)
        self.assertFalse(1 == 2)
    
    def test_assert_is_none(self):
        """Vérifie qu'une valeur est None."""
        self.assertIsNone(None)
    
    def test_assert_is_not_none(self):
        """Vérifie qu'une valeur n'est pas None."""
        self.assertIsNotNone(42)
    
    def test_assert_in(self):
        """Vérifie l'appartenance."""
        self.assertIn(2, [1, 2, 3])
        self.assertIn("a", "hello")
    
    def test_assert_not_in(self):
        """Vérifie la non-appartenance."""
        self.assertNotIn(5, [1, 2, 3])
    
    def test_assert_is_instance(self):
        """Vérifie le type."""
        self.assertIsInstance(42, int)
        self.assertIsInstance("hello", str)
```

### Assertions avec messages

```python
import unittest

class TestAvecMessages(unittest.TestCase):
    def test_avec_message(self):
        """Test avec message d'erreur personnalisé."""
        resultat = 2 + 2
        self.assertEqual(
            resultat,
            4,
            f"2 + 2 devrait être 4, mais a retourné {resultat}"
        )
```

### Assertions pour les exceptions

```python
import unittest

class TestExceptions(unittest.TestCase):
    def test_raise_exception(self):
        """Vérifie qu'une exception est levée."""
        with self.assertRaises(ValueError):
            int("abc")
    
    def test_raise_exception_with_message(self):
        """Vérifie l'exception et son message."""
        with self.assertRaises(ValueError) as context:
            int("abc")
        
        self.assertIn("invalid literal", str(context.exception))
    
    def test_raise_exception_regex(self):
        """Vérifie l'exception avec regex."""
        with self.assertRaisesRegex(ValueError, "invalid literal"):
            int("abc")
```

## Organisation des tests

### Structure de fichiers

```
projet/
├── src/
│   └── calculatrice.py
└── tests/
    └── test_calculatrice.py
```

### Exemple complet

```python
# src/calculatrice.py
class Calculatrice:
    def additionner(self, a, b):
        return a + b
    
    def soustraire(self, a, b):
        return a - b
    
    def multiplier(self, a, b):
        return a * b
    
    def diviser(self, a, b):
        if b == 0:
            raise ValueError("Division par zéro")
        return a / b
```

```python
# tests/test_calculatrice.py
import unittest
from src.calculatrice import Calculatrice

class TestCalculatrice(unittest.TestCase):
    """Tests pour la classe Calculatrice."""
    
    def setUp(self):
        """Configuration avant chaque test."""
        self.calc = Calculatrice()
    
    def tearDown(self):
        """Nettoyage après chaque test."""
        pass
    
    def test_additionner(self):
        """Test de l'addition."""
        resultat = self.calc.additionner(5, 3)
        self.assertEqual(resultat, 8)
    
    def test_soustraire(self):
        """Test de la soustraction."""
        resultat = self.calc.soustraire(5, 3)
        self.assertEqual(resultat, 2)
    
    def test_multiplier(self):
        """Test de la multiplication."""
        resultat = self.calc.multiplier(5, 3)
        self.assertEqual(resultat, 15)
    
    def test_diviser(self):
        """Test de la division."""
        resultat = self.calc.diviser(10, 2)
        self.assertEqual(resultat, 5)
    
    def test_diviser_par_zero(self):
        """Test de la division par zéro."""
        with self.assertRaises(ValueError):
            self.calc.diviser(10, 0)

if __name__ == '__main__':
    unittest.main()
```

## Exécution des tests

### Exécution basique

```bash
# Exécuter tous les tests dans un fichier
python -m unittest test_calculatrice.py

# Exécuter un test spécifique
python -m unittest test_calculatrice.TestCalculatrice.test_additionner

# Exécuter tous les tests dans un module
python -m unittest discover tests

# Mode verbeux
python -m unittest -v test_calculatrice.py
```

### Dans le code

```python
if __name__ == '__main__':
    unittest.main()
```

Puis exécutez :
```bash
python test_calculatrice.py
```

## Fixtures (setUp et tearDown)

### setUp et tearDown

```python
import unittest

class TestAvecFixtures(unittest.TestCase):
    def setUp(self):
        """Exécuté avant chaque test."""
        self.liste = [1, 2, 3]
        self.fichier = open("test.txt", "w")
    
    def tearDown(self):
        """Exécuté après chaque test."""
        self.fichier.close()
        import os
        if os.path.exists("test.txt"):
            os.remove("test.txt")
    
    def test_liste(self):
        """Test qui utilise la fixture."""
        self.assertEqual(len(self.liste), 3)
        self.liste.append(4)
        self.assertEqual(len(self.liste), 4)
    
    def test_liste_encore(self):
        """Un autre test avec la même fixture."""
        # La liste est réinitialisée par setUp
        self.assertEqual(len(self.liste), 3)
```

### setUpClass et tearDownClass

```python
import unittest

class TestAvecSetupClass(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Exécuté une fois avant tous les tests."""
        cls.donnees_partagees = [1, 2, 3, 4, 5]
        print("Setup class")
    
    @classmethod
    def tearDownClass(cls):
        """Exécuté une fois après tous les tests."""
        print("Teardown class")
    
    def test_1(self):
        """Premier test."""
        self.assertIn(1, self.donnees_partagees)
    
    def test_2(self):
        """Deuxième test."""
        self.assertIn(2, self.donnees_partagees)
```

## Exemples pratiques

### Exemple 1 : Tests de validation

```python
import unittest

def valider_email(email):
    """Valide une adresse email."""
    if "@" not in email:
        raise ValueError("Email invalide: pas de @")
    if "." not in email.split("@")[1]:
        raise ValueError("Email invalide: pas de domaine valide")
    return True

class TestValidationEmail(unittest.TestCase):
    def test_email_valide(self):
        """Test avec email valide."""
        self.assertTrue(valider_email("alice@example.com"))
    
    def test_email_sans_arobase(self):
        """Test avec email sans @."""
        with self.assertRaises(ValueError):
            valider_email("aliceexample.com")
    
    def test_email_sans_domaine(self):
        """Test avec email sans domaine."""
        with self.assertRaises(ValueError):
            valider_email("alice@")
```

### Exemple 2 : Tests avec mocks

```python
import unittest
from unittest.mock import Mock, patch

class TestAvecMock(unittest.TestCase):
    def test_avec_mock(self):
        """Test avec un mock."""
        mock_obj = Mock()
        mock_obj.methode.return_value = 42
        
        resultat = mock_obj.methode()
        self.assertEqual(resultat, 42)
        mock_obj.methode.assert_called_once()
    
    @patch('builtins.print')
    def test_avec_patch(self, mock_print):
        """Test avec patch."""
        print("Hello")
        mock_print.assert_called_once_with("Hello")
```

## Bonnes pratiques

### 1. Un test = une vérification

```python
# ✅ Bon : un test, une vérification
def test_addition(self):
    self.assertEqual(2 + 2, 4)

def test_soustraction(self):
    self.assertEqual(5 - 3, 2)

# ⚠️ Moins bon : plusieurs vérifications dans un test
def test_operations(self):
    self.assertEqual(2 + 2, 4)
    self.assertEqual(5 - 3, 2)
    self.assertEqual(2 * 3, 6)
```

### 2. Noms de tests descriptifs

```python
# ✅ Bon : nom descriptif
def test_addition_de_nombres_positifs(self):
    pass

# ❌ Mauvais : nom vague
def test1(self):
    pass
```

### 3. Utilisez setUp pour la configuration

```python
# ✅ Bon : utilise setUp
def setUp(self):
    self.calc = Calculatrice()

def test_addition(self):
    resultat = self.calc.additionner(2, 3)
    self.assertEqual(resultat, 5)
```

## Points clés à retenir

- ✅ Les tests héritent de `unittest.TestCase`
- ✅ Les méthodes de test commencent par `test_`
- ✅ Utilisez `setUp()` et `tearDown()` pour la configuration
- ✅ Utilisez `setUpClass()` et `tearDownClass()` pour la configuration de classe
- ✅ Les assertions vérifient les résultats attendus
- ✅ `assertRaises()` vérifie qu'une exception est levée
- ✅ Exécutez avec `python -m unittest` ou `unittest.main()`
- ✅ Organisez vos tests dans des classes logiques

`unittest` est un framework robuste et complet. Bien qu'il soit plus verbeux que pytest, il est inclus dans la bibliothèque standard et est largement utilisé dans l'écosystème Python.
