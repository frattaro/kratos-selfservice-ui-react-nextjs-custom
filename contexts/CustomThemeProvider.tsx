import { useMediaQuery } from "@mui/material";
import { Theme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";

import { useIsomorphicLayoutEffect } from "../hooks";
import { themes } from "../utils";

interface ICustomThemeContext {
  themeName?: string;
  theme?: Theme;
  isDark?: boolean;
  setTheme?: (theme: string) => void;
}

export const CustomThemeContext = React.createContext<ICustomThemeContext>({});

const LS_KEY = "app-theme";

const themeDictionary: Record<string, string | null> = {
  light: "light",
  dark: "dark",
  system: "system"
};

const CustomThemeProvider: React.FC<{ children?: React.ReactNode }> = ({
  children
}) => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [currentTheme, setCurrentTheme] = useState("system");

  useIsomorphicLayoutEffect(() => {
    const theme = localStorage?.getItem(LS_KEY) || "system";
    const target = themeDictionary[theme] || "system";
    setCurrentTheme(target);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const targetTheme =
    currentTheme !== "system" ? currentTheme : prefersDark ? "dark" : "light";

  return (
    <CustomThemeContext.Provider
      value={{
        themeName: currentTheme,
        theme: themes[targetTheme as keyof typeof themes],
        isDark: currentTheme === "dark" || targetTheme === "dark",
        setTheme: (theme: string) => {
          const target = themeDictionary[theme] || "system";
          localStorage?.setItem(LS_KEY, target);
          setCurrentTheme(target);
        }
      }}
    >
      <ThemeProvider theme={themes[targetTheme as keyof typeof themes]}>
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

export default CustomThemeProvider;
