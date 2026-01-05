---
title: "Profiling (cProfile, line_profiler)"
order: 6.04.01
parent: "06-04-optimisation.md"
tags: ["python", "profiling", "cprofile", "performance"]
---

# Profiling (cProfile, line_profiler)

Le profiling permet d'identifier les goulots d'étranglement dans votre code. C'est la première étape avant toute optimisation : **mesurez d'abord, optimisez ensuite**.

## Concepts de base

Le **profiling** consiste à mesurer où votre programme passe son temps d'exécution. Cela permet d'identifier :
- Les fonctions les plus lentes
- Les lignes de code les plus coûteuses
- Les appels de fonctions fréquents

**Règle d'or** : Ne devinez jamais où sont les problèmes de performance. Mesurez toujours avec un profiler.

## cProfile

### Utilisation basique

`cProfile` est le profiler standard de Python, inclus dans la bibliothèque standard :

```python
import cProfile

def fonction_lente():
    """Fonction qui prend du temps."""
    total = 0
    for i in range(1000000):
        total += i * i
    return total

# Profiling
cProfile.run('fonction_lente()')
```

### Sortie de cProfile

La sortie montre :
- `ncalls` : Nombre d'appels
- `tottime` : Temps total (sans les sous-appels)
- `cumtime` : Temps cumulé (avec les sous-appels)
- `percall` : Temps par appel

```
         1000003 function calls in 0.250 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.250    0.250    0.250    0.250 script.py:3(fonction_lente)
        1    0.000    0.000    0.250    0.250 {built-in method builtins.exec}
```

### Profiling d'un script complet

```python
# script.py
def fonction1():
    total = 0
    for i in range(100000):
        total += i
    return total

def fonction2():
    total = 0
    for i in range(1000000):
        total += i * i
    return total

def main():
    resultat1 = fonction1()
    resultat2 = fonction2()
    return resultat1, resultat2

if __name__ == "__main__":
    import cProfile
    cProfile.run('main()')
```

### Sauvegarder les résultats

```python
import cProfile
import pstats

# Profiling et sauvegarde
cProfile.run('fonction_lente()', 'profile_stats')

# Analyse des résultats
stats = pstats.Stats('profile_stats')
stats.sort_stats('cumulative')  # Trier par temps cumulé
stats.print_stats(10)  # Afficher les 10 premières fonctions
```

### Trier les résultats

```python
import pstats

stats = pstats.Stats('profile_stats')

# Trier par temps cumulé
stats.sort_stats('cumulative')
stats.print_stats()

# Trier par temps total (sans sous-appels)
stats.sort_stats('tottime')
stats.print_stats()

# Trier par nombre d'appels
stats.sort_stats('calls')
stats.print_stats()
```

## line_profiler

### Installation

`line_profiler` permet de profiler ligne par ligne :

```bash
pip install line_profiler
```

### Utilisation

Décorer la fonction avec `@profile` :

```python
# script.py
@profile
def fonction_lente():
    total = 0
    for i in range(1000000):
        total += i * i
    return total

if __name__ == "__main__":
    fonction_lente()
```

Exécuter avec `kernprof` :

```bash
kernprof -l -v script.py
```

### Sortie de line_profiler

```
Line #      Hits         Time  Per Hit   % Time  Line Contents
==============================================================
     3                                           @profile
     4                                           def fonction_lente():
     5         1            2      2.0      0.0      total = 0
     6   1000001     2500000   2500.0     99.8      for i in range(1000000):
     7   1000000     2500000   2500.0     99.8          total += i * i
     8         1            2      2.0      0.0      return total
```

Cela montre exactement quelles lignes prennent le plus de temps.

## Exemples pratiques

### Exemple 1 : Identifier la fonction lente

