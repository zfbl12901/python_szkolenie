---
title: "Déploiement Cloud (AWS, Azure, GCP)"
order: 3
parent: "40-devops-python.md"
tags: ["python", "devops", "cloud", "aws", "azure", "gcp"]
---

# Déploiement Cloud (AWS, Azure, GCP)

## Introduction

Le déploiement cloud permet d'héberger vos applications Python sur une infrastructure scalable, fiable et managée. Les trois principaux fournisseurs (AWS, Azure, GCP) offrent des services similaires avec leurs propres particularités.

### Pourquoi le cloud ?

| Avantage | Description |
|----------|-------------|
| **Scalabilité** | Adapter les ressources à la demande |
| **Disponibilité** | SLA de 99.9% ou plus |
| **Coût** | Payer uniquement ce qu'on utilise |
| **Géographie** | Déployer proche des utilisateurs |
| **Services managés** | DB, cache, queue sans gestion |
| **Sécurité** | Infrastructure sécurisée |

### Modèles de déploiement

```
┌─────────────────────────────────────────────────────────┐
│                 MODÈLES DE SERVICE                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  IaaS (Infrastructure as a Service)                     │
│  ├─ AWS EC2, Azure VMs, GCP Compute Engine             │
│  └─ Contrôle total, responsabilité maximale            │
│                                                         │
│  PaaS (Platform as a Service)                          │
│  ├─ AWS Elastic Beanstalk, Azure App Service           │
│  ├─ GCP App Engine                                     │
│  └─ Déploiement simplifié, moins de contrôle          │
│                                                         │
│  FaaS (Function as a Service / Serverless)             │
│  ├─ AWS Lambda, Azure Functions, GCP Cloud Functions   │
│  └─ Pay-per-execution, scaling automatique            │
│                                                         │
│  CaaS (Container as a Service)                         │
│  ├─ AWS ECS/EKS, Azure AKS, GCP GKE                   │
│  └─ Orchestration de conteneurs                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Amazon Web Services (AWS)

### Services AWS pour Python

| Service | Usage | Type |
|---------|-------|------|
| **EC2** | Serveurs virtuels | IaaS |
| **Lambda** | Functions serverless | FaaS |
| **Elastic Beanstalk** | Platform managée | PaaS |
| **ECS/Fargate** | Conteneurs | CaaS |
| **EKS** | Kubernetes | CaaS |
| **RDS** | Base de données | Database |
| **S3** | Stockage objet | Storage |
| **API Gateway** | API REST | API |

### 1. Déploiement avec EC2

#### Configuration serveur

```bash
#!/bin/bash
# Script d'installation sur EC2 (Ubuntu)

# Mise à jour
sudo apt update && sudo apt upgrade -y

# Python et dépendances
sudo apt install -y python3.11 python3.11-venv python3-pip nginx

# Créer un utilisateur pour l'application
sudo useradd -m -s /bin/bash appuser

# Créer le répertoire de l'application
sudo mkdir -p /var/www/myapp
sudo chown appuser:appuser /var/www/myapp

# Installation de l'application
cd /var/www/myapp
sudo -u appuser git clone https://github.com/user/myapp.git .
sudo -u appuser python3.11 -m venv venv
sudo -u appuser venv/bin/pip install -r requirements.txt

# Configuration Gunicorn avec systemd
sudo tee /etc/systemd/system/myapp.service << EOF
[Unit]
Description=MyApp Gunicorn daemon
After=network.target

[Service]
User=appuser
Group=appuser
WorkingDirectory=/var/www/myapp
Environment="PATH=/var/www/myapp/venv/bin"
ExecStart=/var/www/myapp/venv/bin/gunicorn --workers 3 --bind unix:myapp.sock -m 007 wsgi:app

[Install]
WantedBy=multi-user.target
EOF

# Démarrer le service
sudo systemctl start myapp
sudo systemctl enable myapp

