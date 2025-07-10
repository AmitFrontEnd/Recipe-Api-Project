import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import CardShimmer from "./CardShimmer";
import RecipeContext from "../contexts/Recipe";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";

const RecipeList = () => {2
  const [query] = useOutletContext();
  const [RecipeData, setRecipeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { localRecipes } = useContext(RecipeContext);

  useEffect(() => {
    const getRecipee = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${query}`,
        );

        const { data } = response;
        setRecipeData(data.meals);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getRecipee();
  }, [query]);


  const localFilterRecipes = localRecipes.filter(
    (localFilter) => localFilter.strArea.toLowerCase() === query.toLowerCase(),
  );

  const allRecipes = [...(RecipeData || []), ...localFilterRecipes];

  const isFewResults = !isLoading && RecipeData && RecipeData.length < 3;

  return (
    <div
      className={`elem-container grid grid-cols-[repeat(auto-fill,_minmax(270px,_1fr))] justify-center gap-6 py-3 pt-2 ${
        isFewResults ? "max-w-[600px]" : ""
      }`}
    >
      {isLoading
        ? Array.from({ length: 20 }, (_, idx) => <CardShimmer key={idx} />)
        : allRecipes &&
          allRecipes.map((item) => (
            <RecipeCard
              key={item.idMeal}
              title={item.strMeal}
              image={item.strMealThumb}
              id={item.idMeal}
            />
          ))}
    </div>
  );
};

export default RecipeList;
