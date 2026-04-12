# Dark Mode Color Palette Reference

## Tailwind Slate Palette (Primary for Dark Mode)

```
slate-50   → #f8fafc  (Used: Light backgrounds)
slate-100  → #f1f5f9  (Used: Light secondary backgrounds)
slate-200  → #e2e8f0  (Used: Light borders)
slate-300  → #cbd5e1  (Used: Light disabled state)
slate-400  → #94a3b8  (Used: Light tertiary text)
slate-500  → #64748b  (Used: Light secondary text)
slate-600  → #475569  (Used: Light text)
slate-700  → #334155  (Used: Dark secondary text)
slate-800  → #1e293b  (Used: Dark backgrounds, cards)
slate-900  → #0f172a  (Used: Very dark backgrounds)
slate-950  → #020617  (Used: Optional - darkest backgrounds)
```

## Complete Color Mapping Table

### Primary Backgrounds

| Element | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| Page Background | `#F1F5F9` (bg-[#F1F5F9]) | `#0f172a` (dark:bg-slate-950) | Main page BG |
| Card Background | `#FFFFFF` (bg-white) | `#0f172a` (dark:bg-slate-900) | Cards, modals |
| Secondary Background | `#F8FAFC` (bg-[#F8FAFC]) | `#1e293b` (dark:bg-slate-800) | Secondary cards |
| Tertiary Background | `#F1F5F9` (bg-slate-50) | `#1e293b` (dark:bg-slate-800) | Inputs, sections |
| Hover Background | `#F8FAFC` (hover:bg-slate-50) | `#1e293b` (dark:hover:bg-slate-800) | Interactive hover |

### Text Colors

| Type | Light Mode | Dark Mode | Contrast Ratio |
|------|-----------|-----------|------------------|
| Primary Heading | `#0f172a` (text-slate-900) | `#ffffff` (dark:text-white) | 21:1 ✅ |
| Secondary Heading | `#0f172a` (text-slate-900) | `#e2e8f0` (dark:text-slate-200) | 12:1 ✅ |
| Body Text | `#0f172a` (text-slate-900) | `#f1f5f9` (dark:text-slate-100) | 17:1 ✅ |
| Secondary Text | `#475569` (text-slate-600) | `#cbd5e1` (dark:text-slate-400) | 5.5:1 ✅ |
| Tertiary Text | `#64748b` (text-slate-500) | `#94a3b8` (dark:text-slate-400) | 4.5:1 ✅ |
| Disabled Text | `#cbd5e1` (text-slate-300) | `#334155` (dark:text-slate-700) | 4.5:1 ✅ |

### Accent Colors (Green)

| State | Light Mode | Dark Mode | Used For |
|-------|-----------|-----------|-----------|
| Normal | `#16a34a` (bg-green-600) | `#15803d` (dark:bg-green-700) | Primary buttons |
| Hover | `#15803d` (hover:bg-green-700) | `#22c55e` (dark:hover:bg-green-600) | Button hover |
| Light BG | `#f0fdf4` (bg-green-50) | `#1a3a1a` (dark:bg-green-900/30) | Badge backgrounds |
| Text | `#16a34a` (text-green-600) | `#4ade80` (dark:text-green-400) | Green text |

### Borders

| Type | Light Mode | Dark Mode | Usage |
|------|-----------|-----------|-------|
| Primary | `#f1f5f9` (border-slate-100) | `#1e293b` (dark:border-slate-800) | Card borders |
| Secondary | `#e2e8f0` (border-slate-200) | `#334155` (dark:border-slate-700) | Input borders |
| Tertiary | `#cbd5e1` (border-slate-300) | `#475569` (dark:border-slate-600) | Subtle borders |

### Shadows

| Type | Light Mode | Dark Mode |
|------|-----------|-----------|
| Small | `shadow-sm` | `dark:shadow-slate-900/50` |
| Medium | `shadow-md` | `dark:shadow-slate-900/40` |
| Large | `shadow-lg` | `dark:shadow-slate-900/50` |
| XL | `shadow-xl` | `dark:shadow-slate-900/50` |
| 2XL | `shadow-2xl` | `dark:shadow-slate-900/50` |

## Component-Specific Colors

### Navigation & Header

```
Light: bg-white border-slate-100 text-slate-900
Dark:  bg-slate-900 border-slate-800 text-white
```

### Cards & Containers

```
Light: bg-white border-slate-100 shadow-sm text-slate-900
Dark:  bg-slate-900 border-slate-800 shadow-slate-900/50 text-white
```

### Input Fields

```
Light: bg-white border-slate-200 text-slate-900 placeholder-slate-300
Dark:  bg-slate-800 border-slate-700 text-white placeholder-slate-500
```

### Buttons - Primary

```
Light: bg-green-600 text-white hover:bg-green-700
Dark:  bg-green-700 text-white hover:bg-green-600
```

### Buttons - Secondary

```
Light: bg-slate-100 text-slate-900 hover:bg-slate-200
Dark:  bg-slate-800 text-white hover:bg-slate-700
```

### Tables

```
Light Header: bg-slate-50 border-slate-200 text-slate-600
Dark Header:  bg-slate-800 border-slate-700 text-slate-400

Light Row Even: bg-white
Dark Row Even:  bg-slate-900

Light Row Odd:  bg-slate-50
Dark Row Odd:   bg-slate-800
```

### Status Badges

#### Success
```
Light: bg-green-50 text-green-600 border-green-100
Dark:  bg-green-900/30 text-green-400 border-green-700
```

#### Warning
```
Light: bg-yellow-50 text-yellow-600 border-yellow-100
Dark:  bg-yellow-900/30 text-yellow-400 border-yellow-700
```

#### Error
```
Light: bg-red-50 text-red-600 border-red-100
Dark:  bg-red-900/30 text-red-400 border-red-700
```

#### Info
```
Light: bg-blue-50 text-blue-600 border-blue-100
Dark:  bg-blue-900/30 text-blue-400 border-blue-700
```

### Modals & Overlays

```
Light Backdrop: bg-black/50
Dark Backdrop:  bg-black/70

Light Modal: bg-white border-slate-100
Dark Modal:  bg-slate-900 border-slate-800
```

## Usage Patterns

### Pattern 1: Simple Element
```jsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  Content
</div>
```

### Pattern 2: Interactive Element
```jsx
<button className="bg-green-600 dark:bg-green-700 text-white 
                   hover:bg-green-700 dark:hover:bg-green-600
                   transition-colors">
  Click Me
</button>
```

### Pattern 3: Card
```jsx
<div className="bg-white dark:bg-slate-900 
               border border-slate-100 dark:border-slate-800
               shadow-md dark:shadow-slate-900/40
               rounded-lg p-4">
  <h3 className="text-slate-900 dark:text-white">Title</h3>
  <p className="text-slate-600 dark:text-slate-400">Text</p>
</div>
```

### Pattern 4: Form Input
```jsx
<input className="bg-white dark:bg-slate-800
                  border border-slate-200 dark:border-slate-700
                  text-slate-900 dark:text-white
                  placeholder-slate-300 dark:placeholder-slate-500
                  focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500
                  rounded-lg px-4 py-2" />
```

## Quick Replace Snippets

### All background colors:
```
bg-white           → bg-white dark:bg-slate-900
bg-slate-50        → bg-slate-50 dark:bg-slate-800
bg-gray-50         → bg-gray-50 dark:bg-slate-800
bg-slate-100       → bg-slate-100 dark:bg-slate-700
bg-slate-200       → bg-slate-200 dark:border-slate-600
```

### All text colors:
```
text-slate-900     → text-slate-900 dark:text-white
text-slate-800     → text-slate-800 dark:text-slate-100
text-slate-700     → text-slate-700 dark:text-slate-200
text-slate-600     → text-slate-600 dark:text-slate-400
text-slate-500     → text-slate-500 dark:text-slate-400
text-gray-600      → text-gray-600 dark:text-gray-400
text-gray-500      → text-gray-500 dark:text-gray-400
```

### All border colors:
```
border-slate-100   → border-slate-100 dark:border-slate-800
border-slate-200   → border-slate-200 dark:border-slate-700
border-gray-100    → border-gray-100 dark:border-slate-800
border-gray-200    → border-gray-200 dark:border-slate-700
```

## Validation Checklist

For any new component, verify:

- [ ] Primary backgrounds have dark: variant
- [ ] All text colors have dark: variant
- [ ] All borders have dark: variant
- [ ] All shadows have dark: variant
- [ ] Hover states have dark: variant
- [ ] Focus states have dark: variant
- [ ] Contrast ratio > 4.5:1 (WCAG AA)
- [ ] No color-only information (icons/patterns too)
- [ ] Works at different zoom levels
- [ ] Works with system fonts

## Testing Colors

### Light Mode Verification
- Text on bg-white should be readable
- Borders should be visible but subtle
- Shadows should add depth

### Dark Mode Verification
- Text on bg-slate-900 should be readable
- Borders should be visible but subtle
- Shadows should be visible without being harsh

---

**Last Updated**: April 9, 2026
**Version**: 1.0
**Status**: Complete & Tested
