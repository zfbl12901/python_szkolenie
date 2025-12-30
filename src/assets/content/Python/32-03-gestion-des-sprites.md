---
title: "Gestion des Sprites et Animations"
order: 3
parent: "32-jeux-2d.md"
tags: ["python", "games", "sprites", "animations", "pygame"]
---

# Gestion des Sprites et Animations

## Introduction

Les sprites sont des images 2D qui représentent les objets de votre jeu : personnages, ennemis, objets, décors. Pygame offre un système de sprites puissant via le module `pygame.sprite` qui facilite la gestion des groupes d'objets, les collisions et le rendu.

## Classe Sprite de base

### Structure fondamentale

```python
import pygame

class SimpleSprite(pygame.sprite.Sprite):
    """Sprite basique avec les éléments essentiels"""
    
    def __init__(self, x, y, width, height, color):
        # IMPORTANT : Appeler le constructeur parent
        super().__init__()
        
        # 1. Créer l'image du sprite
        self.image = pygame.Surface((width, height))
        self.image.fill(color)
        
        # 2. Obtenir le rectangle de l'image
        self.rect = self.image.get_rect()
        
        # 3. Positionner le sprite
        self.rect.x = x
        self.rect.y = y
    
    def update(self):
        """Appelée automatiquement par sprite_group.update()"""
        pass

# Utilisation
pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

# Créer un groupe de sprites
all_sprites = pygame.sprite.Group()

# Ajouter des sprites au groupe
player = SimpleSprite(100, 100, 50, 50, (0, 200, 255))
all_sprites.add(player)

enemy = SimpleSprite(300, 200, 40, 40, (255, 50, 50))
all_sprites.add(enemy)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Mettre à jour tous les sprites
    all_sprites.update()
    
    # Dessiner
    screen.fill((30, 30, 30))
    all_sprites.draw(screen)  # Dessine tous les sprites du groupe
    pygame.display.flip()
    
    clock.tick(60)

pygame.quit()
```

### Sprite avec image chargée

```python
import pygame
import os

class ImageSprite(pygame.sprite.Sprite):
    """Sprite avec une image chargée depuis un fichier"""
    
    def __init__(self, x, y, image_path, scale=1.0):
        super().__init__()
        
        # Charger l'image
        try:
            self.original_image = pygame.image.load(image_path).convert_alpha()
        except pygame.error:
            # Image de remplacement si le fichier n'existe pas
            self.original_image = pygame.Surface((64, 64))
            self.original_image.fill((255, 0, 255))
        
        # Redimensionner si nécessaire
        if scale != 1.0:
            size = self.original_image.get_size()
            new_size = (int(size[0] * scale), int(size[1] * scale))
            self.original_image = pygame.transform.scale(
                self.original_image, new_size
            )
        
        self.image = self.original_image.copy()
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
```

## Groupes de sprites

### Types de groupes

```python
import pygame

# Groupe simple - le plus utilisé
all_sprites = pygame.sprite.Group()

# Groupe avec rendu ordonné par couche
layered_sprites = pygame.sprite.LayeredUpdates()

# Groupe avec rendu sale (optimisé pour les sprites statiques)
dirty_sprites = pygame.sprite.RenderUpdates()

# Groupe pour un seul sprite (utile pour le joueur)
player_group = pygame.sprite.GroupSingle()
```

### Gestion des groupes

```python
import pygame

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((40, 40))
        self.image.fill((0, 200, 255))
        self.rect = self.image.get_rect(center=(x, y))

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((30, 30))
        self.image.fill((255, 50, 50))
        self.rect = self.image.get_rect(center=(x, y))

class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((8, 8))
        self.image.fill((255, 255, 0))
        self.rect = self.image.get_rect(center=(x, y))
        self.speed = 10
    
    def update(self):
        self.rect.y -= self.speed
        if self.rect.bottom < 0:
            self.kill()  # Retire le sprite de tous ses groupes

# Créer les groupes
all_sprites = pygame.sprite.Group()
enemies = pygame.sprite.Group()
bullets = pygame.sprite.Group()

# Créer les sprites
player = Player(400, 500)
all_sprites.add(player)

for i in range(5):
    enemy = Enemy(100 + i * 140, 100)
    enemies.add(enemy)
    all_sprites.add(enemy)

# Ajouter un projectile
def fire():
    bullet = Bullet(player.rect.centerx, player.rect.top)
    bullets.add(bullet)
    all_sprites.add(bullet)

# Exemple de vérification des sprites
print(f"Nombre total de sprites : {len(all_sprites)}")
print(f"Nombre d'ennemis : {len(enemies)}")

# Itérer sur un groupe
for enemy in enemies:
    print(f"Ennemi à {enemy.rect.center}")

# Vérifier si un sprite est dans un groupe
print(f"Player dans all_sprites : {player in all_sprites}")

# Vider un groupe
# enemies.empty()  # Retire tous les sprites du groupe

# Copier un groupe
enemies_copy = enemies.copy()
```

## Collisions entre sprites

### Collision sprite vs sprite

