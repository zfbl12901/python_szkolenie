import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SectionService } from '../../core/services/section.service';
import { ContentService, Article } from '../../core/services/content.service';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="section-container" *ngIf="section$ | async as section">
      <div class="section-header">
        <div class="section-header-content">
          <div class="section-icon-large" [style.background-color]="section.color + '20'">
            <span class="icon-emoji-large">{{ section.icon }}</span>
          </div>
          <div class="section-header-text">
            <h1 class="section-title">{{ section.name }}</h1>
            <p class="section-description">{{ section.description }}</p>
          </div>
        </div>
        <a routerLink="/formations" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Retour aux formations
        </a>
      </div>

      <div *ngIf="articlesByCategory$ | async as categories" class="section-content">
        <div *ngFor="let category of categories" class="category-section">
          <h2 class="category-title">{{ category.name }}</h2>
          <div class="articles-list">
            <ng-container *ngFor="let article of category.articles">
              <div *ngIf="article.level === 0" class="article-item" [routerLink]="['/article', article.slug]">
                <div class="article-item-content">
                  <h3 class="article-item-title">{{ article.title }}</h3>
                  <div *ngIf="article.children.length > 0" class="article-children-count">
                    {{ article.children.length }} sous-article(s)
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sectionService = inject(SectionService);
  private contentService = inject(ContentService);

  section$!: Observable<any>;
  articlesByCategory$!: Observable<{ name: string; articles: Article[] }[]>;

  ngOnInit() {
    this.section$ = this.route.params.pipe(
      switchMap(params => this.sectionService.getSectionById(params['sectionId']))
    );

    this.articlesByCategory$ = this.route.params.pipe(
      switchMap(params => {
        const sectionPath = this.sectionService.getSectionPath(params['sectionId']);
        return this.contentService.getArticles().pipe(
          map(articles => {
            // Filtrer les articles de cette section
            const sectionArticles = articles.filter(article => 
              article.path.includes(sectionPath)
            );

            // Grouper par catégorie
            const grouped = new Map<string, Article[]>();
            sectionArticles.forEach(article => {
              if (article.level === 0) {
                const category = article.category;
                if (!grouped.has(category)) {
                  grouped.set(category, []);
                }
                grouped.get(category)!.push(article);
              }
            });

            return Array.from(grouped.entries()).map(([name, articles]) => ({
              name,
              articles
            }));
          })
        );
      })
    );
  }
}

