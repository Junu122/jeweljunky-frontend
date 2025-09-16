import { layouts } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import { useState, useEffect, useCallback, useMemo } from "react";
import Pagination from "../common/Pagination";
import ShopFilter from "./ShopFilter";
import Sorting from "./Sorting";
import { productService } from "@/services/productService";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";

export default function ShopDefault({ categorydata }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gridItems, setGridItems] = useState(4);
  const [activePage, setActivePage] = useState(() => {
    return parseInt(searchParams.get("page")) || 1;
  });

  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalproducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Extract filters from URL parameters
  const currentFilters = useMemo(() => {
    const filters = {};

    // Extract search parameter
    const search = searchParams.get("search");
    console.log("search parameter from URL:", search);
    if (search && search.trim()) {
      filters.search = search.trim();
    }

    //filter and sort params
    const priceMin = searchParams.get("price_min");
    const priceMax = searchParams.get("price_max");
    if (priceMin) filters.price_min = parseInt(priceMin);
    if (priceMax) filters.price_max = parseInt(priceMax);

    const brands = searchParams.get("filter.p.brand");
    if (brands) filters.brands = brands.split(",");

    const colors = searchParams.get("filter.p.color");
    if (colors) filters.colors = colors.split(",");

    const sizes = searchParams.get("filter.p.size");
    if (sizes) filters.sizes = sizes.split(",");

    const availability = searchParams.get("filter.p.availability");
    if (availability) filters.availability = availability.split(",");

    const categories = searchParams.get("filter.p.category");
    if (categories) filters.categories = categories.split(",");

    const sort = searchParams.get("sort");
    if (sort) filters.sort = sort;

    // If categorydata is provided, use it
    if (categorydata) {
      filters.categories = [categorydata];
    }

    return filters;
  }, [searchParams, categorydata]);

  // Debounced function to fetch products
  const debouncedFetchProducts = useCallback(
    debounce(async (filters, page) => {
      setLoading(true);
      setError(null);

      try {
        console.log("=== API Call Debug ===");
        console.log("Calling productService.getProducts with:", {
          page,
          limit: 4,
          filters,
        });
        console.log("=====================");

        const data = await productService.getProducts(page, 4, filters);
        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setFacets(data.facets);
        setTotalProducts(data.pagination?.totalProducts || 0);
        setHasInitiallyLoaded(true);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
        setProducts([]);
        setHasInitiallyLoaded(true);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Fetch products when filters or page changes
  useEffect(() => {
    debouncedFetchProducts(currentFilters, activePage);

    // Cleanup function to cancel debounced calls
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [currentFilters, activePage, debouncedFetchProducts, categorydata]);

  // Handle page change
  const handlePageChange = (page) => {
    setActivePage(page);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sorting change
  const handleSortChange = (sortValue) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (sortValue) {
      newSearchParams.set("sort", sortValue);
    } else {
      newSearchParams.delete("sort");
    }
    newSearchParams.delete("page"); // Reset to first page
    setSearchParams(newSearchParams);
    setActivePage(1);
  };

  // Update URL when filters change (called from ShopFilter)
  const handleFiltersChange = useCallback(
    (newFilters) => {
      const newSearchParams = new URLSearchParams();

      // Add all filter parameters
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          if (Array.isArray(value) && value.length > 0) {
            // Handle array filters
            if (key === "brands") {
              newSearchParams.set("filter.p.brand", value.join(","));
            } else if (key === "colors") {
              newSearchParams.set("filter.p.color", value.join(","));
            } else if (key === "sizes") {
              newSearchParams.set("filter.p.size", value.join(","));
            } else if (key === "availability") {
              newSearchParams.set("filter.p.availability", value.join(","));
            } else if (key === "categories") {
              newSearchParams.set("filter.p.category", value.join(","));
            } else {
              newSearchParams.set(key, value.join(","));
            }
          } else if (!Array.isArray(value)) {
            // Handle single value filters - IMPORTANT: Keep search as 'search'
            if (key === "search") {
              newSearchParams.set("search", value.toString());
            } else {
              newSearchParams.set(key, value.toString());
            }
          }
        }
      });

      // Reset page to 1 when filters change
      newSearchParams.delete("page");
      setSearchParams(newSearchParams);
      setActivePage(1);
    },
    [setSearchParams]
  );

  // Clear all filters
  const clearAllFilters = () => {
    const newSearchParams = new URLSearchParams();
    if (categorydata) {
      newSearchParams.set("category", categorydata);
    }
    setSearchParams(newSearchParams);
    setActivePage(1);
  };

  console.log("facets", facets);

  return (
    <>
      <section className="flat-spacing-2">
        <div className="container">
          {/* ADD: Display current search term if present */}
          {currentFilters.search && (
            <div className="search-info mb-3">
              <p className="text-muted">
                Showing results for: "<strong>{currentFilters.search}</strong>"
                <button
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("search");
                    setSearchParams(newParams);
                  }}
                >
                  Clear Search
                </button>
              </p>
            </div>
          )}

          <div className="tf-shop-control grid-3 align-items-center">
            <div className="tf-control-filter">
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
                className="tf-btn-filter"
              >
                <span className="icon icon-filter" />
                <span className="text">Filter</span>
              </a>
            </div>

            <ul className="tf-control-layout d-flex justify-content-center">
              {layouts.map((layout, index) => (
                <li
                  key={index}
                  className={`tf-view-layout-switch ${layout.className} ${
                    gridItems === layout.dataValueGrid ? "active" : ""
                  }`}
                  onClick={() => setGridItems(layout.dataValueGrid)}
                >
                  <div className="item">
                    <span className={`icon ${layout.iconClass}`} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="tf-control-sorting d-flex justify-content-end">
              <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
                <Sorting
                  onSortChange={handleSortChange}
                  currentSort={currentFilters.sort}
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
              <button
                className="btn btn-link"
                onClick={() =>
                  debouncedFetchProducts(currentFilters, activePage)
                }
              >
                Try Again
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="wrapper-control-shop">
              <ProductGrid
                dummy={products}
                gridItems={gridItems}
                category={categorydata}
                totalproducts={totalproducts}
              />

              {/* Results Summary */}
              {products.length > 0 && (
                <div className="tf-pagination-wrap">
                  <div
                    className="tf-pagination-result"
                    style={{ marginBottom: "20px" }}
                  >
                    <p>
                      Showing {(activePage - 1) * 4 + 1} to{" "}
                      {Math.min(activePage * 4, totalproducts)} of{" "}
                      {totalproducts} results
                      {currentFilters.search &&
                        ` for "${currentFilters.search}"`}
                    </p>
                  </div>

                  {totalPages > 1 && (
                    <ul className="tf-pagination-list tf-pagination-btn">
                      <Pagination
                        totalPages={totalPages}
                        setActivePage={handlePageChange}
                        activePage={activePage}
                      />
                    </ul>
                  )}
                </div>
              )}

              {/* No Products Found */}
              {hasInitiallyLoaded && products.length === 0 && (
                <div className="text-center py-5">
                  <h4>No products found</h4>
                  <p>
                    {currentFilters.search
                      ? `No products found for "${currentFilters.search}". Try adjusting your search or filters.`
                      : "Try adjusting your filters or search criteria."}
                  </p>
                  <button className="btn btn-primary" onClick={clearAllFilters}>
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Shop Filter Sidebar */}
      <ShopFilter
        facets={facets}
        currentFilters={currentFilters}
        onFiltersChange={handleFiltersChange}
        category={categorydata}
      />
    </>
  );
}
