---
title: "Manipulation de Fichiers et I/O"
order: 11
parent: null
tags: ["python", "basics", "files", "io"]
---

# Manipulation de Fichiers et I/O

Python offre de nombreuses fonctionnalités pour lire et écrire des fichiers, ainsi que pour interagir avec l'entrée/sortie standard.

## Ouvrir et fermer des fichiers

### Méthode basique (à éviter)

```python
# ❌ Méthode basique (risque d'oublier de fermer)
fichier = open("fichier.txt", "r")
contenu = fichier.read()
fichier.close()
```

### Méthode recommandée : with

```python
# ✅ Méthode recommandée (fermeture automatique)
with open("fichier.txt", "r") as fichier:
    contenu = fichier.read()
# Le fichier est automatiquement fermé ici
```

## Modes d'ouverture

```python
# Modes de base
"r"   # Lecture (read) - défaut pour texte
"w"   # Écriture (write) - écrase le fichier
"a"   # Ajout (append) - ajoute à la fin
"x"   # Création exclusive - erreur si existe déjà

# Modes binaires
"rb"  # Lecture binaire
"wb"  # Écriture binaire
"ab"  # Ajout binaire

# Modes combinés
"r+"  # Lecture et écriture
"w+"  # Écriture et lecture (écrase)
"a+"  # Ajout et lecture
```

## Lecture de fichiers

### Lire tout le contenu

```python
with open("fichier.txt", "r", encoding="utf-8") as f:
    contenu = f.read()  # Lit tout le fichier
    print(contenu)
```

### Lire ligne par ligne

```python
# Méthode 1 : readline()
with open("fichier.txt", "r") as f:
    ligne = f.readline()  # Lit une ligne
    while ligne:
        print(ligne.strip())  # strip() enlève \n
        ligne = f.readline()

# Méthode 2 : readlines()
with open("fichier.txt", "r") as f:
    lignes = f.readlines()  # Liste de toutes les lignes
    for ligne in lignes:
        print(ligne.strip())

# Méthode 3 : Itérer directement (recommandé)
with open("fichier.txt", "r") as f:
    for ligne in f:
        print(ligne.strip())
```

### Lire un nombre limité de caractères

```python
with open("fichier.txt", "r") as f:
    premiers_100 = f.read(100)  # Lit les 100 premiers caractères
```

## Écriture de fichiers

### Écrire du texte

```python
# Écriture simple (écrase le fichier)
with open("fichier.txt", "w", encoding="utf-8") as f:
    f.write("Ligne 1\n")
    f.write("Ligne 2\n")

# Écriture multiple
lignes = ["Ligne 1\n", "Ligne 2\n", "Ligne 3\n"]
with open("fichier.txt", "w") as f:
    f.writelines(lignes)
```

### Ajouter du contenu

```python
with open("fichier.txt", "a", encoding="utf-8") as f:
    f.write("Nouvelle ligne ajoutée\n")
```

### Écriture formatée

```python
nom = "Alice"
age = 25

with open("profil.txt", "w") as f:
    f.write(f"Nom : {nom}\n")
    f.write(f"Âge : {age}\n")
    f.write(f"Année de naissance : {2024 - age}\n")
```

## Gestion des erreurs

```python
def lire_fichier_securise(nom_fichier):
    try:
        with open(nom_fichier, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print(f"Erreur : Le fichier '{nom_fichier}' n'existe pas")
        return None
    except PermissionError:
        print(f"Erreur : Permission refusée pour '{nom_fichier}'")
        return None
    except UnicodeDecodeError:
        print(f"Erreur : Problème d'encodage dans '{nom_fichier}'")
        return None

contenu = lire_fichier_securise("fichier.txt")
```

## Fichiers CSV

### Lecture CSV

```python
import csv

# Lecture simple
with open("donnees.csv", "r", encoding="utf-8") as f:
    lecteur = csv.reader(f)
    for ligne in lecteur:
        print(ligne)  # Liste de valeurs

# Lecture avec dictionnaire
with open("donnees.csv", "r", encoding="utf-8") as f:
    lecteur = csv.DictReader(f)
    for ligne in lecteur:
        print(ligne)  # Dictionnaire avec clés = en-têtes
        print(ligne["nom"])  # Accès par clé
```

### Écriture CSV

```python
import csv

# Écriture simple
donnees = [
    ["Nom", "Âge", "Ville"],
    ["Alice", "25", "Paris"],
    ["Bob", "30", "Lyon"]
]

with open("export.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerows(donnees)

# Écriture avec dictionnaire
donnees = [
    {"nom": "Alice", "age": 25, "ville": "Paris"},
    {"nom": "Bob", "age": 30, "ville": "Lyon"}
]

with open("export.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["nom", "age", "ville"])
    writer.writeheader()
    writer.writerows(donnees)
```

## Fichiers JSON

### Lecture JSON

```python
import json

# Lecture simple
with open("donnees.json", "r", encoding="utf-8") as f:
    donnees = json.load(f)
    print(donnees)

# Lecture de chaîne JSON
json_string = '{"nom": "Alice", "age": 25}'
donnees = json.loads(json_string)
```

### Écriture JSON

```python
import json

donnees = {
    "nom": "Alice",
    "age": 25,
    "ville": "Paris",
    "hobbies": ["lecture", "sport"]
}

# Écriture simple
with open("donnees.json", "w", encoding="utf-8") as f:
    json.dump(donnees, f, indent=2, ensure_ascii=False)

# Écriture de chaîne JSON
json_string = json.dumps(donnees, indent=2, ensure_ascii=False)
print(json_string)
```

## Fichiers binaires

### Lecture/Écriture binaire

