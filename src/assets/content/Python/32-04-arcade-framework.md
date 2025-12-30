---
title: "Arcade Framework - Alternative à Pygame"
order: 4
parent: "32-jeux-2d.md"
tags: ["python", "games", "arcade", "framework", "2d"]
---

# Arcade Framework - Alternative à Pygame

## Introduction

Arcade est une bibliothèque Python moderne pour le développement de jeux 2D. Créée par Paul Vincent Craven, elle offre une API plus simple et plus intuitive que Pygame, avec des fonctionnalités modernes comme le support natif d'OpenGL, un système de physique intégré et une excellente documentation.

### Pourquoi choisir Arcade ?

| Caractéristique | Arcade | Pygame |
|-----------------|--------|--------|
| **API** | Moderne, orientée objet | Plus bas niveau |
| **Documentation** | Excellente, nombreux exemples | Bonne mais moins structurée |
| **Rendu** | OpenGL (performant) | SDL (plus lent) |
| **Physique** | Pymunk intégré | À ajouter manuellement |
| **Courbe d'apprentissage** | Douce | Plus technique |
| **Communauté** | Plus petite mais active | Très large |

## Installation

### Installation standard

```bash
pip install arcade
```

### Vérification

```python
import arcade
print(f"Arcade version: {arcade.version.VERSION_NUMBER}")
```

### Dépendances optionnelles

```bash
# Pour le support de la physique avancée
pip install pymunk

# Pour les tilemaps
pip install pytiled-parser
```

## Structure de base

### Template minimal

```python
import arcade

# Constantes
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
SCREEN_TITLE = "Mon Premier Jeu Arcade"

class MyGame(arcade.Window):
    """Classe principale du jeu"""
    
    def __init__(self):
        # Initialiser la fenêtre
        super().__init__(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_TITLE)
        
        # Couleur de fond
        arcade.set_background_color(arcade.color.DARK_SLATE_GRAY)
    
    def setup(self):
        """Initialiser le jeu. Appelé pour (re)démarrer."""
        pass
    
    def on_draw(self):
        """Rendu du jeu"""
        # Effacer l'écran
        self.clear()
        
        # Dessiner ici
    
    def on_update(self, delta_time):
        """Mise à jour de la logique du jeu"""
        pass
    
    def on_key_press(self, key, modifiers):
        """Appelé quand une touche est enfoncée"""
        if key == arcade.key.ESCAPE:
            arcade.close_window()
    
    def on_key_release(self, key, modifiers):
        """Appelé quand une touche est relâchée"""
        pass
    
    def on_mouse_press(self, x, y, button, modifiers):
        """Appelé quand un bouton de souris est enfoncé"""
        pass
    
    def on_mouse_release(self, x, y, button, modifiers):
        """Appelé quand un bouton de souris est relâché"""
        pass
    
    def on_mouse_motion(self, x, y, dx, dy):
        """Appelé quand la souris bouge"""
        pass

def main():
    """Fonction principale"""
    game = MyGame()
    game.setup()
    arcade.run()

if __name__ == "__main__":
    main()
```

## Système de coordonnées

Contrairement à Pygame, Arcade utilise le système de coordonnées mathématique standard :
- (0, 0) est en bas à gauche
- Y augmente vers le haut

```
(0, SCREEN_HEIGHT)              (SCREEN_WIDTH, SCREEN_HEIGHT)
         ┌────────────────────────────┐
         │                            │
         │                            │
         │         (400, 300)         │
         │            ●               │
         │          centre            │
         │                            │
         │                            │
         └────────────────────────────┘
(0, 0)                              (SCREEN_WIDTH, 0)
```

## Dessiner des formes

### Formes de base

```python
import arcade

class ShapesDemo(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Formes Arcade")
        arcade.set_background_color(arcade.color.DARK_BLUE_GRAY)
    
    def on_draw(self):
        self.clear()
        
        # Rectangle plein
        arcade.draw_rectangle_filled(
            center_x=100, center_y=100,
            width=80, height=60,
            color=arcade.color.RED
        )
        
        # Rectangle contour
        arcade.draw_rectangle_outline(
            center_x=250, center_y=100,
            width=80, height=60,
            color=arcade.color.GREEN,
            border_width=3
        )
        
        # Cercle
        arcade.draw_circle_filled(
            center_x=400, center_y=100,
            radius=40,
            color=arcade.color.BLUE
        )
        
        # Ellipse
        arcade.draw_ellipse_filled(
            center_x=550, center_y=100,
            width=100, height=50,
            color=arcade.color.YELLOW
        )
        
        # Ligne
        arcade.draw_line(
            start_x=50, start_y=200,
            end_x=200, end_y=300,
            color=arcade.color.WHITE,
            line_width=3
        )
        
        # Lignes multiples
        point_list = [(250, 200), (300, 280), (350, 220), (400, 300)]
        arcade.draw_lines(point_list, arcade.color.ORANGE, line_width=2)
        
        # Polygone
        point_list = [(500, 200), (600, 200), (650, 280), (550, 320), (450, 280)]
        arcade.draw_polygon_filled(point_list, arcade.color.PURPLE)
        
        # Arc
        arcade.draw_arc_outline(
            center_x=100, center_y=400,
            width=100, height=100,
            color=arcade.color.CYAN,
            start_angle=0,
            end_angle=180,
            border_width=3
        )
        
        # Texte
        arcade.draw_text(
            "Hello Arcade!",
            start_x=300, start_y=450,
            color=arcade.color.WHITE,
            font_size=24,
            anchor_x="center"
        )

def main():
    window = ShapesDemo()
    arcade.run()

if __name__ == "__main__":
    main()
```

### Batch drawing (performance)

Pour dessiner beaucoup de formes efficacement :

