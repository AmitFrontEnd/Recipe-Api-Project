import { createContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setisDark] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("theme"));
    return saved ? saved : false;
  });

  return (
    <ThemeContext.Provider value={[isDark, setisDark]}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
