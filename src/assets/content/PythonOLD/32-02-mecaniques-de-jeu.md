---
title: "Mécaniques de Jeu (Mouvement, Collisions)"
order: 2
parent: "32-jeux-2d.md"
tags: ["python", "games", "mechanics", "physics", "collision"]
---

# Mécaniques de Jeu (Mouvement, Collisions)

## Introduction

Les mécaniques de jeu sont le cœur de l'expérience ludique. Elles définissent comment les objets se déplacent, interagissent et répondent aux actions du joueur. Ce module couvre les concepts essentiels : mouvement, physique simplifiée, détection et résolution des collisions.

## Mouvement de base

### Mouvement par vélocité

Le concept fondamental est de séparer la **position** et la **vélocité** (vitesse vectorielle).

```python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

class Player:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.vel_x = 0
        self.vel_y = 0
        self.speed = 300  # Pixels par seconde
        self.size = 40
    
    def update(self, dt, keys):
        # Réinitialiser la vélocité
        self.vel_x = 0
        self.vel_y = 0
        
        # Input -> Vélocité
        if keys[pygame.K_LEFT]:
            self.vel_x = -self.speed
        if keys[pygame.K_RIGHT]:
            self.vel_x = self.speed
        if keys[pygame.K_UP]:
            self.vel_y = -self.speed
        if keys[pygame.K_DOWN]:
            self.vel_y = self.speed
        
        # Appliquer la vélocité à la position
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt
        
        # Limiter aux bords de l'écran
        self.x = max(0, min(800 - self.size, self.x))
        self.y = max(0, min(600 - self.size, self.y))
    
    def draw(self, surface):
        pygame.draw.rect(surface, (0, 200, 255), 
                        (int(self.x), int(self.y), self.size, self.size))

# Boucle de jeu
player = Player(380, 280)
running = True

while running:
    dt = clock.tick(60) / 1000.0
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    keys = pygame.key.get_pressed()
    player.update(dt, keys)
    
    screen.fill((30, 30, 30))
    player.draw(screen)
    pygame.display.flip()

pygame.quit()
sys.exit()
```

### Mouvement avec accélération et friction

Pour un mouvement plus réaliste, ajoutons l'accélération et la friction.

```python
import pygame
import math

class SmoothPlayer:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.vel_x = 0.0
        self.vel_y = 0.0
        
        # Paramètres de mouvement
        self.acceleration = 800    # Force d'accélération
        self.friction = 6.0        # Coefficient de friction
        self.max_speed = 400       # Vitesse maximale
        
        self.size = 40
    
    def update(self, dt, keys):
        # Calculer l'accélération d'entrée
        accel_x = 0
        accel_y = 0
        
        if keys[pygame.K_LEFT]:
            accel_x -= self.acceleration
        if keys[pygame.K_RIGHT]:
            accel_x += self.acceleration
        if keys[pygame.K_UP]:
            accel_y -= self.acceleration
        if keys[pygame.K_DOWN]:
            accel_y += self.acceleration
        
        # Normaliser la diagonale pour éviter vitesse x√2
        if accel_x != 0 and accel_y != 0:
            factor = 1 / math.sqrt(2)
            accel_x *= factor
            accel_y *= factor
        
        # Appliquer l'accélération
        self.vel_x += accel_x * dt
        self.vel_y += accel_y * dt
        
        # Appliquer la friction (quand pas d'input)
        if accel_x == 0:
            self.vel_x *= (1 - self.friction * dt)
        if accel_y == 0:
            self.vel_y *= (1 - self.friction * dt)
        
        # Limiter la vitesse maximale
        speed = math.sqrt(self.vel_x ** 2 + self.vel_y ** 2)
        if speed > self.max_speed:
            factor = self.max_speed / speed
            self.vel_x *= factor
            self.vel_y *= factor
        
        # Appliquer la vélocité
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt
        
        # Limiter aux bords
        self.x = max(0, min(800 - self.size, self.x))
        self.y = max(0, min(600 - self.size, self.y))
        
        # Arrêt complet si très lent
        if abs(self.vel_x) < 1:
            self.vel_x = 0
        if abs(self.vel_y) < 1:
            self.vel_y = 0
    
    def draw(self, surface):
        # Corps
        pygame.draw.rect(surface, (0, 200, 255), 
                        (int(self.x), int(self.y), self.size, self.size))
        
        # Indicateur de vélocité
        center_x = self.x + self.size / 2
        center_y = self.y + self.size / 2
        end_x = center_x + self.vel_x / 10
        end_y = center_y + self.vel_y / 10
        pygame.draw.line(surface, (255, 255, 0), 
                        (center_x, center_y), (end_x, end_y), 2)
```

### Mouvement 8 directions avec animations

