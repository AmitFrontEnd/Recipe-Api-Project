import RecipeCard from "@/components/RecipeCard";
import RecipeContext from "@/contexts/Recipe";
import React, { useContext } from "react";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const AddedRecipe = () => {
  const { localRecipes } = useContext(RecipeContext);

  if (localRecipes.length === 0) {
    return (
      <div className="flex h-[calc(100vh-96px)] w-full items-center justify-center p-4">
        <Alert variant="destructive" className="min-h-28 max-w-112">
          <AlertCircleIcon />
          <AlertTitle>No Added Recipes Found!</AlertTitle>
          <AlertDescription>
            You haven't added any recipes manually yet.
            <br />
            Start exploring and add your own recipes on the
            <Link to="/addrecipe">
              <span className="font-semibold underline">Add Recipe Page</span>
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="elem-container flex justify-between pb-8">
        <p className="pb-8 text-2xl">Your Added Recipes</p>
      </div>
      <main className="elem-container grid grid-cols-[repeat(auto-fill,_minmax(270px,_1fr))] justify-center gap-6 py-3 pt-2">
        {localRecipes.map((item) => {
          return (
            <RecipeCard
              key={item.idMeal}
              title={item.strMeal}
              image={item.strMealThumb}
              id={item.idMeal}
            />
          );
        })}
      </main>
    </>
  );
};

export default AddedRecipe;
