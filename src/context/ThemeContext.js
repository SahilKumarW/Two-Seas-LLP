// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  // Candy Floss Evening Mode cycle
  const candyThemes = ["candy-green", "candy-lightgreen", "candy-blue", "candy-blend"];
  const nextCandyTheme = () => {
    const currentIndex = candyThemes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % candyThemes.length;
    const newTheme = candyThemes[nextIndex];
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, changeTheme, nextCandyTheme }}>
      <div className={`theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
