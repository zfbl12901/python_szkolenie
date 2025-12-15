import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { HeaderComponent } from './features/header/header.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <div class="main-content">
        <div class="sidebar-container" [class.visible]="showSidebar" [class.expanded]="sidebarExpanded">
          <app-sidebar *ngIf="showSidebar"></app-sidebar>
          <button 
            *ngIf="showSidebar"
            class="sidebar-toggle"
            (click)="toggleSidebar()"
            [attr.aria-label]="sidebarExpanded ? 'Masquer le menu' : 'Afficher le menu'"
            [title]="sidebarExpanded ? 'Masquer le menu' : 'Afficher le menu'"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.rotated]="!sidebarExpanded">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
        <main class="content-area" [class.sidebar-visible]="showSidebar" [class.sidebar-expanded]="showSidebar && sidebarExpanded">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  isDarkTheme$ = this.themeService.isDarkTheme$;
  
  showSidebar = false;
  sidebarExpanded = true;

  ngOnInit() {
    this.themeService.initTheme();
    
    // Détecter si on est dans une section ou un article
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      // Afficher la sidebar seulement sur les routes de section ou d'article
      this.showSidebar = url.includes('/section/') || url.includes('/article/');
    });
    
    // Vérifier l'état initial
    const currentUrl = this.router.url;
    this.showSidebar = currentUrl.includes('/section/') || currentUrl.includes('/article/');
  }

  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}

