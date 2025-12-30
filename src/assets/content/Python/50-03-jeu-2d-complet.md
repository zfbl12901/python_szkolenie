---
title: "Projet : Jeu 2D Complet"
order: 3
parent: "50-projets-pratiques.md"
tags: ["python", "projects", "games", "pygame", "2d", "complete"]
---

# Projet : Jeu 2D Complet - Space Defender

## Présentation du projet

Dans ce projet pratique, nous allons créer un jeu de type **shoot'em up spatial** complet avec Pygame. Ce projet intègre tous les concepts vus dans les modules précédents : sprites, animations, collisions, système de particules, sons, gestion d'états et interface utilisateur.

### Caractéristiques du jeu

- **Genre** : Shoot'em up vertical (type Space Invaders / Galaga)
- **Objectif** : Survivre aux vagues d'ennemis et marquer le plus de points
- **Contrôles** : Clavier (flèches/WASD) et souris
- **Fonctionnalités** :
  - Système de vagues progressives
  - Power-ups et bonus
  - Système de score avec high scores
  - Effets visuels (particules, explosions)
  - Sons et musique
  - Menu et écrans de jeu

## Structure du projet

```
space_defender/
│
├── main.py              # Point d'entrée
├── settings.py          # Constantes et configuration
├── game.py              # Classe principale du jeu
│
├── entities/
│   ├── __init__.py
│   ├── player.py        # Joueur
│   ├── enemy.py         # Ennemis
│   ├── projectile.py    # Projectiles
│   └── powerup.py       # Power-ups
│
├── systems/
│   ├── __init__.py
│   ├── particle.py      # Système de particules
│   ├── wave.py          # Gestion des vagues
│   └── score.py         # Gestion des scores
│
├── ui/
│   ├── __init__.py
│   ├── menu.py          # Menu principal
│   ├── hud.py           # Interface en jeu
│   └── screens.py       # Écrans (pause, game over)
│
├── utils/
│   ├── __init__.py
│   ├── assets.py        # Chargement des ressources
│   └── helpers.py       # Fonctions utilitaires
│
└── assets/
    ├── images/
    ├── sounds/
    └── fonts/
```

## Fichier de configuration : settings.py

```python
"""
Configuration globale du jeu
"""
import pygame

# Écran
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60
TITLE = "Space Defender"

# Couleurs
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 50, 50)
GREEN = (50, 255, 50)
BLUE = (50, 150, 255)
YELLOW = (255, 255, 50)
ORANGE = (255, 165, 0)
PURPLE = (180, 50, 255)
CYAN = (50, 255, 255)

# Couleurs du jeu
BG_COLOR = (10, 10, 30)
STAR_COLOR = (200, 200, 255)

# Joueur
PLAYER_SPEED = 350
PLAYER_HEALTH = 100
PLAYER_FIRE_RATE = 0.15  # Secondes entre les tirs
PLAYER_INVINCIBILITY_TIME = 2.0

# Projectiles
BULLET_SPEED = 600
BULLET_DAMAGE = 25
ENEMY_BULLET_SPEED = 400

# Ennemis
ENEMY_TYPES = {
    'basic': {
        'health': 25,
        'speed': 100,
        'score': 50,
        'color': RED,
        'size': (30, 30),
        'fire_rate': 2.0
    },
    'fast': {
        'health': 15,
        'speed': 200,
        'score': 75,
        'color': YELLOW,
        'size': (25, 25),
        'fire_rate': 1.5
    },
    'tank': {
        'health': 100,
        'speed': 50,
        'score': 150,
        'color': PURPLE,
        'size': (45, 45),
        'fire_rate': 3.0
    },
    'boss': {
        'health': 500,
        'speed': 30,
        'score': 1000,
        'color': ORANGE,
        'size': (80, 60),
        'fire_rate': 0.5
    }
}

# Power-ups
POWERUP_DURATION = 10.0
POWERUP_SPEED = 80
POWERUP_TYPES = {
    'health': {'color': GREEN, 'effect': 'heal'},
    'rapid_fire': {'color': ORANGE, 'effect': 'fire_rate'},
    'shield': {'color': CYAN, 'effect': 'invincibility'},
    'spread': {'color': PURPLE, 'effect': 'spread_shot'},
    'bomb': {'color': RED, 'effect': 'clear_screen'}
}

# Vagues
WAVE_DELAY = 3.0  # Secondes entre les vagues
```

## Entités : player.py

