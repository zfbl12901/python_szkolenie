---
title: "Monitoring et Gestion des Logs"
order: 4
parent: "40-devops-python.md"
tags: ["python", "devops", "monitoring", "logs", "observability"]
---

# Monitoring et Gestion des Logs

## Introduction

L'observabilité (logs, métriques, traces) est essentielle pour maintenir des applications fiables en production. Un bon système de monitoring permet de détecter et résoudre les problèmes avant qu'ils n'impactent les utilisateurs.

### Les trois piliers de l'observabilité

```
┌─────────────────────────────────────────────────────────┐
│              OBSERVABILITÉ                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐           │
│  │   LOGS   │   │ METRICS  │   │  TRACES  │           │
│  │          │   │          │   │          │           │
│  │ Événements│   │ Métriques│   │ Parcours │           │
│  │ textuels  │   │ chiffrées│   │ requêtes │           │
│  └──────────┘   └──────────┘   └──────────┘           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Pilier | Description | Outils |
|--------|-------------|--------|
| **Logs** | Événements textuels | ELK, Loki, CloudWatch |
| **Metrics** | Données numériques | Prometheus, Grafana |
| **Traces** | Suivi des requêtes | Jaeger, Zipkin |

## Logging en Python

### Configuration de base

```python
# config/logging_config.py
import logging
import sys
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler

