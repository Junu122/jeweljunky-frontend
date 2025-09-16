import { useEffect, useState, useMemo } from "react";
import Slider from "rc-slider";
import { Link } from "react-router-dom";

const availabilities = [
  { id: 1, isAvailable: true, text: "Available" },
  { id: 2, isAvailable: false, text: "Out of Stock" },
];

export default function ShopFilter({
  facets,
  currentFilters = {},
  onFiltersChange,
  category,
}) {
  // Local state for filters

  console.log("category  :", category);
  const [localFilters, setLocalFilters] = useState({
    price_min: currentFilters.price_min || 0,
    price_max: currentFilters.price_max || 4000,
    brands: currentFilters.brands || [],
    colors: currentFilters.colors || [],
    sizes: currentFilters.sizes || [],
    availability: currentFilters.availability || [],
    categories: currentFilters.categories || [],
  });

  // Update local state when currentFilters prop changes
  useEffect(() => {
    setLocalFilters({
      price_min: currentFilters.price_min || 0,
      price_max: currentFilters.price_max || 4000,
      brands: currentFilters.brands || [],
      colors: currentFilters.colors || [],
      sizes: currentFilters.sizes || [],
      availability: currentFilters.availability || [],
      categories: currentFilters.categories || [],
    });
  }, [currentFilters]);

  // Get price range from facets
  const priceRange = useMemo(() => {
    if (facets?.priceRange) {
      return {
        min: Math.floor(facets.priceRange.minPrice || 0),
        max: Math.ceil(facets.priceRange.maxPrice || 4000),
      };
    }
    return { min: 0, max: 4000 };
  }, [facets]);

  // Update filters and notify parent
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);

    // Convert to URL-friendly format
    const urlFilters = {};
    if (updatedFilters.price_min > priceRange.min)
      urlFilters["price_min"] = updatedFilters.price_min;
    if (updatedFilters.price_max < priceRange.max)
      urlFilters["price_max"] = updatedFilters.price_max;
    if (updatedFilters.brands.length > 0)
      urlFilters["filter.p.brand"] = updatedFilters.brands;
    if (updatedFilters.colors.length > 0)
      urlFilters["filter.p.color"] = updatedFilters.colors;
    if (updatedFilters.sizes.length > 0)
      urlFilters["filter.p.size"] = updatedFilters.sizes;
    if (updatedFilters.availability.length > 0)
      urlFilters["filter.p.availability"] = updatedFilters.availability;
    if (updatedFilters.categories.length > 0)
      urlFilters["filter.p.category"] = updatedFilters.categories;

    onFiltersChange?.(urlFilters);
  };

  // Handle price change
  const handlePriceChange = (value) => {
    updateFilters({
      price_min: value[0],
      price_max: value[1],
    });
  };

  // Handle brand selection
  const handleBrandToggle = (brandName) => {
    const newBrands = localFilters.brands.includes(brandName)
      ? localFilters.brands.filter((b) => b !== brandName)
      : [...localFilters.brands, brandName];

    updateFilters({ brands: newBrands });
  };

  // Handle color selection
  const handleColorToggle = (colorName) => {
    const newColors = localFilters.colors.includes(colorName)
      ? localFilters.colors.filter((c) => c !== colorName)
      : [...localFilters.colors, colorName];

    updateFilters({ colors: newColors });
  };

  // Handle size selection
  const handleSizeToggle = (size) => {
    const newSizes = localFilters.sizes.includes(size)
      ? localFilters.sizes.filter((s) => s !== size)
      : [...localFilters.sizes, size];

    updateFilters({ sizes: newSizes });
  };

  // Handle availability selection
  const handleAvailabilityToggle = (availability) => {
    const availabilityString = availability.isAvailable.toString();
    const newAvailability = localFilters.availability.includes(
      availabilityString
    )
      ? localFilters.availability.filter((a) => a !== availabilityString)
      : [...localFilters.availability, availabilityString];

    updateFilters({ availability: newAvailability });
  };

  const handleCategoryToggle = (categoryName) => {
    const newCategory = localFilters.categories.includes(categoryName)
      ? localFilters.categories.filter((c) => c !== categoryName)
      : [...localFilters.categories, categoryName];

    updateFilters({ categories: newCategory });
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      price_min: priceRange.min,
      price_max: priceRange.max,
      brands: [],
      colors: [],
      sizes: [],
      availability: [],
      categories: category ? [category] : [],
    };

    setLocalFilters(clearedFilters);
    onFiltersChange?.({});
  };

  // Get availability with counts
  const availabilityWithCounts = useMemo(() => {
    if (!facets?.availability)
      return availabilities.map((a) => ({ ...a, count: 0 }));

    return availabilities.map((avail) => {
      const facetData = facets.availability.find(
        (f) => f.isAvailable === avail.isAvailable
      );
      return {
        ...avail,
        count: facetData?.count || 0,
      };
    });
  }, [facets]);

  return (
    <div className="offcanvas offcanvas-start canvas-filter" id="filterShop">
      <div className="canvas-wrapper">
        <header className="canvas-header">
          <div className="filter-icon">
            <span className="icon icon-filter" />
            <span>Filter</span>
          </div>
          <span
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </header>

        <div className="canvas-body">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="facet-filter-form"
          >
            {/* Categories */}
            <div className="widget-facet">
              <div
                className="facet-title"
                data-bs-target="#category"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="category"
              >
                <span>Category</span>
                <span className="icon icon-arrow-up" />
              </div>
              <div id="category" className="collapse show">
                <ul className="tf-filter-group current-scrollbar mb_36">
                  {category ? (
                    <li
                      key={category}
                      className="list-item d-flex gap-12 align-items-center"
                      onClick={() => handleCategoryToggle(category)}
                      style={{
                        opacity: 1,
                        pointerEvents: "auto",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="category"
                        className="tf-check"
                        readOnly
                        checked={localFilters.categories.includes(category)}
                        disabled={false}
                      />
                      <label className="label">
                        <span>{category}</span>&nbsp;
                        <span>(1)</span>
                      </label>
                    </li>
                  ) : (
                    facets?.categories?.map((categoryItem) => (
                      <li
                        key={categoryItem.name}
                        className="list-item d-flex gap-12 align-items-center"
                        onClick={() => handleCategoryToggle(categoryItem.name)}
                        style={{
                          opacity: categoryItem.count === 0 ? 0.5 : 1,
                          pointerEvents: categoryItem.count === 0 ? "none" : "auto",
                          cursor:
                            categoryItem.count === 0 ? "not-allowed" : "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          className="tf-check"
                          readOnly
                          checked={localFilters.categories.includes(categoryItem.name)}
                          disabled={categoryItem.count === 0}
                        />
                        <label className="label">
                          <span>{categoryItem.name}</span>&nbsp;
                          <span>({categoryItem.count})</span>
                        </label>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* Price Filter */}
            <div className="widget-facet wrap-price">
              <div
                className="facet-title"
                data-bs-target="#price"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="price"
              >
                <span>Price</span>
                <span className="icon icon-arrow-up" />
              </div>
              <div id="price" className="collapse show">
                <div className="widget-price filter-price">
                  <Slider
                    formatLabel={() => ``}
                    range
                    max={priceRange.max}
                    min={priceRange.min}
                    value={[localFilters.price_min, localFilters.price_max]}
                    onChange={(value) => handlePriceChange(value)}
                    id="slider"
                  />
                  <div className="box-title-price">
                    <span className="title-price">Price :</span>
                    <div className="caption-price">
                      <div>
                        <span>&#8377;</span>
                        <span className="min-price">
                          {localFilters.price_min}
                        </span>
                      </div>
                      <span>-</span>
                      <div>
                        <span>&#8377;</span>
                        <span className="max-price">
                          {localFilters.price_max}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="widget-facet">
              <div
                className="facet-title"
                data-bs-target="#availability"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="availability"
              >
                <span>Availability</span>
                <span className="icon icon-arrow-up" />
              </div>
              <div id="availability" className="collapse show">
                <ul className="tf-filter-group current-scrollbar mb_36">
                  {availabilityWithCounts.map((availability) => (
                    <li
                      key={availability.id}
                      className="list-item d-flex gap-12 align-items-center"
                      onClick={() => handleAvailabilityToggle(availability)}
                      style={{
                        opacity: availability.count === 0 ? 0.5 : 1,
                        pointerEvents:
                          availability.count === 0 ? "none" : "auto",
                        cursor:
                          availability.count === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="tf-check"
                        readOnly
                        checked={localFilters.availability.includes(
                          availability.isAvailable.toString()
                        )}
                        disabled={availability.count === 0}
                      />
                      <label className="label">
                        <span>{availability.text}</span>&nbsp;
                        <span>({availability.count})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="widget-facet">
              <div
                className="facet-title"
                data-bs-target="#brand"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="brand"
              >
                <span>Brand</span>
                <span className="icon icon-arrow-up" />
              </div>
              <div id="brand" className="collapse show">
                <ul className="tf-filter-group current-scrollbar mb_36">
                  {facets?.brands?.map((brand) => (
                    <li
                      key={brand.name || brand}
                      className="list-item d-flex gap-12 align-items-center"
                      onClick={() => handleBrandToggle(brand.name || brand)}
                      style={{
                        opacity: (brand.count || 0) === 0 ? 0.5 : 1,
                        pointerEvents:
                          (brand.count || 0) === 0 ? "none" : "auto",
                        cursor:
                          (brand.count || 0) === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="tf-check"
                        readOnly
                        checked={localFilters.brands.includes(
                          brand.name || brand
                        )}
                        disabled={(brand.count || 0) === 0}
                      />
                      <label className="label">
                        <span>{brand.name || brand}</span>&nbsp;
                        <span>({brand.count || 0})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Color Filter */}
            <div className="widget-facet">
              <div
                className="facet-title"
                data-bs-target="#color"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="color"
              >
                <span>Color</span>
                <span className="icon icon-arrow-up" />
              </div>
              <div id="color" className="collapse show">
                <ul className="tf-filter-group filter-color current-scrollbar mb_36">
                  {facets?.colors?.map((color, i) => (
                    <li
                      key={i}
                      className="list-item d-flex gap-12 align-items-center"
                      onClick={() => handleColorToggle(color.name || color)}
                      style={{
                        opacity: (color.count || 0) === 0 ? 0.5 : 1,
                        pointerEvents:
                          (color.count || 0) === 0 ? "none" : "auto",
                        cursor:
                          (color.count || 0) === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="color"
                        className={`tf-check-color ${color.colorClass || ""}`}
                        readOnly
                        checked={localFilters.colors.includes(
                          color.name || color
                        )}
                        disabled={(color.count || 0) === 0}
                      />
                      <label className="label">
                        <span>{color.name || color}</span>&nbsp;
                        <span>({color.count || 0})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Size Filter */}
            <div className="widget-facet">
              <div
                className="facet-title"
                data-bs-target="#size"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="size"
              >
                <span>Size</span>
                <span className="icon icon-arrow-up" />
              </div>
              <div id="size" className="collapse show">
                <ul className="tf-filter-group current-scrollbar mb_36">
                  {facets?.sizes?.map((size) => (
                    <li
                      key={size.value || size}
                      className="list-item d-flex gap-12 align-items-center"
                      onClick={() => handleSizeToggle(size.value || size)}
                      style={{
                        opacity: (size.count || 0) === 0 ? 0.5 : 1,
                        pointerEvents:
                          (size.count || 0) === 0 ? "none" : "auto",
                        cursor:
                          (size.count || 0) === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="tf-check"
                        readOnly
                        checked={localFilters.sizes.includes(
                          size.value || size
                        )}
                        disabled={(size.count || 0) === 0}
                      />
                      <label className="label">
                        <span>{size.value || size} inches</span>&nbsp;
                        <span>({size.count || 0})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </form>

          <div className="mt-5"></div>
          <button
            type="button"
            className="tf-btn style-2 btn-fill rounded animate-hover-btn"
            onClick={clearAllFilters}
          >
            Clear Filter
          </button>
        </div>
      </div>
    </div>
  );
}