```python
"""
Classe du joueur
"""
import pygame
import math
from settings import *

class Player(pygame.sprite.Sprite):
    """Vaisseau du joueur"""
    
    def __init__(self, x, y, groups, bullet_group, particle_system):
        super().__init__(groups)
        
        # Graphiques
        self.original_image = self._create_ship_image()
        self.image = self.original_image.copy()
        self.rect = self.image.get_rect(center=(x, y))
        
        # Position précise (float)
        self.pos = pygame.math.Vector2(x, y)
        
        # Références
        self.bullet_group = bullet_group
        self.particles = particle_system
        
        # Stats
        self.health = PLAYER_HEALTH
        self.max_health = PLAYER_HEALTH
        self.speed = PLAYER_SPEED
        
        # Tir
        self.fire_rate = PLAYER_FIRE_RATE
        self.fire_timer = 0
        self.spread_shot = False
        self.rapid_fire = False
        
        # Invincibilité
        self.invincible = False
        self.invincible_timer = 0
        self.blink_timer = 0
        self.visible = True
        
        # Power-ups actifs
        self.active_powerups = {}
        
        # Mouvement
        self.velocity = pygame.math.Vector2(0, 0)
        
        # Thruster animation
        self.thruster_timer = 0
    
    def _create_ship_image(self):
        """Crée l'image du vaisseau"""
        surface = pygame.Surface((40, 50), pygame.SRCALPHA)
        
        # Corps principal
        pygame.draw.polygon(surface, BLUE, [
            (20, 0),   # Pointe
            (40, 45),  # Bas droite
            (20, 35),  # Centre bas
            (0, 45)    # Bas gauche
        ])
        
        # Détails
        pygame.draw.polygon(surface, CYAN, [
            (20, 5),
            (35, 40),
            (20, 32),
            (5, 40)
        ])
        
        # Cockpit
        pygame.draw.ellipse(surface, WHITE, (14, 15, 12, 15))
        pygame.draw.ellipse(surface, CYAN, (16, 17, 8, 11))
        
        return surface
    
    def update(self, dt):
        """Mise à jour du joueur"""
        # Mouvement
        self._handle_movement(dt)
        
        # Tir automatique avec souris
        self.fire_timer -= dt
        if pygame.mouse.get_pressed()[0]:
            self.fire()
        
        # Mise à jour des power-ups
        self._update_powerups(dt)
        
        # Invincibilité
        if self.invincible:
            self.invincible_timer -= dt
            self.blink_timer += dt
            
            if self.blink_timer > 0.1:
                self.blink_timer = 0
                self.visible = not self.visible
            
            if self.invincible_timer <= 0:
                self.invincible = False
                self.visible = True
        
        # Particules du propulseur
        self._update_thruster(dt)
        
        # Mettre à jour l'image
        if self.visible:
            self.image = self.original_image.copy()
        else:
            self.image = pygame.Surface((40, 50), pygame.SRCALPHA)
    
    def _handle_movement(self, dt):
        """Gestion du mouvement"""
        keys = pygame.key.get_pressed()
        
        self.velocity.x = 0
        self.velocity.y = 0
        
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.velocity.x = -1
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.velocity.x = 1
        if keys[pygame.K_UP] or keys[pygame.K_w]:
            self.velocity.y = -1
        if keys[pygame.K_DOWN] or keys[pygame.K_s]:
            self.velocity.y = 1
        
        # Normaliser pour vitesse constante en diagonale
        if self.velocity.length() > 0:
            self.velocity = self.velocity.normalize()
        
        # Appliquer le mouvement
        self.pos += self.velocity * self.speed * dt
        
        # Limiter aux bords
        self.pos.x = max(25, min(SCREEN_WIDTH - 25, self.pos.x))
        self.pos.y = max(25, min(SCREEN_HEIGHT - 25, self.pos.y))
        
        self.rect.center = self.pos
    
    def _update_thruster(self, dt):
        """Effet de propulseur"""
        self.thruster_timer += dt
        
        if self.velocity.y < 0 or self.thruster_timer > 0.02:
            self.thruster_timer = 0
            
            # Émettre des particules
            offset = pygame.math.Vector2(0, 25)
            self.particles.emit(
                x=self.pos.x + offset.x,
                y=self.pos.y + offset.y,
                count=2,
                color=(255, 150, 50),
                speed_range=(50, 150),
                angle_range=(80, 100),  # Vers le bas
                lifetime_range=(0.1, 0.3),
                size_range=(3, 6)
            )
    
    def fire(self):
        """Tirer un projectile"""
        if self.fire_timer <= 0:
            # Calculer le fire rate avec power-up
            rate = self.fire_rate / 2 if self.rapid_fire else self.fire_rate
            self.fire_timer = rate
            
            if self.spread_shot:
                # Tir en éventail
                angles = [-15, 0, 15]
                for angle in angles:
                    self._spawn_bullet(angle)
            else:
                self._spawn_bullet(0)
    
    def _spawn_bullet(self, angle_offset):
        """Créer un projectile"""
        from entities.projectile import PlayerBullet
        
        # Direction vers le haut avec offset
        direction = pygame.math.Vector2(0, -1).rotate(angle_offset)
        
        bullet = PlayerBullet(
            x=self.pos.x,
            y=self.pos.y - 20,
            direction=direction,
            groups=(self.bullet_group,)
        )
    
    def _update_powerups(self, dt):
        """Mise à jour des timers de power-ups"""
        expired = []
        
        for powerup_type, timer in self.active_powerups.items():
            self.active_powerups[powerup_type] = timer - dt
            if self.active_powerups[powerup_type] <= 0:
                expired.append(powerup_type)
        
        for powerup_type in expired:
            del self.active_powerups[powerup_type]
            self._deactivate_powerup(powerup_type)
    
    def apply_powerup(self, powerup_type):
        """Appliquer un power-up"""
        self.active_powerups[powerup_type] = POWERUP_DURATION
        
        if powerup_type == 'health':
            self.health = min(self.health + 30, self.max_health)
        elif powerup_type == 'rapid_fire':
            self.rapid_fire = True
        elif powerup_type == 'shield':
            self.invincible = True
            self.invincible_timer = POWERUP_DURATION
        elif powerup_type == 'spread':
            self.spread_shot = True
    
    def _deactivate_powerup(self, powerup_type):
        """Désactiver un power-up expiré"""
        if powerup_type == 'rapid_fire':
            self.rapid_fire = False
        elif powerup_type == 'spread':
            self.spread_shot = False
    
    def take_damage(self, amount):
        """Prendre des dégâts"""
        if self.invincible:
            return False
        
        self.health -= amount
        
        # Particules de dégâts
        self.particles.emit(
            x=self.pos.x,
            y=self.pos.y,
            count=15,
            color=RED,
            speed_range=(100, 250),
            angle_range=(0, 360),
            lifetime_range=(0.3, 0.6),
            size_range=(4, 8)
        )
        
        # Invincibilité temporaire
        self.invincible = True
        self.invincible_timer = PLAYER_INVINCIBILITY_TIME
        
        return self.health <= 0
    
    def draw(self, surface):
        """Dessiner le joueur"""
        if self.visible:
            surface.blit(self.image, self.rect)
```

## Entités : enemy.py

