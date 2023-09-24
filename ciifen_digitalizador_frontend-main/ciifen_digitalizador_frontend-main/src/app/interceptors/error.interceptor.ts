import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modelStateErrors;
              } else {
                Swal.fire('Hay un problema', error.error, 'error');
              }
              break;
            case 401:
              Swal.fire('No tienes permisos', error.error, 'error');
              break;
            case 404:
              Swal.fire('Algo salio mal', error.error, 'error');
              break;
            case 500:
              Swal.fire('Algo salio mal', error.error, 'error');
              break;
            default:
              Swal.fire('Algo salio mal', error.error, 'error');
              break;
          }
        }
        throw error;
      })
    );
  }
}
