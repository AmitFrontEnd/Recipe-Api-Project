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
        element: <AddRecipe />,
      },
      {
        path: "/favouriterecipes",
        element: <FavouriteRecipe />,
      },
      {
        path: "/addedrecipes",
        element: <AddedRecipe />,
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
