import React from "react";

export default function DeliveryReturn() {
  return (
    <div
      className="modal modalCentered fade modalDemo tf-product-modal modal-part-content"
      id="delivery_return"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Shipping &amp; Delivery</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="overflow-y-auto">
            <div className="tf-product-popup-delivery">
              <div className="title">Delivery</div>
              <p className="text-paragraph">
                All orders shipped with  trusted Delivery Partners.
              </p>
              <p className="text-paragraph">
                Always free shipping for orders over  &#8377; 2000.
              </p>
              <p className="text-paragraph">
                All orders are shipped with a tracking number.
              </p>
            </div>
            <div className="tf-product-popup-delivery">
              <div className="title">Returns</div>
              <p className="text-paragraph">
            You can raise a return request from here within 2 days of the delivery of the order


              </p>
              <p className="text-paragraph">
              Items sold under special offers where you have applied a coupon code at checkout are not eligible for returns.
              </p>
              <p className="text-paragraph">
            Items sold at a strike-through or discounted price (without applying a coupon) are eligible for return.
              </p>
              <p className="text-paragraph">
                All sale items are final purchases.
              </p>
            </div>
            <div className="tf-product-popup-delivery">
              <div className="title">Help</div>
              <p className="text-paragraph">
                Give us a shout if you have any other questions and/or concerns.
              </p>
              <p className="text-paragraph">
                Email:{" "}
                <a
                  href="mailto:contact@domain.com"
                  aria-describedby="a11y-external-message"
                >
                  <span className="__cf_email__">jeweljunkieinfo@gmail.com</span>
                </a>
              </p>
              <p className="text-paragraph mb-0">Phone: +91 (9876) 456 789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
