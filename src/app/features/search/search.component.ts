import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult, SearchFilters } from '../../core/services/search.service';
import { SectionService } from '../../core/services/section.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-header">
        <h1 class="search-title">Recherche</h1>
        <p class="search-description">
          Trouvez rapidement les articles qui vous intéressent
        </p>
      </div>

      <div class="search-bar-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Rechercher par mots-clés..."
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
          />
          <button *ngIf="searchQuery" class="clear-button" (click)="clearSearch()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="filters-container">
        <div class="filter-group filter-group-tags">
          <div class="filter-header">
            <label class="filter-label">Tags</label>
            <button 
              *ngIf="(allTags$ | async)?.length && (allTags$ | async)!.length > visibleTagsCount"
              class="expand-tags-button"
              (click)="toggleTagsExpansion()"
            >
              <span>{{ getExpandButtonText() }}</span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
                [class.rotated]="showAllTags"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
          <div class="tags-container" [class.expanded]="showAllTags">
            <button
              *ngFor="let tag of visibleTags$ | async"
              class="tag-button"
              [class.active]="selectedTags.includes(tag)"
              (click)="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Section</label>
          <select class="filter-select" [(ngModel)]="selectedSection" (change)="onFilterChange()">
            <option value="">Toutes les sections</option>
            <option *ngFor="let section of sections$ | async" [value]="section.id">
              {{ section.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="results-container">
        <div *ngIf="searchResults$ | async as results" class="results-content">
          <div class="results-header">
            <h2 class="results-count">{{ results.length }} résultat(s) trouvé(s)</h2>
          </div>

          <div *ngIf="results.length === 0" class="no-results">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <p>Aucun résultat trouvé</p>
            <p class="no-results-hint">Essayez de modifier vos critères de recherche</p>
          </div>

          <div *ngIf="results.length > 0" class="results-list">
            <div *ngFor="let result of results" class="result-card" [routerLink]="['/article', result.article.slug]">
              <div class="result-header">
                <h3 class="result-title">{{ result.article.title }}</h3>
                <span class="result-category">{{ result.article.category }}</span>
              </div>
              <div class="result-meta">
                <span class="result-path">{{ result.article.path }}</span>
                <span class="result-relevance">Pertinence: {{ result.relevance }}</span>
              </div>
              <div *ngIf="result.article.tags.length > 0" class="result-tags">
                <span *ngFor="let tag of result.article.tags" class="result-tag">{{ tag }}</span>
              </div>
              <div *ngIf="result.matchedFields.length > 0" class="matched-fields">
                <span class="matched-label">Correspondances:</span>
                <span *ngFor="let field of result.matchedFields" class="matched-field">{{ field }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private searchService = inject(SearchService);
  private sectionService = inject(SectionService);

  searchQuery = '';
  selectedTags: string[] = [];
  selectedSection = '';
  showAllTags = false;
  visibleTagsCount = 10; // Nombre de tags visibles par défaut

  private searchSubject = new BehaviorSubject<SearchFilters>({});

  allTags$!: Observable<string[]>;
  visibleTags$!: Observable<string[]>;
  sections$!: Observable<any[]>;
  searchResults$!: Observable<SearchResult[]>;
  allTagsCount = 0;

  private tagsExpansionSubject = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.allTags$ = this.searchService.getAllTags();
    this.sections$ = this.sectionService.getSections();

    // Stocker le nombre total de tags
    this.allTags$.subscribe(tags => {
      this.allTagsCount = tags?.length || 0;
    });

    // Créer un observable pour les tags visibles qui se met à jour quand showAllTags change
    this.visibleTags$ = combineLatest([this.allTags$, this.tagsExpansionSubject]).pipe(
      map(([tags, showAll]) => {
        if (!tags || tags.length === 0) return [];
        if (showAll) {
          return tags;
        }
        return tags.slice(0, this.visibleTagsCount);
      })
    );

    this.searchResults$ = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(filters => this.searchService.search(filters))
    );
  }

  onSearchChange() {
    this.updateSearch();
  }

  onFilterChange() {
    this.updateSearch();
  }

  toggleTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
    this.updateSearch();
  }

  toggleTagsExpansion() {
    this.showAllTags = !this.showAllTags;
    this.tagsExpansionSubject.next(this.showAllTags);
  }

  getExpandButtonText(): string {
    if (this.showAllTags) {
      return 'Voir moins';
    }
    const hiddenCount = this.allTagsCount - this.visibleTagsCount;
    return `Voir plus (${hiddenCount})`;
  }

  clearSearch() {
    this.searchQuery = '';
    this.updateSearch();
  }

  private updateSearch() {
    const filters: SearchFilters = {
      query: this.searchQuery || undefined,
      tags: this.selectedTags.length > 0 ? this.selectedTags : undefined,
      section: this.selectedSection || undefined
    };
    this.searchSubject.next(filters);
  }
}