```python
"""
Classes des ennemis
"""
import pygame
import math
import random
from settings import *

class Enemy(pygame.sprite.Sprite):
    """Classe de base pour les ennemis"""
    
    def __init__(self, x, y, enemy_type, groups, bullet_group, player):
        super().__init__(groups)
        
        # Configuration selon le type
        config = ENEMY_TYPES[enemy_type]
        
        self.enemy_type = enemy_type
        self.health = config['health']
        self.max_health = config['health']
        self.speed = config['speed']
        self.score_value = config['score']
        self.color = config['color']
        self.fire_rate = config['fire_rate']
        
        # Image
        size = config['size']
        self.image = self._create_image(size)
        self.rect = self.image.get_rect(center=(x, y))
        
        # Position
        self.pos = pygame.math.Vector2(x, y)
        
        # Références
        self.bullet_group = bullet_group
        self.player = player
        
        # Tir
        self.fire_timer = random.uniform(0, self.fire_rate)
        
        # Mouvement
        self.movement_pattern = self._get_movement_pattern()
        self.movement_timer = 0
        self.start_x = x
    
    def _create_image(self, size):
        """Créer l'image de l'ennemi"""
        surface = pygame.Surface(size, pygame.SRCALPHA)
        
        w, h = size
        
        # Corps principal
        pygame.draw.polygon(surface, self.color, [
            (w // 2, h),        # Bas centre
            (w, h // 3),        # Droite
            (w // 2, 0),        # Haut centre
            (0, h // 3)         # Gauche
        ])
        
        # Détails
        darker = tuple(max(0, c - 50) for c in self.color)
        pygame.draw.polygon(surface, darker, [
            (w // 2, h - 5),
            (w - 5, h // 3),
            (w // 2, 5),
            (5, h // 3)
        ])
        
        # "Yeux"
        pygame.draw.circle(surface, WHITE, (w // 3, h // 2), 4)
        pygame.draw.circle(surface, WHITE, (2 * w // 3, h // 2), 4)
        pygame.draw.circle(surface, BLACK, (w // 3, h // 2), 2)
        pygame.draw.circle(surface, BLACK, (2 * w // 3, h // 2), 2)
        
        return surface
    
    def _get_movement_pattern(self):
        """Définir le pattern de mouvement"""
        patterns = ['straight', 'sine', 'zigzag']
        return random.choice(patterns)
    
    def update(self, dt):
        """Mise à jour de l'ennemi"""
        self.movement_timer += dt
        
        # Mouvement selon le pattern
        if self.movement_pattern == 'straight':
            self.pos.y += self.speed * dt
        
        elif self.movement_pattern == 'sine':
            self.pos.y += self.speed * dt
            self.pos.x = self.start_x + math.sin(self.movement_timer * 3) * 50
        
        elif self.movement_pattern == 'zigzag':
            self.pos.y += self.speed * dt
            direction = 1 if int(self.movement_timer * 2) % 2 == 0 else -1
            self.pos.x += self.speed * 0.5 * direction * dt
        
        # Limiter X aux bords
        self.pos.x = max(30, min(SCREEN_WIDTH - 30, self.pos.x))
        
        self.rect.center = self.pos
        
        # Tir
        self.fire_timer -= dt
        if self.fire_timer <= 0 and self.pos.y < SCREEN_HEIGHT - 100:
            self.fire()
            self.fire_timer = self.fire_rate + random.uniform(-0.5, 0.5)
        
        # Hors écran = mort
        if self.pos.y > SCREEN_HEIGHT + 50:
            self.kill()
    
    def fire(self):
        """Tirer vers le joueur"""
        from entities.projectile import EnemyBullet
        
        # Direction vers le joueur
        to_player = pygame.math.Vector2(
            self.player.pos.x - self.pos.x,
            self.player.pos.y - self.pos.y
        )
        
        if to_player.length() > 0:
            to_player = to_player.normalize()
        else:
            to_player = pygame.math.Vector2(0, 1)
        
        EnemyBullet(
            x=self.pos.x,
            y=self.pos.y + 20,
            direction=to_player,
            groups=(self.bullet_group,)
        )
    
    def take_damage(self, amount, particle_system):
        """Prendre des dégâts"""
        self.health -= amount
        
        # Particules
        particle_system.emit(
            x=self.pos.x,
            y=self.pos.y,
            count=5,
            color=self.color,
            speed_range=(50, 150),
            angle_range=(0, 360),
            lifetime_range=(0.2, 0.4),
            size_range=(3, 6)
        )
        
        return self.health <= 0
    
    def explode(self, particle_system):
        """Explosion à la mort"""
        particle_system.emit(
            x=self.pos.x,
            y=self.pos.y,
            count=30,
            color=self.color,
            speed_range=(100, 300),
            angle_range=(0, 360),
            lifetime_range=(0.4, 0.8),
            size_range=(5, 12)
        )
        
        # Particules de feu
        particle_system.emit(
            x=self.pos.x,
            y=self.pos.y,
            count=20,
            color=ORANGE,
            speed_range=(50, 200),
            angle_range=(0, 360),
            lifetime_range=(0.3, 0.6),
            size_range=(4, 10)
        )

class Boss(Enemy):
    """Ennemi boss avec comportement spécial"""
    
    def __init__(self, x, y, groups, bullet_group, player):
        super().__init__(x, y, 'boss', groups, bullet_group, player)
        
        self.phase = 1
        self.attack_pattern = 0
        self.attack_timer = 0
    
    def update(self, dt):
        """Mise à jour du boss"""
        self.movement_timer += dt
        self.attack_timer += dt
        
        # Mouvement horizontal
        target_x = SCREEN_WIDTH // 2 + math.sin(self.movement_timer) * 200
        self.pos.x += (target_x - self.pos.x) * 2 * dt
        
        # Descendre jusqu'à une position
        if self.pos.y < 100:
            self.pos.y += 30 * dt
        
        self.rect.center = self.pos
        
        # Changer de phase selon la vie
        if self.health < self.max_health * 0.3:
            self.phase = 3
        elif self.health < self.max_health * 0.6:
            self.phase = 2
        
        # Attaques selon la phase
        self._attack(dt)
    
    def _attack(self, dt):
        """Patterns d'attaque du boss"""
        fire_interval = 1.0 / self.phase  # Plus rapide à chaque phase
        
        if self.attack_timer >= fire_interval:
            self.attack_timer = 0
            self.attack_pattern = (self.attack_pattern + 1) % 3
            
            if self.attack_pattern == 0:
                self._spread_attack()
            elif self.attack_pattern == 1:
                self._aimed_attack()
            else:
                self._circle_attack()
    
    def _spread_attack(self):
        """Attaque en éventail"""
        from entities.projectile import EnemyBullet
        
        angles = range(-30, 31, 15)
        for angle in angles:
            direction = pygame.math.Vector2(0, 1).rotate(angle)
            EnemyBullet(
                x=self.pos.x,
                y=self.pos.y + 30,
                direction=direction,
                groups=(self.bullet_group,)
            )
    
    def _aimed_attack(self):
        """Attaque ciblée"""
        self.fire()
        self.fire()  # Double tir
    
    def _circle_attack(self):
        """Attaque circulaire"""
        from entities.projectile import EnemyBullet
        
        for angle in range(0, 360, 30):
            direction = pygame.math.Vector2(0, 1).rotate(angle)
            EnemyBullet(
                x=self.pos.x,
                y=self.pos.y,
                direction=direction,
                groups=(self.bullet_group,)
            )
```