def setup_logging(app_name='myapp', level=logging.INFO):
    """Configure le système de logging"""
    
    # Format des logs
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    formatter = logging.Formatter(log_format)
    
    # Logger racine
    logger = logging.getLogger(app_name)
    logger.setLevel(level)
    
    # Handler console
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # Handler fichier (rotation par taille)
    file_handler = RotatingFileHandler(
        filename=f'logs/{app_name}.log',
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    # Handler fichier d'erreurs
    error_handler = RotatingFileHandler(
        filename=f'logs/{app_name}_errors.log',
        maxBytes=10 * 1024 * 1024,
        backupCount=5
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    logger.addHandler(error_handler)
    
    return logger

# Utilisation
logger = setup_logging('myapp', logging.DEBUG)
logger.info("Application started")
logger.warning("This is a warning")
logger.error("An error occurred")
```

### Logs structurés (JSON)

```python
# structured_logging.py
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    """Formatter pour logs JSON"""
    
    def format(self, record):
        log_obj = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        # Ajouter l'exception si présente
        if record.exc_info:
            log_obj['exception'] = self.formatException(record.exc_info)
        
        # Ajouter les extras
        for key, value in record.__dict__.items():
            if key not in ['name', 'msg', 'args', 'created', 'filename', 
                          'funcName', 'levelname', 'levelno', 'lineno',
                          'module', 'msecs', 'message', 'pathname', 
                          'process', 'processName', 'relativeCreated',
                          'thread', 'threadName', 'exc_info', 'exc_text']:
                log_obj[key] = value
        
        return json.dumps(log_obj)

# Configuration
def setup_json_logging():
    logger = logging.getLogger('myapp')
    logger.setLevel(logging.INFO)
    
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    logger.addHandler(handler)
    
    return logger

# Utilisation
logger = setup_json_logging()
logger.info("User logged in", extra={
    'user_id': 123,
    'ip_address': '192.168.1.1',
    'action': 'login'
})
# Output: {"timestamp": "2024-01-15T10:30:00", "level": "INFO", ...}
```

### Logging avec contexte

```python
# context_logging.py
import logging
from contextvars import ContextVar
import uuid

# Variable de contexte pour le request_id
request_id_var = ContextVar('request_id', default=None)

class ContextFilter(logging.Filter):
    """Filtre pour ajouter des informations contextuelles"""
    
    def filter(self, record):
        record.request_id = request_id_var.get() or 'no-request-id'
        return True

def setup_context_logging():
    logger = logging.getLogger('myapp')
    logger.setLevel(logging.INFO)
    
    # Format avec request_id
    formatter = logging.Formatter(
        '%(asctime)s - %(request_id)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    handler.addFilter(ContextFilter())
    
    logger.addHandler(handler)
    return logger

# Middleware Flask/FastAPI
def log_middleware(get_response):
    def middleware(request):
        # Générer un request_id unique
        request_id = str(uuid.uuid4())
        request_id_var.set(request_id)
        
        logger.info(f"Request started: {request.method} {request.path}")
        
        response = get_response(request)
        
        logger.info(f"Request completed: {response.status_code}")
        
        return response
    
    return middleware

logger = setup_context_logging()
```

### Logging dans Flask

```python
# flask_app.py
from flask import Flask, request, g
import logging
import time
import uuid

app = Flask(__name__)

# Configuration du logging
def setup_flask_logging(app):
    """Configure le logging pour Flask"""
    
    # Format
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - [%(request_id)s] - %(message)s'
    )
    
    # Handler
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    
    # Logger de l'app
    app.logger.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    
    return app.logger

logger = setup_flask_logging(app)

# Middleware pour logger les requêtes
@app.before_request
def before_request():
    g.request_id = str(uuid.uuid4())
    g.start_time = time.time()
    
    logger.info(
        f"Request started",
        extra={
            'request_id': g.request_id,
            'method': request.method,
            'path': request.path,
            'ip': request.remote_addr
        }
    )

@app.after_request
def after_request(response):
    duration = time.time() - g.start_time
    
    logger.info(
        f"Request completed",
        extra={
            'request_id': g.request_id,
            'status_code': response.status_code,
            'duration_ms': round(duration * 1000, 2)
        }
    )
    
    return response

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(
        f"Unhandled exception: {str(e)}",
        extra={'request_id': g.get('request_id')},
        exc_info=True
    )
    return {'error': 'Internal server error'}, 500
```

### Logging dans FastAPI

```python
# fastapi_app.py
from fastapi import FastAPI, Request
import logging
import time
import uuid

app = FastAPI()

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Middleware de logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.time()
    
    # Ajouter request_id aux headers de réponse
    request.state.request_id = request_id
    
    logger.info(
        f"Request started",
        extra={
            'request_id': request_id,
            'method': request.method,
            'path': request.url.path,
            'client': request.client.host
        }
    )
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    
    logger.info(
        f"Request completed",
        extra={
            'request_id': request_id,
            'status_code': response.status_code,
            'duration_ms': round(duration * 1000, 2)
        }
    )
    
    response.headers["X-Request-ID"] = request_id
    
    return response
```

## Métriques avec Prometheus

### Prometheus client Python

```python
# metrics.py
from prometheus_client import (
    Counter, Gauge, Histogram, Summary,
    CollectorRegistry, generate_latest, CONTENT_TYPE_LATEST
)
from flask import Flask, Response
import time
import random

app = Flask(__name__)

# Créer un registre personnalisé
registry = CollectorRegistry()

# Métriques

# Counter : valeur qui ne peut qu'augmenter
request_count = Counter(
    'http_requests_total',
    'Total HTTP Requests',
    ['method', 'endpoint', 'status'],
    registry=registry
)

# Gauge : valeur qui peut augmenter ou diminuer
active_users = Gauge(
    'active_users',
    'Number of active users',
    registry=registry
)

# Histogram : distribution des valeurs
request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP Request Duration',
    ['method', 'endpoint'],
    buckets=(0.01, 0.05, 0.1, 0.5, 1, 2.5, 5, 10),
    registry=registry
)

# Summary : similaire à Histogram mais avec quantiles
response_size = Summary(
    'http_response_size_bytes',
    'HTTP Response Size',
    ['endpoint'],
    registry=registry
)

# Utilisation dans une route
@app.route('/api/data')
def get_data():
    start_time = time.time()
    
    # Simuler du traitement
    time.sleep(random.uniform(0.01, 0.5))
    
    # Incrémenter le compteur
    request_count.labels(
        method='GET',
        endpoint='/api/data',
        status=200
    ).inc()
    
    # Enregistrer la durée
    duration = time.time() - start_time
    request_duration.labels(
        method='GET',
        endpoint='/api/data'
    ).observe(duration)
    
    # Enregistrer la taille de la réponse
    response_data = {'data': 'example'}
    response_size.labels(endpoint='/api/data').observe(len(str(response_data)))
    
    return response_data

# Endpoint pour exposer les métriques
@app.route('/metrics')
def metrics():
    return Response(
        generate_latest(registry),
        mimetype=CONTENT_TYPE_LATEST
    )

if __name__ == '__main__':
    app.run(port=8000)
```

### Métriques pour FastAPI

```python
# fastapi_metrics.py
from fastapi import FastAPI, Request
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response
import time

app = FastAPI()

# Métriques
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP Requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP Request Duration',
    ['method', 'endpoint']
)

