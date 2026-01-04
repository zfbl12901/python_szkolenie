---
title: "Exercices - Bases Python"
order: 12
parent: null
tags: ["python", "exercices", "practice", "basics"]
---

# Exercices - Bases Python

Cette section contient des exercices pratiques pour consolider vos connaissances des bases de Python. Commencez par les exercices simples, puis progressez vers les projets plus complexes.

## Exercices de base

### Exercice 1 : Variables et Types

#### Énoncé

1. Créez trois variables : `nom` (string), `age` (int), et `taille` (float)
2. Affichez ces variables dans une phrase formatée
3. Convertissez l'âge en string et concaténez-le avec le nom
4. Créez une liste contenant 5 nombres, puis calculez leur somme et moyenne
5. Créez un dictionnaire représentant une personne avec nom, âge, et ville

#### Solution

```python
# 1. Variables
nom = "Alice"
age = 25
taille = 1.75

# 2. Affichage formaté
print(f"{nom} a {age} ans et mesure {taille}m")

# 3. Conversion et concaténation
age_str = str(age)
message = nom + " a " + age_str + " ans"
print(message)

# 4. Liste et calculs
nombres = [10, 20, 30, 40, 50]
somme = sum(nombres)
moyenne = somme / len(nombres)
print(f"Somme : {somme}, Moyenne : {moyenne}")

# 5. Dictionnaire
personne = {
    "nom": "Alice",
    "age": 25,
    "ville": "Paris"
}
print(personne)
```

### Exercice 2 : Structures de contrôle

#### Énoncé

1. Écrivez un programme qui demande l'âge et affiche "Mineur", "Adulte" ou "Senior"
2. Créez une boucle qui affiche les nombres pairs de 0 à 20
3. Écrivez un programme qui trouve le plus grand nombre dans une liste
4. Créez un programme qui compte les voyelles dans une chaîne de caractères
5. Écrivez une fonction qui vérifie si un nombre est premier

#### Solution

```python
# 1. Classification par âge
age = int(input("Entrez votre âge : "))
if age < 18:
    print("Mineur")
elif age < 65:
    print("Adulte")
else:
    print("Senior")

# 2. Nombres pairs
for i in range(0, 21, 2):
    print(i)

# 3. Plus grand nombre
nombres = [3, 7, 2, 9, 1, 5]
plus_grand = nombres[0]
for nombre in nombres:
    if nombre > plus_grand:
        plus_grand = nombre
print(f"Plus grand : {plus_grand}")

# Ou plus simplement :
print(f"Plus grand : {max(nombres)}")

# 4. Compter les voyelles
texte = "Bonjour le monde"
voyelles = "aeiouAEIOU"
compteur = 0
for lettre in texte:
    if lettre in voyelles:
        compteur += 1
print(f"Nombre de voyelles : {compteur}")

# 5. Nombre premier
def est_premier(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

print(est_premier(17))  # True
print(est_premier(20))  # False
```

### Exercice 3 : Fonctions

#### Énoncé

1. Créez une fonction `calculer_moyenne` qui prend une liste de nombres et retourne la moyenne
2. Écrivez une fonction `inverser_chaine` qui inverse une chaîne de caractères
3. Créez une fonction `compter_mots` qui compte le nombre de mots dans une phrase
4. Écrivez une fonction `est_palindrome` qui vérifie si un mot est un palindrome
5. Créez une fonction avec valeurs par défaut qui formate une adresse

#### Solution