```python
import pygame
from enum import Enum

class Direction(Enum):
    NONE = 0
    UP = 1
    DOWN = 2
    LEFT = 3
    RIGHT = 4
    UP_LEFT = 5
    UP_RIGHT = 6
    DOWN_LEFT = 7
    DOWN_RIGHT = 8

class DirectionalPlayer:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.speed = 200
        self.direction = Direction.DOWN
        self.is_moving = False
        self.size = 40
    
    def update(self, dt, keys):
        dx = 0
        dy = 0
        
        if keys[pygame.K_LEFT]:
            dx -= 1
        if keys[pygame.K_RIGHT]:
            dx += 1
        if keys[pygame.K_UP]:
            dy -= 1
        if keys[pygame.K_DOWN]:
            dy += 1
        
        # Déterminer la direction
        self.is_moving = dx != 0 or dy != 0
        
        if self.is_moving:
            if dx == 0 and dy == -1:
                self.direction = Direction.UP
            elif dx == 0 and dy == 1:
                self.direction = Direction.DOWN
            elif dx == -1 and dy == 0:
                self.direction = Direction.LEFT
            elif dx == 1 and dy == 0:
                self.direction = Direction.RIGHT
            elif dx == -1 and dy == -1:
                self.direction = Direction.UP_LEFT
            elif dx == 1 and dy == -1:
                self.direction = Direction.UP_RIGHT
            elif dx == -1 and dy == 1:
                self.direction = Direction.DOWN_LEFT
            elif dx == 1 and dy == 1:
                self.direction = Direction.DOWN_RIGHT
            
            # Normaliser et déplacer
            length = (dx ** 2 + dy ** 2) ** 0.5
            if length > 0:
                dx /= length
                dy /= length
                self.x += dx * self.speed * dt
                self.y += dy * self.speed * dt
    
    def get_direction_vector(self):
        """Retourne un vecteur unitaire dans la direction courante"""
        vectors = {
            Direction.UP: (0, -1),
            Direction.DOWN: (0, 1),
            Direction.LEFT: (-1, 0),
            Direction.RIGHT: (1, 0),
            Direction.UP_LEFT: (-0.707, -0.707),
            Direction.UP_RIGHT: (0.707, -0.707),
            Direction.DOWN_LEFT: (-0.707, 0.707),
            Direction.DOWN_RIGHT: (0.707, 0.707),
            Direction.NONE: (0, 0)
        }
        return vectors.get(self.direction, (0, 0))
    
    def draw(self, surface):
        color = (0, 255, 0) if self.is_moving else (255, 0, 0)
        pygame.draw.rect(surface, color, 
                        (int(self.x), int(self.y), self.size, self.size))
        
        # Dessiner la direction
        cx = self.x + self.size / 2
        cy = self.y + self.size / 2
        dx, dy = self.get_direction_vector()
        end_x = cx + dx * 30
        end_y = cy + dy * 30
        pygame.draw.line(surface, (255, 255, 255), (cx, cy), (end_x, end_y), 3)
```

## Physique simplifiée

### Gravité et saut

```python
import pygame

class PlatformerPlayer:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.vel_x = 0
        self.vel_y = 0
        
        # Paramètres de mouvement
        self.speed = 200
        self.jump_force = -400    # Force du saut (négative car Y va vers le bas)
        self.gravity = 1000       # Accélération gravitationnelle
        self.max_fall_speed = 600 # Vitesse de chute maximale
        
        # État
        self.on_ground = False
        self.can_double_jump = True
        
        self.width = 40
        self.height = 60
    
    def update(self, dt, keys, platforms):
        # Mouvement horizontal
        self.vel_x = 0
        if keys[pygame.K_LEFT]:
            self.vel_x = -self.speed
        if keys[pygame.K_RIGHT]:
            self.vel_x = self.speed
        
        # Appliquer la gravité
        self.vel_y += self.gravity * dt
        self.vel_y = min(self.vel_y, self.max_fall_speed)
        
        # Déplacement
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt
        
        # Collision avec les plateformes
        self.on_ground = False
        player_rect = pygame.Rect(self.x, self.y, self.width, self.height)
        
        for platform in platforms:
            if player_rect.colliderect(platform):
                # Collision par le bas (atterrissage)
                if self.vel_y > 0:
                    self.y = platform.top - self.height
                    self.vel_y = 0
                    self.on_ground = True
                    self.can_double_jump = True
                # Collision par le haut (tête)
                elif self.vel_y < 0:
                    self.y = platform.bottom
                    self.vel_y = 0
    
    def jump(self):
        if self.on_ground:
            self.vel_y = self.jump_force
            self.on_ground = False
        elif self.can_double_jump:
            self.vel_y = self.jump_force * 0.8  # Double saut plus faible
            self.can_double_jump = False
    
    def draw(self, surface):
        color = (0, 255, 0) if self.on_ground else (255, 255, 0)
        pygame.draw.rect(surface, color, 
                        (int(self.x), int(self.y), self.width, self.height))

# Exemple d'utilisation
pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

player = PlatformerPlayer(100, 400)

# Plateformes
platforms = [
    pygame.Rect(0, 550, 800, 50),    # Sol
    pygame.Rect(150, 450, 200, 20),  # Plateforme 1
    pygame.Rect(450, 350, 200, 20),  # Plateforme 2
    pygame.Rect(200, 250, 200, 20),  # Plateforme 3
]

running = True
while running:
    dt = clock.tick(60) / 1000.0
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                player.jump()
    
    keys = pygame.key.get_pressed()
    player.update(dt, keys, platforms)
    
    # Rendu
    screen.fill((30, 30, 50))
    
    for platform in platforms:
        pygame.draw.rect(screen, (100, 100, 100), platform)
    
    player.draw(screen)
    
    # Affichage debug
    font = pygame.font.Font(None, 30)
    debug_text = f"Vel Y: {player.vel_y:.0f} | On Ground: {player.on_ground}"
    text = font.render(debug_text, True, (255, 255, 255))
    screen.blit(text, (10, 10))
    
    pygame.display.flip()

pygame.quit()
```

