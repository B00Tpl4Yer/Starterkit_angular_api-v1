import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const errorService = inject(ErrorService);
  const notificationService = inject(NotificationService);

  // Add Authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Parse error using ErrorService
      const errorState = errorService.handleError(error);

      // Show notification for non-validation errors
      if (error.status !== 422) {
        notificationService.error(errorState.message, 5000);
      }

      // 401 Unauthorized - redirect to login
      if (error.status === 401) {
        localStorage.clear();
        router.navigate(['/auth/login']);
      }

      // 403 Forbidden - show error
      if (error.status === 403) {
        router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
};
