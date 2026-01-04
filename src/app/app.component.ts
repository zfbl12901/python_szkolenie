import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { HeaderComponent } from './features/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <div class="main-content">
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  isDarkTheme$ = this.themeService.isDarkTheme$;

  ngOnInit() {
    this.themeService.initTheme();
  }
}

