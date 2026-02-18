import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Toast } from '../../services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-global-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-toast-container.component.html',
  styleUrl: './global-toast-container.component.css'
})
export class GlobalToastContainerComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.toasts$
      .pipe(takeUntil(this.destroy$))
      .subscribe((toasts) => {
        this.toasts = toasts;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Remove toast by ID
   */
  removeToast(id: string): void {
    this.notificationService.remove(id);
  }

  /**
   * Get icon based on toast type
   */
  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ⓘ';
      default:
        return '•';
    }
  }

  /**
   * Get Tailwind classes for toast type
   */
  getToastClasses(type: string): string {
    const baseClasses = 'px-5 py-4 rounded-lg shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 border-l-4';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-500 text-blue-800`;
      default:
        return baseClasses;
    }
  }

  /**
   * Get icon color classes
   */
  getIconClasses(type: string): string {
    const baseClasses = 'h-5 w-5 flex-shrink-0 font-bold mt-0.5';
    
    switch (type) {
      case 'success':
        return `${baseClasses} text-green-600`;
      case 'error':
        return `${baseClasses} text-red-600`;
      case 'warning':
        return `${baseClasses} text-yellow-600`;
      case 'info':
        return `${baseClasses} text-blue-600`;
      default:
        return baseClasses;
    }
  }
}