```python
import pygame

def check_sprite_collisions():
    # Collision simple entre deux sprites
    if pygame.sprite.collide_rect(sprite1, sprite2):
        print("Collision rectangle !")
    
    # Collision avec ratio (rectangles plus petits)
    # 0.8 = 80% de la taille originale
    if pygame.sprite.collide_rect_ratio(0.8)(sprite1, sprite2):
        print("Collision avec marge !")
    
    # Collision circulaire
    if pygame.sprite.collide_circle(sprite1, sprite2):
        print("Collision circulaire !")
    
    # Collision circulaire avec rayon personnalisé
    # Les sprites doivent avoir un attribut 'radius'
    sprite1.radius = 25
    sprite2.radius = 20
    if pygame.sprite.collide_circle_ratio(1.0)(sprite1, sprite2):
        print("Collision cercle personnalisé !")
    
    # Collision par masque (pixel perfect)
    # Les sprites doivent avoir un attribut 'mask'
    if pygame.sprite.collide_mask(sprite1, sprite2):
        print("Collision pixel perfect !")
```

### Collision sprite vs groupe

```python
import pygame

# Collision d'un sprite avec un groupe
# Retourne la liste des sprites touchés
def check_player_enemy_collision(player, enemies):
    # dokill=True retire les sprites touchés du groupe
    hit_list = pygame.sprite.spritecollide(player, enemies, dokill=False)
    
    for enemy in hit_list:
        print(f"Collision avec {enemy}")
        player.take_damage(10)

# Avec une fonction de collision personnalisée
def custom_collision(sprite1, sprite2):
    """Collision personnalisée basée sur la distance"""
    dx = sprite1.rect.centerx - sprite2.rect.centerx
    dy = sprite1.rect.centery - sprite2.rect.centery
    distance = (dx ** 2 + dy ** 2) ** 0.5
    return distance < 50

hit_list = pygame.sprite.spritecollide(
    player, enemies, False, 
    collided=custom_collision
)
```

### Collision groupe vs groupe

```python
import pygame

def check_bullets_vs_enemies(bullets, enemies):
    """Vérifie les collisions entre projectiles et ennemis"""
    
    # groupcollide retourne un dictionnaire
    # clé: sprite du premier groupe
    # valeur: liste des sprites du second groupe touchés
    collisions = pygame.sprite.groupcollide(
        bullets, enemies, 
        dokilla=True,  # Supprimer les bullets
        dokillb=True   # Supprimer les ennemis
    )
    
    score = 0
    for bullet, hit_enemies in collisions.items():
        for enemy in hit_enemies:
            score += 100
            # Créer une explosion à la position de l'ennemi
            # spawn_explosion(enemy.rect.center)
    
    return score
```

### Collision pixel-perfect avec masques

```python
import pygame

class MaskedSprite(pygame.sprite.Sprite):
    """Sprite avec collision pixel-perfect"""
    
    def __init__(self, x, y, image_path):
        super().__init__()
        
        # Charger l'image avec transparence
        self.image = pygame.image.load(image_path).convert_alpha()
        self.rect = self.image.get_rect(center=(x, y))
        
        # Créer le masque pour collision pixel-perfect
        self.mask = pygame.mask.from_surface(self.image)
    
    def update_mask(self):
        """Mettre à jour le masque si l'image change"""
        self.mask = pygame.mask.from_surface(self.image)

# Vérification de collision avec masque
def check_mask_collision(sprite1, sprite2):
    # Calculer l'offset
    offset = (
        sprite2.rect.x - sprite1.rect.x,
        sprite2.rect.y - sprite1.rect.y
    )
    
    # Vérifier le chevauchement des masques
    overlap = sprite1.mask.overlap(sprite2.mask, offset)
    
    if overlap:
        # overlap contient le point de collision
        collision_point = overlap
        return True, collision_point
    
    return False, None

# Visualiser le masque (debug)
def draw_mask_debug(surface, sprite, color=(255, 0, 0)):
    """Dessine les pixels du masque pour débogage"""
    mask_surface = sprite.mask.to_surface(
        setcolor=color,
        unsetcolor=(0, 0, 0, 0)
    )
    surface.blit(mask_surface, sprite.rect)
```

## Animations de sprites

### Animation par spritesheet (ligne unique)

```python
import pygame

class AnimatedSprite(pygame.sprite.Sprite):
    """Sprite animé à partir d'une spritesheet"""
    
    def __init__(self, x, y, spritesheet_path, frame_width, frame_height, 
                 frame_count, animation_speed=0.1):
        super().__init__()
        
        # Charger la spritesheet
        self.spritesheet = pygame.image.load(spritesheet_path).convert_alpha()
        
        # Extraire les frames
        self.frames = []
        for i in range(frame_count):
            frame_rect = pygame.Rect(
                i * frame_width, 0, 
                frame_width, frame_height
            )
            frame = self.spritesheet.subsurface(frame_rect).copy()
            self.frames.append(frame)
        
        # Animation
        self.current_frame = 0
        self.animation_speed = animation_speed  # Secondes par frame
        self.animation_timer = 0
        
        # Image actuelle
        self.image = self.frames[0]
        self.rect = self.image.get_rect(center=(x, y))
    
    def update(self, dt):
        # Mettre à jour l'animation
        self.animation_timer += dt
        
        if self.animation_timer >= self.animation_speed:
            self.animation_timer = 0
            self.current_frame = (self.current_frame + 1) % len(self.frames)
            self.image = self.frames[self.current_frame]
```

### Animation avec plusieurs états

