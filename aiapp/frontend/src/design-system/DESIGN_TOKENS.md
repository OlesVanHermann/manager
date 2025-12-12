# DESIGN SYSTEM - OLD MANAGER
# Basé sur la charte OVHcloud classique
# Primary: #0050D7 (Science Blue)

---

## SOURCES

- Package UI : `@ovh-ux/muk` (Manager UI Kit)
- Design System : `@ovhcloud/ods-react` v19.2.1
- Themes : `@ovhcloud/ods-themes` v19.2.1
- CSS Framework : Tailwind CSS avec `@ovh-ux/manager-tailwind-config`

---

## COULEURS

### Couleurs principales (OVH Classic Blue)
```
--color-primary-000: #F0F5FF
--color-primary-100: #D6E4FF
--color-primary-200: #ADC6FF
--color-primary-300: #85A5FF
--color-primary-400: #597EF7
--color-primary-500: #0050D7   /* PRIMARY - Bleu OVH Classic */
--color-primary-600: #003DA8
--color-primary-700: #002B7A
--color-primary-800: #122844   /* Blue Zodiac */
--color-primary-900: #0A1929
```

### Couleurs sémantiques
```
SUCCESS:
--color-success-100: #D4EDDA
--color-success-500: #28A745
--color-success-700: #1E7E34

WARNING:
--color-warning-100: #FFF3CD
--color-warning-500: #FFC107
--color-warning-700: #D39E00

ERROR / CRITICAL:
--color-critical-100: #F8D7DA
--color-critical-500: #DC3545
--color-critical-700: #BD2130

INFO:
--color-info-100: #D1ECF1
--color-info-500: #17A2B8
--color-info-700: #117A8B
```

### Couleurs neutres
```
--color-neutral-000: #FFFFFF
--color-neutral-050: #F8F9FA
--color-neutral-100: #E9ECEF
--color-neutral-200: #DEE2E6
--color-neutral-300: #CED4DA
--color-neutral-400: #ADB5BD
--color-neutral-500: #6C757D
--color-neutral-600: #495057
--color-neutral-700: #343A40
--color-neutral-800: #212529
--color-neutral-900: #000000
```

### Couleurs de texte
```
--color-text: #212529
--color-text-muted: #6C757D
--color-text-light: #ADB5BD
--color-text-inverse: #FFFFFF
```

### Couleurs de bordure
```
--color-border: #DEE2E6
--color-border-hover: #ADB5BD
--color-border-focus: #0050D7
--color-border-error: #DC3545
```

---

## TYPOGRAPHY

### Font Family
```
--font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
--font-family-mono: "Source Code Pro", SFMono-Regular, Menlo, Monaco, monospace
```

### Font Sizes
```
--font-size-2xs: 0.625rem    /* 10px */
--font-size-xs: 0.75rem      /* 12px */
--font-size-sm: 0.875rem     /* 14px */
--font-size-md: 1rem         /* 16px - défaut */
--font-size-lg: 1.125rem     /* 18px */
--font-size-xl: 1.25rem      /* 20px - H4 */
--font-size-2xl: 1.5rem      /* 24px - H3 */
--font-size-3xl: 1.875rem    /* 30px - H2 */
--font-size-4xl: 2.25rem     /* 36px - H1 */
```

### Font Weights
```
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

---

## SPACING (basé sur 4px)
```
--space-0: 0
--space-1: 0.25rem     /* 4px */
--space-2: 0.5rem      /* 8px */
--space-3: 0.75rem     /* 12px */
--space-4: 1rem        /* 16px */
--space-5: 1.25rem     /* 20px */
--space-6: 1.5rem      /* 24px */
--space-8: 2rem        /* 32px */
--space-10: 2.5rem     /* 40px */
--space-12: 3rem       /* 48px */
--space-16: 4rem       /* 64px */
```

---

## BORDERS

### Border Radius
```
--border-radius-sm: 0.125rem   /* 2px */
--border-radius-md: 0.25rem    /* 4px - défaut */
--border-radius-lg: 0.5rem     /* 8px */
--border-radius-xl: 1rem       /* 16px */
--border-radius-full: 9999px   /* cercle */
```

---

## SHADOWS
```
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

---

## BREAKPOINTS
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## Z-INDEX
```
--z-dropdown: 1000
--z-sticky: 1020
--z-fixed: 1030
--z-modal-backdrop: 1040
--z-modal: 1050
--z-popover: 1060
--z-tooltip: 1070
```

---

## TRANSITIONS
```
--transition-fast: 150ms
--transition-normal: 300ms
--transition-slow: 500ms
--transition-timing: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## USAGE

Dans les fichiers CSS, utiliser les variables sans fallback :
```css
/* Correct */
color: var(--color-primary-500);
background: var(--color-neutral-050);

/* Incorrect - ne pas mettre de fallback */
color: var(--color-primary-500, #0050D7);
```

Dans les fichiers TypeScript, importer depuis tokens :
```typescript
import { colors } from '@/design-system/tokens';
const primaryColor = colors.primary['500']; // #0050D7
```
