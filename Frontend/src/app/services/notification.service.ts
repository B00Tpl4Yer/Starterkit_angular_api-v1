import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number | null; // ms, null for sticky
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private idCounter = 0;

  constructor() {}

  /**
   * Show success notification
   */
  success(message: string, duration: number = 3000): string {
    return this.show(message, 'success', duration);
  }

  /**
   * Show error notification
   */
  error(message: string, duration: number = 5000): string {
    return this.show(message, 'error', duration);
  }

  /**
   * Show warning notification
   */
  warning(message: string, duration: number = 4000): string {
    return this.show(message, 'warning', duration);
  }

  /**
   * Show info notification
   */
  info(message: string, duration: number = 3000): string {
    return this.show(message, 'info', duration);
  }

  /**
   * Show generic toast
   */
  private show(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    duration: number | null = 3000
  ): string {
    const id = `toast-${++this.idCounter}-${Date.now()}`;
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      createdAt: Date.now()
    };

    // Add toast
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto remove after duration
    if (duration && duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  /**
   * Remove toast by id
   */
  remove(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.toastsSubject.next([]);
  }

  /**
   * Get all current toasts
   */
  getToasts(): Toast[] {
    return this.toastsSubject.value;
  }
}
