import CardShimmer from "@/components/CardShimmer";
import RecipeCard from "@/components/RecipeCard";
import RecipeContext from "@/contexts/Recipe";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FavouriteRecipe = () => {
  const { localRecipes, favouriteRecipes } = useContext(RecipeContext);

  const [apiFavouriteRecipes, setapiFavouriteRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const localFavouriteRecipes = localRecipes.filter((recipe) =>
    favouriteRecipes.includes(recipe.idMeal),
  );

  useEffect(() => {
    const apiFavouriteIds = favouriteRecipes.filter(
      (elem) => !elem.includes("local"),
    );

    const fetchApiFavourites = async () => {
      try {
        let tempRecipeData = [];
        for (const id of apiFavouriteIds) {
          const response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
          );
          const recipe = response?.data?.meals?.[0];
          if (recipe) {
            tempRecipeData.push(recipe);
          }
        }
        setapiFavouriteRecipes(tempRecipeData);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    if (apiFavouriteIds.length > 0) {
      fetchApiFavourites();
    } else {
      setapiFavouriteRecipes([]);
      setIsLoading(false);
    }
  }, [favouriteRecipes]);

  const allFavouriteData = [
    ...localFavouriteRecipes,
    ...(apiFavouriteRecipes || []),
  ];

  if (isLoading) {
    return (
      <div className="elem-container grid grid-cols-[repeat(auto-fill,_minmax(270px,_1fr))] gap-6 py-16">
        {Array.from({ length: 20 }, (_, idx) => (
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
      <div className="elem-container flex justify-between py-16">
        <p className="text-2xl">Your Favourite Recipes</p>
      </div>
      <div
        className={`elem-container } grid grid-cols-[repeat(auto-fill,_minmax(270px,_1fr))] justify-center gap-6 py-3 pt-2`}
      >
        {allFavouriteData.map((item) => {
          return (
            <RecipeCard
              key={item.idMeal}
              title={item.strMeal}
              image={item.strMealThumb}
              id={item.idMeal}
            />
          );
        })}
      </div>
    </>
  );
};

export default FavouriteRecipe;
