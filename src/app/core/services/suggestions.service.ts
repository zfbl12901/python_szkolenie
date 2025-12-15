import { Injectable, inject } from '@angular/core';
import { ContentService, Article } from './content.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Suggestion {
  article: Article;
  reason: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {
  private contentService = inject(ContentService);

  /**
   * Trouve des articles similaires basés sur les tags
   */
  getSimilarArticles(articleSlug: string, limit: number = 5): Observable<Suggestion[]> {
    return this.contentService.getArticlesFlat().pipe(
      map(articles => {
        const targetArticle = articles.find(a => a.slug === articleSlug);
        if (!targetArticle) return [];

        const suggestions: Suggestion[] = [];

        articles.forEach(article => {
          if (article.slug === articleSlug) return; // Exclure l'article actuel

          let score = 0;
          const reasons: string[] = [];

          // Score basé sur les tags communs
          const commonTags = targetArticle.tags.filter(tag =>
            article.tags.includes(tag)
          );
          if (commonTags.length > 0) {
            score += commonTags.length * 10;
            reasons.push(`${commonTags.length} tag(s) commun(s)`);
          }

          // Score basé sur la même catégorie
          if (article.category === targetArticle.category) {
            score += 15;
            reasons.push('Même catégorie');
          }

          // Score basé sur la même section
          if (article.path.split('/')[0] === targetArticle.path.split('/')[0]) {
            score += 10;
            reasons.push('Même section');
          }

          if (score > 0) {
            suggestions.push({
              article,
              reason: reasons.join(', '),
              score
            });
          }
        });

        return suggestions
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
      })
    );
  }

  /**
   * Articles populaires (basés sur un système de scoring simple)
   */
  getPopularArticles(limit: number = 10): Observable<Article[]> {
    return this.contentService.getArticlesFlat().pipe(
      map(articles => {
        // Pour l'instant, on retourne les articles de niveau 0 (racine)
        // Dans un vrai système, on utiliserait des statistiques de consultation
        return articles
          .filter(a => a.level === 0)
          .slice(0, limit);
      })
    );
  }

  /**
   * Articles recommandés "Vous pourriez aussi aimer"
   */
  getRecommendedArticles(currentArticleSlug: string, limit: number = 5): Observable<Suggestion[]> {
    return this.getSimilarArticles(currentArticleSlug, limit);
  }

  /**
   * Tendances - Articles récemment consultés ou populaires
   */
  getTrendingArticles(limit: number = 10): Observable<Article[]> {
    // Pour l'instant, similaire aux articles populaires
    // Dans un vrai système, on utiliserait des données de consultation récentes
    return this.getPopularArticles(limit);
  }
}

