---
title: "DevOps avec Python"
order: 40
parent: null
tags: ["python", "devops", "deployment", "ci-cd", "docker"]
---

# DevOps avec Python

## Introduction

Le DevOps (Development + Operations) est une culture et un ensemble de pratiques qui visent à automatiser et intégrer les processus entre le développement logiciel et les équipes IT. Python, avec son écosystème riche et sa simplicité, est devenu un outil incontournable dans le monde DevOps.

### Qu'est-ce que le DevOps ?

DevOps représente un changement de mentalité qui favorise :

- **Collaboration** : Entre développeurs et opérationnels
- **Automatisation** : Des processus manuels répétitifs
- **Intégration continue** : Code intégré et testé fréquemment
- **Livraison continue** : Déploiements rapides et fiables
- **Monitoring** : Surveillance proactive de la production

### Le cycle DevOps

```
┌────────────────────────────────────────────────────────┐
│                    CYCLE DEVOPS                        │
│                                                        │
│     Plan → Code → Build → Test → Release              │
│       ↑                                    ↓           │
│       └─── Monitor ← Operate ← Deploy ────┘           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

| Phase | Activités | Outils Python |
|-------|-----------|---------------|
| **Plan** | Gestion de projet, tickets | Jira API, Trello API |
| **Code** | Développement, versioning | Git, pre-commit hooks |
| **Build** | Compilation, packaging | setuptools, poetry, pip |
| **Test** | Tests automatisés | pytest, unittest, tox |
| **Release** | Gestion des versions | bumpversion, twine |
| **Deploy** | Déploiement automatisé | Fabric, Ansible, Docker |
| **Operate** | Infrastructure as Code | Terraform, Pulumi |
| **Monitor** | Surveillance, alerting | Prometheus, Grafana |

## Pourquoi Python pour le DevOps ?

### Avantages de Python

| Avantage | Description |
|----------|-------------|
| **Lisibilité** | Code clair et maintenable |
| **Écosystème riche** | Bibliothèques pour tout besoin |
| **Multiplateforme** | Linux, Windows, macOS |
| **Automatisation** | Scripts simples et puissants |
| **APIs** | Intégration facile avec services cloud |
| **Communauté** | Grande communauté DevOps |

### Outils DevOps en Python

```python
# Exemples d'outils DevOps écrits en Python
devops_tools = {
    'Orchestration': ['Ansible', 'SaltStack', 'Fabric'],
    'Infrastructure': ['OpenStack', 'Pulumi (SDK Python)'],
    'CI/CD': ['Buildbot', 'Tox'],
    'Monitoring': ['Diamond', 'Shinken'],
    'Testing': ['pytest', 'Robot Framework'],
    'Cloud': ['Boto3 (AWS)', 'Azure SDK', 'Google Cloud SDK'],
    'Containers': ['docker-py', 'docker-compose'],
    'Configuration': ['PyYAML', 'ConfigParser', 'python-dotenv']
}
```

## Principes DevOps fondamentaux

### 1. Infrastructure as Code (IaC)

Gérer l'infrastructure comme du code source :

```python
# Exemple avec Pulumi
import pulumi
from pulumi_aws import s3

# Créer un bucket S3
bucket = s3.Bucket('my-bucket',
    acl='private',
    tags={
        'Environment': 'Production',
        'ManagedBy': 'Pulumi'
    }
)

pulumi.export('bucket_name', bucket.id)
```

**Avantages** :
- ✅ Versioning de l'infrastructure
- ✅ Reproductibilité
- ✅ Documentation automatique
- ✅ Revue de code pour l'infrastructure

### 2. Configuration Management

Gérer la configuration de manière centralisée et automatisée :

```python
# Exemple avec python-dotenv
from dotenv import load_dotenv
import os

load_dotenv()

config = {
    'database_url': os.getenv('DATABASE_URL'),
    'api_key': os.getenv('API_KEY'),
    'debug': os.getenv('DEBUG', 'False') == 'True'
}
```

### 3. Continuous Integration/Continuous Deployment (CI/CD)

Automatiser les tests et déploiements :

```yaml
# Exemple GitHub Actions (.github/workflows/ci.yml)
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      - name: Run tests
        run: pytest
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: |
          python deploy.py