## Entités : projectile.py

```python
"""
Classes des projectiles
"""
import pygame
from settings import *

class Projectile(pygame.sprite.Sprite):
    """Classe de base pour les projectiles"""
    
    def __init__(self, x, y, direction, speed, damage, color, size, groups):
        super().__init__(groups)
        
        self.image = pygame.Surface(size, pygame.SRCALPHA)
        pygame.draw.ellipse(self.image, color, (0, 0, *size))
        
        # Effet de lueur
        glow_color = tuple(min(255, c + 50) for c in color)
        pygame.draw.ellipse(self.image, glow_color, 
                           (size[0]//4, size[1]//4, size[0]//2, size[1]//2))
        
        self.rect = self.image.get_rect(center=(x, y))
        
        self.pos = pygame.math.Vector2(x, y)
        self.direction = direction.normalize() if direction.length() > 0 else pygame.math.Vector2(0, -1)
        self.speed = speed
        self.damage = damage
    
    def update(self, dt):
        """Mise à jour du projectile"""
        self.pos += self.direction * self.speed * dt
        self.rect.center = self.pos
        
        # Détruire si hors écran
        if (self.rect.bottom < -10 or self.rect.top > SCREEN_HEIGHT + 10 or
            self.rect.right < -10 or self.rect.left > SCREEN_WIDTH + 10):
            self.kill()

class PlayerBullet(Projectile):
    """Projectile du joueur"""
    
    def __init__(self, x, y, direction, groups):
        super().__init__(
            x=x,
            y=y,
            direction=direction,
            speed=BULLET_SPEED,
            damage=BULLET_DAMAGE,
            color=CYAN,
            size=(6, 15),
            groups=groups
        )

class EnemyBullet(Projectile):
    """Projectile ennemi"""
    
    def __init__(self, x, y, direction, groups):
        super().__init__(
            x=x,
            y=y,
            direction=direction,
            speed=ENEMY_BULLET_SPEED,
            damage=15,
            color=RED,
            size=(8, 8),
            groups=groups
        )
```

## Entités : powerup.py

```python
"""
Classes des power-ups
"""
import pygame
import math
from settings import *

class PowerUp(pygame.sprite.Sprite):
    """Power-up collectible"""
    
    def __init__(self, x, y, powerup_type, groups):
        super().__init__(groups)
        
        self.powerup_type = powerup_type
        config = POWERUP_TYPES[powerup_type]
        self.color = config['color']
        self.effect = config['effect']
        
        # Image avec animation
        self.size = 25
        self.image = self._create_image()
        self.rect = self.image.get_rect(center=(x, y))
        
        self.pos = pygame.math.Vector2(x, y)
        self.speed = POWERUP_SPEED
        
        # Animation
        self.pulse_timer = 0
        self.rotation = 0
    
    def _create_image(self):
        """Créer l'image du power-up"""
        size = self.size * 2
        surface = pygame.Surface((size, size), pygame.SRCALPHA)
        
        # Fond
        pygame.draw.circle(surface, self.color, (size // 2, size // 2), self.size)
        
        # Icône selon le type
        center = size // 2
        
        if self.powerup_type == 'health':
            # Croix
            pygame.draw.rect(surface, WHITE, 
                           (center - 3, center - 10, 6, 20))
            pygame.draw.rect(surface, WHITE, 
                           (center - 10, center - 3, 20, 6))
        
        elif self.powerup_type == 'rapid_fire':
            # Flèches rapides
            for i in range(3):
                y = center - 8 + i * 8
                pygame.draw.polygon(surface, WHITE, [
                    (center - 8, y + 4),
                    (center + 8, y),
                    (center + 8, y + 8)
                ])
        
        elif self.powerup_type == 'shield':
            # Bouclier
            pygame.draw.arc(surface, WHITE, 
                           (center - 10, center - 10, 20, 20),
                           0.5, 2.6, 3)
        
        elif self.powerup_type == 'spread':
            # Éventail
            for angle in [-30, 0, 30]:
                rad = math.radians(angle - 90)
                x2 = center + math.cos(rad) * 12
                y2 = center + math.sin(rad) * 12
                pygame.draw.line(surface, WHITE, (center, center), (x2, y2), 2)
        
        elif self.powerup_type == 'bomb':
            # Explosion
            pygame.draw.circle(surface, WHITE, (center, center), 8, 2)
            for angle in range(0, 360, 45):
                rad = math.radians(angle)
                x1 = center + math.cos(rad) * 8
                y1 = center + math.sin(rad) * 8
                x2 = center + math.cos(rad) * 12
                y2 = center + math.sin(rad) * 12
                pygame.draw.line(surface, WHITE, (x1, y1), (x2, y2), 2)
        
        return surface
    
    def update(self, dt):
        """Mise à jour du power-up"""
        # Descendre
        self.pos.y += self.speed * dt
        self.rect.center = self.pos
        
        # Animation de pulsation
        self.pulse_timer += dt
        scale = 1 + math.sin(self.pulse_timer * 5) * 0.1
        
        # Rotation
        self.rotation += dt * 50
        
        # Recréer l'image avec effet
        self.image = self._create_image()
        self.image = pygame.transform.rotozoom(self.image, self.rotation, scale)
        self.rect = self.image.get_rect(center=self.pos)
        
        # Détruire si hors écran
        if self.pos.y > SCREEN_HEIGHT + 50:
            self.kill()
```