# Configuration Nginx
sudo tee /etc/nginx/sites-available/myapp << EOF
server {
    listen 80;
    server_name _;

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/myapp/myapp.sock;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SDK Boto3

```python
# app/aws_services.py
import boto3
from botocore.exceptions import ClientError

class AWSService:
    """Services AWS avec boto3"""
    
    def __init__(self):
        self.s3 = boto3.client('s3')
        self.dynamodb = boto3.resource('dynamodb')
        self.sqs = boto3.client('sqs')
    
    def upload_to_s3(self, file_path, bucket, key):
        """Upload un fichier sur S3"""
        try:
            self.s3.upload_file(file_path, bucket, key)
            print(f"File uploaded to s3://{bucket}/{key}")
        except ClientError as e:
            print(f"Error: {e}")
    
    def get_from_s3(self, bucket, key, download_path):
        """Télécharger depuis S3"""
        try:
            self.s3.download_file(bucket, key, download_path)
            print(f"File downloaded to {download_path}")
        except ClientError as e:
            print(f"Error: {e}")
    
    def put_dynamodb(self, table_name, item):
        """Insérer dans DynamoDB"""
        table = self.dynamodb.Table(table_name)
        response = table.put_item(Item=item)
        return response
    
    def send_sqs_message(self, queue_url, message):
        """Envoyer un message SQS"""
        response = self.sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=message
        )
        return response['MessageId']

# Utilisation
aws = AWSService()
aws.upload_to_s3('local.txt', 'my-bucket', 'remote.txt')
```

### 2. AWS Lambda (Serverless)

#### Fonction Lambda

```python
# lambda_function.py
import json
import boto3

def lambda_handler(event, context):
    """
    Handler Lambda pour une API
    
    Event structure:
    {
        "httpMethod": "GET",
        "path": "/users",
        "queryStringParameters": {...},
        "body": {...}
    }
    """
    
    # Parser le body si présent
    body = json.loads(event.get('body', '{}'))
    
    # Traitement
    result = {
        'message': 'Hello from Lambda!',
        'input': body
    }
    
    # Réponse HTTP
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result)
    }
```

#### Déploiement Lambda avec AWS SAM

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: My Python API

Globals:
  Function:
    Timeout: 30
    Runtime: python3.11
    Environment:
      Variables:
        STAGE: prod

Resources:
  # Fonction Lambda
  MyApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/
      Handler: app.lambda_handler
      Events:
        GetApi:
          Type: Api
          Properties:
            Path: /api/{proxy+}
            Method: ANY
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref MyTable
  
  # Table DynamoDB
  MyTable:
    Type: AWS::DynamoDB::Table
    Properties:
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      BillingMode: PAY_PER_REQUEST

Outputs:
  ApiUrl:
    Description: "API Gateway endpoint URL"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"
```

```bash
# Déploiement
sam build
sam deploy --guided
```

### 3. Elastic Beanstalk

```python
# .ebextensions/python.config
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: application.py

  aws:elasticbeanstalk:application:environment:
    FLASK_ENV: production
    DATABASE_URL: !Sub 'postgresql://user:pass@${RDS.Endpoint.Address}:5432/mydb'
```

```bash
# Déploiement
eb init -p python-3.11 my-app
eb create my-app-env
eb deploy
eb open
```

### 4. ECS/Fargate (Conteneurs)

```json
// task-definition.json
{
  "family": "myapp",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "myapp",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "DATABASE_URL", "value": "..."},
        {"name": "REDIS_URL", "value": "..."}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/myapp",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

```bash
# Déploiement
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs update-service --cluster my-cluster --service my-service --task-definition myapp
```

## Microsoft Azure

### Services Azure pour Python

| Service | Usage | Type |
|---------|-------|------|
| **Virtual Machines** | Serveurs virtuels | IaaS |
| **App Service** | Web apps | PaaS |
| **Functions** | Serverless | FaaS |
| **Container Apps** | Conteneurs | CaaS |
| **AKS** | Kubernetes | CaaS |
| **Cosmos DB** | NoSQL database | Database |
| **Blob Storage** | Stockage objet | Storage |

### 1. App Service

#### Déploiement avec Azure CLI

```bash
# Login
az login

# Créer un groupe de ressources
az group create --name myResourceGroup --location eastus

# Créer un plan App Service
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux

# Créer une web app
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name myPythonApp \
  --runtime "PYTHON:3.11"

# Configurer les variables d'environnement
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myPythonApp \
  --settings \
    DATABASE_URL="postgresql://..." \
    SECRET_KEY="..."

# Déployer depuis Git
az webapp deployment source config \
  --name myPythonApp \
  --resource-group myResourceGroup \
  --repo-url https://github.com/user/repo \
  --branch main \
  --manual-integration

# Ou déployer avec ZIP
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name myPythonApp \
  --src app.zip
```

#### Configuration Azure

```python
# startup.sh
#!/bin/bash
python -m pip install --upgrade pip
pip install -r requirements.txt
gunicorn --bind=0.0.0.0 --timeout 600 app:app
```

### 2. Azure Functions

```python
# __init__.py
import logging
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(
            f"Hello, {name}!",
            status_code=200
        )
    else:
        return func.HttpResponse(
            "Please pass a name parameter",
            status_code=400
        )
```

```json
// function.json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

### 3. SDK Azure

```python
# azure_services.py
from azure.storage.blob import BlobServiceClient
from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential

class AzureService:
    """Services Azure"""
    
    def __init__(self):
        # Authentification
        self.credential = DefaultAzureCredential()
        
        # Blob Storage
        self.blob_service = BlobServiceClient(
            account_url="https://myaccount.blob.core.windows.net",
            credential=self.credential
        )
        
        # Cosmos DB
        self.cosmos_client = CosmosClient(
            url="https://myaccount.documents.azure.com:443/",
            credential=self.credential
        )
    
    def upload_blob(self, container_name, blob_name, data):
        """Upload vers Blob Storage"""
        blob_client = self.blob_service.get_blob_client(
            container=container_name,
            blob=blob_name
        )
        blob_client.upload_blob(data, overwrite=True)
    
    def get_blob(self, container_name, blob_name):
        """Télécharger depuis Blob Storage"""
        blob_client = self.blob_service.get_blob_client(
            container=container_name,
            blob=blob_name
        )
        return blob_client.download_blob().readall()
    
    def create_cosmos_item(self, database_name, container_name, item):
        """Créer un item dans Cosmos DB"""
        database = self.cosmos_client.get_database_client(database_name)
        container = database.get_container_client(container_name)
        container.create_item(body=item)
```

## Google Cloud Platform (GCP)

### Services GCP pour Python

| Service | Usage | Type |
|---------|-------|------|
| **Compute Engine** | VMs | IaaS |
| **App Engine** | Platform managée | PaaS |
| **Cloud Functions** | Serverless | FaaS |
| **Cloud Run** | Conteneurs serverless | CaaS |
| **GKE** | Kubernetes | CaaS |
| **Cloud SQL** | Database SQL | Database |
| **Cloud Storage** | Stockage objet | Storage |

### 1. App Engine

```yaml
# app.yaml
runtime: python311

instance_class: F2

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6

env_variables:
  DATABASE_URL: "postgresql://..."
  SECRET_KEY: "..."

handlers:
- url: /static
  static_dir: static

- url: /.*
  script: auto
```

```bash
# Déploiement
gcloud app deploy
gcloud app browse
```

### 2. Cloud Run

```yaml
# cloudbuild.yaml
steps:
  # Build l'image Docker
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA', '.']
  
  # Push l'image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA']
  
  # Deploy sur Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'myapp'
      - '--image=gcr.io/$PROJECT_ID/myapp:$SHORT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA'
```

```bash
# Déploiement manuel
docker build -t gcr.io/my-project/myapp .
docker push gcr.io/my-project/myapp

gcloud run deploy myapp \
  --image gcr.io/my-project/myapp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="..."
```

### 3. Cloud Functions

```python
# main.py
from flask import escape

def hello_http(request):
    """HTTP Cloud Function"""
    request_json = request.get_json(silent=True)
    request_args = request.args

    if request_json and 'name' in request_json:
        name = request_json['name']
    elif request_args and 'name' in request_args:
        name = request_args['name']
    else:
        name = 'World'
    
    return f'Hello {escape(name)}!'
```

```bash
# Déploiement
gcloud functions deploy hello_http \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point hello_http
```

### 4. SDK GCP

```python
# gcp_services.py
from google.cloud import storage, firestore, pubsub_v1

class GCPService:
    """Services GCP"""
    
    def __init__(self, project_id):
        self.project_id = project_id
        self.storage_client = storage.Client()
        self.firestore_client = firestore.Client()
        self.publisher = pubsub_v1.PublisherClient()
    
    def upload_to_gcs(self, bucket_name, source_file, destination_blob):
        """Upload vers Cloud Storage"""
        bucket = self.storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_blob)
        blob.upload_from_filename(source_file)
        print(f"File uploaded to gs://{bucket_name}/{destination_blob}")
    
    def download_from_gcs(self, bucket_name, source_blob, destination_file):
        """Télécharger depuis Cloud Storage"""
        bucket = self.storage_client.bucket(bucket_name)
        blob = bucket.blob(source_blob)
        blob.download_to_filename(destination_file)
        print(f"File downloaded to {destination_file}")
    
    def add_to_firestore(self, collection, document_id, data):
        """Ajouter à Firestore"""
        doc_ref = self.firestore_client.collection(collection).document(document_id)
        doc_ref.set(data)
    
    def publish_message(self, topic_name, message):
        """Publier sur Pub/Sub"""
        topic_path = self.publisher.topic_path(self.project_id, topic_name)
        future = self.publisher.publish(
            topic_path,
            message.encode('utf-8')
        )
        return future.result()
