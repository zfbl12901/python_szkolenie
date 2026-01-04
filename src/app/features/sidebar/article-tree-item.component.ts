import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Article } from '../../core/services/content.service';

@Component({
  selector: 'app-article-tree-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <li [class]="'nav-item level-' + article.level">
      <a 
        [routerLink]="['/article', article.slug]" 
        routerLinkActive="active"
        [routerLinkActiveOptions]="{exact: false}"
        class="nav-link">
        <span class="nav-title">{{ article.title }}</span>
      </a>
      <ul *ngIf="article.children && article.children.length > 0" class="nav-sublist">
        <app-article-tree-item 
          *ngFor="let child of article.children" 
          [article]="child">
        </app-article-tree-item>
      </ul>
    </li>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ArticleTreeItemComponent {
  @Input() article!: Article;
}
