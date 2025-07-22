import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { toast } from "sonner";

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

  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const [localRecipes, setLocalRecipes] = useState([]);
  const [user, setUser] = useState(null);

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

  // Fetch recipes from Supabase
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) {
        setLocalRecipes([]);
        return;
      }
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id);
      if (error) {
        toast.error("Error fetching your recipes!");
        console.log("Fetch error:", error);
        return;
      }
      const formattedRecipes = data.map((recipe) => {
        const ingredientsObj = {};
        recipe.ingredients.split(",").forEach((ing, index) => {
          ingredientsObj[`strIngredient${index + 1}`] = ing.trim();
        });
        return {
          idMeal: recipe.id.toString(),
          strMeal: recipe.title,
          strArea: recipe.area,
          strCategory: recipe.category,
          strInstructions: recipe.instructions,
          strSource: recipe.source,
          strYoutube: recipe.youtube,
          strMealThumb: recipe.image,
          ...ingredientsObj,
        };
      });
      setLocalRecipes(formattedRecipes);
    };
    fetchRecipes();
  }, [user]);

  // Fetch favorites from Supabase
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavouriteRecipes([]);
        return;
      }
      const { data, error } = await supabase
        .from("favorites")
        .select("recipe_id")
        .eq("user_id", user.id);
      if (error) {
        toast.error("Error fetching your favorites!");
        console.log("Fetch favorites error:", error);
        return;
      }
      const favoriteIds = [];
      data.forEach((item) => {
        favoriteIds.push(item.recipe_id);
      });
      setFavouriteRecipes(favoriteIds);
    };
    fetchFavorites();
  }, [user]);

  const addFavourite = async (recipeId) => {
    if (!user) {
      toast.error("Please log in to add favorites!");
      return;
    }
    if (favouriteRecipes.includes(recipeId)) {
      return;
    }

    const { error } = await supabase
      .from("favorites")
      .insert([{ user_id: user.id, recipe_id: recipeId }]);
    if (error) {
      toast.error("Error adding favorite!");
      console.log("Add favorite error:", error);
      return;
    }

    setFavouriteRecipes((prev) => [...prev, recipeId]);
    toast.success("Added to favorites!");
  };

  const removeFavourite = async (recipeId) => {
    if (!user) {
      toast.error("Please log in to remove favorites!");
      return;
    }
    if (!favouriteRecipes.includes(recipeId)) {
      return;
    }

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("recipe_id", recipeId);
    if (error) {
      toast.error("Error removing favorite!");
      console.log("Remove favorite error:", error);
      return;
    }

    setFavouriteRecipes((prev) => prev.filter((elem) => elem !== recipeId));
    toast.error("Removed from favorites!");
  };

  const addRecipe = async (recipe) => {
    if (!user) {
      toast.error("Please log in to add a recipe!");
      return;
    }

    const newRecipe = {
      user_id: user.id,
      title: recipe.recipename,
      category: recipe.category,
      area: recipe.area,
      ingredients: recipe.ingredients.join(", "),
      instructions: recipe.instructions,
      source: recipe.source || "",
      youtube: recipe.youtube || "",
      image: recipe.image || "",
    };

    const { data, error } = await supabase
      .from("recipes")
      .insert([newRecipe])
      .select();
    if (error) {
      toast.error("Error adding recipe!");
      console.log("Add recipe error:", error);
      return;
    }

    const ingredientsObj = {};
    data[0].ingredients.split(",").forEach((ing, index) => {
      ingredientsObj[`strIngredient${index + 1}`] = ing.trim();
    });

    const formattedRecipe = {
      idMeal: data[0].id.toString(),
      strMeal: data[0].title,
      strArea: data[0].area,
      strCategory: data[0].category,
      strInstructions: data[0].instructions,
      strSource: data[0].source,
      strYoutube: data[0].youtube,
      strMealThumb: data[0].image,
      ...ingredientsObj,
    };

    setLocalRecipes((prev) => [...prev, formattedRecipe]);
    toast.success("🎉 Recipe added successfully!");
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
