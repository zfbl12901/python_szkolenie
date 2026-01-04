---
title: "Applications Desktop (Tkinter, PyQt)"
order: 3
parent: "30-applications-python.md"
tags: ["python", "desktop", "tkinter", "pyqt", "gui"]
---

# Applications Desktop (Tkinter, PyQt)

## Introduction

Les applications desktop offrent des interfaces graphiques natives pour Windows, macOS et Linux. Python propose plusieurs bibliothèques pour créer ces interfaces.

## Choix de la bibliothèque

### Tkinter
- ✅ Inclus avec Python
- ✅ Simple à apprendre
- ✅ Léger
- ⚠️ Interface basique

### PyQt/PySide
- ✅ Interface moderne et professionnelle
- ✅ Très puissant
- ✅ Nombreux composants
- ⚠️ Plus complexe
- ⚠️ Licence à vérifier

## Tkinter

### Installation

Tkinter est inclus avec Python. Si nécessaire :

```bash
# Ubuntu/Debian
sudo apt-get install python3-tk

# macOS (avec Homebrew)
brew install python-tk
```

### Premier exemple

```python
import tkinter as tk

root = tk.Tk()
root.title("Mon Application")
root.geometry("400x300")

label = tk.Label(root, text="Bonjour, Tkinter!")
label.pack()

button = tk.Button(root, text="Cliquer", command=lambda: print("Clic!"))
button.pack()

root.mainloop()
```

### Widgets de base

```python
import tkinter as tk
from tkinter import messagebox

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("Exemple Tkinter")
        self.root.geometry("400x300")
        
        # Label
        self.label = tk.Label(root, text="Entrez votre nom:")
        self.label.pack(pady=10)
        
        # Entry (champ de texte)
        self.entry = tk.Entry(root, width=30)
        self.entry.pack(pady=5)
        
        # Button
        self.button = tk.Button(
            root, 
            text="Valider", 
            command=self.on_click
        )
        self.button.pack(pady=10)
        
        # Text (zone de texte multi-lignes)
        self.text = tk.Text(root, height=10, width=40)
        self.text.pack(pady=10)
    
    def on_click(self):
        name = self.entry.get()
        if name:
            self.text.insert("1.0", f"Bonjour, {name}!\n")
            messagebox.showinfo("Succès", f"Bienvenue, {name}!")
        else:
            messagebox.showwarning("Attention", "Veuillez entrer un nom")

root = tk.Tk()
app = App(root)
root.mainloop()
```

### Layout avec Grid

```python
import tkinter as tk

root = tk.Tk()
root.title("Layout Grid")

# Utiliser grid au lieu de pack
tk.Label(root, text="Nom:").grid(row=0, column=0, padx=5, pady=5)
tk.Entry(root).grid(row=0, column=1, padx=5, pady=5)

tk.Label(root, text="Email:").grid(row=1, column=0, padx=5, pady=5)
tk.Entry(root).grid(row=1, column=1, padx=5, pady=5)

tk.Button(root, text="Valider").grid(row=2, column=0, columnspan=2, pady=10)

root.mainloop()
```

### Application complète : Gestionnaire de tâches

```python
import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime

class TaskManager:
    def __init__(self, root):
        self.root = root
        self.root.title("Gestionnaire de Tâches")
        self.root.geometry("600x400")
        
        self.tasks = []
        
        # Frame pour l'ajout
        add_frame = tk.Frame(root)
        add_frame.pack(pady=10)
        
        self.task_entry = tk.Entry(add_frame, width=40)
        self.task_entry.pack(side=tk.LEFT, padx=5)
        
        add_button = tk.Button(
            add_frame, 
            text="Ajouter", 
            command=self.add_task
        )
        add_button.pack(side=tk.LEFT)
        
        # Treeview pour afficher les tâches
        self.tree = ttk.Treeview(
            root, 
            columns=("Status", "Date"), 
            show="tree headings",
            height=15
        )
        self.tree.heading("#0", text="Tâche")
        self.tree.heading("Status", text="Statut")
        self.tree.heading("Date", text="Date")
        self.tree.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)
        
        # Boutons d'action
        action_frame = tk.Frame(root)
        action_frame.pack(pady=10)
        
        tk.Button(
            action_frame, 
            text="Marquer comme fait", 
            command=self.mark_done
        ).pack(side=tk.LEFT, padx=5)
        
        tk.Button(
            action_frame, 
            text="Supprimer", 
            command=self.delete_task
        ).pack(side=tk.LEFT, padx=5)
    
    def add_task(self):
        task_text = self.task_entry.get()
        if task_text:
            task_id = len(self.tasks)
            self.tasks.append({
                "id": task_id,
                "text": task_text,
                "done": False,
                "date": datetime.now().strftime("%Y-%m-%d %H:%M")
            })
            self.tree.insert(
                "", 
                tk.END, 
                text=task_text,
                values=("À faire", self.tasks[-1]["date"]),
                tags=(task_id,)
            )
            self.task_entry.delete(0, tk.END)
        else:
            messagebox.showwarning("Attention", "Veuillez entrer une tâche")
    
    def mark_done(self):
        selected = self.tree.selection()
        if selected:
            item = self.tree.item(selected[0])
            task_id = int(item["tags"][0])
            self.tasks[task_id]["done"] = True
            self.tree.item(selected[0], values=("Fait", self.tasks[task_id]["date"]))
    
    def delete_task(self):
        selected = self.tree.selection()
        if selected:
            self.tree.delete(selected[0])

root = tk.Tk()
app = TaskManager(root)
root.mainloop()
```

