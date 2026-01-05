---
title: "Cron + Python"
order: 8.03.04
parent: "08-03-scripts-automation-cli.md"
tags: ["python", "cron", "scheduling", "automation"]
---

# Cron + Python

Combiner cron avec Python permet d'exécuter des scripts de manière planifiée pour l'automatisation de tâches récurrentes. C'est une solution simple et efficace pour la planification de tâches.

## Concepts de base

**Cron** est un planificateur de tâches sur les systèmes Unix/Linux qui exécute des commandes à des moments spécifiés. Python peut être utilisé comme commande dans les crontabs.

### Quand utiliser cron ?

- **Tâches récurrentes** : Sauvegardes quotidiennes, rapports hebdomadaires
- **Maintenance** : Nettoyage de fichiers, rotation de logs
- **Synchronisation** : Mise à jour de données, synchronisation
- **Monitoring** : Vérifications périodiques, alertes

## Configuration cron

### Format de crontab

```
* * * * * commande
│ │ │ │ │
│ │ │ │ └─── Jour de la semaine (0-7, 0 ou 7 = dimanche)
│ │ │ └───── Mois (1-12)
│ │ └─────── Jour du mois (1-31)
│ └───────── Heure (0-23)
└─────────── Minute (0-59)
```

### Exemples de syntaxe

```bash
# Toutes les minutes
* * * * * /usr/bin/python3 /path/to/script.py

# Toutes les heures (à la minute 0)
0 * * * * /usr/bin/python3 /path/to/script.py

# Tous les jours à minuit
0 0 * * * /usr/bin/python3 /path/to/script.py

# Tous les lundis à 9h00
0 9 * * 1 /usr/bin/python3 /path/to/script.py

# Le 1er de chaque mois à 6h00
0 6 1 * * /usr/bin/python3 /path/to/script.py

# Toutes les 5 minutes
*/5 * * * * /usr/bin/python3 /path/to/script.py

# Du lundi au vendredi à 17h00
0 17 * * 1-5 /usr/bin/python3 /path/to/script.py
```

### Éditer le crontab

```bash
# Éditer le crontab de l'utilisateur actuel
crontab -e

# Lister les tâches cron
crontab -l

# Supprimer toutes les tâches cron
crontab -r

# Éditer le crontab d'un autre utilisateur (root)
sudo crontab -u username -e
```

### Exemple de crontab complet

```bash
# Variables d'environnement
PATH=/usr/local/bin:/usr/bin:/bin
SHELL=/bin/bash
HOME=/home/user

# Rediriger la sortie vers un fichier de log
0 0 * * * /usr/bin/python3 /home/user/scripts/backup.py >> /home/user/logs/backup.log 2>&1

# Envoyer les erreurs par email
0 1 * * * /usr/bin/python3 /home/user/scripts/cleanup.py 2>&1 | mail -s "Cleanup errors" admin@example.com

# Tâche silencieuse (rediriger vers /dev/null)
*/15 * * * * /usr/bin/python3 /home/user/scripts/health_check.py > /dev/null 2>&1
```

## Exécution de scripts Python

### Script Python de base

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script de backup quotidien
Exécuté par cron tous les jours à minuit
"""

import sys
import logging
from pathlib import Path

# Configuration du logging
log_file = Path('/var/log/backup.log')
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def main():
    try:
        logger.info("Démarrage du backup")
        # Votre logique ici
        logger.info("Backup terminé avec succès")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Erreur lors du backup: {e}", exc_info=True)
        sys.exit(1)

if __name__ == '__main__':
    main()
```

### Script avec gestion d'erreurs robuste

```python
#!/usr/bin/env python3

import sys
import logging
import traceback
from datetime import datetime

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(f'/var/log/script_{datetime.now().strftime("%Y%m%d")}.log'),
            logging.StreamHandler()
        ]
    )

def main():
    setup_logging()
    logger = logging.getLogger(__name__)
    
    try:
        logger.info("Démarrage du script")
        
        # Votre logique
        result = perform_task()
        
        logger.info(f"Script terminé avec succès: {result}")
        return 0
        
    except KeyboardInterrupt:
        logger.warning("Script interrompu par l'utilisateur")
        return 130
    except Exception as e:
        logger.error(f"Erreur fatale: {e}")
        logger.error(traceback.format_exc())
        return 1
    finally:
        logger.info("Nettoyage terminé")

if __name__ == '__main__':
    sys.exit(main())
```

## Gestion des environnements virtuels

### Utiliser un environnement virtuel dans cron

```bash
# Méthode 1 : Activer l'environnement dans le script
0 0 * * * /home/user/venv/bin/python /home/user/scripts/backup.py

# Méthode 2 : Activer puis exécuter
0 0 * * * source /home/user/venv/bin/activate && python /home/user/scripts/backup.py

# Méthode 3 : Utiliser le shebang dans le script
#!/home/user/venv/bin/python
```

### Script avec gestion de l'environnement

```python
#!/usr/bin/env python3

import sys
import os
from pathlib import Path

# Ajouter le chemin de l'environnement virtuel
venv_path = Path(__file__).parent.parent / 'venv'
if venv_path.exists():
    site_packages = venv_path / 'lib' / 'python3.9' / 'site-packages'
    if site_packages.exists():
        sys.path.insert(0, str(site_packages))

# Maintenant vous pouvez importer vos packages
import requests  # Exemple
```

## Logging et erreurs

### Logging vers fichier

```python
import logging
from pathlib import Path
from datetime import datetime

# Créer le répertoire de logs
log_dir = Path('/var/log/myapp')
log_dir.mkdir(parents=True, exist_ok=True)

# Configuration
log_file = log_dir / f"script_{datetime.now().strftime('%Y%m%d')}.log"
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()  # Aussi sur stdout
    ]
)

logger = logging.getLogger(__name__)
logger.info("Script démarré")
```

### Rotation des logs

```python
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

log_file = Path('/var/log/script.log')
handler = RotatingFileHandler(
    log_file,
    maxBytes=10*1024*1024,  # 10 MB
    backupCount=5
)
handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))

logger = logging.getLogger()
logger.addHandler(handler)
logger.setLevel(logging.INFO)
```

### Envoyer des erreurs par email

```python
import smtplib
from email.mime.text import MIMEText
import logging

def send_error_email(error_message):
    """Envoie un email en cas d'erreur."""
    msg = MIMEText(error_message)
    msg['Subject'] = 'Erreur dans le script cron'
    msg['From'] = 'script@example.com'
    msg['To'] = 'admin@example.com'
    
    try:
        smtp = smtplib.SMTP('localhost')
        smtp.send_message(msg)
        smtp.quit()
    except Exception as e:
        logging.error(f"Impossible d'envoyer l'email: {e}")

