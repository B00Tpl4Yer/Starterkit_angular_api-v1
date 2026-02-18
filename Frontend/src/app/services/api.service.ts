import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://192.168.1.22/api';
  private webUrl = 'http://192.168.1.22'; // For Sanctum routes

  constructor(private http: HttpClient) {}

  /**
   * Get default headers
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * GET request
   */
  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  /**
   * GET request to web routes (e.g., Sanctum CSRF cookie)
   */
  getFromWeb(endpoint: string): Observable<any> {
    return this.http.get(`${this.webUrl}${endpoint}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  /**
   * POST request
   */
  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  /**
   * PUT request
   */
  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  /**
   * DELETE request
   */
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  /**
   * PATCH request
   */
  patch(endpoint: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }
}
