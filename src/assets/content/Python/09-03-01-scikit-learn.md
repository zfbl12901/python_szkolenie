---
title: "scikit-learn"
order: 9.03.01
parent: "09-03-bases-ml.md"
tags: ["python", "scikit-learn", "machine-learning", "ml"]
---

# scikit-learn

scikit-learn est la bibliothèque de référence pour le machine learning en Python, offrant des algorithmes robustes et bien documentés.

## Concepts de base

**scikit-learn** fournit :
- **Algorithmes ML** : Classification, régression, clustering, etc.
- **Preprocessing** : Normalisation, encodage, etc.
- **Évaluation** : Métriques, validation croisée
- **Pipelines** : Chaînes de traitement

### Pourquoi scikit-learn ?

- **Standard** : Bibliothèque la plus utilisée
- **Robuste** : Algorithmes bien testés
- **Documentation** : Excellente documentation
- **API cohérente** : Interface uniforme

## Installation et configuration

### Installation

```bash
# Installer scikit-learn
pip install scikit-learn

# Ou avec Poetry
poetry add scikit-learn
```

### Import

```python
from sklearn import datasets, model_selection, metrics
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
```

## Pipeline de ML

### Workflow typique

```python
# 1. Charger les données
from sklearn.datasets import load_iris
data = load_iris()
X, y = data.data, data.target

# 2. Diviser en train/test
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 3. Preprocessing
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Entraîner le modèle
from sklearn.linear_model import LogisticRegression
model = LogisticRegression()
model.fit(X_train_scaled, y_train)

# 5. Prédire
y_pred = model.predict(X_test_scaled)

# 6. Évaluer
from sklearn.metrics import accuracy_score
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")
```

## Algorithmes principaux

### Classification

```python
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

# Logistic Regression
model = LogisticRegression()
model.fit(X_train, y_train)

# Decision Tree
model = DecisionTreeClassifier(max_depth=5)
model.fit(X_train, y_train)

# Random Forest
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# SVM
model = SVC(kernel='rbf')
model.fit(X_train, y_train)
```

### Régression

```python
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

# Linear Regression
model = LinearRegression()
model.fit(X_train, y_train)

# Ridge Regression
model = Ridge(alpha=1.0)
model.fit(X_train, y_train)

# Random Forest Regressor
model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)
```

### Clustering

```python
from sklearn.cluster import KMeans, DBSCAN

# K-Means
kmeans = KMeans(n_clusters=3)
clusters = kmeans.fit_predict(X)

# DBSCAN
dbscan = DBSCAN(eps=0.5, min_samples=5)
clusters = dbscan.fit_predict(X)
```

## Évaluation des modèles

### Métriques de classification

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# Métriques
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted')
recall = recall_score(y_test, y_pred, average='weighted')
f1 = f1_score(y_test, y_pred, average='weighted')

# Matrice de confusion
cm = confusion_matrix(y_test, y_pred)
print(cm)
```

### Métriques de régression

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
```

### Validation croisée

```python
from sklearn.model_selection import cross_val_score

# Validation croisée
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"Accuracy: {scores.mean():.2f} (+/- {scores.std() * 2:.2f})")
```

## Preprocessing

### Normalisation

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Standardisation (moyenne=0, std=1)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Normalisation Min-Max (0-1)
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)
```

### Encodage

```python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Label encoding
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# One-hot encoding
ohe = OneHotEncoder()
X_encoded = ohe.fit_transform(X)
```

## Exemples pratiques

### Exemple 1 : Classification simple

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Données
data = load_iris()
X, y = data.data, data.target

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Modèle
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Prédiction
y_pred = model.predict(X_test)

# Évaluation
print(classification_report(y_test, y_pred))
```

### Exemple 2 : Pipeline complet

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

# Pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', LogisticRegression())
])

# Entraîner
pipeline.fit(X_train, y_train)

# Prédire
y_pred = pipeline.predict(X_test)
```

## Points clés à retenir

- ✅ scikit-learn est la **bibliothèque standard** pour ML en Python
- ✅ **API cohérente** : Interface uniforme pour tous les algorithmes
- ✅ **Preprocessing** : Outils pour préparer les données
- ✅ **Évaluation** : Métriques et validation croisée
- ✅ **Pipelines** : Chaînes de traitement automatisées
- ✅ Parfait pour **apprendre et appliquer** le machine learning

scikit-learn est l'outil essentiel pour le machine learning en Python. Son API cohérente et sa documentation complète en font le choix idéal.
