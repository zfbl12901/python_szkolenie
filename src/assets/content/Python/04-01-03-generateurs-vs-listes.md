---
title: "Générateurs vs listes"
order: 4.01.03
parent: "04-01-iterateurs-et-generateurs.md"
tags: ["python", "generateurs", "listes", "performance"]
---

# Générateurs vs listes

Comprendre quand utiliser des générateurs plutôt que des listes est crucial pour optimiser la mémoire et les performances. Chaque approche a ses avantages et ses cas d'usage.

## Concepts de base

Les **listes** stockent toutes les valeurs en mémoire immédiatement, tandis que les **générateurs** produisent les valeurs à la demande. Cette différence fondamentale impacte la mémoire, les performances et les cas d'usage.

## Avantages des générateurs

### 1. Efficacité mémoire

Les générateurs ne stockent pas toutes les valeurs en mémoire :

```python
import sys

# Liste : toutes les valeurs en mémoire
liste = [i ** 2 for i in range(1000000)]
print(sys.getsizeof(liste))  # ~8448728 bytes (environ 8 MB)

# Générateur : aucune valeur stockée
gen = (i ** 2 for i in range(1000000))
print(sys.getsizeof(gen))  # ~128 bytes (seulement l'objet générateur)
```

### 2. Évaluation paresseuse

Les valeurs sont calculées seulement quand nécessaire :

```python
def carres_liste(n):
    print("Création de la liste...")
    return [i ** 2 for i in range(n)]

def carres_gen(n):
    print("Création du générateur...")
    for i in range(n):
        print(f"Génération de {i ** 2}")
        yield i ** 2

# Liste : tout est calculé immédiatement
liste = carres_liste(5)  # "Création de la liste..." (tout calculé)
print(liste[0])  # 0

# Générateur : calculé à la demande
gen = carres_gen(5)  # "Création du générateur..." (rien calculé)
print(next(gen))  # "Génération de 0", puis 0
print(next(gen))  # "Génération de 1", puis 1
```

### 3. Séquences infinies

Les générateurs peuvent produire des séquences infinies :

```python
# ✅ Générateur infini
def nombres_infinis():
    i = 0
    while True:
        yield i
        i += 1

gen = nombres_infinis()
for i, nombre in enumerate(gen):
    if i >= 10:
        break
    print(nombre)  # 0, 1, 2, 3, 4, 5, 6, 7, 8, 9

# ❌ Impossible avec une liste
# liste = [i for i in range(float('inf'))]  # Impossible!
```

### 4. Arrêt précoce

Vous pouvez arrêter l'itération sans calculer toutes les valeurs :

```python
def carres_gen(n):
    for i in range(n):
        yield i ** 2

# Arrêt après 5 valeurs (seulement 5 calculs)
gen = carres_gen(1000000)
for i, carre in enumerate(gen):
    if i >= 5:
        break
    print(carre)  # 0, 1, 4, 9, 16 (seulement 5 calculs)

# Avec une liste, tout serait calculé
liste = [i ** 2 for i in range(1000000)]  # Tous les calculs effectués
```

## Avantages des listes

### 1. Accès aléatoire

Les listes permettent l'accès par index :

```python
liste = [i ** 2 for i in range(10)]
print(liste[5])   # 25 (accès direct)
print(liste[-1])  # 81 (dernier élément)

# ❌ Générateur : pas d'accès par index
gen = (i ** 2 for i in range(10))
# print(gen[5])  # TypeError: 'generator' object is not subscriptable
```

### 2. Itération multiple

Les listes peuvent être itérées plusieurs fois :

```python
liste = [1, 2, 3, 4, 5]

# ✅ Itération multiple
for item in liste:
    print(item)  # 1, 2, 3, 4, 5

for item in liste:
    print(item)  # 1, 2, 3, 4, 5 (fonctionne encore)

# ❌ Générateur : une seule itération
gen = (i for i in range(5))
for item in gen:
    print(item)  # 0, 1, 2, 3, 4

for item in gen:
    print(item)  # Rien (générateur épuisé)
```

### 3. Opérations de liste

Les listes supportent de nombreuses opérations :

```python
liste = [1, 2, 3, 4, 5]

# ✅ Opérations disponibles
print(len(liste))        # 5
print(liste.count(3))    # 1
print(liste.index(3))    # 2
liste.append(6)          # Ajout
liste.sort()             # Tri
liste.reverse()          # Inversion

# ❌ Générateur : opérations limitées
gen = (i for i in range(5))
# print(len(gen))  # TypeError: object of type 'generator' has no len()
```

### 4. Debugging plus facile

Les listes sont plus faciles à inspecter :

```python
liste = [1, 2, 3, 4, 5]
print(liste)  # [1, 2, 3, 4, 5] (facile à voir)

gen = (i for i in range(5))
print(gen)  # <generator object <genexpr> at 0x...> (pas très utile)
```

## Comparaison mémoire

### Exemple concret

```python
import sys

# Liste : toutes les valeurs en mémoire
def carres_liste(n):
    return [i ** 2 for i in range(n)]

# Générateur : valeurs produites à la demande
def carres_gen(n):
    for i in range(n):
        yield i ** 2

# Comparaison
n = 1000000

liste = carres_liste(n)
print(f"Liste: {sys.getsizeof(liste) / 1024 / 1024:.2f} MB")

gen = carres_gen(n)
print(f"Générateur: {sys.getsizeof(gen) / 1024:.2f} KB")
```

