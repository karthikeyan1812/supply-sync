import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy }  // <-- add this for hash routing
  ],
}).catch(err => console.error(err));
