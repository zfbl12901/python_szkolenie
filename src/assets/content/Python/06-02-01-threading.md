---
title: "threading"
order: 6.02.01
parent: "06-02-concurrence-parallelisme.md"
tags: ["python", "threading", "threads", "concurrence"]
---

# threading

Le module `threading` permet de créer et gérer des threads en Python, idéal pour les tâches I/O-bound. Comprendre comment utiliser les threads efficacement est essentiel pour la concurrence en Python.

## Concepts de base

Les **threads** permettent d'exécuter plusieurs tâches de manière concurrente dans le même processus. En Python, les threads sont particulièrement efficaces pour les opérations I/O (lecture de fichiers, requêtes réseau) car le GIL est libéré pendant ces opérations.

**Important** : À cause du GIL, les threads ne sont pas efficaces pour les tâches CPU-bound. Utilisez `multiprocessing` pour le parallélisme CPU.

## Création de threads

### Méthode 1 : Classe Thread

```python
import threading
import time

class MonThread(threading.Thread):
    def __init__(self, nom):
        super().__init__()
        self.nom = nom
    
    def run(self):
        """Code exécuté dans le thread."""
        for i in range(5):
            print(f"{self.nom}: {i}")
            time.sleep(0.1)

# Utilisation
thread1 = MonThread("Thread-1")
thread2 = MonThread("Thread-2")

thread1.start()
thread2.start()

thread1.join()  # Attend la fin du thread
thread2.join()
```

### Méthode 2 : Fonction cible

```python
import threading
import time

def tache(nom):
    """Fonction exécutée dans le thread."""
    for i in range(5):
        print(f"{nom}: {i}")
        time.sleep(0.1)

# Création de threads
thread1 = threading.Thread(target=tache, args=("Thread-1",))
thread2 = threading.Thread(target=tache, args=("Thread-2",))

thread1.start()
thread2.start()

thread1.join()
thread2.join()
```

### Exemple pratique : Téléchargements parallèles

```python
import threading
import urllib.request
import time

def telecharger(url, nom):
    """Télécharge une URL."""
    print(f"{nom}: Début du téléchargement de {url}")
    start = time.time()
    
    with urllib.request.urlopen(url) as response:
        contenu = response.read()
    
    temps = time.time() - start
    print(f"{nom}: Téléchargé {len(contenu)} bytes en {temps:.2f}s")
    return contenu

# URLs à télécharger
urls = [
    ("https://example.com", "T1"),
    ("https://example.org", "T2"),
    ("https://example.net", "T3"),
]

# Téléchargement séquentiel
start = time.time()
for url, nom in urls:
    telecharger(url, nom)
temps_sequentiel = time.time() - start
print(f"Temps séquentiel: {temps_sequentiel:.2f}s\n")

# Téléchargement parallèle avec threads
start = time.time()
threads = []
for url, nom in urls:
    thread = threading.Thread(target=telecharger, args=(url, nom))
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()

temps_parallele = time.time() - start
print(f"Temps parallèle: {temps_parallele:.2f}s")
print(f"Amélioration: {temps_sequentiel / temps_parallele:.2f}x")
```

## Synchronisation (locks, semaphores)

### Lock (verrou)

Un `Lock` permet de synchroniser l'accès à une ressource partagée :

```python
import threading

# Ressource partagée
compteur = 0
lock = threading.Lock()

def incrementer():
    """Incrémente le compteur de manière thread-safe."""
    global compteur
    for _ in range(100000):
        with lock:  # Acquiert le verrou
            compteur += 1
        # Le verrou est libéré automatiquement

# Sans lock (❌ Race condition)
compteur_non_protege = 0

def incrementer_non_protege():
    global compteur_non_protege
    for _ in range(100000):
        compteur_non_protege += 1  # ⚠️ Race condition

# Test
threads = [threading.Thread(target=incrementer) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"Compteur protégé: {compteur}")  # 500000 ✅

threads = [threading.Thread(target=incrementer_non_protege) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"Compteur non protégé: {compteur_non_protege}")  # ⚠️ Peut être < 500000
```

### RLock (Reentrant Lock)

Un `RLock` permet au même thread d'acquérir le verrou plusieurs fois :

```python
import threading

lock = threading.RLock()

def fonction_recursive(n):
    """Fonction récursive qui utilise le lock."""
    with lock:  # Acquiert le lock
        if n > 0:
            print(f"Niveau {n}")
            fonction_recursive(n - 1)  # Acquiert le lock à nouveau (OK avec RLock)
        # Le lock est libéré

# Avec Lock normal, cela causerait un deadlock
# Avec RLock, c'est OK
fonction_recursive(5)
```

### Semaphore

Un `Semaphore` limite le nombre de threads qui peuvent accéder à une ressource :

```python
import threading
import time

# Semaphore qui permet 3 accès simultanés
semaphore = threading.Semaphore(3)

def acceder_ressource(nom):
    """Accède à une ressource limitée."""
    with semaphore:
        print(f"{nom}: Accès à la ressource")
        time.sleep(2)  # Simule l'utilisation de la ressource
        print(f"{nom}: Libération de la ressource")

# 5 threads, mais seulement 3 peuvent accéder simultanément
threads = [threading.Thread(target=acceder_ressource, args=(f"T{i}",)) 
           for i in range(5)]

for t in threads:
    t.start()

for t in threads:
    t.join()
```

## Communication entre threads

### Queue

`queue.Queue` permet la communication thread-safe entre threads :

