export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
  // Additional equipment fields
  brand?: string;
  model?: string;
  serialNumber?: string;
  dateAcquired?: string;
  laboratory?: string;
  assignedUser?: string;
}

export interface Equipment {
  equipment_id?: string;
  equipment_name: string;
  brand_name?: string;
  model_number?: string;
  serial_number?: string;
  unit_cost?: string;
  date_acquired?: string;
  laboratory?: string;
  user?: string;

  // Additional fields that might be in your API
  description?: string;
  status?: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_ORDER';
  campus_id?: string | number;
  created_by?: string | number;
  created_at?: string;
  updated_at?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  location?: string;

  // Legacy fields for backward compatibility
  id?: string | number;
  name?: string;
  category?: string;
  quantity?: number;
  price?: number;
  code?: string;
  image?: string;
  rating?: number;
  inventoryStatus?: string;
  manufacturer?: string;
}

// Equipment form interface for creating equipment
export interface EquipmentForm {
  equipment_name: string;
  brand_name: string;
  model_number: string;
  serial_number: string;
  date_acquired: string | null;
  unit_cost: number | null;
  laboratory_id: string | null;
}

// Laboratory interface for selector
export interface Laboratory {
  laboratory_id: string;
  laboratory_name: string;
  location: string;
  campus: string;
  campus_id?: string | number;
  room_no: string;
}
