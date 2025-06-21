import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private baseUrl = environment.baseUrl + '/laboratories/';

  constructor(private http: HttpClient) {}

  getClassSchedules(labId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${labId}/class_schedules/`);
  }

  getClassSchedule(labId: string, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${labId}/class_schedules/${id}/`);
  }

  createClassSchedule(labId: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${labId}/class_schedules/`, data);
  }

  updateClassSchedule(labId: string, id: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${labId}/class_schedules/${id}/`,
      data
    );
  }

  partialUpdateClassSchedule(
    labId: string,
    id: string,
    data: any
  ): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}${labId}/class_schedules/${id}/`,
      data
    );
  }

  deleteClassSchedule(labId: string, id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${labId}/class_schedules/${id}/`);
  }
}
