import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    const isDarkMode = currentTheme === "dark";
    setIsDark(isDarkMode);
    
    // Apply theme immediately
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prevState) => {
      const newIsDark = !prevState;
      
      if (newIsDark) {
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
      } else {
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
      }
      
      return newIsDark;
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-amber-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all shadow-sm"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <i className="fas fa-sun text-lg"></i>
      ) : (
        <i className="fas fa-moon text-lg"></i>
      )}
    </button>
  );
}
