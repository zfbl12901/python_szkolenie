---
title: "Seaborn"
order: 9.02.02
parent: "09-02-visualisation.md"
tags: ["python", "seaborn", "visualisation", "statistique"]
---

# Seaborn

Seaborn est une bibliothèque de visualisation statistique construite sur Matplotlib, offrant des graphiques élégants et informatifs avec moins de code.

## Concepts de base

**Seaborn** fournit :
- **Graphiques statistiques** : Optimisés pour l'analyse de données
- **Styles élégants** : Thèmes par défaut attrayants
- **Intégration Pandas** : Fonctionne naturellement avec DataFrames
- **Visualisations avancées** : Heatmaps, pair plots, etc.

### Pourquoi Seaborn ?

- **Simplicité** : Moins de code que Matplotlib
- **Statistique** : Graphiques optimisés pour l'analyse
- **Esthétique** : Styles par défaut élégants
- **Pandas** : Intégration native avec DataFrames

## Installation et configuration

### Installation

```bash
# Installer Seaborn
pip install seaborn

# Ou avec Poetry
poetry add seaborn
```

### Import et configuration

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

# Définir le style
sns.set_style("whitegrid")
sns.set_palette("husl")
```

## Visualisations statistiques

### Distribution (distplot)

```python
import seaborn as sns
import numpy as np

# Données
data = np.random.normal(100, 15, 1000)

# Distribution
sns.displot(data, kde=True, bins=30)
plt.title('Distribution des données')
plt.show()

# Avec DataFrame
df = pd.DataFrame({'values': data})
sns.displot(df, x='values', kde=True)
plt.show()
```

### Graphique de régression (regplot)

```python
import seaborn as sns
import numpy as np

# Données
x = np.linspace(0, 10, 100)
y = x + np.random.randn(100) * 2

# Graphique de régression
sns.regplot(x=x, y=y, scatter=True, ci=95)
plt.title('Régression linéaire')
plt.show()

# Avec DataFrame
df = pd.DataFrame({'x': x, 'y': y})
sns.regplot(data=df, x='x', y='y')
plt.show()
```

### Box plot

```python
import seaborn as sns
import pandas as pd

# Données
df = pd.DataFrame({
    'catégorie': ['A'] * 50 + ['B'] * 50 + ['C'] * 50,
    'valeur': np.concatenate([
        np.random.normal(10, 2, 50),
        np.random.normal(15, 3, 50),
        np.random.normal(12, 2, 50)
    ])
})

# Box plot
sns.boxplot(data=df, x='catégorie', y='valeur')
plt.title('Box plot par catégorie')
plt.show()
```

### Violin plot

```python
# Violin plot (combine box plot et distribution)
sns.violinplot(data=df, x='catégorie', y='valeur')
plt.title('Violin plot')
plt.show()
```

### Heatmap

```python
import seaborn as sns
import numpy as np

# Matrice de corrélation
data = np.random.randn(100, 5)
df = pd.DataFrame(data, columns=['A', 'B', 'C', 'D', 'E'])
correlation = df.corr()

# Heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(correlation, annot=True, cmap='coolwarm', center=0,
            square=True, linewidths=1, cbar_kws={"shrink": 0.8})
plt.title('Matrice de corrélation')
plt.tight_layout()
plt.show()
```

### Pair plot

```python
import seaborn as sns
import pandas as pd

# Données
df = pd.DataFrame({
    'x1': np.random.randn(100),
    'x2': np.random.randn(100),
    'x3': np.random.randn(100),
    'catégorie': np.random.choice(['A', 'B'], 100)
})

# Pair plot
sns.pairplot(df, hue='catégorie', diag_kind='kde')
plt.show()
```

## Styles et thèmes

### Styles disponibles

```python
# Styles
sns.set_style("whitegrid")    # Grille blanche
sns.set_style("darkgrid")     # Grille sombre
sns.set_style("white")        # Blanc
sns.set_style("dark")         # Sombre
sns.set_style("ticks")        # Avec ticks
```

### Palettes de couleurs

```python
# Palettes
sns.set_palette("husl")       # Palette HUSL
sns.set_palette("Set2")       # Palette Set2
sns.set_palette("viridis")    # Palette Viridis

# Palette personnalisée
custom_palette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"]
sns.set_palette(custom_palette)
```

### Contexte

```python
# Contexte (taille des éléments)
sns.set_context("paper")      # Petit (pour papiers)
sns.set_context("notebook")   # Moyen (défaut)
sns.set_context("talk")        # Grand (pour présentations)
sns.set_context("poster")     # Très grand (pour posters)
```

## Intégration avec Pandas

### Graphiques depuis DataFrame

```python
import seaborn as sns
import pandas as pd
import numpy as np

# Données
df = pd.DataFrame({
    'mois': ['Jan', 'Feb', 'Mar', 'Apr', 'May'] * 20,
    'produit': ['A', 'B'] * 50,
    'ventes': np.random.randint(50, 200, 100)
})

# Graphique en barres
sns.barplot(data=df, x='mois', y='ventes', hue='produit')
plt.title('Ventes par mois et produit')
plt.show()