```python
import cProfile
import pstats

def fonction_rapide():
    return sum(range(1000))

def fonction_moyenne():
    total = 0
    for i in range(100000):
        total += i
    return total

def fonction_lente():
    total = 0
    for i in range(10000000):
        total += i * i
    return total

def main():
    fonction_rapide()
    fonction_moyenne()
    fonction_lente()

# Profiling
cProfile.run('main()', 'profile_stats')

# Analyse
stats = pstats.Stats('profile_stats')
stats.sort_stats('cumulative')
stats.print_stats()
```

### Exemple 2 : Profiling d'une application web

```python
from flask import Flask
import cProfile
import pstats

app = Flask(__name__)

@app.route('/')
def index():
    # Code de la route
    return "Hello"

@app.route('/slow')
def slow_route():
    # Route lente à identifier
    total = 0
    for i in range(10000000):
        total += i
    return str(total)

# Profiling d'une requête
profiler = cProfile.Profile()
profiler.enable()

# Simuler une requête
with app.test_client() as client:
    client.get('/slow')

profiler.disable()
profiler.dump_stats('web_profile.stats')

# Analyser
stats = pstats.Stats('web_profile.stats')
stats.sort_stats('cumulative')
stats.print_stats(20)
```

### Exemple 3 : Comparaison avant/après optimisation

```python
import cProfile
import pstats

# Version non optimisée
def version_lente():
    resultat = []
    for i in range(100000):
        resultat.append(i * 2)
    return resultat

# Version optimisée
def version_rapide():
    return [i * 2 for i in range(100000)]

# Profiling version lente
cProfile.run('version_lente()', 'slow.stats')

# Profiling version rapide
cProfile.run('version_rapide()', 'fast.stats')

# Comparaison
slow_stats = pstats.Stats('slow.stats')
fast_stats = pstats.Stats('fast.stats')

print("Version lente:")
slow_stats.print_stats(5)

print("\nVersion rapide:")
fast_stats.print_stats(5)
```

## Bonnes pratiques

### 1. Profilez d'abord, optimisez ensuite

```python
# ❌ Mauvais : optimisation prématurée
def fonction():
    # Optimisations sans savoir si nécessaire
    pass

# ✅ Bon : profiling d'abord
import cProfile
cProfile.run('fonction()')
# Identifier les goulots d'étranglement
# Optimiser seulement ce qui est lent
```

### 2. Utilisez cProfile pour une vue d'ensemble

```python
# ✅ Bon : cProfile pour identifier les fonctions lentes
cProfile.run('main()')
```

### 3. Utilisez line_profiler pour les détails

```python
# ✅ Bon : line_profiler pour identifier les lignes lentes
@profile
def fonction():
    # Code à profiler ligne par ligne
    pass
```

### 4. Profilez avec des données réalistes

```python
# ✅ Bon : données réalistes
cProfile.run('traiter_donnees_reelles()')

# ⚠️ Moins bon : données de test trop petites
cProfile.run('traiter_donnees_test()')  # Peut ne pas révéler les vrais problèmes
```

## Outils complémentaires

### memory_profiler

Pour profiler l'utilisation mémoire :

```python
from memory_profiler import profile

@profile
def fonction():
    liste = [i for i in range(1000000)]
    return liste
```

### py-spy

Profiler sans modifier le code :

```bash
py-spy record -o profile.svg -- python script.py
```

## Points clés à retenir

- ✅ **Profilez toujours avant d'optimiser** : Ne devinez jamais
- ✅ `cProfile` donne une **vue d'ensemble** des fonctions lentes
- ✅ `line_profiler` donne les **détails ligne par ligne**
- ✅ Utilisez `pstats` pour **analyser et trier** les résultats
- ✅ Profilez avec des **données réalistes**
- ✅ Concentrez-vous sur les **goulots d'étranglement réels**
- ✅ **Mesurez l'amélioration** après optimisation

Le profiling est essentiel pour l'optimisation efficace. Il permet d'identifier précisément où optimiser, évitant ainsi l'optimisation prématurée et les micro-optimisations inutiles.
