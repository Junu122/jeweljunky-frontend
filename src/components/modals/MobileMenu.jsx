import React from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
import { navItems } from "@/data/menu";

export default function MobileMenu() {
  const { pathname } = useLocation();
  const isMenuActive = (menuItem) => {
    let active = false;
    if (menuItem.href?.includes("/")) {
      if (menuItem.href?.split("/")[1] == pathname.split("/")[1]) {
        active = true;
      }
    }
    if (menuItem.links) {
      menuItem.links?.forEach((elm2) => {
        if (elm2.href?.includes("/")) {
          if (elm2.href?.split("/")[1] == pathname.split("/")[1]) {
            active = true;
          }
        }
        if (elm2.links) {
          elm2.links.forEach((elm3) => {
            if (elm3.href.split("/")[1] == pathname.split("/")[1]) {
              active = true;
            }
          });
        }
      });
    }

    return active;
  };
  return (
    <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
      <span
        className="icon-close icon-close-popup"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
      <div className="mb-canvas-content">
        <div className="mb-body">
          <ul className="nav-ul-mb" id="wrapper-menu-navigation">
            {navItems.map((item, i) => (
              <li key={i} className="nav-mb-item">
                {/* <a
                  href={`#${item.id}`}
                  className={`collapsed mb-menu-link current ${
                    isMenuActive(item) ? "activeMenu" : ""
                  }`}
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls={item.id}
                >
                  <span>{item.label}</span>
                  <span className="btn-open-sub" />
                </a> */}
                <Link
                  to={item.href}
                  className={`mb-menu-link collapsed   ${
                    isMenuActive(item) ? "activeMenu" : ""
                  }`}
                >
                  {item.label}
{/* 
                  <div className="demo-label">
                    <span className="demo-new">New</span>
                  </div> */}
                </Link>
                {/* <div id={item.id} className="collapse">
                  <ul className="sub-nav-menu">
                    {item.links.map((subItem, i2) => (
                      <li key={i2}>
                        {subItem.links ? (
                          <>
                            <a
                              href={`#${subItem.id}`}
                              className={`sub-nav-link collapsed  ${
                                isMenuActive(subItem) ? "activeMenu" : ""
                              }`}
                              data-bs-toggle="collapse"
                              aria-expanded="true"
                              aria-controls={subItem.id}
                            >
                              <span>{subItem.label}</span>
                              <span className="btn-open-sub" />
                            </a>
                            <div id={subItem.id} className="collapse">
                              <ul className="sub-nav-menu sub-menu-level-2">
                                {subItem.links.map((innerItem, i3) => (
                                  <li key={i3}>
                                    <Link
                                      to={innerItem.href}
                                      className={`sub-nav-link  ${
                                        isMenuActive(innerItem)
                                          ? "activeMenu"
                                          : ""
                                      }`}
                                    >
                                      {innerItem.label}
                                      {innerItem.demoLabel && (
                                        <div className="demo-label">
                                          <span className="demo-new">New</span>
                                        </div>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <Link
                            to={subItem.href}
                            className={`sub-nav-link ${
                              isMenuActive(subItem) ? "activeMenu" : ""
                            }`}
                          >
                            {subItem.label}
                            {subItem.demoLabel && (
                              <div className="demo-label">
                                <span className="demo-new">New</span>
                              </div>
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div> */}
              </li>
            ))}
          </ul>
          <div className="mb-other-content">
            <div className="d-flex group-icon">
              <Link to={`/wishlist`} className="site-nav-icon">
                <i className="icon icon-heart" />
                Wishlist
              </Link>
              <Link to={`/home-search`} className="site-nav-icon">
                <i className="icon icon-search" />
                Search
              </Link>
            </div>
            <div className="mb-notice">
              <Link to={`/contact-1`} className="text-need">
                Need help ?
              </Link>
            </div>
            <ul className="mb-info">
              <li>
                Address: 1234 Fashion Street, Suite 567, <br />
                New York, NY 10001
              </li>
              <li>
                Email: <b>info@fashionshop.com</b>
              </li>
              <li>
                Phone: <b>(212) 555-1234</b>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-bottom">
          <Link to={`/login`} className="site-nav-icon">
            <i className="icon icon-account" />
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
