import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ContentService, Article } from '../../core/services/content.service';
import { SectionService } from '../../core/services/section.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="content-container">
      <div class="content-header">
        <h1 class="content-title">Contenu</h1>
        <p class="content-description">
          Parcourir tous les articles disponibles
        </p>
      </div>

      <div *ngIf="articlesByCategory$ | async as categories" class="categories-container">
        <div *ngFor="let category of categories" class="category-section">
          <h2 class="category-section-title">{{ category.name }}</h2>
          <div class="articles-grid">
            <div
              *ngFor="let article of category.articles"
              class="article-card"
              [routerLink]="['/article', article.slug]"
            >
              <div class="article-card-header">
                <h3 class="article-card-title">{{ article.title }}</h3>
                <span *ngIf="article.tags.length > 0" class="article-card-tag">
                  {{ article.tags[0] }}
                </span>
              </div>
              <div class="article-card-meta">
                <span class="article-card-path">{{ article.path }}</span>
              </div>
              <div *ngIf="article.children.length > 0" class="article-card-children">
                <span class="children-count">{{ article.children.length }} sous-article(s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  private contentService = inject(ContentService);
  articlesByCategory$!: Observable<{ name: string; articles: Article[] }[]>;

  ngOnInit() {
    this.articlesByCategory$ = this.contentService.getArticles().pipe(
      map(articles => {
        const grouped = new Map<string, Article[]>();
        
        const addToCategory = (article: Article) => {
          const category = article.category;
          if (!grouped.has(category)) {
            grouped.set(category, []);
          }
          if (article.level === 0) {
            grouped.get(category)!.push(article);
          }
        };
        
        articles.forEach(article => addToCategory(article));
        
        return Array.from(grouped.entries()).map(([name, articles]) => ({
          name,
          articles
        }));
      })
    );
  }
}

