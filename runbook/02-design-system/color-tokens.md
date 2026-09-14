# Color Tokens

> Last Updated: 2026-09-14  
> Source: `client/index.css` lines 17–138

## Light Theme (`:root`)

### Neutrals (Warm)

| Token | Hex | Swatch | Usage |
|-------|-----|--------|-------|
| `--paper` | `#fbfaf8` | ![#fbfaf8](https://via.placeholder.com/16/fbfaf8/fbfaf8) | Page background |
| `--paper-sunk` | `#f4f2ee` | ![#f4f2ee](https://via.placeholder.com/16/f4f2ee/f4f2ee) | Recessed sections, alternating bands |
| `--surface` | `#ffffff` | ![#ffffff](https://via.placeholder.com/16/ffffff/ffffff) | Cards, panels, modals |
| `--surface-raised` | `#ffffff` | ![#ffffff](https://via.placeholder.com/16/ffffff/ffffff) | Elevated surfaces (same in light) |
| `--surface-inverse` | `#121417` | ![#121417](https://via.placeholder.com/16/121417/121417) | Dark sections on light pages |

### Ink (Text)

| Token | Hex | Swatch | Usage |
|-------|-----|--------|-------|
| `--ink` | `#121417` | ![#121417](https://via.placeholder.com/16/121417/121417) | Headings, primary text |
| `--ink-body` | `#4b5158` | ![#4b5158](https://via.placeholder.com/16/4b5158/4b5158) | Body copy, paragraphs |
| `--ink-muted` | `#8b9198` | ![#8b9198](https://via.placeholder.com/16/8b9198/8b9198) | Metadata, captions, timestamps |
| `--ink-faint` | `#b4b8bd` | ![#b4b8bd](https://via.placeholder.com/16/b4b8bd/b4b8bd) | Disabled text, placeholders |
| `--ink-on-inverse` | `#f5f4f1` | ![#f5f4f1](https://via.placeholder.com/16/f5f4f1/f5f4f1) | Text on `--surface-inverse` |

### Lines (Borders)

| Token | Hex | Swatch | Usage |
|-------|-----|--------|-------|
| `--line` | `#e6e3dd` | ![#e6e3dd](https://via.placeholder.com/16/e6e3dd/e6e3dd) | Default borders, dividers |
| `--line-strong` | `#d5d1c9` | ![#d5d1c9](https://via.placeholder.com/16/d5d1c9/d5d1c9) | Emphasized borders |
| `--line-faint` | `#efece7` | ![#efece7](https://via.placeholder.com/16/efece7/efece7) | Subtle separators |

### Signal (Accent)

| Token | Hex | Swatch | Usage |
|-------|-----|--------|-------|
| `--signal` | `#2b4acb` | ![#2b4acb](https://via.placeholder.com/16/2b4acb/2b4acb) | Primary action, links, focus rings |
| `--signal-hover` | `#223ca9` | ![#223ca9](https://via.placeholder.com/16/223ca9/223ca9) | Hovered interactive elements |
| `--signal-soft` | `#eef1fd` | ![#eef1fd](https://via.placeholder.com/16/eef1fd/eef1fd) | Signal background tint |
| `--signal-line` | `#c9d2f5` | ![#c9d2f5](https://via.placeholder.com/16/c9d2f5/c9d2f5) | Signal-colored borders |
| `--signal-ink` | `#1c327f` | ![#1c327f](https://via.placeholder.com/16/1c327f/1c327f) | Text on signal backgrounds |

### Data Visualization

| Token | Hex | Swatch | Usage |
|-------|-----|--------|-------|
| `--wave-1` | `#2b4acb` | ![#2b4acb](https://via.placeholder.com/16/2b4acb/2b4acb) | Primary waveform / chart color |
| `--wave-2` | `#4a6ee0` | ![#4a6ee0](https://via.placeholder.com/16/4a6ee0/4a6ee0) | Secondary chart color |
| `--wave-3` | `#0e9594` | ![#0e9594](https://via.placeholder.com/16/0e9594/0e9594) | Tertiary / contrast color |

### Status

| Token | Hex | Swatch | Usage |
|-------|-----|--------|-------|
| `--ok` | `#16794f` | ![#16794f](https://via.placeholder.com/16/16794f/16794f) | Success text/icons |
| `--ok-soft` | `#e8f4ee` | ![#e8f4ee](https://via.placeholder.com/16/e8f4ee/e8f4ee) | Success background |
| `--warn` | `#9a6407` | ![#9a6407](https://via.placeholder.com/16/9a6407/9a6407) | Warning text/icons |
| `--warn-soft` | `#fdf3e2` | ![#fdf3e2](https://via.placeholder.com/16/fdf3e2/fdf3e2) | Warning background |
| `--danger` | `#b3261e` | ![#b3261e](https://via.placeholder.com/16/b3261e/b3261e) | Error/danger text/icons |
| `--danger-soft` | `#fdedec` | ![#fdedec](https://via.placeholder.com/16/fdedec/fdedec) | Error/danger background |

---

## Dark Theme (`html.dark`)

### Neutrals

| Token | Light | Dark | Notes |
|-------|-------|------|-------|
| `--paper` | `#fbfaf8` | `#0b0c0e` | Inverted ground |
| `--paper-sunk` | `#f4f2ee` | `#101215` | Slightly lighter than paper |
| `--surface` | `#ffffff` | `#131518` | Cards darker than page |
| `--surface-raised` | `#ffffff` | `#191c20` | Elevated surfaces lighter |
| `--surface-inverse` | `#121417` | `#f7f6f3` | Light on dark pages |

### Ink

| Token | Light | Dark |
|-------|-------|------|
| `--ink` | `#121417` | `#f5f4f1` |
| `--ink-body` | `#4b5158` | `#a9aeb4` |
| `--ink-muted` | `#8b9198` | `#7c8288` |
| `--ink-faint` | `#b4b8bd` | `#575c62` |
| `--ink-on-inverse` | `#f5f4f1` | `#121417` |

### Lines

| Token | Light | Dark |
|-------|-------|------|
| `--line` | `#e6e3dd` | `#23262b` |
| `--line-strong` | `#d5d1c9` | `#31353b` |
| `--line-faint` | `#efece7` | `#1a1d21` |

### Signal (Dark Adjusted)

| Token | Light | Dark | Notes |
|-------|-------|------|-------|
| `--signal` | `#2b4acb` | `#7b93f5` | Lighter for dark backgrounds |
| `--signal-hover` | `#223ca9` | `#94a8f8` | Even lighter on hover |
| `--signal-soft` | `#eef1fd` | `#171b2e` | Dark tint instead of light |
| `--signal-line` | `#c9d2f5` | `#2c3560` | Muted border |
| `--signal-ink` | `#1c327f` | `#b3c1fa` | Light text on dark signal bg |

### Status (Dark Adjusted)

| Token | Light | Dark |
|-------|-------|------|
| `--ok` | `#16794f` | `#56c08c` |
| `--ok-soft` | `#e8f4ee` | `#12241c` |
| `--warn` | `#9a6407` | `#e0aa4f` |
| `--warn-soft` | `#fdf3e2` | `#241d0f` |
| `--danger` | `#b3261e` | `#f2867f` |
| `--danger-soft` | `#fdedec` | `#261414` |

---

## Usage Rules

> 📌 **Never use raw hex values** in components. Always reference CSS variables.

```tsx
// ✅ Correct
<div className="bg-paper text-ink border-line" />
<div style={{ color: 'var(--signal)' }} />

// ❌ Wrong
<div className="bg-white text-gray-900" />
<div style={{ color: '#2b4acb' }} />
```

> 📌 **Tailwind utility mapping** (via `@theme inline`):

| CSS Variable | Tailwind Class |
|-------------|---------------|
| `--paper` | `bg-paper` |
| `--ink` | `text-ink` |
| `--signal` | `bg-signal`, `text-signal`, `border-signal` |
| `--line` | `border-line` |
| `--ok` | `text-ok`, `bg-ok` |