```python
import arcade
import random

class BatchDemo(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Batch Drawing")
        arcade.set_background_color(arcade.color.BLACK)
        
        # Créer un ShapeElementList pour le batch
        self.shapes = arcade.ShapeElementList()
        
        # Ajouter beaucoup de formes
        for _ in range(1000):
            x = random.randint(0, 800)
            y = random.randint(0, 600)
            radius = random.randint(2, 10)
            color = (
                random.randint(100, 255),
                random.randint(100, 255),
                random.randint(100, 255)
            )
            
            circle = arcade.create_ellipse_filled(x, y, radius, radius, color)
            self.shapes.append(circle)
    
    def on_draw(self):
        self.clear()
        # Dessiner toutes les formes en un seul appel
        self.shapes.draw()

def main():
    window = BatchDemo()
    arcade.run()

if __name__ == "__main__":
    main()
```

## Sprites dans Arcade

### Sprite simple

```python
import arcade

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

class SpriteDemo(arcade.Window):
    def __init__(self):
        super().__init__(SCREEN_WIDTH, SCREEN_HEIGHT, "Sprites Arcade")
        arcade.set_background_color(arcade.color.AMAZON)
        
        # Sprite unique
        self.player = None
        
        # Liste de sprites (équivalent d'un Group dans Pygame)
        self.all_sprites = None
    
    def setup(self):
        # Créer les listes de sprites
        self.all_sprites = arcade.SpriteList()
        
        # Créer le joueur
        # Option 1: Avec une image
        # self.player = arcade.Sprite("images/player.png", scale=0.5)
        
        # Option 2: Avec une couleur (pour les tests)
        self.player = arcade.SpriteSolidColor(50, 50, arcade.color.BLUE)
        self.player.center_x = SCREEN_WIDTH // 2
        self.player.center_y = SCREEN_HEIGHT // 2
        
        self.all_sprites.append(self.player)
        
        # Créer des ennemis
        for i in range(5):
            enemy = arcade.SpriteSolidColor(40, 40, arcade.color.RED)
            enemy.center_x = 100 + i * 150
            enemy.center_y = 100
            self.all_sprites.append(enemy)
    
    def on_draw(self):
        self.clear()
        self.all_sprites.draw()
    
    def on_update(self, delta_time):
        # Mettre à jour tous les sprites
        self.all_sprites.update()
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.LEFT:
            self.player.change_x = -5
        elif key == arcade.key.RIGHT:
            self.player.change_x = 5
        elif key == arcade.key.UP:
            self.player.change_y = 5
        elif key == arcade.key.DOWN:
            self.player.change_y = -5
    
    def on_key_release(self, key, modifiers):
        if key in (arcade.key.LEFT, arcade.key.RIGHT):
            self.player.change_x = 0
        if key in (arcade.key.UP, arcade.key.DOWN):
            self.player.change_y = 0

def main():
    window = SpriteDemo()
    window.setup()
    arcade.run()

if __name__ == "__main__":
    main()
```

### Classe Sprite personnalisée

```python
import arcade
import math

class Player(arcade.Sprite):
    """Sprite joueur personnalisé"""
    
    def __init__(self, x, y):
        # Créer un sprite avec une couleur
        super().__init__()
        
        # Créer l'image manuellement
        self.texture = arcade.make_soft_square_texture(
            50, arcade.color.BLUE, outer_alpha=255
        )
        
        # Position initiale
        self.center_x = x
        self.center_y = y
        
        # Propriétés de mouvement
        self.speed = 300
        self.health = 100
    
    def update(self):
        # Mouvement automatique basé sur change_x et change_y
        self.center_x += self.change_x
        self.center_y += self.change_y
        
        # Limiter aux bords de l'écran
        if self.left < 0:
            self.left = 0
        if self.right > 800:
            self.right = 800
        if self.bottom < 0:
            self.bottom = 0
        if self.top > 600:
            self.top = 600
    
    def take_damage(self, amount):
        self.health -= amount
        return self.health <= 0

class Enemy(arcade.Sprite):
    """Sprite ennemi avec IA simple"""
    
    def __init__(self, x, y):
        super().__init__()
        self.texture = arcade.make_soft_square_texture(
            40, arcade.color.RED, outer_alpha=255
        )
        self.center_x = x
        self.center_y = y
        self.speed = 100
        self.target = None
    
    def update(self):
        if self.target:
            # Se diriger vers la cible
            dx = self.target.center_x - self.center_x
            dy = self.target.center_y - self.center_y
            distance = math.sqrt(dx * dx + dy * dy)
            
            if distance > 0:
                self.change_x = (dx / distance) * self.speed * 0.016
                self.change_y = (dy / distance) * self.speed * 0.016
        
        self.center_x += self.change_x
        self.center_y += self.change_y

class Bullet(arcade.Sprite):
    """Projectile"""
    
    def __init__(self, x, y, angle, speed=500):
        super().__init__()
        self.texture = arcade.make_soft_circle_texture(10, arcade.color.YELLOW)
        self.center_x = x
        self.center_y = y
        
        self.change_x = math.cos(math.radians(angle)) * speed * 0.016
        self.change_y = math.sin(math.radians(angle)) * speed * 0.016
    
    def update(self):
        self.center_x += self.change_x
        self.center_y += self.change_y
        
        # Se détruire si hors écran
        if (self.right < 0 or self.left > 800 or 
            self.top < 0 or self.bottom > 600):
            self.remove_from_sprite_lists()
```

## Collisions

### Collision sprite vs sprite

