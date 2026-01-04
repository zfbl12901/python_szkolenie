import { Component, OnInit, inject, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ContentService, Article } from '../../core/services/content.service';
import { SectionService } from '../../core/services/section.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, filter, startWith, catchError } from 'rxjs/operators';
import { ArticleTreeItemComponent } from './article-tree-item.component';

@Component({
  selector: 'app-navigation-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ArticleTreeItemComponent],
  template: `
    <aside class="navigation-sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <button class="toggle-btn" (click)="toggle()" [attr.aria-label]="collapsed ? 'Développer' : 'Réduire'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline *ngIf="!collapsed" points="15 18 9 12 15 6"/>
            <polyline *ngIf="collapsed" points="9 18 15 12 9 6"/>
          </svg>
        </button>
        <h3 *ngIf="!collapsed" class="sidebar-title">Navigation</h3>
      </div>
      <nav *ngIf="!collapsed" class="sidebar-nav">
        <ul class="nav-list">
          <ng-container *ngFor="let article of (articles$ | async)">
            <app-article-tree-item [article]="article"></app-article-tree-item>
          </ng-container>
        </ul>
      </nav>
    </aside>
  `,
  styleUrls: ['./navigation-sidebar.component.scss']
})
export class NavigationSidebarComponent implements OnInit {
  @Input() collapsed: boolean = false;
  
  private contentService = inject(ContentService);
  private sectionService = inject(SectionService);
  private router = inject(Router);
  
  articles$!: Observable<Article[]>;

  ngOnInit() {
    // Détecter la section active depuis la route
    const currentSection$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      switchMap(() => {
        const url = this.router.url;
        
        const sectionMatch = url.match(/\/section\/([^\/]+)/);
        if (sectionMatch) {
          const sectionId = sectionMatch[1];
          return this.sectionService.getSectionById(sectionId).pipe(
            map(section => section ? section.path : null)
          );
        }
        
        const articleMatch = url.match(/\/article\/([^\/]+)/);
        if (articleMatch) {
          const slug = articleMatch[1];
          return this.sectionService.getSections().pipe(
            switchMap(sections => {
              const sectionArticles$ = sections.map(section => 
                this.contentService.getArticles(section.path).pipe(
                  map(articles => ({ section: section.path, articles })),
                  catchError(() => of({ section: section.path, articles: [] }))
                )
              );
              
              return forkJoin(sectionArticles$).pipe(
                map(results => {
                  const flattenArticles = (articles: Article[]): Article[] => {
                    const result: Article[] = [];
                    articles.forEach(article => {
                      result.push(article);
                      if (article.children && article.children.length > 0) {
                        result.push(...flattenArticles(article.children));
                      }
                    });
                    return result;
                  };
                  
                  for (const result of results) {
                    const allArticles = flattenArticles(result.articles);
                    const article = allArticles.find(a => a.slug === slug);
                    if (article) {
                      const pathParts = article.path.split('/');
                      if (pathParts.length > 0) {
                        return pathParts[0];
                      }
                    }
                  }
                  return null;
                })
              );
            })
          );
        }
        
        return of(null);
      })
    );

    this.articles$ = currentSection$.pipe(
      switchMap(sectionPath => {
        if (!sectionPath) {
          return of([]);
        }
        
        this.contentService.setSection(sectionPath);
        
        return this.contentService.getArticles(sectionPath).pipe(
          map(articles => {
            const rootArticles = articles
              .filter(article => article.level === 0)
              .sort((a, b) => a.order - b.order);
            return rootArticles;
          })
        );
      })
    );
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
