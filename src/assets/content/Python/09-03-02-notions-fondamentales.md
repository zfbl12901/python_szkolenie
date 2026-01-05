---
title: "Notions fondamentales"
order: 9.03.02
parent: "09-03-bases-ml.md"
tags: ["python", "ml", "fondamentaux", "concepts"]
---

# Notions fondamentales

Comprendre les concepts fondamentaux du machine learning est essentiel pour utiliser ces outils efficacement et éviter les pièges courants.

## Concepts de base

Le **machine learning** (ML) est une méthode d'analyse de données qui automatise la construction de modèles analytiques. Au lieu d'écrire des règles explicites, on entraîne un modèle à partir de données.

### Types de problèmes

- **Classification** : Prédire une catégorie (ex: spam/non-spam)
- **Régression** : Prédire une valeur numérique (ex: prix d'une maison)
- **Clustering** : Grouper des données similaires
- **Recommandation** : Suggérer des items

## Apprentissage supervisé vs non supervisé

### Apprentissage supervisé

**Avec labels** : Les données d'entraînement incluent les réponses correctes.

```python
# Exemple : Classification
# Données : emails avec labels (spam/non-spam)
# Objectif : Prédire si un nouvel email est spam

from sklearn.linear_model import LogisticRegression

# X : features (mots, fréquence, etc.)
# y : labels (spam=1, non-spam=0)
model = LogisticRegression()
model.fit(X_train, y_train)  # Apprendre des exemples
predictions = model.predict(X_test)  # Prédire sur nouvelles données
```

**Cas d'usage** :
- Classification d'images
- Prédiction de prix
- Détection de fraude
- Recommandation

### Apprentissage non supervisé

**Sans labels** : Les données n'ont pas de réponses correctes, on cherche des patterns.

```python
# Exemple : Clustering
# Données : caractéristiques de clients
# Objectif : Grouper les clients similaires

from sklearn.cluster import KMeans

# X : features (âge, revenu, etc.)
# Pas de y (pas de labels)
kmeans = KMeans(n_clusters=3)
clusters = kmeans.fit_predict(X)  # Trouve des groupes
```

**Cas d'usage** :
- Segmentation de clients
- Détection d'anomalies
- Réduction de dimensionnalité

## Overfitting et underfitting

### Overfitting (surapprentissage)

Le modèle **mémorise** les données d'entraînement au lieu d'apprendre des patterns généraux.

**Symptômes** :
- Performance excellente sur les données d'entraînement
- Performance médiocre sur les nouvelles données
- Modèle trop complexe

**Solutions** :
- Réduire la complexité du modèle
- Augmenter les données d'entraînement
- Régularisation (L1, L2)
- Validation croisée

```python
# Exemple d'overfitting
from sklearn.tree import DecisionTreeClassifier

# Modèle trop complexe (profondeur maximale)
model_overfit = DecisionTreeClassifier(max_depth=None)  # Trop profond
model_overfit.fit(X_train, y_train)

# Bon modèle (profondeur limitée)
model_good = DecisionTreeClassifier(max_depth=5)  # Limité
model_good.fit(X_train, y_train)
```

### Underfitting (sous-apprentissage)

Le modèle est **trop simple** pour capturer les patterns dans les données.

**Symptômes** :
- Performance médiocre sur les données d'entraînement
- Performance médiocre sur les nouvelles données
- Modèle trop simple

**Solutions** :
- Augmenter la complexité du modèle
- Ajouter des features
- Réduire la régularisation

```python
# Exemple d'underfitting
from sklearn.linear_model import LinearRegression

# Modèle trop simple pour données non-linéaires
model_underfit = LinearRegression()
model_underfit.fit(X_train, y_train)  # Ne capture pas les patterns complexes
```

## Validation croisée

### Principe

Diviser les données en plusieurs parties, entraîner sur certaines et tester sur d'autres.

```python
from sklearn.model_selection import cross_val_score, KFold

# K-Fold Cross-Validation (K=5)
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=kfold, scoring='accuracy')

print(f"Accuracy: {scores.mean():.2f} (+/- {scores.std() * 2:.2f})")
```

### Train/Validation/Test Split

```python
from sklearn.model_selection import train_test_split

# 1. Split initial : Train + Test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 2. Split Train : Train + Validation
X_train_final, X_val, y_train_final, y_val = train_test_split(
    X_train, y_train, test_size=0.2, random_state=42
)

# Utilisation :
# - Train : Entraîner le modèle
# - Validation : Ajuster les hyperparamètres
# - Test : Évaluer la performance finale
```

## Métriques d'évaluation

### Classification

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Accuracy : Pourcentage de prédictions correctes
accuracy = accuracy_score(y_test, y_pred)

# Precision : Parmi les prédictions positives, combien sont correctes
precision = precision_score(y_test, y_pred)

# Recall : Parmi les vrais positifs, combien sont détectés
recall = recall_score(y_test, y_pred)

# F1-Score : Moyenne harmonique de precision et recall
f1 = f1_score(y_test, y_pred)
```

### Régression

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# MSE : Erreur quadratique moyenne
mse = mean_squared_error(y_test, y_pred)

# MAE : Erreur absolue moyenne
mae = mean_absolute_error(y_test, y_pred)

# R² : Coefficient de détermination (proche de 1 = bon)
r2 = r2_score(y_test, y_pred)
```

## Feature engineering

### Création de features

```python
import pandas as pd

# Features dérivées
df['feature_squared'] = df['feature'] ** 2
df['feature_log'] = np.log(df['feature'] + 1)
df['feature_ratio'] = df['feature1'] / df['feature2']

# Features catégorielles
df['category_encoded'] = pd.get_dummies(df['category'])

# Features temporelles
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day_of_week'] = df['date'].dt.dayofweek
```

### Sélection de features

```python
from sklearn.feature_selection import SelectKBest, f_classif

# Sélectionner les K meilleures features
selector = SelectKBest(f_classif, k=10)
X_selected = selector.fit_transform(X, y)
```

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

## Points clés à retenir

- ✅ **Supervisé** : Avec labels, **Non supervisé** : Sans labels
- ✅ **Overfitting** : Modèle trop complexe, mémorise les données
- ✅ **Underfitting** : Modèle trop simple, ne capture pas les patterns
- ✅ **Validation croisée** : Évaluer la performance de manière robuste
- ✅ **Métriques** : Choisir selon le problème (classification vs régression)
- ✅ **Feature engineering** : Créer et sélectionner les bonnes features
- ✅ Parfait pour **comprendre les fondamentaux** du ML

Comprendre ces concepts fondamentaux est essentiel pour utiliser efficacement le machine learning et éviter les pièges courants.
