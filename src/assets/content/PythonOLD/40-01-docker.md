---
title: "Docker et Conteneurisation"
order: 1
parent: "40-devops-python.md"
tags: ["python", "devops", "docker", "containers"]
---

# Docker et Conteneurisation

## Introduction

Docker est une plateforme de conteneurisation qui permet d'empaqueter une application et ses dépendances dans un conteneur isolé et portable. Pour les applications Python, Docker résout le fameux problème "ça marche sur ma machine" en garantissant un environnement d'exécution cohérent.

### Qu'est-ce qu'un conteneur ?

Un conteneur est une unité standardisée de logiciel qui emballe le code et toutes ses dépendances.

```
┌─────────────────────────────────────────────┐
│           Machine Hôte                      │
│  ┌──────────────────────────────────────┐   │
│  │      Système d'exploitation          │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │      Docker Engine                   │   │
│  └──────────────────────────────────────┘   │
│  ┌────────┐  ┌────────┐  ┌────────┐        │
│  │Container│  │Container│  │Container│        │
│  │        │  │        │  │        │        │
│  │ App A  │  │ App B  │  │ App C  │        │
│  │ Python │  │ Node.js│  │ Java   │        │
│  │ Deps   │  │ Deps   │  │ Deps   │        │
│  └────────┘  └────────┘  └────────┘        │
└─────────────────────────────────────────────┘
```

### Conteneurs vs Machines virtuelles

| Aspect | Conteneurs | VMs |
|--------|------------|-----|
| **Taille** | Légers (Mo) | Lourdes (Go) |
| **Démarrage** | Secondes | Minutes |
| **Performance** | Native | Overhead |
| **Isolation** | Processus | Système complet |
| **Partage** | Kernel partagé | OS séparé |

## Installation de Docker

### Windows et macOS

```bash
# Télécharger Docker Desktop
# https://www.docker.com/products/docker-desktop

# Vérifier l'installation
docker --version
docker-compose --version
```

### Linux (Ubuntu/Debian)

```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

# Vérifier
docker --version
```

## Dockerfile pour Python

### Dockerfile basique

```dockerfile
# Utiliser une image Python officielle
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application
COPY . .

# Exposer le port
EXPOSE 8000

# Commande de démarrage
CMD ["python", "main.py"]
```

### Construction et exécution

```bash
# Construire l'image
docker build -t mon-app-python:latest .

# Lancer le conteneur
docker run -p 8000:8000 mon-app-python:latest

# Lancer en arrière-plan
docker run -d -p 8000:8000 --name mon-app mon-app-python:latest

# Voir les logs
docker logs mon-app

# Arrêter le conteneur
docker stop mon-app

# Supprimer le conteneur
docker rm mon-app
```

## Optimisation du Dockerfile

### Multi-stage build

Réduire la taille de l'image finale :

```dockerfile
# Stage 1: Build
FROM python:3.11-slim AS builder

WORKDIR /app

# Installer les dépendances de build
RUN apt-get update && apt-get install -y \
    gcc \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Copier les dépendances depuis le builder
COPY --from=builder /root/.local /root/.local

# Copier le code
COPY . .

# Ajouter les binaires Python au PATH
ENV PATH=/root/.local/bin:$PATH

# Utilisateur non-root pour la sécurité
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["python", "main.py"]
```

### .dockerignore

Exclure les fichiers inutiles :

```
# .dockerignore
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info/
dist/
build/
.git/
.gitignore
.env
.venv/
venv/
env/
.pytest_cache/
.coverage
htmlcov/
*.log
.DS_Store
README.md
docker-compose.yml
Dockerfile
```

### Dockerfile optimisé pour Flask/FastAPI

```dockerfile
FROM python:3.11-slim

# Variables d'environnement
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Installer les dépendances système si nécessaire
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copier d'abord requirements.txt (cache Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY . .

# Utilisateur non-root
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Démarrer avec gunicorn pour la production
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "main:app"]
```

## Docker Compose

### docker-compose.yml basique

Orchestrer plusieurs conteneurs :

```yaml
version: '3.8'

services:
  # Application Python
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src
    restart: unless-stopped

  # Base de données PostgreSQL
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  # Cache Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Commandes Docker Compose

```bash
# Démarrer tous les services
docker-compose up

# En arrière-plan
docker-compose up -d

