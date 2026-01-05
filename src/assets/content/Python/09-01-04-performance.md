---
title: "Performance"
order: 9.01.04
parent: "09-01-data-manipulation.md"
tags: ["python", "performance", "optimisation", "data"]
---

# Performance

Optimiser les performances lors de la manipulation de données est crucial pour traiter efficacement de grandes quantités de données.

## Concepts de base

L'optimisation des performances en data science implique :
- **Vectorisation** : Utiliser NumPy/Pandas au lieu de boucles
- **Types optimisés** : Choisir les bons types de données
- **Mémoire** : Gérer efficacement la mémoire
- **Traitement par chunks** : Traiter les grandes données par morceaux

## Profiling et mesure

### Mesurer le temps

```python
import time

start = time.time()
# Votre code
result = operation()
elapsed = time.time() - start
print(f"Temps: {elapsed:.4f}s")
```

### Profiling avec cProfile

```python
import cProfile
import pstats

profiler = cProfile.Profile()
profiler.enable()

# Votre code
operation()

profiler.disable()
stats = pstats.Stats(profiler)
stats.sort_stats('cumulative')
stats.print_stats(10)  # Top 10
```

## Techniques d'optimisation

### Utiliser la vectorisation

```python
# ❌ Lent : Boucle
result = []
for x in data:
    result.append(x * 2)

# ✅ Rapide : Vectorisé
result = data * 2
```

### Types optimisés

```python
import pandas as pd

# ❌ Utilise beaucoup de mémoire
df['id'] = df['id'].astype('int64')

# ✅ Optimisé
df['id'] = df['id'].astype('int32')  # Moitié de la mémoire
```

### Éviter les copies inutiles

```python
# ❌ Crée une copie
df_new = df[df['A'] > 0].copy()
df_new['B'] = df_new['B'] * 2

# ✅ Modifie en place si possible
df.loc[df['A'] > 0, 'B'] = df.loc[df['A'] > 0, 'B'] * 2
```

## Gestion de la mémoire

### Types de données optimisés

```python
import pandas as pd

# Réduire la mémoire
df['int_col'] = df['int_col'].astype('int32')  # Au lieu de int64
df['float_col'] = df['float_col'].astype('float32')  # Au lieu de float64
df['cat_col'] = df['cat_col'].astype('category')  # Pour données répétitives
```

### Vérifier l'utilisation mémoire

```python
# Utilisation mémoire
print(df.memory_usage(deep=True))
print(f"Total: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
```

## Traitement par chunks

### Lire de gros fichiers par chunks

```python
import pandas as pd

# Lire par chunks
chunk_size = 10000
chunks = []

for chunk in pd.read_csv('large_file.csv', chunksize=chunk_size):
    # Traiter chaque chunk
    processed = process_chunk(chunk)
    chunks.append(processed)

# Combiner
result = pd.concat(chunks, ignore_index=True)
```

### Traitement incrémental

```python
# Traiter et sauvegarder progressivement
for i, chunk in enumerate(pd.read_csv('large_file.csv', chunksize=10000)):
    processed = process_chunk(chunk)
    processed.to_csv(f'output_chunk_{i}.csv', index=False)
```

## Bonnes pratiques

### 1. Utilisez la vectorisation

```python
# ✅ Bon
result = df['A'] + df['B']

# ❌ Éviter
result = df.apply(lambda row: row['A'] + row['B'], axis=1)
```

### 2. Évitez les opérations répétées

```python
# ✅ Bon : Calculer une fois
mask = df['A'] > 0
df.loc[mask, 'B'] = df.loc[mask, 'B'] * 2

# ❌ Éviter : Recalculer
df.loc[df['A'] > 0, 'B'] = df.loc[df['A'] > 0, 'B'] * 2
```

### 3. Utilisez les types appropriés

```python
# ✅ Bon : Types optimisés
df['id'] = df['id'].astype('int32')
df['category'] = df['category'].astype('category')
```

## Points clés à retenir

- ✅ **Vectorisation** : Toujours préférer aux boucles
- ✅ **Types optimisés** : Réduire l'utilisation mémoire
- ✅ **Chunks** : Traiter les grandes données par morceaux
- ✅ **Profiling** : Mesurer avant d'optimiser
- ✅ Parfait pour **optimiser** le traitement de grandes données

L'optimisation des performances est essentielle pour traiter efficacement de grandes quantités de données. La vectorisation et les types optimisés sont les techniques les plus importantes.