```python
import arcade

class CollisionDemo(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Collisions")
        arcade.set_background_color(arcade.color.DARK_SLATE_GRAY)
        
        self.player = None
        self.coins = None
        self.walls = None
        self.score = 0
    
    def setup(self):
        # Joueur
        self.player = arcade.SpriteSolidColor(40, 40, arcade.color.BLUE)
        self.player.center_x = 400
        self.player.center_y = 300
        
        # Pièces à collecter
        self.coins = arcade.SpriteList()
        for i in range(10):
            coin = arcade.SpriteSolidColor(20, 20, arcade.color.GOLD)
            coin.center_x = 50 + i * 75
            coin.center_y = 500
            self.coins.append(coin)
        
        # Murs
        self.walls = arcade.SpriteList()
        for i in range(8):
            wall = arcade.SpriteSolidColor(100, 30, arcade.color.GRAY)
            wall.center_x = 50 + i * 100
            wall.center_y = 200
            self.walls.append(wall)
    
    def on_draw(self):
        self.clear()
        self.walls.draw()
        self.coins.draw()
        self.player.draw()
        
        # Score
        arcade.draw_text(
            f"Score: {self.score}",
            10, 570, arcade.color.WHITE, 20
        )
    
    def on_update(self, delta_time):
        # Déplacer le joueur
        self.player.center_x += self.player.change_x
        self.player.center_y += self.player.change_y
        
        # Collision avec les murs
        wall_hit = arcade.check_for_collision_with_list(
            self.player, self.walls
        )
        
        if wall_hit:
            # Annuler le mouvement
            self.player.center_x -= self.player.change_x
            self.player.center_y -= self.player.change_y
        
        # Collision avec les pièces
        coins_hit = arcade.check_for_collision_with_list(
            self.player, self.coins
        )
        
        for coin in coins_hit:
            coin.remove_from_sprite_lists()
            self.score += 10
    
    def on_key_press(self, key, modifiers):
        speed = 5
        if key == arcade.key.LEFT:
            self.player.change_x = -speed
        elif key == arcade.key.RIGHT:
            self.player.change_x = speed
        elif key == arcade.key.UP:
            self.player.change_y = speed
        elif key == arcade.key.DOWN:
            self.player.change_y = -speed
    
    def on_key_release(self, key, modifiers):
        if key in (arcade.key.LEFT, arcade.key.RIGHT):
            self.player.change_x = 0
        if key in (arcade.key.UP, arcade.key.DOWN):
            self.player.change_y = 0

def main():
    window = CollisionDemo()
    window.setup()
    arcade.run()

if __name__ == "__main__":
    main()
```

### Collision liste vs liste

```python
# Vérifier toutes les collisions entre deux listes
hits = arcade.check_for_collision_with_lists(
    sprite,  # Le sprite à vérifier
    [enemies, obstacles, hazards]  # Liste de SpriteLists
)

# Collision entre deux listes (retourne un dict)
# {sprite_list1[i]: [sprites_touchés_dans_list2]}
collisions = arcade.check_for_collision_with_list(
    my_sprite, other_sprites
)

# Pour collision liste vs liste complète
for bullet in bullets:
    hit_enemies = arcade.check_for_collision_with_list(bullet, enemies)
    for enemy in hit_enemies:
        enemy.remove_from_sprite_lists()
        bullet.remove_from_sprite_lists()
        score += 100
```

## Moteur physique

### Physique simple

```python
import arcade

class PhysicsDemo(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Physique Simple")
        arcade.set_background_color(arcade.color.SKY_BLUE)
        
        self.player = None
        self.platforms = None
        self.physics_engine = None
    
    def setup(self):
        # Joueur
        self.player = arcade.SpriteSolidColor(40, 60, arcade.color.BLUE)
        self.player.center_x = 100
        self.player.center_y = 300
        
        # Plateformes
        self.platforms = arcade.SpriteList()
        
        # Sol
        ground = arcade.SpriteSolidColor(800, 50, arcade.color.DARK_GREEN)
        ground.center_x = 400
        ground.center_y = 25
        self.platforms.append(ground)
        
        # Plateformes
        for i in range(3):
            platform = arcade.SpriteSolidColor(150, 20, arcade.color.BROWN)
            platform.center_x = 150 + i * 250
            platform.center_y = 150 + i * 100
            self.platforms.append(platform)
        
        # Créer le moteur physique
        self.physics_engine = arcade.PhysicsEnginePlatformer(
            player_sprite=self.player,
            platforms=self.platforms,
            gravity_constant=1.0  # Force de gravité
        )
    
    def on_draw(self):
        self.clear()
        self.platforms.draw()
        self.player.draw()
        
        # Indicateur de sol
        on_ground = self.physics_engine.can_jump()
        status = "Au sol" if on_ground else "En l'air"
        arcade.draw_text(status, 10, 570, arcade.color.WHITE, 20)
    
    def on_update(self, delta_time):
        # Le moteur physique gère la gravité et les collisions
        self.physics_engine.update()
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.LEFT:
            self.player.change_x = -5
        elif key == arcade.key.RIGHT:
            self.player.change_x = 5
        elif key == arcade.key.SPACE:
            # Sauter seulement si au sol
            if self.physics_engine.can_jump():
                self.player.change_y = 15
    
    def on_key_release(self, key, modifiers):
        if key in (arcade.key.LEFT, arcade.key.RIGHT):
            self.player.change_x = 0

def main():
    window = PhysicsDemo()
    window.setup()
    arcade.run()

if __name__ == "__main__":
    main()
```

### Physique avec Pymunk

```python
import arcade
import pymunk
import math

class PymunkDemo(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Physique Pymunk")
        arcade.set_background_color(arcade.color.DARK_SLATE_GRAY)
        
        # Créer l'espace Pymunk
        self.space = pymunk.Space()
        self.space.gravity = (0, -900)
        
        # Listes de sprites
        self.balls = arcade.SpriteList()
        self.walls = arcade.SpriteList()
        
        # Créer les murs
        self.create_walls()
    
    def create_walls(self):
        # Sol
        body = pymunk.Body(body_type=pymunk.Body.STATIC)
        shape = pymunk.Segment(body, (0, 50), (800, 50), 5)
        shape.friction = 0.8
        self.space.add(body, shape)
        
        wall = arcade.SpriteSolidColor(800, 10, arcade.color.GRAY)
        wall.center_x = 400
        wall.center_y = 50
        self.walls.append(wall)
        
        # Murs latéraux
        for x in [25, 775]:
            body = pymunk.Body(body_type=pymunk.Body.STATIC)
            shape = pymunk.Segment(body, (x, 0), (x, 600), 5)
            shape.friction = 0.8
            self.space.add(body, shape)
    
    def create_ball(self, x, y):
        # Corps Pymunk
        mass = 1
        radius = 20
        moment = pymunk.moment_for_circle(mass, 0, radius)
        body = pymunk.Body(mass, moment)
        body.position = (x, y)
        
        shape = pymunk.Circle(body, radius)
        shape.friction = 0.5
        shape.elasticity = 0.8
        self.space.add(body, shape)
        
        # Sprite Arcade
        sprite = arcade.SpriteCircle(radius, arcade.color.BLUE)
        sprite.center_x = x
        sprite.center_y = y
        sprite.pymunk_body = body  # Lier le corps au sprite
        self.balls.append(sprite)
    
    def on_draw(self):
        self.clear()
        self.walls.draw()
        self.balls.draw()
        
        arcade.draw_text(
            "Cliquez pour ajouter des balles",
            10, 570, arcade.color.WHITE, 16
        )
    
    def on_update(self, delta_time):
        # Avancer la simulation physique
        self.space.step(1 / 60.0)
        
        # Synchroniser les sprites avec la physique
        for ball in self.balls:
            ball.center_x = ball.pymunk_body.position.x
            ball.center_y = ball.pymunk_body.position.y
            ball.angle = math.degrees(ball.pymunk_body.angle)
    
    def on_mouse_press(self, x, y, button, modifiers):
        self.create_ball(x, y)

def main():
    window = PymunkDemo()
    arcade.run()

if __name__ == "__main__":
    main()
```