```

## Infrastructure as Code

### Terraform

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "main-vpc"
  }
}

# Subnets
resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  
  tags = {
    Name = "public-subnet"
  }
}

# Security Group
resource "aws_security_group" "app" {
  name        = "app-sg"
  description = "Security group for application"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance
resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0"  # Ubuntu 22.04
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public.id
  
  vpc_security_group_ids = [aws_security_group.app.id]
  
  user_data = file("setup.sh")
  
  tags = {
    Name = "app-server"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier        = "myapp-db"
  engine            = "postgres"
  engine_version    = "15.3"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  
  db_name  = "myapp"
  username = "admin"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  skip_final_snapshot = true
}

# Outputs
output "instance_public_ip" {
  value = aws_instance.app.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}
```

```bash
# Déploiement Terraform
terraform init
terraform plan
terraform apply
terraform destroy
```

### Pulumi (Python)

```python
# __main__.py
import pulumi
import pulumi_aws as aws

# VPC
vpc = aws.ec2.Vpc("main-vpc",
    cidr_block="10.0.0.0/16",
    tags={"Name": "main-vpc"}
)

# Subnet
subnet = aws.ec2.Subnet("public-subnet",
    vpc_id=vpc.id,
    cidr_block="10.0.1.0/24",
    availability_zone="us-east-1a",
    map_public_ip_on_launch=True
)

# Security Group
sg = aws.ec2.SecurityGroup("app-sg",
    vpc_id=vpc.id,
    description="Security group for application",
    ingress=[
        {"protocol": "tcp", "from_port": 80, "to_port": 80, "cidr_blocks": ["0.0.0.0/0"]},
        {"protocol": "tcp", "from_port": 443, "to_port": 443, "cidr_blocks": ["0.0.0.0/0"]}
    ],
    egress=[
        {"protocol": "-1", "from_port": 0, "to_port": 0, "cidr_blocks": ["0.0.0.0/0"]}
    ]
)

# EC2 Instance
instance = aws.ec2.Instance("app-server",
    instance_type="t3.micro",
    ami="ami-0c55b159cbfafe1f0",
    subnet_id=subnet.id,
    vpc_security_group_ids=[sg.id],
    tags={"Name": "app-server"}
)

# Exports
pulumi.export("instance_ip", instance.public_ip)
pulumi.export("vpc_id", vpc.id)
```

