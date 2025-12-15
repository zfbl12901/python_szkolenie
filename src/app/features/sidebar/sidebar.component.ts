import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ContentService, Article } from '../../core/services/content.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <div *ngFor="let category of articlesByCategory$ | async" class="category-group">
          <h3 class="category-title">{{ category.name }}</h3>
          <ul class="article-list">
            <ng-container *ngFor="let article of category.articles">
              <li *ngIf="article.level === 0" class="article-item">
                <a 
                  [routerLink]="['/article', article.slug]" 
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{exact: false}"
                  [class]="'article-link level-' + article.level">
                  <span class="article-title">{{ article.title }}</span>
                </a>
                <ul *ngIf="article.children && article.children.length > 0" class="article-sublist">
                  <li *ngFor="let child of article.children" class="article-item">
                    <a 
                      [routerLink]="['/article', child.slug]" 
                      routerLinkActive="active"
                      [routerLinkActiveOptions]="{exact: false}"
                      [class]="'article-link level-' + child.level">
                      <span class="article-title">{{ child.title }}</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ng-container>
          </ul>
        </div>
      </nav>
    </aside>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
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
          // Ajouter seulement les articles de niveau 0 (racine) à la liste
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

