import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/recipelogo.png";
import { RiMenu3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { useContext, useEffect, useRef, useState } from "react";
import Filter from "./Filter";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import ThemeContext from "@/contexts/Theme";
import { motion } from "motion/react";
import { supabase } from "../supabase";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "animate.css";

const navVariant = {
  show: {
    transition: { staggerChildren: 0.6, delayChildren: 0.2 },
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      setUser(data.session?.user || null);
    };
    checkUser();

    const { subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => subscription?.unsubscribe();
  }, []);
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully!");
      setUser(null);
      navigate("/auth");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <motion.div
        animate={{ y: 0 }}
        initial={{ y: -96 }}
        transition={{ duration: 0.7 }}
        className="sticky top-0 left-0 z-[999] scroll-mb-1.5 bg-white shadow-lg dark:bg-gray-900"
      >
        <header className="elem-container relative flex flex-wrap items-center justify-between px-4 py-4">
          {/* Logo */}
          <div className="shrink-0">
            <Link to="/">
              <img
                src={logo}
                className="h-16 w-16 cursor-pointer rounded-full bg-gray-200 max-[610px]:h-10 max-[610px]:w-10 dark:bg-gray-700"
                alt="logo"
              />
            </Link>
          </div>

          {/* Navigation */}
          <motion.nav
            variants={navVariant}
            initial="hidden"
            animate="show"
            ref={navRef}
            className={`overflow-hidden transition-all duration-500 ease-in-out max-[610px]:absolute max-[610px]:top-full max-[610px]:right-0 max-[610px]:flex max-[610px]:w-full max-[610px]:max-w-[200px] max-[610px]:flex-col max-[610px]:rounded-bl-sm max-[610px]:bg-white max-[610px]:shadow-lg dark:max-[610px]:bg-gray-900 ${
              isOpenMenu ? "max-h-[500px]" : "max-[610px]:max-h-0"
            }`}
          >
            <div className="space-x-4 pb-1 max-[610px]:space-y-4 max-[610px]:p-4">
              <motion.div variants={linkVariant} className="inline-block">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-2 py-1 text-sm font-medium transition-all duration-200 max-[610px]:block ${
                      isActive
                        ? "text-gray-900 underline decoration-gray-800 decoration-2 underline-offset-8 dark:text-white dark:decoration-white"
                        : "text-gray-500 decoration-2 underline-offset-8 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
                    }`
                  }
                >
                  Home
                </NavLink>
              </motion.div>

              <motion.div variants={linkVariant} className="inline-block">
                {user && (
                  <NavLink
                    to="/addrecipe"
                    className={({ isActive }) =>
                      `px-2 py-1 text-sm font-medium transition-all duration-200 max-[610px]:block ${
                        isActive
                          ? "text-gray-900 underline decoration-gray-800 decoration-2 underline-offset-8 dark:text-white dark:decoration-white"
                          : "text-gray-500 decoration-2 underline-offset-8 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
                      }`
                    }
                  >
                    Add Recipe
                  </NavLink>
                )}
              </motion.div>

              <motion.div variants={linkVariant} className="inline-block">
                {user && (
                  <NavLink
                    to="/favouriterecipes"
                    className={({ isActive }) =>
                      `px-2 py-1 text-sm font-medium transition-all duration-200 max-[610px]:block ${
                        isActive
                          ? "text-gray-900 underline decoration-gray-800 decoration-2 underline-offset-8 dark:text-white dark:decoration-white"
                          : "text-gray-500 decoration-2 underline-offset-8 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
                      }`
                    }
                  >
                    Favourite Recipe
                  </NavLink>
                )}
              </motion.div>

              <motion.div variants={linkVariant} className="inline-block">
                {user && (
                  <NavLink
                    to="/addedrecipes"
                    className={({ isActive }) =>
                      `px-2 py-1 text-sm font-medium transition-all duration-200 max-[610px]:block ${
                        isActive
                          ? "text-gray-900 underline decoration-gray-800 decoration-2 underline-offset-8 dark:text-white dark:decoration-white"
                          : "text-gray-500 decoration-2 underline-offset-8 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
                      }`
                    }
                  >
                    Added Recipe
                  </NavLink>
                )}
              </motion.div>
            </div>
          </motion.nav>

          {/* Mobile Menu + Theme Toggle */}
          <button
            ref={buttonRef}
            className="hidden cursor-pointer items-center gap-4 max-[610px]:flex"
          >
            {isOpenMenu ? (
              <IoMdClose onClick={() => setIsOpenMenu(!isOpenMenu)} />
            ) : (
              <RiMenu3Line onClick={() => setIsOpenMenu(!isOpenMenu)} />
            )}
            {isDark ? (
              <MdOutlineLightMode
                size={18}
                onClick={() => setisDark(!isDark)}
              />
            ) : (
              <MdOutlineDarkMode size={18} onClick={() => setisDark(!isDark)} />
            )}
          </button>

          {/* Desktop Theme Toggle */}
          <button
            className="cursor-pointer max-[610px]:hidden"
            onClick={() => setisDark(!isDark)}
          >
            {!isDark ? (
              <MdOutlineLightMode size={24} />
            ) : (
              <MdOutlineDarkMode size={24} />
            )}
          </button>
        </header>
      </motion.div>

      {location.pathname !== "/auth" &&
        location.pathname !== "/forgot-password" &&
        location.pathname !== "/reset-password" && (
          <section className="elem-container my-8 flex w-full justify-between">
            {location.pathname === "/" && <Filter setQuery={setQuery} />}

            {user ? (
              <Button
                className="ml-auto cursor-pointer border bg-gray-100 text-black transition hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            ) : (
              location.pathname === "/" && (
                <Button
                  className="animate__animated animate__heartBeat animate__slow animate__infinite ml-auto cursor-pointer border bg-gray-100 text-black transition hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              )
            )}
          </section>
        )}
    </>
  );
};

export default Header;
