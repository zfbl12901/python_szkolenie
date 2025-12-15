# Fonctions

Les fonctions sont des blocs de code réutilisables qui effectuent une tâche spécifique.

## Définition d'une fonction

Une fonction est définie avec le mot-clé `def` (en Python) ou `function` (en JavaScript).

```python
def saluer(nom):
    """Affiche un message de salutation"""
    return f"Bonjour, {nom} !"

# Appel de la fonction
message = saluer("Alice")
print(message)  # Affiche: Bonjour, Alice !
```

## Paramètres et arguments

Les fonctions peuvent accepter des paramètres :

```python
def additionner(a, b):
    """Additionne deux nombres"""
    return a + b

resultat = additionner(5, 3)  # 8
```

### Paramètres par défaut

Vous pouvez définir des valeurs par défaut :

```python
def saluer(nom, langue="fr"):
    if langue == "fr":
        return f"Bonjour, {nom} !"
    elif langue == "en":
        return f"Hello, {nom} !"

saluer("Alice")  # "Bonjour, Alice !"
saluer("Bob", "en")  # "Hello, Bob !"
```

## Valeurs de retour

Les fonctions peuvent retourner des valeurs avec `return` :

```python
def calculer_carre(nombre):
    return nombre ** 2

carre_de_5 = calculer_carre(5)  # 25
```

## Fonctions anonymes (lambda)

Les fonctions lambda sont des fonctions courtes et anonymes :

```python
# Fonction normale
def multiplier_par_deux(x):
    return x * 2

# Fonction lambda équivalente
multiplier = lambda x: x * 2

resultat = multiplier(5)  # 10
```

## Bonnes pratiques

1. **Un seul objectif** : Une fonction doit faire une seule chose
2. **Noms descriptifs** : Le nom doit décrire ce que fait la fonction
3. **Documentation** : Utilisez des docstrings pour documenter vos fonctions
4. **Taille raisonnable** : Évitez les fonctions trop longues

```python
def calculer_moyenne(nombres):
    """
    Calcule la moyenne d'une liste de nombres.
    
    Args:
        nombres: Liste de nombres
        
    Returns:
        La moyenne des nombres
    """
    if not nombres:
        return 0
    return sum(nombres) / len(nombres)
```

