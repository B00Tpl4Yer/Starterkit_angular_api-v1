import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit, OnDestroy {
  // ========== Form State ==========
  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  showPassword = false;
  showPasswordConfirmation = false;

  // ========== Loading & Error State ==========
  isLoading = false;
  validationErrors: Record<string, string[]> = {};
  isPasswordSection = false; // Track if user is trying to change password

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load current user data from service
   */
  private loadCurrentUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.name = user.name || '';
          this.email = user.email || '';
        }
      });
  }

  /**
   * Toggle password field visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggle password confirmation field visibility
   */
  togglePasswordConfirmationVisibility(): void {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }

  /**
   * Handle form submission
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

    // Build request data
    const updateData: any = {
      name: this.name,
      email: this.email
    };

    // Add password only if user is trying to change it
    if (this.password.trim()) {
      updateData.password = this.password;
      updateData.password_confirmation = this.passwordConfirmation;
    }

    // Call auth service
    this.authService
      .updateProfile(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleUpdateSuccess(response);
        },
        error: (error) => {
          this.handleUpdateError(error);
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

    // If user entered password, validate both password fields
    if (this.password.trim()) {
      if (this.password.length < 8) {
        this.notificationService.warning('Password minimal 8 karakter');
        return false;
      }

      if (!this.passwordConfirmation.trim()) {
        this.notificationService.warning('Konfirmasi password tidak boleh kosong');
        return false;
      }

      if (this.password !== this.passwordConfirmation) {
        this.notificationService.warning('Password dan konfirmasi password tidak cocok');
        return false;
      }
    }

    return true;
  }

  /**
   * Handle successful update
   */
  private handleUpdateSuccess(response: any): void {
    this.isLoading = false;

    // Clear password fields after successful update
    this.password = '';
    this.passwordConfirmation = '';
    this.isPasswordSection = false;

    // Show success notification
    this.notificationService.success(
      response.message || 'Profil berhasil diperbarui!',
      3000
    );

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      this.router.navigate(['/user/dashboard']);
    }, 1500);
  }

  /**
   * Handle update error
   */
  private handleUpdateError(error: any): void {
    this.isLoading = false;

    // Check for validation errors (422)
    if (error?.status === 422 && error?.error?.errors) {
      this.validationErrors = error.error.errors;
      // Error notification is shown by global toast from interceptor
      return;
    }

    // For other errors, they're handled by the interceptor
    if (error?.status === 401) {
      this.notificationService.error('Sesi Anda telah expired. Silakan login kembali.', 5000);
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 1500);
    }
  }

  /**
   * Check if there are validation errors for a field
   */
  hasFieldError(fieldName: string): boolean {
    return this.validationErrors[fieldName] ? true : false;
  }

  /**
   * Get validation error message for a field
   */
  getFieldError(fieldName: string): string {
    return this.validationErrors[fieldName]?.[0] || '';
  }

  /**
   * Check if password section should be displayed
   */
  togglePasswordSection(): void {
    this.isPasswordSection = !this.isPasswordSection;
    if (!this.isPasswordSection) {
      // Clear password fields if closing the section
      this.password = '';
      this.passwordConfirmation = '';
    }
  }

  /**
   * Cancel editing and go back to dashboard
   */
  onCancel(): void {
    this.router.navigate(['/user/dashboard']);
  }
}
