import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Récupérer le baseHref depuis le base tag ou utiliser '/'
const getBaseHref = (): string => {
  const baseElement = document.querySelector('base');
  if (baseElement) {
    const href = baseElement.getAttribute('href');
    if (href) {
      try {
        const url = new URL(href, window.location.origin);
        return url.pathname;
      } catch {
        return href;
      }
    }
  }
  return '/';
};

const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: APP_BASE_HREF, useValue: getBaseHref() }
  ]
};

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

