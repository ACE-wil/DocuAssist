import React, { createContext, useContext, useState, ReactNode } from "react";
import { lightTheme, darkTheme } from "../styles/themes";

interface ThemeContextType {
  theme: typeof lightTheme | typeof darkTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const defaultContextValue: ThemeContextType = {
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const setTheme = (theme: "light" | "dark") => {
    setIsDark(theme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
