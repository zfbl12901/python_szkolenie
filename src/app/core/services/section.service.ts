import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Section {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  articleCount?: number;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private http = inject(HttpClient);
  private contentBasePath = '/assets/content';

  // Liste des sections/formations disponibles
  private readonly sections: Section[] = [
    {
      id: 'python',
      name: 'Python',
      description: 'Formation complète sur le langage Python, de la base à l\'avancé',
      icon: '🐍',
      color: '#3776ab',
      path: 'Python'
    },
    {
      id: 'angular',
      name: 'Angular',
      description: 'Formation sur le framework Angular pour le développement web',
      icon: '🅰️',
      color: '#dd0031',
      path: 'Angular'
    },
    {
      id: 'go',
      name: 'Go',
      description: 'Formation sur le langage de programmation Go (Golang)',
      icon: '🐹',
      color: '#00add8',
      path: 'Go'
    },
    {
      id: 'rust',
      name: 'Rust',
      description: 'Formation sur le langage de programmation Rust',
      icon: '🦀',
      color: '#ce422b',
      path: 'Rust'
    },
    {
      id: 'java',
      name: 'Java',
      description: 'Formation sur le langage de programmation Java',
      icon: '☕',
      color: '#ed8b00',
      path: 'Java'
    },
    {
      id: 'veille-technos',
      name: 'Veille Technos',
      description: 'Articles de veille technologique et actualités du développement',
      icon: '📰',
      color: '#ff6b6b',
      path: 'veille_technos'
    },
    {
      id: 'obsidian',
      name: 'Obsidian',
      description: 'Notes, ressources et documentation Obsidian',
      icon: '🔮',
      color: '#4834d4',
      path: 'Obsidian'
    }
  ];

  getSections(): Observable<Section[]> {
    return of(this.sections);
  }

  getSectionById(id: string): Observable<Section | null> {
    return this.getSections().pipe(
      map(sections => sections.find(section => section.id === id) || null)
    );
  }

  getSectionPath(sectionId: string): string {
    const section = this.sections.find(s => s.id === sectionId);
    return section ? section.path : '';
  }
}

