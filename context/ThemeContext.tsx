import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemeContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isSystemTheme: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  isSystemTheme: true,
});

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const deviceTheme = useDeviceColorScheme() ?? 'light';
  const [theme, setTheme] = useState<'light' | 'dark'>(deviceTheme);
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    if (isSystemTheme) {
      setTheme(deviceTheme);
    }
  }, [deviceTheme, isSystemTheme]);

  const value = {
    theme,
    setTheme: (newTheme: 'light' | 'dark') => {
      setIsSystemTheme(false);
      setTheme(newTheme);
    },
    isSystemTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
