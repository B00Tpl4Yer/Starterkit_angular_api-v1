import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Toast } from '../../services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      @for (toast of toasts; track toast.id) {
        <div
          [ngClass]="{
            'bg-green-50 border border-green-200': toast.type === 'success',
            'bg-red-50 border border-red-200': toast.type === 'error',
            'bg-yellow-50 border border-yellow-200': toast.type === 'warning',
            'bg-blue-50 border border-blue-200': toast.type === 'info'
          }"
          class="rounded-lg p-4 shadow-lg animate-in slide-in-from-top-5 fade-in duration-300"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 pt-0.5">
              @switch (toast.type) {
                @case ('success') {
                  <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                }
                @case ('error') {
                  <svg class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
                @case ('warning') {
                  <svg class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 0H8.5m3.5 0h3.5" />
                  </svg>
                }
                @case ('info') {
                  <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              }
            </div>

            <!-- Message -->
            <div class="flex-1">
              <p
                [ngClass]="{
                  'text-green-800': toast.type === 'success',
                  'text-red-800': toast.type === 'error',
                  'text-yellow-800': toast.type === 'warning',
                  'text-blue-800': toast.type === 'info'
                }"
                class="text-sm font-medium"
              >
                {{ toast.message }}
              </p>
            </div>

            <!-- Close Button -->
            <button
              (click)="closeToast(toast.id)"
              [ngClass]="{
                'hover:bg-green-100 text-green-600': toast.type === 'success',
                'hover:bg-red-100 text-red-600': toast.type === 'error',
                'hover:bg-yellow-100 text-yellow-600': toast.type === 'warning',
                'hover:bg-blue-100 text-blue-600': toast.type === 'info'
              }"
              class="flex-shrink-0 rounded-md p-1 transition-colors"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  closeToast(id: string): void {
    this.notificationService.remove(id);
  }
}
