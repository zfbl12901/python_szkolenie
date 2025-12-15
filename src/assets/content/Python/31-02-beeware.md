---
title: "BeeWare - Applications Multi-plateformes"
order: 2
parent: "31-applications-mobiles.md"
tags: ["python", "mobile", "beeware", "cross-platform"]
---

# BeeWare - Applications Multi-plateformes

## Introduction

BeeWare est un ensemble d'outils et de bibliothèques pour développer des applications Python natives. Il permet de créer des applications qui utilisent les widgets natifs de chaque plateforme (iOS, Android, Windows, macOS, Linux).

## Pourquoi BeeWare ?

- **Interface native** : Utilise les widgets natifs de chaque plateforme
- **Performance native** : Compile vers du code natif
- **Une seule base de code** : Python pour tout
- **Look and feel natif** : L'app ressemble à une app native
- **Accès aux APIs natives** : Accès complet aux fonctionnalités de la plateforme

## Installation

```bash
pip install briefcase
```

## Créer un nouveau projet

```bash
# Créer un nouveau projet
briefcase new

# Répondre aux questions :
# - Formal name: Mon Application
# - App name: monapp
# - Bundle ID: com.example.monapp
# - Project name: mon-app
```

## Structure d'un projet BeeWare

```
mon-app/
├── src/
│   └── monapp/
│       ├── __init__.py
│       ├── app.py          # Point d'entrée
│       └── __main__.py
├── tests/
├── pyproject.toml          # Configuration
└── README.md
```

## Premier exemple

```python
# src/monapp/app.py
import toga
from toga.style import Pack
from toga.style.pack import COLUMN, ROW

class HelloWorld(toga.App):
    def startup(self):
        # Créer la fenêtre principale
        main_box = toga.Box(style=Pack(direction=COLUMN, padding=10))
        
        # Label
        name_label = toga.Label('Entrez votre nom:', style=Pack(padding=5))
        self.name_input = toga.TextInput(style=Pack(padding=5, flex=1))
        
        # Bouton
        button = toga.Button(
            'Dire bonjour',
            on_press=self.say_hello,
            style=Pack(padding=5)
        )
        
        # Label de résultat
        self.greeting_label = toga.Label('', style=Pack(padding=5))
        
        # Ajouter les widgets
        main_box.add(name_label)
        main_box.add(self.name_input)
        main_box.add(button)
        main_box.add(self.greeting_label)
        
        # Créer la fenêtre
        self.main_window = toga.MainWindow(title='Mon Application')
        self.main_window.content = main_box
        self.main_window.show()
    
    def say_hello(self, widget):
        name = self.name_input.value
        if name:
            self.greeting_label.text = f'Bonjour, {name}!'
        else:
            self.greeting_label.text = 'Veuillez entrer un nom'

def main():
    return HelloWorld('Mon App', 'com.example.monapp')

if __name__ == '__main__':
    app = main()
    app.main_loop()
```

## Widgets de base

### Label

```python
import toga

label = toga.Label(
    'Mon texte',
    style=Pack(padding=10, font_size=18)
)
```

### TextInput

```python
text_input = toga.TextInput(
    placeholder='Entrez du texte',
    style=Pack(padding=10, flex=1)
)
```

### Button

```python
button = toga.Button(
    'Cliquer',
    on_press=self.on_click,
    style=Pack(padding=10)
)
```

### Box (Layout)

```python
from toga.style.pack import COLUMN, ROW

# Vertical
box = toga.Box(style=Pack(direction=COLUMN, padding=10))

# Horizontal
box = toga.Box(style=Pack(direction=ROW, padding=10))
```

## Développement et test

### Mode développement

```bash
# Tester l'application
briefcase dev

# Tester sur une plateforme spécifique
briefcase dev -t android
briefcase dev -t ios
```

### Build

```bash
# Construire pour toutes les plateformes
briefcase build

# Construire pour une plateforme spécifique
briefcase build android
briefcase build ios
```

## Avantages et limitations

### Avantages

- ✅ Interface vraiment native
- ✅ Performance native
- ✅ Accès aux APIs natives
- ✅ Look and feel natif

### Limitations

- ⚠️ Encore en développement actif
- ⚠️ Moins de ressources que Kivy
- ⚠️ Courbe d'apprentissage plus élevée
- ⚠️ Documentation moins complète

## Ressources

- **Documentation** : https://docs.beeware.org
- **Toga** : https://toga.readthedocs.io
- **GitHub** : https://github.com/beeware

