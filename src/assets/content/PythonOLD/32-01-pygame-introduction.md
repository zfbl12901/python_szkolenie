---
title: "Pygame - Introduction"
order: 1
parent: "32-jeux-2d.md"
tags: ["python", "games", "pygame", "2d"]
---

# Pygame - Introduction

## Présentation de Pygame

Pygame est une bibliothèque Python gratuite et open-source conçue pour faciliter le développement de jeux vidéo et d'applications multimédias. Créée en 2000 par Pete Shinners, elle est construite sur la bibliothèque SDL (Simple DirectMedia Layer) et offre un accès simplifié au rendu graphique, à l'audio, aux entrées clavier/souris et à la gestion des événements.

### Pourquoi choisir Pygame ?

| Avantage | Description |
|----------|-------------|
| **Simplicité** | API intuitive, idéale pour les débutants |
| **Communauté** | Large communauté active, nombreux tutoriels |
| **Multi-plateforme** | Fonctionne sur Windows, macOS, Linux |
| **Documentation** | Documentation complète et exemples nombreux |
| **Flexibilité** | Contrôle total sur le rendu et la logique |

### Limitations à connaître

- Pas de support natif pour la 3D (préférer PyOpenGL ou Panda3D)
- Performance limitée pour les jeux très complexes
- Gestion des shaders limitée
- Pas d'éditeur de niveau intégré

## Installation

### Installation standard

```bash
pip install pygame
```

### Vérification de l'installation

```python
import pygame
print(f"Pygame version: {pygame.version.ver}")

# Test rapide
pygame.init()
print("Pygame initialisé avec succès !")
pygame.quit()
```

### Installation de développement (dernière version)

```bash
pip install pygame --pre
```

## Architecture de Pygame

### Modules principaux

```python
import pygame

# Modules disponibles
print(pygame.display)    # Gestion de la fenêtre et de l'écran
print(pygame.event)      # Gestion des événements (clavier, souris)
print(pygame.image)      # Chargement et sauvegarde d'images
print(pygame.mixer)      # Gestion du son
print(pygame.font)       # Rendu de texte
print(pygame.draw)       # Dessin de formes primitives
print(pygame.sprite)     # Gestion des sprites
print(pygame.time)       # Gestion du temps et des FPS
print(pygame.key)        # État du clavier
print(pygame.mouse)      # État de la souris
print(pygame.transform)  # Transformations d'images (rotation, scale)
```

### Cycle de vie d'un jeu Pygame

```
┌─────────────────────────────────────────────────────────────────┐
│                        pygame.init()                            │
│                    (Initialisation)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Configuration initiale                         │
│        (Fenêtre, ressources, variables de jeu)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    ┌──────────────────────────────────────────────────────┐     │
│    │              BOUCLE PRINCIPALE                       │     │
│    │                                                      │     │
│    │  1. Gestion des événements (Event Handling)          │     │
│    │  2. Mise à jour de la logique (Update)               │     │
│    │  3. Rendu graphique (Render)                         │     │
│    │  4. Contrôle des FPS (Clock)                         │     │
│    │                                                      │     │
│    └──────────────────────────────────────────────────────┘     │
│                              │                                  │
│                    (Répète jusqu'à quit)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        pygame.quit()                            │
│                       (Nettoyage)                               │
└─────────────────────────────────────────────────────────────────┘
```

## Structure de base d'un jeu

### Template minimal

```python
import pygame
import sys

# Constantes
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60

# Couleurs (RGB)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

def main():
    # 1. Initialisation
    pygame.init()
    
    # 2. Configuration de l'écran
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Mon Premier Jeu Pygame")
    
    # 3. Horloge pour les FPS
    clock = pygame.time.Clock()
    
    # 4. Variables de jeu
    running = True
    
    # 5. Boucle principale
    while running:
        # 5.1 Gestion des événements
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
        
        # 5.2 Mise à jour de la logique
        # (À implémenter)
        
        # 5.3 Rendu
        screen.fill(BLACK)  # Effacer l'écran
        # Dessiner ici
        pygame.display.flip()  # Mettre à jour l'affichage
        
        # 5.4 Contrôle des FPS
        clock.tick(FPS)
    
    # 6. Nettoyage
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
```

### Template avec classe Game