```python
import pygame
from enum import Enum, auto

class PlayerState(Enum):
    IDLE = auto()
    WALKING = auto()
    JUMPING = auto()
    ATTACKING = auto()

class AnimatedPlayer(pygame.sprite.Sprite):
    """Joueur avec animations multiples"""
    
    def __init__(self, x, y):
        super().__init__()
        
        # Charger toutes les animations
        self.animations = {}
        self.load_animations()
        
        # État actuel
        self.state = PlayerState.IDLE
        self.direction = 1  # 1 = droite, -1 = gauche
        
        # Animation
        self.current_frame = 0
        self.animation_timer = 0
        self.animation_speed = 0.1
        
        # Image et position
        self.image = self.get_current_frame()
        self.rect = self.image.get_rect(center=(x, y))
        
        # Mouvement
        self.vel_x = 0
        self.vel_y = 0
        self.speed = 200
        self.on_ground = True
    
    def load_animations(self):
        """Charge les animations depuis des fichiers ou crée des placeholders"""
        # En production, charger depuis des fichiers
        # Ici, on crée des surfaces colorées comme placeholder
        
        colors = {
            PlayerState.IDLE: (0, 200, 255),
            PlayerState.WALKING: (0, 255, 200),
            PlayerState.JUMPING: (255, 200, 0),
            PlayerState.ATTACKING: (255, 100, 100)
        }
        
        frame_counts = {
            PlayerState.IDLE: 4,
            PlayerState.WALKING: 6,
            PlayerState.JUMPING: 2,
            PlayerState.ATTACKING: 4
        }
        
        for state, color in colors.items():
            frames = []
            for i in range(frame_counts[state]):
                frame = pygame.Surface((40, 60), pygame.SRCALPHA)
                # Variation de couleur pour visualiser l'animation
                shade = 200 + (i * 10) % 55
                adjusted_color = tuple(
                    min(255, int(c * shade / 255)) for c in color
                )
                frame.fill(adjusted_color)
                frames.append(frame)
            self.animations[state] = frames
    
    def load_spritesheet(self, path, frame_width, frame_height, frame_count):
        """Charge une animation depuis un spritesheet"""
        try:
            sheet = pygame.image.load(path).convert_alpha()
            frames = []
            for i in range(frame_count):
                frame = sheet.subsurface(
                    pygame.Rect(i * frame_width, 0, frame_width, frame_height)
                ).copy()
                frames.append(frame)
            return frames
        except pygame.error:
            return None
    
    def get_current_frame(self):
        """Retourne la frame actuelle avec direction"""
        frames = self.animations[self.state]
        frame = frames[int(self.current_frame) % len(frames)]
        
        # Flip si on regarde à gauche
        if self.direction == -1:
            frame = pygame.transform.flip(frame, True, False)
        
        return frame
    
    def set_state(self, new_state):
        """Change d'état et réinitialise l'animation"""
        if new_state != self.state:
            self.state = new_state
            self.current_frame = 0
            self.animation_timer = 0
    
    def update(self, dt, keys):
        # Gérer l'input
        self.vel_x = 0
        
        if keys[pygame.K_LEFT]:
            self.vel_x = -self.speed
            self.direction = -1
        if keys[pygame.K_RIGHT]:
            self.vel_x = self.speed
            self.direction = 1
        
        # Déterminer l'état
        if not self.on_ground:
            self.set_state(PlayerState.JUMPING)
        elif self.vel_x != 0:
            self.set_state(PlayerState.WALKING)
        else:
            self.set_state(PlayerState.IDLE)
        
        # Ajuster la vitesse d'animation selon l'état
        speeds = {
            PlayerState.IDLE: 0.15,
            PlayerState.WALKING: 0.08,
            PlayerState.JUMPING: 0.2,
            PlayerState.ATTACKING: 0.05
        }
        self.animation_speed = speeds.get(self.state, 0.1)
        
        # Mettre à jour l'animation
        self.animation_timer += dt
        if self.animation_timer >= self.animation_speed:
            self.animation_timer = 0
            self.current_frame += 1
            
            # Vérifier si l'animation est terminée (pour les animations non-looping)
            if self.state == PlayerState.ATTACKING:
                if self.current_frame >= len(self.animations[self.state]):
                    self.set_state(PlayerState.IDLE)
        
        # Mettre à jour l'image
        self.image = self.get_current_frame()
        
        # Déplacer
        self.rect.x += self.vel_x * dt
```

### Gestionnaire d'animations réutilisable

