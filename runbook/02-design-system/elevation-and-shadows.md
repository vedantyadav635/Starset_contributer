# Elevation & Shadows

> Last Updated: 2026-09-14  
> Source: `client/index.css` lines 59–63 (light), 134–137 (dark)

## Shadow Tokens

### Light Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(18,20,23, 0.04)` | Subtle lift: inputs, small cards |
| `--shadow-sm` | `0 1px 2px rgba(18,20,23, 0.05), 0 1px 1px rgba(18,20,23, 0.03)` | Cards, dropdowns |
| `--shadow-md` | `0 2px 4px rgba(18,20,23, 0.04), 0 8px 20px -8px rgba(18,20,23, 0.10)` | Modals, floating panels |
| `--shadow-lg` | `0 4px 8px rgba(18,20,23, 0.04), 0 20px 44px -16px rgba(18,20,23, 0.14)` | Popovers, hero cards |

### Dark Theme

| Token | Value | Notes |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0, 0.4)` | Stronger opacity on dark |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0, 0.45)` | Compensates for less contrast |
| `--shadow-md` | `0 2px 4px rgba(0,0,0, 0.4), 0 8px 20px -8px rgba(0,0,0, 0.6)` | More pronounced depth |
| `--shadow-lg` | `0 4px 8px rgba(0,0,0, 0.4), 0 20px 44px -16px rgba(0,0,0, 0.7)` | Maximum elevation |

## Tailwind Mapping

```css
@theme inline {
  /* Shadows are NOT mapped to @theme — use var() directly */
}
```

Use via inline styles or custom classes:
```tsx
<div style={{ boxShadow: 'var(--shadow-md)' }} />
```

Or define utility classes in `index.css`:
```css
.elevation-sm { box-shadow: var(--shadow-sm); }
.elevation-md { box-shadow: var(--shadow-md); }
.elevation-lg { box-shadow: var(--shadow-lg); }
```

## Z-Index Stacking Order

| Layer | Z-Index | Elements |
|-------|---------|----------|
| **Base** | `0` | Page content, sections |
| **Raised** | `10` | Sticky elements, floating buttons |
| **Navigation** | `40` | Top navbar |
| **Sidebar** | `45` | App sidebar (authenticated) |
| **Dropdown** | `50` | Dropdown menus, popovers |
| **Modal Backdrop** | `90` | Modal overlay background |
| **Modal** | `100` | Modal dialog content |
| **Toast** | `110` | Toast notifications |
| **Cookie Banner** | `120` | Cookie consent (highest) |

## Design Rules

> 📌 **Shadows are warm**, not pure black. Light theme uses `rgba(18,20,23, ...)` matching `--ink`.

> 📌 **No glowing shadows.** Never use colored/neon shadows (e.g., `shadow-blue-500/50`).

> 📌 **Dark mode shadows are stronger** because dark surfaces have less natural contrast.

> 📌 **Use sparingly.** Most elements need no shadow. Elevation communicates interactive hierarchy.