# Graphique en ligne
sns.lineplot(data=df, x='mois', y='ventes', hue='produit', marker='o')
plt.title('Tendance des ventes')
plt.show()
```

### Catplot (graphiques catégoriels)

```python
# Catplot flexible
sns.catplot(data=df, x='mois', y='ventes', hue='produit', 
            kind='bar', col='produit', height=4, aspect=1)
plt.show()
```

## Visualisations avancées

### Joint plot

```python
import seaborn as sns
import numpy as np

# Données corrélées
x = np.random.randn(100)
y = x + np.random.randn(100) * 0.5

# Joint plot
sns.jointplot(x=x, y=y, kind='scatter', marginal_kws=dict(bins=20))
plt.show()

# Avec régression
sns.jointplot(x=x, y=y, kind='reg')
plt.show()
```

### FacetGrid

```python
import seaborn as sns
import pandas as pd

# Données
df = pd.DataFrame({
    'x': np.random.randn(200),
    'y': np.random.randn(200),
    'catégorie': np.random.choice(['A', 'B', 'C'], 200),
    'sous_catégorie': np.random.choice(['X', 'Y'], 200)
})

# FacetGrid
g = sns.FacetGrid(df, col='catégorie', row='sous_catégorie', height=3)
g.map(plt.scatter, 'x', 'y', alpha=0.5)
g.add_legend()
plt.show()
```

### Clustermap

```python
import seaborn as sns
import numpy as np

# Données
data = np.random.randn(10, 12)
df = pd.DataFrame(data)

# Clustermap (heatmap avec clustering)
sns.clustermap(df, cmap='viridis', figsize=(10, 8))
plt.show()
```

## Exemples pratiques

### Exemple 1 : Analyse de corrélation

```python
import seaborn as sns
import pandas as pd
import numpy as np

# Données avec corrélations
np.random.seed(42)
data = {
    'ventes': np.random.randint(100, 500, 100),
    'prix': np.random.uniform(10, 50, 100),
    'pub': np.random.randint(0, 100, 100),
    'satisfaction': np.random.uniform(1, 5, 100)
}
df = pd.DataFrame(data)

# Matrice de corrélation
corr = df.corr()

# Heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(corr, annot=True, cmap='RdYlBu', center=0,
            square=True, linewidths=2, cbar_kws={"shrink": 0.8})
plt.title('Corrélations entre variables')
plt.tight_layout()
plt.show()
```

### Exemple 2 : Comparaison de distributions

```python
# Données
df = pd.DataFrame({
    'groupe': ['A'] * 100 + ['B'] * 100 + ['C'] * 100,
    'valeur': np.concatenate([
        np.random.normal(10, 2, 100),
        np.random.normal(15, 3, 100),
        np.random.normal(12, 2, 100)
    ])
})

# Comparaison avec violin plot
plt.figure(figsize=(10, 6))
sns.violinplot(data=df, x='groupe', y='valeur', inner='box')
plt.title('Distribution par groupe')
plt.show()
```

### Exemple 3 : Analyse temporelle

```python
# Données temporelles
dates = pd.date_range('2024-01-01', periods=100, freq='D')
df = pd.DataFrame({
    'date': dates,
    'valeur': np.random.randn(100).cumsum(),
    'catégorie': np.random.choice(['A', 'B'], 100)
})

# Graphique temporel
plt.figure(figsize=(12, 6))
sns.lineplot(data=df, x='date', y='valeur', hue='catégorie', marker='o')
plt.title('Évolution temporelle')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

## Bonnes pratiques

### 1. Utilisez les styles Seaborn

```python
# ✅ Bon : Style Seaborn
sns.set_style("whitegrid")
sns.barplot(data=df, x='x', y='y')

# ❌ Éviter : Style Matplotlib basique
plt.bar(df['x'], df['y'])
```

### 2. Exploitez l'intégration Pandas

```python
# ✅ Bon : Directement depuis DataFrame
sns.scatterplot(data=df, x='x', y='y', hue='catégorie')

# ❌ Éviter : Extraction manuelle
x = df['x'].values
y = df['y'].values
plt.scatter(x, y)
```

### 3. Utilisez les palettes appropriées

```python
# ✅ Bon : Palette adaptée au nombre de catégories
sns.set_palette("Set2")  # Pour 2-8 catégories
sns.barplot(data=df, x='x', y='y', hue='catégorie')
```

## Points clés à retenir

- ✅ Seaborn est **construit sur Matplotlib** mais plus simple
- ✅ **Graphiques statistiques** : Optimisés pour l'analyse
- ✅ **Styles élégants** : Thèmes par défaut attrayants
- ✅ **Intégration Pandas** : Fonctionne naturellement avec DataFrames
- ✅ **Moins de code** : Syntaxe plus concise que Matplotlib
- ✅ **Visualisations avancées** : Heatmaps, pair plots, etc.
- ✅ Parfait pour **analyse exploratoire** et visualisations statistiques

Seaborn est idéal pour créer rapidement des visualisations statistiques élégantes. Sa simplicité et son intégration avec Pandas en font un excellent choix pour l'exploration de données.
