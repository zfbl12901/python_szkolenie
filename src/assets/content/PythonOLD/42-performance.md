---
title: "Optimisation et Performance"
order: 42
parent: null
tags: ["python", "performance", "optimization", "profiling"]
---

# Optimisation et Performance

## Introduction

L'optimisation est l'art de rendre votre code Python plus rapide et plus efficace. Cependant, comme le disait Donald Knuth : **"Premature optimization is the root of all evil"** - il faut d'abord mesurer avant d'optimiser.

### Les règles de l'optimisation

```
┌─────────────────────────────────────────────────────────┐
│         LES 3 RÈGLES DE L'OPTIMISATION                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Règle 1 : Ne pas optimiser                            │
│  Règle 2 : Ne pas optimiser (encore)                   │
│  Règle 3 : Profiler d'abord, optimiser ensuite         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Quand optimiser ?

| Situation | Action |
|-----------|--------|
| **Prototype/POC** | Clarté > Performance |
| **Fonctionnalité nouvelle** | Correction > Optimisation |
| **Code lent identifié** | Profiler puis optimiser |
| **Goulot d'étranglement** | Optimiser le bottleneck |
| **Échelle critique** | Optimisation stratégique |

## Philosophie de l'optimisation

### 1. Mesurer d'abord

```python
import time

def measure_time(func):
    """Décorateur pour mesurer le temps d'exécution"""
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

@measure_time
def slow_function():
    total = 0
    for i in range(1000000):
        total += i
    return total
```

### 2. Identifier les bottlenecks

**Loi de Amdahl** : Optimiser 90% du code qui prend 10% du temps ne sert à rien.

```
┌────────────────────────────────────┐
│    Où passe le temps ?             │
├────────────────────────────────────┤
│  ████████████████████ 60% DB       │
│  ██████████ 30% API externe        │
│  ███ 10% Calculs                   │
└────────────────────────────────────┘
         ↓
   Optimiser la DB d'abord !
```

### 3. Big O Notation

Comprendre la complexité algorithmique :

| Notation | Nom | Exemple | Performance |
|----------|-----|---------|-------------|
| **O(1)** | Constant | Accès dict/list | Excellent |
| **O(log n)** | Logarithmique | Recherche binaire | Très bon |
| **O(n)** | Linéaire | Boucle simple | Bon |
| **O(n log n)** | Log-linéaire | Tri efficace | Acceptable |
| **O(n²)** | Quadratique | Boucles imbriquées | Mauvais |
| **O(2ⁿ)** | Exponentiel | Récursion naïve | Catastrophique |

```python
# O(1) - Excellent
def get_first_element(lst):
    return lst[0]

# O(n) - Bon
def sum_list(lst):
    return sum(lst)

# O(n²) - Mauvais
def has_duplicates_slow(lst):
    for i in range(len(lst)):
        for j in range(i + 1, len(lst)):
            if lst[i] == lst[j]:
                return True
    return False

# O(n) - Beaucoup mieux !
def has_duplicates_fast(lst):
    return len(lst) != len(set(lst))
```

## Techniques d'optimisation Python

### 1. Structures de données appropriées

```python
import time

# ❌ Mauvais : Liste pour les recherches
def find_in_list(lst, value):
    return value in lst  # O(n)

# ✅ Bon : Set pour les recherches
def find_in_set(s, value):
    return value in s  # O(1)

# Benchmark
numbers_list = list(range(100000))
numbers_set = set(range(100000))

# Liste : ~2ms pour trouver 99999
# Set : ~0.00001ms pour trouver 99999
```

**Choisir la bonne structure** :

| Besoin | Structure | Pourquoi |
|--------|-----------|----------|
| Recherche rapide | `set`, `dict` | O(1) |
| Ordre important | `list` | Maintient l'ordre |
| File FIFO | `collections.deque` | O(1) aux deux bouts |
| Tri auto | `heapq` | O(log n) |
| Comptage | `collections.Counter` | Optimisé |

### 2. Compréhensions vs Boucles

```python
# ❌ Lent : Boucle classique
result = []
for i in range(1000):
    if i % 2 == 0:
        result.append(i * 2)

# ✅ Plus rapide : Compréhension de liste
result = [i * 2 for i in range(1000) if i % 2 == 0]

# ✅ Encore mieux si juste itérer : Générateur
result = (i * 2 for i in range(1000) if i % 2 == 0)
```

### 3. Éviter les concaténations répétées

```python
# ❌ Très lent : O(n²)
result = ""
for i in range(10000):
    result += str(i)  # Crée une nouvelle chaîne à chaque fois !

# ✅ Rapide : O(n)
result = "".join(str(i) for i in range(10000))
```

### 4. Utiliser les built-ins

Les fonctions intégrées sont implémentées en C :

```python
# ❌ Lent
def sum_list(lst):
    total = 0
    for x in lst:
        total += x
    return total

# ✅ Rapide : Built-in en C
total = sum(lst)

# Autres built-ins rapides
max(lst)
min(lst)
any(lst)
all(lst)
sorted(lst)
```

### 5. Local vs Global

```python
# ❌ Lent : Accès global
import math

