import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SectionService, Section } from '../../core/services/section.service';
import { ContentService } from '../../core/services/content.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-formations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="formations-container">
      <div class="formations-header">
        <h1 class="formations-title">Mes Formations</h1>
        <p class="formations-description">
          Explorez toutes les formations disponibles et choisissez celle qui vous intéresse
        </p>
      </div>

      <div *ngIf="sectionsWithStats$ | async as sections" class="sections-grid">
        <div *ngFor="let section of sections" class="section-card" [routerLink]="['/section', section.id]">
          <div class="section-icon" [style.background-color]="section.color + '20'">
            <span class="icon-emoji">{{ section.icon }}</span>
          </div>
          <div class="section-content">
            <h2 class="section-name">{{ section.name }}</h2>
            <p class="section-description">{{ section.description }}</p>
            <div class="section-stats">
              <span class="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                {{ section.articleCount || 0 }} articles
              </span>
            </div>
          </div>
          <div class="section-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./formations.component.scss']
})
export class FormationsComponent implements OnInit {
  private sectionService = inject(SectionService);
  private contentService = inject(ContentService);
  
  sectionsWithStats$!: Observable<Section[]>;

  ngOnInit() {
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
  }
}

