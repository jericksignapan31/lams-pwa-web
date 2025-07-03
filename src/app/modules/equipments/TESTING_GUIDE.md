# Equipment Module Testing Guide

## Overview

This guide helps verify that the Hardware table displays data from the correct API endpoint when "Show Table" is clicked and "Hardware" is selected.

## Expected Flow

1. **Click "Show Table"** → Category selection modal appears
2. **Select "Hardware"** → Hardware table component is shown
3. **Hardware table calls** → `GET /api/assets/{asset_type_id}/hardwares/`
4. **Data is displayed** → Hardware equipment list is shown

## Testing Steps

### 1. Basic Flow Test

1. Open the Equipment Management page
2. Click the "Show Table" button
3. Select "Hardware" from the category modal
4. Verify the hardware table appears with data

### 2. API Endpoint Verification

Open browser console and check the following logs:

#### When page loads:

- `✅ Asset types loaded:` - Shows loaded asset types
- `🔧 Hardware Asset Type:` - Shows the hardware asset type object
- `🔧 Using Hardware Asset Type ID:` - Shows the actual ID being used

#### When "Show Table" is clicked:

- `🔍 Show Table button clicked - Loading equipment data...`
- `🔧 Fetching Hardware Equipment...`
- `🔧 Using Hardware Asset Type ID: [ID]`

#### When "Hardware" is selected:

- `🎯 Category selected: hardware`
- `🔧 Hardware Asset Type ID to be used: [ID]`
- `🔧 This will call API endpoint: GET /api/assets/[ID]/hardwares/`

#### In Hardware Table Component:

- `🔧 HardwareTableComponent - Loading hardware with asset type ID: [ID]`
- `✅ Hardware equipment loaded in table component:` - Shows the API response

### 3. Manual Debug Commands

Open browser console and run these commands:

```javascript
// Get reference to the equipment component
const equipmentComponent = angular.element(document.querySelector("app-equipment")).componentInstance;

// Check asset type setup
equipmentComponent.debugAssetTypes();

// Manually refresh equipment data
equipmentComponent.refreshEquipmentConsoleData();

// Get combined equipment data
equipmentComponent.getAllEquipmentDataAsPromise();
```

### 4. API Call Verification

Check the Network tab in browser DevTools for:

- **URL**: `GET /api/assets/{asset_type_id}/hardwares/`
- **Headers**: Contains `Authorization: Bearer [token]`
- **Response**: Array of hardware equipment objects

### 5. Debug Info on UI

The hardware table header shows:

- `Using Asset Type ID: [actual-id]` - This shows the exact ID being used

## Common Issues and Solutions

### Issue: Table shows no data

**Check:**

- Network tab for API call errors
- Console for error messages
- Asset type ID is not empty or 'undefined'

### Issue: Wrong API endpoint called

**Check:**

- The asset type ID being passed to the component
- Console logs showing the correct ID
- Network tab showing the correct URL

### Issue: Asset types not loading

**Check:**

- `/api/assets/` endpoint is working
- Authentication token is present
- Console shows fallback to mock data

## Expected API Structure

### Asset Types Response (`/api/assets/`)

```json
[
  {
    "asset_type_id": "hardware-uuid-123",
    "asset_type_name": "Hardware",
    "description": "Physical equipment and devices",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  {
    "asset_type_id": "software-uuid-456",
    "asset_type_name": "Software",
    "description": "Software applications and licenses",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
]
```

### Hardware Response (`/api/assets/{asset_type_id}/hardwares/`)

```json
[
  {
    "id": "hardware-item-uuid-123",
    "hardware_name": "Microscope",
    "brand_name": "Olympus",
    "model": "BX53",
    "serial_number": "SN123456",
    "unit_cost": 15000.0,
    "laboratory_name": "Biology Lab",
    "campus": "Main Campus",
    "date_acquired": "2023-01-15"
  }
]
```

## Success Criteria

✅ **Hardware table displays data from correct endpoint**
✅ **Asset type IDs are loaded dynamically from `/api/assets/`**
✅ **Correct API URL is called: `/api/assets/{asset_type_id}/hardwares/`**
✅ **Table shows hardware equipment data**
✅ **No hardcoded asset type IDs in production code**
✅ **Fallback to mock IDs works when API fails**
