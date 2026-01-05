---
title: "Vectorisation"
order: 9.01.03
parent: "09-01-data-manipulation.md"
tags: ["python", "vectorisation", "performance", "optimisation"]
---

# Vectorisation

La vectorisation permet d'appliquer des opérations à des tableaux entiers plutôt qu'élément par élément, améliorant considérablement les performances.

## Concepts de base

**Vectorisation** signifie effectuer des opérations sur des tableaux entiers en une seule opération, plutôt que d'itérer sur chaque élément. Cela permet d'exploiter les optimisations au niveau CPU (SIMD) et d'éviter l'overhead des boucles Python.

### Pourquoi la vectorisation ?

- **Performance** : 10-100x plus rapide que les boucles Python
- **Simplicité** : Code plus lisible et concis
- **Optimisation** : Utilise les optimisations CPU (SIMD)
- **Mémoire** : Accès mémoire efficace

## Principe de la vectorisation

### Approche non-vectorisée (boucles)

```python
import numpy as np

# Liste Python
python_list = [1, 2, 3, 4, 5]

# Opération avec boucle
result = []
for x in python_list:
    result.append(x * 2)
# Résultat: [2, 4, 6, 8, 10]
```

### Approche vectorisée

```python
import numpy as np

# Tableau NumPy
numpy_array = np.array([1, 2, 3, 4, 5])

# Opération vectorisée
result = numpy_array * 2
# Résultat: [2 4 6 8 10]
```

## Vectorisation avec NumPy

### Opérations arithmétiques

```python
import numpy as np

arr = np.array([1, 2, 3, 4, 5])

# Toutes ces opérations sont vectorisées
result = arr + 10      # Addition
result = arr * 2       # Multiplication
result = arr ** 2      # Puissance
result = np.sqrt(arr)  # Racine carrée
result = np.sin(arr)   # Sinus
```

### Comparaison de performance

```python
import numpy as np
import time

# Données
size = 1000000
python_list = list(range(size))
numpy_array = np.array(range(size))

# Boucle Python
start = time.time()
result_python = [x * 2 for x in python_list]
python_time = time.time() - start

# Vectorisé NumPy
start = time.time()
result_numpy = numpy_array * 2
numpy_time = time.time() - start

print(f"Python boucle: {python_time:.4f}s")
print(f"NumPy vectorisé: {numpy_time:.4f}s")
print(f"Accélération: {python_time/numpy_time:.1f}x")
# NumPy est généralement 10-100x plus rapide
```

### Conditions vectorisées

```python
import numpy as np

arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

# Condition vectorisée
mask = arr > 5
print(mask)  # [False False False False False  True  True  True  True  True]

# Filtrage
filtered = arr[arr > 5]  # [6 7 8 9 10]

# Condition multiple
filtered = arr[(arr > 3) & (arr < 8)]  # [4 5 6 7]

# Opération conditionnelle
result = np.where(arr > 5, arr * 2, arr)  # Double si > 5, sinon inchangé
```

## Vectorisation avec Pandas

### Opérations sur les colonnes

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'A': [1, 2, 3, 4, 5],
    'B': [10, 20, 30, 40, 50]
})

# Opérations vectorisées
df['C'] = df['A'] + df['B']        # Addition
df['D'] = df['A'] * 2              # Multiplication
df['E'] = df['A'] ** 2             # Puissance
df['F'] = np.sqrt(df['A'])         # Fonction NumPy
```

### Conditions vectorisées

```python
# Condition simple
df['G'] = df['A'] > 3

# Opération conditionnelle
df['H'] = np.where(df['A'] > 3, 'grand', 'petit')

# Plusieurs conditions
df['I'] = np.where(df['A'] > 3, 'grand',
          np.where(df['A'] > 1, 'moyen', 'petit'))
```

### Apply vs vectorisation

```python
# ❌ Éviter : apply pour opérations simples
df['C'] = df['A'].apply(lambda x: x * 2)

# ✅ Bon : vectorisation directe
df['C'] = df['A'] * 2

# ✅ Bon : apply pour opérations complexes
df['D'] = df['A'].apply(lambda x: 'pair' if x % 2 == 0 else 'impair')
```

## Comparaison avec les boucles

### Exemple 1 : Calcul de distance

```python
import numpy as np
import time

# Données
points = np.random.rand(10000, 2)
center = np.array([0.5, 0.5])

# ❌ Approche avec boucle (lente)
def distance_loop(points, center):
    distances = []
    for point in points:
        dist = np.sqrt((point[0] - center[0])**2 + (point[1] - center[1])**2)
        distances.append(dist)
    return np.array(distances)