### Impact sur la mémoire

Pour de grandes séquences, la différence est significative :

```python
# 10 millions de nombres
n = 10000000

# Liste : ~80 MB en mémoire
liste = list(range(n))

# Générateur : ~128 bytes
gen = range(n)  # range() est un générateur-like

# Si vous n'avez besoin que de quelques valeurs
for i, valeur in enumerate(gen):
    if i >= 100:
        break
    print(valeur)  # Seulement 100 valeurs utilisées
```

## Quand utiliser chaque approche

### Utilisez des générateurs quand :

1. **Séquences grandes ou infinies**
```python
def lire_fichier_lignes(nom_fichier):
    with open(nom_fichier) as f:
        for ligne in f:
            yield ligne  # ✅ Générateur pour fichiers
```

2. **Vous n'avez besoin que de quelques valeurs**
```python
def trouver_premier_pair(gen):
    for valeur in gen:
        if valeur % 2 == 0:
            return valeur  # ✅ Arrêt précoce possible
```

3. **Pipeline de traitement**
```python
def pipeline(donnees):
    gen1 = filtrer(donnees)
    gen2 = transformer(gen1)
    gen3 = agreger(gen2)
    return gen3  # ✅ Pipeline efficace
```

4. **Séquences infinies**
```python
def nombres_naturels():
    i = 0
    while True:
        yield i
        i += 1  # ✅ Infini possible
```

### Utilisez des listes quand :

1. **Accès aléatoire nécessaire**
```python
liste = [1, 2, 3, 4, 5]
print(liste[2])  # ✅ Accès par index
```

2. **Itération multiple**
```python
liste = [1, 2, 3]
for item in liste:
    pass
for item in liste:  # ✅ Fonctionne encore
    pass
```

3. **Opérations de liste nécessaires**
```python
liste = [3, 1, 4, 1, 5]
liste.sort()      # ✅ Tri
liste.reverse()   # ✅ Inversion
print(liste.count(1))  # ✅ Comptage
```

4. **Séquence petite et utilisée plusieurs fois**
```python
liste = [1, 2, 3, 4, 5]  # ✅ Petite liste, OK en mémoire
```

## Exemples comparatifs

### Exemple 1 : Traitement de fichier

```python
# ❌ Liste : charge tout en mémoire
def lire_fichier_liste(nom_fichier):
    with open(nom_fichier) as f:
        return f.readlines()  # Toutes les lignes en mémoire

# ✅ Générateur : ligne par ligne
def lire_fichier_gen(nom_fichier):
    with open(nom_fichier) as f:
        for ligne in f:
            yield ligne.rstrip('\n')  # Une ligne à la fois
```

### Exemple 2 : Filtrage

```python
# ❌ Liste : filtre tout d'abord
nombres = list(range(1000000))
pairs = [n for n in nombres if n % 2 == 0]  # Toute la liste filtrée

# ✅ Générateur : filtre à la demande
nombres = range(1000000)
pairs = (n for n in nombres if n % 2 == 0)  # Filtrage paresseux
```

### Exemple 3 : Transformation

```python
# ❌ Liste : transforme tout
carres = [i ** 2 for i in range(1000000)]  # Tous calculés

# ✅ Générateur : transforme à la demande
carres = (i ** 2 for i in range(1000000))  # Calculés à la demande
```

## Conversion entre listes et générateurs

### Générateur → Liste

```python
gen = (i ** 2 for i in range(10))
liste = list(gen)  # Convertit en liste
print(liste)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

### Liste → Générateur

```python
liste = [1, 2, 3, 4, 5]
gen = iter(liste)  # Crée un itérateur (similaire à un générateur)
# ou
gen = (x for x in liste)  # Expression génératrice
```

## Bonnes pratiques

### 1. Utilisez des générateurs pour les grandes séquences

```python
# ✅ Générateur
def traiter_donnees():
    for i in range(1000000):
        yield traiter(i)

# ❌ Liste
def traiter_donnees_liste():
    return [traiter(i) for i in range(1000000)]
```

### 2. Convertissez en liste seulement si nécessaire

```python
gen = (i ** 2 for i in range(10))

# ✅ Conversion seulement si besoin d'accès aléatoire
if besoin_acces_aleatoire:
    liste = list(gen)
    print(liste[5])
else:
    for valeur in gen:
        print(valeur)
```

### 3. Utilisez des list comprehensions pour les petites séquences

```python
# ✅ Liste pour petite séquence
carres = [i ** 2 for i in range(10)]

# ✅ Générateur pour grande séquence
carres = (i ** 2 for i in range(1000000))
```

## Points clés à retenir

- ✅ **Générateurs** : Efficaces en mémoire, évaluation paresseuse, séquences infinies
- ✅ **Listes** : Accès aléatoire, itération multiple, opérations de liste
- ✅ Utilisez des **générateurs** pour les grandes séquences ou quand vous n'avez besoin que de quelques valeurs
- ✅ Utilisez des **listes** pour l'accès aléatoire, l'itération multiple, ou les petites séquences
- ✅ Les générateurs sont **épuisés** après une itération
- ✅ Convertissez en liste seulement si **nécessaire**
- ✅ Choisissez selon vos **besoins spécifiques** : mémoire, accès, itérations

Le choix entre générateurs et listes dépend de vos besoins. Comprendre les avantages de chacun vous permettra d'écrire du code plus efficace et adapté à votre cas d'usage.
