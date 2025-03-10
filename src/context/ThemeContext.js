import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: {
      background: isDarkMode ? '#121212' : '#ffffff',
      text: isDarkMode ? '#ffffff' : '#121212',
      card: isDarkMode ? '#1e1e1e' : '#f5f5f5',
      primary: '#4a90e2',
      border: isDarkMode ? '#272727' : '#e6e6e6',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