## Animations

### Animation par spritesheet

```python
import arcade

class AnimatedCharacter(arcade.Sprite):
    """Personnage avec animations"""
    
    def __init__(self, x, y):
        super().__init__()
        
        self.center_x = x
        self.center_y = y
        
        # Charger les textures d'animation
        self.idle_textures = []
        self.walk_textures = []
        self.jump_texture = None
        
        # Créer des textures de couleur pour l'exemple
        # En production, utiliser arcade.load_texture()
        for i in range(4):
            color = (100 + i * 30, 150, 255)
            texture = arcade.make_soft_square_texture(50, color)
            self.idle_textures.append(texture)
        
        for i in range(6):
            color = (100, 150 + i * 15, 200)
            texture = arcade.make_soft_square_texture(50, color)
            self.walk_textures.append(texture)
        
        self.jump_texture = arcade.make_soft_square_texture(
            50, arcade.color.YELLOW
        )
        
        # État d'animation
        self.current_texture_index = 0
        self.animation_timer = 0
        self.facing_right = True
        self.is_walking = False
        self.is_jumping = False
        
        # Texture initiale
        self.texture = self.idle_textures[0]
    
    def update_animation(self, delta_time):
        self.animation_timer += delta_time
        
        # Déterminer l'animation à jouer
        if self.is_jumping:
            self.texture = self.jump_texture
        elif self.is_walking:
            if self.animation_timer > 0.1:  # 10 FPS
                self.animation_timer = 0
                self.current_texture_index += 1
                if self.current_texture_index >= len(self.walk_textures):
                    self.current_texture_index = 0
                self.texture = self.walk_textures[self.current_texture_index]
        else:
            if self.animation_timer > 0.2:  # 5 FPS pour idle
                self.animation_timer = 0
                self.current_texture_index += 1
                if self.current_texture_index >= len(self.idle_textures):
                    self.current_texture_index = 0
                self.texture = self.idle_textures[self.current_texture_index]

class AnimationDemo(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Animations")
        arcade.set_background_color(arcade.color.DARK_BLUE_GRAY)
        
        self.player = None
        self.platforms = None
        self.physics_engine = None
    
    def setup(self):
        self.player = AnimatedCharacter(100, 200)
        
        self.platforms = arcade.SpriteList()
        ground = arcade.SpriteSolidColor(800, 50, arcade.color.DARK_GREEN)
        ground.center_x = 400
        ground.center_y = 25
        self.platforms.append(ground)
        
        self.physics_engine = arcade.PhysicsEnginePlatformer(
            self.player, self.platforms, gravity_constant=1.0
        )
    
    def on_draw(self):
        self.clear()
        self.platforms.draw()
        self.player.draw()
    
    def on_update(self, delta_time):
        # Mettre à jour la physique
        self.physics_engine.update()
        
        # Déterminer l'état pour l'animation
        self.player.is_jumping = not self.physics_engine.can_jump()
        self.player.is_walking = abs(self.player.change_x) > 0
        
        # Mettre à jour l'animation
        self.player.update_animation(delta_time)
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.LEFT:
            self.player.change_x = -5
            self.player.facing_right = False
        elif key == arcade.key.RIGHT:
            self.player.change_x = 5
            self.player.facing_right = True
        elif key == arcade.key.SPACE:
            if self.physics_engine.can_jump():
                self.player.change_y = 15
    
    def on_key_release(self, key, modifiers):
        if key in (arcade.key.LEFT, arcade.key.RIGHT):
            self.player.change_x = 0

def main():
    window = AnimationDemo()
    window.setup()
    arcade.run()

if __name__ == "__main__":
    main()
```

## Vues et scènes

### Gestion de vues multiples