```python
import pygame

class Animation:
    """Représente une animation unique"""
    
    def __init__(self, frames, speed=0.1, loop=True):
        self.frames = frames
        self.speed = speed  # Secondes par frame
        self.loop = loop
        
        self.current_frame = 0
        self.timer = 0
        self.finished = False
    
    def reset(self):
        """Réinitialise l'animation"""
        self.current_frame = 0
        self.timer = 0
        self.finished = False
    
    def update(self, dt):
        """Met à jour l'animation"""
        if self.finished:
            return self.frames[-1]
        
        self.timer += dt
        
        if self.timer >= self.speed:
            self.timer = 0
            self.current_frame += 1
            
            if self.current_frame >= len(self.frames):
                if self.loop:
                    self.current_frame = 0
                else:
                    self.current_frame = len(self.frames) - 1
                    self.finished = True
        
        return self.frames[self.current_frame]
    
    def get_frame(self):
        """Retourne la frame actuelle"""
        return self.frames[min(self.current_frame, len(self.frames) - 1)]

class AnimationController:
    """Gère plusieurs animations pour un sprite"""
    
    def __init__(self):
        self.animations = {}
        self.current_animation = None
        self.current_name = None
    
    def add_animation(self, name, frames, speed=0.1, loop=True):
        """Ajoute une animation"""
        self.animations[name] = Animation(frames, speed, loop)
        
        if self.current_animation is None:
            self.current_name = name
            self.current_animation = self.animations[name]
    
    def play(self, name, force_restart=False):
        """Joue une animation"""
        if name not in self.animations:
            return
        
        if name != self.current_name or force_restart:
            self.current_name = name
            self.current_animation = self.animations[name]
            self.current_animation.reset()
    
    def update(self, dt):
        """Met à jour l'animation courante"""
        if self.current_animation:
            return self.current_animation.update(dt)
        return None
    
    def is_finished(self):
        """Vérifie si l'animation courante est terminée"""
        return self.current_animation and self.current_animation.finished
    
    def get_frame(self):
        """Retourne la frame courante"""
        if self.current_animation:
            return self.current_animation.get_frame()
        return None

class AnimatedCharacter(pygame.sprite.Sprite):
    """Exemple d'utilisation du AnimationController"""
    
    def __init__(self, x, y):
        super().__init__()
        
        self.animator = AnimationController()
        self.setup_animations()
        
        self.direction = 1
        self.image = self.animator.get_frame()
        self.rect = self.image.get_rect(center=(x, y))
    
    def setup_animations(self):
        """Configure les animations"""
        # Créer des animations placeholder
        def make_frames(color, count):
            frames = []
            for i in range(count):
                surf = pygame.Surface((48, 64), pygame.SRCALPHA)
                brightness = 180 + (i * 15) % 75
                adjusted = tuple(min(255, int(c * brightness / 200)) for c in color)
                surf.fill(adjusted)
                frames.append(surf)
            return frames
        
        self.animator.add_animation('idle', make_frames((100, 200, 255), 4), 0.15)
        self.animator.add_animation('run', make_frames((100, 255, 200), 6), 0.08)
        self.animator.add_animation('jump', make_frames((255, 200, 100), 2), 0.2)
        self.animator.add_animation('attack', make_frames((255, 100, 100), 4), 0.06, loop=False)
        self.animator.add_animation('hurt', make_frames((255, 50, 50), 2), 0.1, loop=False)
        self.animator.add_animation('die', make_frames((100, 100, 100), 6), 0.15, loop=False)
    
    def update(self, dt, keys):
        # Logique simplifiée pour l'exemple
        if keys[pygame.K_SPACE]:
            self.animator.play('attack')
        elif keys[pygame.K_LEFT] or keys[pygame.K_RIGHT]:
            self.animator.play('run')
            if keys[pygame.K_LEFT]:
                self.direction = -1
            else:
                self.direction = 1
        else:
            # Si l'animation d'attaque n'est pas finie, ne pas changer
            if self.animator.is_finished() or self.animator.current_name != 'attack':
                self.animator.play('idle')
        
        # Mettre à jour
        frame = self.animator.update(dt)
        if frame:
            self.image = frame
            if self.direction == -1:
                self.image = pygame.transform.flip(frame, True, False)
```

## Chargement de spritesheets

### Utilitaire de chargement

```python
import pygame
import json

class SpritesheetLoader:
    """Utilitaire pour charger des spritesheets"""
    
    @staticmethod
    def load_strip(filename, frame_width, frame_height, frame_count, scale=1.0):
        """Charge une spritesheet en bande horizontale"""
        try:
            sheet = pygame.image.load(filename).convert_alpha()
        except pygame.error as e:
            print(f"Erreur chargement spritesheet: {e}")
            return SpritesheetLoader._create_placeholder_frames(
                frame_width, frame_height, frame_count
            )
        
        frames = []
        for i in range(frame_count):
            rect = pygame.Rect(i * frame_width, 0, frame_width, frame_height)
            frame = sheet.subsurface(rect).copy()
            
            if scale != 1.0:
                new_size = (int(frame_width * scale), int(frame_height * scale))
                frame = pygame.transform.scale(frame, new_size)
            
            frames.append(frame)
        
        return frames
    
    @staticmethod
    def load_grid(filename, frame_width, frame_height, columns, rows, scale=1.0):
        """Charge une spritesheet en grille"""
        try:
            sheet = pygame.image.load(filename).convert_alpha()
        except pygame.error as e:
            print(f"Erreur chargement spritesheet: {e}")
            return SpritesheetLoader._create_placeholder_frames(
                frame_width, frame_height, columns * rows
            )
        
        frames = []
        for row in range(rows):
            for col in range(columns):
                rect = pygame.Rect(
                    col * frame_width, 
                    row * frame_height, 
                    frame_width, 
                    frame_height
                )
                frame = sheet.subsurface(rect).copy()
                
                if scale != 1.0:
                    new_size = (int(frame_width * scale), int(frame_height * scale))
                    frame = pygame.transform.scale(frame, new_size)
                
                frames.append(frame)
        
        return frames
    
    @staticmethod
    def load_from_json(json_path, sheet_path):
        """
        Charge une spritesheet avec un fichier JSON de métadonnées
        Format attendu :
        {
            "animations": {
                "idle": {"row": 0, "frames": 4, "speed": 0.15},
                "run": {"row": 1, "frames": 6, "speed": 0.08}
            },
            "frame_width": 48,
            "frame_height": 48
        }
        """
        with open(json_path, 'r') as f:
            data = json.load(f)
        
        sheet = pygame.image.load(sheet_path).convert_alpha()
        
        animations = {}
        fw = data['frame_width']
        fh = data['frame_height']
        
        for name, anim_data in data['animations'].items():
            row = anim_data['row']
            frame_count = anim_data['frames']
            speed = anim_data.get('speed', 0.1)
            loop = anim_data.get('loop', True)
            
            frames = []
            for i in range(frame_count):
                rect = pygame.Rect(i * fw, row * fh, fw, fh)
                frame = sheet.subsurface(rect).copy()
                frames.append(frame)
            
            animations[name] = {
                'frames': frames,
                'speed': speed,
                'loop': loop
            }
        
        return animations
    
    @staticmethod
    def _create_placeholder_frames(width, height, count):
        """Crée des frames placeholder si le fichier n'existe pas"""
        frames = []
        for i in range(count):
            surf = pygame.Surface((width, height))
            surf.fill((255, 0, 255))  # Magenta pour indiquer l'erreur
            frames.append(surf)
        return frames

# Utilisation
"""
# Charger une bande horizontale
player_idle = SpritesheetLoader.load_strip(
    "assets/player_idle.png", 
    frame_width=48, 
    frame_height=48, 
    frame_count=4,
    scale=2.0
)

# Charger une grille
explosion = SpritesheetLoader.load_grid(
    "assets/explosion.png",
    frame_width=64,
    frame_height=64,
    columns=8,
    rows=2,
    scale=1.5
)
"""
```

