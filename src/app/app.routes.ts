import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'formations',
    loadComponent: () => import('./features/formations/formations.component').then(m => m.FormationsComponent)
  },
  {
    path: 'content',
    loadComponent: () => import('./features/content/content.component').then(m => m.ContentComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'compare',
    loadComponent: () => import('./features/compare/compare.component').then(m => m.CompareComponent)
  },
  {
    path: 'section/:sectionId',
    loadComponent: () => import('./features/section/section.component').then(m => m.SectionComponent)
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('./features/article/article.component').then(m => m.ArticleComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