```python
import pygame
import sys

class Game:
    """Classe principale du jeu"""
    
    def __init__(self):
        pygame.init()
        
        # Configuration
        self.SCREEN_WIDTH = 800
        self.SCREEN_HEIGHT = 600
        self.FPS = 60
        
        # Écran et horloge
        self.screen = pygame.display.set_mode(
            (self.SCREEN_WIDTH, self.SCREEN_HEIGHT)
        )
        pygame.display.set_caption("Mon Jeu")
        self.clock = pygame.time.Clock()
        
        # État du jeu
        self.running = True
        self.paused = False
        
        # Couleurs
        self.colors = {
            'black': (0, 0, 0),
            'white': (255, 255, 255),
            'red': (255, 0, 0),
            'green': (0, 255, 0),
            'blue': (0, 0, 255)
        }
    
    def handle_events(self):
        """Gestion des événements"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.running = False
                elif event.key == pygame.K_p:
                    self.paused = not self.paused
    
    def update(self, dt):
        """Mise à jour de la logique du jeu"""
        if self.paused:
            return
        # Logique de mise à jour ici
        pass
    
    def render(self):
        """Rendu graphique"""
        self.screen.fill(self.colors['black'])
        
        # Dessiner les éléments du jeu ici
        
        # Afficher le message de pause si nécessaire
        if self.paused:
            font = pygame.font.Font(None, 74)
            text = font.render("PAUSE", True, self.colors['white'])
            text_rect = text.get_rect(
                center=(self.SCREEN_WIDTH // 2, self.SCREEN_HEIGHT // 2)
            )
            self.screen.blit(text, text_rect)
        
        pygame.display.flip()
    
    def run(self):
        """Boucle principale"""
        while self.running:
            # Calcul du delta time (en secondes)
            dt = self.clock.tick(self.FPS) / 1000.0
            
            self.handle_events()
            self.update(dt)
            self.render()
        
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = Game()
    game.run()
```

## Système de coordonnées

### Comprendre les coordonnées Pygame

```
(0, 0) ────────────────────────────────▶ X+
   │                                    (800, 0)
   │
   │     (x, y) représente un point
   │     x = distance depuis la gauche
   │     y = distance depuis le haut
   │
   │
   │
   ▼ Y+
(0, 600)                               (800, 600)
```

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))

# Exemples de positions
coin_haut_gauche = (0, 0)
coin_haut_droit = (800, 0)
centre = (400, 300)
coin_bas_gauche = (0, 600)
coin_bas_droit = (800, 600)

# Dessiner un point au centre
pygame.draw.circle(screen, (255, 0, 0), centre, 10)
pygame.display.flip()
```

## Dessiner des formes primitives

### Formes de base

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
screen.fill((30, 30, 30))

# Rectangle
# pygame.draw.rect(surface, couleur, rect, largeur_trait)
pygame.draw.rect(screen, (255, 0, 0), (50, 50, 100, 80))       # Plein
pygame.draw.rect(screen, (0, 255, 0), (200, 50, 100, 80), 3)   # Contour

# Cercle
# pygame.draw.circle(surface, couleur, centre, rayon, largeur_trait)
pygame.draw.circle(screen, (0, 0, 255), (450, 90), 50)         # Plein
pygame.draw.circle(screen, (255, 255, 0), (600, 90), 50, 3)    # Contour

# Ellipse
# pygame.draw.ellipse(surface, couleur, rect, largeur_trait)
pygame.draw.ellipse(screen, (255, 0, 255), (50, 200, 150, 80))

# Ligne
# pygame.draw.line(surface, couleur, debut, fin, largeur)
pygame.draw.line(screen, (0, 255, 255), (250, 200), (400, 280), 5)

# Lignes multiples
# pygame.draw.lines(surface, couleur, ferme, points, largeur)
points = [(450, 200), (500, 250), (550, 200), (600, 250)]
pygame.draw.lines(screen, (255, 128, 0), False, points, 3)

# Polygone
# pygame.draw.polygon(surface, couleur, points, largeur)
triangle = [(50, 350), (150, 450), (50, 450)]
pygame.draw.polygon(screen, (128, 255, 128), triangle)

# Arc
# pygame.draw.arc(surface, couleur, rect, angle_debut, angle_fin, largeur)
import math
pygame.draw.arc(screen, (255, 255, 255), (200, 350, 100, 100), 
                0, math.pi, 3)

# Anti-aliased line (plus lisse)
pygame.draw.aaline(screen, (255, 255, 255), (400, 350), (550, 450))

pygame.display.flip()

# Attendre
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
```