```python
import arcade

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

class MenuView(arcade.View):
    """Vue du menu principal"""
    
    def on_show_view(self):
        arcade.set_background_color(arcade.color.DARK_BLUE)
    
    def on_draw(self):
        self.clear()
        
        arcade.draw_text(
            "MON JEU",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 50,
            arcade.color.WHITE, 48,
            anchor_x="center"
        )
        
        arcade.draw_text(
            "Appuyez sur ESPACE pour jouer",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 50,
            arcade.color.GRAY, 24,
            anchor_x="center"
        )
        
        arcade.draw_text(
            "Appuyez sur I pour les instructions",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 100,
            arcade.color.GRAY, 20,
            anchor_x="center"
        )
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.SPACE:
            game_view = GameView()
            game_view.setup()
            self.window.show_view(game_view)
        elif key == arcade.key.I:
            instructions_view = InstructionsView()
            self.window.show_view(instructions_view)

class InstructionsView(arcade.View):
    """Vue des instructions"""
    
    def on_show_view(self):
        arcade.set_background_color(arcade.color.DARK_SLATE_GRAY)
    
    def on_draw(self):
        self.clear()
        
        arcade.draw_text(
            "Instructions",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT - 80,
            arcade.color.WHITE, 36,
            anchor_x="center"
        )
        
        instructions = [
            "Flèches directionnelles : Déplacer",
            "Espace : Sauter",
            "Échap : Pause",
            "",
            "Collectez les pièces et évitez les ennemis !"
        ]
        
        for i, line in enumerate(instructions):
            arcade.draw_text(
                line,
                SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - i * 40,
                arcade.color.WHITE, 20,
                anchor_x="center"
            )
        
        arcade.draw_text(
            "Appuyez sur ÉCHAP pour revenir",
            SCREEN_WIDTH // 2, 50,
            arcade.color.GRAY, 18,
            anchor_x="center"
        )
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.ESCAPE:
            menu_view = MenuView()
            self.window.show_view(menu_view)

class GameView(arcade.View):
    """Vue principale du jeu"""
    
    def __init__(self):
        super().__init__()
        self.player = None
        self.platforms = None
        self.coins = None
        self.physics_engine = None
        self.score = 0
    
    def setup(self):
        arcade.set_background_color(arcade.color.SKY_BLUE)
        
        # Joueur
        self.player = arcade.SpriteSolidColor(40, 60, arcade.color.BLUE)
        self.player.center_x = 100
        self.player.center_y = 200
        
        # Plateformes
        self.platforms = arcade.SpriteList()
        ground = arcade.SpriteSolidColor(800, 50, arcade.color.DARK_GREEN)
        ground.center_x = 400
        ground.center_y = 25
        self.platforms.append(ground)
        
        # Pièces
        self.coins = arcade.SpriteList()
        for i in range(5):
            coin = arcade.SpriteSolidColor(20, 20, arcade.color.GOLD)
            coin.center_x = 100 + i * 150
            coin.center_y = 150
            self.coins.append(coin)
        
        # Physique
        self.physics_engine = arcade.PhysicsEnginePlatformer(
            self.player, self.platforms, gravity_constant=1.0
        )
        
        self.score = 0
    
    def on_draw(self):
        self.clear()
        self.platforms.draw()
        self.coins.draw()
        self.player.draw()
        
        arcade.draw_text(
            f"Score: {self.score}",
            10, SCREEN_HEIGHT - 30,
            arcade.color.WHITE, 20
        )
    
    def on_update(self, delta_time):
        self.physics_engine.update()
        
        # Collecter les pièces
        coins_hit = arcade.check_for_collision_with_list(
            self.player, self.coins
        )
        for coin in coins_hit:
            coin.remove_from_sprite_lists()
            self.score += 10
        
        # Vérifier victoire
        if len(self.coins) == 0:
            win_view = GameOverView(self.score, won=True)
            self.window.show_view(win_view)
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.LEFT:
            self.player.change_x = -5
        elif key == arcade.key.RIGHT:
            self.player.change_x = 5
        elif key == arcade.key.SPACE:
            if self.physics_engine.can_jump():
                self.player.change_y = 15
        elif key == arcade.key.ESCAPE:
            pause_view = PauseView(self)
            self.window.show_view(pause_view)
    
    def on_key_release(self, key, modifiers):
        if key in (arcade.key.LEFT, arcade.key.RIGHT):
            self.player.change_x = 0

class PauseView(arcade.View):
    """Vue de pause"""
    
    def __init__(self, game_view):
        super().__init__()
        self.game_view = game_view
    
    def on_draw(self):
        # Dessiner le jeu en arrière-plan
        self.game_view.on_draw()
        
        # Overlay semi-transparent
        arcade.draw_rectangle_filled(
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2,
            SCREEN_WIDTH, SCREEN_HEIGHT,
            (0, 0, 0, 150)
        )
        
        arcade.draw_text(
            "PAUSE",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2,
            arcade.color.WHITE, 48,
            anchor_x="center"
        )
        
        arcade.draw_text(
            "ESPACE: Continuer | Q: Quitter",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 60,
            arcade.color.GRAY, 20,
            anchor_x="center"
        )
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.SPACE:
            self.window.show_view(self.game_view)
        elif key == arcade.key.Q:
            menu_view = MenuView()
            self.window.show_view(menu_view)

class GameOverView(arcade.View):
    """Vue de fin de jeu"""
    
    def __init__(self, score, won=False):
        super().__init__()
        self.score = score
        self.won = won
    
    def on_show_view(self):
        if self.won:
            arcade.set_background_color(arcade.color.DARK_GREEN)
        else:
            arcade.set_background_color(arcade.color.DARK_RED)
    
    def on_draw(self):
        self.clear()
        
        message = "VICTOIRE !" if self.won else "GAME OVER"
        
        arcade.draw_text(
            message,
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 50,
            arcade.color.WHITE, 48,
            anchor_x="center"
        )
        
        arcade.draw_text(
            f"Score final: {self.score}",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 20,
            arcade.color.WHITE, 24,
            anchor_x="center"
        )
        
        arcade.draw_text(
            "ESPACE: Rejouer | Q: Menu",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 100,
            arcade.color.GRAY, 20,
            anchor_x="center"
        )
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.SPACE:
            game_view = GameView()
            game_view.setup()
            self.window.show_view(game_view)
        elif key == arcade.key.Q:
            menu_view = MenuView()
            self.window.show_view(menu_view)

def main():
    window = arcade.Window(SCREEN_WIDTH, SCREEN_HEIGHT, "Mon Jeu")
    menu_view = MenuView()
    window.show_view(menu_view)
    arcade.run()

if __name__ == "__main__":
    main()
```

## Sons et musique