### Saut avec "Coyote Time" et Input Buffering

Techniques avancées pour un saut plus réactif :

```python
class AdvancedPlatformerPlayer:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.vel_x = 0
        self.vel_y = 0
        
        # Paramètres de mouvement
        self.speed = 250
        self.jump_force = -450
        self.gravity = 1200
        self.max_fall_speed = 700
        
        # État
        self.on_ground = False
        
        # Coyote Time : permet de sauter légèrement après avoir quitté une plateforme
        self.coyote_time = 0.1  # 100ms
        self.coyote_timer = 0
        
        # Input Buffering : enregistre le saut demandé juste avant d'atterrir
        self.jump_buffer_time = 0.15  # 150ms
        self.jump_buffer_timer = 0
        
        # Variable Jump Height : saut plus court si on relâche tôt
        self.is_jumping = False
        self.jump_cut_multiplier = 0.5
        
        self.width = 40
        self.height = 60
    
    def update(self, dt, keys, platforms):
        # Mouvement horizontal avec accélération
        target_vel_x = 0
        if keys[pygame.K_LEFT]:
            target_vel_x = -self.speed
        if keys[pygame.K_RIGHT]:
            target_vel_x = self.speed
        
        # Interpolation douce
        self.vel_x += (target_vel_x - self.vel_x) * 15 * dt
        
        # Gravité
        self.vel_y += self.gravity * dt
        self.vel_y = min(self.vel_y, self.max_fall_speed)
        
        # Déplacement
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt
        
        # Mise à jour des timers
        if self.coyote_timer > 0:
            self.coyote_timer -= dt
        if self.jump_buffer_timer > 0:
            self.jump_buffer_timer -= dt
        
        # Collisions
        was_on_ground = self.on_ground
        self.on_ground = False
        player_rect = pygame.Rect(self.x, self.y, self.width, self.height)
        
        for platform in platforms:
            if player_rect.colliderect(platform):
                if self.vel_y > 0:
                    self.y = platform.top - self.height
                    self.vel_y = 0
                    self.on_ground = True
                    self.is_jumping = False
        
        # Coyote Time : si on vient de quitter le sol
        if was_on_ground and not self.on_ground:
            self.coyote_timer = self.coyote_time
        
        # Si on atterrit avec un saut en buffer
        if self.on_ground and self.jump_buffer_timer > 0:
            self.perform_jump()
            self.jump_buffer_timer = 0
    
    def request_jump(self):
        """Appelé quand le joueur appuie sur saut"""
        if self.on_ground or self.coyote_timer > 0:
            self.perform_jump()
        else:
            # Buffer le saut pour quand on atterrira
            self.jump_buffer_timer = self.jump_buffer_time
    
    def perform_jump(self):
        """Exécute réellement le saut"""
        self.vel_y = self.jump_force
        self.on_ground = False
        self.coyote_timer = 0
        self.is_jumping = True
    
    def release_jump(self):
        """Appelé quand le joueur relâche le bouton de saut"""
        if self.is_jumping and self.vel_y < 0:
            # Réduire la vélocité verticale pour un saut plus court
            self.vel_y *= self.jump_cut_multiplier
            self.is_jumping = False
    
    def draw(self, surface):
        # Couleur selon l'état
        if self.on_ground:
            color = (0, 255, 0)
        elif self.coyote_timer > 0:
            color = (255, 255, 0)  # Jaune pendant le coyote time
        else:
            color = (255, 0, 0)
        
        pygame.draw.rect(surface, color, 
                        (int(self.x), int(self.y), self.width, self.height))
```

## Détection de collisions

### Collisions AABB (rectangles alignés)

```python
import pygame

def check_aabb_collision(rect1, rect2):
    """Vérifie si deux rectangles se chevauchent"""
    return (rect1.right > rect2.left and
            rect1.left < rect2.right and
            rect1.bottom > rect2.top and
            rect1.top < rect2.bottom)

def check_point_in_rect(point, rect):
    """Vérifie si un point est dans un rectangle"""
    return (rect.left <= point[0] <= rect.right and
            rect.top <= point[1] <= rect.bottom)

# Pygame a une méthode intégrée :
# rect1.colliderect(rect2)
# rect.collidepoint(point)
```

### Collisions circulaires

```python
import math

def check_circle_collision(x1, y1, r1, x2, y2, r2):
    """Vérifie si deux cercles se chevauchent"""
    dx = x2 - x1
    dy = y2 - y1
    distance = math.sqrt(dx * dx + dy * dy)
    return distance < (r1 + r2)

def check_point_in_circle(px, py, cx, cy, radius):
    """Vérifie si un point est dans un cercle"""
    dx = px - cx
    dy = py - cy
    return (dx * dx + dy * dy) < (radius * radius)

class Circle:
    def __init__(self, x, y, radius):
        self.x = x
        self.y = y
        self.radius = radius
    
    def collides_with(self, other):
        return check_circle_collision(
            self.x, self.y, self.radius,
            other.x, other.y, other.radius
        )
    
    def contains_point(self, point):
        return check_point_in_circle(
            point[0], point[1],
            self.x, self.y, self.radius
        )
```

