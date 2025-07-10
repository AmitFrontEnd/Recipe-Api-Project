import React, { useContext } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecipeContext from "../contexts/Recipe";

const Filter = ({ setQuery }) => {
  const { cuisines } = useContext(RecipeContext);
  return (
    <Select onValueChange={setQuery}>
      <SelectTrigger className="w-[180px] cursor-pointer">
        <SelectValue placeholder="Select a Cuisine..." />
      </SelectTrigger>
      <SelectContent className="h-76">
        <SelectGroup>
          <SelectLabel>Cuisines</SelectLabel>
          {cuisines.map((item, index) => (
            <SelectItem value={item} key={index} className="cursor-pointer">
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Filter;
