 import { useEffect, useState,useRef  } from "react";

import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";
import Header4 from "@/components/headers/Header4";
import Header2 from "@/components/headers/Header2";
import HomesModal from "@/components/modals/HomesModal";
import QuickView from "@/components/modals/QuickView";
import ProductSidebar from "@/components/modals/ProductSidebar";
import QuickAdd from "@/components/modals/QuickAdd";
import Compare from "@/components/modals/Compare";
import ShopCart from "@/components/modals/ShopCart";
import AskQuestion from "@/components/modals/AskQuestion";
import BlogSidebar from "@/components/modals/BlogSidebar";
import ColorCompare from "@/components/modals/ColorCompare";
import DeliveryReturn from "@/components/modals/DeliveryReturn";
import FindSize from "@/components/modals/FindSize";
import Login from "@/components/modals/Login";
import MobileMenu from "@/components/modals/MobileMenu";
import Register from "@/components/modals/Register";
import ResetPass from "@/components/modals/ResetPass";
import SearchModal from "@/components/modals/SearchModal";
import ToolbarBottom from "@/components/modals/ToolbarBottom";
import ToolbarShop from "@/components/modals/ToolbarShop";

import NewsletterModal from "@/components/modals/NewsletterModal";
import ShareModal from "@/components/modals/ShareModal";
import ScrollTop from "@/components/common/ScrollTop";
import RtlToggle from "@/components/common/RtlToggle";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage1 from "../src/pages/page";
import WOW from "@/utlis/wow";
import HomeMultiBrandPage from "../src/pages/homes/home-multi-brand";
import Homepage2 from "../src/pages/homes/home-02";
import Homepage3 from "../src/pages/homes/home-03";
import Homepage4 from "../src/pages/homes/home-04";
import Homepage5 from "../src/pages/homes/home-05";
import Homepage6 from "../src/pages/homes/home-06";
import HomePersonalizedPodPage from "../src/pages/homes/home-personalized-pod";
import HomePickleBallPage from "../src/pages/homes/home-pickleball";
import HomeCeramicPage from "../src/pages/homes/home-ceramic";
import HomeFoodPage from "../src/pages/homes/home-food";
import HomeCampAndHikePage from "../src/pages/homes/home-camp-and-hike";
import Homepage7 from "../src/pages/homes/home-07";
import Homepage8 from "../src/pages/homes/home-08";
import HomeSkincarePage from "../src/pages/homes/home-skincare";
import HomeHeadphonePage from "../src/pages/homes/home-headphone";
import HomeGiftcardPage from "../src/pages/homes/home-giftcard";
import HomeFurniturePage from "../src/pages/homes/home-furniture";
import HomeFurniturePage2 from "../src/pages/homes/home-furniture-02";
import HomeSkateboardPage from "../src/pages/homes/home-skateboard";
import HomeStrollerPage from "../src/pages/homes/home-stroller";
import HomeDecorPage from "../src/pages/homes/home-decor";
import HomeElectricPage from "../src/pages/homes/home-electronic";
import HomeSetupGearPage from "../src/pages/homes/home-setup-gear";
import HomeDogAccessoriesPage from "../src/pages/homes/home-dog-accessories";
import HomeKitchenWearPage from "../src/pages/homes/home-kitchen-wear";
import HomePhonecasePage from "../src/pages/homes/home-phonecase";
import HomePaddleBoardsPage from "../src/pages/homes/home-paddle-boards";
import HomeGlassesPage from "../src/pages/homes/home-glasses";
import HomePodStorePage from "../src/pages/homes/home-pod-store";
import HomeActivewearPage from "../src/pages/homes/home-activewear";
import HomeHandbagPage from "../src/pages/homes/home-handbag";
import HomeTeePage from "../src/pages/homes/home-tee";
import HomeSockPage from "../src/pages/homes/home-sock";
import HomeJewelryPage from "../src/pages/homes/home-jewerly";
import HomeSneakerPage from "../src/pages/homes/home-sneaker";
import HomeAccessoriesPage from "../src/pages/homes/home-accessories";
import HomeGroceryPage from "../src/pages/homes/home-grocery";
import HomeBabyPage from "../src/pages/homes/home-baby";
import HomeCosmeticPage from "../src/pages/homes/home-cosmetic";
import HomePlantPage from "../src/pages/homes/home-plant";
import HomeSwimwearPage from "../src/pages/homes/home-swimwear";
import HomeElectricBikePage from "../src/pages/homes/home-electric-bike";
import HomeFoodwearPage from "../src/pages/homes/home-footwear";
import HomeBookstorePage from "../src/pages/homes/home-bookstore";
import HomeGamingAccessoriesPage from "../src/pages/homes/home-gaming-accessories";
import ShopDefaultPage from "../src/pages/shop/shop-default";
import ShopLestSidebarPage from "../src/pages/shop/shop-left-sidebar";
import ShopRightSidebarPage from "../src/pages/shop/shop-right-sidebar";
import ShopFullwisthPage from "../src/pages/shop/shop-fullwidth";
import ShopCollectionSubPage from "../src/pages/shop/shop-collection-sub";
import ShopCollectionPage from "../src/pages/shop/shop-collection-list";
import ShopLinkPage from "../src/pages/shop/shop-link";
import ShopLoadmorePage from "../src/pages/shop/shop-loadmore";
import ShopInfiniteScrollingPage from "../src/pages/shop/shop-infinite-scrolling";
import ShopFilterSidebarPage from "../src/pages/shop/shop-filter-sidebar";
import ShopFIlterHiddenPage from "../src/pages/shop/shop-filter-hidden";
import ProductStylePage1 from "../src/pages/shop/product-style-01";
import ProductStylePage2 from "../src/pages/shop/product-style-02";
import ProductStylePage3 from "../src/pages/shop/product-style-03";
import ProductStylePage4 from "../src/pages/shop/product-style-04";
import ProductStylePage5 from "../src/pages/shop/product-style-05";
import ProductStylePage6 from "../src/pages/shop/product-style-06";
import ProductStylePage7 from "../src/pages/shop/product-style-07";
import ProductDetailPage from "../src/pages/shop-details/product-detail";
import ProductGridPage1 from "../src/pages/shop-details/product-grid-1";
import ProductGridPage2 from "../src/pages/shop-details/product-grid-2";
import ProductStackedPage from "../src/pages/shop-details/product-stacked";
import ProductRightThumbnailPage from "../src/pages/shop-details/product-right-thumbnails";
import ProductBottomThumbnailPage from "../src/pages/shop-details/product-bottom-thumbnails";
import ProductDrawerSidebarPage from "../src/pages/shop-details/product-drawer-sidebar";
import ProductDescriptionAccordionPage from "../src/pages/shop-details/product-description-accordion";
import ProductDescriptionListPage from "../src/pages/shop-details/product-description-list";
import ProductDescriptionVerticalPage from "../src/pages/shop-details/product-description-vertical";
import ProductInnerZoomPage from "../src/pages/shop-details/product-inner-zoom";
import ProductZoomMagnifierPage from "../src/pages/shop-details/product-zoom-magnifier";
import ProductNoZoomPage from "../src/pages/shop-details/product-no-zoom";
import ProductPhotoswipePupupPage from "../src/pages/shop-details/product-photoswipe-popup";
import ProductZoomPopupPage from "../src/pages/shop-details/product-zoom-popup";
import ProductVideoPage from "../src/pages/shop-details/product-video";
import Product3DPage from "../src/pages/shop-details/product-3d";
import ProductOptionsCustomizerPage from "../src/pages/shop-details/product-options-customizer";
import ProductAdvancedTypesPage from "../src/pages/shop-details/product-advanced-types";
import ProductGiftcardPage from "../src/pages/shop-details/product-giftcard";
import ProductColorSwatchPage from "../src/pages/shop-details/product-color-swatch";
import ProductRectanglePage from "../src/pages/shop-details/product-rectangle";
import ProductRectangleColorPage from "../src/pages/shop-details/product-rectangle-color";
import ProductSwatchImagePage from "../src/pages/shop-details/product-swatch-image";
import ProductSwatchImageRoundedPage from "../src/pages/shop-details/product-swatch-image-rounded";
import ProductSwatchDropdownPage from "../src/pages/shop-details/product-swatch-dropdown";
import ProductSwatchDropdownColorPage from "../src/pages/shop-details/product-swatch-dropdown-color";
import ProductFrequentlyBoughtTogetherPage from "../src/pages/shop-details/product-frequently-bought-together";
import ProductFrequentlyBoughtTogetherPage2 from "../src/pages/shop-details/product-frequently-bought-together-2";
import ProductUpsellFeaturesPage from "../src/pages/shop-details/product-upsell-features";
import ProductPreOrdersPage from "../src/pages/shop-details/product-pre-orders";
import ProductNotificationPage from "../src/pages/shop-details/product-notification";
import ProductPickupPage from "../src/pages/shop-details/product-pickup";
import ProductImagesGroupedPage from "../src/pages/shop-details/product-images-grouped";
import ProductComplementryPage from "../src/pages/shop-details/product-complimentary";
import ProductQuickOrderListPage from "../src/pages/shop-details/product-quick-order-list";
import ProductDetailVolumeDiscountPage from "../src/pages/shop-details/product-detail-volume-discount";
import ProductDetailVolumeDiscountGridPage from "../src/pages/shop-details/product-detail-volume-discount-grid";
import ProductStyleBuyxGetxPage from "../src/pages/shop-details/product-detail-buyx-gety";
import AboutUsPage from "../src/pages/otherPages/about-us";
import BrandsPage from "../src/pages/otherPages/brands";
import BrandsPage2 from "../src/pages/otherPages/brands-v2";
import ContactPage1 from "../src/pages/otherPages/contact-1";
import ContactPage2 from "../src/pages/otherPages/contact-2";
import FaqPage1 from "../src/pages/otherPages/faq-1";
import FaqPage2 from "../src/pages/otherPages/faq-2";
import OurStorePage from "../src/pages/otherPages/our-store";
import TimelinePage from "../src/pages/otherPages/timeline";
import ViewCartPage from "../src/pages/otherPages/view-cart";
import MyAccountPage from "../src/pages/dashboard/my-account";
import WishlistPage from "../src/pages/otherPages/wishlist";
import TermsConditionsPage from "../src/pages/otherPages/terms-conditions";
import PageNotFoundPage from "../src/pages/otherPages/page-not-found";
import BlogGridPage from "../src/pages/blogs/blog-grid";
import BlogSidebarLeftPage from "../src/pages/blogs/blog-sidebar-left";
import BlogSidebarRightPage from "../src/pages/blogs/blog-sidebar-right";
import BlogListPage from "../src/pages/blogs/blog-list";
import BlogDetailsPage from "../src/pages/blogs/blog-detail";
import StoreLocationPage from "../src/pages/otherPages/store-locations";
import ScrollTopBehaviour from "../src/components/common/ScrollToTopBehaviour";
import CheckoutPage from "../src/pages/otherPages/checkout";
import PaymentCOnfirmationPage from "../src/pages/otherPages/payment-confirmation";
import PaymentFailurePage from "../src/pages/otherPages/payment-failure";
import MyAccountOrderPage from "../src/pages/dashboard/my-account-orders";
import MyAccountAddedssPage from "../src/pages/dashboard/my-account-address";
import MyAccountEditPage from "../src/pages/dashboard/my-account-edit";
import MyAccountWishlistPage from "../src/pages/dashboard/my-account-wishlist";
import MyAccountOrderDetailsPage from "../src/pages/dashboard/my-account-orders-details";
import InvoicePage from "../src/pages/otherPages/invoice";
import HomeKidsPage from "../src/pages/homes/home-kids";
import HomeMenPage from "../src/pages/homes/home-men";
import ComparePage from "../src/pages/otherPages/compare";
import HomeParallaxPage from "../src/pages/homes/home-parallax";
import { useContextElement } from "@/context/Context";
const UserRouter=()=>{
 const { loading } = useContextElement();
 const { pathname } = useLocation();
 const [scrollDirection, setScrollDirection] = useState("down");
  const lastScrollY = useRef(0);


   useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        import("bootstrap/dist/js/bootstrap.esm").then(() => {
          console.log("Bootstrap initialized successfully");
        }).catch(err => {
          console.error("Failed to load bootstrap:", err);
        });
      }
    } catch (error) {
      console.error("Error initializing bootstrap:", error);
    }
  }, []);

  // Header background effect
  useEffect(() => {
    try {
      const handleScroll = () => {
        const header = document.querySelector("header");
        if (header) {
          if (window.scrollY > 100) {
            header.classList.add("header-bg");
          } else {
            header.classList.remove("header-bg");
          }
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } catch (error) {
      console.error("Error in header background effect:", error);
    }
  }, []);

  // Scroll direction detection
  useEffect(() => {
    try {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 250) {
          if (currentScrollY > lastScrollY.current) {
            setScrollDirection("down");
          } else {
            setScrollDirection("up");
          }
        } else {
          setScrollDirection("down");
        }

        lastScrollY.current = currentScrollY;
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } catch (error) {
      console.error("Error in scroll direction detection:", error);
    }
  }, [pathname]);

  // Modal and offcanvas cleanup
  useEffect(() => {
    try {
      const closeModals = async () => {
        try {
          const bootstrap = await import("bootstrap");
          
          const modalElements = document.querySelectorAll(".modal.show");
          modalElements.forEach((modal) => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
              modalInstance.hide();
            }
          });

          const offcanvasElements = document.querySelectorAll(".offcanvas.show");
          offcanvasElements.forEach((offcanvas) => {
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
            if (offcanvasInstance) {
              offcanvasInstance.hide();
            }
          });
        } catch (error) {
          console.error("Error closing modals:", error);
        }
      };
      
      closeModals();
    } catch (error) {
      console.error("Error in modal/offcanvas cleanup:", error);
    }
  }, [pathname]);

  // Header position effect based on scroll direction
  useEffect(() => {
    try {
      const header = document.querySelector("header");
      if (header) {
        header.style.top = scrollDirection === "up" ? "0px" : "-185px";
      }
    } catch (error) {
      console.error("Error in header position effect:", error);
    }
  }, [scrollDirection]);

  // WOW animation initialization
  useEffect(() => {
    try {
      const wow = new WOW({
        mobile: false,
        live: false,
      });
      wow.init();
    } catch (error) {
      console.error("Error initializing WOW:", error);
    }
  }, [pathname]);

  // Direction initialization and preloader
  useEffect(() => {
    try {
      const initializeDirection = () => {
        const direction = localStorage.getItem("direction");

        if (direction) {
          const parsedDirection = JSON.parse(direction);
          document.documentElement.dir = parsedDirection.dir;
          document.body.classList.add(parsedDirection.dir);
        } else {
          document.documentElement.dir = "ltr";
        }

        // Handle preloader
        setTimeout(() => {
          const preloader = document.getElementById("preloader");
          if (preloader) {
            preloader.classList.add("disabled");
          }
        }, 300); // Short delay to ensure DOM is ready
      };

      initializeDirection();
    } catch (error) {
      console.error("Error in direction initialization:", error);
    }
  }, []);

  if (loading) {
    return (
      <div className="preload-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100%'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
    return(
<>
      <div className="preload preload-container" id="preloader">
        <div className="preload-logo">
          <div className="spinner"></div>
        </div>
      </div>
      
        <div id="wrapper">
        {/* <Header4 /> */}
        <Header2 />
          <Routes>
            <Route path="/">
              <Route index element={<Homepage6 />} />
              <Route path="home-multi-brand" element={<HomeMultiBrandPage />} />
              <Route path="home-02" element={<Homepage2 />} />
              <Route path="home-03" element={<Homepage3 />} />
              <Route path="home-04" element={<Homepage4 />} />
              <Route path="home-05" element={<Homepage5 />} />
              <Route path="home-06" element={<Homepage6 />} />
              <Route
                path="home-personalized-pod"
                element={<HomePersonalizedPodPage />}
              />
              <Route path="home-pickleball" element={<HomePickleBallPage />} />
              <Route path="home-ceramic" element={<HomeCeramicPage />} />
              <Route path="home-food" element={<HomeFoodPage />} />
              <Route
                path="home-camp-and-hike"
                element={<HomeCampAndHikePage />}
              />
              <Route path="home-07" element={<Homepage7 />} />
              <Route path="home-08" element={<Homepage8 />} />
              <Route path="home-skincare" element={<HomeSkincarePage />} />
              <Route path="home-headphone" element={<HomeHeadphonePage />} />
              <Route path="home-giftcard" element={<HomeGiftcardPage />} />
              <Route path="home-furniture" element={<HomeFurniturePage />} />
              <Route
                path="home-furniture-02"
                element={<HomeFurniturePage2 />}
              />
              <Route path="home-skateboard" element={<HomeSkateboardPage />} />
              <Route path="home-stroller" element={<HomeStrollerPage />} />
              <Route path="home-decor" element={<HomeDecorPage />} />
              <Route path="home-electronic" element={<HomeElectricPage />} />
              <Route path="home-setup-gear" element={<HomeSetupGearPage />} />
              <Route
                path="home-dog-accessories"
                element={<HomeDogAccessoriesPage />}
              />
              <Route
                path="home-kitchen-wear"
                element={<HomeKitchenWearPage />}
              />
              <Route path="home-phonecase" element={<HomePhonecasePage />} />
              <Route
                path="home-paddle-boards"
                element={<HomePaddleBoardsPage />}
              />
              <Route path="home-glasses" element={<HomeGlassesPage />} />
              <Route path="home-pod-store" element={<HomePodStorePage />} />
              <Route path="home-activewear" element={<HomeActivewearPage />} />
              <Route path="home-handbag" element={<HomeHandbagPage />} />
              <Route path="home-tee" element={<HomeTeePage />} />
              <Route path="home-sock" element={<HomeSockPage />} />
              <Route path="home-jewerly" element={<HomeJewelryPage />} />
              <Route path="home-sneaker" element={<HomeSneakerPage />} />
              <Route path="home-kids" element={<HomeKidsPage />} />
              <Route path="home-men" element={<HomeMenPage />} />
              <Route path="home-parallax" element={<HomeParallaxPage />} />
              <Route
                path="home-accessories"
                element={<HomeAccessoriesPage />}
              />
              <Route path="home-grocery" element={<HomeGroceryPage />} />
              <Route path="home-baby" element={<HomeBabyPage />} />
              <Route path="home-cosmetic" element={<HomeCosmeticPage />} />
              <Route path="home-plant" element={<HomePlantPage />} />
              <Route path="home-swimwear" element={<HomeSwimwearPage />} />
              <Route
                path="home-electric-bike"
                element={<HomeElectricBikePage />}
              />
              <Route path="home-footwear" element={<HomeFoodwearPage />} />
              <Route path="home-bookstore" element={<HomeBookstorePage />} />
              <Route
                path="home-gaming-accessories"
                element={<HomeGamingAccessoriesPage />}
              />

              <Route path="shop-collection-list/:category" element={<ShopDefaultPage />} />
              <Route
                path="shop-left-sidebar"
                element={<ShopLestSidebarPage />}
              />
              <Route
                path="shop-right-sidebar"
                element={<ShopRightSidebarPage />}
              />
              <Route path="shop-fullwidth" element={<ShopFullwisthPage />} />
              <Route
                path="product-detail"
                element={<ShopCollectionSubPage />}
              />
              <Route
                path="shop-collection-list"
                element={<ShopCollectionPage />}
              />
              <Route path="shop-link" element={<ShopLinkPage />} />
              <Route path="shop-loadmore" element={<ShopLoadmorePage />} />
              <Route
                path="shop-infinite-scrolling"
                element={<ShopInfiniteScrollingPage />}
              />
              <Route
                path="shop-filter-sidebar"
                element={<ShopFilterSidebarPage />}
              />
              <Route
                path="shop-filter-hidden"
                element={<ShopFIlterHiddenPage />}
              />
              <Route path="product-style-01" element={<ProductStylePage1 />} />
              <Route path="product-style-02" element={<ProductStylePage2 />} />
              <Route path="product-style-03" element={<ProductStylePage3 />} />
              <Route path="product-style-04" element={<ProductStylePage4 />} />
              <Route path="product-style-05" element={<ProductStylePage5 />} />
              <Route path="product-style-06" element={<ProductStylePage6 />} />
              <Route path="product-style-07" element={<ProductStylePage7 />} />
              <Route path="compare" element={<ComparePage />} />
              <Route
                path="product-detail/:id"
                element={<ProductDetailPage />}
              />
              <Route path="product-grid-1/:id" element={<ProductGridPage1 />} />
              <Route path="product-grid-2/:id" element={<ProductGridPage2 />} />
              <Route
                path="product-stacked/:id"
                element={<ProductStackedPage />}
              />
              <Route
                path="product-right-thumbnails/:id"
                element={<ProductRightThumbnailPage />}
              />
              <Route
                path="product-bottom-thumbnails/:id"
                element={<ProductBottomThumbnailPage />}
              />
              <Route
                path="product-drawer-sidebar/:id"
                element={<ProductDrawerSidebarPage />}
              />
              <Route
                path="product-description-accordion/:id"
                element={<ProductDescriptionAccordionPage />}
              />
              <Route
                path="product-description-list/:id"
                element={<ProductDescriptionListPage />}
              />
              <Route
                path="product-description-vertical/:id"
                element={<ProductDescriptionVerticalPage />}
              />
              <Route
                path="product-inner-zoom/:id"
                element={<ProductInnerZoomPage />}
              />
              <Route
                path="product-zoom-magnifier/:id"
                element={<ProductZoomMagnifierPage />}
              />

              <Route
                path="product-no-zoom/:id"
                element={<ProductNoZoomPage />}
              />
              <Route
                path="product-photoswipe-popup/:id"
                element={<ProductPhotoswipePupupPage />}
              />
              <Route
                path="product-zoom-popup/:id"
                element={<ProductZoomPopupPage />}
              />
              <Route path="product-video/:id" element={<ProductVideoPage />} />
              <Route path="product-3d/:id" element={<Product3DPage />} />
              <Route
                path="product-options-customizer/:id"
                element={<ProductOptionsCustomizerPage />}
              />
              <Route
                path="product-advanced-types/:id"
                element={<ProductAdvancedTypesPage />}
              />
              <Route
                path="product-giftcard/:id"
                element={<ProductGiftcardPage />}
              />

              <Route
                path="product-color-swatch/:id"
                element={<ProductColorSwatchPage />}
              />
              <Route
                path="product-rectangle/:id"
                element={<ProductRectanglePage />}
              />
              <Route
                path="product-rectangle-color/:id"
                element={<ProductRectangleColorPage />}
              />
              <Route
                path="product-swatch-image/:id"
                element={<ProductSwatchImagePage />}
              />
              <Route
                path="product-swatch-image-rounded/:id"
                element={<ProductSwatchImageRoundedPage />}
              />
              <Route
                path="product-swatch-dropdown/:id"
                element={<ProductSwatchDropdownPage />}
              />
              <Route
                path="product-swatch-dropdown-color/:id"
                element={<ProductSwatchDropdownColorPage />}
              />
              <Route
                path="product-frequently-bought-together/:id"
                element={<ProductFrequentlyBoughtTogetherPage />}
              />
              <Route
                path="product-frequently-bought-together-2/:id"
                element={<ProductFrequentlyBoughtTogetherPage2 />}
              />
              <Route
                path="product-upsell-features/:id"
                element={<ProductUpsellFeaturesPage />}
              />
              <Route
                path="product-pre-orders/:id"
                element={<ProductPreOrdersPage />}
              />
              <Route
                path="product-notification/:id"
                element={<ProductNotificationPage />}
              />
              <Route
                path="product-pickup/:id"
                element={<ProductPickupPage />}
              />
              <Route
                path="product-images-grouped/:id"
                element={<ProductImagesGroupedPage />}
              />
              <Route
                path="product-complimentary/:id"
                element={<ProductComplementryPage />}
              />
              <Route
                path="product-quick-order-list/:id"
                element={<ProductQuickOrderListPage />}
              />
              <Route
                path="product-detail-volume-discount/:id"
                element={<ProductDetailVolumeDiscountPage />}
              />
              <Route
                path="product-detail-volume-discount-grid/:id"
                element={<ProductDetailVolumeDiscountGridPage />}
              />
              <Route
                path="product-detail-buyx-gety/:id"
                element={<ProductStyleBuyxGetxPage />}
              />

              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="payment-failure" element={<PaymentFailurePage />} />
              <Route
                path="payment-confirmation"
                element={<PaymentCOnfirmationPage />}
              />

              <Route
                path="my-account-orders"
                element={<MyAccountOrderPage />}
              />
              <Route
                path="my-account-address"
                element={<MyAccountAddedssPage />}
              />
              <Route path="my-account-edit" element={<MyAccountEditPage />} />
              <Route
                path="my-account-wishlist"
                element={<MyAccountWishlistPage />}
              />
              <Route
                path="my-account-orders-details"
                element={<MyAccountOrderDetailsPage />}
              />
              <Route path="invoice" element={<InvoicePage />} />

              <Route path="about-us" element={<AboutUsPage />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="brands-v2" element={<BrandsPage2 />} />
              <Route path="contact-1" element={<ContactPage1 />} />
              <Route path="contact-2" element={<ContactPage2 />} />
              <Route path="faq-1" element={<FaqPage1 />} />
              <Route path="faq-2" element={<FaqPage2 />} />
              <Route path="our-store" element={<OurStorePage />} />
              <Route path="store-locations" element={<StoreLocationPage />} />
              <Route path="timeline" element={<TimelinePage />} />
              <Route path="view-cart" element={<ViewCartPage />} />
              <Route path="my-account" element={<MyAccountPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route
                path="terms-conditions"
                element={<TermsConditionsPage />}
              />
              <Route path="page-not-found" element={<PageNotFoundPage />} />

              <Route path="blog-grid" element={<BlogGridPage />} />
              <Route
                path="blog-sidebar-left"
                element={<BlogSidebarLeftPage />}
              />
              <Route
                path="blog-sidebar-right"
                element={<BlogSidebarRightPage />}
              />
              <Route path="blog-list" element={<BlogListPage />} />
              <Route path="blog-detail/:id" element={<BlogDetailsPage />} />
              <Route path="*" element={<PageNotFoundPage />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </div>
        <RtlToggle />
        <HomesModal /> <QuickView />
        <QuickAdd />
        <ProductSidebar />
        <Compare />
        <ShopCart />
        <AskQuestion />
        <BlogSidebar />
        <ColorCompare />
        <DeliveryReturn />
        <FindSize />
        <Login />
        <MobileMenu />

        <Register />
        <ResetPass />
        <SearchModal />
        <ToolbarBottom />
        <ToolbarShop />
        <NewsletterModal />
        <ShareModal />{" "}
      <ScrollTop />
      <ScrollTopBehaviour />
    </>
    )
}

export default UserRouter
 