```python
# Copie de fichier binaire
with open("image.jpg", "rb") as source:
    with open("copie.jpg", "wb") as destination:
        destination.write(source.read())

# Lecture par chunks (pour gros fichiers)
def copier_fichier(source, destination, taille_chunk=8192):
    with open(source, "rb") as src:
        with open(destination, "wb") as dst:
            while True:
                chunk = src.read(taille_chunk)
                if not chunk:
                    break
                dst.write(chunk)

copier_fichier("gros_fichier.bin", "copie.bin")
```

## Manipulation de fichiers et dossiers

### Module os et pathlib

```python
import os
from pathlib import Path

# Vérifier l'existence
if os.path.exists("fichier.txt"):
    print("Le fichier existe")

# Avec pathlib (moderne)
fichier = Path("fichier.txt")
if fichier.exists():
    print("Le fichier existe")

# Obtenir le répertoire courant
repertoire_courant = os.getcwd()
print(repertoire_courant)

# Créer un dossier
os.makedirs("nouveau_dossier", exist_ok=True)

# Lister les fichiers
fichiers = os.listdir(".")
for f in fichiers:
    print(f)

# Avec pathlib
dossier = Path(".")
for fichier in dossier.iterdir():
    print(fichier.name)
```

### Informations sur les fichiers

```python
import os
from pathlib import Path

fichier = Path("fichier.txt")

# Taille
taille = fichier.stat().st_size
print(f"Taille : {taille} octets")

# Date de modification
import datetime
mtime = datetime.datetime.fromtimestamp(fichier.stat().st_mtime)
print(f"Modifié le : {mtime}")

# Extension
print(f"Extension : {fichier.suffix}")

# Nom sans extension
print(f"Nom : {fichier.stem}")
```

## Entrée/Sortie standard

### Input : Lire depuis le clavier

```python
# Lecture simple
nom = input("Entrez votre nom : ")
print(f"Bonjour, {nom} !")

# Lecture avec conversion
try:
    age = int(input("Entrez votre âge : "))
    print(f"Vous avez {age} ans")
except ValueError:
    print("Erreur : vous devez entrer un nombre")
```

### Print : Afficher à l'écran

```python
# Affichage simple
print("Hello, World!")

# Affichage multiple
print("Ligne 1", "Ligne 2", "Ligne 3")

# Formatage
nom = "Alice"
age = 25
print(f"Nom : {nom}, Âge : {age}")

# Paramètres
print("Message", end="")  # Pas de retour à la ligne
print("Suite", sep=" - ")  # Séparateur personnalisé

# Redirection vers fichier
with open("output.txt", "w") as f:
    print("Ceci va dans le fichier", file=f)
```

## Exemples pratiques

### Copie de fichier avec progression

```python
import os

def copier_avec_progression(source, destination):
    taille_source = os.path.getsize(source)
    taille_copied = 0
    
    with open(source, "rb") as src:
        with open(destination, "wb") as dst:
            while True:
                chunk = src.read(8192)
                if not chunk:
                    break
                dst.write(chunk)
                taille_copied += len(chunk)
                pourcentage = (taille_copied / taille_source) * 100
                print(f"Progression : {pourcentage:.1f}%", end="\r")
    print("\nCopie terminée !")

copier_avec_progression("source.txt", "destination.txt")
```

### Journalisation dans un fichier

```python
def logger(message, fichier_log="app.log"):
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(fichier_log, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {message}\n")

logger("Application démarrée")
logger("Utilisateur connecté : Alice")
logger("Erreur : connexion échouée")
```

### Parser un fichier de configuration

```python
def parser_config(nom_fichier):
    config = {}
    with open(nom_fichier, "r", encoding="utf-8") as f:
        for ligne in f:
            ligne = ligne.strip()
            if ligne and not ligne.startswith("#"):
                if "=" in ligne:
                    cle, valeur = ligne.split("=", 1)
                    config[cle.strip()] = valeur.strip()
    return config

# config.txt :
# host=localhost
# port=8080
# debug=True

config = parser_config("config.txt")
print(config)  # {'host': 'localhost', 'port': '8080', 'debug': 'True'}
```

### Gestionnaire de notes

```python
import json
from pathlib import Path

class GestionnaireNotes:
    def __init__(self, fichier="notes.json"):
        self.fichier = Path(fichier)
        self.notes = self.charger()
    
    def charger(self):
        if self.fichier.exists():
            with open(self.fichier, "r", encoding="utf-8") as f:
                return json.load(f)
        return []
    
    def sauvegarder(self):
        with open(self.fichier, "w", encoding="utf-8") as f:
            json.dump(self.notes, f, indent=2, ensure_ascii=False)
    
    def ajouter(self, titre, contenu):
        note = {"titre": titre, "contenu": contenu}
        self.notes.append(note)
        self.sauvegarder()
    
    def lister(self):
        for i, note in enumerate(self.notes, 1):
            print(f"{i}. {note['titre']}")

# Utilisation
notes = GestionnaireNotes()
notes.ajouter("Réunion", "Réunion importante demain")
notes.ajouter("Achats", "Lait, pain, œufs")
notes.lister()
```

## Bonnes pratiques

1. **Toujours utiliser `with`** : Fermeture automatique des fichiers
2. **Spécifier l'encodage** : `encoding="utf-8"` pour éviter les problèmes
3. **Gérer les erreurs** : Utiliser try/except pour FileNotFoundError, etc.
4. **Pour gros fichiers** : Lire par chunks plutôt que tout charger en mémoire
5. **Utiliser pathlib** : Plus moderne et portable que os.path
6. **Valider les chemins** : Vérifier l'existence avant de lire/écrire
7. **Sauvegarder régulièrement** : Pour éviter la perte de données

La manipulation de fichiers est essentielle pour créer des applications qui interagissent avec le système de fichiers. Maîtrisez ces concepts pour gérer efficacement les données persistantes !
