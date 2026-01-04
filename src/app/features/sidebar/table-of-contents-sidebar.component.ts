import { Component, OnInit, Input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface Heading {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

@Component({
  selector: 'app-table-of-contents-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="toc-sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <button class="toggle-btn" (click)="toggle()" [attr.aria-label]="collapsed ? 'Développer' : 'Réduire'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline *ngIf="collapsed" points="9 18 15 12 9 6"/>
            <polyline *ngIf="!collapsed" points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h3 *ngIf="!collapsed" class="sidebar-title">Table des matières</h3>
      </div>
      <nav *ngIf="!collapsed && headings.length > 0" class="toc-nav">
        <ul class="toc-list">
          <li *ngFor="let heading of headings" 
              [class]="'toc-item level-' + heading.level"
              [class.active]="activeHeadingId === heading.id">
            <a 
              (click)="scrollToHeading(heading.id)"
              [href]="'#' + heading.id"
              class="toc-link">
              {{ heading.text }}
            </a>
          </li>
        </ul>
      </nav>
      <div *ngIf="!collapsed && headings.length === 0" class="toc-empty">
        <p>Aucun titre trouvé</p>
      </div>
    </aside>
  `,
  styleUrls: ['./table-of-contents-sidebar.component.scss']
})
export class TableOfContentsSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() collapsed: boolean = false;
  
  headings: Heading[] = [];
  activeHeadingId: string = '';
  private destroy$ = new Subject<void>();
  private observer?: IntersectionObserver;

  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // Réinitialiser les headings lors de la navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      setTimeout(() => this.extractHeadings(), 100);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.extractHeadings();
      this.setupIntersectionObserver();
    }, 300);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private extractHeadings() {
    const articleContent = document.querySelector('.article-content, .markdown-content, article, main');
    if (!articleContent) {
      this.headings = [];
      return;
    }

    const headingElements = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    this.headings = Array.from(headingElements).map((element, index) => {
      const htmlElement = element as HTMLElement;
      const level = parseInt(htmlElement.tagName.substring(1));
      let id = htmlElement.id;

      // Si pas d'ID, en créer un à partir du texte
      if (!id) {
        id = this.generateId(htmlElement.textContent || `heading-${index}`);
        htmlElement.id = id;
      }

      return {
        id,
        text: htmlElement.textContent?.trim() || '',
        level,
        element: htmlElement
      };
    });
  }

  private generateId(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target.id)
          .filter(id => id);

        if (visibleHeadings.length > 0) {
          // Prendre le premier heading visible
          this.activeHeadingId = visibleHeadings[0];
        }
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    this.headings.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) {
        this.observer?.observe(element);
      }
    });
  }

  scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Mettre à jour l'URL sans recharger la page
      this.router.navigate([], {
        fragment: id,
        skipLocationChange: false
      });
    }
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