## Système de particules

### Particule simple

```python
import pygame
import random
import math

class Particle:
    """Particule individuelle"""
    
    def __init__(self, x, y, color, vel_x=0, vel_y=0, lifetime=1.0, 
                 size=5, gravity=0, shrink=True):
        self.x = x
        self.y = y
        self.color = color
        self.vel_x = vel_x
        self.vel_y = vel_y
        self.lifetime = lifetime
        self.max_lifetime = lifetime
        self.size = size
        self.initial_size = size
        self.gravity = gravity
        self.shrink = shrink
        self.alive = True
    
    def update(self, dt):
        # Appliquer la gravité
        self.vel_y += self.gravity * dt
        
        # Déplacer
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt
        
        # Réduire la durée de vie
        self.lifetime -= dt
        
        # Réduire la taille
        if self.shrink:
            progress = self.lifetime / self.max_lifetime
            self.size = self.initial_size * progress
        
        if self.lifetime <= 0:
            self.alive = False
    
    def draw(self, surface):
        if self.alive and self.size > 0:
            # Calculer l'opacité basée sur la durée de vie
            alpha = int(255 * (self.lifetime / self.max_lifetime))
            
            # Créer une surface avec alpha
            particle_surface = pygame.Surface(
                (int(self.size * 2), int(self.size * 2)), 
                pygame.SRCALPHA
            )
            
            color_with_alpha = (*self.color[:3], alpha)
            pygame.draw.circle(
                particle_surface, 
                color_with_alpha,
                (int(self.size), int(self.size)), 
                int(self.size)
            )
            
            surface.blit(
                particle_surface, 
                (int(self.x - self.size), int(self.y - self.size))
            )

class ParticleEmitter:
    """Émetteur de particules"""
    
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.particles = []
        
        # Paramètres par défaut
        self.emission_rate = 10  # Particules par seconde
        self.emission_timer = 0
        self.active = True
        
        # Propriétés des particules
        self.color = (255, 200, 100)
        self.color_variation = 30
        self.speed_min = 50
        self.speed_max = 150
        self.angle_min = 0
        self.angle_max = 360
        self.lifetime_min = 0.5
        self.lifetime_max = 1.5
        self.size_min = 3
        self.size_max = 8
        self.gravity = 200
    
    def emit(self, count=1):
        """Émet un certain nombre de particules"""
        for _ in range(count):
            # Couleur avec variation
            color = tuple(
                max(0, min(255, c + random.randint(-self.color_variation, 
                                                    self.color_variation)))
                for c in self.color
            )
            
            # Angle et vitesse aléatoires
            angle = math.radians(random.uniform(self.angle_min, self.angle_max))
            speed = random.uniform(self.speed_min, self.speed_max)
            
            vel_x = math.cos(angle) * speed
            vel_y = math.sin(angle) * speed
            
            particle = Particle(
                x=self.x,
                y=self.y,
                color=color,
                vel_x=vel_x,
                vel_y=vel_y,
                lifetime=random.uniform(self.lifetime_min, self.lifetime_max),
                size=random.uniform(self.size_min, self.size_max),
                gravity=self.gravity
            )
            
            self.particles.append(particle)
    
    def update(self, dt):
        # Émission continue
        if self.active:
            self.emission_timer += dt
            while self.emission_timer >= 1.0 / self.emission_rate:
                self.emission_timer -= 1.0 / self.emission_rate
                self.emit(1)
        
        # Mise à jour des particules
        for particle in self.particles[:]:
            particle.update(dt)
            if not particle.alive:
                self.particles.remove(particle)
    
    def draw(self, surface):
        for particle in self.particles:
            particle.draw(surface)

class ParticleSystem:
    """Système global de gestion des particules"""
    
    def __init__(self):
        self.emitters = []
        self.one_shot_particles = []
    
    def add_emitter(self, emitter):
        self.emitters.append(emitter)
    
    def remove_emitter(self, emitter):
        if emitter in self.emitters:
            self.emitters.remove(emitter)
    
    def burst(self, x, y, count, color=(255, 255, 255), 
              speed_min=100, speed_max=300, lifetime=1.0, gravity=0):
        """Crée une explosion de particules"""
        for _ in range(count):
            angle = random.uniform(0, 2 * math.pi)
            speed = random.uniform(speed_min, speed_max)
            
            particle = Particle(
                x=x,
                y=y,
                color=color,
                vel_x=math.cos(angle) * speed,
                vel_y=math.sin(angle) * speed,
                lifetime=lifetime * random.uniform(0.8, 1.2),
                size=random.uniform(3, 8),
                gravity=gravity
            )
            self.one_shot_particles.append(particle)
    
    def update(self, dt):
        # Mettre à jour les émetteurs
        for emitter in self.emitters:
            emitter.update(dt)
        
        # Mettre à jour les particules one-shot
        for particle in self.one_shot_particles[:]:
            particle.update(dt)
            if not particle.alive:
                self.one_shot_particles.remove(particle)
    
    def draw(self, surface):
        # Dessiner les émetteurs
        for emitter in self.emitters:
            emitter.draw(surface)
        
        # Dessiner les particules one-shot
        for particle in self.one_shot_particles:
            particle.draw(surface)

# Exemple d'utilisation
pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

particle_system = ParticleSystem()

# Créer un émetteur de feu
fire_emitter = ParticleEmitter(400, 500)
fire_emitter.color = (255, 150, 50)
fire_emitter.angle_min = 250  # Vers le haut
fire_emitter.angle_max = 290
fire_emitter.speed_min = 100
fire_emitter.speed_max = 200
fire_emitter.gravity = -100  # Particules montent
fire_emitter.emission_rate = 30

particle_system.add_emitter(fire_emitter)

running = True
while running:
    dt = clock.tick(60) / 1000.0
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            # Explosion de particules au clic
            particle_system.burst(
                event.pos[0], event.pos[1],
                count=50,
                color=(100, 200, 255),
                speed_min=150,
                speed_max=400,
                lifetime=0.8,
                gravity=300
            )
    
    # Déplacer l'émetteur avec la souris
    mouse_pos = pygame.mouse.get_pos()
    fire_emitter.x = mouse_pos[0]
    fire_emitter.y = mouse_pos[1]
    
    particle_system.update(dt)
    
    screen.fill((30, 30, 30))
    particle_system.draw(screen)
    
    # Afficher le nombre de particules
    font = pygame.font.Font(None, 30)
    total = (sum(len(e.particles) for e in particle_system.emitters) + 
             len(particle_system.one_shot_particles))
    text = font.render(f"Particules: {total}", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    
    pygame.display.flip()

pygame.quit()
```

