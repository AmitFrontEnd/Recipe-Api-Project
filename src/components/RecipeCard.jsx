import React, { useContext } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import RecipeContext from "@/contexts/Recipe";
import { toast } from "sonner";
import { motion } from "motion/react";
const RecipeCard = ({ image, title, id }) => {
  const { favouriteRecipes, addFavourite, removeFavourite } =
    useContext(RecipeContext);

  const isFavourite = favouriteRecipes.includes(id);

  const toggleFavourite = () => {
    if (isFavourite) {
      removeFavourite(id);
      toast.error("Recipe removed from favourites !");
    } else {
      addFavourite(id);
      toast.success("Recipe successfully added to favourites !");
    }
  };

  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
      }}

      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
    >
      <Card className="relative min-h-[380px] w-[285px] justify-self-center overflow-hidden rounded-md pt-0 pb-16 sm:min-h-[360px] sm:w-full">
        <img
          src={image}
          loading="lazy"
          alt=""
          className="h-52 w-full object-cover"
        />
        <CardHeader>
          <CardTitle className="text-center leading-6">{title}</CardTitle>
        </CardHeader>
        <CardFooter className="absolute bottom-6 z-10 mt-3 flex w-full justify-between gap-2 pt-4 max-[520px]:left-[-9px] min-[921px]:left-[-10px] min-[940px]:left-[-6px] min-[1214px]:left-[-14px] sm:bottom-4">
          <Button
            variant="outline"
            className="cursor-pointer text-[12px]"
            onClick={() => navigate(`/recipe/${id}`)}
          >
            View Recipe
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer text-[12px]"
            onClick={toggleFavourite}
          >
            {!isFavourite ? "Add to Favourite" : "Remove Favourite"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;
