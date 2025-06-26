import { sortingOptions } from "@/data/shop";
import React from "react";

export default function Sorting({ onSortChange, currentSort }) {
  // Get display text for current sort
  const getCurrentSortDisplay = () => {
    if (!currentSort) return "Default";
    
    const option = sortingOptions.find(option => option.text === currentSort);
    return option ? option.text : "Default";
  };

  const handleSortChange = (sortValue) => {
    // Call parent's sort change handler
    onSortChange(sortValue === "Default" ? null : sortValue);
  };

  return (
    <>
      <div className="btn-select">
        <span className="text-sort-value">{getCurrentSortDisplay()}</span>
        <span className="icon icon-arrow-down" />
      </div>
      <div className="dropdown-menu">
        {sortingOptions.map((item, index) => (
          <div
            key={index}
            onClick={() => handleSortChange(item.value || item.text)}
            className={`select-item ${
              (currentSort === (item.value || item.text)) || 
              (!currentSort && item.text === "Default") 
                ? "active" 
                : ""
            }`}
          >
            <span className="text-value-item">{item.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}