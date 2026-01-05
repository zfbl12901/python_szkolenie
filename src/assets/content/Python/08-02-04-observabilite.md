---
title: "Observabilité"
order: 8.02.04
parent: "08-02-apis-services.md"
tags: ["python", "observabilite", "monitoring", "logging"]
---

# Observabilité

L'observabilité permet de comprendre le comportement de vos services en production grâce aux logs, métriques et traces. C'est essentiel pour le debugging et le monitoring.

## Concepts de base

**Observabilité** est la capacité à comprendre l'état interne d'un système en observant ses sorties. Elle repose sur trois piliers :

- **Logs** : Événements discrets dans le temps
- **Métriques** : Mesures numériques agrégées
- **Traces** : Chemins d'exécution à travers les services

### Pourquoi l'observabilité ?

- **Debugging** : Comprendre pourquoi quelque chose ne fonctionne pas
- **Performance** : Identifier les goulots d'étranglement
- **Sécurité** : Détecter les anomalies et attaques
- **Business** : Comprendre l'utilisation réelle

## Logging structuré

### Logging de base avec logging

```python
import logging

# Configuration de base
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

logger.debug('Message de debug')
logger.info('Information')
logger.warning('Avertissement')
logger.error('Erreur')
logger.critical('Critique')
```

### Logging structuré avec structlog

```bash
pip install structlog
```

```python
import structlog

# Configuration
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Logging structuré
logger.info("user_logged_in", user_id=123, ip="192.168.1.1")
logger.error("payment_failed", order_id=456, amount=99.99, reason="insufficient_funds")
```

### Logging avec contexte

```python
import logging
from contextvars import contextvars

# Variable de contexte
request_id_var = contextvars.ContextVar('request_id', default=None)

class RequestContextFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id_var.get()
        return True

# Configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(request_id)s - %(levelname)s - %(message)s',
    filters=[RequestContextFilter()]
)

logger = logging.getLogger(__name__)

# Utilisation
def handle_request(request_id):
    request_id_var.set(request_id)
    logger.info("Processing request")
    # ...
```

### Logging dans FastAPI

```python
from fastapi import FastAPI, Request
import logging
import uuid

app = FastAPI()
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    logger.info(
        "Request started",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path
        }
    )
    
    response = await call_next(request)
    
    logger.info(
        "Request completed",
        extra={
            "request_id": request_id,
            "status_code": response.status_code
        }
    )
    
    return response
```

## Métriques

### Métriques avec Prometheus

```bash
pip install prometheus-client
```

```python
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

# Compteur
request_count = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])

# Histogramme (durée)
request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration')

# Jauge (valeur actuelle)
active_connections = Gauge('active_connections', 'Number of active connections')

# Utilisation
@app.route('/api/users')
def get_users():
    request_count.labels(method='GET', endpoint='/api/users').inc()
    
    with request_duration.time():
        # Traitement...
        users = fetch_users()
    
    return jsonify(users)

# Démarrer le serveur de métriques
start_http_server(8000)  # Métriques sur http://localhost:8000/metrics
```

### Métriques personnalisées

```python
from prometheus_client import Counter, Histogram

# Métriques métier
orders_created = Counter('orders_created_total', 'Total orders created')
order_value = Histogram('order_value_dollars', 'Order value in dollars')

def create_order(amount):
    orders_created.inc()
    order_value.observe(amount)
    # ...
```

### Métriques avec StatsD

```bash
pip install statsd
```

```python
import statsd

# Connexion
client = statsd.StatsClient('localhost', 8125)

# Compteur
client.incr('api.requests')

# Timer
with client.timer('api.request_duration'):
    # Traitement...
    pass

# Gauge
client.gauge('api.active_users', 42)
```

## Distributed tracing

### Tracing avec OpenTelemetry

```bash
pip install opentelemetry-api opentelemetry-sdk opentelemetry-instrumentation-fastapi
```

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

