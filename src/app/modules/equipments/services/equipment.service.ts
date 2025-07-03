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

// Asset Type Constants (deprecated - use getAssetTypes() instead)
export const ASSET_TYPES = {
  HARDWARE: '3660f0bc-ba67-4a73-b121-2dc76a10248a',
  SOFTWARE: 'bfe46b46-f97f-43a5-9683-d4cc357ff143',
} as const;

/**
 * EquipmentService - API service for equipment management
 *
 * API Endpoints:
 *
 * General Assets:
 * GET    /api/assets/                              # List all asset types
 *
 * Equipment (Legacy):
 * GET    /api/equipments/                          # List equipment (campus-filtered)
 * POST   /api/equipments/                          # Create equipment (auto-assigns creator as user)
 * GET    /api/equipments/{id}/                     # Get equipment details
 * PUT    /api/equipments/{id}/                     # Update equipment
 * PATCH  /api/equipments/{id}/                     # Partial update equipment
 * DELETE /api/equipments/{id}/                     # Delete equipment
 *
 * Hardware Assets:
 * GET    /api/assets/{asset_type_id}/hardwares/    # List hardware for asset type
 * POST   /api/assets/{asset_type_id}/hardwares/    # Create hardware for asset type
 * GET    /api/assets/{asset_type_id}/hardwares/{id}/ # Get specific hardware
 * PUT    /api/assets/{asset_type_id}/hardwares/{id}/ # Update specific hardware
 * PATCH  /api/assets/{asset_type_id}/hardwares/{id}/ # Partial update hardware
 * DELETE /api/assets/{asset_type_id}/hardwares/{id}/ # Delete specific hardware
 *
 * Software Assets:
 * GET    /api/assets/{asset_type_id}/softwares/    # List software for asset type
 * POST   /api/assets/{asset_type_id}/softwares/    # Create software for asset type
 * GET    /api/assets/{asset_type_id}/softwares/{id}/ # Get specific software
 * PUT    /api/assets/{asset_type_id}/softwares/{id}/ # Update specific software
 * PATCH  /api/assets/{asset_type_id}/softwares/{id}/ # Partial update software
 * DELETE /api/assets/{asset_type_id}/softwares/{id}/ # Delete specific software
 *
 * Usage Examples:
 *
 * // Get all asset types
 * equipmentService.getAssets().subscribe(assets => { ... });
 *
 * // Get all hardware for an asset type
 * equipmentService.getHardwares('asset_type_id').subscribe(hardwares => { ... });
 *
 * // Create new hardware
 * equipmentService.createHardware('asset_type_id', {
 *   hardware_name: 'Microscope',
 *   brand_name: 'Olympus',
 *   model: 'BX53',
 *   serial_number: 'SN123456'
 * }).subscribe(result => { ... });
 *
 * // Get all software for an asset type
 * equipmentService.getSoftwares('asset_type_id').subscribe(softwares => { ... });
 *
 * // Create new software
 * equipmentService.createSoftware('asset_type_id', {
 *   software_name: 'Microsoft Office',
 *   version: '2023',
 *   vendor: 'Microsoft'
 * }).subscribe(result => { ... });
 *
 * // Update hardware
 * equipmentService.updateHardware('asset_type_id', 'hardware_id', updatedData).subscribe(...);
 *
 * // Delete software
 * equipmentService.deleteSoftware('asset_type_id', 'software_id').subscribe(...);
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
      console.log('⚠️ EquipmentService - No window/localStorage available');
      return new HttpHeaders();
    }
    const accessToken = localStorage.getItem('lams_authToken123');
    console.log(
      '🔍 EquipmentService - Using token:',
      accessToken ? `Token found (${accessToken.substring(0, 20)}...)` : 'No token'
    );

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    
    console.log('🔍 EquipmentService - Headers created:', {
      hasAuthorization: headers.has('Authorization'),
      authValue: headers.get('Authorization')?.substring(0, 30) + '...'
    });
    
    return headers;
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

  /**
   * Get all hardware asset types
   * @returns Observable<HardwareAssetType[]> - List of hardware asset types
   */
  getHardwareAssetTypes(): Observable<HardwareAssetType[]> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }

    const hardwareTypesUrl = `${environment.baseUrl}/hardware-asset-types/`;
    console.log('🔍 EquipmentService - Getting hardware asset types');
    console.log(
      '🔍 EquipmentService - Hardware Types API URL:',
      hardwareTypesUrl
    );

    const headers = this.getHeaders();
    return this.http.get<HardwareAssetType[]>(hardwareTypesUrl, { headers });
  }

  /**
   * Get all asset types
   * @returns Observable<AssetType[]> - List of asset types
   */
  getAssetTypes(): Observable<AssetType[]> {
    console.log('🔍 EquipmentService.getAssetTypes() - Method called');
    console.log('🔍 EquipmentService.getAssetTypes() - Using existing getAssets() method');
    
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('⚠️ EquipmentService.getAssetTypes() - Server side rendering detected, returning empty array');
      return of([]);
    }

    console.log('� EquipmentService - Using getAssets() to fetch asset types from /api/assets/');
    
    return this.getAssets().pipe(
      tap({
        next: (response) => {
          console.log('✅ EquipmentService - Assets response received:', response);
          console.log('📊 Number of assets received:', response?.length || 0);
        },
        error: (error) => {
          console.error('❌ EquipmentService - Assets API error:', error);
          console.error('❌ EquipmentService - Error status:', error.status);
          console.error('❌ EquipmentService - Error statusText:', error.statusText);
          console.error('❌ EquipmentService - Error URL:', error.url);
          console.error('❌ EquipmentService - Error body:', error.error);
        }
      })
    );
  }

  /**
   * Get asset types with fallback to mock data
   * @returns Observable<AssetType[]> - List of asset types (real or mock)
   */
  getAssetTypesWithFallback(): Observable<AssetType[]> {
    console.log('🔄 EquipmentService.getAssetTypesWithFallback() - Trying /api/assets/ first...');
    
    return this.getAssetTypes().pipe(
      tap({
        next: (response: any) => {
          console.log('✅ Real API data received from /api/assets/, using that:', response);
        },
        error: (error: any) => {
          console.log('❌ /api/assets/ API failed, will use mock data as fallback');
        }
      }),
      // If API fails, provide mock data
      catchError((error) => {
        console.log('🔄 Using mock asset types as fallback...');
        const mockAssetTypes: AssetType[] = [
          {
            asset_type_id: 'hardware-mock-id',
            asset_type_name: 'Hardware',
            description: 'Physical equipment and devices',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            asset_type_id: 'software-mock-id',
            asset_type_name: 'Software',
            description: 'Software applications and licenses',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        console.log('✅ Mock asset types provided:', mockAssetTypes);
        return of(mockAssetTypes);
      })
    );
  }

  // Legacy methods for backward compatibility (using mock data)
  // These can be removed once all components are updated to use the new API methods

  // ============================================================================
  // HARDWARE ASSET CRUD OPERATIONS
  // ============================================================================

  /**
   * Get all hardware assets for a specific asset type
   * @param assetTypeId - The asset type ID
   * @returns Observable<any[]> - List of hardware assets
   */
  getHardwares(assetTypeId: string): Observable<any[]> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }

    const hardwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/hardwares/`;
    console.log(
      '🔍 EquipmentService - Getting hardware assets for type:',
      assetTypeId
    );
    console.log('🔍 EquipmentService - Hardware API URL:', hardwareUrl);

    const headers = this.getHeaders();
    return this.http.get<any[]>(hardwareUrl, { headers });
  }

  /**
   * Create new hardware asset
   * @param assetTypeId - The asset type ID
   * @param hardwareData - Hardware data to create
   * @returns Observable<any> - Created hardware asset
   */
  createHardware(assetTypeId: string, hardwareData: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const hardwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/hardwares/`;
    console.log('🔍 EquipmentService - Creating hardware asset:', hardwareData);
    console.log('🔍 EquipmentService - Hardware API URL:', hardwareUrl);

    const headers = this.getHeaders();
    return this.http.post<any>(hardwareUrl, hardwareData, { headers });
  }

  /**
   * Get specific hardware asset
   * @param assetTypeId - The asset type ID
   * @param hardwareId - The hardware ID
   * @returns Observable<any> - Hardware asset details
   */
  getHardware(assetTypeId: string, hardwareId: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const hardwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/hardwares/${hardwareId}/`;
    console.log('🔍 EquipmentService - Getting hardware asset:', hardwareId);
    console.log('🔍 EquipmentService - Hardware API URL:', hardwareUrl);

    const headers = this.getHeaders();
    return this.http.get<any>(hardwareUrl, { headers });
  }

  /**
   * Update hardware asset (full update)
   * @param assetTypeId - The asset type ID
   * @param hardwareId - The hardware ID
   * @param hardwareData - Updated hardware data
   * @returns Observable<any> - Updated hardware asset
   */
  updateHardware(
    assetTypeId: string,
    hardwareId: string,
    hardwareData: any
  ): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const hardwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/hardwares/${hardwareId}/`;
    console.log(
      '🔍 EquipmentService - Updating hardware asset:',
      hardwareId,
      hardwareData
    );
    console.log('🔍 EquipmentService - Hardware API URL:', hardwareUrl);

    const headers = this.getHeaders();
    return this.http.put<any>(hardwareUrl, hardwareData, { headers });
  }

  /**
   * Partial update hardware asset
   * @param assetTypeId - The asset type ID
   * @param hardwareId - The hardware ID
   * @param partialData - Partial hardware data to update
   * @returns Observable<any> - Updated hardware asset
   */
  patchHardware(
    assetTypeId: string,
    hardwareId: string,
    partialData: any
  ): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const hardwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/hardwares/${hardwareId}/`;
    console.log(
      '🔍 EquipmentService - Patching hardware asset:',
      hardwareId,
      partialData
    );
    console.log('🔍 EquipmentService - Hardware API URL:', hardwareUrl);

    const headers = this.getHeaders();
    return this.http.patch<any>(hardwareUrl, partialData, { headers });
  }

  /**
   * Delete hardware asset
   * @param assetTypeId - The asset type ID
   * @param hardwareId - The hardware ID
   * @returns Observable<any> - Delete response
   */
  deleteHardware(assetTypeId: string, hardwareId: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const hardwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/hardwares/${hardwareId}/`;
    console.log('🔍 EquipmentService - Deleting hardware asset:', hardwareId);
    console.log('🔍 EquipmentService - Hardware API URL:', hardwareUrl);

    const headers = this.getHeaders();
    return this.http.delete<any>(hardwareUrl, { headers });
  }

  // ============================================================================
  // SOFTWARE ASSET CRUD OPERATIONS
  // ============================================================================

  /**
   * Get all software assets for a specific asset type
   * @param assetTypeId - The asset type ID
   * @returns Observable<any[]> - List of software assets
   */
  getSoftwares(assetTypeId: string): Observable<any[]> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of([]);
    }

    const softwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/softwares/`;
    console.log(
      '🔍 EquipmentService - Getting software assets for type:',
      assetTypeId
    );
    console.log('🔍 EquipmentService - Software API URL:', softwareUrl);

    const headers = this.getHeaders();
    return this.http.get<any[]>(softwareUrl, { headers });
  }

  /**
   * Create new software asset
   * @param assetTypeId - The asset type ID
   * @param softwareData - Software data to create
   * @returns Observable<any> - Created software asset
   */
  createSoftware(assetTypeId: string, softwareData: any): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const softwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/softwares/`;
    console.log('🔍 EquipmentService - Creating software asset:', softwareData);
    console.log('🔍 EquipmentService - Software API URL:', softwareUrl);

    const headers = this.getHeaders();
    return this.http.post<any>(softwareUrl, softwareData, { headers });
  }

  /**
   * Get specific software asset
   * @param assetTypeId - The asset type ID
   * @param softwareId - The software ID
   * @returns Observable<any> - Software asset details
   */
  getSoftware(assetTypeId: string, softwareId: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const softwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/softwares/${softwareId}/`;
    console.log('🔍 EquipmentService - Getting software asset:', softwareId);
    console.log('🔍 EquipmentService - Software API URL:', softwareUrl);

    const headers = this.getHeaders();
    return this.http.get<any>(softwareUrl, { headers });
  }

  /**
   * Update software asset (full update)
   * @param assetTypeId - The asset type ID
   * @param softwareId - The software ID
   * @param softwareData - Updated software data
   * @returns Observable<any> - Updated software asset
   */
  updateSoftware(
    assetTypeId: string,
    softwareId: string,
    softwareData: any
  ): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const softwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/softwares/${softwareId}/`;
    console.log(
      '🔍 EquipmentService - Updating software asset:',
      softwareId,
      softwareData
    );
    console.log('🔍 EquipmentService - Software API URL:', softwareUrl);

    const headers = this.getHeaders();
    return this.http.put<any>(softwareUrl, softwareData, { headers });
  }

  /**
   * Partial update software asset
   * @param assetTypeId - The asset type ID
   * @param softwareId - The software ID
   * @param partialData - Partial software data to update
   * @returns Observable<any> - Updated software asset
   */
  patchSoftware(
    assetTypeId: string,
    softwareId: string,
    partialData: any
  ): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const softwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/softwares/${softwareId}/`;
    console.log(
      '🔍 EquipmentService - Patching software asset:',
      softwareId,
      partialData
    );
    console.log('🔍 EquipmentService - Software API URL:', softwareUrl);

    const headers = this.getHeaders();
    return this.http.patch<any>(softwareUrl, partialData, { headers });
  }

  /**
   * Delete software asset
   * @param assetTypeId - The asset type ID
   * @param softwareId - The software ID
   * @returns Observable<any> - Delete response
   */
  deleteSoftware(assetTypeId: string, softwareId: string): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    const softwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/softwares/${softwareId}/`;
    console.log('🔍 EquipmentService - Deleting software asset:', softwareId);
    console.log('🔍 EquipmentService - Software API URL:', softwareUrl);

    const headers = this.getHeaders();
    return this.http.delete<any>(softwareUrl, { headers });
  }

  // ============================================================================
  // TRANSITION HELPERS
  // ============================================================================

  /**
   * New method that returns real API data as Promise (for easy migration)
   * Use this to replace getProducts() calls gradually
   */

  /**
   * Add new hardware equipment - Enhanced version with validation
   * @param assetTypeId - The asset type ID for hardware
   * @param hardwareData - Hardware equipment data
   * @returns Observable<any> - Created hardware response
   */
  addHardwareEquipment(
    assetTypeId: string,
    hardwareData: HardwareEquipmentData
  ): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    // Validate that we're working with hardware asset type
    if (assetTypeId !== ASSET_TYPES.HARDWARE) {
      console.warn('⚠️ Warning: Asset type ID does not match hardware type');
    }

    const hardwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/hardwares/`;
    console.log('🔧 EquipmentService - Adding new hardware equipment');
    console.log('🔧 Hardware data being sent:', hardwareData);
    console.log('🔧 API URL:', hardwareUrl);

    // Prepare the data for API
    const apiData = {
      ...hardwareData,
      asset_type_id: assetTypeId,
      // Ensure dates are properly formatted
      date_acquired: hardwareData.date_acquired
        ? this.formatDate(hardwareData.date_acquired)
        : null,
    };

    const headers = this.getHeaders();
    console.log('🔧 Sending hardware creation request...');

    return this.http.post<any>(hardwareUrl, apiData, { headers });
  }

  /**
   * Add new software equipment - Enhanced version with validation
   * @param assetTypeId - The asset type ID for software
   * @param softwareData - Software equipment data
   * @returns Observable<any> - Created software response
   */
  addSoftwareEquipment(
    assetTypeId: string,
    softwareData: SoftwareEquipmentData
  ): Observable<any> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return of(null);
    }

    // Validate that we're working with software asset type
    if (assetTypeId !== ASSET_TYPES.SOFTWARE) {
      console.warn('⚠️ Warning: Asset type ID does not match software type');
    }

    const softwareUrl = `${environment.baseUrl}/assets/${assetTypeId}/softwares/`;
    console.log('💻 EquipmentService - Adding new software equipment');
    console.log('💻 Software data being sent:', softwareData);
    console.log('💻 API URL:', softwareUrl);

    // Prepare the data for API
    const apiData = {
      ...softwareData,
      asset_type_id: assetTypeId,
      // Ensure dates are properly formatted
      date_acquired: softwareData.date_acquired
        ? this.formatDate(softwareData.date_acquired)
        : null,
      license_expiry_date: softwareData.license_expiry_date
        ? this.formatDate(softwareData.license_expiry_date)
        : null,
    };

    const headers = this.getHeaders();
    console.log('💻 Sending software creation request...');

    return this.http.post<any>(softwareUrl, apiData, { headers });
  }

  /**
   * Helper method to format dates for API
   */
  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;

    if (typeof date === 'string') return date;

    // Format date as YYYY-MM-DD
    return date.toISOString().split('T')[0];
  }
}
