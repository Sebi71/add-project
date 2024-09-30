import { FilterProps } from "@/types/types";
import React from "react";

const Filter: React.FC<FilterProps> = ({ handleFilter, categories }) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
        <button
            type="button"
            onClick={() => handleFilter("Tous")}
            className="bg-blue-300 hover:bg-blue-500 rounded-md p-2 uppercase"    
        >
            Tous
        </button>
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          onClick={() => handleFilter(category)}
          className="bg-blue-300 hover:bg-blue-500 rounded-md p-2 uppercase"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default Filter
