import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CardShimmer from "@/components/CardShimmer";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import RecipeContext from "../contexts/Recipe";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { MdDeleteForever } from "react-icons/md";
import { supabase } from "@/supabase";

const RecipeDetail = () => {
  const { favouriteRecipes, addFavourite, removeFavourite, setLocalRecipes } =
    useContext(RecipeContext);

  let embedUrl = "";
  const navigate = useNavigate();
  const { id } = useParams();
  const isFavourite = favouriteRecipes.includes(id);
  const [itemData, setItemData] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { localRecipes } = useContext(RecipeContext);
  const [showIsDelete, setShowIsDelete] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const toggleFavourite = () => {
    if (isFavourite) {
      removeFavourite(id);
    } else {
      addFavourite(id);
    }
  };

  const handleDelete = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("Please log in to delete a recipe!");
      console.log("User fetch error:", userError);
      return;
    }
    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Error deleting recipe!");
      console.log("Delete error:", error);
      return;
    }
    setLocalRecipes((prev) => prev.filter((item) => item.idMeal !== id));

    if (favouriteRecipes.includes(id)) {
      await removeFavourite(id);
    }

    toast.success("Recipe deleted successfully!");
    navigate("/");
  };

  useEffect(() => {
    if (
      localRecipes.find((recipe) => {
        return recipe.idMeal === id;
      })
    ) {
      setShowIsDelete(true);
    } else {
      setShowIsDelete(false);
    }
  }, [localRecipes, id]);

  useEffect(() => {
    const getProductDetail = async () => {
      const localRecipe = localRecipes.find((recipe) => recipe.idMeal === id);
      if (localRecipe) {
        setItemData(localRecipe);
        return;
      }

      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
        );
        const recipe = response?.data?.meals?.[0];
        if (recipe) {
          setItemData(recipe);
        } else {
          setItemData(undefined);
        }
      } catch  {}
    };

    getProductDetail();
  }, []);

  useEffect(() => {
    if (itemData != null) {
      const tempArray = [];
      for (let i = 1; i <= 20; i++) {
        const ingridient = itemData[`strIngredient${i}`];
        if (ingridient) tempArray.push(ingridient);
      }
      setIngredients(tempArray);
    }
  }, [itemData]);

  if (itemData === undefined) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Alert variant="destructive" className="min-h-28 max-w-112">
          <AlertCircleIcon />
          <AlertTitle>Recipe Not Found!</AlertTitle>
          <AlertDescription>
            <p>
              We couldn't find the recipe you're looking for. <br />
              Please check the URL or try searching again.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (itemData) {
    let youtubeUrl = itemData.strYoutube;
    if (youtubeUrl.includes("watch?v=")) {
      embedUrl = youtubeUrl.replace("watch?v=", "embed/");
    } else if (youtubeUrl.includes("youtu.be")) {
      const newUrl = new URL(youtubeUrl);
      const videoId = newUrl.pathname.split("/")[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }

  return (
    <>
      <div className="elem-container py-16">
        <p className="text-2xl">Recipe Detail</p>
      </div>

      <main className="mx-auto max-w-4xl space-y-6 pb-4 max-[930px]:px-4">
        {itemData ? (
          <>
            <article className="overflow-hidden">
              <Card>
                <div
                  className={`shadow-2xl ${
                    showIsDelete ? "max-w-40" : "max-w-23"
                  } ml-6 flex h-10 cursor-pointer items-center gap-2 rounded-sm bg-white pl-4 dark:bg-[oklch(0.129_0.042_264.695)]`}
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                  onClick={() => {
                    if (showIsDelete) {
                      setIsDeleteDialogOpen(true);
                    } else {
                      navigate(-1);
                    }
                  }}
                >
                  {showIsDelete ? (
                    <>
                      <MdDeleteForever />
                      Delete Recipe
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-arrow-left"></i>
                      Back
                    </>
                  )}
                </div>
                <AspectRatio ratio={16 / 9} className="px-6">
                  <figure>
                    <img
                      src={itemData.strMealThumb}
                      alt={`${itemData.strMeal} image`}
                      className="h-full w-full rounded-md object-cover"
                      loading="lazy"
                    />
                  </figure>
                </AspectRatio>

                <CardHeader>
                  <CardTitle className="text-2xl">{itemData.strMeal}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Category: <span>{itemData.strCategory}</span>
                  </p>
                  <p>
                    Area: <span>{itemData.strArea}</span>
                  </p>
                </CardContent>
              </Card>
            </article>

            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="pl-4 tracking-wider">
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="ml-6 list-disc">
                    {ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="pl-4 tracking-wider">
                    Instructions
                  </CardTitle>
                  <CardDescription className="mt-2 ml-4 text-justify leading-6">
                    {id === "53076"
                      ? "Just " + itemData.strInstructions
                      : itemData.strInstructions}
                  </CardDescription>
                </CardHeader>
              </Card>
            </section>
            {itemData.strYoutube && (
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle>Watch Video</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AspectRatio ratio={16 / 9}>
                      <iframe
                        src={embedUrl}
                        title="YouTube Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="h-full w-full rounded-md"
                      ></iframe>
                    </AspectRatio>
                  </CardContent>
                </Card>
              </section>
            )}

            <section className="flex justify-between">
              <Button className="cursor-pointer" onClick={toggleFavourite}>
                {!isFavourite ? "Add to Favourite" : "Remove Favourite"}
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  if (itemData?.strSource?.trim())
                    window.open(itemData.strSource);
                  else {
                    setIsDialogOpen(true);
                  }
                }}
              >
                View Source
              </Button>
              <Dialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                className="bg-red-500"
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>No Source Found!</DialogTitle>
                    <DialogDescription>
                      There is no source found related to this item...
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this recipe? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDelete();
                        setIsDeleteDialogOpen(false);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </section>
          </>
        ) : (
          <CardShimmer />
        )}
      </main>
    </>
  );
};

export default RecipeDetail;
