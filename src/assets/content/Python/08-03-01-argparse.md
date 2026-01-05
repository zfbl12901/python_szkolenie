---
title: "argparse"
order: 8.03.01
parent: "08-03-scripts-automation-cli.md"
tags: ["python", "argparse", "cli", "arguments"]
---

# argparse

Le module `argparse` permet de créer facilement des interfaces en ligne de commande avec parsing et validation des arguments. C'est le module standard de Python pour créer des CLIs.

## Concepts de base

**argparse** est un module de la bibliothèque standard Python qui simplifie la création d'interfaces en ligne de commande. Il remplace les anciens modules `optparse` et `getopt`.

### Avantages d'argparse

- **Standard** : Inclus dans Python (pas de dépendance)
- **Automatique** : Génération automatique de l'aide
- **Validation** : Validation des types et valeurs
- **Flexible** : Support des arguments positionnels et optionnels
- **Sous-commandes** : Support des commandes complexes

## Création d'un parser

### Parser de base

```python
import argparse

parser = argparse.ArgumentParser(description='Description du script')
args = parser.parse_args()

# Utilisation
# python script.py
```

### Personnaliser le parser

```python
import argparse

parser = argparse.ArgumentParser(
    prog='mon-script',
    description='Un script utile',
    epilog='Merci d\'utiliser mon-script!',
    formatter_class=argparse.RawDescriptionHelpFormatter
)
args = parser.parse_args()
```

## Arguments positionnels et optionnels

### Arguments positionnels

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('name', help='Nom de l\'utilisateur')
parser.add_argument('age', type=int, help='Âge de l\'utilisateur')

args = parser.parse_args()
print(f"Nom: {args.name}, Âge: {args.age}")

# Utilisation
# python script.py Alice 30
```

### Arguments optionnels

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--name', help='Nom de l\'utilisateur')
parser.add_argument('--age', type=int, help='Âge de l\'utilisateur')

args = parser.parse_args()
if args.name:
    print(f"Nom: {args.name}, Âge: {args.age}")

# Utilisation
# python script.py --name Alice --age 30
```

### Raccourcis (short flags)

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-n', '--name', help='Nom de l\'utilisateur')
parser.add_argument('-a', '--age', type=int, help='Âge de l\'utilisateur')

args = parser.parse_args()

# Utilisation
# python script.py -n Alice -a 30
# ou
# python script.py --name Alice --age 30
```

### Valeurs par défaut

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--name', default='Anonyme', help='Nom de l\'utilisateur')
parser.add_argument('--age', type=int, default=0, help='Âge de l\'utilisateur')

args = parser.parse_args()
print(f"Nom: {args.name}, Âge: {args.age}")

# Utilisation
# python script.py  # Utilise les valeurs par défaut
# python script.py --name Alice  # Utilise Alice et 0 pour l'âge
```

### Arguments requis

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--name', required=True, help='Nom de l\'utilisateur')
parser.add_argument('--age', type=int, required=True, help='Âge de l\'utilisateur')

args = parser.parse_args()

# Utilisation
# python script.py --name Alice --age 30  # ✅ Requis
# python script.py --name Alice  # ❌ Erreur : --age requis
```

## Types et validation

### Types de base

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--count', type=int, help='Nombre d\'éléments')
parser.add_argument('--price', type=float, help='Prix')
parser.add_argument('--active', type=bool, help='Actif ou non')

args = parser.parse_args()

# Utilisation
# python script.py --count 10 --price 99.99 --active True
```

### Validation personnalisée

```python
import argparse

def positive_int(value):
    ivalue = int(value)
    if ivalue <= 0:
        raise argparse.ArgumentTypeError(f"{value} n'est pas un entier positif")
    return ivalue

parser = argparse.ArgumentParser()
parser.add_argument('--count', type=positive_int, help='Nombre positif')

args = parser.parse_args()

# Utilisation
# python script.py --count 10  # ✅ OK
# python script.py --count -5  # ❌ Erreur
```