def calculate_distances(points):
    distances = []
    for p in points:
        distances.append(math.sqrt(p[0]**2 + p[1]**2))
    return distances

# ✅ Rapide : Variable locale
def calculate_distances_fast(points):
    sqrt = math.sqrt  # Cache local
    distances = []
    for p in points:
        distances.append(sqrt(p[0]**2 + p[1]**2))
    return distances
```

## Profiling

### timeit pour micro-benchmarks

```python
import timeit

# Comparer deux approches
list_comp = timeit.timeit(
    '[i*2 for i in range(1000)]',
    number=10000
)

map_func = timeit.timeit(
    'list(map(lambda x: x*2, range(1000)))',
    number=10000
)

print(f"List comprehension: {list_comp:.4f}s")
print(f"Map: {map_func:.4f}s")
```

### cProfile pour profiling complet

```python
import cProfile
import pstats

def main():
    # Votre code à profiler
    data = [i for i in range(100000)]
    squared = [x**2 for x in data]
    return sum(squared)

# Profiler
profiler = cProfile.Profile()
profiler.enable()
main()
profiler.disable()

# Afficher les stats
stats = pstats.Stats(profiler)
stats.sort_stats('cumulative')
stats.print_stats(10)  # Top 10
```

### line_profiler pour profiling ligne par ligne

```bash
pip install line_profiler
```

```python
# @profile décorator
@profile
def slow_function():
    total = 0
    for i in range(10000):
        total += i**2
    return total
```

```bash
kernprof -l -v script.py
```

## Mémoire

### memory_profiler

```python
from memory_profiler import profile

@profile
def memory_hungry():
    data = [i for i in range(1000000)]
    data_squared = [x**2 for x in data]
    return sum(data_squared)
```

### Générateurs pour économiser la mémoire

```python
# ❌ Consomme beaucoup de mémoire
def read_large_file(filename):
    return [line for line in open(filename)]

# ✅ Itère sans tout charger
def read_large_file_gen(filename):
    with open(filename) as f:
        for line in f:
            yield line.strip()

# Utilisation
for line in read_large_file_gen('huge.txt'):
    process(line)
```

### __slots__ pour réduire la mémoire des objets

```python
# Sans slots : ~300 bytes par instance
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

# Avec slots : ~80 bytes par instance
class PointOptimized:
    __slots__ = ['x', 'y']
    
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

## Programmation asynchrone

### asyncio pour I/O-bound

```python
import asyncio
import aiohttp

# ❌ Synchrone : 10s pour 10 requêtes
import requests

def fetch_sync(url):
    response = requests.get(url)
    return response.text

urls = [f'https://api.example.com/{i}' for i in range(10)]
results = [fetch_sync(url) for url in urls]

# ✅ Asynchrone : ~1s pour 10 requêtes
async def fetch_async(session, url):
    async with session.get(url) as response:
        return await response.text()

async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_async(session, url) for url in urls]
        return await asyncio.gather(*tasks)

results = asyncio.run(fetch_all(urls))
```

## Parallélisation

### multiprocessing pour CPU-bound

```python
from multiprocessing import Pool
import time

def cpu_intensive(n):
    """Calcul intensif"""
    return sum(i**2 for i in range(n))

numbers = [10000000] * 8

# Séquentiel : ~8s
start = time.time()
results = [cpu_intensive(n) for n in numbers]
print(f"Sequential: {time.time() - start:.2f}s")

# Parallèle : ~2s sur 4 cores
start = time.time()
with Pool(4) as pool:
    results = pool.map(cpu_intensive, numbers)
print(f"Parallel: {time.time() - start:.2f}s")
```

### concurrent.futures

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import requests

urls = ['https://example.com'] * 10

# ThreadPoolExecutor pour I/O
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(requests.get, url) for url in urls]
    results = [f.result() for f in futures]

# ProcessPoolExecutor pour CPU
def heavy_computation(n):
    return sum(i**2 for i in range(n))

with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(heavy_computation, [10000000] * 8))
```

## Compilation JIT

### Numba pour calculs numériques

```python
import numpy as np
from numba import jit

# Sans Numba : ~2s
def monte_carlo_pi(n):
    inside = 0
    for i in range(n):
        x = np.random.random()
        y = np.random.random()
        if x*x + y*y <= 1:
            inside += 1
    return 4 * inside / n

# Avec Numba : ~0.1s
@jit(nopython=True)
def monte_carlo_pi_fast(n):
    inside = 0
    for i in range(n):
        x = np.random.random()
        y = np.random.random()
        if x*x + y*y <= 1:
            inside += 1
    return 4 * inside / n
```

## Caching

### functools.lru_cache

```python
from functools import lru_cache

# ❌ Lent : Recalcule à chaque fois
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# fibonacci(35) : ~3 secondes

# ✅ Rapide : Met en cache
@lru_cache(maxsize=None)
def fibonacci_cached(n):
    if n < 2:
        return n
    return fibonacci_cached(n-1) + fibonacci_cached(n-2)

