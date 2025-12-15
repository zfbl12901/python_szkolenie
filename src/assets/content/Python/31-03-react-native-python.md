---
title: "Intégration Python avec React Native"
order: 3
parent: "31-applications-mobiles.md"
tags: ["python", "mobile", "react-native", "integration"]
---

# Intégration Python avec React Native

## Introduction

Bien que React Native utilise JavaScript, il est possible d'intégrer un backend Python avec une application React Native. Cette approche permet d'utiliser Python pour la logique métier et les APIs, tout en bénéficiant de la performance native de React Native.

## Architecture

### Structure typique

```
Application Mobile
├── Frontend (React Native)
│   ├── Interface utilisateur
│   ├── Navigation
│   └── Appels API
│
└── Backend (Python)
    ├── API REST (FastAPI/Flask)
    ├── Base de données
    └── Logique métier
```

### Flux de données

```
React Native App
    ↓ (HTTP/HTTPS)
API Python (FastAPI/Flask)
    ↓
Base de données
    ↓
Réponse JSON
    ↓
React Native App
```

## Backend Python avec FastAPI

### API REST simple

```python
# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS pour permettre les appels depuis React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    id: int = None
    title: str
    completed: bool = False

tasks_db = []
next_id = 1

@app.get("/api/tasks", response_model=List[Task])
def get_tasks():
    return tasks_db

@app.post("/api/tasks", response_model=Task, status_code=201)
def create_task(task: Task):
    global next_id
    task.id = next_id
    next_id += 1
    tasks_db.append(task)
    return task

@app.put("/api/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task: Task):
    task_found = next((t for t in tasks_db if t.id == task_id), None)
    if not task_found:
        raise HTTPException(status_code=404, detail="Task not found")
    task_found.title = task.title
    task_found.completed = task.completed
    return task_found

@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    global tasks_db
    task_found = next((t for t in tasks_db if t.id == task_id), None)
    if not task_found:
        raise HTTPException(status_code=404, detail="Task not found")
    tasks_db = [t for t in tasks_db if t.id != task_id]
    return None
```

## Frontend React Native

### Installation des dépendances

```bash
npm install axios
# ou
yarn add axios
```

### Service API

```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Dev
// const API_BASE_URL = 'https://api.example.com/api'; // Production

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  // Récupérer toutes les tâches
  getTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  },

  // Créer une tâche
  createTask: async (title) => {
    try {
      const response = await api.post('/tasks', {
        title,
        completed: false,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  },

  // Mettre à jour une tâche
  updateTask: async (taskId, task) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, task);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  },

  // Supprimer une tâche
  deleteTask: async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  },
};
```

### Composant React Native

```javascript
// components/TaskList.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { taskService } from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      try {
        const newTask = await taskService.createTask(newTaskTitle);
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const updatedTask = await taskService.updateTask(task.id, {
        ...task,
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nouvelle tâche..."
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <Button title="Ajouter" onPress={handleAddTask} />
      </View>

      {loading ? (
        <Text>Chargement...</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <TouchableOpacity
                onPress={() => handleToggleTask(item)}
                style={styles.taskContent}
              >
                <Text
                  style={[
                    styles.taskText,
                    item.completed && styles.taskCompleted,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
              <Button
                title="Supprimer"
                onPress={() => handleDeleteTask(item.id)}
                color="red"
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
});

export default TaskList;
```

## Authentification

### Backend Python (JWT)

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Vérifier les credentials
    # ... logique d'authentification ...
    
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me")
def read_users_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Frontend React Native

```javascript
// services/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    await AsyncStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};
```

## Déploiement

### Backend Python

```bash
# Avec Docker
docker build -t my-api .
docker run -p 8000:8000 my-api

# Avec uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend React Native

```bash
# Build Android
cd android && ./gradlew assembleRelease

# Build iOS
cd ios && xcodebuild -workspace App.xcworkspace -scheme App
```

## Avantages et limitations

### Avantages

- ✅ Performance native de React Native
- ✅ Backend Python puissant
- ✅ Séparation claire frontend/backend
- ✅ Scalabilité
- ✅ Réutilisabilité du backend

### Limitations

- ⚠️ Nécessite de connaître JavaScript
- ⚠️ Architecture plus complexe
- ⚠️ Dépendance réseau
- ⚠️ Gestion de l'état plus complexe

## Bonnes pratiques

### ✅ À faire

- Gérer les erreurs réseau
- Implémenter le cache local
- Gérer le mode hors-ligne
- Utiliser HTTPS en production
- Valider les données côté client et serveur
- Gérer les tokens d'authentification

### ❌ À éviter

- Ignorer la gestion d'erreurs
- Ne pas gérer le mode hors-ligne
- Utiliser HTTP en production
- Stocker les tokens en clair
- Ignorer la validation
- Ne pas optimiser les appels API

## Ressources

- **FastAPI** : https://fastapi.tiangolo.com
- **React Native** : https://reactnative.dev
- **Axios** : https://axios-http.com
- **AsyncStorage** : https://react-native-async-storage.github.io/async-storage
