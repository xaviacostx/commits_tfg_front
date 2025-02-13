import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {provideHttpClient} from "@angular/common/http";
import { provideAuth0 } from '@auth0/auth0-angular';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideAuth0({
      domain: 'dev-icve0yit75alre27.eu.auth0.com',
      clientId: 'xqVSd2gyG4IkTmHlmTAiidPAF7ttVgSD',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
});