```python
import arcade

class SoundDemo(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Sons")
        arcade.set_background_color(arcade.color.DARK_SLATE_GRAY)
        
        # Charger les sons
        # En production, utiliser de vrais fichiers audio
        # self.jump_sound = arcade.load_sound("sounds/jump.wav")
        # self.coin_sound = arcade.load_sound("sounds/coin.wav")
        # self.background_music = arcade.load_sound("sounds/music.mp3")
        
        # Pour l'exemple, on simule
        self.jump_sound = None
        self.music_player = None
    
    def setup(self):
        # Démarrer la musique de fond
        # self.music_player = arcade.play_sound(
        #     self.background_music, 
        #     volume=0.3, 
        #     looping=True
        # )
        pass
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.SPACE:
            # Jouer un son
            if self.jump_sound:
                arcade.play_sound(self.jump_sound, volume=1.0)
            print("Jump sound!")
        
        elif key == arcade.key.M:
            # Mettre en pause/reprendre la musique
            if self.music_player:
                if self.music_player.playing:
                    self.music_player.pause()
                else:
                    self.music_player.play()
    
    def on_draw(self):
        self.clear()
        arcade.draw_text(
            "ESPACE: Son de saut | M: Pause musique",
            400, 300, arcade.color.WHITE, 18,
            anchor_x="center"
        )

def main():
    window = SoundDemo()
    window.setup()
    arcade.run()

if __name__ == "__main__":
    main()
```

## Tilemaps (cartes de tuiles)

### Charger une tilemap Tiled

```python
import arcade

TILE_SCALING = 1.0
PLAYER_SCALING = 0.5

class TilemapDemo(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Tilemap")
        
        self.tile_map = None
        self.scene = None
        self.player = None
        self.physics_engine = None
        self.camera = None
    
    def setup(self):
        # Créer une caméra
        self.camera = arcade.Camera(self.width, self.height)
        
        # Charger la tilemap
        # Créée avec Tiled Map Editor (https://www.mapeditor.org/)
        """
        self.tile_map = arcade.load_tilemap(
            "maps/level1.tmx",
            scaling=TILE_SCALING
        )
        
        # Créer la scène depuis la tilemap
        self.scene = arcade.Scene.from_tilemap(self.tile_map)
        """
        
        # Pour l'exemple, créer une scène manuellement
        self.scene = arcade.Scene()
        
        # Créer des plateformes
        platforms = arcade.SpriteList()
        for i in range(20):
            tile = arcade.SpriteSolidColor(32, 32, arcade.color.BROWN)
            tile.center_x = i * 32 + 16
            tile.center_y = 16
            platforms.append(tile)
        
        self.scene.add_sprite_list("Platforms", sprite_list=platforms)
        
        # Joueur
        self.player = arcade.SpriteSolidColor(30, 50, arcade.color.BLUE)
        self.player.center_x = 100
        self.player.center_y = 200
        self.scene.add_sprite("Player", self.player)
        
        # Physique
        self.physics_engine = arcade.PhysicsEnginePlatformer(
            self.player,
            platforms=self.scene.get_sprite_list("Platforms"),
            gravity_constant=1.0
        )
    
    def on_draw(self):
        self.clear()
        
        # Utiliser la caméra
        self.camera.use()
        
        # Dessiner la scène
        self.scene.draw()
    
    def on_update(self, delta_time):
        self.physics_engine.update()
        
        # Centrer la caméra sur le joueur
        self.center_camera_on_player()
    
    def center_camera_on_player(self):
        screen_center_x = self.player.center_x - (self.camera.viewport_width / 2)
        screen_center_y = self.player.center_y - (self.camera.viewport_height / 2)
        
        # Limiter aux bords de la map
        screen_center_x = max(0, screen_center_x)
        screen_center_y = max(0, screen_center_y)
        
        self.camera.move_to((screen_center_x, screen_center_y))
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.LEFT:
            self.player.change_x = -5
        elif key == arcade.key.RIGHT:
            self.player.change_x = 5
        elif key == arcade.key.SPACE:
            if self.physics_engine.can_jump():
                self.player.change_y = 12
    
    def on_key_release(self, key, modifiers):
        if key in (arcade.key.LEFT, arcade.key.RIGHT):
            self.player.change_x = 0

def main():
    window = TilemapDemo()
    window.setup()
    arcade.run()

if __name__ == "__main__":
    main()
```

## Jeu complet : Platformer

