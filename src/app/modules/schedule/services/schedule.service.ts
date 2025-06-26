import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private baseUrl = environment.baseUrl + '/laboratories/';

  constructor(private http: HttpClient) {}

  getClassSchedules(labId: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    console.log('🔍 ScheduleService - Getting schedules for lab:', labId);
    console.log(
      '🔍 ScheduleService - Using token:',
      accessToken ? 'Token found' : 'No token'
    );
    console.log(
      '🔍 ScheduleService - API URL:',
      `${this.baseUrl}${labId}/class_schedules/`
    );

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}${labId}/class_schedules/`, {
      headers,
    });
  }

  getClassSchedule(labId: string, id: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}${labId}/class_schedules/${id}/`, {
      headers,
    });
  }

  createClassSchedule(labId: string, data: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.baseUrl}${labId}/class_schedules/`, data, {
      headers,
    });
  }

  updateClassSchedule(labId: string, id: string, data: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(
      `${this.baseUrl}${labId}/class_schedules/${id}/`,
      data,
      { headers }
    );
  }

  partialUpdateClassSchedule(
    labId: string,
    id: string,
    data: any
  ): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.patch(
      `${this.baseUrl}${labId}/class_schedules/${id}/`,
      data,
      { headers }
    );
  }

  deleteClassSchedule(labId: string, id: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.delete(`${this.baseUrl}${labId}/class_schedules/${id}/`, {
      headers,
    });
  }
}
