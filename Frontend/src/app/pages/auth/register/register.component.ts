import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  // ========== Form State ==========
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  acceptTerms = false;

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
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Handle register submission
   */
  onSubmit(): void {
    // Reset error state
    this.validationErrors = {};

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    // Set loading state
    this.isLoading = true;

    // Call auth service
    this.authService
      .register({
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleRegisterSuccess(response);
        },
        error: (error) => {
          this.handleRegisterError(error);
        }
      });
  }

  /**
   * Validate form inputs
   */
  private validateForm(): boolean {
    // Validate name
    if (!this.name.trim()) {
      this.notificationService.warning('Nama lengkap tidak boleh kosong');
      return false;
    }

    if (this.name.trim().length < 3) {
      this.notificationService.warning('Nama minimal 3 karakter');
      return false;
    }

    // Validate email
    if (!this.email.trim()) {
      this.notificationService.warning('Email tidak boleh kosong');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.notificationService.warning('Email tidak valid');
      return false;
    }

    // Validate password
    if (!this.password.trim()) {
      this.notificationService.warning('Password tidak boleh kosong');
      return false;
    }

    if (this.password.length < 8) {
      this.notificationService.warning('Password minimal 8 karakter');
      return false;
    }

    // Validate confirm password
    if (!this.confirmPassword.trim()) {
      this.notificationService.warning('Konfirmasi password tidak boleh kosong');
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.notificationService.warning('Password dan konfirmasi password tidak cocok');
      return false;
    }

    // Validate terms
    if (!this.acceptTerms) {
      this.notificationService.warning('Anda harus setuju dengan Syarat & Ketentuan');
      return false;
    }

    return true;
  }

  /**
   * Handle successful registration
   */
  private handleRegisterSuccess(response: any): void {
    this.isLoading = false;

    // Store auth token if provided
    if (response?.token) {
      localStorage.setItem('auth_token', response.token);
    }

    // Show success notification
    this.notificationService.success('Pendaftaran berhasil! Selamat datang di SULTAN.', 2000);

    // Redirect to dashboard
    setTimeout(() => {
      this.router.navigate(['/user/dashboard']);
    }, 300);
  }

  /**
   * Handle registration error
   */
  private handleRegisterError(error: any): void {
    this.isLoading = false;

    // Check for validation errors from server
    if (error?.error?.errors && typeof error.error.errors === 'object') {
      this.validationErrors = error.error.errors;
      // Error notification is shown by global toast from interceptor
      return;
    }

    // For other errors, they're handled by the interceptor
    if (error?.status === 422) {
      this.notificationService.error('Data yang Anda masukkan tidak valid. Silakan periksa kembali.', 5000);
    }
  }
}
