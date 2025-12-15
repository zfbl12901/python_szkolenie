import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Article } from './content.service';

interface CachedArticle {
  article: Article;
  content: string;
  cachedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private readonly CACHE_KEY = 'formation_cache';
  private readonly CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 jours

  /**
   * Vérifie si l'article est en cache
   */
  isArticleCached(articleSlug: string): boolean {
    const cache = this.getCache();
    return cache.has(articleSlug);
  }

  /**
   * Récupère un article du cache
   */
  getCachedArticle(articleSlug: string): Observable<string | null> {
    const cache = this.getCache();
    const cached = cache.get(articleSlug);

    if (!cached) {
      return of(null);
    }

    // Vérifier l'expiration
    const now = Date.now();
    if (now - cached.cachedAt > this.CACHE_EXPIRY) {
      cache.delete(articleSlug);
      this.saveCache(cache);
      return of(null);
    }

    return of(cached.content);
  }

  /**
   * Met en cache un article
   */
  cacheArticle(article: Article, content: string): void {
    const cache = this.getCache();
    cache.set(article.slug, {
      article,
      content,
      cachedAt: Date.now()
    });
    this.saveCache(cache);
  }

  /**
   * Récupère tous les articles en cache
   */
  getCachedArticles(): Article[] {
    const cache = this.getCache();
    return Array.from(cache.values()).map(cached => cached.article);
  }

  /**
   * Vérifie si l'application est en ligne
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Écoute les changements de statut réseau
   */
  onOnlineStatusChange(): Observable<boolean> {
    return new Observable(observer => {
      const handleOnline = () => observer.next(true);
      const handleOffline = () => observer.next(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      observer.next(navigator.onLine);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    });
  }

  /**
   * Nettoie le cache expiré
   */
  cleanExpiredCache(): void {
    const cache = this.getCache();
    const now = Date.now();
    let hasChanges = false;

    cache.forEach((cached, slug) => {
      if (now - cached.cachedAt > this.CACHE_EXPIRY) {
        cache.delete(slug);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveCache(cache);
    }
  }

  /**
   * Vide tout le cache
   */
  clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }

  /**
   * Taille du cache en MB
   */
  getCacheSize(): number {
    const cache = this.getCache();
    let size = 0;
    cache.forEach(cached => {
      size += JSON.stringify(cached).length;
    });
    return size / (1024 * 1024); // Convertir en MB
  }

  private getCache(): Map<string, CachedArticle> {
    try {
      const stored = localStorage.getItem(this.CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const cache = new Map<string, CachedArticle>();
        Object.entries(data).forEach(([key, value]: [string, any]) => {
          cache.set(key, value);
        });
        return cache;
      }
    } catch (e) {
      console.error('Erreur lors de la lecture du cache:', e);
    }
    return new Map();
  }

  private saveCache(cache: Map<string, CachedArticle>): void {
    try {
      const data: any = {};
      cache.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du cache:', e);
      // Si le cache est trop grand, nettoyer les plus anciens
      this.cleanOldestCache(cache);
    }
  }

  private cleanOldestCache(cache: Map<string, CachedArticle>): void {
    const entries = Array.from(cache.entries())
      .sort((a, b) => a[1].cachedAt - b[1].cachedAt);

    // Supprimer les 20% les plus anciens
    const toRemove = Math.ceil(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      cache.delete(entries[i][0]);
    }

    this.saveCache(cache);
  }
}