### Couleurs et transparence

```python
import pygame

pygame.init()

# Surface avec canal alpha (transparence)
screen = pygame.display.set_mode((800, 600))
screen.fill((50, 50, 50))

# Créer une surface avec transparence
surface_transparente = pygame.Surface((200, 200), pygame.SRCALPHA)

# Couleur avec alpha (RGBA) - le 4e nombre est l'opacité (0-255)
rouge_transparent = (255, 0, 0, 128)  # 50% transparent
bleu_transparent = (0, 0, 255, 180)   # 70% opaque

pygame.draw.rect(surface_transparente, rouge_transparent, (0, 0, 200, 200))
screen.blit(surface_transparente, (100, 100))

surface_transparente2 = pygame.Surface((200, 200), pygame.SRCALPHA)
pygame.draw.rect(surface_transparente2, bleu_transparent, (0, 0, 200, 200))
screen.blit(surface_transparente2, (200, 150))

pygame.display.flip()

# Boucle d'attente
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
```

## Gestion des entrées

### Clavier

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

# Position d'un objet
x, y = 400, 300
vitesse = 5

running = True
while running:
    # Méthode 1: Événements (pour les actions ponctuelles)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            # Touche enfoncée
            if event.key == pygame.K_SPACE:
                print("Espace pressé !")
            elif event.key == pygame.K_r:
                # Reset position
                x, y = 400, 300
        elif event.type == pygame.KEYUP:
            # Touche relâchée
            if event.key == pygame.K_SPACE:
                print("Espace relâché !")
    
    # Méthode 2: État des touches (pour le mouvement continu)
    keys = pygame.key.get_pressed()
    
    if keys[pygame.K_LEFT] or keys[pygame.K_a]:
        x -= vitesse
    if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
        x += vitesse
    if keys[pygame.K_UP] or keys[pygame.K_w]:
        y -= vitesse
    if keys[pygame.K_DOWN] or keys[pygame.K_s]:
        y += vitesse
    
    # Rendu
    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 0), (int(x), int(y)), 25)
    pygame.display.flip()
    
    clock.tick(60)

pygame.quit()
```

### Souris

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

# Liste de cercles à dessiner
cercles = []

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        # Clic de souris
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:  # Clic gauche
                cercles.append({
                    'pos': event.pos,
                    'color': (255, 0, 0),
                    'radius': 20
                })
            elif event.button == 3:  # Clic droit
                cercles.append({
                    'pos': event.pos,
                    'color': (0, 0, 255),
                    'radius': 30
                })
        
        # Mouvement de la molette
        elif event.type == pygame.MOUSEWHEEL:
            print(f"Molette: {event.y}")  # +1 vers le haut, -1 vers le bas
    
    # Position actuelle de la souris
    mouse_pos = pygame.mouse.get_pos()
    mouse_buttons = pygame.mouse.get_pressed()
    
    # Dessin continu si bouton enfoncé
    if mouse_buttons[0]:  # Bouton gauche maintenu
        cercles.append({
            'pos': mouse_pos,
            'color': (0, 255, 0),
            'radius': 5
        })
    
    # Rendu
    screen.fill((30, 30, 30))
    
    for cercle in cercles:
        pygame.draw.circle(screen, cercle['color'], 
                          cercle['pos'], cercle['radius'])
    
    # Afficher le curseur
    pygame.draw.circle(screen, (255, 255, 255), mouse_pos, 3)
    
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
```

### Combinaisons de touches

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
font = pygame.font.Font(None, 36)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            # Vérifier les modificateurs
            mods = pygame.key.get_mods()
            
            if event.key == pygame.K_s:
                if mods & pygame.KMOD_CTRL:
                    if mods & pygame.KMOD_SHIFT:
                        print("Ctrl+Shift+S: Sauvegarder sous...")
                    else:
                        print("Ctrl+S: Sauvegarder")
                else:
                    print("S pressé sans modificateur")
            
            elif event.key == pygame.K_z:
                if mods & pygame.KMOD_CTRL:
                    if mods & pygame.KMOD_SHIFT:
                        print("Ctrl+Shift+Z: Rétablir")
                    else:
                        print("Ctrl+Z: Annuler")
    
    # Afficher les modificateurs actifs
    screen.fill((0, 0, 0))
    mods = pygame.key.get_mods()
    
    text_lines = [
        f"CTRL: {'Oui' if mods & pygame.KMOD_CTRL else 'Non'}",
        f"SHIFT: {'Oui' if mods & pygame.KMOD_SHIFT else 'Non'}",
        f"ALT: {'Oui' if mods & pygame.KMOD_ALT else 'Non'}",
    ]
    
    for i, line in enumerate(text_lines):
        text = font.render(line, True, (255, 255, 255))
        screen.blit(text, (50, 50 + i * 40))
    
    pygame.display.flip()

