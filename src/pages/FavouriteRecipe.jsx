import React, { useContext, useEffect, useState } from "react";
import RecipeContext from "@/contexts/Recipe";
import RecipeCard from "@/components/RecipeCard";
import CardShimmer from "@/components/CardShimmer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import axios from "axios";

const FavouriteRecipe = () => {
  const { localRecipes, favouriteRecipes } = useContext(RecipeContext);
  const [allFavouriteData, setAllFavouriteData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      setIsLoading(true);
      const localIds = [];
      localRecipes.forEach((recipe) => {
        localIds.push(recipe.idMeal);
      });

      const apiIds = [];
      favouriteRecipes.forEach((id) => {
        if (!localIds.includes(id)) {
          apiIds.push(id);
        }
      });

      const localFavourites = [];
      localRecipes.forEach((recipe) => {
        if (favouriteRecipes.includes(recipe.idMeal)) {
          localFavourites.push(recipe);
        }
      });

      const apiFavourites = [];
      for (const id of apiIds) {
        try {
          const response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
          );
          const recipe = response?.data?.meals?.[0];
          if (recipe) {
            apiFavourites.push(recipe);
          }
        } catch (err) {
          console.log(`Error fetching API recipe ${id}:`, err);
        }
      }

      const combinedFavourites = [];
      localFavourites.forEach((recipe) => {
        combinedFavourites.push(recipe);
      });
      apiFavourites.forEach((recipe) => {
        combinedFavourites.push(recipe);
      });

      setAllFavouriteData(combinedFavourites);
      setIsLoading(false);
    };

    fetchFavourites();
  }, []);

  if (isLoading) {
    return (
      <div className="elem-container grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-6 py-16">
        {Array.from({ length: 8 }, (_, idx) => (
          <CardShimmer key={idx} />
        ))}
      </div>
    );
  }

  if (allFavouriteData.length === 0) {
    return (
      <div className="flex h-[calc(100vh-96px)] w-full items-center justify-center p-4">
        <Alert variant="destructive" className="min-h-28 max-w-112">
          <AlertCircleIcon />
          <AlertTitle>No Favourite Recipes Found!</AlertTitle>
          <AlertDescription>
            You haven't added any recipes to your favourites yet.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="elem-container flex justify-between pb-8">
        <p className="pb-8 text-2xl">Your Favourite Recipes</p>
      </div>
      <main className="elem-container grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] justify-center gap-6 py-3 pt-2">
        {allFavouriteData.map((item) => (
          <RecipeCard
            key={item.idMeal}
            title={item.strMeal}
            image={item.strMealThumb}
            id={item.idMeal}
            onRemove={() => {
              setAllFavouriteData((prev) =>
                prev.filter((recipe) => recipe.idMeal !== item.idMeal),
              );
            }}
          />
        ))}
      </main>
    </>
  );
};

export default FavouriteRecipe;
