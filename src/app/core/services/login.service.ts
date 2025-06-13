import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  }

 

  createItem(data: any) {
    return this.http.post(`${this.baseUrl}/items/`, data);
  }

  updateItem(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/items/${id}/`, data);
  }

  deleteItem(id: number) {
    return this.http.delete(`${this.baseUrl}/items/${id}/`);
  }
}