### Choix limités

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument(
    '--format',
    choices=['json', 'xml', 'csv'],
    default='json',
    help='Format de sortie'
)

args = parser.parse_args()

# Utilisation
# python script.py --format json  # ✅ OK
# python script.py --format yaml  # ❌ Erreur : choix invalide
```

## Arguments multiples

### Action 'store'

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--file', action='store', help='Fichier à traiter')

args = parser.parse_args()

# Utilisation
# python script.py --file data.txt
```

### Action 'store_true' / 'store_false'

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--verbose', action='store_true', help='Mode verbeux')
parser.add_argument('--quiet', action='store_false', dest='verbose', help='Mode silencieux')

args = parser.parse_args()
if args.verbose:
    print("Mode verbeux activé")

# Utilisation
# python script.py --verbose  # args.verbose = True
# python script.py  # args.verbose = False
```

### Action 'append'

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--tag', action='append', help='Ajouter un tag')

args = parser.parse_args()
print(args.tag)  # Liste de tags

# Utilisation
# python script.py --tag python --tag cli --tag argparse
# args.tag = ['python', 'cli', 'argparse']
```

### Action 'count'

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-v', '--verbose', action='count', default=0, help='Niveau de verbosité')

args = parser.parse_args()
print(f"Verbosité: {args.verbose}")

# Utilisation
# python script.py -v      # args.verbose = 1
# python script.py -vv     # args.verbose = 2
# python script.py -vvv    # args.verbose = 3
```

## Sous-commandes

### Créer des sous-commandes

```python
import argparse

parser = argparse.ArgumentParser(description='Gestionnaire de fichiers')
subparsers = parser.add_subparsers(dest='command', help='Commandes disponibles')

# Sous-commande 'create'
parser_create = subparsers.add_parser('create', help='Créer un fichier')
parser_create.add_argument('filename', help='Nom du fichier')
parser_create.add_argument('--content', default='', help='Contenu du fichier')

# Sous-commande 'delete'
parser_delete = subparsers.add_parser('delete', help='Supprimer un fichier')
parser_delete.add_argument('filename', help='Nom du fichier')
parser_delete.add_argument('--force', action='store_true', help='Forcer la suppression')

# Sous-commande 'list'
parser_list = subparsers.add_parser('list', help='Lister les fichiers')
parser_list.add_argument('--pattern', help='Filtre par pattern')

args = parser.parse_args()

if args.command == 'create':
    print(f"Création de {args.filename}")
elif args.command == 'delete':
    print(f"Suppression de {args.filename}")
elif args.command == 'list':
    print("Liste des fichiers")

# Utilisation
# python script.py create file.txt --content "Hello"
# python script.py delete file.txt --force
# python script.py list --pattern "*.txt"
```

## Exemples pratiques

### Exemple 1 : Script de traitement de fichiers

```python
import argparse
import os

def main():
    parser = argparse.ArgumentParser(
        description='Traite des fichiers texte',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument(
        'input_file',
        help='Fichier d\'entrée à traiter'
    )
    
    parser.add_argument(
        '-o', '--output',
        help='Fichier de sortie (par défaut: stdout)'
    )
    
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Mode verbeux'
    )
    
    parser.add_argument(
        '--encoding',
        default='utf-8',
        help='Encodage du fichier (défaut: utf-8)'
    )
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input_file):
        parser.error(f"Le fichier {args.input_file} n'existe pas")
    
    if args.verbose:
        print(f"Traitement de {args.input_file}")
    
    # Traitement...
    with open(args.input_file, 'r', encoding=args.encoding) as f:
        content = f.read()
    
    if args.output:
        with open(args.output, 'w', encoding=args.encoding) as f:
            f.write(content.upper())
    else:
        print(content.upper())

if __name__ == '__main__':
    main()
```

### Exemple 2 : Script avec sous-commandes

```python
import argparse

def create_user(args):
    print(f"Création de l'utilisateur {args.username}")
    print(f"Email: {args.email}")
    if args.admin:
        print("Avec droits administrateur")

