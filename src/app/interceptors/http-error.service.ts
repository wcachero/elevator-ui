// http-error.service.ts
// This interceptor handles HTTP errors globally in the Angular application.
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine) {
          // Handle offline error
          console.error('No Internet Connection');
          alert('You are offline. Please check your internet connection.');
        } else if (error.status === 0) {
          // Handle backend offline or unreachable error
          console.error('Backend is offline or unreachable');
          alert('The backend server is currently offline or unreachable. Please try again later.');
        } else {
          // Handle other HTTP errors
          console.error(`HTTP Error: ${error.status} - ${error.message}`);
        }
        return throwError(() => new Error(error.message));
      })
    );
  }
}