```

### 4. Monitoring et Observability

Surveiller les applications en production :

```python
from prometheus_client import Counter, Histogram, start_http_server
import time

# Métriques
request_count = Counter('http_requests_total', 'Total HTTP Requests')
request_duration = Histogram('http_request_duration_seconds', 'HTTP Request Duration')

@request_duration.time()
def handle_request():
    request_count.inc()
    # Traiter la requête
    time.sleep(0.1)

# Exposer les métriques
start_http_server(8000)
```

## Architecture d'une application DevOps

### Structure type d'un projet

```
mon_projet/
│
├── .github/
│   └── workflows/
│       ├── ci.yml           # Pipeline CI
│       └── deploy.yml       # Pipeline déploiement
│
├── src/                     # Code source
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       └── config.py
│
├── tests/                   # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docker/                  # Configuration Docker
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .dockerignore
│
├── infrastructure/          # Infrastructure as Code
│   ├── terraform/
│   │   ├── main.tf
│   │   └── variables.tf
│   └── ansible/
│       └── playbook.yml
│
├── scripts/                 # Scripts d'automatisation
│   ├── deploy.py
│   ├── backup.py
│   └── healthcheck.py
│
├── monitoring/              # Configuration monitoring
│   ├── prometheus.yml
│   └── grafana/
│
├── .env.example            # Variables d'environnement
├── requirements.txt        # Dépendances Python
├── requirements-dev.txt    # Dépendances de dev
├── Dockerfile              # Image Docker
├── docker-compose.yml      # Orchestration locale
├── Makefile               # Commandes communes
└── README.md              # Documentation
```

### Makefile pour automatisation

```makefile
.PHONY: install test lint docker-build deploy clean

install:
	pip install -r requirements.txt
	pip install -r requirements-dev.txt

test:
	pytest tests/ -v --cov=src

lint:
	pylint src/
	black src/ --check
	mypy src/

format:
	black src/
	isort src/

docker-build:
	docker build -t myapp:latest .

docker-run:
	docker-compose up -d

docker-stop:
	docker-compose down

deploy-staging:
	python scripts/deploy.py --env staging

deploy-prod:
	python scripts/deploy.py --env production

backup:
	python scripts/backup.py

healthcheck:
	python scripts/healthcheck.py

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache .coverage htmlcov/
```

## Outils Python essentiels pour DevOps

### 1. Gestion de dépendances

```bash
# pip - Gestionnaire de paquets standard
pip install requests
pip freeze > requirements.txt

# pipenv - Environnements virtuels + dépendances
pipenv install requests
pipenv lock

# poetry - Gestionnaire moderne
poetry add requests
poetry lock
poetry export -f requirements.txt --output requirements.txt
```

### 2. Automatisation de tâches

```python
# Fabric - Déploiement et exécution à distance
from fabric import Connection, task

@task
def deploy(c):
    """Déployer l'application"""
    with Connection('server.example.com') as conn:
        conn.run('cd /app && git pull')
        conn.run('systemctl restart myapp')

# Invoke - Exécution de tâches
from invoke import task

@task
def test(c):
    """Lancer les tests"""
    c.run("pytest tests/")

@task
def deploy(c, env='staging'):
    """Déployer sur un environnement"""
    c.run(f"ansible-playbook -i inventory/{env} deploy.yml")
```

### 3. Tests et qualité

```python
# pytest - Framework de tests
import pytest

