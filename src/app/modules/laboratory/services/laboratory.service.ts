import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LaboratoryService {
  private baseUrl = environment.baseUrl + '/laboratories/';

  constructor(private http: HttpClient) {}

  getLaboratories(): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(this.baseUrl, { headers });
  }

  createLaboratory(data: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(this.baseUrl, data, { headers });
  }

  getLaboratory(id: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    console.log('🔍 LaboratoryService - Getting laboratory:', id);
    console.log(
      '🔍 LaboratoryService - Using token:',
      accessToken ? 'Token found' : 'No token'
    );

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}${id}/`, { headers });
  }

  updateLaboratory(id: string, data: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.baseUrl}${id}/`, data, { headers });
  }

  partialUpdateLaboratory(id: string, data: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.patch(`${this.baseUrl}${id}/`, data, { headers });
  }

  deleteLaboratory(id: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.delete(`${this.baseUrl}${id}/`, { headers });
  }
}
