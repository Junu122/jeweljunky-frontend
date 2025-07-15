import { Link, useLocation } from "react-router-dom";
import { useContextElement } from "@/context/Context";
import {useNavigate} from 'react-router-dom'
const accountLinks = [
  { href: "/my-account", label: "Dashboar" },
  { href: "/my-account-orders", label: "Orders" },
  { href: "/my-account-address", label: "Addresses" },
  { href: "/my-account-edit", label: "Account Details" },
  // { href: "/my-account-wishlist", label: "Wishlist" },
];

export default function DashboardNav() {
    const { logout, loading } = useContextElement();
  const { pathname } = useLocation();
  const navigate = useNavigate();
    const handleLogout = async (e) => {
    e.preventDefault();
    
    try {
      await logout();
      // Redirect to login page after successful logout
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <ul className="my-account-nav">
      {accountLinks.map((link, index) => (
        <li key={index}>
          <Link
            to={link.href}
            className={`my-account-nav-item ${
              pathname == link.href ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <Link
          onClick={handleLogout}
          className="my-account-nav-item"
          disabled={loading}
          // style={{
          //   background: "none",
          //   border: "none",
          //   cursor: loading ? "not-allowed" : "pointer",
          //   textAlign: "left",
          //   width: "100%",
          //   padding: "0",
          //   font: "inherit",
          //   color: "inherit",
          //   textDecoration: "none"
          // }}
        >
          {loading ? "Logging out..." : "Logout"}
        </Link>
      </li>
    </ul>
  );
}
