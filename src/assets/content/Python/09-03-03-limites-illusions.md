---
title: "Limites et illusions"
order: 9.03.03
parent: "09-03-bases-ml.md"
tags: ["python", "ml", "limites", "realisme"]
---

# Limites et illusions

Comprendre les limites du machine learning et éviter les illusions marketing est crucial pour faire des choix réalistes et éviter les déceptions.

## Concepts de base

Le machine learning est un **outil puissant**, mais ce n'est pas de la magie. Il a des limites claires qu'il faut comprendre pour l'utiliser efficacement.

### Pourquoi c'est important

- **Attentes réalistes** : Éviter les déceptions
- **Choix éclairés** : Savoir quand utiliser le ML
- **Éviter le hype** : Distinguer réalité et marketing
- **Éthique** : Comprendre les implications

## Ce que le ML peut faire

### Le ML excelle pour :

1. **Patterns dans les données** : Trouver des corrélations complexes
2. **Prédictions basées sur l'historique** : Si le futur ressemble au passé
3. **Classification automatique** : Catégoriser à grande échelle
4. **Recommandations** : Suggérer basé sur des patterns
5. **Tâches répétitives** : Automatiser des décisions simples

**Exemples réussis** :
- Détection de spam (classification)
- Recommandation de produits (collaborative filtering)
- Reconnaissance d'images (deep learning)
- Prédiction de prix (régression)

## Ce que le ML ne peut pas faire

### Le ML ne peut PAS :

1. **Comprendre le contexte** : Pas de compréhension sémantique réelle
2. **Créer de nouvelles connaissances** : Seulement trouver des patterns existants
3. **Gérer l'inconnu** : Performe mal sur données très différentes
4. **Expliquer ses décisions** : Souvent une "boîte noire"
5. **Remplacer le jugement humain** : Pour décisions complexes/éthiques

**Exemples d'échecs** :
- Prédire des événements uniques (crises, innovations)
- Comprendre la causalité (corrélation ≠ causalité)
- Généraliser hors du domaine d'entraînement
- Expliquer pourquoi une décision a été prise

## Pièges courants

### Piège 1 : Data leakage

**Problème** : Utiliser des informations du futur pour prédire le passé.

```python
# ❌ Mauvais : Data leakage
# Utiliser des données de 2024 pour prédire 2023
df['future_feature'] = df.groupby('id')['target'].shift(-1)  # Fuite !

# ✅ Bon : Pas de fuite
# Utiliser seulement les données disponibles au moment de la prédiction
```

### Piège 2 : Overfitting sur les métriques

**Problème** : Optimiser une métrique qui ne reflète pas le vrai objectif.

```python
# ❌ Mauvais : Accuracy sur données déséquilibrées
# 99% accuracy mais ne détecte jamais la classe rare (1%)

# ✅ Bon : Utiliser F1-score, precision, recall
# Métriques adaptées au problème réel
```

### Piège 3 : Ignorer les biais

**Problème** : Les modèles reproduisent les biais des données d'entraînement.

```python
# Exemple : Modèle de recrutement
# Si les données historiques sont biaisées (genre, origine),
# le modèle reproduira ces biais
```

### Piège 4 : Confondre corrélation et causalité

**Problème** : Le ML trouve des corrélations, pas des causes.

```python
# Exemple : Corrélation ≠ Causalité
# Le modèle trouve : "Acheter des parapluies" corrèle avec "Pluie"
# Mais acheter des parapluies ne CAUSE pas la pluie !
```

## Biais et éthique

### Types de biais

1. **Biais de données** : Données non représentatives
2. **Biais algorithmique** : Algorithme favorise certains groupes
3. **Biais de confirmation** : Chercher ce qu'on veut trouver
4. **Biais de sélection** : Données manquantes non aléatoires

### Considérations éthiques

- **Transparence** : Le modèle peut-il être expliqué ?
- **Équité** : Traite-t-il tous les groupes équitablement ?
- **Privacy** : Respecte-t-il la vie privée ?
- **Responsabilité** : Qui est responsable des erreurs ?

## Approche réaliste

### Quand utiliser le ML

✅ **Bon cas d'usage** :
- Beaucoup de données historiques
- Patterns clairs dans les données
- Tâche répétitive et automatisable
- Erreurs acceptables (pas critique)

❌ **Mauvais cas d'usage** :
- Peu de données
- Besoin de compréhension/explication
- Décisions critiques (médical, légal)
- Besoin de créativité/innovation

### Workflow réaliste

1. **Comprendre le problème** : Le ML est-il approprié ?
2. **Évaluer les données** : Y a-t-il assez de données de qualité ?
3. **Définir le succès** : Qu'est-ce qu'un bon résultat ?
4. **Commencer simple** : Modèle simple d'abord
5. **Itérer** : Améliorer progressivement
6. **Valider** : Tester sur données réelles
7. **Monitorer** : Suivre en production

### Gestion des attentes

```python
# Attentes réalistes
- ML améliore souvent les performances, mais pas toujours
- Les modèles nécessitent maintenance et mise à jour
- Les erreurs sont inévitables
- L'explication peut être difficile
- Les données sont cruciales (garbage in, garbage out)
```

## Points clés à retenir

- ✅ Le ML est un **outil**, pas une solution magique
- ✅ **Limites claires** : Ne peut pas tout faire
- ✅ **Biais** : Les modèles reproduisent les biais des données
- ✅ **Éthique** : Considérations importantes
- ✅ **Attentes réalistes** : Éviter le hype
- ✅ **Bon cas d'usage** : Beaucoup de données, patterns clairs
- ✅ Parfait pour **comprendre les limites** et faire des choix éclairés

Comprendre les limites du ML est essentiel pour l'utiliser efficacement et éviter les déceptions. Le ML est puissant, mais ce n'est pas de la magie.
