import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { Equipment, Product } from '../model/product';

// Equipment interface for API operations

// Hardware Equipment Data Interface
export interface HardwareEquipmentData {
  hardware_asset_type?: string;
  hardware_name: string;
  brand_name: string;
  model: string;
  serial_number: string;
  date_acquired?: Date | string | null;
  unit_cost?: number | null;
  color?: string;
  height?: number | null;
  width?: number | null;
  length?: number | null;
  weight?: number | null;
  package_material?: string;
  package_color?: string;
  estimated_useful_life?: number | null;
  laboratory?: string | null;
}

// Software Equipment Data Interface
export interface SoftwareEquipmentData {
  software_name: string;
  version: string;
  license_key?: string;
  license_count?: number | null;
  vendor: string;
  license_expiry_date?: Date | string | null;
  assigned_to?: string;
  date_acquired?: Date | string | null;
  unit_cost?: number | null;
  laboratory?: string | null;
  hardware_asset_types?: string[]; // Multiple hardware asset type IDs
}

// Asset Type Interface
export interface AssetType {
  asset_type_id: string;
  asset_type_name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

// Hardware Asset Type Interface
export interface HardwareAssetType {
  hardware_asset_type_id: string;
  type_name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

// New Asset Data Interface for the Add Asset form
export interface NewAssetData {
  asset_category: string | null;
  asset_name: string;
  property_number: string;
  foun_cluster: string;
  PO_number: string;
  purpose: string;
  date_acquired: Date | string | null;
  issued_to: string;
  Location: string | null;
  Supplier: string | null;
  Program: string | null;
  is_active: boolean;
}

/**
 * EquipmentService - API service for assets management using /api/assets/ endpoints
 *
 * API Endpoints:
 * GET    /api/assets/                              # List all assets
 * POST   /api/assets/                              # Create new asset
 * GET    /api/assets/{id}/                         # Get specific asset
 * PUT    /api/assets/{id}/                         # Update asset
 * PATCH  /api/assets/{id}/                         # Partial update asset
 * DELETE /api/assets/{id}/                         # Delete asset
 * GET    /api/assets/locations/                    # Get all locations
 * GET    /api/assets/asset-suppliers/              # Get all suppliers
 * GET    /api/assets/programs/                     # Get all programs
 */

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private baseUrl = environment.baseUrl + '/assets/';
  private locationsUrl = environment.baseUrl + '/assets/locations/';
  private suppliersUrl = environment.baseUrl + '/assets/asset-suppliers/';
  private programsUrl = environment.baseUrl + '/assets/programs/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('⚠️ EquipmentService - No window/localStorage available');
      return new HttpHeaders();
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    console.log(
      '🔍 EquipmentService - Using token:',
      accessToken
        ? `Token found (${accessToken.substring(0, 20)}...)`
        : 'No token'
    );

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    console.log('🔍 EquipmentService - Headers created:', {
      hasAuthorization: headers.has('Authorization'),
      authValue: headers.get('Authorization')?.substring(0, 30) + '...',
    });

    return headers;
  }

