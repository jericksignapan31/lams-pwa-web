import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LaboratoryService {
  private baseUrl = environment.baseUrl + '/laboratories/';

  constructor(private http: HttpClient) {}

  getLaboratories(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  createLaboratory(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getLaboratory(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  updateLaboratory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/`, data);
  }

  partialUpdateLaboratory(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}${id}/`, data);
  }

  deleteLaboratory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