def test_api_endpoint():
    response = requests.get('http://api.example.com/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'healthy'

# pytest-cov - Couverture de code
# pytest tests/ --cov=src --cov-report=html

# tox - Tests multi-environnements
# tox.ini
[tox]
envlist = py38,py39,py310

[testenv]
deps = pytest
commands = pytest tests/
```

### 4. Linting et formatage

```python
# .pylintrc
[MASTER]
max-line-length=100

# black - Formatage automatique
# black src/

# isort - Tri des imports
# isort src/

# mypy - Vérification des types
# mypy src/

# flake8 - Linting
# flake8 src/
```

## Scripts d'automatisation courants

### Script de déploiement

```python
"""
Script de déploiement automatisé
"""
import argparse
import subprocess
import sys
from pathlib import Path

def run_command(cmd, check=True):
    """Exécuter une commande shell"""
    print(f"→ {cmd}")
    result = subprocess.run(
        cmd, 
        shell=True, 
        capture_output=True, 
        text=True
    )
    
    if result.returncode != 0 and check:
        print(f"✗ Erreur: {result.stderr}")
        sys.exit(1)
    
    return result

def deploy(env='staging', skip_tests=False):
    """Déployer l'application"""
    
    print(f"🚀 Déploiement sur {env}")
    
    # 1. Tests
    if not skip_tests:
        print("\n1️⃣ Exécution des tests...")
        run_command("pytest tests/ -v")
        print("✓ Tests OK")
    
    # 2. Build Docker
    print("\n2️⃣ Construction de l'image Docker...")
    run_command(f"docker build -t myapp:{env} .")
    print("✓ Image construite")
    
    # 3. Push vers registry
    print("\n3️⃣ Push vers le registry...")
    run_command(f"docker push myapp:{env}")
    print("✓ Image poussée")
    
    # 4. Déploiement Kubernetes
    print("\n4️⃣ Déploiement sur Kubernetes...")
    run_command(f"kubectl apply -f k8s/{env}/")
    run_command(f"kubectl rollout status deployment/myapp -n {env}")
    print("✓ Déploiement effectué")
    
    # 5. Healthcheck
    print("\n5️⃣ Vérification de la santé...")
    import time
    time.sleep(5)
    result = run_command("python scripts/healthcheck.py", check=False)
    
    if result.returncode == 0:
        print("✓ Application en bonne santé")
        print(f"\n✅ Déploiement sur {env} réussi!")
    else:
        print("✗ Healthcheck échoué!")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Déploiement automatisé')
    parser.add_argument('--env', choices=['staging', 'production'], 
                       default='staging', help='Environnement cible')
    parser.add_argument('--skip-tests', action='store_true',
                       help='Ignorer les tests')
    
    args = parser.parse_args()
    deploy(args.env, args.skip_tests)
```

### Script de backup

```python
"""
Script de sauvegarde automatisée
"""
import os
from datetime import datetime
import boto3
import subprocess

def backup_database():
    """Sauvegarder la base de données"""
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = f"backup_{timestamp}.sql"
    
    # Dump PostgreSQL
    db_url = os.getenv('DATABASE_URL')
    subprocess.run(
        f"pg_dump {db_url} > {backup_file}",
        shell=True,
        check=True
    )
    
    # Compresser
    subprocess.run(f"gzip {backup_file}", shell=True, check=True)
    backup_file += ".gz"
    
    # Upload vers S3
    s3 = boto3.client('s3')
    bucket = os.getenv('BACKUP_BUCKET')
    
    s3.upload_file(
        backup_file,
        bucket,
        f"database/{backup_file}"
    )
    
    # Nettoyer
    os.remove(backup_file)
    
    print(f"✓ Backup créé: {backup_file}")

if __name__ == "__main__":
    backup_database()
```

### Script de healthcheck

```python
"""
Script de vérification de santé
"""
import requests
import sys
import time

def check_health(url, max_retries=3, timeout=10):
    """Vérifier la santé d'un service"""
    
    for attempt in range(max_retries):
        try:
            response = requests.get(
                f"{url}/health",
                timeout=timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                
                print(f"✓ Service {url} : Healthy")
                print(f"  Version: {data.get('version')}")
                print(f"  Uptime: {data.get('uptime')}s")
                
                return True
            
        except requests.exceptions.RequestException as e:
            print(f"✗ Tentative {attempt + 1}/{max_retries}: {e}")
            if attempt < max_retries - 1:
                time.sleep(2)
    
    return False

def main():
    services = [
        'http://api.example.com',
        'http://web.example.com',
        'http://worker.example.com'
    ]
    
    all_healthy = True
    
    for service in services:
        if not check_health(service):
            all_healthy = False
    
    if not all_healthy:
        sys.exit(1)
    
    print("\n✅ Tous les services sont en bonne santé")

if __name__ == "__main__":
    main()
```

## Bonnes pratiques DevOps avec Python

### ✅ À faire

1. **Versioning sémantique** : Utiliser semver (1.2.3)
2. **Tests automatisés** : Couverture > 80%
3. **Documentation** : README, docstrings, API docs
4. **Sécurité** : Scanner les dépendances (safety, bandit)
5. **Logs structurés** : JSON logs pour parsing facile
6. **Configuration externalisée** : Variables d'environnement
7. **Immutabilité** : Images Docker non modifiables
8. **Blue/Green deployment** : Zéro downtime
9. **Rollback automatique** : En cas d'échec
10. **Monitoring proactif** : Alertes avant problèmes

### ❌ À éviter

1. **Secrets dans le code** : Utiliser des gestionnaires de secrets
2. **Déploiements manuels** : Toujours automatiser
3. **Tests ignorés** : Ne jamais skip les tests
4. **Dépendances figées** : Mettre à jour régulièrement
5. **Logs insuffisants** : Logger suffisamment d'infos
6. **Pas de rollback** : Toujours avoir un plan B
7. **Environnements différents** : Dev doit ressembler à Prod
8. **Déploiements le vendredi** : Laisser du temps pour corriger

## Contenu de cette section

Cette section de formation couvre les aspects DevOps essentiels :

### 📖 Modules théoriques

1. **[Docker et Conteneurisation](40-01-docker.md)**
   - Concepts de conteneurisation
   - Dockerfile pour applications Python
   - docker-compose pour orchestration
   - Bonnes pratiques et optimisation

2. **[CI/CD avec GitHub Actions et GitLab CI](40-02-ci-cd.md)**
   - Pipelines d'intégration continue
   - Tests automatisés
   - Déploiement automatisé
   - Gestion des environnements

3. **[Déploiement Cloud](40-03-deploiement-cloud.md)**
   - AWS (EC2, Lambda, ECS)
   - Azure (App Service, Functions)
   - GCP (Cloud Run, App Engine)
   - Infrastructure as Code

4. **[Monitoring et Logs](40-04-monitoring-et-logs.md)**
   - Logging structuré
   - Métriques avec Prometheus
   - Dashboards avec Grafana
   - Alerting et on-call

## Parcours recommandé

### Niveau 1 : Fondations (1 semaine)
- Comprendre les concepts DevOps
- Créer des Dockerfiles
- Écrire des scripts d'automatisation
- Mettre en place un pipeline CI basique

### Niveau 2 : Intermédiaire (2 semaines)
- Docker Compose et orchestration
- CI/CD complet (tests + déploiement)
- Déploiement sur un cloud provider
- Monitoring basique

### Niveau 3 : Avancé (2-3 semaines)
- Kubernetes et orchestration avancée
- Infrastructure as Code (Terraform/Pulumi)
- Observability complète (logs, métriques, traces)
- Pratiques avancées (GitOps, service mesh)

## Ressources complémentaires

### Livres
- **"The Phoenix Project"** - Gene Kim (culture DevOps)
- **"Site Reliability Engineering"** - Google (SRE)
- **"Python for DevOps"** - Noah Gift

### Cours en ligne
- **DevOps Bootcamp** - Udemy
- **AWS Certified DevOps Engineer** - A Cloud Guru
- **Kubernetes for Developers** - Linux Foundation

### Outils à maîtriser
- **Git** : Versioning
- **Docker** : Conteneurisation
- **Kubernetes** : Orchestration
- **Terraform** : Infrastructure as Code
- **Ansible** : Configuration management
- **Jenkins/GitLab CI/GitHub Actions** : CI/CD

## Conclusion

Le DevOps avec Python offre des outils puissants pour automatiser et optimiser le cycle de vie des applications. En maîtrisant ces concepts et pratiques, vous serez capable de :

- 🚀 Déployer rapidement et en toute confiance
- 🔄 Automatiser les processus répétitifs
- 📊 Surveiller et améliorer la santé des applications
- 🔐 Sécuriser les déploiements et l'infrastructure
- 🤝 Collaborer efficacement entre équipesLe DevOps n'est pas qu'un ensemble d'outils, c'est avant tout une culture d'amélioration continue !
