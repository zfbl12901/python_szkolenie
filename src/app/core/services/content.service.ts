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
  private pythonFilesCache: string[] | null = null; // Cache pour les fichiers Python

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

  /**
   * Retourne le chemin de base selon la section
   */
  private getBasePathForSection(section: string): string {
    // Toutes les sections utilisent maintenant /assets/content/
    return `${this.baseHref}assets/content`.replace(/([^:]\/)\/+/g, '$1');
  }

  /**
   * Charge la liste des fichiers Python depuis le fichier index
   */
  private loadPythonFilesIndex(): Observable<string[]> {
    if (this.pythonFilesCache) {
      return of(this.pythonFilesCache);
    }
    
    const indexPath = `${this.getBasePathForSection('Python')}/Python/files-index.json`;
    return this.http.get<string[]>(indexPath).pipe(
      map(files => {
        this.pythonFilesCache = files;
        return files;
      }),
      catchError(() => {
        console.warn('Impossible de charger files-index.json, utilisation de la liste par défaut');
        return of([]);
      })
    );
  }

  /**
   * Retourne la liste des fichiers markdown selon la section
   */
  private getMarkdownFilesForSection(section: string): Observable<string[]> {
    // Pour Python, charger depuis le fichier index
    if (section === 'Python') {
      return this.loadPythonFilesIndex();
    }
    
    // Pour les autres sections, utiliser la liste statique
    const filesBySection: { [key: string]: string[] } = {
      'veille_technos': [
        'README.md',
        'exemple-article.md'
        // Ajoutez vos fichiers de veille technologique ici
      ],
      'Angular': [
        // Ajoutez vos fichiers Angular ici
      ],
      'Go': [
        // Ajoutez vos fichiers Go ici
      ],
      'Rust': [
        // Ajoutez vos fichiers Rust ici
      ],
      'Java': [
        '01-introduction.md',
        '10-java8.md',
        '10-01-lambda-expressions.md',
        '10-02-streams-api.md',
        '10-03-optional.md',
        '10-04-default-methods.md',
        '10-05-date-time-api.md',
        '10-06-completable-future.md',
        '11-java11.md',
        '11-01-var-keyword.md',
        '11-02-string-methods.md',
        '11-03-http-client.md',
        '17-java17.md',
        '17-01-sealed-classes.md',
        '17-02-pattern-matching.md',
        '17-03-records.md',
        '17-04-text-blocks.md',
        '21-java21.md',
        '21-01-virtual-threads.md',
        '21-02-pattern-matching-enhanced.md',
        '21-03-string-templates.md',
        '21-04-sequenced-collections.md',
        '25-java25.md',
        '30-redis.md',
        '31-ehcache.md',
        '32-caffeine.md',
        '40-resilience4j.md',
        '50-spring.md',
        '51-spring-boot.md',
        '60-opentelemetry.md',
        '70-jvm.md',
        '71-tomcat.md',
        '72-apache.md',
        '80-swagger.md',
        '81-openapi.md'
      ],
      'Obsidian': [
        '00-Inbox.md',
        '10-Tech-Radar.md',
        '20-TEMPLATE-Projet.md',
        '21-01-CLI-Java-SQL.md',
        '21-02-CVE-Aggregator.md',
        '21-03-Java-LLM-API-Bridge.md',
        '21-04-Chatbot-RP-IA.md',
        '22-_TEMPLATE-Mini-System.md',
        '23-01-BitTorrent-Simple.md',
        '23-02-Chat-Temps-Reel.md',
        '23-03-Docker-Mini.md',
        '23-04-HTTP-Server.md',
        '23-05-Redis-Like.md',
        '23-06-SQL-Simple.md',
        '30-Java.md',
        '36-Go.md',
        '38-Rust.md',
        '40-TEMPLATE-Veille.md',
        '50-DevSecOps.md',
        '60-Polonais.md',
        '70-Roadmap-2026.md',
        '80-Career.md'
      ]
    };
    
    // Retourner un Observable pour toutes les sections
    const files = filesBySection[section] || [];
    return of(files);
  }

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
    
    // Catégories spécifiques selon la section
    if (this.currentSection === 'Python') {
      if (num >= 1 && num < 2000) return 'Bases Python';
      if (num >= 2000 && num < 3000) return 'Intelligence Artificielle';
      if (num >= 3000 && num < 4000) return 'Applications';
      if (num >= 4000 && num < 5000) return 'DevOps et Production';
      if (num >= 5000) return 'Projets Pratiques';
      return 'Autres';
    } else if (this.currentSection === 'Angular') {
      if (num >= 1 && num < 1000) return 'Bases Angular';
      if (num >= 1000 && num < 2000) return 'Composants et Templates';
      if (num >= 2000 && num < 3000) return 'Services et Injection';
      if (num >= 3000 && num < 4000) return 'Routing et Navigation';
      if (num >= 4000 && num < 5000) return 'HTTP et API';
      if (num >= 5000) return 'Projets Pratiques';
      return 'Autres';
    } else if (this.currentSection === 'Go') {
      if (num >= 1 && num < 1000) return 'Bases Go';
      if (num >= 1000 && num < 2000) return 'Concurrence';
      if (num >= 2000 && num < 3000) return 'Interfaces et Types';
      if (num >= 3000 && num < 4000) return 'Packages et Modules';
      if (num >= 4000 && num < 5000) return 'Outils et Bonnes Pratiques';
      if (num >= 5000) return 'Projets Pratiques';
      return 'Autres';
    } else if (this.currentSection === 'Rust') {
      if (num >= 1 && num < 1000) return 'Bases Rust';
      if (num >= 1000 && num < 2000) return 'Ownership et Borrowing';
      if (num >= 2000 && num < 3000) return 'Structs et Enums';
      if (num >= 3000 && num < 4000) return 'Patterns et Traits';
      if (num >= 4000 && num < 5000) return 'Concurrence';
      if (num >= 5000) return 'Projets Pratiques';
      return 'Autres';
    } else if (this.currentSection === 'Java') {
      if (num >= 1 && num < 1000) return 'Bases Java';
      if (num >= 1000 && num < 2000) return 'POO et Classes';
      if (num >= 2000 && num < 3000) return 'Collections et Streams';
      if (num >= 3000 && num < 4000) return 'Concurrence';
      if (num >= 4000 && num < 5000) return 'Frameworks';
      if (num >= 5000) return 'Projets Pratiques';
      return 'Autres';
    } else if (this.currentSection === 'Obsidian') {
      if (num >= 0 && num < 10) return 'Organisation';
      if (num >= 10 && num < 20) return 'Tech Radar';
      if (num >= 20 && num < 30) return 'Templates';
      if (num >= 30 && num < 40) return 'Langages';
      if (num >= 40 && num < 50) return 'Veille';
      if (num >= 50 && num < 60) return 'DevSecOps';
      if (num >= 60 && num < 70) return 'Langues';
      if (num >= 70 && num < 80) return 'Roadmap';
      if (num >= 80) return 'Carrière';
      return 'Autres';
    } else if (this.currentSection === 'veille_technos') {
      return 'Veille Technologique';
    }
    
    return 'Autres';
  }

  setSection(section: string): void {
    this.currentSection = section;
    this.articlesCache = null; // Invalider le cache
  }

  private loadArticleMetadata(path: string): Observable<Article> {
    // Toutes les sections sont maintenant dans content/, construire le chemin complet
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
      // Invalider aussi le cache des fichiers Python si on change de section
      if (section !== 'Python') {
        this.pythonFilesCache = null;
      }
    }

    if (this.articlesCache) {
      return of(this.articlesCache);
    }

    // Obtenir la liste de fichiers pour la section actuelle (peut être un Observable)
    return this.getMarkdownFilesForSection(this.currentSection).pipe(
      switchMap(markdownFiles => {
        // Si aucune liste de fichiers, retourner un tableau vide
        if (markdownFiles.length === 0) {
          return of([]);
        }

        const articleObservables = markdownFiles.map(file => 
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
    const basePath = this.getBasePathForSection(this.currentSection);
    const fullPath = path.includes('/') 
      ? `${basePath}/${path}` 
      : `${basePath}/${this.currentSection}/${path}`;
    
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

