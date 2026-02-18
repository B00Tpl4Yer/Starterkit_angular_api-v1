import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  // ========== Form State ==========
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;

  // ========== Loading & Error State ==========
  isLoading = false;
  validationErrors: Record<string, string[]> = {};

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Handle login submission
   */
  onSubmit(): void {
    // Reset validation errors
    this.validationErrors = {};

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    // Set loading state
    this.isLoading = true;

    // Call auth service
    this.authService
      .login({
        email: this.email,
        password: this.password
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleLoginSuccess(response);
        },
        error: (error) => {
          this.handleLoginError(error);
        }
      });
  }

  /**
   * Validate form inputs
   */
  private validateForm(): boolean {
    if (!this.email.trim()) {
      this.notificationService.warning('Email tidak boleh kosong');
      return false;
    }

    if (!this.email.includes('@')) {
      this.notificationService.warning('Email tidak valid');
      return false;
    }

    if (!this.password.trim()) {
      this.notificationService.warning('Password tidak boleh kosong');
      return false;
    }

    if (this.password.length < 6) {
      this.notificationService.warning('Password minimal 6 karakter');
      return false;
    }

    return true;
  }

  /**
   * Handle successful login
   */
  private handleLoginSuccess(response: any): void {
    this.isLoading = false;

    // Store auth token if provided
    if (response?.token) {
      localStorage.setItem('auth_token', response.token);
    }

    // Show success notification
    this.notificationService.success('Login berhasil! Selamat datang kembali.', 2000);

    // Redirect to dashboard
    setTimeout(() => {
      this.router.navigate(['/user/dashboard']);
    }, 300);
  }

  /**
   * Handle login error
   */
  private handleLoginError(error: any): void {
    this.isLoading = false;

    // Check for validation errors (422)
    if (error?.status === 422 && error?.error?.errors) {
      this.validationErrors = error.error.errors;
      // Error notification is shown by global toast from interceptor
      return;
    }

    // For other errors, they're handled by the interceptor
    // But we can also handle them here if needed
    if (error?.status === 401) {
      this.notificationService.error('Email atau password salah', 5000);
    }
  }
}
