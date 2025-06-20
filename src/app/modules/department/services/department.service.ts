import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private baseUrl = environment.baseUrl + '/departments/';

  constructor(private http: HttpClient) {}

  getDepartments(params?: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(this.baseUrl, { headers, params });
  }

  createDepartment(data: {
    department_name: string;
    department_head: string;
  }): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.post(this.baseUrl, data, { headers });
  }

  getDepartment(id: number | string): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}${id}/`, { headers });
  }

  updateDepartment(id: number | string, data: any): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.put(`${this.baseUrl}${id}/`, data, { headers });
  }

  // Partial update department
  patchDepartment(id: number | string, data: any): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.patch(`${this.baseUrl}${id}/`, data, { headers });
  }

  // Delete department
  deleteDepartment(id: number | string): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.delete(`${this.baseUrl}${id}/`, { headers });
  }
}
