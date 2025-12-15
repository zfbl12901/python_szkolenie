import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <a routerLink="/" class="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>Formation en Ligne</span>
          </a>
          <nav class="header-nav">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              Dashboard
            </a>
            <a routerLink="/formations" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}" class="nav-link">
              Mes Formations
            </a>
            <a routerLink="/content" routerLinkActive="active" class="nav-link">
              Contenu
            </a>
            <a routerLink="/search" routerLinkActive="active" class="nav-link">
              Recherche
            </a>
            <a routerLink="/compare" routerLinkActive="active" class="nav-link">
              Comparer
            </a>
          </nav>
        </div>
        <div class="header-right">
          <button class="theme-toggle" (click)="toggleTheme()" [attr.aria-label]="(isDarkTheme$ | async) ? 'Activer le thème clair' : 'Activer le thème sombre'">
            <svg *ngIf="(isDarkTheme$ | async) === false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <svg *ngIf="(isDarkTheme$ | async) === true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  isDarkTheme$ = this.themeService.isDarkTheme$;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