### Collision Cercle-Rectangle

```python
def check_circle_rect_collision(cx, cy, radius, rect):
    """Vérifie si un cercle et un rectangle se chevauchent"""
    # Trouver le point le plus proche du centre du cercle sur le rectangle
    closest_x = max(rect.left, min(cx, rect.right))
    closest_y = max(rect.top, min(cy, rect.bottom))
    
    # Calculer la distance entre ce point et le centre du cercle
    dx = cx - closest_x
    dy = cy - closest_y
    distance_squared = dx * dx + dy * dy
    
    return distance_squared < (radius * radius)
```

### Système de collision complet

```python
import pygame
from enum import Enum, auto

class ColliderType(Enum):
    RECT = auto()
    CIRCLE = auto()

class Collider:
    """Classe de base pour les colliders"""
    
    def __init__(self, collider_type):
        self.type = collider_type
        self.enabled = True
        self.is_trigger = False  # Si True, détecte mais ne bloque pas
    
    def check_collision(self, other):
        raise NotImplementedError

class RectCollider(Collider):
    def __init__(self, x, y, width, height):
        super().__init__(ColliderType.RECT)
        self.rect = pygame.Rect(x, y, width, height)
    
    def update_position(self, x, y):
        self.rect.x = x
        self.rect.y = y
    
    def check_collision(self, other):
        if not self.enabled or not other.enabled:
            return False
        
        if other.type == ColliderType.RECT:
            return self.rect.colliderect(other.rect)
        elif other.type == ColliderType.CIRCLE:
            return check_circle_rect_collision(
                other.x, other.y, other.radius, self.rect
            )
        return False
    
    def draw_debug(self, surface, color=(0, 255, 0)):
        pygame.draw.rect(surface, color, self.rect, 2)

class CircleCollider(Collider):
    def __init__(self, x, y, radius):
        super().__init__(ColliderType.CIRCLE)
        self.x = x
        self.y = y
        self.radius = radius
    
    def update_position(self, x, y):
        self.x = x
        self.y = y
    
    def check_collision(self, other):
        if not self.enabled or not other.enabled:
            return False
        
        if other.type == ColliderType.CIRCLE:
            return check_circle_collision(
                self.x, self.y, self.radius,
                other.x, other.y, other.radius
            )
        elif other.type == ColliderType.RECT:
            return check_circle_rect_collision(
                self.x, self.y, self.radius, other.rect
            )
        return False
    
    def draw_debug(self, surface, color=(0, 255, 0)):
        pygame.draw.circle(surface, color, (int(self.x), int(self.y)), 
                          self.radius, 2)

class CollisionManager:
    """Gère toutes les collisions du jeu"""
    
    def __init__(self):
        self.colliders = []
        self.collision_callbacks = {}
    
    def add_collider(self, collider, callback=None):
        self.colliders.append(collider)
        if callback:
            self.collision_callbacks[id(collider)] = callback
    
    def remove_collider(self, collider):
        if collider in self.colliders:
            self.colliders.remove(collider)
            if id(collider) in self.collision_callbacks:
                del self.collision_callbacks[id(collider)]
    
    def check_all_collisions(self):
        """Vérifie toutes les paires de collision"""
        collisions = []
        
        for i, collider_a in enumerate(self.colliders):
            for collider_b in self.colliders[i+1:]:
                if collider_a.check_collision(collider_b):
                    collisions.append((collider_a, collider_b))
                    
                    # Appeler les callbacks
                    if id(collider_a) in self.collision_callbacks:
                        self.collision_callbacks[id(collider_a)](collider_b)
                    if id(collider_b) in self.collision_callbacks:
                        self.collision_callbacks[id(collider_b)](collider_a)
        
        return collisions
    
    def check_collision_with(self, collider, exclude=None):
        """Vérifie les collisions d'un collider avec tous les autres"""
        exclude = exclude or []
        collisions = []
        
        for other in self.colliders:
            if other != collider and other not in exclude:
                if collider.check_collision(other):
                    collisions.append(other)
        
        return collisions
    
    def draw_debug(self, surface):
        """Dessine tous les colliders pour le débogage"""
        for collider in self.colliders:
            collider.draw_debug(surface)
```

## Résolution des collisions

### Résolution basique avec MTV (Minimum Translation Vector)

