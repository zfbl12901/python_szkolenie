import { Injectable, inject, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export interface ArticleMetadata {
  title: string;
  order: number;
  parent: string | null;
  tags: string[];
}

export interface Article {
  slug: string;
  title: string;
  path: string;
  category: string;
  order: number;
  sortKey: string; // Clé de tri basée sur le préfixe numérique
  parent: string | null;
  parentSlug: string | null; // Slug du parent pour faciliter la recherche
  children: Article[]; // Articles enfants
  tags: string[];
  level: number; // Niveau dans la hiérarchie (0 = racine)
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private http = inject(HttpClient);
  private baseHref: string;
  private contentBasePath: string;
  private articlesCache: Article[] | null = null;
  private currentSection: string = 'Python'; // Section par défaut

  constructor(@Optional() @Inject(APP_BASE_HREF) baseHref?: string) {
    // Utiliser le baseHref fourni ou le récupérer depuis le document
    if (baseHref) {
      // baseHref est déjà fourni par Angular (ex: "/python_szkolenie/")
      this.baseHref = baseHref;
    } else {
      // Récupérer depuis le base tag
      const baseElement = document.querySelector('base');
      if (baseElement && baseElement.href) {
        // Extraire le pathname de l'URL complète
        try {
          const url = new URL(baseElement.href, window.location.origin);
          this.baseHref = url.pathname;
        } catch {
          this.baseHref = baseElement.getAttribute('href') || '/';
        }
      } else {
        this.baseHref = '/';
      }
    }
    // Normaliser le baseHref (s'assurer qu'il se termine par / sauf si c'est juste '/')
    if (this.baseHref !== '/' && !this.baseHref.endsWith('/')) {
      this.baseHref += '/';
    }
    // Construire le chemin complet vers les assets (sans double slash)
    this.contentBasePath = `${this.baseHref}assets/content`.replace(/([^:]\/)\/+/g, '$1');
  }

  // Liste de tous les fichiers markdown (sans ceux dans old/)
  // Les fichiers sont maintenant dans des sous-dossiers (ex: Python/)
  private readonly markdownFiles = [
    '01-introduction.md',
    '02-variables-et-types.md',
    '03-structures-de-controle.md',
    '04-fonctions.md',
    '05-ia-qdrant-introduction.md',
    '06-embeddings.md',
    '07-prompt-engineering.md',
    '08-classes-et-objets.md',
    '09-modules-et-packages.md',
    '10-gestion-des-erreurs.md',
    '11-fichiers-et-io.md',
    '12-exercices-bases.md',
    '20-ia-introduction.md',
    '21-01-openai-api.md',
    '21-02-anthropic-claude.md',
    '21-03-langchain.md',
    '21-04-llm-locaux.md',
    '21-llm-exploitation.md',
    '22-01-sentence-transformers.md',
    '22-02-openai-embeddings.md',
    '22-03-huggingface-embeddings.md',
    '22-embeddings.md',
    '23-01-installation-et-configuration.md',
    '23-02-collections-et-vecteurs.md',
    '23-03-recherche-par-similarite.md',
    '23-04-filtres-et-metadonnees.md',
    '23-qdrant.md',
    '24-01-techniques-avancees.md',
    '24-02-few-shot-learning.md',
    '24-03-chain-of-thought.md',
    '24-prompt-engineering.md',
    '25-01-architecture-rag.md',
    '25-02-implementation-rag.md',
    '25-rag.md',
    '26-exercices-ia.md',
    '30-01-api-rest-fastapi.md',
    '30-02-applications-web-flask.md',
    '30-03-applications-desktop.md',
    '30-applications-python.md',
    '31-01-kivy.md',
    '31-02-beeware.md',
    '31-03-react-native-python.md',
    '31-applications-mobiles.md',
    '32-01-pygame-introduction.md',
    '32-02-mecaniques-de-jeu.md',
    '32-03-gestion-des-sprites.md',
    '32-04-arcade-framework.md',
    '32-jeux-2d.md',
    '33-exercices-applications.md',
    '40-01-docker.md',
    '40-02-ci-cd.md',
    '40-03-deploiement-cloud.md',
    '40-04-monitoring-et-logs.md',
    '40-devops-python.md',
    '41-01-pytest.md',
    '41-02-tests-unitaires.md',
    '41-03-tests-d-integration.md',
    '41-tests.md',
    '42-01-profiling.md',
    '42-02-optimisation-memoire.md',
    '42-03-asyncio-et-concurrence.md',
    '42-performance.md',
    '43-exercices-devops.md',
    '50-01-chatbot-ia.md',
    '50-02-api-rag-complete.md',
    '50-03-jeu-2d-complet.md',
    '50-projets-pratiques.md',
    '51-exercices-avances.md'
  ];

  private parseFrontmatter(content: string): ArticleMetadata | null {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      return null;
    }

    const frontmatter = match[1];
    const metadata: any = {};
    
    // Parse simple du YAML frontmatter
    frontmatter.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Parse arrays
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1);
          metadata[key] = value.split(',').map(v => v.trim().replace(/["']/g, ''));
        } else if (value === 'null') {
          metadata[key] = null;
        } else if (!isNaN(Number(value))) {
          metadata[key] = Number(value);
        } else {
          metadata[key] = value;
        }
      }
    });

    return {
      title: metadata.title || '',
      order: metadata.order || 0,
      parent: metadata.parent || null,
      tags: metadata.tags || []
    };
  }

  /**
   * Extrait le préfixe numérique du nom de fichier pour créer une clé de tri
   * Ex: "21-01-openai-api.md" -> "21-01"
   */
  private extractSortKey(filename: string): string {
    const match = filename.match(/^(\d+(?:-\d+)*)-/);
    return match ? match[1] : '999';
  }

  /**
   * Convertit une clé de tri en nombre pour le tri numérique
   * Ex: "21" -> 210000, "21-01" -> 210001, "21-02" -> 210002
   * Assure que "21" vient avant "21-01"
   */
  private sortKeyToNumber(sortKey: string): number {
    const parts = sortKey.split('-').map(p => parseInt(p, 10) || 0);
    let result = 0;
    let multiplier = 1000000; // Multiplier plus grand pour gérer plus de niveaux
    
    for (let i = 0; i < parts.length; i++) {
      result += parts[i] * multiplier;
      multiplier = multiplier / 1000; // Réduire le multiplicateur pour chaque niveau
    }
    
    // Si c'est un parent (pas de sous-niveau), ajouter un petit offset pour qu'il vienne avant ses enfants
    // Ex: "21" (21000000) vient avant "21-01" (21000100)
    return result;
  }

  private getCategoryFromSortKey(sortKey: string): string {
    const num = this.sortKeyToNumber(sortKey);
    if (num >= 1 && num < 2000) return 'Bases Python';
    if (num >= 2000 && num < 3000) return 'Intelligence Artificielle';
    if (num >= 3000 && num < 4000) return 'Applications';
    if (num >= 4000 && num < 5000) return 'DevOps et Production';
    if (num >= 5000) return 'Projets Pratiques';
    return 'Autres';
  }

  setSection(section: string): void {
    this.currentSection = section;
    this.articlesCache = null; // Invalider le cache
  }

  private loadArticleMetadata(path: string): Observable<Article> {
    // Ajouter le chemin de la section si nécessaire
    const fullPath = path.includes('/') ? path : `${this.currentSection}/${path}`;
    
    return this.getArticleContent(fullPath).pipe(
      map(content => {
        const metadata = this.parseFrontmatter(content);
        const slug = path.replace('.md', '').replace(/^.*\//, ''); // Extraire juste le nom du fichier
        const sortKey = this.extractSortKey(path);
        const order = this.sortKeyToNumber(sortKey);
        
        // Extraire le slug du parent si défini
        let parentSlug: string | null = null;
        if (metadata?.parent) {
          parentSlug = metadata.parent.replace('.md', '').replace(/^.*\//, '');
        }
        
        return {
          slug,
          title: metadata?.title || slug,
          path: fullPath,
          category: this.getCategoryFromSortKey(sortKey),
          order,
          sortKey,
          parent: metadata?.parent || null,
          parentSlug,
          children: [],
          tags: metadata?.tags || [],
          level: 0 // Sera calculé après
        };
      }),
      catchError(() => {
        // Si erreur, retourner un article par défaut
        const slug = path.replace('.md', '').replace(/^.*\//, '');
        const sortKey = this.extractSortKey(path);
        const fullPath = path.includes('/') ? path : `${this.currentSection}/${path}`;
        return of({
          slug,
          title: slug,
          path: fullPath,
          category: 'Autres',
          order: this.sortKeyToNumber(sortKey),
          sortKey,
          parent: null,
          parentSlug: null,
          children: [],
          tags: [],
          level: 0
        });
      })
    );
  }

  getArticles(section?: string): Observable<Article[]> {
    // Si une section est spécifiée, invalider le cache et charger cette section
    if (section && section !== this.currentSection) {
      this.currentSection = section;
      this.articlesCache = null;
    }

    if (this.articlesCache) {
      return of(this.articlesCache);
    }

    const articleObservables = this.markdownFiles.map(file => 
      this.loadArticleMetadata(file)
    );
    
    return forkJoin(articleObservables).pipe(
      map(articles => {
        // Créer un map pour accéder rapidement aux articles par slug
        const articlesMap = new Map<string, Article>();
        articles.forEach(article => {
          articlesMap.set(article.slug, article);
        });

        // Construire la hiérarchie parent/enfant
        const rootArticles: Article[] = [];
        articles.forEach(article => {
          if (article.parentSlug && articlesMap.has(article.parentSlug)) {
            const parent = articlesMap.get(article.parentSlug)!;
            parent.children.push(article);
            article.level = parent.level + 1;
          } else {
            article.level = 0;
            rootArticles.push(article);
          }
        });

        // Trier les articles par ordre numérique
        const sortArticles = (articles: Article[]): Article[] => {
          const sorted = articles.sort((a, b) => a.order - b.order);
          sorted.forEach(article => {
            if (article.children.length > 0) {
              article.children = sortArticles(article.children);
            }
          });
          return sorted;
        };

        const sorted = sortArticles(rootArticles);
        this.articlesCache = sorted;
        return sorted;
      })
    );
  }

  /**
   * Récupère tous les articles sous forme de liste plate (pour la recherche, etc.)
   */
  getArticlesFlat(): Observable<Article[]> {
    return this.getArticles().pipe(
      map(articles => {
        const flatten = (articles: Article[]): Article[] => {
          const result: Article[] = [];
          articles.forEach(article => {
            result.push(article);
            if (article.children.length > 0) {
              result.push(...flatten(article.children));
            }
          });
          return result;
        };
        return flatten(articles);
      })
    );
  }

  getArticleBySlug(slug: string): Observable<Article | null> {
    return this.getArticlesFlat().pipe(
      map(articles => articles.find(article => article.slug === slug) || null)
    );
  }

  getArticleContent(path: string): Observable<string> {
    // Le path peut déjà contenir le chemin complet (ex: Python/01-introduction.md)
    // ou juste le nom du fichier
    let fullPath: string;
    if (path.includes('/')) {
      fullPath = `${this.contentBasePath}/${path}`;
    } else {
      fullPath = `${this.contentBasePath}/${this.currentSection}/${path}`;
    }
    
    return this.http.get(fullPath, { responseType: 'text' }).pipe(
      catchError(() => {
        console.error(`Impossible de charger le fichier: ${fullPath}`);
        return of('# Erreur\n\nLe contenu demandé est introuvable.');
      })
    );
  }

  getArticlesByCategory(): Observable<Map<string, Article[]>> {
    return this.getArticles().pipe(
      map(articles => {
        const grouped = new Map<string, Article[]>();
        
        // Fonction récursive pour ajouter tous les articles (y compris les enfants)
        const addToCategory = (article: Article) => {
          const category = article.category;
          if (!grouped.has(category)) {
            grouped.set(category, []);
          }
          grouped.get(category)!.push(article);
          
          // Ajouter les enfants récursivement
          article.children.forEach(child => addToCategory(child));
        };
        
        articles.forEach(article => addToCategory(article));
        return grouped;
      })
    );
  }
}