# Reconstruire les images
docker-compose up --build

# Voir les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f web

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Exécuter une commande dans un service
docker-compose exec web python manage.py migrate

# Scaler un service
docker-compose up -d --scale web=3
```

## Exemples pour différents frameworks

### FastAPI avec Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY ./app ./app

# Exposer le port
EXPOSE 8000

# Démarrer avec uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/apidb
    volumes:
      - ./app:/app/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: apidb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mon API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/")
def read_root():
    return {"message": "Hello from Docker!"}
```

### Django avec Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /code

# Installer PostgreSQL client
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collecter les fichiers statiques
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

# Script d'entrée
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]
```

```bash
#!/bin/bash
# docker-entrypoint.sh

# Attendre que la DB soit prête
echo "Waiting for PostgreSQL..."
while ! pg_isready -h db -p 5432 > /dev/null 2>&1; do
    sleep 1
done
echo "PostgreSQL is ready!"

# Migrations
python manage.py migrate --noinput

# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Créer un superuser si nécessaire
python manage.py createsuperuser --noinput || true

# Exécuter la commande
exec "$@"
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/code
    ports:
      - "8000:8000"
    environment:
      - DEBUG=1
      - SECRET_KEY=dev-secret-key-change-in-production
      - DATABASE_URL=postgresql://django:django@db:5432/djangodb
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: djangodb
      POSTGRES_USER: django
      POSTGRES_PASSWORD: django
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./static:/static
    depends_on:
      - web

volumes:
  postgres_data:
```

### Application avec Celery (tasks async)

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API Web
  web:
    build: .
    command: gunicorn --bind 0.0.0.0:8000 app:app
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://redis:6379/0
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db
      - redis

  # Worker Celery
  celery_worker:
    build: .
    command: celery -A tasks worker --loglevel=info
    environment:
      - REDIS_URL=redis://redis:6379/0
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - redis
      - db

  # Celery Beat (tâches planifiées)
  celery_beat:
    build: .
    command: celery -A tasks beat --loglevel=info
    environment:
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - redis

  # Flower (monitoring Celery)
  flower:
    build: .
    command: celery -A tasks flower --port=5555
    ports:
      - "5555:5555"
    environment:
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - redis
      - celery_worker

  # Redis (broker)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # PostgreSQL
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Gestion des variables d'environnement

### Fichier .env

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here
DEBUG=True
API_KEY=your-api-key
```

### Utilisation dans docker-compose

```yaml
version: '3.8'

services:
  web:
    build: .
    env_file:
      - .env
    # ou
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
```

### Python-dotenv

```python
# config.py
from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    DATABASE_URL = os.getenv('DATABASE_URL')
    REDIS_URL = os.getenv('REDIS_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
```

## Networking Docker

### Réseau par défaut

```bash
# Lister les réseaux
docker network ls

# Inspecter un réseau
docker network inspect bridge

# Créer un réseau personnalisé
docker network create mon-reseau

# Lancer un conteneur sur ce réseau
docker run --network mon-reseau --name app1 mon-image
```

### Communication entre conteneurs

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: ./api
    networks:
      - frontend
      - backend

  worker:
    build: ./worker
    networks:
      - backend

  nginx:
    image: nginx:alpine
    networks:
      - frontend

networks:
  frontend:
  backend:
```

## Volumes et persistance

### Types de volumes

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    volumes:
      # Volume nommé (géré par Docker)
      - postgres_data:/var/lib/postgresql/data
      
      # Bind mount (dossier hôte)
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
      
      # Volume tmpfs (mémoire)
      - type: tmpfs
        target: /tmp

volumes:
  postgres_data:
```

### Backup et restore

```bash
# Backup d'un volume
docker run --rm \
  -v postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz -C /data .

# Restore d'un volume
docker run --rm \
  -v postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /data
```

## Docker pour développement vs production

### Développement

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    command: python -m flask run --host=0.0.0.0 --reload
    volumes:
      - .:/app  # Hot reload
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=development
      - DEBUG=True
```

### Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    command: gunicorn --workers 4 --bind 0.0.0.0:8000 app:app
    restart: always
    environment:
      - FLASK_ENV=production
      - DEBUG=False
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Sécurité avec Docker

### Bonnes pratiques

```dockerfile
# Dockerfile sécurisé
FROM python:3.11-slim

