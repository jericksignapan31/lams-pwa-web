import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllUsers() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}/users/`, { headers });
  }

  getUser() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of({});
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}/users/profile/`, { headers });
  }

  createAccount(data: any) {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of({});
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.post(`${this.baseUrl}/users/`, data, { headers });
  }

  updateUser(id: string | number, data: any) {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of({});
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.baseUrl}/users/${id}/`, data, { headers });
  }

  // Method specifically for updating current user's own profile
  updateCurrentUserProfile(data: any) {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of({});
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    // Try using the profile endpoint for current user updates
    return this.http.put(`${this.baseUrl}/users/profile/`, data, { headers });
  }

  deleteUser(id: string | number) {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of({});
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.delete(`${this.baseUrl}/users/${id}/`, { headers });
  }
}
