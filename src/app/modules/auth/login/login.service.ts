import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  getItems() {
    return this.http.get(`${this.baseUrl}/items/`);
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