```python
# 1. Calculer moyenne
def calculer_moyenne(nombres):
    if not nombres:
        return 0
    return sum(nombres) / len(nombres)

print(calculer_moyenne([10, 20, 30]))  # 20.0

# 2. Inverser chaîne
def inverser_chaine(chaine):
    return chaine[::-1]

print(inverser_chaine("Python"))  # nohtyP

# 3. Compter mots
def compter_mots(phrase):
    mots = phrase.split()
    return len(mots)

print(compter_mots("Bonjour le monde"))  # 3

# 4. Palindrome
def est_palindrome(mot):
    mot = mot.lower().replace(" ", "")
    return mot == mot[::-1]

print(est_palindrome("radar"))  # True
print(est_palindrome("Python"))  # False

# 5. Formatage d'adresse
def formater_adresse(numero, rue, ville, code_postal, pays="France"):
    return f"{numero} {rue}\n{code_postal} {ville}\n{pays}"

adresse = formater_adresse(10, "Rue de la Paix", "Paris", "75001")
print(adresse)
```

## Projets pratiques

### Projet 1 : Calculatrice simple

#### Énoncé

Créez une calculatrice interactive qui :
- Demande deux nombres à l'utilisateur
- Propose les opérations : addition, soustraction, multiplication, division
- Affiche le résultat
- Gère les erreurs (division par zéro, entrées invalides)
- Permet de continuer ou quitter

#### Solution

```python
def calculatrice():
    """Calculatrice interactive simple"""
    
    print("=== Calculatrice ===")
    
    while True:
        try:
            # Saisie des nombres
            nombre1 = float(input("Entrez le premier nombre : "))
            nombre2 = float(input("Entrez le deuxième nombre : "))
            
            # Choix de l'opération
            print("\nOpérations disponibles :")
            print("1. Addition (+)")
            print("2. Soustraction (-)")
            print("3. Multiplication (*)")
            print("4. Division (/)")
            
            choix = input("\nChoisissez une opération (1-4) : ")
            
            # Calcul
            if choix == "1":
                resultat = nombre1 + nombre2
                operation = "+"
            elif choix == "2":
                resultat = nombre1 - nombre2
                operation = "-"
            elif choix == "3":
                resultat = nombre1 * nombre2
                operation = "*"
            elif choix == "4":
                if nombre2 == 0:
                    print("Erreur : Division par zéro impossible")
                    continue
                resultat = nombre1 / nombre2
                operation = "/"
            else:
                print("Choix invalide")
                continue
            
            # Affichage du résultat
            print(f"\n{nombre1} {operation} {nombre2} = {resultat}")
            
        except ValueError:
            print("Erreur : Veuillez entrer des nombres valides")
        except Exception as e:
            print(f"Erreur inattendue : {e}")
        
        # Continuer ou quitter
        continuer = input("\nVoulez-vous faire un autre calcul ? (o/n) : ")
        if continuer.lower() != "o":
            print("Au revoir !")
            break

# Lancer la calculatrice
calculatrice()
```

### Projet 2 : Gestionnaire de tâches

#### Énoncé

Créez un gestionnaire de tâches qui permet de :
- Ajouter une tâche
- Lister toutes les tâches
- Marquer une tâche comme terminée
- Supprimer une tâche
- Sauvegarder les tâches dans un fichier JSON
- Charger les tâches depuis un fichier JSON

#### Solution