  /**
   * Get all assets
   * @returns Observable<any[]> - List of all assets
   */
  getAssets(): Observable<any[]> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }

    console.log('🔍 EquipmentService - Getting all assets');
    console.log('🔍 EquipmentService - Assets API URL:', this.baseUrl);

    const headers = this.getHeaders();
    return this.http.get<any[]>(this.baseUrl, { headers });
  }

  /**
   * Create new asset
   * @param assetData - Asset data to create
   * @returns Observable<any> - Created asset
   */
  createAsset(assetData: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    console.log('🔍 EquipmentService - Creating asset:', assetData);
    console.log('🔍 EquipmentService - Assets API URL:', this.baseUrl);

    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl, assetData, { headers });
  }

  /**
   * Get specific asset
   * @param assetId - The asset ID
   * @returns Observable<any> - Asset details
   */
  getAsset(assetId: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const assetUrl = `${this.baseUrl}${assetId}/`;
    console.log('🔍 EquipmentService - Getting asset:', assetId);
    console.log('🔍 EquipmentService - Asset API URL:', assetUrl);

    const headers = this.getHeaders();
    return this.http.get<any>(assetUrl, { headers });
  }

  /**
   * Update asset (full update)
   * @param assetId - The asset ID
   * @param assetData - Updated asset data
   * @returns Observable<any> - Updated asset
   */
  updateAsset(assetId: string, assetData: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const assetUrl = `${this.baseUrl}${assetId}/`;
    console.log('🔍 EquipmentService - Updating asset:', assetId, assetData);
    console.log('🔍 EquipmentService - Asset API URL:', assetUrl);

    const headers = this.getHeaders();
    return this.http.put<any>(assetUrl, assetData, { headers });
  }

  /**
   * Partial update asset
   * @param assetId - The asset ID
   * @param partialData - Partial asset data to update
   * @returns Observable<any> - Updated asset
   */
  patchAsset(assetId: string, partialData: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const assetUrl = `${this.baseUrl}${assetId}/`;
    console.log('🔍 EquipmentService - Patching asset:', assetId, partialData);
    console.log('🔍 EquipmentService - Asset API URL:', assetUrl);

    const headers = this.getHeaders();
    return this.http.patch<any>(assetUrl, partialData, { headers });
  }

  /**
   * Delete asset
   * @param assetId - The asset ID
   * @returns Observable<any> - Delete response
   */
  deleteAsset(assetId: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const assetUrl = `${this.baseUrl}${assetId}/`;
    console.log('🔍 EquipmentService - Deleting asset:', assetId);
    console.log('🔍 EquipmentService - Asset API URL:', assetUrl);

    const headers = this.getHeaders();
    return this.http.delete<any>(assetUrl, { headers });
  }

  /**
   * Get all locations
   * @returns Observable<any[]> - List of all locations
   */
  getLocations(): Observable<any[]> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }

    console.log('🔍 EquipmentService - Getting all locations');
    console.log('🔍 EquipmentService - Locations API URL:', this.locationsUrl);

    const headers = this.getHeaders();
    return this.http.get<any[]>(this.locationsUrl, { headers }).pipe(
      tap((response) =>
        console.log('📍 EquipmentService - Locations response:', response)
      ),
      catchError((error) => {
        console.error('❌ EquipmentService - Error getting locations:', error);
        return of([]);
      })
    );
  }

  /**
   * Get all suppliers
   * @returns Observable<any[]> - List of all suppliers
   */
  getSuppliers(): Observable<any[]> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }

    console.log('🔍 EquipmentService - Getting all suppliers');
    console.log('🔍 EquipmentService - Suppliers API URL:', this.suppliersUrl);

    const headers = this.getHeaders();
    return this.http.get<any[]>(this.suppliersUrl, { headers }).pipe(
      tap((response) =>
        console.log('🏢 EquipmentService - Suppliers response:', response)
      ),
      catchError((error) => {
        console.error('❌ EquipmentService - Error getting suppliers:', error);
        return of([]);
      })
    );
  }

  /**
   * Get all programs
   * @returns Observable<any[]> - List of all programs
   */
  getPrograms(): Observable<any[]> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }

    console.log('🔍 EquipmentService - Getting all programs');
    console.log('🔍 EquipmentService - Programs API URL:', this.programsUrl);

    const headers = this.getHeaders();
    return this.http.get<any[]>(this.programsUrl, { headers }).pipe(
      tap((response) =>
        console.log('📚 EquipmentService - Programs response:', response)
      ),
      catchError((error) => {
        console.error('❌ EquipmentService - Error getting programs:', error);
        return of([]);
      })
    );
  }

  /**
   * Test all new endpoints - For development/testing purposes
   * @returns Observable<any> - Combined test results
   */
  testNewEndpoints(): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of({
        locations: [],
        suppliers: [],
        programs: [],
        error: 'No window/localStorage available',
      });
    }

    console.log('🧪 EquipmentService - Testing all new endpoints...');

    return new Observable((observer) => {
      const results: any = {
        locations: null,
        suppliers: null,
        programs: null,
        errors: [],
      };

      let completed = 0;
      const total = 3;

      const checkCompletion = () => {
        completed++;
        if (completed === total) {
          console.log('🧪 EquipmentService - Test results:', results);
          observer.next(results);
          observer.complete();
        }
      };

      // Test locations
      this.getLocations().subscribe({
        next: (locations) => {
          results.locations = locations;
          console.log('✅ Locations test passed:', locations.length, 'items');
          checkCompletion();
        },
        error: (error) => {
          results.errors.push({ endpoint: 'locations', error });
          console.error('❌ Locations test failed:', error);
          checkCompletion();
        },
      });

      // Test suppliers
      this.getSuppliers().subscribe({
        next: (suppliers) => {
          results.suppliers = suppliers;
          console.log('✅ Suppliers test passed:', suppliers.length, 'items');
          checkCompletion();
        },
        error: (error) => {
          results.errors.push({ endpoint: 'suppliers', error });
          console.error('❌ Suppliers test failed:', error);
          checkCompletion();
        },
      });

      // Test programs
      this.getPrograms().subscribe({
        next: (programs) => {
          results.programs = programs;
          console.log('✅ Programs test passed:', programs.length, 'items');
          checkCompletion();
        },
        error: (error) => {
          results.errors.push({ endpoint: 'programs', error });
          console.error('❌ Programs test failed:', error);
          checkCompletion();
        },
      });
    });
  }
}
