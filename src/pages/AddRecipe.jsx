import React, { useState, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import RecipeContext from "../contexts/Recipe";
import { toast } from "sonner";

const formSchema = z.object({
  recipename: z.string().min(6, {
    message: "Recipe name must be at least 6 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category",
  }),
  area: z.string().min(1, {
    message: "Area cannot be empty",
  }),
  ingredients: z
    .string()
    .min(1, { message: "Please enter at least one ingredient" })
    .refine(
      (value) =>
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean).length > 0 &&
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean).length <= 20,
      {
        message: "Please enter valid ingredients (max 20) separated by commas.",
      },
    ),
  instructions: z.string().min(10, {
    message: "Please give enough instructions to make the recipe.",
  }),
  youtube: z.string().optional(),
  source: z.string().optional(),
  image: z
    .union([
      z.string().url({ message: "Please enter a valid URL" }),
      z.instanceof(File, { message: "Please select a valid image file" }),
    ])
    .refine((value) => value !== "" && value !== null && value !== undefined, {
      message: "Please enter File Source or URL",
      path: ["image"],
    }),
});
import { motion } from "framer-motion";


const AddRecipe = () => {
  const [fileSource, setFileSource] = useState("local");
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const { addRecipe, cuisines } = useContext(RecipeContext);
  const navigate = useNavigate();

  const mealCategories = [
    "Beef",
    "Breakfast",
    "Chicken",
    "Dessert",
    "Goat",
    "Lamb",
    "Miscellaneous",
    "Pasta",
    "Pork",
    "Seafood",
    "Side",
    "Starter",
    "Vegan",
    "Vegetarian",
  ];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipename: "",
      category: "",
      area: "",
      ingredients: "",
      instructions: "",
      youtube: "",
      source: "",
      image: "",
    },
  });

  const handleImageUrl = (evt, setValue) => {
    const url = evt.target.value.trim();
    if (!url) {
      setValue("");
      setFilePreviewUrl(null);
      form.trigger("image");
      return;
    }
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setValue(url);
      setFilePreviewUrl(url);
      form.clearErrors("image");
      form.trigger("image");
    };
    img.onerror = () => {
      setValue("");
      setFilePreviewUrl(null);
      form.setError("image", { message: "Please enter a valid URL" });
      form.trigger("image");
    };
  };

  const handleFileInput = (evt, setValue) => {
    const file = evt.target.files[0];
    if (!file) {
      setValue("");
      setFilePreviewUrl(null);
      form.trigger("image");
      return;
    }
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);
    img.src = blobUrl;
    img.onload = () => {
      setValue(file);
      setFilePreviewUrl(blobUrl);
      form.clearErrors("image");
      form.trigger("image");
    };
    img.onerror = () => {
      setValue("");
      setFilePreviewUrl(null);
      URL.revokeObjectURL(blobUrl);
      form.setError("image", { message: "Please select a valid image file" });
      form.trigger("image");
    };
  };

  const getFormData = async (values) => {
    let imageData = values.image;
    if (values.image instanceof File) {
      try {
        const reader = new FileReader();
        imageData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(values.image);
        });
      } catch (error) {
        toast.error("Image is not processed please try different image!");
        return;
      }
    }

    const data = {
      ...values,
      ingredients: values.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      image: imageData,
    };

    addRecipe(data);
    toast.success("🎉 Recipe added successfully!", {
      description:
        "Your recipe is now in the list! You can check it in the selected Area...",
    });

    form.reset({
      recipename: "",
      category: "",
      area: "",
      ingredients: "",
      instructions: "",
      youtube: "",
      source: "",
      image: "",
    });
    setFileSource("local");
    setFilePreviewUrl(null);
    navigate("/");
  };

  return (
    <motion.div
   className="w-full min-[458px]:px-4 min-[458px]:pb-4">
      <Card className="mx-auto max-w-lg rounded-none min-[458px]:mt-16 min-[458px]:rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Add Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={form.handleSubmit(getFormData)}
              className="space-y-8 pt-8"
            >
              <FormField
                control={form.control}
                name="recipename"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Recipe Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent className="z-[1000]">
                          {mealCategories.map((category, index) => (
                            <SelectItem value={category} key={index}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select a Cuisine" />
                        </SelectTrigger>
                        <SelectContent className="h-76">
                          <SelectGroup>
                            {(cuisines || []).map((item, index) => (
                              <SelectItem
                                value={item}
                                key={index}
                                className="cursor-pointer"
                              >
                                {item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter ingredients, separated by commas (e.g., Flour, Sugar, Butter)"
                        {...field}
                        className="h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter preparation steps"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="youtube"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Youtube Video URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Youtube video link (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="source"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter source link (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Recipe Image</FormLabel>
                    <FormControl>
                      <div>
                        <RadioGroup
                          value={fileSource}
                          onValueChange={(value) => {
                            setFileSource(value);
                            setFilePreviewUrl(null);
                            onChange("");
                            form.clearErrors("image");
                            form.trigger("image");
                          }}
                          className="mb-4"
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="local" id="local" />
                              <Label htmlFor="local">Select from device</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="url" id="url" />
                              <Label htmlFor="url">From Internet</Label>
                            </div>
                          </div>
                        </RadioGroup>
                        {fileSource === "local" ? (
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileInput(e, onChange)}
                          />
                        ) : (
                          <Input
                            type="text"
                            placeholder="Enter image URL"
                            onChange={(e) => handleImageUrl(e, onChange)}
                          />
                        )}
                        {filePreviewUrl && (
                          <div className="mt-8">
                            <img
                              src={filePreviewUrl}
                              alt="image preview"
                              className="aspect-video w-full rounded-lg object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full cursor-pointer">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddRecipe;