pygame.quit()
```

## Chargement et affichage d'images

### Charger une image

```python
import pygame
import os

pygame.init()
screen = pygame.display.set_mode((800, 600))

# Charger une image
# Assurez-vous que le fichier existe
try:
    # Chemin relatif au script
    image = pygame.image.load("assets/player.png")
    
    # Convertir pour optimiser les performances
    # convert() pour images sans transparence
    # convert_alpha() pour images avec transparence (PNG)
    image = image.convert_alpha()
    
except pygame.error as e:
    print(f"Erreur de chargement: {e}")
    # Créer une image de remplacement
    image = pygame.Surface((64, 64))
    image.fill((255, 0, 255))  # Magenta pour indiquer l'erreur

# Obtenir le rectangle de l'image
image_rect = image.get_rect()
image_rect.center = (400, 300)  # Centrer l'image

# Afficher
screen.fill((50, 50, 50))
screen.blit(image, image_rect)
pygame.display.flip()

# Boucle d'attente
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
```

### Transformations d'images

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))

# Créer une image test
original = pygame.Surface((100, 60))
original.fill((0, 100, 255))
pygame.draw.polygon(original, (255, 255, 0), [(50, 10), (90, 50), (10, 50)])

# Transformations

# 1. Redimensionner
scaled = pygame.transform.scale(original, (200, 120))  # Nouvelle taille
scaled2 = pygame.transform.scale2x(original)  # Double la taille

# 2. Rotation
rotated = pygame.transform.rotate(original, 45)  # 45 degrés

# 3. Flip (miroir)
flipped_h = pygame.transform.flip(original, True, False)  # Horizontal
flipped_v = pygame.transform.flip(original, False, True)  # Vertical

# 4. Rotation et zoom
rotozoom = pygame.transform.rotozoom(original, 30, 1.5)  # 30°, 150%

# Afficher les transformations
screen.fill((30, 30, 30))

screen.blit(original, (50, 50))
font = pygame.font.Font(None, 24)
screen.blit(font.render("Original", True, (255, 255, 255)), (50, 120))

screen.blit(scaled, (200, 50))
screen.blit(font.render("Scaled", True, (255, 255, 255)), (200, 180))

screen.blit(rotated, (450, 50))
screen.blit(font.render("Rotated 45°", True, (255, 255, 255)), (450, 150))

screen.blit(flipped_h, (50, 250))
screen.blit(font.render("Flipped H", True, (255, 255, 255)), (50, 320))

screen.blit(flipped_v, (200, 250))
screen.blit(font.render("Flipped V", True, (255, 255, 255)), (200, 320))

screen.blit(rotozoom, (350, 250))
screen.blit(font.render("Rotozoom", True, (255, 255, 255)), (350, 400))

pygame.display.flip()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
```

## Affichage de texte

### Texte basique

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))

# Police par défaut
font_default = pygame.font.Font(None, 48)  # None = police par défaut

# Police système
font_system = pygame.font.SysFont("arial", 36)

# Police personnalisée (fichier TTF)
try:
    font_custom = pygame.font.Font("assets/fonts/mafont.ttf", 32)
except:
    font_custom = pygame.font.Font(None, 32)

# Créer une surface de texte
# render(texte, antialiasing, couleur, background=None)
text1 = font_default.render("Police par défaut", True, (255, 255, 255))
text2 = font_system.render("Police système Arial", True, (0, 255, 0))
text3 = font_custom.render("Police personnalisée", True, (255, 255, 0))

# Texte avec fond
text4 = font_default.render("Texte avec fond", True, (0, 0, 0), (255, 255, 255))

# Afficher
screen.fill((30, 30, 30))