```python
import pygame
import math

def resolve_aabb_collision(rect1, rect2):
    """
    Calcule le vecteur de translation minimum pour séparer deux rectangles
    Retourne (dx, dy) à ajouter à rect1 pour le séparer de rect2
    """
    # Calcul des overlaps sur chaque axe
    overlap_left = rect1.right - rect2.left
    overlap_right = rect2.right - rect1.left
    overlap_top = rect1.bottom - rect2.top
    overlap_bottom = rect2.bottom - rect1.top
    
    # Trouver l'overlap minimum (axe de moindre pénétration)
    overlaps = [
        (overlap_left, (-overlap_left, 0)),   # Pousser à gauche
        (overlap_right, (overlap_right, 0)),   # Pousser à droite
        (overlap_top, (0, -overlap_top)),      # Pousser vers le haut
        (overlap_bottom, (0, overlap_bottom))  # Pousser vers le bas
    ]
    
    # Retourner le plus petit déplacement
    min_overlap = min(overlaps, key=lambda x: abs(x[0]))
    return min_overlap[1]

def resolve_circle_collision(c1_x, c1_y, c1_r, c2_x, c2_y, c2_r):
    """
    Calcule le vecteur pour séparer deux cercles
    Retourne (dx, dy) à ajouter au cercle 1
    """
    dx = c1_x - c2_x
    dy = c1_y - c2_y
    distance = math.sqrt(dx * dx + dy * dy)
    
    if distance == 0:
        # Cercles au même endroit, pousser dans une direction arbitraire
        return (c1_r + c2_r, 0)
    
    overlap = (c1_r + c2_r) - distance
    
    # Normaliser et multiplier par l'overlap
    nx = dx / distance
    ny = dy / distance
    
    return (nx * overlap, ny * overlap)
```

### Exemple complet : Résolution avec physique

```python
import pygame
import math
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

class Ball:
    def __init__(self, x, y, radius, color):
        self.x = x
        self.y = y
        self.vel_x = random.uniform(-200, 200)
        self.vel_y = random.uniform(-200, 200)
        self.radius = radius
        self.color = color
        self.mass = radius  # Masse proportionnelle au rayon
    
    def update(self, dt):
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt
        
        # Rebond sur les bords
        if self.x - self.radius < 0:
            self.x = self.radius
            self.vel_x = -self.vel_x * 0.9
        if self.x + self.radius > 800:
            self.x = 800 - self.radius
            self.vel_x = -self.vel_x * 0.9
        if self.y - self.radius < 0:
            self.y = self.radius
            self.vel_y = -self.vel_y * 0.9
        if self.y + self.radius > 600:
            self.y = 600 - self.radius
            self.vel_y = -self.vel_y * 0.9
    
    def draw(self, surface):
        pygame.draw.circle(surface, self.color, 
                          (int(self.x), int(self.y)), self.radius)

def resolve_ball_collision(ball1, ball2):
    """Résout une collision élastique entre deux balles"""
    dx = ball2.x - ball1.x
    dy = ball2.y - ball1.y
    distance = math.sqrt(dx * dx + dy * dy)
    
    if distance == 0:
        return
    
    # Vérifier s'il y a collision
    min_dist = ball1.radius + ball2.radius
    if distance >= min_dist:
        return
    
    # Normaliser
    nx = dx / distance
    ny = dy / distance
    
    # Séparer les balles
    overlap = min_dist - distance
    ball1.x -= nx * overlap / 2
    ball1.y -= ny * overlap / 2
    ball2.x += nx * overlap / 2
    ball2.y += ny * overlap / 2
    
    # Vitesse relative
    dvx = ball1.vel_x - ball2.vel_x
    dvy = ball1.vel_y - ball2.vel_y
    
    # Vitesse relative dans la direction de la collision
    dvn = dvx * nx + dvy * ny
    
    # Ne rien faire si les balles s'éloignent
    if dvn > 0:
        return
    
    # Coefficient de restitution (élasticité)
    restitution = 0.95
    
    # Impulsion scalaire
    total_mass = ball1.mass + ball2.mass
    impulse = -(1 + restitution) * dvn / total_mass
    
    # Appliquer l'impulsion
    ball1.vel_x += impulse * ball2.mass * nx
    ball1.vel_y += impulse * ball2.mass * ny
    ball2.vel_x -= impulse * ball1.mass * nx
    ball2.vel_y -= impulse * ball1.mass * ny

# Créer des balles
balls = []
colors = [(255, 100, 100), (100, 255, 100), (100, 100, 255), 
          (255, 255, 100), (255, 100, 255), (100, 255, 255)]

for i in range(8):
    radius = random.randint(20, 40)
    x = random.randint(radius, 800 - radius)
    y = random.randint(radius, 600 - radius)
    color = random.choice(colors)
    balls.append(Ball(x, y, radius, color))

running = True
while running:
    dt = clock.tick(60) / 1000.0
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                # Ajouter une balle
                radius = random.randint(20, 40)
                mx, my = pygame.mouse.get_pos()
                balls.append(Ball(mx, my, radius, random.choice(colors)))
    
    # Mise à jour
    for ball in balls:
        ball.update(dt)
    
    # Résolution des collisions
    for i, ball1 in enumerate(balls):
        for ball2 in balls[i+1:]:
            resolve_ball_collision(ball1, ball2)
    
    # Rendu
    screen.fill((30, 30, 30))
    
    for ball in balls:
        ball.draw(screen)
    
    # Instructions
    font = pygame.font.Font(None, 30)
    text = font.render("ESPACE = Ajouter une balle à la souris", True, (200, 200, 200))
    screen.blit(text, (10, 10))
    
    pygame.display.flip()

pygame.quit()
```

## Grille de collision (Spatial Hashing)

Pour optimiser les collisions avec beaucoup d'objets :

