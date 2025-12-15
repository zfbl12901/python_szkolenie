---
title: "Techniques Avancées de Prompt Engineering"
order: 1
parent: "24-prompt-engineering.md"
tags: ["python", "ia", "prompt-engineering", "advanced"]
---

# Techniques Avancées de Prompt Engineering

## Introduction

Les techniques avancées de prompt engineering permettent d'obtenir des résultats plus précis, cohérents et adaptés à vos besoins spécifiques. Ces techniques vont au-delà des principes de base et exploitent les capacités avancées des LLM modernes.

## 1. Zero-Shot vs Few-Shot vs One-Shot

### Zero-Shot Learning

Le modèle répond sans exemples préalables :

```python
# Zero-shot : Pas d'exemples
prompt_zero_shot = """
Classe ce texte comme positif, négatif ou neutre.

Texte: "Ce produit est incroyable !"
Sentiment:
"""
```

**Avantages :**
- Simple et rapide
- Pas besoin d'exemples
- Bon pour les tâches générales

**Limitations :**
- Moins précis pour les tâches spécialisées
- Peut nécessiter plusieurs itérations

### One-Shot Learning

Un seul exemple pour guider le modèle :

```python
# One-shot : Un exemple
prompt_one_shot = """
Classe ce texte comme positif, négatif ou neutre.

Exemple:
Texte: "J'adore ce produit !"
Sentiment: Positif

Maintenant, classe ce texte:
Texte: "Ce produit est terrible."
Sentiment:
"""
```

### Few-Shot Learning

Plusieurs exemples pour établir un pattern :

```python
# Few-shot : Plusieurs exemples
prompt_few_shot = """
Classe ce texte comme positif, négatif ou neutre.

Exemples:
Texte: "J'adore ce produit !"
Sentiment: Positif

Texte: "Ce produit est terrible."
Sentiment: Négatif

Texte: "Le produit fonctionne."
Sentiment: Neutre

Texte: "C'est le meilleur achat que j'ai fait !"
Sentiment: Positif

Maintenant, classe ce texte:
Texte: "{texte_utilisateur}"
Sentiment:
"""
```

**Quand utiliser :**
- **Zero-shot** : Tâches générales, premières itérations
- **One-shot** : Tâches simples avec un pattern clair
- **Few-shot** : Tâches complexes, besoin de précision

## 2. Prompt Chaining (Chaînage de prompts)

Diviser une tâche complexe en plusieurs étapes :

```python
class PromptChain:
    def __init__(self):
        self.client = OpenAI()
    
    def etape1_analyse(self, texte):
        """Première étape : Analyser le texte"""
        prompt = f"""
        Analyse ce texte et identifie les sujets principaux.
        
        Texte: {texte}
        
        Liste les 3 sujets principaux:
        """
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    
    def etape2_resume(self, texte, sujets):
        """Deuxième étape : Résumer selon les sujets"""
        prompt = f"""
        Résume ce texte en te concentrant sur ces sujets: {sujets}
        
        Texte: {texte}
        
        Résumé:
        """
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    
    def etape3_recommandations(self, resume):
        """Troisième étape : Générer des recommandations"""
        prompt = f"""
        Basé sur ce résumé, génère 3 recommandations d'action.
        
        Résumé: {resume}
        
        Recommandations:
        """
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    
    def traiter(self, texte):
        """Exécute toute la chaîne"""
        sujets = self.etape1_analyse(texte)
        resume = self.etape2_resume(texte, sujets)
        recommandations = self.etape3_recommandations(resume)
        
        return {
            "sujets": sujets,
            "resume": resume,
            "recommandations": recommandations
        }

# Utilisation
chain = PromptChain()
resultat = chain.traiter("Texte long à analyser...")
```

## 3. Self-Consistency (Auto-cohérence)

Demander plusieurs réponses et choisir la plus cohérente :

```python
def self_consistency_prompt(question, n=5):
    """Génère plusieurs réponses et trouve la plus cohérente"""
    client = OpenAI()
    reponses = []
    
    for i in range(n):
        prompt = f"""
        Réponds à cette question de manière précise et détaillée.
        
        Question: {question}
        
        Réponse:
        """
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7  # Variabilité
        )
        reponses.append(response.choices[0].message.content)
    
    # Trouver la réponse la plus fréquente ou la plus cohérente
    # (simplifié ici)
    return reponses[0]  # En pratique, analyser toutes les réponses
```

## 4. Tree of Thoughts (ToT)

Explorer plusieurs chemins de raisonnement :

