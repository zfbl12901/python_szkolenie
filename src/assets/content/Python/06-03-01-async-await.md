---
title: "async / await"
order: 6.03.01
parent: "06-03-asynchrone.md"
tags: ["python", "async", "await", "coroutines"]
---

# async / await

Les mots-clés `async` et `await` permettent d'écrire du code asynchrone de manière claire et lisible. Introduits dans Python 3.5, ils ont révolutionné la programmation asynchrone en Python.

## Concepts de base

La programmation asynchrone permet d'exécuter plusieurs tâches de manière concurrente sans créer de threads. C'est particulièrement efficace pour les opérations I/O (requêtes réseau, lecture de fichiers) où l'attente peut être utilisée pour exécuter d'autres tâches.

**Différence clé** :
- **Threads** : Plusieurs threads s'exécutent en parallèle (avec le GIL qui limite)
- **Async** : Une seule thread, mais les tâches se chevauchent pendant l'attente I/O

## Fonctions async

### Définition d'une fonction async

Une fonction `async` est une **coroutine** qui peut être suspendue et reprise :

```python
import asyncio

async def ma_fonction():
    """Fonction asynchrone (coroutine)."""
    print("Début")
    await asyncio.sleep(1)  # Suspend l'exécution
    print("Fin")

# Appel (doit être dans un contexte async)
asyncio.run(ma_fonction())
```

### Caractéristiques

- Une fonction `async` retourne une **coroutine**, pas une valeur directement
- Une coroutine doit être **awaitée** ou exécutée avec `asyncio.run()`
- Une fonction `async` peut contenir `await` pour suspendre l'exécution

```python
async def exemple():
    return "Hello"

# ❌ Appel direct ne fonctionne pas comme prévu
coro = exemple()  # Retourne une coroutine, ne l'exécute pas
print(coro)  # <coroutine object exemple at 0x...>

# ✅ Exécution correcte
resultat = asyncio.run(exemple())
print(resultat)  # "Hello"
```

## Coroutines

### Qu'est-ce qu'une coroutine ?

Une **coroutine** est une fonction qui peut être suspendue et reprise. Elle est créée par une fonction `async` :

```python
async def ma_coroutine():
    print("Étape 1")
    await asyncio.sleep(1)  # Suspend ici
    print("Étape 2")
    await asyncio.sleep(1)  # Suspend ici
    print("Étape 3")
    return "Terminé"

# Exécution
resultat = asyncio.run(ma_coroutine())
# Étape 1
# (attente 1 seconde)
# Étape 2
# (attente 1 seconde)
# Étape 3
```

### État d'une coroutine

```python
async def exemple():
    await asyncio.sleep(1)
    return 42

coro = exemple()
print(coro)  # <coroutine object exemple at 0x...>

# État initial
import inspect
print(inspect.getgeneratorstate(coro))  # GEN_CREATED

# Exécution
resultat = asyncio.run(coro)
print(resultat)  # 42
```

## await et suspension

### Le mot-clé await

`await` suspend l'exécution de la coroutine jusqu'à ce que l'opération attendue soit terminée :

```python
import asyncio

async def tache():
    print("Avant await")
    await asyncio.sleep(2)  # Suspend pendant 2 secondes
    print("Après await")

asyncio.run(tache())
# Avant await
# (attente 2 secondes)
# Après await
```

### await avec d'autres coroutines

```python
import asyncio

async def tache1():
    await asyncio.sleep(1)
    return "Tâche 1 terminée"

async def tache2():
    await asyncio.sleep(1)
    return "Tâche 2 terminée"

async def taches_sequentielles():
    """Exécute les tâches séquentiellement."""
    resultat1 = await tache1()  # Attend la fin de tache1
    resultat2 = await tache2()  # Puis attend la fin de tache2
    return resultat1, resultat2

# Exécution (prend 2 secondes)
resultats = asyncio.run(taches_sequentielles())
print(resultats)  # ("Tâche 1 terminée", "Tâche 2 terminée")
```

### Exécution concurrente

Pour exécuter plusieurs coroutines en parallèle, utilisez `asyncio.gather()` :

```python
import asyncio

async def tache(nom, duree):
    print(f"{nom}: Début")
    await asyncio.sleep(duree)
    print(f"{nom}: Fin")
    return f"{nom} terminé"

async def taches_paralleles():
    """Exécute les tâches en parallèle."""
    resultats = await asyncio.gather(
        tache("T1", 1),
        tache("T2", 2),
        tache("T3", 1)
    )
    return resultats

# Exécution (prend ~2 secondes, pas 4)
resultats = asyncio.run(taches_paralleles())
print(resultats)
# T1: Début
# T2: Début
# T3: Début
# T1: Fin (après 1s)
# T3: Fin (après 1s)
# T2: Fin (après 2s)
# ['T1 terminé', 'T2 terminé', 'T3 terminé']
```

## Syntaxe et exemples

### Exemple 1 : Requêtes HTTP asynchrones

```python
import asyncio
import aiohttp

async def telecharger(url):
    """Télécharge une URL de manière asynchrone."""
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def telecharger_multiple():
    """Télécharge plusieurs URLs en parallèle."""
    urls = [
        "https://example.com",
        "https://example.org",
        "https://example.net"
    ]
    
    # Téléchargement parallèle
    resultats = await asyncio.gather(*[telecharger(url) for url in urls])
    return resultats

# Exécution
resultats = asyncio.run(telecharger_multiple())
```