# fibonacci_cached(35) : ~0.00001 secondes
```

## Optimisation base de données

### Utiliser des indexes

```sql
-- ❌ Lent : Scan complet
SELECT * FROM users WHERE email = 'user@example.com';

-- ✅ Rapide : Index
CREATE INDEX idx_users_email ON users(email);
```

### Requêtes en batch

```python
# ❌ Lent : N requêtes
for user_id in user_ids:
    user = db.query(User).filter(User.id == user_id).first()
    process(user)

# ✅ Rapide : 1 requête
users = db.query(User).filter(User.id.in_(user_ids)).all()
for user in users:
    process(user)
```

### Pagination

```python
# ❌ Lent : Charge tout
users = db.query(User).all()

# ✅ Rapide : Pagine
users = db.query(User).limit(100).offset(page * 100).all()
```

## Bonnes pratiques

### ✅ À faire

1. **Profiler avant d'optimiser** : Mesurer le bottleneck réel
2. **Choisir la bonne structure** : dict/set pour recherches
3. **Utiliser les built-ins** : sum(), max(), sorted()
4. **Générateurs pour grandes données** : yield au lieu de return []
5. **asyncio pour I/O** : Requêtes réseau, fichiers
6. **multiprocessing pour CPU** : Calculs lourds
7. **Caching intelligent** : lru_cache, Redis
8. **Indexes DB** : Pour les colonnes fréquemment requêtées
9. **Batch operations** : Grouper les opérations
10. **Monitoring** : Surveiller les performances en prod

### ❌ À éviter

1. **Optimisation prématurée** : Clarity first
2. **Micro-optimisations** : Optimiser 0.001% du temps
3. **Ignorer Big O** : O(n²) sera toujours lent
4. **Caching excessif** : Mémoire limitée
5. **Parallélisation partout** : Overhead pour petites tâches
6. **Oublier la lisibilité** : Code maintenable > rapide de 5%
7. **Ne pas profiler** : Optimiser au hasard
8. **Ignorer les dépendances** : API externe = bottleneck

## Contenu de cette section

### 📖 Modules détaillés

1. **[Profiling et Analyse](42-01-profiling.md)**
   - cProfile, line_profiler
   - timeit, benchmarking
   - Visualisation des performances

2. **[Optimisation Mémoire](42-02-optimisation-memoire.md)**
   - memory_profiler
   - Générateurs et itérateurs
   - Gestion efficace de la mémoire

3. **[Asyncio et Concurrence](42-03-asyncio-et-concurrence.md)**
   - async/await
   - asyncio patterns
   - Threading vs Multiprocessing

## Checklist d'optimisation

```python
# Checklist avant d'optimiser
optimization_checklist = {
    'Profiling': [
        '□ Identifier le bottleneck réel',
        '□ Mesurer le temps actuel',
        '□ Définir l'objectif de performance'
    ],
    'Algorithme': [
        '□ Vérifier la complexité (Big O)',
        '□ Utiliser la bonne structure de données',
        '□ Exploiter les built-ins Python'
    ],
    'Données': [
        '□ Utiliser des générateurs si possible',
        '□ Éviter les copies inutiles',
        '□ Libérer la mémoire non utilisée'
    ],
    'I/O': [
        '□ Utiliser asyncio pour I/O-bound',
        '□ Batching des opérations DB',
        '□ Caching des résultats coûteux'
    ],
    'CPU': [
        '□ multiprocessing pour CPU-bound',
        '□ Numba pour calculs numériques',
        '□ Cython pour code critique'
    ],
    'Validation': [
        '□ Mesurer l'amélioration',
        '□ Tester la correction',
        '□ Vérifier la lisibilité'
    ]
}
```

## Ordre d'optimisation recommandé

```
1. Algorithme        → Gain potentiel : 100x-1000x
   ↓
2. Structure données → Gain potentiel : 10x-100x
   ↓
3. Caching          → Gain potentiel : 10x-100x
   ↓
4. DB optimization  → Gain potentiel : 10x-50x
   ↓
5. Asyncio          → Gain potentiel : 5x-20x
   ↓
6. Multiprocessing  → Gain potentiel : 2x-8x
   ↓
7. Micro-opt        → Gain potentiel : 1.1x-2x
```

## Ressources

- **High Performance Python** : Micha Gorelick & Ian Ozsvald
- **Python Performance** : https://wiki.python.org/moin/PythonSpeed
- **Profiling Guide** : https://docs.python.org/3/library/profile.html
- **asyncio docs** : https://docs.python.org/3/library/asyncio.html
- **Numba** : https://numba.pydata.org/

## Conclusion

L'optimisation est un équilibre entre :
- ⚡ Performance
- 📖 Lisibilité
- 🔧 Maintenabilité
- ⏱️ Temps de développement

**"Make it work, make it right, make it fast - in that order"** - Kent BeckLa performance compte, mais un code clair et correct compte plus. Optimisez quand c'est nécessaire, là où c'est nécessaire, après avoir mesuré.