screen.blit(text1, (50, 50))
screen.blit(text2, (50, 120))
screen.blit(text3, (50, 190))
screen.blit(text4, (50, 260))

# Centrer un texte
text_center = font_default.render("Texte centré", True, (255, 128, 0))
text_rect = text_center.get_rect(center=(400, 400))
screen.blit(text_center, text_rect)

pygame.display.flip()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
```

### Classe utilitaire pour le texte

```python
import pygame

class TextRenderer:
    """Classe utilitaire pour faciliter le rendu de texte"""
    
    def __init__(self):
        pygame.font.init()
        self.fonts = {}
        self.load_fonts()
    
    def load_fonts(self):
        """Charger les polices courantes"""
        self.fonts['small'] = pygame.font.Font(None, 24)
        self.fonts['medium'] = pygame.font.Font(None, 36)
        self.fonts['large'] = pygame.font.Font(None, 48)
        self.fonts['title'] = pygame.font.Font(None, 72)
    
    def render(self, text, size='medium', color=(255, 255, 255), 
               bg_color=None, antialias=True):
        """Rendre du texte"""
        font = self.fonts.get(size, self.fonts['medium'])
        return font.render(text, antialias, color, bg_color)
    
    def render_centered(self, surface, text, y, size='medium', 
                       color=(255, 255, 255)):
        """Rendre du texte centré horizontalement"""
        text_surface = self.render(text, size, color)
        x = (surface.get_width() - text_surface.get_width()) // 2
        surface.blit(text_surface, (x, y))
    
    def render_multiline(self, surface, text, x, y, size='medium', 
                        color=(255, 255, 255), line_spacing=5):
        """Rendre du texte multi-lignes"""
        font = self.fonts.get(size, self.fonts['medium'])
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            line_surface = font.render(line, True, color)
            line_y = y + i * (font.get_height() + line_spacing)
            surface.blit(line_surface, (x, line_y))

# Utilisation
pygame.init()
screen = pygame.display.set_mode((800, 600))
text_renderer = TextRenderer()

screen.fill((30, 30, 30))

text_renderer.render_centered(screen, "Titre du Jeu", 50, 'title', (255, 215, 0))
text_renderer.render_centered(screen, "Appuyez sur ESPACE pour commencer", 150)

text_renderer.render_multiline(
    screen,
    "Ligne 1\nLigne 2\nLigne 3",
    50, 250
)

pygame.display.flip()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
```

## Sons et musique

### Sons courts (effets)

```python
import pygame

pygame.init()
pygame.mixer.init()  # Initialiser le système audio

screen = pygame.display.set_mode((800, 600))

# Charger des sons
try:
    son_tir = pygame.mixer.Sound("assets/sounds/shoot.wav")
    son_explosion = pygame.mixer.Sound("assets/sounds/explosion.wav")
    son_bonus = pygame.mixer.Sound("assets/sounds/bonus.ogg")
    
    # Ajuster le volume (0.0 à 1.0)
    son_tir.set_volume(0.5)
    son_explosion.set_volume(0.7)
    
except pygame.error as e:
    print(f"Erreur de chargement audio: {e}")
    son_tir = son_explosion = son_bonus = None

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and son_tir:
                son_tir.play()
            elif event.key == pygame.K_e and son_explosion:
                son_explosion.play()
            elif event.key == pygame.K_b and son_bonus:
                son_bonus.play()
    
    screen.fill((0, 0, 0))
    font = pygame.font.Font(None, 36)
    text = font.render("SPACE=Tir, E=Explosion, B=Bonus", True, (255, 255, 255))
    screen.blit(text, (150, 280))
    pygame.display.flip()

pygame.quit()
```

### Musique de fond

```python
import pygame

pygame.init()
pygame.mixer.init()

screen = pygame.display.set_mode((800, 600))

# Charger et jouer la musique de fond
try:
    pygame.mixer.music.load("assets/music/background.mp3")
    pygame.mixer.music.set_volume(0.3)
    pygame.mixer.music.play(-1)  # -1 = boucle infinie
except pygame.error as e:
    print(f"Erreur musique: {e}")

