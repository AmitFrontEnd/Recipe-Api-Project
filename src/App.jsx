import React, { useState } from "react";
import Header from "./components/Header";
import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/Theme";
import { AnimatePresence, motion } from "motion/react";

const pageVariants = {
  initial: {
    x: "10vw",
  },
  animate: {
    x: 0,
  },
  exit: { x: "-10vw" },
};

export const App = () => {
  const location = useLocation();
  const [query, setQuery] = useState("Indian");

  return (
    <ThemeProvider>
      <Header query={query} setQuery={setQuery} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          variants={pageVariants}
          animate="animate"
          initial="initial"
        >
          <Outlet context={[query, setQuery]} />
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default App;
