---
title: "Gestion des Erreurs et Exceptions"
order: 10
parent: null
tags: ["python", "basics", "exceptions", "error-handling"]
---

# Gestion des Erreurs et Exceptions

La gestion des erreurs est essentielle pour créer des programmes robustes. Python utilise un système d'exceptions pour gérer les erreurs de manière élégante et contrôlée.

## Types d'erreurs

### Erreurs de syntaxe (SyntaxError)

```python
# ❌ Erreur de syntaxe
if True
    print("Erreur")

# ✅ Correct
if True:
    print("Correct")
```

### Erreurs d'exécution (Runtime Errors)

```python
# Erreurs courantes
10 / 0              # ZeroDivisionError
liste[10]           # IndexError (si liste trop courte)
dico["cle"]         # KeyError (si clé n'existe pas)
int("abc")          # ValueError
```

## Try/Except : Gestion de base

### Structure de base

```python
try:
    # Code qui peut générer une erreur
    resultat = 10 / 0
except ZeroDivisionError:
    # Code exécuté en cas d'erreur
    print("Division par zéro impossible")
```

### Exemple pratique

```python
def diviser(a, b):
    try:
        resultat = a / b
        return resultat
    except ZeroDivisionError:
        print("Erreur : Division par zéro")
        return None

print(diviser(10, 2))   # 5.0
print(diviser(10, 0))   # Erreur : Division par zéro, None
```

## Gestion de plusieurs exceptions

### Plusieurs blocs except

```python
try:
    nombre = int(input("Entrez un nombre : "))
    resultat = 10 / nombre
    print(f"Résultat : {resultat}")
except ValueError:
    print("Erreur : Vous devez entrer un nombre valide")
except ZeroDivisionError:
    print("Erreur : Division par zéro impossible")
except Exception as e:
    print(f"Erreur inattendue : {e}")
```

### Un seul bloc pour plusieurs exceptions

```python
try:
    # Code
    pass
except (ValueError, TypeError, ZeroDivisionError) as e:
    print(f"Erreur : {e}")
```

## Else et Finally

### Else : exécuté si pas d'erreur

```python
try:
    nombre = int(input("Entrez un nombre : "))
except ValueError:
    print("Nombre invalide")
else:
    # Exécuté seulement si aucune exception n'est levée
    print(f"Vous avez entré : {nombre}")
```

### Finally : toujours exécuté

```python
fichier = None
try:
    fichier = open("fichier.txt", "r")
    contenu = fichier.read()
except FileNotFoundError:
    print("Fichier non trouvé")
finally:
    # Toujours exécuté, même en cas d'erreur
    if fichier:
        fichier.close()
    print("Nettoyage terminé")
```

## Lever des exceptions (raise)

### Lever une exception personnalisée

```python
def valider_age(age):
    if age < 0:
        raise ValueError("L'âge ne peut pas être négatif")
    if age > 150:
        raise ValueError("L'âge semble invalide")
    return True

try:
    valider_age(-5)
except ValueError as e:
    print(f"Erreur : {e}")
```

### Lever une exception existante

```python
def obtenir_element(liste, index):
    if index < 0 or index >= len(liste):
        raise IndexError(f"Index {index} hors limites")
    return liste[index]

try:
    element = obtenir_element([1, 2, 3], 5)
except IndexError as e:
    print(f"Erreur : {e}")
```

## Exceptions personnalisées

### Créer une exception personnalisée

```python
class ErreurSoldeInsuffisant(Exception):
    """Exception levée quand le solde est insuffisant"""
    pass

class CompteBancaire:
    def __init__(self, solde_initial):
        self.solde = solde_initial
    
    def retirer(self, montant):
        if montant > self.solde:
            raise ErreurSoldeInsuffisant(
                f"Solde insuffisant. Solde actuel : {self.solde}, "
                f"Montant demandé : {montant}"
            )
        self.solde -= montant
        return self.solde

compte = CompteBancaire(100)
try:
    compte.retirer(150)
except ErreurSoldeInsuffisant as e:
    print(f"Erreur : {e}")
```

### Exception avec attributs

```python
class ErreurValidation(Exception):
    def __init__(self, message, champ, valeur):
        self.message = message
        self.champ = champ
        self.valeur = valeur
        super().__init__(self.message)
    
    def __str__(self):
        return f"{self.message} (champ: {self.champ}, valeur: {self.valeur})"

def valider_email(email):
    if "@" not in email:
        raise ErreurValidation("Email invalide", "email", email)
    return True

try:
    valider_email("email-invalide")
except ErreurValidation as e:
    print(f"Erreur : {e}")
    print(f"Champ en erreur : {e.champ}")
```

## Assertions

### Utilisation de assert

```python
def calculer_moyenne(nombres):
    assert len(nombres) > 0, "La liste ne peut pas être vide"
    assert all(isinstance(n, (int, float)) for n in nombres), \
        "Tous les éléments doivent être des nombres"
    
    return sum(nombres) / len(nombres)

# En production, désactiver les assertions avec -O
# python -O script.py
```

## Gestion d'erreurs avec context managers

### Utilisation de with

```python
# Gestion automatique de la fermeture
try:
    with open("fichier.txt", "r") as fichier:
        contenu = fichier.read()
        # Fichier fermé automatiquement, même en cas d'erreur
except FileNotFoundError:
    print("Fichier non trouvé")
```

### Créer un context manager personnalisé

