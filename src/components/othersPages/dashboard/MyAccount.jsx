import React from "react";
import { Link } from "react-router-dom";
import { useContextElement } from "@/context/Context";
export default function MyAccount() {
  const { user } = useContextElement();
  return (
    <div className="my-account-content account-dashboard">
      <div className="mb_60">
        <h5 className="fw-5 mb_20">Hello {user?user.name:"no user "}</h5>
        <p>
          From your account dashboard you can view your{" "}
          <Link className="text_primary" to={`/my-account-orders`}>
            recent orders
          </Link>
          , manage your{" "}
          <Link className="text_primary" to={`/my-account-edit`}>
            shipping and billing addresses
          </Link>
          , and{" "}
          <Link className="text_primary" to={`/my-account-edit`}>
            edit your password and account details
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
