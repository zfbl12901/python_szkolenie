# Variables et Types

Les variables sont des conteneurs qui stockent des valeurs. Elles sont fondamentales en programmation.

## Déclaration de variables

Une variable est déclarée avec un nom et un type (ou sans type dans certains langages).

```python
# Exemple en Python
nom = "Alice"
age = 25
taille = 1.75
est_etudiant = True
```

## Types de données courants

### Types numériques

- **Entiers (int)** : Nombres entiers positifs ou négatifs
- **Flottants (float)** : Nombres décimaux

```python
nombre_entier = 42
nombre_decimal = 3.14
```

### Types textuels

- **Chaînes de caractères (string)** : Texte entre guillemets

```python
message = "Bonjour le monde"
nom = 'Alice'
```

### Types booléens

- **Booléen (bool)** : `True` ou `False`

```python
est_actif = True
est_complete = False
```

## Bonnes pratiques

1. **Noms explicites** : Utilisez des noms qui décrivent clairement la variable
2. **Conventions de nommage** : Respectez les conventions de votre langage
3. **Initialisation** : Toujours initialiser vos variables

```python
# Bon
nombre_de_utilisateurs = 10
est_connecte = True

# À éviter
n = 10
x = True
```

## Portée des variables

Les variables ont une portée (scope) qui définit où elles peuvent être utilisées.

- **Variables locales** : Accessibles uniquement dans leur fonction
- **Variables globales** : Accessibles partout dans le programme

