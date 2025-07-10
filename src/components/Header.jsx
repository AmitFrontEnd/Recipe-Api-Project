import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/recipelogo.png";
import { RiMenu3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { useContext, useEffect, useRef, useState } from "react";
import Filter from "./Filter";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import ThemeContext from "@/contexts/Theme";
import { motion } from "motion/react";

const navVariant = {
  show: {
    transition: { staggerChildren: 0.6 ,
      delayChildren: .2,
    },
  },
  hidden: {},
};

const linkVariant = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2, 
      ease: "easeOut",
    },
  },
};


const Header = ({ setQuery }) => {
  const [isDark, setisDark] = useContext(ThemeContext);
  const buttonRef = useRef(null);
  const navRef = useRef(null);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (evt) => {
      if (
        isOpenMenu &&
        navRef.current &&
        !navRef.current.contains(evt.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(evt.target)
      ) {
        setIsOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpenMenu]);

  return (
    <>
      <motion.div  animate={{y:0}} initial={{y:-96}} transition={{duration:.7}} className="sticky top-0 left-0 z-[999] scroll-mb-1.5 bg-white shadow-lg dark:bg-[oklch(0.129_0.042_264.695)]">
        <header className="elem-container relative flex flex-wrap items-center justify-between px-4 py-4">
          <div className="shrink-0">
            <Link to="/">
              {" "}
              <img
                src={logo}
                className="h-16 w-16 cursor-pointer rounded-full bg-gray-300 max-[610px]:h-10 max-[610px]:w-10"
                alt="logo"
              />
            </Link>
          </div>
          <motion.nav
            variants={navVariant}
            animate="show"
            initial="hidden"
            ref={navRef}
            className={`overflow-hidden transition-all duration-500 ease-in-out max-[610px]:absolute max-[610px]:top-full max-[610px]:right-0 max-[610px]:flex max-[610px]:w-full max-[610px]:max-w-[200px] max-[610px]:flex-col max-[610px]:rounded-bl-sm max-[610px]:bg-white max-[610px]:shadow-lg max-[610px]:dark:bg-[oklch(0.129_0.042_264.695)] ${
              isOpenMenu ? "max-h-[500px]" : "max-[610px]:max-h-0"
            } `}
          >
            <div className="space-x-4 pb-1 max-[610px]:space-y-4 max-[610px]:p-4">
              <motion.div variants={linkVariant} className="inline-block">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-2 py-1 text-sm font-medium transition-all duration-200 max-[610px]:block dark:text-[oklch(0.984_0.003_247.858)] ${
                      isActive
                        ? "text-gray-800 underline decoration-gray-800 decoration-2 underline-offset-8 dark:decoration-[oklch(0.984_0.003_247.858)]"
                        : "text-gray-600 hover:text-gray-800 hover:underline hover:decoration-gray-800 hover:decoration-2 hover:underline-offset-8 hover:dark:decoration-[oklch(0.984_0.003_247.858)]"
                    }`
                  }
                >
                  Home
                </NavLink>
              </motion.div>
              <motion.div variants={linkVariant} className="inline-block">
                <NavLink
                  to="/addrecipe"
                  className={({ isActive }) =>
                    `px-2 py-1 text-sm font-medium transition-all duration-200 max-[610px]:block dark:text-[oklch(0.984_0.003_247.858)] ${
                      isActive
                        ? "text-gray-800 underline decoration-gray-800 decoration-2 underline-offset-8 dark:decoration-[oklch(0.984_0.003_247.858)]"
                        : "text-gray-600 hover:text-gray-800 hover:underline hover:decoration-gray-800 hover:decoration-2 hover:underline-offset-8 hover:dark:decoration-[oklch(0.984_0.003_247.858)]"
                    }`
                  }
                >
                  Add Recipe
                </NavLink>
              </motion.div>

              <motion.div variants={linkVariant} className="inline-block">
                <NavLink
                  to="/favouriterecipes"
                  className={({ isActive }) =>
                    `px-2 py-1 text-sm font-medium transition-all duration-200 max-[610px]:block dark:text-[oklch(0.984_0.003_247.858)] ${
                      isActive
                        ? "text-gray-800 underline decoration-gray-800 decoration-2 underline-offset-8 dark:decoration-[oklch(0.984_0.003_247.858)]"
                        : "text-gray-600 hover:text-gray-800 hover:underline hover:decoration-gray-800 hover:decoration-2 hover:underline-offset-8 hover:dark:decoration-[oklch(0.984_0.003_247.858)]"
                    }`
                  }
                >
                  Favourite Recipe
                </NavLink>
              </motion.div>
              <motion.div variants={linkVariant} className="inline-block">
                <NavLink
                  to="/addedrecipes"
                  className={({ isActive }) =>
                    `px-2 py-1 text-sm font-medium transition-all duration-200 max-[610px]:block dark:text-[oklch(0.984_0.003_247.858)] ${
                      isActive
                        ? "text-gray-800 underline decoration-gray-800 decoration-2 underline-offset-8 dark:decoration-[oklch(0.984_0.003_247.858)]"
                        : "text-gray-600 hover:text-gray-800 hover:underline hover:decoration-gray-800 hover:decoration-2 hover:underline-offset-8 hover:dark:decoration-[oklch(0.984_0.003_247.858)]"
                    }`
                  }
                >
                  Added Recipe
                </NavLink>
              </motion.div>
            </div>
          </motion.nav>
          <button
            ref={buttonRef}
            className="hidden cursor-pointer items-center gap-4 max-[610px]:flex"
          >
            {isOpenMenu ? (
              <IoMdClose
                onClick={() => {
                  setIsOpenMenu(!isOpenMenu);
                }}
              />
            ) : (
              <RiMenu3Line
                onClick={() => {
                  setIsOpenMenu(!isOpenMenu);
                }}
              />
            )}
            {isDark ? (
              <MdOutlineLightMode
                size={18}
                onClick={() => {
                  setisDark(!isDark);
                }}
              />
            ) : (
              <MdOutlineDarkMode
                size={18}
                onClick={() => {
                  setisDark(!isDark);
                }}
              />
            )}
          </button>

          <button
            className="cursor-pointer max-[610px]:hidden"
            onClick={() => {
              setisDark(!isDark);
            }}
          >
            {!isDark ? (
              <MdOutlineLightMode
                className="cursor-pointer max-[610px]:hidden"
                size={24}
              />
            ) : (
              <MdOutlineDarkMode size={24} />
            )}
          </button>
        </header>
      </motion.div>
      {location.pathname === "/" && (
        <div className="elem-container my-8">
          <Filter setQuery={setQuery} />
        </div>
      )}
    </>
  );
};

export default Header;
