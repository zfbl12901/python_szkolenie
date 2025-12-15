---
title: "Développement d'Applications Mobiles"
order: 31
parent: null
tags: ["python", "mobile", "android", "ios", "kivy", "beeware"]
---

# Développement d'Applications Mobiles

## Introduction

Développer des applications mobiles avec Python est possible grâce à plusieurs frameworks qui permettent de créer des apps iOS et Android.

## Frameworks disponibles

### 1. Kivy
- ✅ Multi-plateforme (iOS, Android, Windows, macOS, Linux)
- ✅ Interface moderne et personnalisable
- ✅ Open-source
- ⚠️ Courbe d'apprentissage

### 2. BeeWare
- ✅ Compile vers natif
- ✅ Interface native
- ✅ Support complet iOS/Android
- ⚠️ Encore en développement actif

### 3. React Native + Python
- ✅ Backend Python, frontend React Native
- ✅ Performance native
- ⚠️ Nécessite JavaScript

## Kivy - Framework principal

### Installation

```bash
pip install kivy
# Pour Android
pip install buildozer
```

### Premier exemple

```python
from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.boxlayout import BoxLayout

class MyApp(App):
    def build(self):
        layout = BoxLayout(orientation='vertical', padding=10)
        
        label = Label(text='Bonjour Kivy!', font_size=24)
        button = Button(text='Cliquer', size_hint=(1, 0.3))
        button.bind(on_press=self.on_button_click)
        
        layout.add_widget(label)
        layout.add_widget(button)
        
        return layout
    
    def on_button_click(self, instance):
        print("Bouton cliqué!")

if __name__ == '__main__':
    MyApp().run()
```

### Interface avec KV Language

```python
# main.py
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout

class MyLayout(BoxLayout):
    def on_button_click(self):
        self.ids.label.text = "Bouton cliqué!"

class MyApp(App):
    def build(self):
        return MyLayout()

if __name__ == '__main__':
    MyApp().run()
```

```kv
# my.kv
<MyLayout>:
    orientation: 'vertical'
    padding: 10
    
    Label:
        id: label
        text: 'Bonjour Kivy!'
        font_size: 24
    
    Button:
        text: 'Cliquer'
        size_hint_y: 0.3
        on_press: root.on_button_click()
```

### Application complète : Liste de tâches

```python
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.scrollview import ScrollView

class TaskList(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 10
        self.spacing = 10
        
        # Input pour nouvelle tâche
        input_layout = BoxLayout(size_hint_y=None, height=40)
        self.task_input = TextInput(hint_text='Nouvelle tâche', multiline=False)
        add_button = Button(text='Ajouter', size_hint_x=0.3)
        add_button.bind(on_press=self.add_task)
        
        input_layout.add_widget(self.task_input)
        input_layout.add_widget(add_button)
        self.add_widget(input_layout)
        
        # ScrollView pour la liste
        scroll = ScrollView()
        self.task_list = BoxLayout(orientation='vertical', size_hint_y=None)
        self.task_list.bind(minimum_height=self.task_list.setter('height'))
        scroll.add_widget(self.task_list)
        self.add_widget(scroll)
    
    def add_task(self, instance):
        task_text = self.task_input.text
        if task_text:
            task_layout = BoxLayout(size_hint_y=None, height=40)
            label = Label(text=task_text, text_size=(None, None), halign='left')
            delete_btn = Button(text='X', size_hint_x=0.2)
            delete_btn.bind(on_press=lambda x, layout=task_layout: self.remove_task(layout))
            
            task_layout.add_widget(label)
            task_layout.add_widget(delete_btn)
            self.task_list.add_widget(task_layout)
            self.task_input.text = ''
    
    def remove_task(self, task_layout):
        self.task_list.remove_widget(task_layout)

class TaskApp(App):
    def build(self):
        return TaskList()

if __name__ == '__main__':
    TaskApp().run()
```

## BeeWare

### Installation

```bash
pip install briefcase
```

### Créer un projet

```bash
briefcase new
briefcase dev  # Pour tester
briefcase build  # Pour compiler
```

## Déploiement Android

### Avec Buildozer (Kivy)

```bash
# Créer buildozer.spec
buildozer init

# Construire l'APK
buildozer android debug
```

## Bonnes pratiques

### ✅ À faire

- Tester sur différentes tailles d'écran
- Optimiser les performances
- Gérer les permissions
- Utiliser des layouts adaptatifs
- Tester sur appareils réels

### ❌ À éviter

- Ignorer les différentes résolutions
- Ne pas optimiser les images
- Oublier les permissions
- Hardcoder les tailles
- Ne tester que sur émulateur

## Ressources

- **Kivy** : https://kivy.org
- **BeeWare** : https://beeware.org
- **Documentation** : https://kivy.org/doc/stable
