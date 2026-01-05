---
title: "Fonctionnement du GIL"
order: 6.01.01
parent: "06-01-cpython-gil.md"
tags: ["python", "gil", "cpython", "threads"]
---

# Fonctionnement du GIL

Le Global Interpreter Lock (GIL) est un mécanisme de verrouillage qui empêche plusieurs threads d'exécuter du bytecode Python simultanément. Comprendre son fonctionnement est essentiel pour maîtriser la performance et la concurrence en Python.

## Concepts de base

Le **Global Interpreter Lock (GIL)** est un verrou (lock) au niveau de l'interpréteur CPython qui permet à un seul thread d'exécuter du bytecode Python à la fois. C'est une caractéristique unique de CPython (l'implémentation de référence de Python).

### Pourquoi le GIL existe ?

Le GIL existe pour simplifier la gestion de la mémoire en CPython :

1. **Gestion de la mémoire** : CPython utilise le comptage de références pour la gestion de la mémoire. Sans le GIL, plusieurs threads pourraient modifier le compteur de références simultanément, causant des fuites mémoire ou des crashes.

2. **Simplicité** : Le GIL simplifie l'implémentation de CPython en évitant la nécessité de verrouiller chaque structure de données.

3. **Extensions C** : De nombreuses extensions C pour Python ne sont pas thread-safe. Le GIL protège ces extensions.

## Architecture du GIL

### Verrou global

Le GIL est un verrou unique partagé par tous les threads Python :

```python
# Conceptuellement (simplifié)
GIL = Lock()  # Un seul verrou pour tout l'interpréteur

# Thread 1
with GIL:
    # Exécute du bytecode Python
    x = 1 + 1

# Thread 2 (doit attendre)
with GIL:  # Bloqué jusqu'à ce que Thread 1 libère le GIL
    # Exécute du bytecode Python
    y = 2 + 2
```

### Exécution séquentielle du bytecode

Même avec plusieurs threads, le bytecode Python s'exécute séquentiellement :

```python
import threading
import time

def tache():
    for i in range(5):
        print(f"Thread {threading.current_thread().name}: {i}")
        time.sleep(0.1)

# Création de deux threads
thread1 = threading.Thread(target=tache, name="Thread-1")
thread2 = threading.Thread(target=tache, name="Thread-2")

thread1.start()
thread2.start()

thread1.join()
thread2.join()

# Sortie : Les threads s'exécutent en alternance
# Thread Thread-1: 0
# Thread Thread-2: 0
# Thread Thread-1: 1
# Thread Thread-2: 1
# ...
```

## Cycle de vie du GIL

### Acquisition et libération

Le GIL est acquis et libéré automatiquement :

