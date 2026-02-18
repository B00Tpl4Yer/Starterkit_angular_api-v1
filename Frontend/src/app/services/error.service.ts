import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  validationErrors?: Record<string, string[]>;
  statusCode?: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<ErrorState | null>(null);
  public error$ = this.errorSubject.asObservable();

  private validationErrorsSubject = new BehaviorSubject<Record<string, string[]>>({});
  public validationErrors$ = this.validationErrorsSubject.asObservable();

  constructor() {}

  /**
   * Parse error dari response backend
   * Support berbagai format error dari Laravel
   */
  handleError(error: any): ErrorState {
    let errorState: ErrorState = {
      message: 'Terjadi kesalahan. Silakan coba lagi.',
      type: 'error',
      statusCode: error?.status || 0,
      timestamp: Date.now()
    };

    // Laravel validation error (422)
    if (error?.status === 422 && error?.error?.errors) {
      const validationErrors = error.error.errors;
      errorState.validationErrors = validationErrors;
      errorState.message = error?.error?.message || 'Validasi gagal. Silakan periksa inputan Anda.';
      this.validationErrorsSubject.next(validationErrors);
      this.errorSubject.next(errorState);
      return errorState;
    }

    // Laravel validation error (alternative format)
    if (error?.status === 422 && error?.error?.message) {
      errorState.message = error.error.message;
      this.errorSubject.next(errorState);
      return errorState;
    }

    // Unauthorized (401)
    if (error?.status === 401) {
      errorState.message = 'Sesi Anda telah berakhir. Silakan login kembali.';
      this.errorSubject.next(errorState);
      return errorState;
    }

    // Forbidden (403)
    if (error?.status === 403) {
      errorState.message = 'Anda tidak memiliki akses ke resource ini.';
      this.errorSubject.next(errorState);
      return errorState;
    }

    // CSRF Token Mismatch (419)
    if (error?.status === 419) {
      errorState.message = 'Token keamanan telah berakhir. Silakan refresh halaman.';
      this.errorSubject.next(errorState);
      return errorState;
    }

    // Not Found (404)
    if (error?.status === 404) {
      errorState.message = 'Resource tidak ditemukan.';
      this.errorSubject.next(errorState);
      return errorState;
    }

    // Server error (500+)
    if (error?.status >= 500) {
      errorState.message = 'Terjadi kesalahan pada server. Tim kami telah diberitahu.';
      this.errorSubject.next(errorState);
      return errorState;
    }

    // Network/CORS error (status 0)
    if (error?.status === 0 || error?.status === null) {
      errorState.message = 'Koneksi ke server gagal. Periksa koneksi internet Anda.';
      this.errorSubject.next(errorState);
      return errorState;
    }

    // Generic error
    if (error?.error?.message) {
      errorState.message = error.error.message;
    }

    this.errorSubject.next(errorState);
    return errorState;
  }

  /**
   * Clear validation errors
   */
  clearValidationErrors(): void {
    this.validationErrorsSubject.next({});
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errorSubject.next(null);
    this.validationErrorsSubject.next({});
  }

  /**
   * Get current error
   */
  getCurrentError(): ErrorState | null {
    return this.errorSubject.value;
  }

  /**
   * Get validation errors
   */
  getValidationErrors(): Record<string, string[]> {
    return this.validationErrorsSubject.value;
  }

  /**
   * Check if has specific field error
   */
  hasFieldError(fieldName: string): boolean {
    return !!this.validationErrorsSubject.value[fieldName];
  }

  /**
   * Get field error message
   */
  getFieldError(fieldName: string): string | null {
    const errors = this.validationErrorsSubject.value[fieldName];
    return errors && errors.length > 0 ? errors[0] : null;
  }
}
