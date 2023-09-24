import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let globaldata = JSON.parse(localStorage.getItem('globaldata') || '{}');
    if (!globaldata.user) {
      return next.handle(req);
    }
    console.log(globaldata.user);

    const modifiedReq = req.clone({
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer ' + globaldata.user.access
      ),
    });
    return next.handle(modifiedReq);
  }
}
