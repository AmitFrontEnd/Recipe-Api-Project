import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
import { Toaster } from "sonner";
import FavouriteRecipe from "./pages/FavouriteRecipe";
import App from "./App";
import AddedRecipe from "./pages/AddedRecipe";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { RecipeProvider } from "./contexts/Recipe";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/recipe/:id",
        element: <RecipeDetail />,
      },
      {
        path: "/addrecipe",
        element: (
          <ProtectedRoute>
            <AddRecipe />
          </ProtectedRoute>
        ),
      },
      {
        path: "/favouriterecipes",
        element: (
          <ProtectedRoute>
            <FavouriteRecipe />
          </ProtectedRoute>
        ),
      },
      {
        path: "/addedrecipes",
        element: (
          <ProtectedRoute>
            <AddedRecipe />
          </ProtectedRoute>
        ),
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RecipeProvider>
    <RouterProvider router={router} />
    <Toaster richColors position="top-center" />
  </RecipeProvider>,
);