```python
def tree_of_thoughts(probleme, profondeur=3):
    """Explore plusieurs chemins de raisonnement"""
    client = OpenAI()
    
    def generer_etapes(probleme_actuel, etapes_precedentes=[]):
        if len(etapes_precedentes) >= profondeur:
            return etapes_precedentes
        
        prompt = f"""
        Problème: {probleme_actuel}
        
        Étapes précédentes: {etapes_precedentes}
        
        Génère 3 prochaines étapes possibles pour résoudre ce problème.
        Format: Liste numérotée.
        """
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        nouvelles_etapes = response.choices[0].message.content
        
        # Explorer chaque étape (simplifié)
        return generer_etapes(probleme_actuel, etapes_precedentes + [nouvelles_etapes])
    
    return generer_etapes(probleme)
```

## 5. ReAct (Reasoning + Acting)

Combiner raisonnement et action :

```python
def react_prompt(question, outils_disponibles):
    """Prompt ReAct : Raisonner puis Agir"""
    prompt = f"""
    Tu dois répondre à cette question en utilisant un processus de raisonnement puis d'action.
    
    Question: {question}
    
    Outils disponibles: {outils_disponibles}
    
    Format de réponse:
    Pensée: [Ta réflexion sur comment résoudre le problème]
    Action: [L'action à entreprendre]
    Observation: [Le résultat de l'action]
    ... (répéter si nécessaire)
    Réponse finale: [La réponse complète]
    """
    
    return prompt
```

## 6. Automatic Prompt Engineering (APE)

Générer automatiquement des prompts optimaux :

```python
def generate_prompts_variations(base_prompt, n=10):
    """Génère des variations d'un prompt"""
    client = OpenAI()
    
    prompt_generation = f"""
    Génère {n} variations de ce prompt qui pourraient donner de meilleurs résultats.
    
    Prompt original: {base_prompt}
    
    Variations (une par ligne):
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt_generation}]
    )
    
    variations = response.choices[0].message.content.split('\n')
    return variations

def test_prompts(prompts, test_cases):
    """Teste plusieurs prompts et retourne le meilleur"""
    client = OpenAI()
    scores = {}
    
    for prompt in prompts:
        score = 0
        for test_case in test_cases:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt.format(**test_case)}]
            )
            # Évaluer la réponse (simplifié)
            if "bonne réponse" in response.choices[0].message.content.lower():
                score += 1
        scores[prompt] = score
    
    return max(scores, key=scores.get)
```

## 7. Prompt Compression

Réduire la taille des prompts tout en gardant l'information :

```python
def compress_prompt(prompt_long):
    """Compresse un prompt long"""
    client = OpenAI()
    
    compression_prompt = f"""
    Compresse ce prompt en gardant toutes les informations essentielles.
    Le prompt compressé doit être plus court mais aussi efficace.
    
    Prompt original:
    {prompt_long}
    
    Prompt compressé:
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": compression_prompt}]
    )
    
    return response.choices[0].message.content
```

## 8. Meta-Prompting

Utiliser un LLM pour améliorer les prompts :

```python
def meta_prompt_optimization(original_prompt, objectif):
    """Utilise un LLM pour optimiser un prompt"""
    client = OpenAI()
    
    meta_prompt = f"""
    Tu es un expert en prompt engineering. Optimise ce prompt pour atteindre cet objectif.
    
    Prompt original:
    {original_prompt}
    
    Objectif: {objectif}
    
    Fournis:
    1. Le prompt optimisé
    2. Les améliorations apportées
    3. Pourquoi ces améliorations fonctionnent
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": meta_prompt}]
    )
    
    return response.choices[0].message.content
```

## 9. Multi-Agent Prompting

Utiliser plusieurs "agents" spécialisés :

```python
class MultiAgentSystem:
    def __init__(self):
        self.agents = {
            "analyste": self.agent_analyste,
            "codeur": self.agent_codeur,
            "testeur": self.agent_testeur,
            "documenteur": self.agent_documenteur
        }
    
    def agent_analyste(self, code):
        prompt = f"""
        Tu es un analyste de code. Analyse ce code et identifie les problèmes.
        
        Code: {code}
        
        Analyse:
        """
        return self.call_llm(prompt)
    
    def agent_codeur(self, probleme):
        prompt = f"""
        Tu es un développeur expert. Résous ce problème avec du code Python.
        
        Problème: {probleme}
        
        Solution:
        """
        return self.call_llm(prompt)
    
    def agent_testeur(self, code):
        prompt = f"""
        Tu es un testeur. Génère des tests pour ce code.
        
        Code: {code}
        
        Tests:
        """
        return self.call_llm(prompt)
    
    def agent_documenteur(self, code):
        prompt = f"""
        Tu es un documentaliste. Documente ce code.
        
        Code: {code}
        
        Documentation:
        """
        return self.call_llm(prompt)
    
    def traiter_code(self, code):
        """Traite le code avec tous les agents"""
        return {
            "analyse": self.agents["analyste"](code),
            "tests": self.agents["testeur"](code),
            "documentation": self.agents["documenteur"](code)
        }
```

