import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SectionService, Section } from '../../core/services/section.service';
import { ContentService, Article } from '../../core/services/content.service';
import { SuggestionsService } from '../../core/services/suggestions.service';
import { OfflineService } from '../../core/services/offline.service';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Tableau de Bord</h1>
        <p class="dashboard-subtitle">Vue d'ensemble de vos formations</p>
      </div>

      <div class="dashboard-grid">
        <!-- Statut réseau -->
        <ng-container *ngIf="isOnline$ | async as isOnline">
          <div class="dashboard-card status-card" [class.offline]="!isOnline">
            <div class="card-icon">
              <svg *ngIf="isOnline" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg *ngIf="!isOnline" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
                <path d="M5 19.78C5.47 20.95 6.17 22 7 22.94"/>
                <path d="M1.27 12.58C.48 11.17.14 9.23.14 7"/>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                <line x1="12" y1="20" x2="12.01" y2="20"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ isOnline ? 'En ligne' : 'Hors ligne' }}</h3>
              <p class="card-description">
                {{ isOnline ? 'Connexion active' : 'Mode hors-ligne activé' }}
              </p>
              <div *ngIf="cacheSize$ | async as size" class="cache-info">
                Cache: {{ size | number:'1.2-2' }} MB
              </div>
            </div>
          </div>
        </ng-container>

        <!-- Sections rapides -->
        <div class="dashboard-card sections-card">
          <h3 class="card-title">Accès Rapide aux Sections</h3>
          <div *ngIf="sectionsWithStats$ | async as sections" class="quick-sections">
            <a
              *ngFor="let section of sections"
              [routerLink]="['/section', section.id]"
              class="quick-section-item"
            >
              <span class="section-icon">{{ section.icon }}</span>
              <div class="section-info">
                <span class="section-name">{{ section.name }}</span>
                <span class="section-count">{{ section.articleCount || 0 }} articles</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Articles populaires -->
        <div class="dashboard-card popular-card">
          <h3 class="card-title">Articles Populaires</h3>
          <div *ngIf="popularArticles$ | async as articles" class="popular-list">
            <a
              *ngFor="let article of articles"
              [routerLink]="['/article', article.slug]"
              class="popular-item"
            >
              <span class="popular-title">{{ article.title }}</span>
              <span class="popular-category">{{ article.category }}</span>
            </a>
          </div>
        </div>

        <!-- Tendances -->
        <div class="dashboard-card trending-card">
          <h3 class="card-title">Tendances</h3>
          <div *ngIf="trendingArticles$ | async as articles" class="trending-list">
            <a
              *ngFor="let article of articles"
              [routerLink]="['/article', article.slug]"
              class="trending-item"
            >
              <span class="trending-title">{{ article.title }}</span>
              <span class="trending-badge">🔥</span>
            </a>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="dashboard-card stats-card">
          <h3 class="card-title">Statistiques</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ totalArticles$ | async }}</span>
              <span class="stat-label">Articles totaux</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalSections$ | async }}</span>
              <span class="stat-label">Sections</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ cachedArticles$ | async }}</span>
              <span class="stat-label">Articles en cache</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private sectionService = inject(SectionService);
  private contentService = inject(ContentService);
  private suggestionsService = inject(SuggestionsService);
  private offlineService = inject(OfflineService);

  isOnline$!: Observable<boolean>;
  cacheSize$!: Observable<number>;
  sectionsWithStats$!: Observable<Section[]>;
  popularArticles$!: Observable<Article[]>;
  trendingArticles$!: Observable<Article[]>;
  totalArticles$!: Observable<number>;
  totalSections$!: Observable<number>;
  cachedArticles$!: Observable<number>;

  ngOnInit() {
    this.isOnline$ = this.offlineService.onOnlineStatusChange();
    
    this.cacheSize$ = new Observable(observer => {
      observer.next(this.offlineService.getCacheSize());
      setInterval(() => {
        observer.next(this.offlineService.getCacheSize());
      }, 5000);
    });

    this.sectionsWithStats$ = this.sectionService.getSections().pipe(
      switchMap(sections => {
        return this.contentService.getArticlesFlat().pipe(
          map(articles => {
            return sections.map(section => {
              const articleCount = articles.filter(article =>
                article.path.includes(section.path)
              ).length;
              return { ...section, articleCount };
            });
          })
        );
      })
    );

    this.popularArticles$ = this.suggestionsService.getPopularArticles(5);
    this.trendingArticles$ = this.suggestionsService.getTrendingArticles(5);

    this.totalArticles$ = this.contentService.getArticlesFlat().pipe(
      map(articles => articles.length)
    );

    this.totalSections$ = this.sectionService.getSections().pipe(
      map(sections => sections.length)
    );

    this.cachedArticles$ = new Observable(observer => {
      observer.next(this.offlineService.getCachedArticles().length);
      setInterval(() => {
        observer.next(this.offlineService.getCachedArticles().length);
      }, 5000);
    });
  }
}