## Systèmes : particle.py

```python
"""
Système de particules
"""
import pygame
import math
import random
from settings import *

class Particle:
    """Particule individuelle"""
    
    def __init__(self, x, y, color, vel_x, vel_y, lifetime, size):
        self.x = x
        self.y = y
        self.color = color
        self.vel_x = vel_x
        self.vel_y = vel_y
        self.lifetime = lifetime
        self.max_lifetime = lifetime
        self.size = size
        self.initial_size = size
    
    def update(self, dt):
        """Mise à jour de la particule"""
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt
        
        # Friction
        self.vel_x *= 0.98
        self.vel_y *= 0.98
        
        # Réduire la durée de vie
        self.lifetime -= dt
        
        # Réduire la taille
        progress = self.lifetime / self.max_lifetime
        self.size = self.initial_size * progress
        
        return self.lifetime > 0
    
    def draw(self, surface):
        """Dessiner la particule"""
        if self.size > 0:
            alpha = int(255 * (self.lifetime / self.max_lifetime))
            
            # Surface avec alpha
            particle_surf = pygame.Surface(
                (int(self.size * 2), int(self.size * 2)), 
                pygame.SRCALPHA
            )
            
            color_with_alpha = (*self.color[:3], alpha)
            pygame.draw.circle(
                particle_surf, color_with_alpha,
                (int(self.size), int(self.size)), 
                int(self.size)
            )
            
            surface.blit(
                particle_surf, 
                (int(self.x - self.size), int(self.y - self.size))
            )

class ParticleSystem:
    """Gestionnaire de particules"""
    
    def __init__(self):
        self.particles = []
    
    def emit(self, x, y, count, color, speed_range, angle_range, 
             lifetime_range, size_range, gravity=0):
        """Émettre des particules"""
        
        for _ in range(count):
            angle = math.radians(random.uniform(*angle_range))
            speed = random.uniform(*speed_range)
            
            vel_x = math.cos(angle) * speed
            vel_y = math.sin(angle) * speed
            
            # Variation de couleur
            color_var = tuple(
                max(0, min(255, c + random.randint(-20, 20)))
                for c in color[:3]
            )
            
            particle = Particle(
                x=x,
                y=y,
                color=color_var,
                vel_x=vel_x,
                vel_y=vel_y,
                lifetime=random.uniform(*lifetime_range),
                size=random.uniform(*size_range)
            )
            
            self.particles.append(particle)
    
    def update(self, dt):
        """Mise à jour de toutes les particules"""
        self.particles = [p for p in self.particles if p.update(dt)]
    
    def draw(self, surface):
        """Dessiner toutes les particules"""
        for particle in self.particles:
            particle.draw(surface)
    
    def clear(self):
        """Effacer toutes les particules"""
        self.particles.clear()
```

## Systèmes : wave.py

```python
"""
Gestion des vagues d'ennemis
"""
import random
from settings import *
from entities.enemy import Enemy, Boss

class WaveManager:
    """Gestionnaire de vagues"""
    
    def __init__(self, enemy_group, enemy_bullet_group, player):
        self.enemy_group = enemy_group
        self.enemy_bullet_group = enemy_bullet_group
        self.player = player
        
        self.current_wave = 0
        self.wave_timer = WAVE_DELAY
        self.enemies_to_spawn = []
        self.spawn_timer = 0
        self.spawn_delay = 0.5
        
        self.wave_active = False
        self.boss_spawned = False
    
    def start_wave(self, wave_number):
        """Démarrer une nouvelle vague"""
        self.current_wave = wave_number
        self.wave_active = True
        self.boss_spawned = False
        
        # Générer la liste d'ennemis pour cette vague
        self.enemies_to_spawn = self._generate_wave(wave_number)
        self.spawn_timer = 0
    
    def _generate_wave(self, wave_number):
        """Générer les ennemis pour une vague"""
        enemies = []
        
        # Nombre d'ennemis basé sur le numéro de vague
        base_count = 5 + wave_number * 2
        
        # Types d'ennemis disponibles selon la progression
        available_types = ['basic']
        if wave_number >= 2:
            available_types.append('fast')
        if wave_number >= 4:
            available_types.append('tank')
        
        for _ in range(base_count):
            enemy_type = random.choice(available_types)
            x = random.randint(50, SCREEN_WIDTH - 50)
            enemies.append((enemy_type, x))
        
        # Boss toutes les 5 vagues
        if wave_number % 5 == 0:
            enemies.append(('boss', SCREEN_WIDTH // 2))
        
        return enemies
    
    def update(self, dt):
        """Mise à jour du spawner"""
        if not self.wave_active:
            self.wave_timer -= dt
            if self.wave_timer <= 0:
                self.current_wave += 1
                self.start_wave(self.current_wave)
            return
        
        # Spawner les ennemis progressivement
        if self.enemies_to_spawn:
            self.spawn_timer += dt
            if self.spawn_timer >= self.spawn_delay:
                self.spawn_timer = 0
                self._spawn_next_enemy()
        
        # Vérifier si la vague est terminée
        if not self.enemies_to_spawn and len(self.enemy_group) == 0:
            self.wave_active = False
            self.wave_timer = WAVE_DELAY
    
    def _spawn_next_enemy(self):
        """Faire apparaître le prochain ennemi"""
        if not self.enemies_to_spawn:
            return
        
        enemy_type, x = self.enemies_to_spawn.pop(0)
        
        if enemy_type == 'boss':
            Boss(
                x=x,
                y=-50,
                groups=(self.enemy_group,),
                bullet_group=self.enemy_bullet_group,
                player=self.player
            )
            self.boss_spawned = True
        else:
            Enemy(
                x=x,
                y=-30,
                enemy_type=enemy_type,
                groups=(self.enemy_group,),
                bullet_group=self.enemy_bullet_group,
                player=self.player
            )
    
    def get_wave_info(self):
        """Retourne les infos de la vague actuelle"""
        return {
            'wave': self.current_wave,
            'active': self.wave_active,
            'enemies_remaining': len(self.enemy_group) + len(self.enemies_to_spawn),
            'time_to_next': self.wave_timer if not self.wave_active else 0
        }
```