## 10. Prompt Templates avec Variables

Créer des templates réutilisables et paramétrables :

```python
from string import Template

class PromptTemplate:
    def __init__(self, template_string):
        self.template = Template(template_string)
    
    def format(self, **kwargs):
        return self.template.substitute(**kwargs)

# Templates réutilisables
CODE_REVIEW_TEMPLATE = PromptTemplate("""
Tu es un expert en code review Python.

Analyse ce code:
```python
$code
```

Contexte:
- Niveau du développeur: $niveau
- Standards: $standards

Fournis:
1. Bugs potentiels
2. Améliorations
3. Score (1-10)
""")

# Utilisation
prompt = CODE_REVIEW_TEMPLATE.format(
    code="def ma_fonction(): pass",
    niveau="intermédiaire",
    standards="PEP 8"
)
```

## 11. Prompt Injection Protection

Protéger contre les injections de prompts :

```python
def sanitize_user_input(user_input):
    """Nettoie l'input utilisateur pour éviter les injections"""
    # Supprimer les tentatives d'injection
    dangerous_patterns = [
        "Ignore previous instructions",
        "Forget everything",
        "You are now",
        "System:",
        "Assistant:"
    ]
    
    for pattern in dangerous_patterns:
        if pattern.lower() in user_input.lower():
            user_input = user_input.replace(pattern, "")
    
    return user_input

def safe_prompt(user_input, system_prompt):
    """Crée un prompt sécurisé"""
    sanitized = sanitize_user_input(user_input)
    
    return f"""
    {system_prompt}
    
    Question utilisateur: {sanitized}
    
    Réponds uniquement à la question utilisateur en respectant les instructions système.
    """
```

## 12. Prompt Caching et Réutilisation

Mettre en cache les prompts efficaces :

```python
import hashlib
import json

class PromptCache:
    def __init__(self, cache_file='prompt_cache.json'):
        self.cache_file = cache_file
        self.cache = self.load_cache()
    
    def load_cache(self):
        try:
            with open(self.cache_file, 'r') as f:
                return json.load(f)
        except:
            return {}
    
    def save_cache(self):
        with open(self.cache_file, 'w') as f:
            json.dump(self.cache, f)
    
    def get_cache_key(self, prompt, params):
        """Génère une clé de cache"""
        content = f"{prompt}{json.dumps(params, sort_keys=True)}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def get(self, prompt, params):
        """Récupère depuis le cache"""
        key = self.get_cache_key(prompt, params)
        return self.cache.get(key)
    
    def set(self, prompt, params, result):
        """Sauvegarde dans le cache"""
        key = self.get_cache_key(prompt, params)
        self.cache[key] = result
        self.save_cache()
```

## Cas d'usage pratiques

### Analyse de code avancée

```python
def analyse_code_avancee(code):
    """Analyse de code avec plusieurs techniques"""
    # 1. Prompt chaining
    chain = PromptChain()
    
    # 2. Multi-agent
    agents = MultiAgentSystem()
    
    # 3. Self-consistency
    analyses = []
    for _ in range(3):
        analyse = agents.agent_analyste(code)
        analyses.append(analyse)
    
    # 4. Synthèse
    prompt_synthese = f"""
    Synthétise ces analyses de code en une analyse finale cohérente.
    
    Analyses:
    {chr(10).join(analyses)}
    
    Synthèse finale:
    """
    
    return call_llm(prompt_synthese)
```

## Bonnes pratiques

### ✅ À faire

- Tester différentes techniques
- Combiner plusieurs techniques
- Itérer et améliorer
- Documenter les prompts efficaces
- Mesurer les performances

### ❌ À éviter

- Utiliser une seule technique
- Ne pas tester
- Ignorer les coûts
- Ne pas documenter
- Ne pas mesurer

## Ressources

- **Research Papers** : Papers sur le prompt engineering
- **Communautés** : Forums et groupes de discussion
- **Outils** : Libraries pour prompt engineering
