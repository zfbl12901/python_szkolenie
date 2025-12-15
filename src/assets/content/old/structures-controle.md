# Structures de Contrôle

Les structures de contrôle permettent de modifier le flux d'exécution d'un programme.

## Conditions : if, elif, else

Les instructions conditionnelles permettent d'exécuter du code selon certaines conditions.

```python
age = 18

if age >= 18:
    print("Vous êtes majeur")
elif age >= 13:
    print("Vous êtes adolescent")
else:
    print("Vous êtes mineur")
```

### Opérateurs de comparaison

- `==` : égal à
- `!=` : différent de
- `<` : inférieur à
- `>` : supérieur à
- `<=` : inférieur ou égal à
- `>=` : supérieur ou égal à

### Opérateurs logiques

- `and` : ET logique
- `or` : OU logique
- `not` : NON logique

```python
if age >= 18 and age <= 65:
    print("Personne active")
```

## Boucles : for et while

### Boucle for

La boucle `for` permet d'itérer sur une séquence :

```python
# Itérer sur une liste
fruits = ["pomme", "banane", "orange"]
for fruit in fruits:
    print(fruit)

# Itérer avec range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4
```

### Boucle while

La boucle `while` exécute du code tant qu'une condition est vraie :

```python
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1
```

## Instructions de contrôle

### break

Sort de la boucle immédiatement :

```python
for i in range(10):
    if i == 5:
        break
    print(i)  # Affiche 0 à 4
```

### continue

Passe à l'itération suivante :

```python
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)  # Affiche uniquement les nombres impairs
```

## Exemple pratique

```python
def trouver_nombres_pairs(limite):
    """Trouve tous les nombres pairs jusqu'à une limite"""
    nombres_pairs = []
    for i in range(limite + 1):
        if i % 2 == 0:
            nombres_pairs.append(i)
    return nombres_pairs

resultat = trouver_nombres_pairs(10)
print(resultat)  # [0, 2, 4, 6, 8, 10]
```

## Bonnes pratiques

1. **Évitez les boucles infinies** : Assurez-vous que la condition de `while` peut devenir fausse
2. **Utilisez `for` quand possible** : Plus lisible que `while` pour les itérations
3. **Limitez la profondeur** : Évitez trop de niveaux d'imbrication

