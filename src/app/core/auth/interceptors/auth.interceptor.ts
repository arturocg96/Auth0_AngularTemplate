import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { from, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
  
    // Convertir la Promise a Observable usando from
    return from(auth.getToken()).pipe(
      switchMap(token => {
        if (token) {
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
        }
        return next(req);
      }),
      catchError(error => {
        if (error.status === 401) {
          auth.login();
        }
        return throwError(() => error);
      })
    );
  };