# ✅ Approche vectorisée (rapide)
def distance_vectorized(points, center):
    return np.sqrt(np.sum((points - center)**2, axis=1))

# Comparaison
start = time.time()
dist_loop = distance_loop(points, center)
loop_time = time.time() - start

start = time.time()
dist_vec = distance_vectorized(points, center)
vec_time = time.time() - start

print(f"Boucle: {loop_time:.4f}s")
print(f"Vectorisé: {vec_time:.4f}s")
print(f"Accélération: {loop_time/vec_time:.1f}x")
```

### Exemple 2 : Normalisation

```python
import numpy as np

data = np.random.rand(1000, 100)

# ❌ Approche avec boucle
def normalize_loop(data):
    normalized = np.zeros_like(data)
    for i in range(data.shape[0]):
        row = data[i]
        mean = np.mean(row)
        std = np.std(row)
        normalized[i] = (row - mean) / std
    return normalized

# ✅ Approche vectorisée
def normalize_vectorized(data):
    mean = np.mean(data, axis=1, keepdims=True)
    std = np.std(data, axis=1, keepdims=True)
    return (data - mean) / std

# La version vectorisée est 10-50x plus rapide
```

## Exemples pratiques

### Exemple 1 : Calcul de statistiques

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'ventes': [100, 150, 200, 120, 180],
    'prix': [10, 15, 12, 20, 18]
})

# Calcul vectorisé du revenu
df['revenu'] = df['ventes'] * df['prix']

# Statistiques vectorisées
df['ventes_norm'] = (df['ventes'] - df['ventes'].mean()) / df['ventes'].std()

# Catégorisation vectorisée
df['catégorie'] = pd.cut(df['ventes'], 
                        bins=[0, 120, 180, float('inf')],
                        labels=['faible', 'moyen', 'élevé'])
```

### Exemple 2 : Traitement de texte

```python
import pandas as pd

df = pd.DataFrame({
    'texte': ['Hello World', 'Python Data', 'Machine Learning']
})

# Opérations vectorisées sur texte
df['longueur'] = df['texte'].str.len()
df['majuscules'] = df['texte'].str.upper()
df['mots'] = df['texte'].str.split()
df['contient_python'] = df['texte'].str.contains('Python', case=False)
```

### Exemple 3 : Dates et temps

```python
import pandas as pd

df = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=100, freq='D')
})

# Opérations vectorisées sur dates
df['année'] = df['date'].dt.year
df['mois'] = df['date'].dt.month
df['jour_semaine'] = df['date'].dt.day_name()
df['est_weekend'] = df['date'].dt.dayofweek >= 5
```

## Bonnes pratiques

### 1. Utilisez la vectorisation quand possible

```python
# ✅ Bon : Vectorisé
result = arr * 2

# ❌ Éviter : Boucle
result = []
for x in arr:
    result.append(x * 2)
```

### 2. Évitez apply() pour opérations simples

```python
# ✅ Bon : Vectorisé
df['C'] = df['A'] + df['B']

# ❌ Éviter : apply
df['C'] = df.apply(lambda row: row['A'] + row['B'], axis=1)
```

### 3. Utilisez les fonctions NumPy

```python
# ✅ Bon : Fonctions NumPy vectorisées
result = np.sqrt(arr)
result = np.exp(arr)
result = np.log(arr)

# ❌ Éviter : Boucles avec math
import math
result = [math.sqrt(x) for x in arr]
```

### 4. Profitez du broadcasting

```python
# ✅ Bon : Broadcasting
arr = np.array([[1, 2, 3], [4, 5, 6]])
result = arr + np.array([1, 2, 3])  # Broadcasting automatique

# ❌ Éviter : Boucle
result = np.zeros_like(arr)
for i in range(arr.shape[0]):
    result[i] = arr[i] + np.array([1, 2, 3])
```

## Points clés à retenir

- ✅ **Vectorisation** : Opérations sur tableaux entiers, pas élément par élément
- ✅ **Performance** : 10-100x plus rapide que les boucles Python
- ✅ **NumPy** : Toutes les opérations sont vectorisées
- ✅ **Pandas** : Utilise la vectorisation pour les opérations sur colonnes
- ✅ **Éviter apply()** : Pour opérations simples, utilisez la vectorisation directe
- ✅ **Broadcasting** : Exploitez le broadcasting pour opérations entre tableaux
- ✅ Parfait pour **optimiser les performances** en data science

La vectorisation est l'une des techniques les plus importantes pour optimiser le code Python en data science. Toujours préférer la vectorisation aux boucles quand c'est possible.
