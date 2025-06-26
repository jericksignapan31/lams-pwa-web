import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CampusService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCampuses() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }

    // Use the same token name as other services
    const accessToken = localStorage.getItem('lams_authToken123');
    console.log(
      '🔍 CampusService - Getting campuses from:',
      `${this.baseUrl}/campuses/`
    );
    console.log(
      '🔍 CampusService - Using token:',
      accessToken ? 'Token found' : 'No token found'
    );

    if (!accessToken) {
      console.error('❌ CampusService - No authentication token found!');
      return of([]);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.baseUrl}/campuses/`, { headers });
  }
}