## Interface : hud.py

```python
"""
Interface utilisateur en jeu (HUD)
"""
import pygame
from settings import *

class HUD:
    """Affichage tête haute"""
    
    def __init__(self):
        self.font_large = pygame.font.Font(None, 48)
        self.font_medium = pygame.font.Font(None, 32)
        self.font_small = pygame.font.Font(None, 24)
    
    def draw(self, surface, player, wave_manager, score):
        """Dessiner le HUD"""
        # Barre de vie
        self._draw_health_bar(surface, player)
        
        # Score
        self._draw_score(surface, score)
        
        # Info vague
        self._draw_wave_info(surface, wave_manager)
        
        # Power-ups actifs
        self._draw_active_powerups(surface, player)
    
    def _draw_health_bar(self, surface, player):
        """Dessiner la barre de vie"""
        bar_x = 20
        bar_y = 20
        bar_width = 200
        bar_height = 25
        
        # Fond
        pygame.draw.rect(surface, (50, 50, 50), 
                        (bar_x, bar_y, bar_width, bar_height))
        
        # Vie
        health_width = (player.health / player.max_health) * bar_width
        
        # Couleur selon le niveau de vie
        if player.health > player.max_health * 0.6:
            color = GREEN
        elif player.health > player.max_health * 0.3:
            color = YELLOW
        else:
            color = RED
        
        pygame.draw.rect(surface, color, 
                        (bar_x, bar_y, health_width, bar_height))
        
        # Contour
        pygame.draw.rect(surface, WHITE, 
                        (bar_x, bar_y, bar_width, bar_height), 2)
        
        # Texte
        text = self.font_small.render(
            f"{int(player.health)}/{player.max_health}", 
            True, WHITE
        )
        surface.blit(text, (bar_x + 5, bar_y + 3))
    
    def _draw_score(self, surface, score):
        """Dessiner le score"""
        text = self.font_large.render(f"Score: {score}", True, WHITE)
        rect = text.get_rect(topright=(SCREEN_WIDTH - 20, 20))
        surface.blit(text, rect)
    
    def _draw_wave_info(self, surface, wave_manager):
        """Dessiner les infos de vague"""
        info = wave_manager.get_wave_info()
        
        # Numéro de vague
        wave_text = self.font_medium.render(
            f"Vague {info['wave']}", True, CYAN
        )
        surface.blit(wave_text, (SCREEN_WIDTH // 2 - wave_text.get_width() // 2, 10))
        
        # Compte à rebours entre les vagues
        if not info['active'] and info['time_to_next'] > 0:
            countdown = self.font_large.render(
                f"Prochaine vague dans {info['time_to_next']:.1f}s",
                True, YELLOW
            )
            surface.blit(countdown, 
                        (SCREEN_WIDTH // 2 - countdown.get_width() // 2, 
                         SCREEN_HEIGHT // 2 - 50))
        
        # Ennemis restants
        if info['active']:
            enemies_text = self.font_small.render(
                f"Ennemis: {info['enemies_remaining']}", True, WHITE
            )
            surface.blit(enemies_text, 
                        (SCREEN_WIDTH // 2 - enemies_text.get_width() // 2, 45))
    
    def _draw_active_powerups(self, surface, player):
        """Dessiner les power-ups actifs"""
        x = 20
        y = 55
        
        for powerup_type, time_left in player.active_powerups.items():
            config = POWERUP_TYPES.get(powerup_type, {})
            color = config.get('color', WHITE)
            
            # Icône
            pygame.draw.circle(surface, color, (x + 10, y + 10), 10)
            
            # Timer
            text = self.font_small.render(f"{time_left:.1f}s", True, WHITE)
            surface.blit(text, (x + 25, y + 2))
            
            y += 25
```

## Classe principale : game.py