# 1. Ne pas exécuter en root
RUN useradd -m -u 1000 appuser

# 2. Mettre à jour les paquets
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    postgresql-client && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Copier avec les bons droits
COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=appuser:appuser . .

# 4. Utiliser l'utilisateur non-root
USER appuser

# 5. Exposer seulement les ports nécessaires
EXPOSE 8000

# 6. Pas de secrets dans l'image
# Utiliser des variables d'environnement

# 7. Healthcheck
HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1

CMD ["gunicorn", "app:app"]
```

### Scanner les vulnérabilités

```bash
# Avec Trivy
trivy image mon-app:latest

# Avec Snyk
snyk container test mon-app:latest

# Avec Docker Scout
docker scout cves mon-app:latest
```

## Commandes Docker utiles

### Gestion des images

```bash
# Lister les images
docker images

# Supprimer une image
docker rmi image-name

# Supprimer les images non utilisées
docker image prune

# Construire sans cache
docker build --no-cache -t mon-app .

# Tagger une image
docker tag mon-app:latest mon-app:v1.0.0

# Push vers un registry
docker push mon-registry.com/mon-app:v1.0.0
```

### Gestion des conteneurs

```bash
# Lister les conteneurs actifs
docker ps

# Lister tous les conteneurs
docker ps -a

# Arrêter un conteneur
docker stop container-id

# Démarrer un conteneur
docker start container-id

# Redémarrer un conteneur
docker restart container-id

# Supprimer un conteneur
docker rm container-id

# Entrer dans un conteneur
docker exec -it container-id /bin/bash

# Copier des fichiers
docker cp file.txt container-id:/app/
docker cp container-id:/app/logs/ ./logs/

# Voir les stats
docker stats

# Inspecter un conteneur
docker inspect container-id
```

### Nettoyage

```bash
# Nettoyer tout ce qui est inutilisé
docker system prune

# Nettoyer avec les volumes
docker system prune -a --volumes

# Supprimer tous les conteneurs arrêtés
docker container prune

# Supprimer toutes les images non utilisées
docker image prune -a

# Supprimer tous les volumes non utilisés
docker volume prune
```

## Debugging et troubleshooting

### Logs

```bash
# Voir les logs
docker logs container-id

# Suivre les logs en temps réel
docker logs -f container-id

# Dernières 100 lignes
docker logs --tail 100 container-id

# Logs avec timestamps
docker logs -t container-id
```

### Troubleshooting

```bash
# Vérifier si le conteneur est en cours d'exécution
docker ps | grep mon-app

# Vérifier les processus dans le conteneur
docker top container-id

# Vérifier l'utilisation des ressources
docker stats container-id

# Inspecter la configuration
docker inspect container-id

# Tester la connectivité réseau
docker exec container-id ping autre-container
```

## Exercices pratiques

### Exercice 1 : Application Flask simple

Créer une API Flask conteneurisée :

```python
# app.py
from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

@app.route('/')
def hello():
    env = os.getenv('ENVIRONMENT', 'development')
    return jsonify({'message': f'Hello from {env}!'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

### Exercice 2 : Stack complète

Créer une application avec :
- FastAPI
- PostgreSQL
- Redis
- Nginx

### Exercice 3 : Multi-stage optimisé

Créer un Dockerfile multi-stage qui :
- Build l'application
- Exécute les tests
- Crée une image de production minimale

## Bonnes pratiques

### ✅ À faire

- Utiliser des images officielles et légères (alpine)
- Multi-stage builds pour réduire la taille
- .dockerignore pour exclure les fichiers inutiles
- Utilisateur non-root pour la sécurité
- Healthchecks pour la monitoring
- Logs vers stdout/stderr
- Variables d'environnement pour la configuration
- Scanner les vulnérabilités régulièrement

### ❌ À éviter

- Exécuter en tant que root
- Mettre des secrets dans l'image
- Copier tout le contexte (utilisez .dockerignore)
- Images trop grandes
- Trop de couches (combiner les RUN)
- Oublier de nettoyer les caches apt/yum
- Hardcoder les URLs et configs

## Ressources- **Documentation Docker** : https://docs.docker.com
- **Docker Hub** : https://hub.docker.com
- **Best Practices** : https://docs.docker.com/develop/dev-best-practices/
- **Security** : https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