```python
import threading
import queue
import time

def producteur(q, nom):
    """Produit des éléments."""
    for i in range(5):
        item = f"{nom}-{i}"
        q.put(item)
        print(f"Produit: {item}")
        time.sleep(0.1)

def consommateur(q, nom):
    """Consomme des éléments."""
    while True:
        try:
            item = q.get(timeout=1)
            print(f"{nom} a consommé: {item}")
            q.task_done()
        except queue.Empty:
            break

# Création de la queue
q = queue.Queue()

# Threads producteurs
producteurs = [
    threading.Thread(target=producteur, args=(q, f"P{i}"))
    for i in range(2)
]

# Threads consommateurs
consommateurs = [
    threading.Thread(target=consommateur, args=(q, f"C{i}"))
    for i in range(2)
]

# Démarrage
for p in producteurs:
    p.start()

for c in consommateurs:
    c.start()

# Attente
for p in producteurs:
    p.join()

q.join()  # Attend que tous les items soient traités
```

### Event

Un `Event` permet la synchronisation entre threads :

```python
import threading
import time

# Event pour signaler
event = threading.Event()

def attente_signal(nom):
    """Attend un signal."""
    print(f"{nom}: En attente du signal...")
    event.wait()  # Attend que l'event soit déclenché
    print(f"{nom}: Signal reçu!")

def declencher_signal():
    """Déclenche le signal après 2 secondes."""
    time.sleep(2)
    print("Déclenchement du signal...")
    event.set()  # Déclenche l'event

# Threads en attente
threads = [
    threading.Thread(target=attente_signal, args=(f"T{i}",))
    for i in range(3)
]

# Thread qui déclenche
thread_signal = threading.Thread(target=declencher_signal)

# Démarrage
for t in threads:
    t.start()

thread_signal.start()

# Attente
for t in threads:
    t.join()
thread_signal.join()
```

## Cas d'usage

### Cas d'usage 1 : Serveur web simple

```python
import threading
import socket
import time

def gerer_client(client_socket, adresse):
    """Gère une connexion client."""
    print(f"Connexion de {adresse}")
    
    # Simule le traitement
    time.sleep(1)
    
    # Réponse
    client_socket.send(b"HTTP/1.1 200 OK\r\n\r\nHello!")
    client_socket.close()
    print(f"Déconnexion de {adresse}")

def serveur():
    """Serveur multi-threaded."""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("localhost", 8000))
    server.listen(5)
    
    print("Serveur démarré sur localhost:8000")
    
    while True:
        client, adresse = server.accept()
        # Crée un thread pour chaque client
        thread = threading.Thread(target=gerer_client, args=(client, adresse))
        thread.start()

# serveur()  # Démarre le serveur
```

### Cas d'usage 2 : Traitement de fichiers

```python
import threading
import os

def traiter_fichier(nom_fichier):
    """Traite un fichier."""
    print(f"Traitement de {nom_fichier}")
    # Simulation de traitement
    with open(nom_fichier, 'r') as f:
        contenu = f.read()
    # Traitement...
    print(f"Terminé: {nom_fichier}")

# Liste de fichiers à traiter
fichiers = ["fichier1.txt", "fichier2.txt", "fichier3.txt"]

# Traitement parallèle
threads = [
    threading.Thread(target=traiter_fichier, args=(f,))
    for f in fichiers
]

for t in threads:
    t.start()

for t in threads:
    t.join()

print("Tous les fichiers traités")
```

## Limitations du GIL

### Impact sur CPU-bound

```python
import threading
import time

def calcul_intensif():
    """Tâche CPU-intensive."""
    resultat = 0
    for i in range(10000000):
        resultat += i * i
    return resultat

# Séquentiel
start = time.time()
calcul_intensif()
calcul_intensif()
temps_seq = time.time() - start

# Avec threads (GIL limite)
start = time.time()
t1 = threading.Thread(target=calcul_intensif)
t2 = threading.Thread(target=calcul_intensif)
t1.start()
t2.start()
t1.join()
t2.join()
temps_threads = time.time() - start

print(f"Séquentiel: {temps_seq:.2f}s")
print(f"Threads: {temps_threads:.2f}s")
# ⚠️ Pas d'amélioration (peut être pire)
```

**Solution** : Utilisez `multiprocessing` pour les tâches CPU-bound.

## Bonnes pratiques

### 1. Utilisez les threads pour I/O-bound

```python
# ✅ Bon : threads pour I/O
def telecharger(url):
    return requests.get(url).content

threads = [threading.Thread(target=telecharger, args=(url,)) 
           for url in urls]
```

### 2. Utilisez des locks pour les ressources partagées

```python
# ✅ Bon : protection avec lock
lock = threading.Lock()

def modifier_ressource():
    with lock:
        # Modification thread-safe
        pass
```

### 3. Utilisez Queue pour la communication

```python
# ✅ Bon : communication thread-safe
q = queue.Queue()
q.put(item)
item = q.get()
```

### 4. Évitez les threads pour CPU-bound

```python
# ❌ Mauvais : threads pour CPU
def calcul():
    # Calcul intensif
    pass

# ✅ Bon : multiprocessing pour CPU
from multiprocessing import Process
```

## Points clés à retenir

- ✅ Les **threads** sont efficaces pour les tâches **I/O-bound**
- ✅ Les threads **ne sont pas efficaces** pour les tâches **CPU-bound** (à cause du GIL)
- ✅ Utilisez des **locks** pour protéger les ressources partagées
- ✅ Utilisez **Queue** pour la communication thread-safe entre threads
- ✅ Utilisez **Event** pour la synchronisation entre threads
- ✅ Le GIL est **libéré pendant les opérations I/O**, permettant la concurrence
- ✅ Pour CPU-bound, utilisez **multiprocessing** au lieu de threading

Les threads sont un outil puissant pour la concurrence I/O en Python. Comprendre leurs forces et limitations (notamment le GIL) est essentiel pour les utiliser efficacement.
