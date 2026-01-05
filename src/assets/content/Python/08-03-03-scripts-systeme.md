---
title: "Scripts système"
order: 8.03.03
parent: "08-03-scripts-automation-cli.md"
tags: ["python", "scripts", "systeme", "automation"]
---

# Scripts système

Python est idéal pour créer des scripts d'automatisation système, de la gestion de fichiers à l'administration serveur. La bibliothèque standard offre de nombreux modules pour interagir avec le système.

## Concepts de base

Les **scripts système** en Python permettent d'automatiser des tâches répétitives, de gérer des fichiers, d'exécuter des commandes, et d'interagir avec le système d'exploitation.

### Modules utiles de la bibliothèque standard

- `os` : Interface avec le système d'exploitation
- `shutil` : Opérations sur les fichiers et répertoires
- `subprocess` : Exécution de commandes système
- `pathlib` : Manipulation de chemins (moderne)
- `glob` : Recherche de fichiers par pattern
- `tempfile` : Fichiers temporaires

## Manipulation de fichiers

### Utiliser pathlib (moderne)

```python
from pathlib import Path

# Créer un chemin
file_path = Path('data/file.txt')
dir_path = Path('data/')

# Vérifier l'existence
if file_path.exists():
    print(f"Le fichier existe: {file_path}")

# Lire un fichier
content = file_path.read_text(encoding='utf-8')

# Écrire dans un fichier
file_path.write_text('Contenu', encoding='utf-8')

# Créer un répertoire
dir_path.mkdir(parents=True, exist_ok=True)

# Lister les fichiers
for file in dir_path.glob('*.txt'):
    print(file)
```

### Utiliser os (traditionnel)

```python
import os

# Vérifier l'existence
if os.path.exists('file.txt'):
    print('Fichier existe')

# Créer un répertoire
os.makedirs('data/subdir', exist_ok=True)

# Lister les fichiers
files = os.listdir('data/')

# Chemin absolu
abs_path = os.path.abspath('file.txt')

# Joindre des chemins
full_path = os.path.join('data', 'subdir', 'file.txt')
```

### Copier, déplacer, supprimer

```python
import shutil
from pathlib import Path

# Copier un fichier
shutil.copy('source.txt', 'destination.txt')

# Copier un répertoire
shutil.copytree('source_dir', 'dest_dir')

# Déplacer
shutil.move('old_location.txt', 'new_location.txt')

# Supprimer
Path('file.txt').unlink()  # Fichier
shutil.rmtree('directory')  # Répertoire
```

### Recherche de fichiers

```python
from pathlib import Path
import glob

# Avec pathlib
for file in Path('.').glob('*.py'):
    print(file)

# Recherche récursive
for file in Path('.').rglob('*.py'):
    print(file)

# Avec glob
python_files = glob.glob('**/*.py', recursive=True)
```

## Exécution de commandes système

### subprocess.run (recommandé)

```python
import subprocess

# Exécuter une commande simple
result = subprocess.run(['ls', '-l'], capture_output=True, text=True)
print(result.stdout)
print(result.returncode)

# Avec gestion d'erreurs
try:
    result = subprocess.run(
        ['git', 'status'],
        check=True,
        capture_output=True,
        text=True
    )
    print(result.stdout)
except subprocess.CalledProcessError as e:
    print(f"Erreur: {e}")

# Avec timeout
result = subprocess.run(
    ['long-running-command'],
    timeout=30,
    capture_output=True
)
```

### subprocess.Popen (avancé)

```python
import subprocess

# Exécuter en arrière-plan
process = subprocess.Popen(
    ['python', 'script.py'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

# Attendre la fin
stdout, stderr = process.communicate()

# Vérifier le statut
if process.returncode == 0:
    print("Succès")
else:
    print(f"Erreur: {stderr.decode()}")
```

### os.system (simple mais limité)

```python
import os

# Exécuter une commande (retourne le code de retour)
return_code = os.system('ls -l')

# ⚠️ Moins flexible que subprocess
```

## Gestion de processus

### Informations sur les processus

```python
import os
import psutil  # Nécessite: pip install psutil

# PID du processus actuel
current_pid = os.getpid()
print(f"PID: {current_pid}")

# Informations détaillées avec psutil
process = psutil.Process(current_pid)
print(f"Nom: {process.name()}")
print(f"CPU: {process.cpu_percent()}%")
print(f"Mémoire: {process.memory_info().rss / 1024 / 1024} MB")
```

### Lister les processus

```python
import psutil

# Tous les processus
for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
    try:
        info = proc.info
        print(f"PID: {info['pid']}, Nom: {info['name']}")
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        pass
```

### Tuer un processus

```python
import psutil
import signal

# Trouver un processus par nom
for proc in psutil.process_iter(['pid', 'name']):
    if proc.info['name'] == 'python':
        proc.terminate()  # Envoie SIGTERM
        # ou
        proc.kill()  # Force l'arrêt (SIGKILL)
```

## Cas d'usage courants

### Cas d'usage 1 : Nettoyage de fichiers temporaires

