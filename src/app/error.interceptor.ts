import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackbar: MatSnackBar) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = err.error.message;
        if (!errorMessage) {
          errorMessage = 'Something went wrong.';
        }
        this.showMessage(errorMessage);
        return throwError(err);
      })
    );
  }

  private showMessage(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['warn-snack-bar'],
    });
  }
}
