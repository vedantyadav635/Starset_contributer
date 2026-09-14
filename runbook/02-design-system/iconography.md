# Iconography

> Last Updated: 2026-09-14

## Icon Library

**Primary:** [Lucide React](https://lucide.dev/) v0.562.0

Lucide is a fork of Feather Icons with 1000+ icons, consistent 24×24 grid, tree-shakeable imports.

## Installation

Already in `package.json`:
```json
"lucide-react": "^0.562.0"
```

## Usage

```tsx
import { Mic, Camera, FileText, ChevronRight, X } from 'lucide-react';

// Standard icon
<Mic className="h-5 w-5 text-ink" />

// With muted color
<Camera className="h-4 w-4 text-muted" />

// Signal-colored (interactive)
<ChevronRight className="h-5 w-5 text-signal" />
```

## Icon Sizing Guide

| Context | Size Class | Pixels |
|---------|-----------|--------|
| Inline text | `h-4 w-4` | 16px |
| Buttons, nav items | `h-5 w-5` | 20px |
| Section headers | `h-6 w-6` | 24px |
| Feature cards | `h-8 w-8` | 32px |
| Hero/empty states | `h-12 w-12` | 48px |

## Commonly Used Icons

### Task Types
| Icon | Import | Usage |
|------|--------|-------|
| 🎙️ | `Mic` | Audio Collection |
| 📷 | `Camera` | Image Collection |
| 📝 | `FileText` | Text Annotation |
| 🏷️ | `Tag` | Image Labeling |
| 📊 | `BarChart3` | Evaluation/Survey |
| 🎵 | `Music` | Playlist |

### Navigation
| Icon | Import | Usage |
|------|--------|-------|
| 📊 | `LayoutDashboard` | Dashboard |
| 📋 | `ClipboardList` | Task List |
| 💰 | `Wallet` | Earnings |
| ⚙️ | `Settings` | Account |
| 📞 | `HelpCircle` | Support |

### Actions
| Icon | Import | Usage |
|------|--------|-------|
| ✅ | `Check` | Approve, success |
| ❌ | `X` | Close, reject, error |
| ➡️ | `ChevronRight` | Navigate forward |
| 🔄 | `RefreshCw` | Reload, retry |
| 📤 | `Upload` | Upload file |
| 📥 | `Download` | Download/export |

### Status
| Icon | Import | Usage |
|------|--------|-------|
| ⏳ | `Clock` | Pending, in progress |
| ✅ | `CheckCircle` | Completed, approved |
| ⚠️ | `AlertTriangle` | Warning |
| 🚫 | `XCircle` | Rejected, error |

## Rules

> 📌 **Always import named icons** — never the entire library.

> 📌 **Use `className` for sizing and color** — icons inherit text color by default.

> 📌 **Match icon color to text context**: `text-ink` for primary, `text-muted` for secondary, `text-signal` for interactive.

> 📌 **Add `aria-hidden="true"`** to decorative icons, `aria-label` to standalone interactive icons.
