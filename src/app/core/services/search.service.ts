import { Injectable, inject } from '@angular/core';
import { ContentService, Article } from './content.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SearchResult {
  article: Article;
  relevance: number;
  matchedFields: string[];
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  category?: string;
  section?: string;
  difficulty?: 'débutant' | 'intermédiaire' | 'avancé';
  minReadingTime?: number; // en minutes
  maxReadingTime?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private contentService = inject(ContentService);

  search(filters: SearchFilters): Observable<SearchResult[]> {
    return this.contentService.getArticlesFlat().pipe(
      map(articles => {
        let results: SearchResult[] = [];

        articles.forEach(article => {
          let relevance = 0;
          const matchedFields: string[] = [];

          // Filtre par section
          if (filters.section && article.path.includes(filters.section)) {
            relevance += 10;
            matchedFields.push('section');
          } else if (filters.section) {
            return; // Skip si section ne correspond pas
          }

          // Recherche par mots-clés dans le titre
          if (filters.query) {
            const queryLower = filters.query.toLowerCase();
            const titleLower = article.title.toLowerCase();

            if (titleLower.includes(queryLower)) {
              relevance += 20;
              matchedFields.push('title');
            }

            // Recherche dans le slug
            if (article.slug.toLowerCase().includes(queryLower)) {
              relevance += 10;
              matchedFields.push('slug');
            }
          }

          // Filtre par tags
          if (filters.tags && filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some(tag =>
              article.tags.some(articleTag =>
                articleTag.toLowerCase().includes(tag.toLowerCase())
              )
            );
            if (hasMatchingTag) {
              relevance += 15;
              matchedFields.push('tags');
            } else if (filters.tags.length > 0) {
              return; // Skip si aucun tag ne correspond
            }
          }

          // Filtre par catégorie
          if (filters.category && article.category === filters.category) {
            relevance += 10;
            matchedFields.push('category');
          } else if (filters.category && article.category !== filters.category) {
            return; // Skip si catégorie ne correspond pas
          }

          // Filtre par difficulté (basé sur la catégorie pour l'instant)
          if (filters.difficulty) {
            const categoryLower = article.category.toLowerCase();
            const difficultyMatch = 
              (filters.difficulty === 'débutant' && categoryLower.includes('bases')) ||
              (filters.difficulty === 'intermédiaire' && categoryLower.includes('intermédiaire')) ||
              (filters.difficulty === 'avancé' && (categoryLower.includes('avancé') || categoryLower.includes('projets')));
            
            if (difficultyMatch) {
              relevance += 5;
              matchedFields.push('difficulty');
            } else {
              return; // Skip si difficulté ne correspond pas
            }
          }

          // Filtre par durée de lecture (estimation basée sur le nombre de mots)
          // Note: Pour une vraie implémentation, il faudrait parser le contenu
          if (filters.minReadingTime || filters.maxReadingTime) {
            // Estimation: ~200 mots par minute
            // On utilise le titre comme proxy (très approximatif)
            const estimatedWords = article.title.split(' ').length * 50; // Estimation grossière
            const estimatedMinutes = Math.ceil(estimatedWords / 200);
            
            if (filters.minReadingTime && estimatedMinutes < filters.minReadingTime) {
              return;
            }
            if (filters.maxReadingTime && estimatedMinutes > filters.maxReadingTime) {
              return;
            }
            matchedFields.push('readingTime');
          }

          if (relevance > 0 || (!filters.query && !filters.tags && !filters.category && !filters.difficulty)) {
            results.push({
              article,
              relevance,
              matchedFields
            });
          }
        });

        // Trier par pertinence décroissante
        return results.sort((a, b) => b.relevance - a.relevance);
      })
    );
  }

  getAllTags(): Observable<string[]> {
    return this.contentService.getArticlesFlat().pipe(
      map(articles => {
        const tagsSet = new Set<string>();
        articles.forEach(article => {
          article.tags.forEach(tag => tagsSet.add(tag));
        });
        return Array.from(tagsSet).sort();
      })
    );
  }

  getAllCategories(): Observable<string[]> {
    return this.contentService.getArticlesFlat().pipe(
      map(articles => {
        const categoriesSet = new Set<string>();
        articles.forEach(article => {
          categoriesSet.add(article.category);
        });
        return Array.from(categoriesSet).sort();
      })
    );
  }
}

