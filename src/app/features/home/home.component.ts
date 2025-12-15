import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService, Article } from '../../core/services/content.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <div class="home-content">
        <div class="hero-section">
          <h1 class="hero-title">Bienvenue dans votre Formation en Ligne</h1>
          <p class="hero-description">
            Explorez nos cours et tutoriels pour apprendre la programmation à votre rythme.
            Tous les contenus sont organisés et accessibles depuis le menu latéral.
          </p>
        </div>

        <div *ngIf="articlesByCategory$ | async as categories" class="categories-grid">
          <div *ngFor="let category of categories" class="category-card">
            <h2 class="category-card-title">{{ category.name }}</h2>
            <ul class="category-articles">
              <ng-container *ngFor="let article of category.articles">
                <li *ngIf="article.level === 0" class="category-article-item">
                  <a [routerLink]="['/article', article.slug]" class="category-article-link">
                    <span class="article-icon">📚</span>
                    <span class="article-name">{{ article.title }}</span>
                    <span class="article-arrow">→</span>
                  </a>
                  <ul *ngIf="article.children && article.children.length > 0" class="category-subarticles">
                    <li *ngFor="let child of article.children" class="category-subarticle-item">
                      <a [routerLink]="['/article', child.slug]" class="category-subarticle-link">
                        <span class="article-icon">📄</span>
                        <span class="article-name">{{ child.title }}</span>
                        <span class="article-arrow">→</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ng-container>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private contentService = inject(ContentService);
  articlesByCategory$!: Observable<{ name: string; articles: Article[] }[]>;

  ngOnInit() {
    this.articlesByCategory$ = this.contentService.getArticles().pipe(
      map(articles => {
        // Grouper par catégorie en gardant la hiérarchie
        const grouped = new Map<string, Article[]>();
        
        const addToCategory = (article: Article) => {
          const category = article.category;
          if (!grouped.has(category)) {
            grouped.set(category, []);
          }
          // Ajouter seulement les articles de niveau 0 (racine)
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

