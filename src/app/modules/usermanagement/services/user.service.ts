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
      console.log('🔍 Window or localStorage undefined, returning empty array');
      return of([]);
    }

    const accessToken = localStorage.getItem('lams_authToken123');
    console.log('🔍 Getting all users from:', `${this.baseUrl}/users/`);
    console.log(
      '🔍 Using token:',
      accessToken ? 'Token found' : 'No token found'
    );

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

    // For FormData, don't set Content-Type - let browser set it with boundary
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    // If data is not FormData, add Content-Type for JSON
    if (!(data instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    return this.http.put(`${this.baseUrl}/users/${id}/`, data, { headers });
  }

  updateCurrentUserProfile(data: any) {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of({});
    }
    const accessToken = localStorage.getItem('lams_authToken123');

    // For FormData, don't set Content-Type - let browser set it with boundary
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    // If data is not FormData, add Content-Type for JSON
    if (!(data instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

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

  // Test method to verify API connectivity
  testApiConnection() {
    console.log('🔍 Testing API connection...');
    console.log('🔍 Base URL:', this.baseUrl);
    console.log('🔍 Full endpoint:', `${this.baseUrl}/users/`);

    const accessToken = localStorage.getItem('lams_authToken123');
    console.log('🔍 Token:', accessToken ? 'Available' : 'Missing');

    if (!accessToken) {
      console.error('❌ No access token found!');
      return of({ error: 'No access token' });
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/users/`, { headers });
  }
}
