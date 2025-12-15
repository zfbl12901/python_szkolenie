import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContentService, Article } from '../../core/services/content.service';
import { MarkdownService } from '../../core/services/markdown.service';
import { Observable } from 'rxjs';
import { switchMap, map, combineLatest } from 'rxjs/operators';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="compare-container">
      <div class="compare-header">
        <h1 class="compare-title">Comparaison d'Articles</h1>
        <div class="compare-controls">
          <select class="article-select" [(ngModel)]="selectedSlug1" (change)="loadArticles()">
            <option value="">Sélectionner le premier article</option>
            <option *ngFor="let article of allArticles$ | async" [value]="article.slug">
              {{ article.title }}
            </option>
          </select>
          <select class="article-select" [(ngModel)]="selectedSlug2" (change)="loadArticles()">
            <option value="">Sélectionner le deuxième article</option>
            <option *ngFor="let article of allArticles$ | async" [value]="article.slug">
              {{ article.title }}
            </option>
          </select>
        </div>
      </div>

      <ng-container *ngIf="(article1$ | async) as article1">
        <ng-container *ngIf="(article2$ | async) as article2">
          <div class="compare-content">
            <div class="compare-panel">
              <div class="panel-header">
                <h2 class="panel-title">{{ article1.title }}</h2>
                <span class="panel-category">{{ article1.category }}</span>
              </div>
              <div class="panel-content" [innerHTML]="content1$ | async"></div>
            </div>

            <div class="compare-divider">
              <div class="divider-line"></div>
              <button class="swap-button" (click)="swapArticles()" title="Échanger les articles">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <div class="divider-line"></div>
            </div>

            <div class="compare-panel">
              <div class="panel-header">
                <h2 class="panel-title">{{ article2.title }}</h2>
                <span class="panel-category">{{ article2.category }}</span>
              </div>
              <div class="panel-content" [innerHTML]="content2$ | async"></div>
            </div>
          </div>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="!(article1$ | async) || !(article2$ | async)">
        <div class="compare-placeholder">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <p>Sélectionnez deux articles à comparer</p>
        </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private markdownService = inject(MarkdownService);

  selectedSlug1 = '';
  selectedSlug2 = '';
  
  allArticles$!: Observable<Article[]>;
  article1$!: Observable<Article | null>;
  article2$!: Observable<Article | null>;
  content1$!: Observable<string>;
  content2$!: Observable<string>;

  ngOnInit() {
    this.allArticles$ = this.contentService.getArticlesFlat();

    // Charger depuis les paramètres de route si disponibles
    this.route.queryParams.subscribe(params => {
      if (params['article1']) this.selectedSlug1 = params['article1'];
      if (params['article2']) this.selectedSlug2 = params['article2'];
      this.loadArticles();
    });
  }

  loadArticles() {
    this.article1$ = this.selectedSlug1
      ? this.contentService.getArticleBySlug(this.selectedSlug1)
      : new Observable<Article | null>(observer => { observer.next(null); observer.complete(); });

    this.article2$ = this.selectedSlug2
      ? this.contentService.getArticleBySlug(this.selectedSlug2)
      : new Observable<Article | null>(observer => { observer.next(null); observer.complete(); });

    this.content1$ = this.article1$.pipe(
      switchMap(article => {
        if (!article) return new Observable<string>(observer => { observer.next(''); observer.complete(); });
        return this.contentService.getArticleContent(article.path).pipe(
          map(content => this.markdownService.parseMarkdown(content))
        );
      })
    );

    this.content2$ = this.article2$.pipe(
      switchMap(article => {
        if (!article) return new Observable<string>(observer => { observer.next(''); observer.complete(); });
        return this.contentService.getArticleContent(article.path).pipe(
          map(content => this.markdownService.parseMarkdown(content))
        );
      })
    );
  }

  swapArticles() {
    const temp = this.selectedSlug1;
    this.selectedSlug1 = this.selectedSlug2;
    this.selectedSlug2 = temp;
    this.loadArticles();
  }
}

