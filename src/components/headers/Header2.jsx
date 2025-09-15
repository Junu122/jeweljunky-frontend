import React, { useState } from "react";
import Nav from "./Nav";
import { useContextElement } from "@/context/Context";
import { Link } from "react-router-dom";
import CartLength from "../common/CartLength";
import WishlistLength from "../common/WishlistLength";
import { useNavigate } from "react-router-dom";
export default function Header2({
  textClass,
  bgColor = "",
  uppercase = false,
  isArrow = false,
  Linkfs = "",
}) {
  const { isAuthenticated, loading, user, logout } = useContextElement();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
   const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus on input when opening
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement your search logic here
     navigate(`/product-detail?search=${encodeURIComponent(searchQuery.trim())}`);
      // For example: navigate to search results page
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchInputChange = (e) => {
    console.log("e.target.value", e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <header
      id="header"
      className={`header-default ${
        uppercase ? "header-uppercase" : ""
      } "header-style-2"`}
    >
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay position-fixed w-100 h-100 d-none d-md-block" style={{
          top: 0,
          left: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999
        }}>
          <div className="search-container position-absolute w-100 bg-white shadow-lg" style={{
            top: '80px',
            left: 0,
            padding: '20px 0'
          }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                  <form onSubmit={handleSearchSubmit} className="search-form position-relative">
                    <input
                      id="search-input"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="Search for products..."
                      className="form-control search-input"
                      style={{
                        padding: '15px 50px 15px 20px',
                        fontSize: '18px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '50px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      className="search-submit-btn position-absolute"
                      style={{
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="icon icon-search" style={{ fontSize: '20px' }} />
                    </button>
                  </form>
                  
                  {/* Quick suggestions or recent searches can go here */}
                  {searchQuery && (
                    <div className="search-suggestions mt-3">
                      <div className="text-muted small">Press Enter to search for "{searchQuery}"</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Close button */}
            <button
              onClick={toggleSearch}
              className="search-close position-absolute"
              style={{
                top: '15px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="px_15 lg-px_40">
        <div className="row wrapper-header align-items-center">
          <div className="col-md-4 col-3 tf-lg-hidden">
            <a
              href="#mobileMenu"
              data-bs-toggle="offcanvas"
              aria-controls="offcanvasLeft"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={16}
                viewBox="0 0 24 16"
                fill="none"
              >
                <path
                  d="M2.00056 2.28571H16.8577C17.1608 2.28571 17.4515 2.16531 17.6658 1.95098C17.8802 1.73665 18.0006 1.44596 18.0006 1.14286C18.0006 0.839753 17.8802 0.549063 17.6658 0.334735C17.4515 0.120408 17.1608 0 16.8577 0H2.00056C1.69745 0 1.40676 0.120408 1.19244 0.334735C0.978109 0.549063 0.857702 0.839753 0.857702 1.14286C0.857702 1.44596 0.978109 1.73665 1.19244 1.95098C1.40676 2.16531 1.69745 2.28571 2.00056 2.28571ZM0.857702 8C0.857702 7.6969 0.978109 7.40621 1.19244 7.19188C1.40676 6.97755 1.69745 6.85714 2.00056 6.85714H22.572C22.8751 6.85714 23.1658 6.97755 23.3801 7.19188C23.5944 7.40621 23.7148 7.6969 23.7148 8C23.7148 8.30311 23.5944 8.59379 23.3801 8.80812C23.1658 9.02245 22.8751 9.14286 22.572 9.14286H2.00056C1.69745 9.14286 1.40676 9.02245 1.19244 8.80812C0.978109 8.59379 0.857702 8.30311 0.857702 8ZM0.857702 14.8571C0.857702 14.554 0.978109 14.2633 1.19244 14.049C1.40676 13.8347 1.69745 13.7143 2.00056 13.7143H12.2863C12.5894 13.7143 12.8801 13.8347 13.0944 14.049C13.3087 14.2633 13.4291 14.554 13.4291 14.8571C13.4291 15.1602 13.3087 15.4509 13.0944 15.6653C12.8801 15.8796 12.5894 16 12.2863 16H2.00056C1.69745 16 1.40676 15.8796 1.19244 15.6653C0.978109 15.4509 0.857702 15.1602 0.857702 14.8571Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
          <div className="col-xl-3 col-md-4 col-6">
            <Link to={`/`} className="logo-header">
              <img
                alt="logo"
                className="logo"
                src="/images/logo/jewel-junkie-logo-file-copy.png"
                width="136"
                height="21"
              />
            </Link>
          </div>
          <div className="col-xl-6 tf-md-hidden">
            <nav className="box-navigation text-center">
              <ul className="box-nav-ul d-flex align-items-center justify-content-center gap-30">
                <Nav isArrow={isArrow} Linkfs={Linkfs} />
                <li className={`menu-item`}>
                  {/* <a
                    href="https://themeforest.net/item/ecomus-ultimate-html5-template/53417990?s_rank=3"
                    className={`item-link  ${Linkfs}`}
                  >
                    Buy now
                  </a> */}
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-xl-3 col-md-4 col-3">
            <ul className="nav-icon d-flex justify-content-end align-items-center gap-20">
              <li className="nav-search d-none d-md-block">
                <button
                  onClick={toggleSearch}
                  className="nav-icon-item bg-transparent border-0"
                  style={{ cursor: 'pointer' }}
                >
                
                  <i className="icon icon-search" />
                </button>
              </li>
              <li 
                className="nav-account position-relative"
                onMouseEnter={() => setIsAccountDropdownOpen(true)}
                onMouseLeave={() => setIsAccountDropdownOpen(false)}
              >
                {!loading && (
                  <>
                    {isAuthenticated ? (
                      <div className="account-dropdown-wrapper">
                        <a
                          href="#"
                          className="nav-icon-item d-flex align-items-center gap-2"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="icon icon-account" />
                          {user && (
                            <span className="d-none d-lg-inline-block text-truncate" style={{maxWidth: '80px'}}>
                              Hi, {user.name || user.email}
                            </span>
                          )}
                          <svg 
                            width="8" 
                            height="6" 
                            viewBox="0 0 8 6" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className={`dropdown-arrow transition-transform duration-200 ${isAccountDropdownOpen ? 'rotate-180' : ''}`}
                          >
                            <path d="M4 4.5L1 1.5L7 1.5L4 4.5Z" fill="currentColor"/>
                          </svg>
                        </a>
                        
                        <div 
                          className={`account-dropdown position-absolute top-100 end-0 bg-white shadow-lg rounded-2 border mt-2 py-2 transition-all duration-200 ${
                            isAccountDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                          }`}
                          style={{
                            minWidth: '220px',
                            zIndex: 1000,
                            transform: isAccountDropdownOpen ? 'translateY(0)' : 'translateY(-10px)'
                          }}
                        >
                          <div className="px-3 py-2 border-bottom">
                            <div className="d-flex align-items-center gap-2">
                              <div className="user-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                <span className="text-white fw-bold">
                                  {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="fw-semibold text-dark" style={{fontSize: '14px'}}>
                                  {user?.name || 'User'}
                                </div>
                                <div className="text-muted" style={{fontSize: '12px'}}>
                                  {user?.email}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Link 
                            to="/my-account" 
                            className="dropdown-item d-flex align-items-center gap-3 px-3 py-2 text-decoration-none text-dark hover-bg-light transition-colors"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M20 21C20 17.134 16.866 14 13 14H11C7.13401 14 4 17.134 4 21" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                            <span>My Account</span>
                          </Link>
                          
                          <Link 
                            to="/my-account-orders" 
                            className="dropdown-item d-flex align-items-center gap-3 px-3 py-2 text-decoration-none text-dark hover-bg-light transition-colors"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              <path d="M3.5 9H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M15.6947 13.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M15.6947 16.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M11.9955 13.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M11.9955 16.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M8.29431 13.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M8.29431 16.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span>My Orders</span>
                          </Link>
                          
                          <div className="dropdown-divider mx-3"></div>
                          
                          <button
                            onClick={handleLogout}
                            className="dropdown-item d-flex align-items-center gap-3 px-3 py-2 w-100 border-0 bg-transparent text-danger hover-bg-light transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22L15.0002 22C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <a
                        href="#login"
                        data-bs-toggle="modal"
                        className="nav-icon-item"
                      >
                        <i className="icon icon-account" />
                      </a>
                    )}
                  </>
                )}
              </li>
              <li className="nav-wishlist">
                <Link to={`/wishlist`} className="nav-icon-item">
                  <i className="icon icon-heart" />
                  <span className={`count-box ${bgColor} ${textClass}`}>
                    <WishlistLength />
                  </span>
                </Link>
              </li>
              <li className="nav-cart">
                <a
                  href="#shoppingCart"
                  data-bs-toggle="modal"
                  className="nav-icon-item"
                >
                  <i className="icon icon-bag" />
                  <span className={`count-box ${bgColor} ${textClass}`}>
                    <CartLength />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add custom CSS styles */}
      <style jsx>{`
        .account-dropdown-wrapper {
          position: relative;
        }
        
        .account-dropdown-wrapper::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          height: 8px;
          background: transparent;
          z-index: 999;
        }
        
        .account-dropdown {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa !important;
        }
        
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
        
        .transition-colors {
          transition: all 0.2s ease-in-out;
        }
        
        .transition-transform {
          transition: transform 0.2s ease-in-out;
        }
        
        .dropdown-arrow.rotate-180 {
          transform: rotate(180deg);
        }
        
        .user-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .account-dropdown-wrapper:hover .account-dropdown {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
        }

        /* Search styles */
        .search-overlay {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .search-container {
          animation: slideDown 0.3s ease-in-out;
        }
        
        .search-input:focus {
          border-color: #007bff !important;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .search-close:hover {
          opacity: 0.7;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .nav-icon-item {
          transition: all 0.2s ease-in-out;
        }
        
        .nav-icon-item:hover {
          transform: scale(1.1);
        }
      `}</style>
    </header>
  );
}