```python
"""
Classe principale du jeu
"""
import pygame
import random
from settings import *
from entities.player import Player
from entities.enemy import Enemy
from entities.powerup import PowerUp
from systems.particle import ParticleSystem
from systems.wave import WaveManager
from ui.hud import HUD

class Game:
    """Classe principale du jeu"""
    
    def __init__(self):
        pygame.init()
        pygame.mixer.init()
        
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption(TITLE)
        self.clock = pygame.time.Clock()
        
        # État du jeu
        self.running = True
        self.paused = False
        self.game_over = False
        self.score = 0
        
        # Groupes de sprites
        self.all_sprites = pygame.sprite.Group()
        self.player_bullets = pygame.sprite.Group()
        self.enemy_bullets = pygame.sprite.Group()
        self.enemies = pygame.sprite.Group()
        self.powerups = pygame.sprite.Group()
        
        # Systèmes
        self.particles = ParticleSystem()
        self.hud = HUD()
        
        # Étoiles de fond
        self.stars = self._create_stars()
        
        # Initialiser le jeu
        self.setup()
    
    def _create_stars(self):
        """Créer le fond étoilé"""
        stars = []
        for _ in range(100):
            x = random.randint(0, SCREEN_WIDTH)
            y = random.randint(0, SCREEN_HEIGHT)
            size = random.randint(1, 3)
            speed = size * 30
            brightness = random.randint(100, 255)
            stars.append({
                'x': x, 'y': y, 
                'size': size, 'speed': speed,
                'color': (brightness, brightness, brightness + 20)
            })
        return stars
    
    def setup(self):
        """Initialiser ou réinitialiser le jeu"""
        # Vider les groupes
        self.all_sprites.empty()
        self.player_bullets.empty()
        self.enemy_bullets.empty()
        self.enemies.empty()
        self.powerups.empty()
        self.particles.clear()
        
        # Créer le joueur
        self.player = Player(
            x=SCREEN_WIDTH // 2,
            y=SCREEN_HEIGHT - 80,
            groups=(self.all_sprites,),
            bullet_group=self.player_bullets,
            particle_system=self.particles
        )
        
        # Gestionnaire de vagues
        self.wave_manager = WaveManager(
            self.enemies,
            self.enemy_bullets,
            self.player
        )
        
        # Réinitialiser l'état
        self.score = 0
        self.game_over = False
        self.paused = False
    
    def run(self):
        """Boucle principale"""
        while self.running:
            dt = self.clock.tick(FPS) / 1000.0
            
            self.handle_events()
            
            if not self.paused and not self.game_over:
                self.update(dt)
            
            self.draw()
        
        pygame.quit()
    
    def handle_events(self):
        """Gérer les événements"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    if self.game_over:
                        self.running = False
                    else:
                        self.paused = not self.paused
                
                elif event.key == pygame.K_r and self.game_over:
                    self.setup()
                
                elif event.key == pygame.K_SPACE and not self.game_over:
                    self.player.fire()
    
    def update(self, dt):
        """Mise à jour du jeu"""
        # Étoiles de fond
        for star in self.stars:
            star['y'] += star['speed'] * dt
            if star['y'] > SCREEN_HEIGHT:
                star['y'] = 0
                star['x'] = random.randint(0, SCREEN_WIDTH)
        
        # Joueur
        self.player.update(dt)
        
        # Vagues d'ennemis
        self.wave_manager.update(dt)
        
        # Ennemis
        for enemy in self.enemies:
            enemy.update(dt)
        
        # Projectiles
        for bullet in self.player_bullets:
            bullet.update(dt)
        
        for bullet in self.enemy_bullets:
            bullet.update(dt)
        
        # Power-ups
        for powerup in self.powerups:
            powerup.update(dt)
        
        # Particules
        self.particles.update(dt)
        
        # Collisions
        self._handle_collisions()
        
        # Spawn de power-ups aléatoires
        if random.random() < 0.001:  # ~0.1% de chance par frame
            self._spawn_random_powerup()
    
    def _handle_collisions(self):
        """Gérer les collisions"""
        # Balles du joueur vs ennemis
        for bullet in self.player_bullets:
            hits = pygame.sprite.spritecollide(bullet, self.enemies, False)
            for enemy in hits:
                bullet.kill()
                if enemy.take_damage(bullet.damage, self.particles):
                    enemy.explode(self.particles)
                    enemy.kill()
                    self.score += enemy.score_value
                    
                    # Chance de drop power-up
                    if random.random() < 0.15:
                        self._spawn_powerup(enemy.pos.x, enemy.pos.y)
        
        # Balles ennemies vs joueur
        for bullet in self.enemy_bullets:
            if pygame.sprite.collide_rect(bullet, self.player):
                bullet.kill()
                if self.player.take_damage(bullet.damage):
                    self.game_over = True
        
        # Ennemis vs joueur
        for enemy in self.enemies:
            if pygame.sprite.collide_rect(enemy, self.player):
                if self.player.take_damage(30):
                    self.game_over = True
                enemy.take_damage(50, self.particles)
        
        # Power-ups vs joueur
        for powerup in self.powerups:
            if pygame.sprite.collide_rect(powerup, self.player):
                self.player.apply_powerup(powerup.powerup_type)
                
                # Effet spécial pour la bombe
                if powerup.effect == 'clear_screen':
                    for enemy in self.enemies:
                        enemy.explode(self.particles)
                        self.score += enemy.score_value
                    self.enemies.empty()
                
                powerup.kill()
    
    def _spawn_powerup(self, x, y):
        """Faire apparaître un power-up"""
        powerup_type = random.choice(list(POWERUP_TYPES.keys()))
        PowerUp(x, y, powerup_type, (self.all_sprites, self.powerups))
    
    def _spawn_random_powerup(self):
        """Spawn aléatoire de power-up"""
        x = random.randint(50, SCREEN_WIDTH - 50)
        self._spawn_powerup(x, -30)
    
    def draw(self):
        """Dessiner le jeu"""
        # Fond
        self.screen.fill(BG_COLOR)
        
        # Étoiles
        for star in self.stars:
            pygame.draw.circle(
                self.screen, star['color'],
                (int(star['x']), int(star['y'])), star['size']
            )
        
        # Particules (derrière les sprites)
        self.particles.draw(self.screen)
        
        # Sprites
        for powerup in self.powerups:
            self.screen.blit(powerup.image, powerup.rect)
        
        for bullet in self.player_bullets:
            self.screen.blit(bullet.image, bullet.rect)
        
        for bullet in self.enemy_bullets:
            self.screen.blit(bullet.image, bullet.rect)
        
        for enemy in self.enemies:
            self.screen.blit(enemy.image, enemy.rect)
        
        self.player.draw(self.screen)
        
        # HUD
        self.hud.draw(self.screen, self.player, self.wave_manager, self.score)
        
        # Écran de pause
        if self.paused:
            self._draw_pause_screen()
        
        # Écran de game over
        if self.game_over:
            self._draw_game_over_screen()
        
        pygame.display.flip()
    
    def _draw_pause_screen(self):
        """Afficher l'écran de pause"""
        # Overlay semi-transparent
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
        overlay.set_alpha(180)
        overlay.fill(BLACK)
        self.screen.blit(overlay, (0, 0))
        
        # Texte
        font = pygame.font.Font(None, 72)
        text = font.render("PAUSE", True, WHITE)
        rect = text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 30))
        self.screen.blit(text, rect)
        
        font_small = pygame.font.Font(None, 36)
        text2 = font_small.render("Appuyez sur ESC pour reprendre", True, CYAN)
        rect2 = text2.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 30))
        self.screen.blit(text2, rect2)
    
    def _draw_game_over_screen(self):
        """Afficher l'écran de game over"""
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
        overlay.set_alpha(200)
        overlay.fill(BLACK)
        self.screen.blit(overlay, (0, 0))
        
        font = pygame.font.Font(None, 72)
        text = font.render("GAME OVER", True, RED)
        rect = text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 50))
        self.screen.blit(text, rect)
        
        font_medium = pygame.font.Font(None, 48)
        score_text = font_medium.render(f"Score final: {self.score}", True, WHITE)
        score_rect = score_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 10))
        self.screen.blit(score_text, score_rect)
        
        font_small = pygame.font.Font(None, 32)
        restart_text = font_small.render("Appuyez sur R pour rejouer", True, CYAN)
        restart_rect = restart_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 60))
        self.screen.blit(restart_text, restart_rect)
        
        quit_text = font_small.render("Appuyez sur ESC pour quitter", True, CYAN)
        quit_rect = quit_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 100))
        self.screen.blit(quit_text, quit_rect)
```