```python
"""
Jeu de plateforme complet avec Arcade
"""
import arcade
import math
import random

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
SCREEN_TITLE = "Platformer Arcade"

# Constantes de jeu
PLAYER_SPEED = 5
JUMP_SPEED = 15
GRAVITY = 1.0

class Coin(arcade.Sprite):
    """Pièce à collecter avec animation"""
    
    def __init__(self, x, y):
        super().__init__()
        self.textures = []
        
        # Créer des textures pour l'animation
        for i in range(4):
            size = 18 + i * 2
            texture = arcade.make_soft_circle_texture(size, arcade.color.GOLD)
            self.textures.append(texture)
        
        self.texture = self.textures[0]
        self.center_x = x
        self.center_y = y
        
        self.animation_timer = 0
        self.current_texture = 0
    
    def update(self):
        self.animation_timer += 1
        if self.animation_timer > 10:
            self.animation_timer = 0
            self.current_texture = (self.current_texture + 1) % len(self.textures)
            self.texture = self.textures[self.current_texture]

class Enemy(arcade.Sprite):
    """Ennemi qui patrouille"""
    
    def __init__(self, x, y, boundary_left, boundary_right):
        super().__init__()
        self.texture = arcade.make_soft_square_texture(
            40, arcade.color.RED, outer_alpha=255
        )
        self.center_x = x
        self.center_y = y
        self.change_x = 2
        self.boundary_left = boundary_left
        self.boundary_right = boundary_right
    
    def update(self):
        self.center_x += self.change_x
        
        if self.center_x < self.boundary_left:
            self.change_x = abs(self.change_x)
        elif self.center_x > self.boundary_right:
            self.change_x = -abs(self.change_x)

class Player(arcade.Sprite):
    """Sprite joueur"""
    
    def __init__(self):
        super().__init__()
        
        # Textures pour différents états
        self.idle_texture = arcade.make_soft_square_texture(
            40, arcade.color.BLUE, outer_alpha=255
        )
        self.jump_texture = arcade.make_soft_square_texture(
            40, arcade.color.LIGHT_BLUE, outer_alpha=255
        )
        self.hurt_texture = arcade.make_soft_square_texture(
            40, arcade.color.PINK, outer_alpha=255
        )
        
        self.texture = self.idle_texture
        
        # État
        self.is_jumping = False
        self.is_hurt = False
        self.hurt_timer = 0
        self.invincible = False
        self.invincible_timer = 0
    
    def update(self):
        # Gestion de l'état blessé
        if self.is_hurt:
            self.hurt_timer -= 1
            if self.hurt_timer <= 0:
                self.is_hurt = False
                self.texture = self.idle_texture
        
        # Gestion de l'invincibilité
        if self.invincible:
            self.invincible_timer -= 1
            if self.invincible_timer <= 0:
                self.invincible = False
        
        # Texture selon l'état
        if self.is_hurt:
            self.texture = self.hurt_texture
        elif self.is_jumping:
            self.texture = self.jump_texture
        else:
            self.texture = self.idle_texture
    
    def take_damage(self):
        if not self.invincible:
            self.is_hurt = True
            self.hurt_timer = 30
            self.invincible = True
            self.invincible_timer = 90
            return True
        return False

class GameView(arcade.View):
    """Vue principale du jeu"""
    
    def __init__(self):
        super().__init__()
        
        # Sprites
        self.player = None
        self.platforms = None
        self.coins = None
        self.enemies = None
        
        # Moteur physique
        self.physics_engine = None
        
        # Score et vies
        self.score = 0
        self.lives = 3
        
        # Camera
        self.camera = None
        self.gui_camera = None
    
    def setup(self):
        arcade.set_background_color(arcade.color.SKY_BLUE)
        
        # Caméras
        self.camera = arcade.Camera(SCREEN_WIDTH, SCREEN_HEIGHT)
        self.gui_camera = arcade.Camera(SCREEN_WIDTH, SCREEN_HEIGHT)
        
        # Joueur
        self.player = Player()
        self.player.center_x = 100
        self.player.center_y = 200
        
        # Plateformes
        self.platforms = arcade.SpriteList()
        
        # Sol
        for x in range(0, 1600, 64):
            ground = arcade.SpriteSolidColor(64, 64, arcade.color.DARK_GREEN)
            ground.center_x = x + 32
            ground.center_y = 32
            self.platforms.append(ground)
        
        # Plateformes en hauteur
        platform_positions = [
            (200, 150, 3),
            (450, 250, 2),
            (650, 350, 3),
            (350, 400, 2),
            (100, 450, 4),
        ]
        
        for px, py, count in platform_positions:
            for i in range(count):
                plat = arcade.SpriteSolidColor(64, 20, arcade.color.BROWN)
                plat.center_x = px + i * 64
                plat.center_y = py
                self.platforms.append(plat)
        
        # Pièces
        self.coins = arcade.SpriteList()
        coin_positions = [
            (220, 200), (280, 200), (340, 200),
            (470, 300), (530, 300),
            (670, 400), (730, 400), (790, 400),
            (370, 450), (430, 450),
            (120, 500), (180, 500), (240, 500), (300, 500),
        ]
        
        for cx, cy in coin_positions:
            coin = Coin(cx, cy)
            self.coins.append(coin)
        
        # Ennemis
        self.enemies = arcade.SpriteList()
        enemy_data = [
            (300, 96, 150, 400),
            (600, 96, 500, 750),
            (400, 420, 350, 480),
        ]
        
        for ex, ey, left, right in enemy_data:
            enemy = Enemy(ex, ey, left, right)
            self.enemies.append(enemy)
        
        # Moteur physique
        self.physics_engine = arcade.PhysicsEnginePlatformer(
            self.player,
            self.platforms,
            gravity_constant=GRAVITY
        )
        
        # Réinitialiser le score
        self.score = 0
        self.lives = 3
    
    def on_draw(self):
        self.clear()
        
        # Dessiner le monde avec la caméra
        self.camera.use()
        
        self.platforms.draw()
        self.coins.draw()
        self.enemies.draw()
        
        # Dessiner le joueur (clignotement si invincible)
        if not self.player.invincible or self.player.invincible_timer % 10 < 5:
            self.player.draw()
        
        # Interface avec la caméra GUI
        self.gui_camera.use()
        
        arcade.draw_text(
            f"Score: {self.score}",
            10, SCREEN_HEIGHT - 30,
            arcade.color.WHITE, 20
        )
        
        arcade.draw_text(
            f"Vies: {'❤️ ' * self.lives}",
            10, SCREEN_HEIGHT - 60,
            arcade.color.RED, 20
        )
    
    def on_update(self, delta_time):
        # Mise à jour de la physique
        self.physics_engine.update()
        
        # État de saut du joueur
        self.player.is_jumping = not self.physics_engine.can_jump()
        
        # Mise à jour des sprites
        self.player.update()
        self.coins.update()
        self.enemies.update()
        
        # Collecter les pièces
        coins_hit = arcade.check_for_collision_with_list(
            self.player, self.coins
        )
        for coin in coins_hit:
            coin.remove_from_sprite_lists()
            self.score += 10
        
        # Collision avec les ennemis
        enemies_hit = arcade.check_for_collision_with_list(
            self.player, self.enemies
        )
        for enemy in enemies_hit:
            if self.player.take_damage():
                self.lives -= 1
                # Repousser le joueur
                if self.player.center_x < enemy.center_x:
                    self.player.change_x = -10
                else:
                    self.player.change_x = 10
                self.player.change_y = 8
                
                if self.lives <= 0:
                    game_over = GameOverView(self.score)
                    self.window.show_view(game_over)
        
        # Vérifier si tombé
        if self.player.center_y < -100:
            self.lives -= 1
            if self.lives <= 0:
                game_over = GameOverView(self.score)
                self.window.show_view(game_over)
            else:
                self.player.center_x = 100
                self.player.center_y = 200
                self.player.change_x = 0
                self.player.change_y = 0
        
        # Vérifier victoire
        if len(self.coins) == 0:
            win_view = WinView(self.score)
            self.window.show_view(win_view)
        
        # Mettre à jour la caméra
        self.center_camera_on_player()
    
    def center_camera_on_player(self):
        screen_center_x = self.player.center_x - (SCREEN_WIDTH / 2)
        screen_center_y = self.player.center_y - (SCREEN_HEIGHT / 2)
        
        screen_center_x = max(0, screen_center_x)
        screen_center_y = max(0, screen_center_y)
        
        self.camera.move_to((screen_center_x, screen_center_y), 0.1)
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.LEFT or key == arcade.key.A:
            self.player.change_x = -PLAYER_SPEED
        elif key == arcade.key.RIGHT or key == arcade.key.D:
            self.player.change_x = PLAYER_SPEED
        elif key == arcade.key.SPACE or key == arcade.key.UP:
            if self.physics_engine.can_jump():
                self.player.change_y = JUMP_SPEED
        elif key == arcade.key.ESCAPE:
            pause = PauseView(self)
            self.window.show_view(pause)
    
    def on_key_release(self, key, modifiers):
        if key in (arcade.key.LEFT, arcade.key.A, arcade.key.RIGHT, arcade.key.D):
            self.player.change_x = 0

class MenuView(arcade.View):
    """Menu principal"""
    
    def on_show_view(self):
        arcade.set_background_color(arcade.color.DARK_BLUE)
    
    def on_draw(self):
        self.clear()
        
        arcade.draw_text(
            "PLATFORMER",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 100,
            arcade.color.GOLD, 60,
            anchor_x="center", font_name="Arial"
        )
        
        arcade.draw_text(
            "Appuyez sur ESPACE pour jouer",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2,
            arcade.color.WHITE, 24,
            anchor_x="center"
        )
        
        arcade.draw_text(
            "Flèches/WASD: Déplacer | ESPACE: Sauter",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 100,
            arcade.color.GRAY, 18,
            anchor_x="center"
        )
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.SPACE:
            game = GameView()
            game.setup()
            self.window.show_view(game)

class PauseView(arcade.View):
    """Vue de pause"""
    
    def __init__(self, game_view):
        super().__init__()
        self.game_view = game_view
    
    def on_draw(self):
        self.game_view.on_draw()
        
        arcade.draw_rectangle_filled(
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2,
            SCREEN_WIDTH, SCREEN_HEIGHT,
            (0, 0, 0, 180)
        )
        
        arcade.draw_text(
            "PAUSE",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 50,
            arcade.color.WHITE, 48,
            anchor_x="center"
        )
        
        arcade.draw_text(
            "ESPACE: Continuer | Q: Menu",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 30,
            arcade.color.GRAY, 20,
            anchor_x="center"
        )
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.SPACE:
            self.window.show_view(self.game_view)
        elif key == arcade.key.Q:
            menu = MenuView()
            self.window.show_view(menu)

class GameOverView(arcade.View):
    """Vue de game over"""
    
    def __init__(self, score):
        super().__init__()
        self.score = score
    
    def on_show_view(self):
        arcade.set_background_color(arcade.color.DARK_RED)
    
    def on_draw(self):
        self.clear()
        
        arcade.draw_text(
            "GAME OVER",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 50,
            arcade.color.WHITE, 48,
            anchor_x="center"
        )
        
        arcade.draw_text(
            f"Score: {self.score}",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 20,
            arcade.color.WHITE, 24,
            anchor_x="center"
        )
        
        arcade.draw_text(
            "ESPACE: Rejouer | Q: Menu",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 80,
            arcade.color.GRAY, 18,
            anchor_x="center"
        )
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.SPACE:
            game = GameView()
            game.setup()
            self.window.show_view(game)
        elif key == arcade.key.Q:
            menu = MenuView()
            self.window.show_view(menu)

class WinView(arcade.View):
    """Vue de victoire"""
    
    def __init__(self, score):
        super().__init__()
        self.score = score
    
    def on_show_view(self):
        arcade.set_background_color(arcade.color.DARK_GREEN)
    
    def on_draw(self):
        self.clear()
        
        arcade.draw_text(
            "VICTOIRE !",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 50,
            arcade.color.GOLD, 48,
            anchor_x="center"
        )
        
        arcade.draw_text(
            f"Score final: {self.score}",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 20,
            arcade.color.WHITE, 24,
            anchor_x="center"
        )
        
        arcade.draw_text(
            "ESPACE: Rejouer | Q: Menu",
            SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 80,
            arcade.color.GRAY, 18,
            anchor_x="center"
        )
    
    def on_key_press(self, key, modifiers):
        if key == arcade.key.SPACE:
            game = GameView()
            game.setup()
            self.window.show_view(game)
        elif key == arcade.key.Q:
            menu = MenuView()
            self.window.show_view(menu)

def main():
    window = arcade.Window(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_TITLE)
    menu = MenuView()
    window.show_view(menu)
    arcade.run()

if __name__ == "__main__":
    main()
```

## Arcade vs Pygame : Récapitulatif

| Aspect | Arcade | Pygame |
|--------|--------|--------|
| **Init** | `super().__init__(w, h, title)` | `pygame.init()` |
| **Fenêtre** | Hériter de `arcade.Window` | `pygame.display.set_mode()` |
| **Boucle** | Automatique avec callbacks | Manuelle avec `while` |
| **Sprites** | `arcade.Sprite`, `SpriteList` | `pygame.sprite.Sprite`, `Group` |
| **Collisions** | `check_for_collision_*` | `spritecollide`, `collide_rect` |
| **Physique** | `PhysicsEnginePlatformer` intégré | Manuelle ou lib externe |
| **Coords** | Y+ vers le haut | Y+ vers le bas |
| **Vues** | `arcade.View` intégré | À implémenter manuellement |

## Ressources

- **Documentation Arcade** : https://api.arcade.academy
- **Tutoriels officiels** : https://api.arcade.academy/en/latest/tutorials/
- **Exemples** : https://api.arcade.academy/en/latest/examples/
- **Tiled Map Editor** : https://www.mapeditor.org/
- **GitHub Arcade** : https://github.com/pythonarcade/arcade