## PyQt5

### Installation

```bash
pip install PyQt5
```

### Premier exemple

```python
import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QPushButton

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Mon Application PyQt")
        self.setGeometry(100, 100, 400, 300)
        
        label = QLabel("Bonjour, PyQt!", self)
        label.move(150, 100)
        
        button = QPushButton("Cliquer", self)
        button.move(150, 150)
        button.clicked.connect(self.on_button_click)
    
    def on_button_click(self):
        print("Bouton cliqué!")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
```

### Application avec Qt Designer

```python
from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5 import uic
import sys

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        uic.loadUi('main.ui', self)  # Charger le fichier .ui
        self.setup_ui()
    
    def setup_ui(self):
        self.pushButton.clicked.connect(self.on_click)
    
    def on_click(self):
        self.label.setText("Bouton cliqué!")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
```

### Exemple complet : Calculatrice

```python
import sys
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, 
                             QVBoxLayout, QGridLayout, QLineEdit, QPushButton)

class Calculator(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Calculatrice")
        self.setGeometry(100, 100, 300, 400)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        layout = QVBoxLayout()
        central_widget.setLayout(layout)
        
        # Écran
        self.display = QLineEdit()
        self.display.setReadOnly(True)
        self.display.setStyleSheet("font-size: 20px; padding: 10px;")
        layout.addWidget(self.display)
        
        # Boutons
        buttons_layout = QGridLayout()
        
        buttons = [
            ['7', '8', '9', '/'],
            ['4', '5', '6', '*'],
            ['1', '2', '3', '-'],
            ['0', '.', '=', '+'],
            ['C', 'CE']
        ]
        
        for i, row in enumerate(buttons):
            for j, text in enumerate(row):
                button = QPushButton(text)
                button.setStyleSheet("font-size: 16px; padding: 10px;")
                button.clicked.connect(lambda checked, t=text: self.on_button_click(t))
                buttons_layout.addWidget(button, i, j)
        
        layout.addLayout(buttons_layout)
        
        self.current = ""
        self.operator = None
        self.previous = None
    
    def on_button_click(self, text):
        if text.isdigit() or text == '.':
            self.current += text
            self.display.setText(self.current)
        elif text in ['+', '-', '*', '/']:
            if self.current:
                self.previous = float(self.current)
                self.operator = text
                self.current = ""
        elif text == '=':
            if self.previous is not None and self.operator and self.current:
                try:
                    result = self.calculate(
                        self.previous, 
                        float(self.current), 
                        self.operator
                    )
                    self.display.setText(str(result))
                    self.current = str(result)
                    self.previous = None
                    self.operator = None
                except:
                    self.display.setText("Erreur")
        elif text == 'C':
            self.current = ""
            self.display.clear()
        elif text == 'CE':
            self.current = ""
            self.previous = None
            self.operator = None
            self.display.clear()
    
    def calculate(self, a, b, op):
        if op == '+':
            return a + b
        elif op == '-':
            return a - b
        elif op == '*':
            return a * b
        elif op == '/':
            return a / b

if __name__ == '__main__':
    app = QApplication(sys.argv)
    calc = Calculator()
    calc.show()
    sys.exit(app.exec_())
```

## Comparaison Tkinter vs PyQt

| Critère | Tkinter | PyQt |
|---------|---------|------|
| Simplicité | ✅ Très simple | ⚠️ Plus complexe |
| Interface | ⚠️ Basique | ✅ Moderne |
| Performance | ✅ Bonne | ✅ Excellente |
| Documentation | ✅ Bonne | ✅ Excellente |
| Licence | ✅ Libre | ⚠️ À vérifier |

## Bonnes pratiques

### ✅ À faire

- Organiser le code en classes
- Séparer la logique de l'interface
- Gérer les erreurs
- Utiliser des layouts appropriés
- Tester sur différentes plateformes

### ❌ À éviter

- Tout mettre dans une fonction
- Ignorer la gestion d'erreurs
- Hardcoder les tailles
- Ne pas utiliser de layouts
- Ignorer l'accessibilité

## Ressources

- **Tkinter** : https://docs.python.org/3/library/tkinter.html
- **PyQt5** : https://www.riverbankcomputing.com/static/Docs/PyQt5
- **Tutoriels** : Nombreux tutoriels disponibles en ligne
