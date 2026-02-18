import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.checkAuth();
  }

  /**
   * Check if user is authenticated
   */
  private checkAuth(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Register new user
   * POST /register
   */
  register(data: any): Observable<any> {
    return this.apiService.post('/register', data).pipe(
      tap((response: any) => {
        if (response.token && response.user) {
          this.setAuth(response.token, response.user);
        }
      })
    );
  }

  /**
   * Login user
   * POST /login
   */
  login(credentials: any): Observable<any> {
    return this.apiService.post('/login', credentials).pipe(
      tap((response: any) => {
        if (response.token && response.user) {
          this.setAuth(response.token, response.user);
        }
      })
    );
  }

  /**
   * Logout user
   * POST /logout
   */
  logout(): Observable<any> {
    return this.apiService.post('/logout', {}).pipe(
      tap(() => {
        this.clearAuth();
        this.router.navigate(['/auth/login']);
      })
    );
  }

  /**
   * Get authenticated user
   * GET /user
   */
  getUser(): Observable<any> {
    return this.apiService.get('/user').pipe(
      tap((response: any) => {
        if (response.user) {
          this.currentUserSubject.next(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  /**
   * Update user profile
   * PUT /profile
   */
  updateProfile(data: any): Observable<any> {
    return this.apiService.put('/profile', data).pipe(
      tap((response: any) => {
        if (response.user) {
          this.currentUserSubject.next(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  /**
   * Set authentication data
   */
  private setAuth(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Get current user value
   */
  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
