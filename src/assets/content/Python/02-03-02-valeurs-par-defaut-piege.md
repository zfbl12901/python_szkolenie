---
title: "Valeurs par défaut (piège classique)"
order: 2.03.02
parent: "02-03-fonctions-citoyens-premiere-classe.md"
tags: ["python", "fonctions", "pièges"]
---

# Valeurs par défaut (piège classique)

Les valeurs par défaut en Python peuvent être source de bugs subtils si on ne comprend pas comment elles sont évaluées. C'est l'un des pièges les plus courants et les plus difficiles à détecter pour les développeurs venant d'autres langages.

## Concepts de base

En Python, les valeurs par défaut sont **évaluées une seule fois**, au moment de la définition de la fonction, pas à chaque appel. Cela signifie que si vous utilisez un objet mutable comme valeur par défaut, le même objet sera réutilisé à chaque appel.

## Le piège des objets mutables

### Le bug classique

Voici le piège le plus célèbre en Python :

```python
# ❌ BUG CLASSIQUE
def ajouter_element(element, liste=[]):
    liste.append(element)
    return liste

# Premiers appels
print(ajouter_element(1))  # [1]
print(ajouter_element(2))  # [1, 2] ⚠️ La liste persiste!
print(ajouter_element(3))  # [1, 2, 3] ⚠️ Encore pire!

# Tous partagent la même liste!
resultat1 = ajouter_element("a")
resultat2 = ajouter_element("b")
print(resultat1)  # ['a', 'b'] ⚠️
print(resultat2)  # ['a', 'b'] ⚠️
print(resultat1 is resultat2)  # True (même objet!)
```

### Pourquoi cela se produit ?

Les valeurs par défaut sont évaluées **une seule fois** lors de la définition de la fonction, pas à chaque appel. Si la valeur par défaut est un objet mutable (list, dict, set), le même objet est réutilisé.

```python
def fonction(liste=[]):
    print(f"ID de la liste: {id(liste)}")
    liste.append(1)
    return liste

# Tous les appels utilisent la même liste (même ID)
resultat1 = fonction()  # ID de la liste: 140234567890
resultat2 = fonction()  # ID de la liste: 140234567890 (même ID!)
resultat3 = fonction()  # ID de la liste: 140234567890 (même ID!)

print(resultat1)  # [1, 1, 1]
print(resultat2)  # [1, 1, 1]
print(resultat3)  # [1, 1, 1]
```

### Démonstration avec un dictionnaire

```python
# ❌ Même problème avec les dictionnaires
def ajouter_config(cle, valeur, config={}):
    config[cle] = valeur
    return config

config1 = ajouter_config("host", "localhost")
config2 = ajouter_config("port", 8000)

print(config1)  # {'host': 'localhost', 'port': 8000} ⚠️
print(config2)  # {'host': 'localhost', 'port': 8000} ⚠️
print(config1 is config2)  # True (même objet!)
```

## Solutions et bonnes pratiques

### Solution 1 : Utiliser None (recommandé)

La solution la plus courante et recommandée est d'utiliser `None` comme valeur par défaut :

```python
# ✅ Solution correcte
def ajouter_element(element, liste=None):
    if liste is None:
        liste = []
    liste.append(element)
    return liste

# Maintenant ça fonctionne correctement
print(ajouter_element(1))  # [1]
print(ajouter_element(2))  # [2] ✅ Nouvelle liste à chaque fois
print(ajouter_element(3))  # [3] ✅ Nouvelle liste à chaque fois

resultat1 = ajouter_element("a")
resultat2 = ajouter_element("b")
print(resultat1)  # ['a'] ✅
print(resultat2)  # ['b'] ✅
print(resultat1 is resultat2)  # False (objets différents)
```

### Solution 2 : Utiliser un objet immutable

Pour les valeurs par défaut, préférez les objets immutables :

