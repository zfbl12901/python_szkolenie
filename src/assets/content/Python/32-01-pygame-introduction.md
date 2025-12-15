---
title: "Pygame - Introduction"
order: 1
parent: "32-jeux-2d.md"
tags: ["python", "games", "pygame", "2d"]
---

# Pygame - Introduction

## Installation

```bash
pip install pygame
```

## Structure de base

```python
import pygame
import sys

# 1. Initialisation
pygame.init()

# 2. Configuration
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Mon Jeu")
clock = pygame.time.Clock()

# 3. Boucle principale
running = True
while running:
    # Gestion des événements
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Logique du jeu
    # ...
    
    # Rendu
    screen.fill((0, 0, 0))
    # Dessiner ici
    pygame.display.flip()
    clock.tick(60)

# 4. Nettoyage
pygame.quit()
sys.exit()
```

## Dessiner des formes

```python
# Rectangle
pygame.draw.rect(screen, (255, 0, 0), (x, y, width, height))

# Cercle
pygame.draw.circle(screen, (0, 255, 0), (x, y), radius)

# Ligne
pygame.draw.line(screen, (0, 0, 255), (x1, y1), (x2, y2), width)
```

## Gestion des entrées

```python
# Clavier
keys = pygame.key.get_pressed()
if keys[pygame.K_SPACE]:
    # Action

# Souris
mouse_pos = pygame.mouse.get_pos()
mouse_buttons = pygame.mouse.get_pressed()
```

## Ressources

- **Documentation** : https://www.pygame.org/docs
- **Tutoriels** : https://www.pygame.org/wiki/tutorials
