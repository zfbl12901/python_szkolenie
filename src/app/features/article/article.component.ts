import { Component, OnInit, AfterViewChecked, inject, HostListener, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentService, Article } from '../../core/services/content.service';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { MarkdownService } from '../../core/services/markdown.service';
import { SuggestionsService, Suggestion } from '../../core/services/suggestions.service';
import { ExportService } from '../../core/services/export.service';
import { OfflineService } from '../../core/services/offline.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="article-container" [class.focus-mode]="isFocusMode" *ngIf="article$ | async as article">
      <div class="article-toolbar" *ngIf="!isFocusMode">
        <div class="toolbar-left">
          <a routerLink="/" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Retour
          </a>
        </div>
        <div class="toolbar-right">
          <button class="toolbar-button" (click)="toggleFocusMode()" title="Mode Focus (F)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
          </button>
          <button class="toolbar-button" (click)="exportPDF()" title="Exporter en PDF">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
          <button class="toolbar-button" (click)="exportMarkdown()" title="Exporter en Markdown">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta" *ngIf="article.category">
          <span class="article-category">{{ article.category }}</span>
        </div>
      </div>
      
      <div class="article-content" #articleContent [innerHTML]="markdownContent$ | async"></div>

      <!-- Suggestions -->
      <ng-container *ngIf="!isFocusMode">
        <div *ngIf="suggestions$ | async as suggestions" class="suggestions-section">
          <h2 class="suggestions-title">Articles similaires</h2>
          <div class="suggestions-list">
            <a
              *ngFor="let suggestion of suggestions"
              [routerLink]="['/article', suggestion.article.slug]"
              class="suggestion-card"
            >
              <h3 class="suggestion-title">{{ suggestion.article.title }}</h3>
              <p class="suggestion-reason">{{ suggestion.reason }}</p>
              <span class="suggestion-category">{{ suggestion.article.category }}</span>
            </a>
          </div>
        </div>
      </ng-container>

      <!-- Contrôles Focus Mode -->
      <div *ngIf="isFocusMode" class="focus-controls">
        <button class="focus-close" (click)="toggleFocusMode()" title="Quitter le mode Focus (Esc)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private markdownService = inject(MarkdownService);
  private suggestionsService = inject(SuggestionsService);
  private exportService = inject(ExportService);
  private offlineService = inject(OfflineService);
  
  @ViewChild('articleContent', { static: false }) articleContentRef!: ElementRef<HTMLElement>;
  
  article$!: Observable<Article | null>;
  markdownContent$!: Observable<string>;
  suggestions$!: Observable<Suggestion[]>;
  isFocusMode = false;
  currentArticleSlug = '';
  private lastContent = '';

  ngOnInit() {
    this.article$ = this.route.params.pipe(
      switchMap(params => {
        this.currentArticleSlug = params['slug'];
        return this.contentService.getArticleBySlug(params['slug']);
      })
    );

    this.markdownContent$ = this.article$.pipe(
      switchMap(article => {
        if (!article) {
          return new Observable<string>(observer => {
            observer.next('<p>Article non trouvé.</p>');
            observer.complete();
          });
        }
        
        // Mettre en cache pour le mode hors-ligne
        return this.contentService.getArticleContent(article.path).pipe(
          map(content => {
            // Mettre en cache si hors-ligne ou pour améliorer les performances
            if (!this.offlineService.isOnline() || !this.offlineService.isArticleCached(article.slug)) {
              this.offlineService.cacheArticle(article, content);
            }
            return this.markdownService.parseMarkdown(content);
          })
        );
      })
    );

    this.suggestions$ = this.article$.pipe(
      switchMap(article => {
        if (!article) return new Observable<Suggestion[]>(observer => { observer.next([]); observer.complete(); });
        return this.suggestionsService.getSimilarArticles(article.slug, 3);
      })
    );
  }

  ngAfterViewChecked() {
    // Appliquer la coloration syntaxique après que le contenu soit rendu
    if (this.articleContentRef) {
      const currentContent = this.articleContentRef.nativeElement.innerHTML;
      if (currentContent && currentContent !== this.lastContent) {
        this.lastContent = currentContent;
        setTimeout(() => {
          this.markdownService.highlightCode(this.articleContentRef.nativeElement);
        }, 0);
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'f' || event.key === 'F') {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        this.toggleFocusMode();
      }
    }
    if (event.key === 'Escape' && this.isFocusMode) {
      this.toggleFocusMode();
    }
  }

  toggleFocusMode() {
    this.isFocusMode = !this.isFocusMode;
    if (this.isFocusMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  exportPDF() {
    if (this.currentArticleSlug) {
      this.exportService.exportArticleToPDF(this.currentArticleSlug).subscribe();
    }
  }

  exportMarkdown() {
    if (this.currentArticleSlug) {
      this.exportService.exportArticleToMarkdown(this.currentArticleSlug).subscribe();
    }
  }
}