```python
class SpatialHash:
    """
    Structure de données pour optimiser la détection de collisions
    en divisant l'espace en cellules
    """
    
    def __init__(self, cell_size):
        self.cell_size = cell_size
        self.cells = {}
    
    def clear(self):
        """Vide toutes les cellules"""
        self.cells.clear()
    
    def _get_cell_key(self, x, y):
        """Retourne la clé de cellule pour une position"""
        return (int(x // self.cell_size), int(y // self.cell_size))
    
    def _get_cells_for_rect(self, rect):
        """Retourne toutes les cellules couvertes par un rectangle"""
        min_x = int(rect.left // self.cell_size)
        max_x = int(rect.right // self.cell_size)
        min_y = int(rect.top // self.cell_size)
        max_y = int(rect.bottom // self.cell_size)
        
        cells = []
        for x in range(min_x, max_x + 1):
            for y in range(min_y, max_y + 1):
                cells.append((x, y))
        return cells
    
    def insert(self, obj, rect):
        """Insère un objet dans toutes les cellules qu'il couvre"""
        for cell_key in self._get_cells_for_rect(rect):
            if cell_key not in self.cells:
                self.cells[cell_key] = []
            self.cells[cell_key].append(obj)
    
    def get_nearby(self, rect):
        """Retourne tous les objets potentiellement en collision"""
        nearby = set()
        for cell_key in self._get_cells_for_rect(rect):
            if cell_key in self.cells:
                for obj in self.cells[cell_key]:
                    nearby.add(obj)
        return nearby

class OptimizedCollisionSystem:
    """Système de collision optimisé avec spatial hashing"""
    
    def __init__(self, cell_size=100):
        self.spatial_hash = SpatialHash(cell_size)
        self.objects = []
    
    def add_object(self, obj):
        """Ajoute un objet au système"""
        self.objects.append(obj)
    
    def remove_object(self, obj):
        """Retire un objet du système"""
        if obj in self.objects:
            self.objects.remove(obj)
    
    def update(self):
        """Met à jour le spatial hash et vérifie les collisions"""
        # Reconstruire le spatial hash
        self.spatial_hash.clear()
        
        for obj in self.objects:
            rect = obj.get_rect()  # L'objet doit avoir cette méthode
            self.spatial_hash.insert(obj, rect)
        
        # Vérifier les collisions
        checked_pairs = set()
        collisions = []
        
        for obj in self.objects:
            rect = obj.get_rect()
            nearby = self.spatial_hash.get_nearby(rect)
            
            for other in nearby:
                if other == obj:
                    continue
                
                # Éviter de vérifier la même paire deux fois
                pair = (min(id(obj), id(other)), max(id(obj), id(other)))
                if pair in checked_pairs:
                    continue
                checked_pairs.add(pair)
                
                # Vérification réelle de collision
                if rect.colliderect(other.get_rect()):
                    collisions.append((obj, other))
        
        return collisions
```

## Projectiles et tirs

```python
import pygame
import math

class Projectile:
    def __init__(self, x, y, angle, speed, damage=10):
        self.x = x
        self.y = y
        self.angle = angle
        self.speed = speed
        self.damage = damage
        
        # Calculer la vélocité à partir de l'angle
        self.vel_x = math.cos(angle) * speed
        self.vel_y = math.sin(angle) * speed
        
        self.radius = 5
        self.alive = True
        self.lifetime = 3.0  # Durée de vie en secondes
    
    def update(self, dt):
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt
        
        self.lifetime -= dt
        
        # Vérifier si hors écran ou expiré
        if (self.x < -50 or self.x > 850 or 
            self.y < -50 or self.y > 650 or 
            self.lifetime <= 0):
            self.alive = False
    
    def get_rect(self):
        return pygame.Rect(
            self.x - self.radius, self.y - self.radius,
            self.radius * 2, self.radius * 2
        )
    
    def draw(self, surface):
        pygame.draw.circle(surface, (255, 255, 0), 
                          (int(self.x), int(self.y)), self.radius)

class Shooter:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.size = 40
        self.projectiles = []
        
        # Paramètres de tir
        self.fire_rate = 0.2  # Secondes entre les tirs
        self.fire_timer = 0
        self.projectile_speed = 500
    
    def update(self, dt, mouse_pos, is_firing):
        # Cooldown de tir
        if self.fire_timer > 0:
            self.fire_timer -= dt
        
        # Tir
        if is_firing and self.fire_timer <= 0:
            self.fire(mouse_pos)
            self.fire_timer = self.fire_rate
        
        # Mise à jour des projectiles
        for proj in self.projectiles[:]:
            proj.update(dt)
            if not proj.alive:
                self.projectiles.remove(proj)
    
    def fire(self, target_pos):
        # Calculer l'angle vers la cible
        dx = target_pos[0] - (self.x + self.size / 2)
        dy = target_pos[1] - (self.y + self.size / 2)
        angle = math.atan2(dy, dx)
        
        # Créer le projectile au centre du joueur
        proj = Projectile(
            self.x + self.size / 2,
            self.y + self.size / 2,
            angle,
            self.projectile_speed
        )
        self.projectiles.append(proj)
    
    def draw(self, surface, mouse_pos):
        # Dessiner le joueur
        pygame.draw.rect(surface, (0, 200, 255), 
                        (int(self.x), int(self.y), self.size, self.size))
        
        # Dessiner la ligne de visée
        center = (self.x + self.size / 2, self.y + self.size / 2)
        pygame.draw.line(surface, (100, 100, 100), center, mouse_pos, 1)
        
        # Dessiner les projectiles
        for proj in self.projectiles:
            proj.draw(surface)

# Exemple d'utilisation
pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

shooter = Shooter(380, 280)

running = True
while running:
    dt = clock.tick(60) / 1000.0
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    mouse_pos = pygame.mouse.get_pos()
    is_firing = pygame.mouse.get_pressed()[0]
    
    shooter.update(dt, mouse_pos, is_firing)
    
    screen.fill((30, 30, 30))
    shooter.draw(screen, mouse_pos)
    
    # Afficher le nombre de projectiles
    font = pygame.font.Font(None, 30)
    text = font.render(f"Projectiles: {len(shooter.projectiles)}", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    
    pygame.display.flip()

pygame.quit()
```