```python
import json
from pathlib import Path
from datetime import datetime

class GestionnaireTaches:
    """Gestionnaire de tâches avec sauvegarde JSON"""
    
    def __init__(self, fichier="taches.json"):
        self.fichier = Path(fichier)
        self.taches = self.charger()
        self.prochain_id = max([t["id"] for t in self.taches], default=0) + 1
    
    def charger(self):
        """Charge les tâches depuis le fichier JSON"""
        if self.fichier.exists():
            try:
                with open(self.fichier, "r", encoding="utf-8") as f:
                    return json.load(f)
            except json.JSONDecodeError:
                print("Erreur : Fichier JSON invalide")
                return []
        return []
    
    def sauvegarder(self):
        """Sauvegarde les tâches dans le fichier JSON"""
        with open(self.fichier, "w", encoding="utf-8") as f:
            json.dump(self.taches, f, indent=2, ensure_ascii=False)
    
    def ajouter(self, description):
        """Ajoute une nouvelle tâche"""
        tache = {
            "id": self.prochain_id,
            "description": description,
            "terminee": False,
            "date_creation": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.taches.append(tache)
        self.prochain_id += 1
        self.sauvegarder()
        print(f"Tâche #{tache['id']} ajoutée : {description}")
    
    def lister(self, terminees_seulement=False, actives_seulement=False):
        """Liste toutes les tâches"""
        if not self.taches:
            print("Aucune tâche")
            return
        
        taches_a_afficher = self.taches
        
        if terminees_seulement:
            taches_a_afficher = [t for t in self.taches if t["terminee"]]
        elif actives_seulement:
            taches_a_afficher = [t for t in self.taches if not t["terminee"]]
        
        if not taches_a_afficher:
            print("Aucune tâche à afficher")
            return
        
        print("\n=== Liste des tâches ===")
        for tache in taches_a_afficher:
            statut = "✓" if tache["terminee"] else " "
            print(f"{statut} [{tache['id']}] {tache['description']}")
            print(f"   Créée le : {tache['date_creation']}")
    
    def terminer(self, id_tache):
        """Marque une tâche comme terminée"""
        for tache in self.taches:
            if tache["id"] == id_tache:
                tache["terminee"] = True
                self.sauvegarder()
                print(f"Tâche #{id_tache} marquée comme terminée")
                return
        print(f"Tâche #{id_tache} non trouvée")
    
    def supprimer(self, id_tache):
        """Supprime une tâche"""
        for i, tache in enumerate(self.taches):
            if tache["id"] == id_tache:
                self.taches.pop(i)
                self.sauvegarder()
                print(f"Tâche #{id_tache} supprimée")
                return
        print(f"Tâche #{id_tache} non trouvée")
    
    def menu(self):
        """Affiche le menu principal"""
        while True:
            print("\n=== Gestionnaire de Tâches ===")
            print("1. Ajouter une tâche")
            print("2. Lister toutes les tâches")
            print("3. Lister les tâches actives")
            print("4. Lister les tâches terminées")
            print("5. Marquer une tâche comme terminée")
            print("6. Supprimer une tâche")
            print("7. Quitter")
            
            choix = input("\nVotre choix : ")
            
            if choix == "1":
                description = input("Description de la tâche : ")
                self.ajouter(description)
            
            elif choix == "2":
                self.lister()
            
            elif choix == "3":
                self.lister(actives_seulement=True)
            
            elif choix == "4":
                self.lister(terminees_seulement=True)
            
            elif choix == "5":
                try:
                    id_tache = int(input("ID de la tâche à terminer : "))
                    self.terminer(id_tache)
                except ValueError:
                    print("Erreur : ID invalide")
            
            elif choix == "6":
                try:
                    id_tache = int(input("ID de la tâche à supprimer : "))
                    self.supprimer(id_tache)
                except ValueError:
                    print("Erreur : ID invalide")
            
            elif choix == "7":
                print("Au revoir !")
                break
            
            else:
                print("Choix invalide")

# Utilisation
if __name__ == "__main__":
    gestionnaire = GestionnaireTaches()
    gestionnaire.menu()
```

### Projet 3 : Jeu du pendu

#### Énoncé

Créez un jeu du pendu où :
- Un mot est choisi aléatoirement
- Le joueur doit deviner les lettres
- Le joueur a un nombre limité d'essais
- Affichez l'état du mot avec les lettres trouvées
- Affichez les lettres déjà essayées

#### Solution

