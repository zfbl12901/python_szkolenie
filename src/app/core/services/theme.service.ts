import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkThemeSubject = new BehaviorSubject<boolean>(false);
  public isDarkTheme$: Observable<boolean> = this.darkThemeSubject.asObservable();

  private readonly THEME_KEY = 'app-theme';

  initTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      this.darkThemeSubject.next(isDark);
      this.applyTheme(isDark);
    } else {
      // Détecter la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkThemeSubject.next(prefersDark);
      this.applyTheme(prefersDark);
    }
  }

  toggleTheme(): void {
    const currentTheme = this.darkThemeSubject.value;
    const newTheme = !currentTheme;
    this.darkThemeSubject.next(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem(this.THEME_KEY, newTheme ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}

