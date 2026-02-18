/**
 * SISTEM ERROR HANDLING & NOTIFICATION
 * 
 * Architecture:
 * 1. ErrorService - Parse & store error state
 * 2. NotificationService - Manage toast notifications
 * 3. AuthInterceptor - Global error handling
 * 4. ToastContainerComponent - UI untuk display toasts
 * 5. LoginComponent & RegisterComponent - Demonstrate usage
 * 
 * Flow:
 * HTTP Request → Error Response → AuthInterceptor catches
 *              → ErrorService parses error
 *              → NotificationService shows toast (jika non-422)
 *              → Component receives error via ErrorService
 *              → Component displays validation errors untuk 422
 * 
 * Supported HTTP Status Codes:
 * - 422: Validation Error (ditampilkan di form field)
 * - 401: Unauthorized (redirect ke login + toast)
 * - 403: Forbidden (toast + redirect home)
 * - 419: CSRF Token Mismatch (toast)
 * - 404: Not Found (toast)
 * - 500+: Server Error (toast)
 * - 0: Network Error (toast)
 * 
 * Usage dalam Component:
 * 
 * 1. Inject services:
 *    constructor(
 *      private authService: AuthService,
 *      private errorService: ErrorService,
 *      private notificationService: NotificationService
 *    ) {}
 * 
 * 2. Listen to errors:
 *    this.errorService.error$.subscribe(error => {
 *      if (error) console.log(error.message);
 *    });
 * 
 * 3. Check validation errors:
 *    this.errorService.hasFieldError('email')  // boolean
 *    this.errorService.getFieldError('email')  // string | null
 * 
 * 4. Show custom notification:
 *    this.notificationService.success('Success message', 3000);
 *    this.notificationService.error('Error message', 5000);
 *    this.notificationService.warning('Warning message');
 *    this.notificationService.info('Info message');
 * 
 * Response Format (Backend):
 * 
 * Success:
 * {
 *   "user": {...},
 *   "token": "..."
 * }
 * 
 * Validation Error (422):
 * {
 *   "message": "Validasi gagal",
 *   "errors": {
 *     "email": ["Email sudah terdaftar"],
 *     "password": ["Password minimal 8 karakter"]
 *   }
 * }
 * 
 * Server Error (500):
 * {
 *   "message": "Internal Server Error"
 * }
 * 
 * Customization:
 * 
 * - Change toast position: Ubah "top-4 right-4" di toast-container.component.ts
 * - Change toast duration: Ubah default duration di notificationService
 * - Change error messages: Update parseError method di error.service.ts
 * - Add more status codes: Extend handleError method di error.service.ts
 */

// File structure:
// src/app/
// ├── services/
// │   ├── error.service.ts           // Parse & store errors
// │   └── notification.service.ts    // Toast management
// ├── interceptors/
// │   └── auth.interceptor.ts        // Global error catching
// ├── components/
// │   └── toast-container/
// │       └── toast-container.component.ts  // Toast UI
// ├── pages/
// │   └── auth/
// │       ├── login/
// │       │   └── login.component.ts  // With error handling
// │       └── register/
// │           └── register.component.ts  // With error handling
// └── app.ts                        // Include ToastContainerComponent

export const ERROR_HANDLING_INFO = 'See comments above for complete documentation';
