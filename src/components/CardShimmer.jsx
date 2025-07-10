import React from "react";
import { Skeleton } from "./ui/skeleton";

const CardShimmer = () => {
  return (
    <div className="relative min-h-[380px] w-[300px] justify-self-center rounded-md border pt-0 pb-16 sm:min-h-[360px] sm:w-full">
      <Skeleton className="h-52 w-full rounded-l-none rounded-r-none bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="mx-auto mt-8 h-8 w-56 rounded-sm bg-gray-200 text-center dark:bg-gray-700" />
      <div className="absolute bottom-6 mt-3 flex w-full justify-between gap-2 px-4 pt-4 sm:bottom-4">
        <Skeleton className="h-[36px] w-[110px] bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-[36px] w-[120px] bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
};

export default CardShimmer;