## Effets visuels

### Flash et clignotement

```python
import pygame

class FlashEffect:
    """Effet de flash pour un sprite"""
    
    def __init__(self, sprite, flash_color=(255, 255, 255), duration=0.1):
        self.sprite = sprite
        self.original_image = sprite.image.copy()
        self.flash_color = flash_color
        self.duration = duration
        self.timer = 0
        self.is_flashing = False
    
    def start_flash(self):
        self.is_flashing = True
        self.timer = self.duration
        
        # Créer l'image flash
        self.flash_image = self.original_image.copy()
        self.flash_image.fill(self.flash_color, special_flags=pygame.BLEND_ADD)
    
    def update(self, dt):
        if self.is_flashing:
            self.timer -= dt
            if self.timer <= 0:
                self.is_flashing = False
                self.sprite.image = self.original_image
            else:
                self.sprite.image = self.flash_image
    
    def update_original(self):
        """Appeler si l'image du sprite change"""
        self.original_image = self.sprite.image.copy()

class BlinkEffect:
    """Effet de clignotement (invincibilité, etc.)"""
    
    def __init__(self, sprite, blink_rate=0.1, duration=1.0):
        self.sprite = sprite
        self.blink_rate = blink_rate
        self.duration = duration
        self.timer = 0
        self.blink_timer = 0
        self.visible = True
        self.is_blinking = False
    
    def start(self, duration=None):
        self.is_blinking = True
        self.timer = duration if duration else self.duration
        self.blink_timer = 0
        self.visible = True
    
    def stop(self):
        self.is_blinking = False
        self.visible = True
    
    def update(self, dt):
        if not self.is_blinking:
            return
        
        self.timer -= dt
        self.blink_timer += dt
        
        if self.blink_timer >= self.blink_rate:
            self.blink_timer = 0
            self.visible = not self.visible
        
        if self.timer <= 0:
            self.stop()
    
    def should_draw(self):
        return self.visible
```

### Interpolation et transitions

