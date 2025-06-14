import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { of } from 'rxjs';

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
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}/campuses/`, { headers });
  }
}
