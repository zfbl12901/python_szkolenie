---
title: "Développement de Jeux 2D en Python"
order: 32
parent: null
tags: ["python", "games", "2d", "pygame", "arcade"]
---

# Développement de Jeux 2D en Python

## Introduction

Python permet de créer des jeux 2D grâce à des bibliothèques spécialisées. Les plus populaires sont Pygame et Arcade.

## Bibliothèques disponibles

### Pygame
- ✅ Très populaire
- ✅ Nombreuses ressources
- ✅ Communauté active
- ⚠️ API parfois verbeuse

### Arcade
- ✅ Moderne et simple
- ✅ Bonne documentation
- ✅ API claire
- ⚠️ Moins de ressources que Pygame

## Pygame

### Installation

```bash
pip install pygame
```

### Premier jeu : Fenêtre simple

```python
import pygame
import sys

# Initialisation
pygame.init()

# Configuration
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Mon Premier Jeu")
clock = pygame.time.Clock()

# Couleurs
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)

# Boucle principale
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Rendu
    screen.fill(WHITE)
    pygame.draw.circle(screen, RED, (400, 300), 50)
    
    pygame.display.flip()
    clock.tick(60)  # 60 FPS

pygame.quit()
sys.exit()
```

### Jeu complet : Pong simple

```python
import pygame
import sys

pygame.init()

WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong")
clock = pygame.time.Clock()

# Couleurs
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Joueur
player_width, player_height = 20, 100
player_x = 50
player_y = HEIGHT // 2 - player_height // 2
player_speed = 5

# Balle
ball_size = 20
ball_x = WIDTH // 2
ball_y = HEIGHT // 2
ball_speed_x = 5
ball_speed_y = 5

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Contrôles
    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP] and player_y > 0:
        player_y -= player_speed
    if keys[pygame.K_DOWN] and player_y < HEIGHT - player_height:
        player_y += player_speed
    
    # Mouvement de la balle
    ball_x += ball_speed_x
    ball_y += ball_speed_y
    
    # Collisions avec les bords
    if ball_y <= 0 or ball_y >= HEIGHT - ball_size:
        ball_speed_y = -ball_speed_y
    
    if ball_x <= 0 or ball_x >= WIDTH - ball_size:
        ball_speed_x = -ball_speed_x
    
    # Collision avec le joueur
    if (player_x < ball_x < player_x + player_width and
        player_y < ball_y < player_y + player_height):
        ball_speed_x = -ball_speed_x
    
    # Rendu
    screen.fill(BLACK)
    pygame.draw.rect(screen, WHITE, (player_x, player_y, player_width, player_height))
    pygame.draw.circle(screen, WHITE, (ball_x, ball_y), ball_size)
    
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
sys.exit()
```

## Concepts importants

### Sprites

```python
import pygame

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((50, 50))
        self.image.fill((255, 0, 0))
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        self.speed = 5
    
    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]:
            self.rect.x += self.speed
```

### Collisions

```python
# Collision entre sprites
if pygame.sprite.collide_rect(player, enemy):
    # Gérer la collision
    pass

# Collision avec un groupe
collisions = pygame.sprite.spritecollide(player, enemies, True)
```

## Bonnes pratiques

### ✅ À faire

- Utiliser des sprites pour les objets
- Gérer les FPS avec clock.tick()
- Organiser le code en classes
- Séparer la logique du rendu
- Optimiser les performances

### ❌ À éviter

- Tout mettre dans la boucle principale
- Ignorer la gestion des FPS
- Ne pas utiliser de sprites
- Hardcoder les valeurs
- Ignorer les collisions

## Ressources

- **Pygame** : https://www.pygame.org
- **Arcade** : https://api.arcade.academy
- **Tutoriels** : Nombreux tutoriels disponibles