```python
# ✅ Immutable : pas de problème
def fonction(nombre=0):  # int est immutable
    nombre += 1
    return nombre

print(fonction())  # 1
print(fonction())  # 1 ✅ (nouvel objet à chaque fois)

# ✅ Immutable : pas de problème
def fonction(texte=""):  # str est immutable
    texte += "!"
    return texte

print(fonction())  # "!"
print(fonction())  # "!" ✅ (nouvelle chaîne à chaque fois)
```

### Solution 3 : Créer une nouvelle instance explicitement

```python
# ✅ Créer explicitement une nouvelle instance
def ajouter_element(element, liste=None):
    liste = list(liste) if liste is not None else []
    liste.append(element)
    return liste
```

### Solution 4 : Utiliser un factory function (avancé)

Pour des cas plus complexes, vous pouvez utiliser une fonction factory :

```python
# ✅ Factory function
def creer_liste_vide():
    return []

def ajouter_element(element, liste=None):
    if liste is None:
        liste = creer_liste_vide()
    liste.append(element)
    return liste
```

## Exemples de bugs courants

### Bug 1 : Accumulation dans une liste

```python
# ❌ Bug
def traiter_donnees(donnees, resultats=[]):
    for item in donnees:
        resultats.append(item * 2)
    return resultats

# Premiers appels
r1 = traiter_donnees([1, 2, 3])
print(r1)  # [2, 4, 6]

r2 = traiter_donnees([4, 5])
print(r2)  # [2, 4, 6, 8, 10] ⚠️ Accumule les résultats précédents!

# ✅ Solution
def traiter_donnees(donnees, resultats=None):
    if resultats is None:
        resultats = []
    for item in donnees:
        resultats.append(item * 2)
    return resultats
```

### Bug 2 : Configuration partagée

```python
# ❌ Bug
def configurer_app(options={}):
    options["timestamp"] = "2024-01-01"
    return options

config1 = configurer_app({"host": "localhost"})
config2 = configurer_app({"port": 8000})

print(config1)  # {'host': 'localhost', 'timestamp': '2024-01-01', 'port': 8000} ⚠️
print(config2)  # {'host': 'localhost', 'timestamp': '2024-01-01', 'port': 8000} ⚠️

# ✅ Solution
def configurer_app(options=None):
    if options is None:
        options = {}
    options = options.copy()  # Copie pour ne pas modifier l'original
    options["timestamp"] = "2024-01-01"
    return options
```

### Bug 3 : Cache partagé

```python
# ❌ Bug
def calculer_avec_cache(n, cache={}):
    if n in cache:
        return cache[n]
    resultat = n * 2
    cache[n] = resultat
    return resultat

# Le cache persiste entre les appels (peut être voulu ou non)
print(calculer_avec_cache(5))  # 10
print(calculer_avec_cache(5))  # 10 (depuis le cache)
print(calculer_avec_cache(10)) # 20

# Si vous voulez un nouveau cache à chaque fois :
# ✅ Solution
def calculer_avec_cache(n, cache=None):
    if cache is None:
        cache = {}
    if n in cache:
        return cache[n]
    resultat = n * 2
    cache[n] = resultat
    return resultat
```

### Bug 4 : Classes avec attributs mutables

```python
# ❌ Bug dans une classe
class Utilisateur:
    def __init__(self, nom, amis=[]):  # ⚠️ Liste mutable
        self.nom = nom
        self.amis = amis

alice = Utilisateur("Alice")
bob = Utilisateur("Bob")

alice.amis.append("Charlie")
print(alice.amis)  # ['Charlie']
print(bob.amis)    # ['Charlie'] ⚠️ Bob a aussi Charlie!

# ✅ Solution
class Utilisateur:
    def __init__(self, nom, amis=None):
        self.nom = nom
        self.amis = amis if amis is not None else []
```

## Comportement avec types immutables

Avec les types immutables, le comportement est différent mais peut aussi être surprenant :

