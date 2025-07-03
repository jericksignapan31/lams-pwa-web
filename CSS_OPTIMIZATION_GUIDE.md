# CSS Optimization Guide

## 🎨 Files that need optimization:

1. **equipment.component.scss** - 15.23 kB (needs reduction)
2. **schedules.component.scss** - 9.05 kB (needs reduction)  
3. **add-equipment.component.scss** - 6.52 kB (needs reduction)
4. **home.component.scss** - 6.17 kB (needs reduction)
5. **hardware-table.component.scss** - 5.79 kB (needs reduction)
6. **room-storage.component.scss** - 5.46 kB (needs reduction)

## 🔧 Optimization Techniques:

### 1. **Remove Unused Styles**
- Remove commented CSS
- Remove unused classes and IDs
- Remove redundant styles

### 2. **Combine Similar Styles**
```scss
// Before
.button-primary { color: #007bff; }
.button-secondary { color: #6c757d; }
.button-success { color: #28a745; }

// After
.button-primary, .button-secondary, .button-success {
  // common styles
}
.button-primary { color: #007bff; }
.button-secondary { color: #6c757d; }
.button-success { color: #28a745; }
```

### 3. **Use CSS Variables**
```scss
// Define variables once
:root {
  --primary-color: #007bff;
  --border-radius: 4px;
  --spacing: 1rem;
}

// Use throughout
.card {
  color: var(--primary-color);
  border-radius: var(--border-radius);
  padding: var(--spacing);
}
```

### 4. **Minimize Media Queries**
```scss
// Combine media queries
@media (max-width: 768px) {
  .container { padding: 1rem; }
  .card { margin: 0.5rem; }
  .button { font-size: 0.9rem; }
}
```

### 5. **Extract Common Styles**
Move common styles to `src/styles.scss`:
```scss
// Common button styles
.btn-base {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

// Common card styles
.card-base {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
}
```

## 🚀 Quick Optimization Script:

```bash
# Remove unused CSS (manual process)
# 1. Use browser DevTools to identify unused styles
# 2. Remove commented code
# 3. Combine similar selectors
# 4. Use shorter property names where possible

# Example optimizations:
# margin: 1rem 1rem 1rem 1rem; → margin: 1rem;
# background-color: #ffffff; → background: #fff;
# font-weight: 400; → font-weight: normal;
```

## 💡 Alternative Solution:
If optimization is too time-consuming, you can increase the budget limits in `angular.json`:

```json
{
  "type": "anyComponentStyle",
  "maximumWarning": "15kB",
  "maximumError": "25kB"
}
```
