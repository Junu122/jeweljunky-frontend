import React from "react";

export default function About() {
  return (
    <>
      <section className="flat-spacing-23 flat-image-text-section">
        <div className="container">
          <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
            {/* <div className="tf-image-wrap">
              <img
                className="lazyload w-100"
                data-src="/images/collections/collection-69.jpg"
                alt="collection-img"
                src="/images/collections/collection-69.jpg"
                width={600}
                height={499}
              />
            </div> */}
            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
              <div>
                <div className="heading">Our Story</div>
                <div className="text">
                  Jewel Junkie was born from a deep passion for exquisite jewelry
                  <br className="d-xl-block d-none" />
                  and the belief that every person deserves to shine. We started
                  <br className="d-xl-block d-none" />
                  with a vision to create a space where jewelry lovers could
                  <br className="d-xl-block d-none" />
                  discover unique pieces that speak to their soul. From delicate
                  <br className="d-xl-block d-none" />
                  everyday essentials to statement pieces that turn heads, we
                  <br className="d-xl-block d-none" />
                  curate collections that celebrate individuality and style.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flat-spacing-15">
        <div className="container">
          <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
              <div>
                <div className="heading">Our mission</div>
                <div className="text">
                  Our mission is to help you express your unique story through
                  <br className="d-xl-block d-none" />
                  beautiful, quality jewelry. We believe that jewelry is more than
                  <br className="d-xl-block d-none" />
                  just an accessory - it's a form of self-expression, a way to
                  <br className="d-xl-block d-none" />
                  celebrate life's precious moments, and a reflection of your
                  <br className="d-xl-block d-none" />
                  inner sparkle. Every piece we offer is chosen with love and care.
                </div>
              </div>
            </div>
            <div className="grid-img-group">
              {/* <div className="tf-image-wrap box-img item-1">
                <div className="img-style">
                  <img
                    className="lazyload"
                    src="/images/collections/collection-71.jpg"
                    data-=""
                    alt="img-slider"
                    width={337}
                    height={388}
                  />
                </div>
              </div> */}
              <div className="tf-image-wrap box-img item-2">
                {/* <div className="img-style">
                  <img
                    className="lazyload"
                    src="/images/collections/collection-70.jpg"
                    data-=""
                    alt="img-slider"
                    width={400}
                    height={438}
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}