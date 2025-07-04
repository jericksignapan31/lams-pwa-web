# Multiple Hardware Asset Types for Software Equipment

## 🎯 Feature Summary

Added multiple selector for hardware asset types when adding software equipment. Users can now select multiple compatible hardware types for each software.

## 🔧 Technical Implementation

### 1. **Backend Endpoint Used**

```typescript
getHardwareAssetTypes(): Observable<HardwareAssetType[]>
// Endpoint: /api/assets/hardware-asset-types/
```

### 2. **Data Structure**

```json
{
  "hardware_asset_type_id": "cac2c001-d72d-48e4-aae2-fdaa88748b11",
  "type_name": "Desktop Computer"
}
```

### 3. **Frontend Changes**

#### **SoftwareEquipmentData Interface (equipment.service.ts)**

```typescript
export interface SoftwareEquipmentData {
  // ...existing fields...
  hardware_asset_types?: string[]; // Multiple hardware asset type IDs
}
```

#### **SoftwareForm Interface (add-equipment.component.ts)**

```typescript
interface SoftwareForm {
  // ...existing fields...
  hardware_asset_types: string[]; // Multiple selection, required
}
```

#### **Form Initialization**

```typescript
this.softwareForm = this.fb.group({
  // ...existing fields...
  hardware_asset_types: [[], Validators.required], // Required multiple selection
});
```

#### **Data Mapping**

```typescript
private createSoftwareData(formValue: any): SoftwareEquipmentData {
  return {
    // ...existing fields...
    hardware_asset_types: formValue.hardware_asset_types || [], // Array of IDs
  };
}
```

## 🎨 UI Components

### **MultiSelect Field**

```html
<p-multiSelect formControlName="hardware_asset_types" [options]="hardwareTypes" optionLabel="type_name" optionValue="hardware_asset_type_id" placeholder="Select compatible hardware types" [loading]="loadingHardwareTypes" [showToggleAll]="true" [filter]="true" filterBy="type_name" [maxSelectedLabels]="2" selectedItemsLabel="{0} hardware types selected"></p-multiSelect>
```

### **Custom Template for Items**

```html
<ng-template pTemplate="item" let-hardwareType>
  <div class="hardware-type-item">
    <i [class]="hardwareType.icon || 'pi pi-box'"></i>
    <span>{{ hardwareType.type_name }}</span>
  </div>
</ng-template>
```

## 🎨 UI Features

### **Display Features**

- ✅ Shows `type_name` (e.g., "Desktop Computer", "Laptop")
- ✅ Icons for each hardware type
- ✅ Search/filter functionality
- ✅ Toggle All option
- ✅ Shows selected count when multiple items selected
- ✅ Loading state support

### **Selection Features**

- ✅ Multiple selection (user can select multiple hardware types)
- ✅ Required field validation
- ✅ Sends `hardware_asset_type_id` to backend
- ✅ Shows up to 2 labels, then shows count

## 📋 Available Hardware Types

Based on the endpoint data:

1. **Desktop Computer** (`cac2c001-d72d-48e4-aae2-fdaa88748b11`)
2. **Keyboard** (`fac657f3-3868-4b7d-9aa4-0873b2eb7f23`)
3. **Laptop** (`cf696d7c-abc7-485d-90f3-3cb04396122d`)
4. **Monitor** (`7fa4c74f-bfcd-4b21-9c39-9a2ff36c94ec`)
5. **Mouse** (`b4091eb0-ae9f-426f-8a08-fd9d0a0829ff`)
6. **Printer** (`88db6bdc-9799-43fe-b1bf-09235de90664`)

## 💾 Data Flow

### **Frontend to Backend**

```json
{
  "software_name": "Microsoft Office",
  "version": "2023",
  "vendor": "Microsoft",
  "hardware_asset_types": [
    "cac2c001-d72d-48e4-aae2-fdaa88748b11", // Desktop Computer
    "cf696d7c-abc7-485d-90f3-3cb04396122d" // Laptop
  ]
  // ...other fields
}
```

### **User Experience**

1. User selects "Software" asset type
2. Software form loads with hardware types selector
3. User can search and select multiple hardware types
4. Form shows selected hardware types with icons
5. Backend receives array of hardware asset type IDs

## 🎨 Styling

### **Hardware Type Items**

- Icons with primary color
- Proper spacing and alignment
- Hover effects

### **MultiSelect Tokens**

- Primary color background
- Rounded corners
- Compact design

### **Responsive Design**

- Works on mobile and desktop
- Proper spacing in form layout

## 🔍 Testing

### **Form Validation**

- Field is required (cannot submit without selection)
- Accepts multiple selections
- Shows validation errors properly

### **API Integration**

- Loads hardware types from `/api/assets/hardware-asset-types/`
- Sends selected IDs to software creation endpoint
- Handles loading states and errors

## 💡 Usage Example

**Scenario**: Adding Microsoft Office software

1. Select "Software" asset type
2. Fill in software details (name, version, vendor, etc.)
3. In "Compatible Hardware" field, search and select:
   - Desktop Computer
   - Laptop
4. Select laboratory
5. Submit form

**Result**: Software is created with compatibility for both Desktop Computer and Laptop hardware types.

---

**Status**: ✅ **Implemented and Ready for Testing**
**Files Modified**:

- `equipment.service.ts` (interface update)
- `add-equipment.component.ts` (form and logic)
- `add-equipment.component.html` (UI template)
- `add-equipment.component.scss` (styling)