## Point d'entrée : main.py

```python
"""
Space Defender - Point d'entrée
"""
from game import Game

def main():
    game = Game()
    game.run()

if __name__ == "__main__":
    main()
```

## Améliorations possibles

### 1. Système de sauvegarde des scores

```python
import json
import os

class ScoreManager:
    """Gestionnaire des high scores"""
    
    def __init__(self, filename="highscores.json"):
        self.filename = filename
        self.scores = self.load_scores()
    
    def load_scores(self):
        if os.path.exists(self.filename):
            with open(self.filename, 'r') as f:
                return json.load(f)
        return []
    
    def save_scores(self):
        with open(self.filename, 'w') as f:
            json.dump(self.scores, f, indent=2)
    
    def add_score(self, name, score, wave):
        entry = {
            'name': name,
            'score': score,
            'wave': wave
        }
        self.scores.append(entry)
        self.scores.sort(key=lambda x: x['score'], reverse=True)
        self.scores = self.scores[:10]  # Garder top 10
        self.save_scores()
    
    def get_top_scores(self, count=10):
        return self.scores[:count]
```

### 2. Système de sons

```python
class SoundManager:
    """Gestionnaire des sons"""
    
    def __init__(self):
        pygame.mixer.init()
        self.sounds = {}
        self.music_volume = 0.3
        self.sfx_volume = 0.5
    
    def load_sounds(self):
        sound_files = {
            'shoot': 'assets/sounds/shoot.wav',
            'explosion': 'assets/sounds/explosion.wav',
            'powerup': 'assets/sounds/powerup.wav',
            'hit': 'assets/sounds/hit.wav'
        }
        
        for name, path in sound_files.items():
            try:
                self.sounds[name] = pygame.mixer.Sound(path)
                self.sounds[name].set_volume(self.sfx_volume)
            except:
                print(f"Son non trouvé: {path}")
    
    def play(self, sound_name):
        if sound_name in self.sounds:
            self.sounds[sound_name].play()
    
    def play_music(self, path, loop=True):
        try:
            pygame.mixer.music.load(path)
            pygame.mixer.music.set_volume(self.music_volume)
            pygame.mixer.music.play(-1 if loop else 0)
        except:
            print(f"Musique non trouvée: {path}")
```

### 3. Menu principal

```python
class Menu:
    """Menu principal"""
    
    def __init__(self, screen):
        self.screen = screen
        self.font_title = pygame.font.Font(None, 72)
        self.font_option = pygame.font.Font(None, 48)
        
        self.options = ["Jouer", "High Scores", "Options", "Quitter"]
        self.selected = 0
    
    def handle_input(self, event):
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                self.selected = (self.selected - 1) % len(self.options)
            elif event.key == pygame.K_DOWN:
                self.selected = (self.selected + 1) % len(self.options)
            elif event.key == pygame.K_RETURN:
                return self.options[self.selected]
        return None
    
    def draw(self):
        self.screen.fill(BG_COLOR)
        
        # Titre
        title = self.font_title.render("SPACE DEFENDER", True, CYAN)
        title_rect = title.get_rect(center=(SCREEN_WIDTH // 2, 150))
        self.screen.blit(title, title_rect)
        
        # Options
        for i, option in enumerate(self.options):
            color = YELLOW if i == self.selected else WHITE
            text = self.font_option.render(option, True, color)
            rect = text.get_rect(center=(SCREEN_WIDTH // 2, 300 + i * 60))
            self.screen.blit(text, rect)
```

## Exercices d'extension

### Niveau 1 : Améliorations de base
1. Ajouter des sons pour les tirs et explosions
2. Implémenter un système de vies multiples
3. Ajouter un compteur de FPS

### Niveau 2 : Nouvelles fonctionnalités
4. Créer 2 nouveaux types d'ennemis avec des comportements uniques
5. Ajouter un système de combo (bonus pour éliminations rapides)
6. Implémenter un mode "bouclier" temporaire

### Niveau 3 : Fonctionnalités avancées
7. Créer un système de niveaux avec progression
8. Ajouter un mode multijoueur local (2 joueurs)
9. Implémenter une sauvegarde de progression

### Niveau 4 : Polish
10. Ajouter des animations de transition entre les écrans
11. Créer un système de tutoriel interactif
12. Implémenter des succès/achievements

## Conclusion

Ce projet complet vous a permis de mettre en pratique :

- ✅ Programmation orientée objet (classes, héritage)
- ✅ Gestion des sprites et animations
- ✅ Système de collisions
- ✅ Particules et effets visuels
- ✅ Gestion d'états de jeu (menu, pause, game over)
- ✅ Interface utilisateur (HUD)
- ✅ Système de vagues et progression
- ✅ Power-ups et bonus

Continuez à améliorer ce jeu en ajoutant vos propres fonctionnalités et en expérimentant avec de nouveaux concepts !
