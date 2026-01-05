---
title: "Matplotlib"
order: 9.02.01
parent: "09-02-visualisation.md"
tags: ["python", "matplotlib", "visualisation", "graphiques"]
---

# Matplotlib

Matplotlib est la bibliothèque de référence pour créer des visualisations statiques en Python. C'est la base de nombreuses autres bibliothèques de visualisation.

## Concepts de base

**Matplotlib** fournit :
- **Graphiques statiques** : Ligne, barre, scatter, histogramme, etc.
- **Personnalisation complète** : Contrôle total sur tous les aspects
- **Publication-ready** : Graphiques de qualité pour publications
- **Backend flexible** : Affichage interactif ou fichiers

### Pourquoi Matplotlib ?

- **Standard** : Bibliothèque la plus utilisée
- **Flexible** : Contrôle total sur le rendu
- **Compatible** : Fonctionne avec NumPy, Pandas
- **Documentation** : Excellente documentation et exemples

## Installation et configuration

### Installation

```bash
# Installer Matplotlib
pip install matplotlib

# Ou avec Poetry
poetry add matplotlib
```

### Import conventionnel

```python
import matplotlib.pyplot as plt
import numpy as np
```

## Types de graphiques

### Graphique en ligne

```python
import matplotlib.pyplot as plt
import numpy as np

# Données
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Créer le graphique
plt.figure(figsize=(10, 6))
plt.plot(x, y, label='sin(x)')
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Graphique sinusoïdal')
plt.legend()
plt.grid(True)
plt.show()
```

### Graphique en barres

```python
# Données
categories = ['A', 'B', 'C', 'D']
values = [23, 45, 56, 78]

# Graphique en barres
plt.figure(figsize=(8, 6))
plt.bar(categories, values, color='steelblue')
plt.xlabel('Catégories')
plt.ylabel('Valeurs')
plt.title('Graphique en barres')
plt.show()

# Barres horizontales
plt.barh(categories, values)
```

### Nuage de points (Scatter)

```python
# Données
x = np.random.randn(100)
y = np.random.randn(100)
colors = np.random.rand(100)
sizes = 1000 * np.random.rand(100)

# Nuage de points
plt.figure(figsize=(10, 6))
plt.scatter(x, y, c=colors, s=sizes, alpha=0.5, cmap='viridis')
plt.colorbar(label='Intensité')
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Nuage de points')
plt.show()
```

### Histogramme

```python
# Données
data = np.random.normal(100, 15, 1000)

# Histogramme
plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, color='skyblue', edgecolor='black')
plt.xlabel('Valeur')
plt.ylabel('Fréquence')
plt.title('Histogramme')
plt.show()
```

### Graphique en aires

```python
# Données
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# Graphique en aires
plt.figure(figsize=(10, 6))
plt.fill_between(x, y1, alpha=0.5, label='sin(x)')
plt.fill_between(x, y2, alpha=0.5, label='cos(x)')
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Graphique en aires')
plt.legend()
plt.show()
```

### Graphique circulaire (Pie)

```python
# Données
labels = ['A', 'B', 'C', 'D']
sizes = [15, 30, 45, 10]
colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99']

# Graphique circulaire
plt.figure(figsize=(8, 8))
plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90)
plt.title('Graphique circulaire')
plt.axis('equal')
plt.show()
```

## Personnalisation

### Styles et couleurs

```python
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))

# Différents styles de ligne
plt.plot(x, y, linestyle='-', linewidth=2, color='blue', label='Ligne solide')
plt.plot(x, y + 1, linestyle='--', linewidth=2, color='red', label='Ligne pointillée')
plt.plot(x, y + 2, linestyle='-.', linewidth=2, color='green', label='Ligne tiret-point')
plt.plot(x, y + 3, linestyle=':', linewidth=2, color='orange', label='Ligne pointillée')

# Marqueurs
plt.plot(x, y + 4, marker='o', markersize=5, label='Avec marqueurs')

plt.legend()
plt.show()
```

### Axes et grille

```python
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y)

# Personnaliser les axes
plt.xlim(0, 10)
plt.ylim(-1.5, 1.5)
plt.xlabel('X axis', fontsize=12, fontweight='bold')
plt.ylabel('Y axis', fontsize=12, fontweight='bold')

# Grille
plt.grid(True, linestyle='--', alpha=0.5)

# Ticks personnalisés
plt.xticks([0, 2, 4, 6, 8, 10])
plt.yticks([-1, 0, 1])

plt.show()
```

### Annotations

```python
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y)

# Annotation
plt.annotate('Maximum', xy=(np.pi/2, 1), xytext=(4, 1.5),
            arrowprops=dict(arrowstyle='->', color='red'),
            fontsize=12, color='red')

# Texte
plt.text(7, 0.5, 'Zone intéressante', fontsize=12,
         bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

plt.show()
```

## Subplots et layouts

### Subplots multiples

```python
# Créer une figure avec plusieurs subplots
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Graphique 1
axes[0, 0].plot([1, 2, 3, 4], [1, 4, 9, 16], 'ro-')
axes[0, 0].set_title('Graphique 1')
axes[0, 0].set_xlabel('X')
axes[0, 0].set_ylabel('Y')

# Graphique 2
axes[0, 1].bar(['A', 'B', 'C'], [3, 7, 2])
axes[0, 1].set_title('Graphique 2')

# Graphique 3
x = np.linspace(0, 10, 100)
axes[1, 0].plot(x, np.sin(x))
axes[1, 0].set_title('Graphique 3')

# Graphique 4
data = np.random.normal(100, 15, 1000)
axes[1, 1].hist(data, bins=30)
axes[1, 1].set_title('Graphique 4')

plt.tight_layout()
plt.show()
```

