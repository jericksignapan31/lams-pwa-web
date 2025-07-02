import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Equipment, Product } from '../model/product';

// Equipment interface for API operations

/**
 * EquipmentService - API service for equipment management
 *
 * API Endpoints:
 * GET    /api/equipments/               # List equipment (campus-filtered)
 * POST   /api/equipments/               # Create equipment (auto-assigns creator as user)
 * GET    /api/equipments/{id}/          # Get equipment details
 * PUT    /api/equipments/{id}/          # Update equipment
 * PATCH  /api/equipments/{id}/          # Partial update equipment
 * DELETE /api/equipments/{id}/          # Delete equipment
 *
 * Usage Examples:
 *
 * // Get all equipment
 * equipmentService.getEquipments().subscribe(equipment => { ... });
 *
 * // Create new equipment
 * equipmentService.createEquipment({
 *   name: 'Microscope',
 *   category: 'Lab Equipment',
 *   quantity: 5
 * }).subscribe(result => { ... });
 *
 * // Update equipment status
 * equipmentService.updateEquipmentStatus('123', 'MAINTENANCE').subscribe(...);
 *
 * // Search equipment
 * equipmentService.searchEquipment('microscope').subscribe(...);
 *
 * // Legacy methods (deprecated):
 * equipmentService.getProducts() - use getEquipmentsAsPromise() instead
 */

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private baseUrl = environment.baseUrl + '/equipments/';

  constructor(private http: HttpClient) {}

  /**
   * Get authentication headers
   */
  private getHeaders(): HttpHeaders {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return new HttpHeaders();
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    console.log(
      '🔍 EquipmentService - Using token:',
      accessToken ? 'Token found' : 'No token'
    );

    return new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
  }

 
  getAssets(): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }

    const assetsUrl = environment.baseUrl + '/assets/';
    console.log('🔍 EquipmentService - Getting all assets');
    console.log('🔍 EquipmentService - Assets API URL:', assetsUrl);

    const headers = this.getHeaders();
    return this.http.get(assetsUrl, { headers });
  }

  // Legacy methods for backward compatibility (using mock data)
  // These can be removed once all components are updated to use the new API methods

 
  // ============================================================================
  // TRANSITION HELPERS
  // ============================================================================

  /**
   * New method that returns real API data as Promise (for easy migration)
   * Use this to replace getProducts() calls gradually
   */
  
}
