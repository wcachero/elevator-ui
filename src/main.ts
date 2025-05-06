import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './app/interceptors/http-error.service';
bootstrapApplication(AppComponent, {
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    provideRouter(routes),
    provideHttpClient(withFetch()) // Enable fetch API
  ]
}).catch(err => console.error(err));