### Subplots avec partage d'axes

```python
fig, axes = plt.subplots(2, 1, figsize=(10, 8), sharex=True)

x = np.linspace(0, 10, 100)
axes[0].plot(x, np.sin(x))
axes[0].set_ylabel('sin(x)')
axes[0].set_title('Graphiques partageant l\'axe X')

axes[1].plot(x, np.cos(x))
axes[1].set_xlabel('X')
axes[1].set_ylabel('cos(x)')

plt.tight_layout()
plt.show()
```

### GridSpec pour layouts complexes

```python
from matplotlib.gridspec import GridSpec

fig = plt.figure(figsize=(12, 8))
gs = GridSpec(3, 3, figure=fig)

# Graphique principal (2x2)
ax1 = fig.add_subplot(gs[0:2, 0:2])
ax1.plot([1, 2, 3, 4], [1, 4, 9, 16])

# Graphique latéral (2x1)
ax2 = fig.add_subplot(gs[0:2, 2])
ax2.bar(['A', 'B'], [3, 7])

# Graphique en bas (1x2)
ax3 = fig.add_subplot(gs[2, 0:2])
ax3.hist(np.random.randn(1000), bins=30)

plt.tight_layout()
plt.show()
```

## Intégration avec Pandas

### Graphiques depuis DataFrame

```python
import pandas as pd
import matplotlib.pyplot as plt

# Données
df = pd.DataFrame({
    'mois': ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    'ventes': [100, 150, 200, 180, 220]
})

# Graphique depuis DataFrame
df.plot(x='mois', y='ventes', kind='bar', figsize=(10, 6))
plt.title('Ventes par mois')
plt.ylabel('Ventes')
plt.show()

# Plusieurs colonnes
df2 = pd.DataFrame({
    'mois': ['Jan', 'Feb', 'Mar', 'Apr'],
    'produit_A': [100, 120, 140, 160],
    'produit_B': [80, 100, 120, 140]
})
df2.plot(x='mois', y=['produit_A', 'produit_B'], kind='line', figsize=(10, 6))
plt.show()
```

## Sauvegarde de graphiques

```python
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y)
plt.title('Graphique à sauvegarder')

# Sauvegarder
plt.savefig('graphique.png', dpi=300, bbox_inches='tight')
plt.savefig('graphique.pdf', bbox_inches='tight')
plt.savefig('graphique.svg', bbox_inches='tight')

plt.show()
```

## Styles prédéfinis

```python
# Voir les styles disponibles
print(plt.style.available)

# Appliquer un style
plt.style.use('seaborn-v0_8-darkgrid')

x = np.linspace(0, 10, 100)
plt.figure(figsize=(10, 6))
plt.plot(x, np.sin(x), label='sin(x)')
plt.plot(x, np.cos(x), label='cos(x)')
plt.legend()
plt.show()

# Réinitialiser le style
plt.style.use('default')
```

## Exemples pratiques

### Exemple 1 : Analyse de tendances

```python
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Données temporelles
dates = pd.date_range('2024-01-01', periods=30, freq='D')
values = np.random.randn(30).cumsum()

# Graphique avec tendance
plt.figure(figsize=(12, 6))
plt.plot(dates, values, marker='o', label='Valeurs')
plt.axhline(y=0, color='r', linestyle='--', alpha=0.5)
plt.xlabel('Date')
plt.ylabel('Valeur')
plt.title('Tendance temporelle')
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

### Exemple 2 : Comparaison multiple

```python
# Données
categories = ['Q1', 'Q2', 'Q3', 'Q4']
product_A = [100, 120, 140, 160]
product_B = [80, 100, 120, 140]
product_C = [90, 110, 130, 150]

x = np.arange(len(categories))
width = 0.25

# Graphique en barres groupées
plt.figure(figsize=(10, 6))
plt.bar(x - width, product_A, width, label='Produit A')
plt.bar(x, product_B, width, label='Produit B')
plt.bar(x + width, product_C, width, label='Produit C')

plt.xlabel('Trimestre')
plt.ylabel('Ventes')
plt.title('Ventes par produit et trimestre')
plt.xticks(x, categories)
plt.legend()
plt.show()
```

## Bonnes pratiques

### 1. Taille et résolution

```python
# ✅ Bon : Taille appropriée
plt.figure(figsize=(10, 6))  # Largeur, hauteur en pouces

# ✅ Bon : Haute résolution pour publication
plt.savefig('graphique.png', dpi=300)
```

### 2. Labels et titres clairs

```python
# ✅ Bon : Labels descriptifs
plt.xlabel('Temps (secondes)', fontsize=12)
plt.ylabel('Amplitude', fontsize=12)
plt.title('Signal temporel', fontsize=14, fontweight='bold')
```

### 3. Légendes

```python
# ✅ Bon : Légende claire
plt.plot(x, y1, label='Données expérimentales')
plt.plot(x, y2, label='Modèle théorique')
plt.legend(loc='best', frameon=True, shadow=True)
```

## Points clés à retenir

- ✅ Matplotlib est la **bibliothèque de base** pour visualisation
- ✅ **Contrôle total** : Personnalisation complète
- ✅ **Types variés** : Ligne, barre, scatter, histogramme, etc.
- ✅ **Subplots** : Créer des layouts complexes
- ✅ **Intégration** : Compatible avec NumPy et Pandas
- ✅ **Publication-ready** : Export haute qualité
- ✅ Parfait pour **visualisations statiques** et personnalisées

Matplotlib est l'outil de référence pour créer des visualisations en Python. Sa flexibilité et son contrôle total en font le choix idéal pour des graphiques personnalisés.