### Exemple 2 : Traitement de fichiers

```python
import asyncio

async def lire_fichier(nom_fichier):
    """Lit un fichier de manière asynchrone."""
    # Utilise aiofiles pour I/O asynchrone
    import aiofiles
    async with aiofiles.open(nom_fichier, 'r') as f:
        contenu = await f.read()
    return contenu

async def traiter_fichiers():
    """Traite plusieurs fichiers en parallèle."""
    fichiers = ["fichier1.txt", "fichier2.txt", "fichier3.txt"]
    contenus = await asyncio.gather(*[lire_fichier(f) for f in fichiers])
    return contenus

# resultats = asyncio.run(traiter_fichiers())
```

### Exemple 3 : Boucle avec await

```python
import asyncio

async def traiter_items(items):
    """Traite une liste d'items de manière asynchrone."""
    resultats = []
    for item in items:
        # Traitement asynchrone de chaque item
        resultat = await traiter_item(item)
        resultats.append(resultat)
    return resultats

async def traiter_item(item):
    """Traite un item (simulation)."""
    await asyncio.sleep(0.1)  # Simule un traitement
    return f"Traité: {item}"

# Exécution
items = [1, 2, 3, 4, 5]
resultats = asyncio.run(traiter_items(items))
```

### Exemple 4 : Timeout avec asyncio.wait_for

```python
import asyncio

async def tache_lente():
    """Tâche qui peut prendre du temps."""
    await asyncio.sleep(5)
    return "Terminé"

async def avec_timeout():
    """Exécute une tâche avec timeout."""
    try:
        resultat = await asyncio.wait_for(tache_lente(), timeout=2.0)
        return resultat
    except asyncio.TimeoutError:
        return "Timeout!"

# Exécution
resultat = asyncio.run(avec_timeout())
print(resultat)  # "Timeout!" (la tâche prend 5s, timeout à 2s)
```

## Bonnes pratiques

### 1. Utilisez asyncio.run() pour l'entrée principale

```python
# ✅ Bon : point d'entrée
async def main():
    # Code async
    pass

if __name__ == "__main__":
    asyncio.run(main())
```

### 2. Utilisez await pour les opérations I/O

```python
# ✅ Bon : await pour I/O
async def lire_donnees():
    donnees = await lire_fichier("data.txt")
    return donnees

# ❌ Mauvais : opération bloquante
async def lire_donnees_mauvais():
    with open("data.txt") as f:  # ⚠️ Bloquant
        return f.read()
```

### 3. Utilisez asyncio.gather() pour le parallélisme

```python
# ✅ Bon : exécution parallèle
resultats = await asyncio.gather(
    tache1(),
    tache2(),
    tache3()
)

# ⚠️ Moins bon : exécution séquentielle
resultat1 = await tache1()
resultat2 = await tache2()
resultat3 = await tache3()
```

### 4. Ne mélangez pas async et sync

```python
# ❌ Mauvais : mélange async/sync
async def fonction_async():
    time.sleep(1)  # ⚠️ Bloquant, bloque tout

# ✅ Bon : utilisez await
async def fonction_async():
    await asyncio.sleep(1)  # ✅ Non-bloquant
```

## Pièges courants

### Piège 1 : Oublier await

```python
# ❌ Oubli de await
async def tache():
    await asyncio.sleep(1)
    return "Terminé"

async def appelant():
    resultat = tache()  # ⚠️ Retourne une coroutine, pas le résultat
    print(resultat)  # <coroutine object...>

# ✅ Correct
async def appelant():
    resultat = await tache()  # ✅ Attend le résultat
    print(resultat)  # "Terminé"
```

### Piège 2 : Opérations bloquantes

```python
# ❌ Bloquant
async def mauvais():
    time.sleep(1)  # ⚠️ Bloque tout le thread

# ✅ Non-bloquant
async def bon():
    await asyncio.sleep(1)  # ✅ Suspend seulement cette coroutine
```

### Piège 3 : Appeler async depuis sync

```python
# ❌ Mauvais : appel async depuis fonction sync
def fonction_sync():
    resultat = fonction_async()  # ⚠️ Retourne une coroutine

# ✅ Bon : utiliser asyncio.run()
def fonction_sync():
    resultat = asyncio.run(fonction_async())
```

## Points clés à retenir

- ✅ `async def` crée une **coroutine** (fonction asynchrone)
- ✅ `await` **suspend** l'exécution jusqu'à ce que l'opération soit terminée
- ✅ Utilisez `asyncio.run()` pour exécuter une coroutine depuis du code sync
- ✅ Utilisez `asyncio.gather()` pour exécuter plusieurs coroutines en **parallèle**
- ✅ Les coroutines sont **efficaces pour I/O**, pas pour CPU-bound
- ✅ N'utilisez **jamais** d'opérations bloquantes dans du code async
- ✅ Une coroutine doit être **awaitée** pour s'exécuter

`async/await` est un outil puissant pour la programmation asynchrone en Python. Il permet de gérer efficacement des milliers de connexions simultanées avec un seul thread, idéal pour les applications réseau et I/O.