```python
class GestionnaireFichier:
    def __init__(self, nom_fichier, mode):
        self.nom_fichier = nom_fichier
        self.mode = mode
        self.fichier = None
    
    def __enter__(self):
        self.fichier = open(self.nom_fichier, self.mode)
        return self.fichier
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.fichier:
            self.fichier.close()
        # Retourner False pour propager l'exception
        return False

# Utilisation
with GestionnaireFichier("test.txt", "w") as f:
    f.write("Hello")
```

## Hiérarchie des exceptions

```python
# BaseException
# ├── KeyboardInterrupt
# ├── SystemExit
# └── Exception
#     ├── ArithmeticError
#     │   ├── ZeroDivisionError
#     │   └── OverflowError
#     ├── LookupError
#     │   ├── IndexError
#     │   └── KeyError
#     ├── ValueError
#     ├── TypeError
#     ├── FileNotFoundError
#     └── ...
```

### Capturer des exceptions de base

```python
try:
    # Code
    pass
except Exception:  # Capture toutes les exceptions (sauf SystemExit, KeyboardInterrupt)
    print("Erreur générale")
```

## Bonnes pratiques

### 1. Être spécifique

```python
# ❌ MAUVAIS : trop général
try:
    resultat = operation()
except:
    pass

# ✅ BON : spécifique
try:
    resultat = operation()
except ValueError as e:
    print(f"Erreur de valeur : {e}")
except TypeError as e:
    print(f"Erreur de type : {e}")
```

### 2. Ne pas ignorer silencieusement

```python
# ❌ MAUVAIS
try:
    operation()
except:
    pass  # Ignore toutes les erreurs

# ✅ BON
try:
    operation()
except Exception as e:
    logger.error(f"Erreur : {e}")  # Log l'erreur
    # Ou gérer l'erreur de manière appropriée
```

### 3. Utiliser finally pour le nettoyage

```python
ressource = None
try:
    ressource = acquerir_ressource()
    utiliser_ressource(ressource)
except Exception as e:
    print(f"Erreur : {e}")
finally:
    if ressource:
        liberer_ressource(ressource)
```

### 4. Messages d'erreur informatifs

```python
# ❌ MAUVAIS
raise ValueError("Erreur")

# ✅ BON
raise ValueError(
    f"L'âge doit être entre 0 et 150. Valeur reçue : {age}"
)
```

## Exemples pratiques

### Validation de données

```python
def valider_utilisateur(nom, email, age):
    erreurs = []
    
    if not nom or len(nom.strip()) == 0:
        erreurs.append("Le nom est requis")
    
    if "@" not in email:
        erreurs.append("Email invalide")
    
    try:
        age = int(age)
        if age < 0 or age > 150:
            erreurs.append("Âge invalide")
    except ValueError:
        erreurs.append("L'âge doit être un nombre")
    
    if erreurs:
        raise ValueError("Erreurs de validation : " + ", ".join(erreurs))
    
    return {"nom": nom, "email": email, "age": age}

try:
    utilisateur = valider_utilisateur("Alice", "alice@example.com", "25")
    print("Utilisateur valide :", utilisateur)
except ValueError as e:
    print(f"Erreur : {e}")
```

### Gestion de fichiers avec erreurs

```python
def lire_fichier(nom_fichier):
    try:
        with open(nom_fichier, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        raise FileNotFoundError(f"Le fichier '{nom_fichier}' n'existe pas")
    except PermissionError:
        raise PermissionError(f"Permission refusée pour '{nom_fichier}'")
    except UnicodeDecodeError:
        raise ValueError(f"Erreur d'encodage dans '{nom_fichier}'")

try:
    contenu = lire_fichier("donnees.txt")
    print(contenu)
except (FileNotFoundError, PermissionError, ValueError) as e:
    print(f"Erreur lors de la lecture : {e}")
```

### Retry avec gestion d'erreurs

```python
import time

def operation_avec_retry(operation, max_tentatives=3, delai=1):
    """Tente une opération plusieurs fois en cas d'échec"""
    for tentative in range(max_tentatives):
        try:
            return operation()
        except Exception as e:
            if tentative == max_tentatives - 1:
                raise  # Relance l'exception à la dernière tentative
            print(f"Tentative {tentative + 1} échouée : {e}. Nouvelle tentative...")
            time.sleep(delai)

# Utilisation
def operation_risquee():
    import random
    if random.random() < 0.7:
        raise ConnectionError("Connexion échouée")
    return "Succès"

resultat = operation_avec_retry(operation_risquee)
print(resultat)
```

## Logging des erreurs

```python
import logging

# Configuration du logging
logging.basicConfig(
    level=logging.ERROR,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def fonction_avec_logging():
    try:
        resultat = 10 / 0
    except ZeroDivisionError as e:
        logging.error(f"Division par zéro : {e}", exc_info=True)
        raise

fonction_avec_logging()
```

## Résumé

- **try/except** : Gère les exceptions de manière contrôlée
- **else** : Exécuté si aucune exception
- **finally** : Toujours exécuté (nettoyage)
- **raise** : Lève une exception
- **Exceptions personnalisées** : Créez vos propres exceptions
- **with** : Context managers pour gestion automatique des ressources
- **Bonnes pratiques** : Soyez spécifique, ne ignorez pas les erreurs, loggez-les

La gestion d'erreurs est cruciale pour créer des applications robustes et fiables. Maîtrisez ces concepts pour écrire du code professionnel !