# Middleware pour collecter les métriques
@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    REQUEST_DURATION.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(duration)
    
    return response

# Endpoint pour exposer les métriques
@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

### Configuration Prometheus

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  # Job pour l'application Python
  - job_name: 'python-app'
    static_configs:
      - targets: ['localhost:8000']
        labels:
          env: 'production'
          app: 'myapp'
  
  # Job pour Node Exporter (métriques système)
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']

rule_files:
  - 'alerts.yml'
```

```yaml
# alerts.yml
groups:
  - name: app_alerts
    interval: 30s
    rules:
      # Alerte si taux d'erreur > 5%
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{status=~"5.."}[5m])
          / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"
      
      # Alerte si temps de réponse > 1s
      - alert: HighLatency
        expr: |
          histogram_quantile(0.95, 
            rate(http_request_duration_seconds_bucket[5m])
          ) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          description: "95th percentile latency is {{ $value }}s"
```

## Grafana Dashboards

### Configuration Grafana

```yaml
# grafana/provisioning/datasources/prometheus.yml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
```

### Dashboard Python App

```json
{
  "dashboard": {
    "title": "Python Application Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "Errors"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p95"
          }
        ],
        "type": "graph"
      }
    ]
  }
}
```

## Distributed Tracing

### OpenTelemetry

```python
# tracing.py
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from flask import Flask

# Configuration du tracing
def setup_tracing(service_name='myapp'):
    # Provider
    trace.set_tracer_provider(TracerProvider())
    
    # Exporter vers Jaeger
    jaeger_exporter = JaegerExporter(
        agent_host_name='localhost',
        agent_port=6831,
    )
    
    # Processor
    span_processor = BatchSpanProcessor(jaeger_exporter)
    trace.get_tracer_provider().add_span_processor(span_processor)
    
    return trace.get_tracer(service_name)

# Utilisation avec Flask
app = Flask(__name__)
tracer = setup_tracing('flask-app')

# Instrumenter Flask automatiquement
FlaskInstrumentor().instrument_app(app)

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    # Créer un span personnalisé
    with tracer.start_as_current_span("database_query") as span:
        span.set_attribute("user_id", user_id)
        
        # Simuler une requête DB
        user = fetch_user_from_db(user_id)
        
        span.set_attribute("user_found", user is not None)
    
    return {'user': user}

def fetch_user_from_db(user_id):
    """Simuler une requête DB"""
    with tracer.start_as_current_span("db.query") as span:
        span.set_attribute("db.system", "postgresql")
        span.set_attribute("db.statement", f"SELECT * FROM users WHERE id={user_id}")
        
        # Simuler le temps de requête
        import time
        time.sleep(0.01)
        
        return {'id': user_id, 'name': 'John Doe'}
```

## ELK Stack (Elasticsearch, Logstash, Kibana)

### Configuration Logstash

```ruby
# logstash.conf
input {
  file {
    path => "/var/log/myapp/*.log"
    start_position => "beginning"
    codec => json
  }
}