1. **Acquisition** : Un thread acquiert le GIL avant d'exécuter du bytecode Python
2. **Exécution** : Le thread exécute du bytecode Python
3. **Libération** : Le thread libère le GIL (volontairement ou après un certain nombre d'instructions)
4. **Attente** : Les autres threads attendent que le GIL soit disponible

### Tick counting

CPython utilise un système de "ticks" pour décider quand libérer le GIL :

- Chaque instruction Python consomme un "tick"
- Après un certain nombre de ticks (par défaut 100), le thread libère le GIL
- Cela permet aux autres threads d'avoir une chance de s'exécuter

```python
# Conceptuellement
def executer_bytecode():
    ticks = 0
    while True:
        instruction = prochaine_instruction()
        executer(instruction)
        ticks += 1
        
        if ticks >= 100:  # Libère le GIL tous les 100 ticks
            liberer_gil()
            ticks = 0
            # Autre thread peut acquérir le GIL
```

## GIL et threads

### Comportement avec les threads

Avec le GIL, même avec plusieurs threads, le code Python s'exécute séquentiellement :

```python
import threading
import time

def calcul_intensif():
    """Tâche CPU-intensive."""
    resultat = 0
    for i in range(10000000):
        resultat += i * i
    return resultat

# Exécution séquentielle (sans threads)
start = time.time()
calcul_intensif()
calcul_intensif()
temps_sequentiel = time.time() - start
print(f"Séquentiel: {temps_sequentiel:.2f}s")

# Exécution avec threads (GIL limite le parallélisme)
start = time.time()
thread1 = threading.Thread(target=calcul_intensif)
thread2 = threading.Thread(target=calcul_intensif)

thread1.start()
thread2.start()

thread1.join()
thread2.join()
temps_threads = time.time() - start
print(f"Avec threads: {temps_threads:.2f}s")

# ⚠️ Avec le GIL, les threads ne s'exécutent pas vraiment en parallèle
# Le temps peut être similaire ou même pire (overhead des threads)
```

### Libération du GIL pour les opérations I/O

Le GIL est libéré pendant les opérations I/O bloquantes :

```python
import threading
import time
import requests

def requete_http():
    """Tâche I/O-bound."""
    response = requests.get("https://api.example.com/data")
    return response.status_code

# Avec les threads, les opérations I/O peuvent se chevaucher
# car le GIL est libéré pendant l'attente I/O
start = time.time()

threads = []
for i in range(10):
    thread = threading.Thread(target=requete_http)
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()

temps_threads = time.time() - start
print(f"10 requêtes avec threads: {temps_threads:.2f}s")

# ✅ Les threads sont efficaces pour I/O car le GIL est libéré
```

## Exemples pratiques

### Exemple 1 : CPU-bound (GIL limite le parallélisme)

```python
import threading
import time

def calcul_cpu():
    """Tâche CPU-intensive."""
    total = 0
    for i in range(10000000):
        total += i
    return total

# Séquentiel
start = time.time()
calcul_cpu()
calcul_cpu()
print(f"Séquentiel: {time.time() - start:.2f}s")

# Avec threads (GIL limite)
start = time.time()
t1 = threading.Thread(target=calcul_cpu)
t2 = threading.Thread(target=calcul_cpu)
t1.start()
t2.start()
t1.join()
t2.join()
print(f"Threads: {time.time() - start:.2f}s")
# ⚠️ Pas d'amélioration (peut être pire à cause de l'overhead)
```

### Exemple 2 : I/O-bound (GIL libéré)

```python
import threading
import time
import urllib.request

def telecharger(url):
    """Télécharge une URL (I/O-bound)."""
    with urllib.request.urlopen(url) as response:
        return len(response.read())

urls = ["https://example.com"] * 10

# Séquentiel
start = time.time()
for url in urls:
    telecharger(url)
print(f"Séquentiel: {time.time() - start:.2f}s")

# Avec threads (GIL libéré pendant I/O)
start = time.time()
threads = []
for url in urls:
    thread = threading.Thread(target=telecharger, args=(url,))
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()
print(f"Threads: {time.time() - start:.2f}s")
# ✅ Amélioration significative car GIL libéré pendant I/O
```

### Exemple 3 : Mesurer l'impact du GIL

```python
import threading
import time

def tache_cpu():
    """Tâche CPU-intensive."""
    resultat = 0
    for i in range(5000000):
        resultat += i * i
    return resultat

# Test avec différents nombres de threads
for num_threads in [1, 2, 4, 8]:
    start = time.time()
    threads = []
    
    for _ in range(num_threads):
        thread = threading.Thread(target=tache_cpu)
        threads.append(thread)
        thread.start()
    
    for thread in threads:
        thread.join()
    
    temps = time.time() - start
    print(f"{num_threads} threads: {temps:.2f}s")
    
# Résultat typique :
# 1 thread: 2.50s
# 2 threads: 2.60s (⚠️ Pas d'amélioration, peut être pire)
# 4 threads: 2.80s (⚠️ Encore pire)
# 8 threads: 3.00s (⚠️ Pire à cause de l'overhead)
```

## Détails techniques

### Quand le GIL est libéré

Le GIL est libéré dans plusieurs situations :

1. **Opérations I/O** : Lecture/écriture de fichiers, requêtes réseau
2. **Appels C** : Certaines fonctions C libèrent le GIL
3. **Ticks** : Après un certain nombre d'instructions Python
4. **Sleep** : `time.sleep()` libère le GIL

```python
import threading
import time

def tache_avec_sleep():
    """Tâche qui libère le GIL avec sleep."""
    for i in range(5):
        print(f"Thread {threading.current_thread().name}: {i}")
        time.sleep(0.1)  # Libère le GIL pendant le sleep

# Les threads peuvent s'exécuter en parallèle pendant le sleep
thread1 = threading.Thread(target=tache_avec_sleep, name="T1")
thread2 = threading.Thread(target=tache_avec_sleep, name="T2")

thread1.start()
thread2.start()

thread1.join()
thread2.join()
```

### Extension C et GIL

Les extensions C peuvent libérer le GIL manuellement :

```c
// Exemple en C (simplifié)
Py_BEGIN_ALLOW_THREADS
// Code C qui peut s'exécuter sans le GIL
// (calculs intensifs, opérations système)
Py_END_ALLOW_THREADS
```

C'est pourquoi NumPy, certaines opérations de traitement d'images, etc., peuvent être parallèles même avec le GIL.

## Bonnes pratiques

### 1. Utilisez les threads pour I/O-bound

```python
# ✅ Bon : threads pour I/O
import threading
import requests

def telecharger(url):
    return requests.get(url).content

urls = ["url1", "url2", "url3"]
threads = [threading.Thread(target=telecharger, args=(url,)) 
           for url in urls]
for t in threads:
    t.start()
for t in threads:
    t.join()
```

### 2. Utilisez multiprocessing pour CPU-bound

```python
# ✅ Bon : multiprocessing pour CPU
from multiprocessing import Process

def calcul_intensif():
    # Calcul CPU-intensive
    pass

processes = [Process(target=calcul_intensif) for _ in range(4)]
for p in processes:
    p.start()
for p in processes:
    p.join()
```

### 3. Comprenez les limitations

```python
# ⚠️ Ne vous attendez pas à un parallélisme CPU avec threads
# Le GIL limite l'exécution parallèle du bytecode Python
```

## Points clés à retenir

- ✅ Le **GIL** permet à un seul thread d'exécuter du bytecode Python à la fois
- ✅ Le GIL existe pour **simplifier la gestion de la mémoire** en CPython
- ✅ Le GIL **limite le parallélisme CPU** mais pas le parallélisme I/O
- ✅ Le GIL est **libéré pendant les opérations I/O** bloquantes
- ✅ Les **threads sont efficaces pour I/O-bound**, pas pour CPU-bound
- ✅ Utilisez **multiprocessing** pour le parallélisme CPU
- ✅ Le GIL est spécifique à **CPython** (pas à PyPy, Jython, etc.)

Comprendre le GIL est essentiel pour optimiser les performances Python. Il explique pourquoi les threads ne sont pas efficaces pour les tâches CPU-bound mais le sont pour les tâches I/O-bound.