def delete_user(args):
    print(f"Suppression de l'utilisateur {args.username}")
    if args.force:
        print("Forcé")

def list_users(args):
    print("Liste des utilisateurs")
    if args.active:
        print("Seulement les utilisateurs actifs")

def main():
    parser = argparse.ArgumentParser(description='Gestion des utilisateurs')
    subparsers = parser.add_subparsers(dest='command', required=True)
    
    # Commande create
    parser_create = subparsers.add_parser('create', help='Créer un utilisateur')
    parser_create.add_argument('username', help='Nom d\'utilisateur')
    parser_create.add_argument('email', help='Email')
    parser_create.add_argument('--admin', action='store_true', help='Droits admin')
    parser_create.set_defaults(func=create_user)
    
    # Commande delete
    parser_delete = subparsers.add_parser('delete', help='Supprimer un utilisateur')
    parser_delete.add_argument('username', help='Nom d\'utilisateur')
    parser_delete.add_argument('--force', action='store_true', help='Forcer')
    parser_delete.set_defaults(func=delete_user)
    
    # Commande list
    parser_list = subparsers.add_parser('list', help='Lister les utilisateurs')
    parser_list.add_argument('--active', action='store_true', help='Seulement actifs')
    parser_list.set_defaults(func=list_users)
    
    args = parser.parse_args()
    args.func(args)

if __name__ == '__main__':
    main()
```

### Exemple 3 : Script avec groupes d'arguments

```python
import argparse

def main():
    parser = argparse.ArgumentParser(description='Script avec groupes d\'arguments')
    
    # Groupe d'arguments requis
    required = parser.add_argument_group('arguments requis')
    required.add_argument('--input', required=True, help='Fichier d\'entrée')
    
    # Groupe d'arguments optionnels
    optional = parser.add_argument_group('arguments optionnels')
    optional.add_argument('--output', help='Fichier de sortie')
    optional.add_argument('--verbose', action='store_true', help='Mode verbeux')
    
    # Groupe d'arguments avancés
    advanced = parser.add_argument_group('options avancées')
    advanced.add_argument('--threads', type=int, default=1, help='Nombre de threads')
    advanced.add_argument('--buffer-size', type=int, default=1024, help='Taille du buffer')
    
    args = parser.parse_args()
    
    print(f"Input: {args.input}")
    if args.output:
        print(f"Output: {args.output}")

if __name__ == '__main__':
    main()
```

## Bonnes pratiques

### 1. Toujours fournir une description

```python
# ✅ Bon
parser = argparse.ArgumentParser(description='Description claire du script')
parser.add_argument('file', help='Fichier à traiter')

# ❌ Éviter
parser = argparse.ArgumentParser()
parser.add_argument('file')
```

### 2. Utiliser des noms explicites

```python
# ✅ Bon
parser.add_argument('--output-file', help='Fichier de sortie')

# ❌ Éviter
parser.add_argument('-o', help='Output')
```

### 3. Valider les entrées

```python
# ✅ Bon
parser.add_argument('--port', type=int, choices=range(1, 65536), help='Port')

# ❌ Éviter
parser.add_argument('--port', type=int, help='Port')  # Pas de validation
```

### 4. Fournir des valeurs par défaut sensées

```python
# ✅ Bon
parser.add_argument('--timeout', type=int, default=30, help='Timeout en secondes')

# ❌ Éviter
parser.add_argument('--timeout', type=int, help='Timeout')  # Pas de défaut
```

## Points clés à retenir

- ✅ `argparse` est **inclus dans Python** (pas de dépendance)
- ✅ **Génération automatique** de l'aide
- ✅ **Validation** des types et valeurs
- ✅ Support des **arguments positionnels et optionnels**
- ✅ Support des **sous-commandes**
- ✅ **Flexible** et personnalisable
- ✅ Parfait pour créer des **CLIs simples à complexes**

argparse est le module standard pour créer des interfaces en ligne de commande en Python. Il offre un bon équilibre entre simplicité et fonctionnalités pour la plupart des cas d'usage.