filter {
  # Parser JSON logs
  json {
    source => "message"
  }
  
  # Ajouter des champs
  mutate {
    add_field => { "app" => "myapp" }
  }
  
  # Extraire le timestamp
  date {
    match => [ "timestamp", "ISO8601" ]
    target => "@timestamp"
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "myapp-%{+YYYY.MM.dd}"
  }
  
  # Debug
  stdout {
    codec => rubydebug
  }
}
```

### Logging vers Elasticsearch

```python
# elasticsearch_logging.py
from elasticsearch import Elasticsearch
import logging
from datetime import datetime

class ElasticsearchHandler(logging.Handler):
    """Handler pour envoyer les logs à Elasticsearch"""
    
    def __init__(self, es_host='localhost', es_port=9200, index_prefix='app-logs'):
        super().__init__()
        self.es = Elasticsearch([f'http://{es_host}:{es_port}'])
        self.index_prefix = index_prefix
    
    def emit(self, record):
        # Créer le document
        doc = {
            '@timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        # Ajouter l'exception si présente
        if record.exc_info:
            doc['exception'] = self.format(record)
        
        # Index dans Elasticsearch
        index_name = f"{self.index_prefix}-{datetime.now().strftime('%Y.%m.%d')}"
        self.es.index(index=index_name, document=doc)

# Configuration
def setup_elasticsearch_logging():
    logger = logging.getLogger('myapp')
    logger.setLevel(logging.INFO)
    
    # Handler Elasticsearch
    es_handler = ElasticsearchHandler()
    logger.addHandler(es_handler)
    
    # Handler console aussi
    console_handler = logging.StreamHandler()
    logger.addHandler(console_handler)
    
    return logger

logger = setup_elasticsearch_logging()
logger.info("Application started")
```

## Healthchecks

### Endpoint de santé

```python
# health.py
from flask import Flask, jsonify
import psycopg2
import redis
import time

app = Flask(__name__)

class HealthCheck:
    """Vérifications de santé de l'application"""
    
    def __init__(self):
        self.start_time = time.time()
        self.checks = {
            'database': self.check_database,
            'redis': self.check_redis,
            'disk': self.check_disk_space
        }
    
    def check_database(self):
        """Vérifier la connexion DB"""
        try:
            conn = psycopg2.connect(
                host="localhost",
                database="mydb",
                user="user",
                password="pass",
                connect_timeout=3
            )
            conn.close()
            return {'status': 'healthy'}
        except Exception as e:
            return {'status': 'unhealthy', 'error': str(e)}
    
    def check_redis(self):
        """Vérifier Redis"""
        try:
            r = redis.Redis(host='localhost', port=6379, socket_connect_timeout=3)
            r.ping()
            return {'status': 'healthy'}
        except Exception as e:
            return {'status': 'unhealthy', 'error': str(e)}
    
    def check_disk_space(self):
        """Vérifier l'espace disque"""
        import shutil
        stats = shutil.disk_usage('/')
        percent_used = (stats.used / stats.total) * 100
        
        if percent_used > 90:
            return {
                'status': 'unhealthy',
                'percent_used': percent_used
            }
        return {
            'status': 'healthy',
            'percent_used': percent_used
        }
    
    def run_checks(self):
        """Exécuter toutes les vérifications"""
        results = {}
        overall_healthy = True
        
        for name, check_func in self.checks.items():
            try:
                results[name] = check_func()
                if results[name]['status'] != 'healthy':
                    overall_healthy = False
            except Exception as e:
                results[name] = {'status': 'unhealthy', 'error': str(e)}
                overall_healthy = False
        
        return {
            'status': 'healthy' if overall_healthy else 'unhealthy',
            'uptime': time.time() - self.start_time,
            'checks': results
        }

health_check = HealthCheck()

@app.route('/health')
def health():
    """Endpoint de santé simple"""
    return jsonify({'status': 'healthy', 'timestamp': time.time()})

@app.route('/health/ready')
def readiness():
    """Readiness probe - l'app est prête à recevoir du trafic"""
    result = health_check.run_checks()
    status_code = 200 if result['status'] == 'healthy' else 503
    return jsonify(result), status_code

@app.route('/health/live')
def liveness():
    """Liveness probe - l'app est en vie"""
    # Check basique juste pour voir si l'app répond
    return jsonify({
        'status': 'healthy',
        'uptime': time.time() - health_check.start_time
    })
```

## Stack de monitoring complète

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Application Python
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  # PostgreSQL
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  # Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    depends_on:
      - prometheus

  # Elasticsearch
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  # Logstash
  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    ports:
      - "5000:5000"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  # Kibana
  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

  # Jaeger (distributed tracing)
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686"  # UI
      - "14268:14268"
      - "14250:14250"
      - "9411:9411"

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
  es_data:
```

## Alerting

### Configuration AlertManager

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'

route:
  group_by: ['alertname', 'cluster']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'slack'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'

receivers:
  - name: 'slack'
    slack_configs:
      - channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}'

  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: 'YOUR-PAGERDUTY-KEY'
