import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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

  /**
   * Get laboratories filtered by campus
   * @param campus The campus name or ID to filter by
   */
  getLaboratoriesByCampus(campus?: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }

    const accessToken = localStorage.getItem('lams_authToken123');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    // If no campus specified, get current user's campus and filter
    if (!campus) {
      return this.getLaboratories().pipe(
        map((laboratories: any[]) => {
          const userCampus = this.getCurrentUserCampus();
          if (userCampus) {
            return laboratories.filter(
              (lab) =>
                lab.campus === userCampus ||
                lab.campus_id === userCampus ||
                lab.campus?.toLowerCase() === userCampus.toLowerCase()
            );
          }
          return laboratories; // Return all if no user campus found
        })
      );
    }

    // Filter by specified campus
    return this.getLaboratories().pipe(
      map((laboratories: any[]) => {
        return laboratories.filter(
          (lab) =>
            lab.campus === campus ||
            lab.campus_id === campus ||
            lab.campus?.toLowerCase() === campus.toLowerCase()
        );
      })
    );
  }

  /**
   * Get current user's campus from stored user data or token
   * This should be adapted based on how you store user information
   */
  private getCurrentUserCampus(): string | null {
    try {
      // Try to get from localStorage user data
      const userData =
        localStorage.getItem('lams_userData') ||
        localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        return user.campus || user.campus_name || user.campus_id;
      }

      // Alternative: decode JWT token to get campus info
      const token = localStorage.getItem('lams_authToken123');
      if (token) {
        // You might want to decode the JWT token here to get user campus
        // This is a simplified approach - in a real app you'd properly decode the JWT
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.campus || payload.campus_name || payload.campus_id;
        } catch (e) {
          console.warn('Could not decode token for campus information');
        }
      }

      // Fallback: could make an API call to get current user info
      return null;
    } catch (error) {
      console.error('Error getting user campus:', error);
      return null;
    }
  }
}
