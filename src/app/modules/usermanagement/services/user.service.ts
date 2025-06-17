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
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}/users/`, { headers });
  }

  getUser() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of({});
    }
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}/profile/`, { headers });
  }

  createAccount(data: any) {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of({});
    }
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.post(`${this.baseUrl}/users/`, data, { headers });
  }

  deleteUser(id: string | number) {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of({});
    }
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.delete(`${this.baseUrl}/users/${id}/`, { headers });
  }
}