```python
def fonction(nombre=0):  # int est immutable
    nombre += 1
    return nombre

print(fonction())  # 1
print(fonction())  # 1 (pas d'accumulation car nouveau objet)

# Mais attention aux références
def fonction(liste=[], nombre=0):
    nombre += 1  # Crée un nouvel objet int
    liste.append(nombre)  # Modifie la liste (mutable)
    return liste, nombre

resultat1 = fonction()
resultat2 = fonction()
print(resultat1)  # ([1], 1)
print(resultat2)  # ([1, 2], 2) ⚠️ Liste accumule, nombre non
```

## Détection et prévention

### Comment détecter le problème

```python
# Test pour détecter le problème
def fonction_test(liste=[]):
    liste.append(1)
    return liste

# Si les résultats partagent le même ID, c'est un bug
r1 = fonction_test()
r2 = fonction_test()
print(r1 is r2)  # True ⚠️ Problème détecté!
```

### Outils de détection

Certains linters peuvent détecter ce problème :

```python
# pylint peut détecter :
# dangerous-default-value (W0102)

# mypy peut aussi aider à détecter certains cas
```

### Bonnes pratiques pour éviter le piège

1. **Toujours utiliser None pour les valeurs par défaut mutables**

```python
# ✅ Toujours faire ça
def fonction(liste=None, dico=None, ensemble=None):
    if liste is None:
        liste = []
    if dico is None:
        dico = {}
    if ensemble is None:
        ensemble = set()
    # ...
```

2. **Documenter le comportement**

```python
def ajouter_element(element, liste=None):
    """
    Ajoute un élément à une liste.
    
    Args:
        element: Élément à ajouter
        liste: Liste à modifier. Si None, une nouvelle liste est créée.
    
    Returns:
        La liste modifiée (ou nouvelle liste si liste était None)
    """
    if liste is None:
        liste = []
    liste.append(element)
    return liste
```

3. **Utiliser des types hints**

```python
from typing import List, Optional

def ajouter_element(element: int, liste: Optional[List[int]] = None) -> List[int]:
    if liste is None:
        liste = []
    liste.append(element)
    return liste
```

## Cas particuliers

### Quand le comportement est voulu

Parfois, vous voulez **vraiment** que l'objet persiste entre les appels (comme un cache) :

```python
# ✅ Comportement voulu : cache persistant
def fibonacci(n, cache={}):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    resultat = fibonacci(n-1, cache) + fibonacci(n-2, cache)
    cache[n] = resultat
    return resultat

# Le cache persiste entre les appels (optimisation)
print(fibonacci(10))  # Calcule et met en cache
print(fibonacci(10))  # Utilise le cache
```

Dans ce cas, documentez clairement le comportement :

```python
def fibonacci(n, cache=None):
    """
    Calcule le n-ième nombre de Fibonacci.
    
    Args:
        n: Index du nombre de Fibonacci
        cache: Cache interne (réutilisé entre appels pour optimisation).
               Ne pas passer explicitement.
    """
    if cache is None:
        cache = {}
    # ... reste du code
```

## Points clés à retenir

- ✅ Les valeurs par défaut sont **évaluées une seule fois** lors de la définition
- ✅ Utilisez **`None`** comme valeur par défaut pour les objets mutables
- ✅ Créez une nouvelle instance dans le corps de la fonction si la valeur est `None`
- ✅ Les objets immutables (int, str, tuple) ne posent pas ce problème
- ✅ Les objets mutables (list, dict, set) posent problème comme valeurs par défaut
- ✅ Documentez le comportement si vous utilisez intentionnellement un objet mutable
- ✅ Testez vos fonctions pour détecter ce problème
- ✅ Utilisez des linters pour détecter automatiquement ce problème

Ce piège est l'un des plus courants en Python. Une fois que vous le comprenez, vous pouvez l'éviter facilement en utilisant systématiquement `None` pour les valeurs par défaut mutables. C'est une règle d'or en Python : **jamais d'objet mutable comme valeur par défaut**.
