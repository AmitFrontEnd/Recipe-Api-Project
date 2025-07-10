import FavouriteRecipe from "@/pages/FavouriteRecipe";
import { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const cuisines = [
    "American",
    "British",
    "Canadian",
    "Chinese",
    "Croatian",
    "Dutch",
    "Egyptian",
    "Filipino",
    "French",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Jamaican",
    "Japanese",
    "Kenyan",
    "Malaysian",
    "Mexican",
    "Moroccan",
    "Polish",
    "Portuguese",
    "Russian",
    "Spanish",
    "Thai",
    "Tunisian",
    "Turkish",
    "Vietnamese",
  ];

  const [favouriteRecipes, setFavouriteRecipes] = useState(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });
  const [localRecipes, setLocalRecipes] = useState(() => {
    const saved = localStorage.getItem("localRecipes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("localRecipes", JSON.stringify(localRecipes));
  }, [localRecipes]);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favouriteRecipes));
  }, [favouriteRecipes]);

  const addFavourite = (recipeId) => {
    if (!favouriteRecipes.includes(recipeId)) {
      setFavouriteRecipes((prev) => [...prev, recipeId]);
    }
  };

  const removeFavourite = (recipeId) => {
    if (favouriteRecipes.includes(recipeId)) {
      setFavouriteRecipes((prev) => prev.filter((elem) => elem != recipeId));
    }
  };

  const addRecipe = (recipe) => {
    const id = `local_${uuidv4().split("-")[0]}`;
    
    const ingredientsObj = {};

    recipe.ingredients.forEach((ing, index) => {
      ingredientsObj[`strIngredient${index + 1}`] = ing;
    });

    const formatedRecipe = {
      idMeal: id,
      strMeal: recipe.recipename,
      strArea: recipe.area,
      strCategory: recipe.category,
      strInstructions: recipe.instructions,
      strSource: recipe.source,
      strYoutube: recipe.youtube,
      ...ingredientsObj,
      strMealThumb: recipe.image,
    };

    setLocalRecipes((prev) => [...prev, formatedRecipe]);
  };

  return (
    <RecipeContext.Provider
      value={{
        localRecipes,
        addRecipe,
        cuisines,
        favouriteRecipes,
        addFavourite,
        removeFavourite,
        setLocalRecipes,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContext;
