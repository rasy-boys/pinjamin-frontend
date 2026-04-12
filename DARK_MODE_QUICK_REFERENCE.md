# Dark Mode Quick Reference

## Toggle Dark Mode in Your App

### Option 1: Create a Theme Toggle Component

```jsx
// components/ThemeToggle.jsx
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
    >
      {isDark ? (
        <i className="fas fa-sun"></i>
      ) : (
        <i className="fas fa-moon"></i>
      )}
    </button>
  );
}
```

### Option 2: Use in localStorage Only

```javascript
// JavaScript
localStorage.setItem("theme", "dark");
document.documentElement.classList.add("dark");

// Or remove
localStorage.removeItem("theme");
document.documentElement.classList.remove("dark");
```

## Common Class Patterns

### Text Colors

| Light | Dark |
|-------|------|
| `text-slate-900` | `text-slate-900 dark:text-white` |
| `text-slate-700` | `text-slate-700 dark:text-slate-200` |
| `text-slate-600` | `text-slate-600 dark:text-slate-400` |
| `text-slate-500` | `text-slate-500 dark:text-slate-500` |
| `text-gray-500` | `text-gray-500 dark:text-gray-400` |
| `text-green-600` | `text-green-600 dark:text-green-400` |
| `text-red-500` | `text-red-500 dark:text-red-400` |

### Background Colors

| Light | Dark |
|-------|------|
| `bg-white` | `bg-white dark:bg-slate-900` |
| `bg-slate-50` | `bg-slate-50 dark:bg-slate-800` |
| `bg-slate-100` | `bg-slate-100 dark:bg-slate-700` |
| `bg-gray-50` | `bg-gray-50 dark:bg-slate-800` |

### Borders

| Light | Dark |
|-------|------|
| `border-slate-100` | `border-slate-100 dark:border-slate-800` |
| `border-gray-100` | `border-gray-100 dark:border-slate-800` |
| `border-slate-200` | `border-slate-200 dark:border-slate-700` |

### Shadows

| Light | Dark |
|-------|------|
| `shadow-sm` | `shadow-sm dark:shadow-slate-900/50` |
| `shadow-md` | `shadow-md dark:shadow-slate-900/40` |
| `shadow-lg` | `shadow-lg dark:shadow-slate-900/50` |
| `shadow-2xl` | `shadow-2xl dark:shadow-slate-900/50` |

## Example Components

### Card Component

```jsx
export default function Card({ children, title }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-slate-900/40 border border-slate-100 dark:border-slate-800 p-6">
      {title && (
        <h3 className="text-slate-900 dark:text-white font-bold mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
```

### Button Component

```jsx
export default function Button({ children, variant = "primary" }) {
  const variants = {
    primary: "bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700",
    danger: "bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700",
  };

  return (
    <button className={`px-4 py-2 rounded-lg transition-colors ${variants[variant]}`}>
      {children}
    </button>
  );
}
```

### Input Component

```jsx
export default function Input({ placeholder, type = "text" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500"
    />
  );
}
```

### Table Component

```jsx
export default function Table({ headers, rows }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          {headers.map((header) => (
            <th
              key={header}
              className="px-4 py-3 text-left text-slate-600 dark:text-slate-400 font-semibold text-sm"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr
            key={idx}
            className={`border-b border-slate-100 dark:border-slate-800 ${
              idx % 2 === 0
                ? "bg-white dark:bg-slate-900"
                : "bg-slate-50 dark:bg-slate-800"
            }`}
          >
            {row.map((cell, cellIdx) => (
              <td
                key={cellIdx}
                className="px-4 py-3 text-slate-900 dark:text-slate-100 text-sm"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Modal Component

```jsx
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl dark:shadow-slate-900/50 max-w-md w-full mx-4">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 text-slate-900 dark:text-slate-100">
            {children}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
```

## Tips & Best Practices

1. **Always use pairs**: `bg-white dark:bg-slate-900` not just one
2. **Test both modes**: Check readability and contrast in both light and dark
3. **Use consistent shades**: Stick to the palette defined in your design
4. **Consider shadows**: Dark mode needs adjusted shadow opacity
5. **Hover states**: Always add `dark:hover-*` variants to interactive elements
6. **Text contrast**: Ensure text is readable with sufficient contrast ratio (WCAG AA minimum 4.5:1)

## Slate Color Scale Reference

```
slate-50    → #f8fafc (used for light backgrounds)
slate-100   → #f1f5f9
slate-200   → #e2e8f0
slate-300   → #cbd5e1
slate-400   → #94a3b8
slate-500   → #64748b
slate-600   → #475569
slate-700   → #334155
slate-800   → #1e293b (used for dark backgrounds)
slate-900   → #0f172a (used for darkest backgrounds)
slate-950   → #020617 (optional, very dark)
```

## Testing for Accessibility

```javascript
// Check contrast ratio in DevTools
// Element > Computed > filter (type "contrast")
// Should be at least 4.5:1 for AA compliance
```