volume = 0.3
paused = False

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_p:
                # Pause/Reprendre
                if paused:
                    pygame.mixer.music.unpause()
                else:
                    pygame.mixer.music.pause()
                paused = not paused
            
            elif event.key == pygame.K_UP:
                # Augmenter le volume
                volume = min(1.0, volume + 0.1)
                pygame.mixer.music.set_volume(volume)
            
            elif event.key == pygame.K_DOWN:
                # Diminuer le volume
                volume = max(0.0, volume - 0.1)
                pygame.mixer.music.set_volume(volume)
            
            elif event.key == pygame.K_s:
                # Arrêter la musique
                pygame.mixer.music.stop()
    
    screen.fill((30, 30, 30))
    font = pygame.font.Font(None, 36)
    
    lines = [
        f"Volume: {volume:.1f}",
        f"Pause: {'Oui' if paused else 'Non'}",
        "",
        "P = Pause/Reprendre",
        "UP/DOWN = Volume",
        "S = Stop"
    ]
    
    for i, line in enumerate(lines):
        text = font.render(line, True, (255, 255, 255))
        screen.blit(text, (50, 50 + i * 40))
    
    pygame.display.flip()

pygame.mixer.music.stop()
pygame.quit()
```

## Gestion du temps

### Delta Time pour un mouvement fluide

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

# Position et vitesse
x = 400.0
y = 300.0
speed = 200  # Pixels par seconde (pas par frame !)

running = True
while running:
    # Delta time en secondes
    dt = clock.tick(60) / 1000.0
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Mouvement basé sur le delta time
    # Ainsi, la vitesse est constante quel que soit le FPS
    keys = pygame.key.get_pressed()
    
    if keys[pygame.K_LEFT]:
        x -= speed * dt
    if keys[pygame.K_RIGHT]:
        x += speed * dt
    if keys[pygame.K_UP]:
        y -= speed * dt
    if keys[pygame.K_DOWN]:
        y += speed * dt
    
    # Affichage
    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 255, 0), (int(x), int(y)), 25)
    
    # Afficher les FPS
    fps = clock.get_fps()
    font = pygame.font.Font(None, 36)
    fps_text = font.render(f"FPS: {fps:.1f}", True, (255, 255, 255))
    screen.blit(fps_text, (10, 10))
    
    pygame.display.flip()

pygame.quit()
```

### Timers et événements temporisés

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

# Événements personnalisés
SPAWN_ENEMY = pygame.USEREVENT + 1
POWER_UP = pygame.USEREVENT + 2

# Démarrer les timers (en millisecondes)
pygame.time.set_timer(SPAWN_ENEMY, 2000)  # Toutes les 2 secondes
pygame.time.set_timer(POWER_UP, 5000)     # Toutes les 5 secondes

enemies = []
power_ups = []
import random

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        elif event.type == SPAWN_ENEMY:
            # Spawn un ennemi
            x = random.randint(50, 750)
            enemies.append({'x': x, 'y': 0})
            print(f"Ennemi spawné en x={x}")
        
        elif event.type == POWER_UP:
            # Spawn un power-up
            x = random.randint(50, 750)
            y = random.randint(50, 550)
            power_ups.append({'x': x, 'y': y})
            print(f"Power-up en ({x}, {y})")
    
    # Mise à jour
    for enemy in enemies:
        enemy['y'] += 2
    
    # Supprimer les ennemis hors écran
    enemies = [e for e in enemies if e['y'] < 650]
    
    # Rendu
    screen.fill((30, 30, 30))
    
    for enemy in enemies:
        pygame.draw.rect(screen, (255, 0, 0), 
                        (enemy['x'] - 20, enemy['y'] - 20, 40, 40))
    
    for pu in power_ups:
        pygame.draw.circle(screen, (0, 255, 255), (pu['x'], pu['y']), 15)
    
    pygame.display.flip()
    clock.tick(60)

# Arrêter les timers
pygame.time.set_timer(SPAWN_ENEMY, 0)
pygame.time.set_timer(POWER_UP, 0)

pygame.quit()
```

## Exercice pratique : Mini-jeu de clic

```python
"""
Mini-jeu : Cliquez sur les cercles avant qu'ils disparaissent !
"""
import pygame
import random
import sys

pygame.init()

# Configuration
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60

# Couleurs
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 50, 50)
GREEN = (50, 255, 50)
BLUE = (50, 50, 255)

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Jeu de Clic")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 48)