```bash
# Déploiement Pulumi
pulumi up
pulumi destroy
```

## Gestion des coûts

### Estimation des coûts

| Service | Coût indicatif (mensuel) |
|---------|--------------------------|
| **EC2 t3.micro** | ~$7 |
| **RDS db.t3.micro** | ~$15 |
| **Lambda** (1M invocations) | ~$0.20 |
| **S3** (100GB) | ~$2.30 |
| **CloudFront** (1TB) | ~$85 |

### Optimisation

```python
# Script de monitoring des coûts AWS
import boto3
from datetime import datetime, timedelta

def get_monthly_costs():
    """Récupérer les coûts du mois"""
    ce = boto3.client('ce', region_name='us-east-1')
    
    end = datetime.now().date()
    start = end.replace(day=1)
    
    response = ce.get_cost_and_usage(
        TimePeriod={
            'Start': str(start),
            'End': str(end)
        },
        Granularity='MONTHLY',
        Metrics=['UnblendedCost'],
        GroupBy=[{'Type': 'SERVICE', 'Key': 'SERVICE'}]
    )
    
    costs = {}
    for result in response['ResultsByTime']:
        for group in result['Groups']:
            service = group['Keys'][0]
            amount = float(group['Metrics']['UnblendedCost']['Amount'])
            costs[service] = amount
    
    return costs

# Utilisation
costs = get_monthly_costs()
for service, amount in sorted(costs.items(), key=lambda x: x[1], reverse=True):
    print(f"{service}: ${amount:.2f}")
```

## Bonnes pratiques cloud

### ✅ À faire

- **Multi-AZ** : Déployer sur plusieurs zones
- **Auto-scaling** : Adapter les ressources
- **Backup automatique** : Sauvegardes régulières
- **Monitoring** : CloudWatch, Azure Monitor, Stackdriver
- **IAM** : Permissions minimales (principe du moindre privilège)
- **Encryption** : Chiffrer les données au repos et en transit
- **Cost management** : Surveiller et optimiser les coûts
- **Tags** : Taguer toutes les ressources

### ❌ À éviter

- **Root credentials** : Ne jamais utiliser le compte root
- **Hardcoded secrets** : Utiliser des gestionnaires de secrets
- **Single region** : Prévoir la redondance
- **Pas de backup** : Toujours avoir un plan de récupération
- **Oublier le nettoyage** : Supprimer les ressources inutilisées

## Ressources

- **AWS** : https://aws.amazon.com/getting-started/hands-on/
- **Azure** : https://docs.microsoft.com/en-us/azure/
- **GCP** : https://cloud.google.com/docs
- **Terraform** : https://www.terraform.io/docs
- **Pulumi** : https://www.pulumi.com/docs/