# Configuration
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Exporter vers Jaeger
jaeger_exporter = JaegerExporter(
    agent_host_name="localhost",
    agent_port=6831,
)
span_processor = BatchSpanProcessor(jaeger_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

# Instrumenter FastAPI
app = FastAPI()
FastAPIInstrumentor.instrument_app(app)

# Utilisation manuelle
@app.get("/api/users")
def get_users():
    with tracer.start_as_current_span("fetch_users") as span:
        span.set_attribute("user.count", 10)
        users = fetch_users()
        return users
```

### Tracing avec contexte

```python
from opentelemetry import trace
from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator

tracer = trace.get_tracer(__name__)

def process_request():
    with tracer.start_as_current_span("process_request") as span:
        span.set_attribute("request.id", "123")
        
        # Propagation du contexte
        carrier = {}
        TraceContextTextMapPropagator().inject(carrier)
        
        # Passer le contexte à un autre service
        call_external_service(carrier)
```

## Outils et intégrations

### ELK Stack (Elasticsearch, Logstash, Kibana)

```python
import logging
from pythonjsonlogger import jsonlogger

# Configuration pour JSON logs
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

# Les logs JSON peuvent être envoyés à Logstash
logger.info("User action", extra={"user_id": 123, "action": "login"})
```

### Sentry pour le monitoring d'erreurs

```bash
pip install sentry-sdk
```

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="https://your-sentry-dsn@sentry.io/your-project-id",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)

# Les erreurs sont automatiquement envoyées à Sentry
@app.route('/api/users')
def get_users():
    try:
        return fetch_users()
    except Exception as e:
        # Erreur automatiquement capturée par Sentry
        raise
```

### Datadog

```bash
pip install ddtrace
```

```python
from ddtrace import patch_all
patch_all()

from flask import Flask
app = Flask(__name__)

# L'instrumentation automatique envoie les traces à Datadog
```

## Bonnes pratiques

### 1. Utilisez des logs structurés

```python
# ✅ Bon : Logs structurés
logger.info("user_login", extra={
    "user_id": 123,
    "ip": "192.168.1.1",
    "timestamp": "2024-01-01T12:00:00Z"
})

# ❌ Éviter : Logs non structurés
logger.info(f"User {user_id} logged in from {ip}")
```

### 2. Niveaux de log appropriés

```python
# ✅ Bon
logger.debug("Detailed debug info")  # Développement
logger.info("Normal operation")      # Production normale
logger.warning("Unusual situation")  # Attention
logger.error("Error occurred")      # Erreur
logger.critical("System failure")   # Critique
```

### 3. Ajoutez du contexte

```python
# ✅ Bon : Contexte riche
logger.info("Processing order", extra={
    "order_id": order.id,
    "user_id": order.user_id,
    "amount": order.amount,
    "status": order.status
})

# ❌ Éviter : Pas de contexte
logger.info("Processing order")
```

### 4. Ne loguez pas d'informations sensibles

```python
# ✅ Bon
logger.info("User login", extra={"user_id": user.id})

# ❌ Éviter
logger.info("User login", extra={"password": user.password})  # DANGER!
```

### 5. Utilisez des corrélations

```python
# ✅ Bon : ID de corrélation
request_id = str(uuid.uuid4())
logger.info("Request started", extra={"request_id": request_id})
# ... dans d'autres fonctions
logger.info("Database query", extra={"request_id": request_id})
```

## Points clés à retenir

- ✅ **Observabilité** : Logs + Métriques + Traces
- ✅ **Logs structurés** : Facilite l'analyse
- ✅ **Métriques** : Prometheus, StatsD
- ✅ **Tracing** : OpenTelemetry, Jaeger
- ✅ **Outils** : ELK, Sentry, Datadog
- ✅ **Contexte** : Ajoutez toujours du contexte
- ✅ **Sécurité** : Ne loguez pas d'informations sensibles

L'observabilité est essentielle pour comprendre et maintenir des systèmes en production. Combinez logs, métriques et traces pour une vue complète de votre système.