class Target:
    def __init__(self):
        self.radius = random.randint(20, 50)
        self.x = random.randint(self.radius, SCREEN_WIDTH - self.radius)
        self.y = random.randint(self.radius + 100, SCREEN_HEIGHT - self.radius)
        self.color = (random.randint(100, 255), 
                     random.randint(100, 255), 
                     random.randint(100, 255))
        self.timer = random.randint(60, 180)  # Frames avant disparition
        self.points = 60 - self.radius  # Plus petites = plus de points
    
    def update(self):
        self.timer -= 1
        return self.timer <= 0  # True si expiré
    
    def draw(self, surface):
        # Cercle principal
        pygame.draw.circle(surface, self.color, (self.x, self.y), self.radius)
        # Bordure
        pygame.draw.circle(surface, WHITE, (self.x, self.y), self.radius, 2)
        # Indicateur de temps restant
        progress = self.timer / 180
        pygame.draw.arc(surface, RED, 
                       (self.x - self.radius - 5, self.y - self.radius - 5,
                        (self.radius + 5) * 2, (self.radius + 5) * 2),
                       0, progress * 6.28, 3)
    
    def contains_point(self, pos):
        dx = pos[0] - self.x
        dy = pos[1] - self.y
        return (dx * dx + dy * dy) <= (self.radius * self.radius)

# Variables de jeu
targets = []
score = 0
missed = 0
spawn_timer = 0
game_over = False

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if game_over:
                # Recommencer
                targets = []
                score = 0
                missed = 0
                game_over = False
            else:
                # Vérifier si on a cliqué sur une cible
                hit = False
                for target in targets[:]:  # Copie pour pouvoir modifier
                    if target.contains_point(event.pos):
                        score += target.points
                        targets.remove(target)
                        hit = True
                        break
                
                if not hit:
                    score = max(0, score - 10)  # Pénalité pour clic manqué
    
    if not game_over:
        # Spawn de nouvelles cibles
        spawn_timer += 1
        if spawn_timer >= 30 and len(targets) < 10:
            targets.append(Target())
            spawn_timer = 0
        
        # Mise à jour des cibles
        for target in targets[:]:
            if target.update():
                targets.remove(target)
                missed += 1
                if missed >= 10:
                    game_over = True
    
    # Rendu
    screen.fill(BLACK)
    
    # Interface
    score_text = font.render(f"Score: {score}", True, WHITE)
    missed_text = font.render(f"Manqués: {missed}/10", True, 
                              RED if missed > 5 else WHITE)
    screen.blit(score_text, (20, 20))
    screen.blit(missed_text, (SCREEN_WIDTH - 200, 20))
    
    # Ligne de séparation
    pygame.draw.line(screen, WHITE, (0, 80), (SCREEN_WIDTH, 80), 2)
    
    if game_over:
        go_text = font.render("GAME OVER - Cliquez pour recommencer", 
                             True, RED)
        text_rect = go_text.get_rect(center=(SCREEN_WIDTH // 2, 
                                             SCREEN_HEIGHT // 2))
        screen.blit(go_text, text_rect)
    else:
        # Dessiner les cibles
        for target in targets:
            target.draw(screen)
    
    pygame.display.flip()
    clock.tick(FPS)

pygame.quit()
sys.exit()
```

## Bonnes pratiques

### ✅ À faire

- **Initialiser correctement** : Toujours appeler `pygame.init()` au début
- **Utiliser `convert()` ou `convert_alpha()`** : Pour optimiser le rendu des images
- **Utiliser le delta time** : Pour un mouvement indépendant du framerate
- **Gérer les ressources** : Charger les images/sons une seule fois
- **Organiser le code** : Séparer événements, logique et rendu
- **Nettoyer** : Appeler `pygame.quit()` à la fin

### ❌ À éviter

- **Ignorer les erreurs de chargement** : Toujours gérer les exceptions
- **Hardcoder les valeurs** : Utiliser des constantes
- **Oublier `pygame.display.flip()`** : L'écran ne se met pas à jour automatiquement
- **Créer des ressources dans la boucle** : Charge le CPU/mémoire inutilement
- **Ignorer les FPS** : Peut causer des saccades ou surconsommation CPU

## Ressources

- **Documentation officielle** : https://www.pygame.org/docs
- **Tutoriels** : https://www.pygame.org/wiki/tutorials
- **Exemples** : https://github.com/pygame/pygame/tree/main/examples
- **Assets gratuits** :
  - https://opengameart.org
  - https://itch.io/game-assets/free
  - https://kenney.nl/assets