# Utilisation
try:
    # Votre code
    pass
except Exception as e:
    error_msg = f"Erreur: {e}\n\n{traceback.format_exc()}"
    send_error_email(error_msg)
    raise
```

## Alternatives modernes

### APScheduler (Advanced Python Scheduler)

```bash
pip install apscheduler
```

```python
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

scheduler = BlockingScheduler()

def job():
    print("Tâche exécutée")

# Planifier une tâche
scheduler.add_job(
    job,
    trigger=CronTrigger(hour=0, minute=0),  # Tous les jours à minuit
    id='daily_job'
)

# Démarrer le scheduler
scheduler.start()
```

### Celery Beat (pour les applications distribuées)

```bash
pip install celery
```

```python
from celery import Celery
from celery.schedules import crontab

app = Celery('tasks', broker='redis://localhost:6379')

@app.task
def daily_backup():
    print("Backup quotidien")

# Configuration de la planification
app.conf.beat_schedule = {
    'daily-backup': {
        'task': 'tasks.daily_backup',
        'schedule': crontab(hour=0, minute=0),  # Tous les jours à minuit
    },
}

# Démarrer Celery Beat
# celery -A tasks beat
```

### Airflow (orchestration de workflows)

```bash
pip install apache-airflow
```

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

def my_task():
    print("Tâche exécutée")

default_args = {
    'owner': 'admin',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'daily_tasks',
    default_args=default_args,
    description='Tâches quotidiennes',
    schedule_interval='0 0 * * *',  # Tous les jours à minuit
    catchup=False
)

task = PythonOperator(
    task_id='my_task',
    python_callable=my_task,
    dag=dag
)
```

## Bonnes pratiques

### 1. Utilisez des chemins absolus

```bash
# ✅ Bon
0 0 * * * /usr/bin/python3 /home/user/scripts/backup.py

# ❌ Éviter
0 0 * * * python3 backup.py  # Chemin relatif
```

### 2. Redirigez la sortie

```bash
# ✅ Bon : Logs vers fichier
0 0 * * * /usr/bin/python3 /path/to/script.py >> /var/log/script.log 2>&1

# ✅ Bon : Erreurs par email
0 0 * * * /usr/bin/python3 /path/to/script.py 2>&1 | mail -s "Errors" admin@example.com
```

### 3. Utilisez des environnements virtuels

```bash
# ✅ Bon
0 0 * * * /home/user/venv/bin/python /home/user/scripts/script.py
```

### 4. Gestion des erreurs dans le script

```python
# ✅ Bon : Codes de retour appropriés
import sys

try:
    # Votre code
    sys.exit(0)  # Succès
except Exception as e:
    logging.error(e)
    sys.exit(1)  # Erreur
```

### 5. Testez vos scripts manuellement

```bash
# ✅ Tester avant d'ajouter à cron
/usr/bin/python3 /path/to/script.py
```

## Points clés à retenir

- ✅ **Cron** : Planificateur de tâches simple et efficace
- ✅ **Syntaxe** : `* * * * * commande` (minute heure jour mois jour-semaine)
- ✅ **Environnements virtuels** : Utilisez le chemin complet
- ✅ **Logging** : Redirigez la sortie vers des fichiers
- ✅ **Gestion d'erreurs** : Codes de retour et emails
- ✅ **Alternatives** : APScheduler, Celery, Airflow pour des besoins avancés
- ✅ Parfait pour **automatiser des tâches récurrentes**

Cron reste une solution simple et efficace pour la planification de tâches. Pour des besoins plus complexes, considérez des alternatives modernes comme APScheduler ou Celery.