```python
from pathlib import Path
import time

def clean_temp_files(directory, max_age_days=7):
    """Supprime les fichiers plus anciens que max_age_days."""
    directory = Path(directory)
    if not directory.exists():
        return
    
    current_time = time.time()
    max_age_seconds = max_age_days * 24 * 60 * 60
    
    deleted_count = 0
    for file in directory.iterdir():
        if file.is_file():
            file_age = current_time - file.stat().st_mtime
            if file_age > max_age_seconds:
                file.unlink()
                deleted_count += 1
                print(f"Supprimé: {file}")
    
    print(f"Total supprimé: {deleted_count}")

# Utilisation
clean_temp_files('/tmp', max_age_days=7)
```

### Cas d'usage 2 : Backup automatique

```python
from pathlib import Path
import shutil
from datetime import datetime

def backup_directory(source, destination):
    """Crée une sauvegarde d'un répertoire."""
    source = Path(source)
    destination = Path(destination)
    
    if not source.exists():
        raise ValueError(f"Source n'existe pas: {source}")
    
    # Créer le répertoire de destination
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = destination / f"backup_{timestamp}"
    backup_path.mkdir(parents=True, exist_ok=True)
    
    # Copier
    shutil.copytree(source, backup_path / source.name)
    
    print(f"Sauvegarde créée: {backup_path}")
    return backup_path

# Utilisation
backup_directory('/data/important', '/backups')
```

### Cas d'usage 3 : Monitoring de l'espace disque

```python
import shutil
from pathlib import Path

def check_disk_space(path='/'):
    """Vérifie l'espace disque disponible."""
    path = Path(path)
    stat = shutil.disk_usage(path)
    
    total_gb = stat.total / (1024**3)
    used_gb = stat.used / (1024**3)
    free_gb = stat.free / (1024**3)
    percent_used = (stat.used / stat.total) * 100
    
    print(f"Espace disque pour {path}:")
    print(f"  Total: {total_gb:.2f} GB")
    print(f"  Utilisé: {used_gb:.2f} GB ({percent_used:.1f}%)")
    print(f"  Libre: {free_gb:.2f} GB")
    
    if percent_used > 90:
        print("⚠️  ATTENTION: Espace disque critique!")
    
    return {
        'total': total_gb,
        'used': used_gb,
        'free': free_gb,
        'percent_used': percent_used
    }

# Utilisation
check_disk_space('/')
```

### Cas d'usage 4 : Exécution de commandes avec logging

```python
import subprocess
import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('script.log'),
        logging.StreamHandler()
    ]
)

def run_command(command, description=""):
    """Exécute une commande avec logging."""
    logging.info(f"Démarrage: {description or ' '.join(command)}")
    
    try:
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            timeout=300
        )
        logging.info(f"Succès: {description or ' '.join(command)}")
        if result.stdout:
            logging.debug(f"Sortie: {result.stdout}")
        return result
    except subprocess.TimeoutExpired:
        logging.error(f"Timeout: {description or ' '.join(command)}")
        raise
    except subprocess.CalledProcessError as e:
        logging.error(f"Erreur: {e.stderr}")
        raise

# Utilisation
run_command(['git', 'pull'], 'Mise à jour du dépôt')
run_command(['python', 'migrate.py'], 'Migration de la base de données')
```

## Bonnes pratiques

### 1. Utilisez pathlib pour les chemins

```python
# ✅ Bon : pathlib (moderne)
from pathlib import Path
file_path = Path('data/file.txt')

# ❌ Éviter : os.path (ancien)
import os
file_path = os.path.join('data', 'file.txt')
```

### 2. Gérez les erreurs

```python
# ✅ Bon
from pathlib import Path

try:
    content = Path('file.txt').read_text()
except FileNotFoundError:
    print("Fichier introuvable")
except PermissionError:
    print("Permission refusée")
```

### 3. Utilisez subprocess.run au lieu de os.system

```python
# ✅ Bon
result = subprocess.run(['command'], capture_output=True, text=True)

# ❌ Éviter
os.system('command')  # Moins flexible
```

### 4. Vérifiez les permissions

```python
from pathlib import Path

file_path = Path('file.txt')
if file_path.exists() and file_path.is_file():
    if os.access(file_path, os.R_OK):
        content = file_path.read_text()
```

### 5. Utilisez des context managers

```python
# ✅ Bon : Gestion automatique des ressources
with open('file.txt', 'r') as f:
    content = f.read()

# Ou avec pathlib
content = Path('file.txt').read_text()
```

## Points clés à retenir

- ✅ **pathlib** : Module moderne pour les chemins
- ✅ **subprocess** : Exécution de commandes système
- ✅ **shutil** : Opérations sur fichiers/répertoires
- ✅ **Gestion d'erreurs** : Toujours gérer les exceptions
- ✅ **Logging** : Enregistrer les opérations importantes
- ✅ **Permissions** : Vérifier les droits d'accès
- ✅ Parfait pour **automatiser les tâches système**

Python excelle dans l'automatisation système grâce à sa bibliothèque standard riche et à sa syntaxe claire. Utilisez les modules appropriés selon vos besoins.