```python
import pygame
import math

def lerp(a, b, t):
    """Interpolation linéaire"""
    return a + (b - a) * t

def ease_in_out_quad(t):
    """Easing quadratique (entrée et sortie douces)"""
    if t < 0.5:
        return 2 * t * t
    return 1 - (-2 * t + 2) ** 2 / 2

def ease_out_elastic(t):
    """Easing élastique (effet rebond)"""
    if t == 0 or t == 1:
        return t
    return pow(2, -10 * t) * math.sin((t * 10 - 0.75) * (2 * math.pi) / 3) + 1

def ease_out_bounce(t):
    """Easing rebond"""
    n1 = 7.5625
    d1 = 2.75
    
    if t < 1 / d1:
        return n1 * t * t
    elif t < 2 / d1:
        t -= 1.5 / d1
        return n1 * t * t + 0.75
    elif t < 2.5 / d1:
        t -= 2.25 / d1
        return n1 * t * t + 0.9375
    else:
        t -= 2.625 / d1
        return n1 * t * t + 0.984375

class Tween:
    """Animation d'interpolation"""
    
    def __init__(self, target, property_name, start_value, end_value, 
                 duration, easing=None):
        self.target = target
        self.property_name = property_name
        self.start_value = start_value
        self.end_value = end_value
        self.duration = duration
        self.easing = easing or (lambda t: t)  # Linéaire par défaut
        
        self.elapsed = 0
        self.finished = False
    
    def update(self, dt):
        if self.finished:
            return
        
        self.elapsed += dt
        progress = min(self.elapsed / self.duration, 1.0)
        
        # Appliquer l'easing
        eased_progress = self.easing(progress)
        
        # Calculer la nouvelle valeur
        if isinstance(self.start_value, (list, tuple)):
            # Interpoler chaque composant
            new_value = tuple(
                lerp(s, e, eased_progress) 
                for s, e in zip(self.start_value, self.end_value)
            )
        else:
            new_value = lerp(self.start_value, self.end_value, eased_progress)
        
        # Appliquer au target
        setattr(self.target, self.property_name, new_value)
        
        if progress >= 1.0:
            self.finished = True

class TweenManager:
    """Gère plusieurs tweens"""
    
    def __init__(self):
        self.tweens = []
    
    def add(self, tween):
        self.tweens.append(tween)
        return tween
    
    def create(self, target, property_name, start, end, duration, easing=None):
        tween = Tween(target, property_name, start, end, duration, easing)
        self.tweens.append(tween)
        return tween
    
    def update(self, dt):
        for tween in self.tweens[:]:
            tween.update(dt)
            if tween.finished:
                self.tweens.remove(tween)

# Exemple d'utilisation
class AnimatedButton(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((100, 40))
        self.image.fill((100, 100, 200))
        self.rect = self.image.get_rect(center=(x, y))
        
        self.scale = 1.0
        self.original_size = (100, 40)
    
    def hover_animation(self, tween_manager):
        tween_manager.create(
            self, 'scale', 
            1.0, 1.2, 
            0.2, 
            ease_out_elastic
        )
    
    def update(self, dt):
        # Appliquer le scale
        new_width = int(self.original_size[0] * self.scale)
        new_height = int(self.original_size[1] * self.scale)
        center = self.rect.center
        
        self.image = pygame.Surface((new_width, new_height))
        self.image.fill((100, 100, 200))
        self.rect = self.image.get_rect(center=center)
```

## Exercice complet : Personnage animé avec effets

