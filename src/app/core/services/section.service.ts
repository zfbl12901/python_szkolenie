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
    }
    // Ajoutez d'autres sections ici au fur et à mesure
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