## Exercice complet : Top-down shooter

```python
"""
Mini jeu top-down shooter avec toutes les mécaniques apprises
"""
import pygame
import math
import random

pygame.init()

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Top-Down Shooter")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

class Player:
    def __init__(self):
        self.x = SCREEN_WIDTH // 2
        self.y = SCREEN_HEIGHT // 2
        self.size = 30
        self.speed = 250
        self.health = 100
        self.max_health = 100
        
        self.projectiles = []
        self.fire_rate = 0.15
        self.fire_timer = 0
    
    def update(self, dt, keys, mouse_pos, mouse_buttons):
        # Mouvement
        dx, dy = 0, 0
        if keys[pygame.K_w] or keys[pygame.K_UP]:
            dy -= 1
        if keys[pygame.K_s] or keys[pygame.K_DOWN]:
            dy += 1
        if keys[pygame.K_a] or keys[pygame.K_LEFT]:
            dx -= 1
        if keys[pygame.K_d] or keys[pygame.K_RIGHT]:
            dx += 1
        
        # Normaliser
        if dx != 0 or dy != 0:
            length = math.sqrt(dx * dx + dy * dy)
            dx /= length
            dy /= length
            self.x += dx * self.speed * dt
            self.y += dy * self.speed * dt
        
        # Limiter aux bords
        self.x = max(self.size, min(SCREEN_WIDTH - self.size, self.x))
        self.y = max(self.size, min(SCREEN_HEIGHT - self.size, self.y))
        
        # Tir
        self.fire_timer -= dt
        if mouse_buttons[0] and self.fire_timer <= 0:
            self.fire(mouse_pos)
            self.fire_timer = self.fire_rate
        
        # Mise à jour des projectiles
        for proj in self.projectiles[:]:
            proj.update(dt)
            if not proj.alive:
                self.projectiles.remove(proj)
    
    def fire(self, target):
        dx = target[0] - self.x
        dy = target[1] - self.y
        angle = math.atan2(dy, dx)
        
        self.projectiles.append(Projectile(self.x, self.y, angle, 600, (255, 255, 0)))
    
    def take_damage(self, amount):
        self.health -= amount
        return self.health <= 0
    
    def get_rect(self):
        return pygame.Rect(self.x - self.size, self.y - self.size, 
                          self.size * 2, self.size * 2)
    
    def draw(self, surface, mouse_pos):
        # Corps
        pygame.draw.circle(surface, (0, 200, 255), (int(self.x), int(self.y)), self.size)
        
        # Direction (vers la souris)
        angle = math.atan2(mouse_pos[1] - self.y, mouse_pos[0] - self.x)
        end_x = self.x + math.cos(angle) * (self.size + 10)
        end_y = self.y + math.sin(angle) * (self.size + 10)
        pygame.draw.line(surface, (255, 255, 255), (self.x, self.y), (end_x, end_y), 3)
        
        # Barre de vie
        bar_width = 50
        bar_height = 6
        bar_x = self.x - bar_width // 2
        bar_y = self.y - self.size - 15
        
        pygame.draw.rect(surface, (100, 0, 0), (bar_x, bar_y, bar_width, bar_height))
        health_width = (self.health / self.max_health) * bar_width
        pygame.draw.rect(surface, (0, 255, 0), (bar_x, bar_y, health_width, bar_height))
        
        # Projectiles
        for proj in self.projectiles:
            proj.draw(surface)

class Projectile:
    def __init__(self, x, y, angle, speed, color):
        self.x = x
        self.y = y
        self.vel_x = math.cos(angle) * speed
        self.vel_y = math.sin(angle) * speed
        self.radius = 5
        self.color = color
        self.alive = True
        self.damage = 25
    
    def update(self, dt):
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt
        
        if self.x < 0 or self.x > SCREEN_WIDTH or self.y < 0 or self.y > SCREEN_HEIGHT:
            self.alive = False
    
    def get_rect(self):
        return pygame.Rect(self.x - self.radius, self.y - self.radius, 
                          self.radius * 2, self.radius * 2)
    
    def draw(self, surface):
        pygame.draw.circle(surface, self.color, (int(self.x), int(self.y)), self.radius)

class Enemy:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.size = 25
        self.speed = 80
        self.health = 50
        self.max_health = 50
        self.damage = 10
        self.alive = True
    
    def update(self, dt, player):
        # Se déplacer vers le joueur
        dx = player.x - self.x
        dy = player.y - self.y
        distance = math.sqrt(dx * dx + dy * dy)
        
        if distance > 0:
            dx /= distance
            dy /= distance
            self.x += dx * self.speed * dt
            self.y += dy * self.speed * dt
    
    def take_damage(self, amount):
        self.health -= amount
        if self.health <= 0:
            self.alive = False
            return True
        return False
    
    def get_rect(self):
        return pygame.Rect(self.x - self.size, self.y - self.size, 
                          self.size * 2, self.size * 2)
    
    def check_collision_with_player(self, player):
        dx = player.x - self.x
        dy = player.y - self.y
        distance = math.sqrt(dx * dx + dy * dy)
        return distance < (self.size + player.size)
    
    def draw(self, surface):
        # Corps
        pygame.draw.circle(surface, (255, 50, 50), (int(self.x), int(self.y)), self.size)
        
        # Barre de vie
        if self.health < self.max_health:
            bar_width = 40
            bar_height = 4
            bar_x = self.x - bar_width // 2
            bar_y = self.y - self.size - 10
            
            pygame.draw.rect(surface, (100, 0, 0), (bar_x, bar_y, bar_width, bar_height))
            health_width = (self.health / self.max_health) * bar_width
            pygame.draw.rect(surface, (0, 200, 0), (bar_x, bar_y, health_width, bar_height))

# Initialisation du jeu
player = Player()
enemies = []
score = 0
spawn_timer = 0
spawn_rate = 2.0  # Secondes entre les spawns
game_over = False

def spawn_enemy():
    # Spawn sur un bord aléatoire
    side = random.randint(0, 3)
    if side == 0:  # Haut
        x = random.randint(0, SCREEN_WIDTH)
        y = -30
    elif side == 1:  # Droite
        x = SCREEN_WIDTH + 30
        y = random.randint(0, SCREEN_HEIGHT)
    elif side == 2:  # Bas
        x = random.randint(0, SCREEN_WIDTH)
        y = SCREEN_HEIGHT + 30
    else:  # Gauche
        x = -30
        y = random.randint(0, SCREEN_HEIGHT)
    
    enemies.append(Enemy(x, y))

running = True
while running:
    dt = clock.tick(60) / 1000.0
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_r and game_over:
                # Recommencer
                player = Player()
                enemies = []
                score = 0
                spawn_timer = 0
                game_over = False
    
    if not game_over:
        keys = pygame.key.get_pressed()
        mouse_pos = pygame.mouse.get_pos()
        mouse_buttons = pygame.mouse.get_pressed()
        
        # Mise à jour du joueur
        player.update(dt, keys, mouse_pos, mouse_buttons)
        
        # Spawn d'ennemis
        spawn_timer += dt
        if spawn_timer >= spawn_rate:
            spawn_enemy()
            spawn_timer = 0
            # Augmenter la difficulté
            spawn_rate = max(0.5, spawn_rate - 0.05)
        
        # Mise à jour des ennemis
        for enemy in enemies[:]:
            enemy.update(dt, player)
            
            # Collision avec le joueur
            if enemy.check_collision_with_player(player):
                if player.take_damage(enemy.damage):
                    game_over = True
                enemies.remove(enemy)
                continue
            
            # Collision avec les projectiles
            for proj in player.projectiles[:]:
                if enemy.get_rect().colliderect(proj.get_rect()):
                    if enemy.take_damage(proj.damage):
                        enemies.remove(enemy)
                        score += 100
                    proj.alive = False
                    break
    
    # Rendu
    screen.fill((20, 20, 30))
    
    # Ennemis
    for enemy in enemies:
        enemy.draw(screen)
    
    # Joueur
    if not game_over:
        player.draw(screen, pygame.mouse.get_pos())
    
    # Interface
    score_text = font.render(f"Score: {score}", True, (255, 255, 255))
    screen.blit(score_text, (10, 10))
    
    health_text = font.render(f"HP: {player.health}", True, (0, 255, 0))
    screen.blit(health_text, (10, 50))
    
    if game_over:
        go_text = font.render("GAME OVER - Appuyez sur R", True, (255, 0, 0))
        text_rect = go_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2))
        screen.blit(go_text, text_rect)
        
        final_score = font.render(f"Score final: {score}", True, (255, 255, 255))
        score_rect = final_score.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 40))
        screen.blit(final_score, score_rect)
    
    pygame.display.flip()

pygame.quit()
```

## Bonnes pratiques

### ✅ À faire

- **Utiliser le delta time** : Pour un mouvement indépendant du framerate
- **Séparer la détection et la résolution** : Facilite le débogage
- **Utiliser des structures spatiales** : Pour de nombreux objets (spatial hashing)
- **Tester les cas limites** : Objets qui se touchent à peine, vitesses élevées
- **Visualiser les colliders** : Mode debug pour voir les hitboxes

### ❌ À éviter

- **Vitesses trop élevées** : Les objets peuvent se traverser (tunneling)
- **Collisions imbriquées** : Résoudre une collision qui en crée une autre
- **Vérifier toutes les paires** : O(n²) devient lent rapidement
- **Ignorer les cas edge** : Objets au même endroit, divisions par zéro

## Ressources- **Tutoriels Pygame** : https://www.pygame.org/wiki/tutorials
- **Game Programming Patterns** : https://gameprogrammingpatterns.com/
- **2D Game Collision Detection** : Article N Tutorial
- **Fix Your Timestep** : https://gafferongames.com/post/fix_your_timestep/