```python
"""
Personnage complet avec animations, particules et effets
"""
import pygame
import math
import random

pygame.init()

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Personnage Animé")
clock = pygame.time.Clock()

# Système de particules simplifié
class SimpleParticle:
    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        angle = random.uniform(0, 2 * math.pi)
        speed = random.uniform(50, 150)
        self.vel_x = math.cos(angle) * speed
        self.vel_y = math.sin(angle) * speed
        self.color = color
        self.size = random.uniform(3, 6)
        self.lifetime = random.uniform(0.3, 0.6)
        self.max_lifetime = self.lifetime
    
    def update(self, dt):
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt
        self.vel_y += 200 * dt  # Gravité
        self.lifetime -= dt
        return self.lifetime > 0
    
    def draw(self, surface):
        alpha = int(255 * (self.lifetime / self.max_lifetime))
        size = int(self.size * (self.lifetime / self.max_lifetime))
        if size > 0:
            surf = pygame.Surface((size * 2, size * 2), pygame.SRCALPHA)
            pygame.draw.circle(surf, (*self.color, alpha), (size, size), size)
            surface.blit(surf, (self.x - size, self.y - size))

particles = []

# Classe d'animation simple
class SimpleAnimation:
    def __init__(self, colors, speed=0.1):
        self.frames = []
        for color in colors:
            surf = pygame.Surface((48, 64), pygame.SRCALPHA)
            surf.fill(color)
            self.frames.append(surf)
        self.speed = speed
        self.current = 0
        self.timer = 0
    
    def update(self, dt):
        self.timer += dt
        if self.timer >= self.speed:
            self.timer = 0
            self.current = (self.current + 1) % len(self.frames)
    
    def get_frame(self):
        return self.frames[self.current]

class Character(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        
        # Créer les animations
        self.animations = {
            'idle': SimpleAnimation([
                (100, 180, 255), (110, 190, 255), 
                (120, 200, 255), (110, 190, 255)
            ], 0.2),
            'run': SimpleAnimation([
                (80, 200, 180), (90, 210, 190),
                (100, 220, 200), (90, 210, 190),
                (80, 200, 180), (70, 190, 170)
            ], 0.08),
            'jump': SimpleAnimation([
                (200, 200, 100), (210, 210, 110)
            ], 0.2),
            'hurt': SimpleAnimation([
                (255, 100, 100), (255, 150, 150)
            ], 0.05)
        }
        
        self.current_anim = 'idle'
        self.direction = 1
        
        self.image = self.animations[self.current_anim].get_frame()
        self.rect = self.image.get_rect(center=(x, y))
        
        # Physique
        self.vel_x = 0
        self.vel_y = 0
        self.speed = 300
        self.jump_force = -500
        self.gravity = 1200
        self.on_ground = True
        
        # Effets
        self.invincible = False
        self.invincible_timer = 0
        self.flash_timer = 0
        self.visible = True
        
        # Trail de mouvement
        self.trail = []
        self.trail_timer = 0
    
    def take_damage(self):
        global particles
        if self.invincible:
            return
        
        self.current_anim = 'hurt'
        self.invincible = True
        self.invincible_timer = 1.0
        
        # Particules de dégâts
        for _ in range(20):
            particles.append(SimpleParticle(
                self.rect.centerx, 
                self.rect.centery,
                (255, 100, 100)
            ))
    
    def update(self, dt, keys):
        global particles
        
        # Gestion de l'invincibilité
        if self.invincible:
            self.invincible_timer -= dt
            self.flash_timer += dt
            if self.flash_timer > 0.05:
                self.flash_timer = 0
                self.visible = not self.visible
            
            if self.invincible_timer <= 0:
                self.invincible = False
                self.visible = True
                self.current_anim = 'idle'
        
        # Mouvement horizontal
        self.vel_x = 0
        if keys[pygame.K_LEFT]:
            self.vel_x = -self.speed
            self.direction = -1
        if keys[pygame.K_RIGHT]:
            self.vel_x = self.speed
            self.direction = 1
        
        # Gravité
        self.vel_y += self.gravity * dt
        
        # Déplacement
        self.rect.x += self.vel_x * dt
        self.rect.y += self.vel_y * dt
        
        # Sol
        if self.rect.bottom > 500:
            self.rect.bottom = 500
            self.vel_y = 0
            if not self.on_ground:
                # Particules d'atterrissage
                for _ in range(10):
                    particles.append(SimpleParticle(
                        self.rect.centerx + random.randint(-20, 20),
                        self.rect.bottom,
                        (150, 150, 150)
                    ))
            self.on_ground = True
        else:
            self.on_ground = False
        
        # Animation
        if not self.invincible:
            if not self.on_ground:
                self.current_anim = 'jump'
            elif abs(self.vel_x) > 0:
                self.current_anim = 'run'
                # Trail en courant
                self.trail_timer += dt
                if self.trail_timer > 0.05:
                    self.trail_timer = 0
                    self.trail.append({
                        'pos': (self.rect.centerx, self.rect.centery),
                        'alpha': 100
                    })
            else:
                self.current_anim = 'idle'
        
        # Mettre à jour le trail
        for t in self.trail[:]:
            t['alpha'] -= 200 * dt
            if t['alpha'] <= 0:
                self.trail.remove(t)
        
        # Mettre à jour l'animation
        self.animations[self.current_anim].update(dt)
        frame = self.animations[self.current_anim].get_frame()
        
        if self.direction == -1:
            frame = pygame.transform.flip(frame, True, False)
        
        self.image = frame
        
        # Limiter aux bords
        self.rect.clamp_ip(pygame.Rect(0, 0, SCREEN_WIDTH, 600))
    
    def jump(self):
        global particles
        if self.on_ground:
            self.vel_y = self.jump_force
            self.on_ground = False
            
            # Particules de saut
            for _ in range(8):
                particles.append(SimpleParticle(
                    self.rect.centerx + random.randint(-15, 15),
                    self.rect.bottom,
                    (100, 200, 255)
                ))
    
    def draw(self, surface):
        # Dessiner le trail
        for t in self.trail:
            alpha = int(t['alpha'])
            if alpha > 0:
                trail_surf = pygame.Surface((48, 64), pygame.SRCALPHA)
                trail_surf.fill((100, 180, 255, alpha))
                trail_rect = trail_surf.get_rect(center=t['pos'])
                surface.blit(trail_surf, trail_rect)
        
        # Dessiner le personnage
        if self.visible:
            surface.blit(self.image, self.rect)

# Créer le personnage
character = Character(400, 400)

# Plateformes
platforms = [
    pygame.Rect(0, 500, 800, 100),
    pygame.Rect(200, 400, 150, 20),
    pygame.Rect(450, 320, 150, 20),
]

font = pygame.font.Font(None, 36)

running = True
while running:
    dt = clock.tick(60) / 1000.0
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                character.jump()
            elif event.key == pygame.K_h:
                character.take_damage()
    
    keys = pygame.key.get_pressed()
    character.update(dt, keys)
    
    # Mettre à jour les particules
    particles = [p for p in particles if p.update(dt)]
    
    # Rendu
    screen.fill((40, 40, 60))
    
    # Dessiner les plateformes
    for plat in platforms:
        pygame.draw.rect(screen, (80, 80, 100), plat)
    
    # Dessiner les particules
    for p in particles:
        p.draw(screen)
    
    # Dessiner le personnage
    character.draw(screen)
    
    # Interface
    instructions = [
        "Flèches: Déplacer",
        "Espace: Sauter",
        "H: Prendre des dégâts"
    ]
    for i, text in enumerate(instructions):
        surf = font.render(text, True, (200, 200, 200))
        screen.blit(surf, (10, 10 + i * 30))
    
    pygame.display.flip()

pygame.quit()
```

## Bonnes pratiques

### ✅ À faire

- **Utiliser `convert()` et `convert_alpha()`** : Optimise le rendu
- **Grouper les sprites** : Facilite la gestion et le rendu
- **Pré-charger les ressources** : Évite les lags en jeu
- **Utiliser des masques** pour les collisions précises : Quand nécessaire
- **Réutiliser les objets** : Pool d'objets pour les projectiles/particules

### ❌ À éviter

- **Créer des surfaces dans la boucle** : Très coûteux
- **Oublier d'appeler `super().__init__()`** : Cause des erreurs
- **Trop de particules** : Impact les performances
- **Animations non optimisées** : Charger les frames à chaque frame

## Ressources

- **Documentation Pygame Sprites** : https://www.pygame.org/docs/ref/sprite.html
- **OpenGameArt** : https://opengameart.org (spritesheets gratuits)
- **Kenney Assets** : https://kenney.nl/assets (assets de qualité gratuits)
- **Itch.io** : https://itch.io/game-assets/free (assets variés)