```python
import random

class JeuPendu:
    """Jeu du pendu"""
    
    MOTS = ["python", "programmation", "ordinateur", "algorithme", "développement"]
    
    def __init__(self):
        self.mot = random.choice(self.MOTS).upper()
        self.mot_affiche = ["_"] * len(self.mot)
        self.lettres_essayees = set()
        self.essais_restants = 7
    
    def afficher_etat(self):
        """Affiche l'état actuel du jeu"""
        print(f"\nMot : {' '.join(self.mot_affiche)}")
        print(f"Essais restants : {self.essais_restants}")
        print(f"Lettres essayées : {', '.join(sorted(self.lettres_essayees))}")
    
    def essayer_lettre(self, lettre):
        """Essaie une lettre"""
        lettre = lettre.upper()
        
        if lettre in self.lettres_essayees:
            print("Vous avez déjà essayé cette lettre")
            return False
        
        self.lettres_essayees.add(lettre)
        
        if lettre in self.mot:
            # Révéler la lettre dans le mot
            for i, char in enumerate(self.mot):
                if char == lettre:
                    self.mot_affiche[i] = lettre
            return True
        else:
            self.essais_restants -= 1
            return False
    
    def est_gagne(self):
        """Vérifie si le joueur a gagné"""
        return "_" not in self.mot_affiche
    
    def est_perdu(self):
        """Vérifie si le joueur a perdu"""
        return self.essais_restants <= 0
    
    def jouer(self):
        """Lance le jeu"""
        print("=== Jeu du Pendu ===")
        print("Devinez le mot lettre par lettre !")
        
        while True:
            self.afficher_etat()
            
            if self.est_gagne():
                print(f"\n🎉 Félicitations ! Vous avez trouvé le mot : {self.mot}")
                break
            
            if self.est_perdu():
                print(f"\n💀 Vous avez perdu ! Le mot était : {self.mot}")
                break
            
            lettre = input("\nEntrez une lettre : ").strip()
            
            if len(lettre) != 1 or not lettre.isalpha():
                print("Erreur : Entrez une seule lettre")
                continue
            
            if self.essayer_lettre(lettre):
                print("✓ Bonne lettre !")
            else:
                print("✗ Mauvaise lettre !")

# Lancer le jeu
if __name__ == "__main__":
    jeu = JeuPendu()
    jeu.jouer()
```

## Exercices supplémentaires

### Exercice 4 : Manipulation de chaînes

```python
# 1. Comptez le nombre de mots dans un texte
def compter_mots(texte):
    return len(texte.split())

# 2. Inverser chaque mot d'une phrase
def inverser_mots(phrase):
    mots = phrase.split()
    return " ".join([mot[::-1] for mot in mots])

# 3. Vérifier si deux chaînes sont des anagrammes
def sont_anagrammes(mot1, mot2):
    return sorted(mot1.lower()) == sorted(mot2.lower())

print(sont_anagrammes("chien", "niche"))  # True
```

### Exercice 5 : Manipulation de listes

```python
# 1. Trouver les doublons dans une liste
def trouver_doublons(liste):
    vus = set()
    doublons = []
    for element in liste:
        if element in vus:
            doublons.append(element)
        vus.add(element)
    return doublons

# 2. Fusionner deux listes triées
def fusionner_listes(liste1, liste2):
    return sorted(liste1 + liste2)

# 3. Retirer les doublons en conservant l'ordre
def retirer_doublons(liste):
    vus = set()
    resultat = []
    for element in liste:
        if element not in vus:
            resultat.append(element)
            vus.add(element)
    return resultat
```

## Conseils pour progresser

1. **Pratiquez régulièrement** : Codez un peu chaque jour
2. **Lisez du code** : Analysez des projets open source
3. **Résolvez des problèmes** : Sites comme LeetCode, HackerRank
4. **Créez des projets** : Mettez en pratique ce que vous apprenez
5. **Debuggez activement** : Utilisez print() et le debugger
6. **Documentez votre code** : Écrivez des docstrings
7. **Testez vos solutions** : Vérifiez avec différents cas

## Ressources supplémentaires

- **Python.org** : Documentation officielle
- **Real Python** : Tutoriels approfondis
- **Python Tutor** : Visualisation de l'exécution
- **GitHub** : Projets Python à étudier

Bon courage dans votre apprentissage ! 🚀