```

### Notifications Python

```python
# alerting.py
import requests

class AlertManager:
    """Envoyer des alertes"""
    
    def __init__(self, slack_webhook=None, email_config=None):
        self.slack_webhook = slack_webhook
        self.email_config = email_config
    
    def send_slack_alert(self, message, severity='info'):
        """Envoyer une alerte Slack"""
        if not self.slack_webhook:
            return
        
        colors = {
            'info': '#36a64f',
            'warning': '#ff9900',
            'error': '#ff0000'
        }
        
        payload = {
            'attachments': [{
                'color': colors.get(severity, colors['info']),
                'text': message,
                'ts': int(time.time())
            }]
        }
        
        try:
            response = requests.post(
                self.slack_webhook,
                json=payload,
                timeout=5
            )
            response.raise_for_status()
        except Exception as e:
            print(f"Failed to send Slack alert: {e}")
    
    def send_email_alert(self, subject, body, to_emails):
        """Envoyer une alerte par email"""
        import smtplib
        from email.mime.text import MIMEText
        
        if not self.email_config:
            return
        
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = self.email_config['from']
        msg['To'] = ', '.join(to_emails)
        
        try:
            with smtplib.SMTP(self.email_config['smtp_host'], 
                            self.email_config['smtp_port']) as server:
                server.starttls()
                server.login(self.email_config['username'], 
                           self.email_config['password'])
                server.send_message(msg)
        except Exception as e:
            print(f"Failed to send email alert: {e}")

# Utilisation
alert_manager = AlertManager(slack_webhook='https://hooks.slack.com/...')

try:
    # Code qui peut échouer
    process_critical_task()
except Exception as e:
    alert_manager.send_slack_alert(
        f"Critical error in process: {str(e)}",
        severity='error'
    )
```

## Bonnes pratiques

### ✅ À faire

- **Logs structurés** : JSON pour parsing facile
- **Request ID** : Tracer les requêtes end-to-end
- **Métriques RED** : Rate, Errors, Duration
- **Alertes intelligentes** : Éviter les faux positifs
- **Retention** : Définir des durées de rétention
- **Dashboards** : Créer des vues par service
- **SLOs/SLIs** : Définir des objectifs mesurables
- **Runbooks** : Documenter les procédures

### ❌ À éviter

- **Logs trop verbeux** : Log ce qui est nécessaire
- **Pas de contexte** : Toujours ajouter du contexte
- **Métriques inutiles** : Mesurer ce qui compte
- **Alertes spam** : Trop d'alertes = aucune alerte
- **Pas de retention** : Garder les logs assez longtemps
- **Ignorer les métriques** : Les monitorer régulièrement

## Ressources

- **Prometheus** : https://prometheus.io/docs/
- **Grafana** : https://grafana.com/docs/
- **ELK Stack** : https://www.elastic.co/what-is/elk-stack
- **OpenTelemetry** : https://opentelemetry.io/docs/
- **Jaeger** : https://www.jaegertracing.io/docs/
