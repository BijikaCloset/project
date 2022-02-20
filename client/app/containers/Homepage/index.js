/**
 *
 * Homepage
 *
 */

import React from "react";
import { connect } from "react-redux";

import actions from "../../actions";
import "./style.css";

class Homepage extends React.PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div>
        <a href="/shop/category/women-shoes">
          <div id="slide" className="bd-example">
            <div
              id="carouselExampleCaptions"
              className="carousel slide"
              data-ride="carousel"
            >
              <ol className="carousel-indicators">
                <li
                  data-target="#carouselExampleCaptions"
                  data-slide-to="0"
                  className="active"
                ></li>
                <li
                  data-target="#carouselExampleCaptions"
                  data-slide-to="1"
                ></li>
                <li
                  data-target="#carouselExampleCaptions"
                  data-slide-to="2"
                ></li>
              </ol>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="https://i.ibb.co/DzX87Xw/off2.jpg"
                    className="d-block w-100 img-fluid"
                    alt="..."
                  />
                  <div className="carousel-caption d-none d-md-block"></div>
                </div>
                <div className="carousel-item">
                  <img
                    src="https://i.ibb.co/R09N1Ny/off1.jpg"
                    className="d-block w-100 img-fluid"
                    alt="..."
                  />
                  <div className="carousel-caption d-none d-md-block"></div>
                </div>
              </div>

              <a
                className="carousel-control-prev"
                href="#carouselExampleCaptions"
                role="button"
                data-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#carouselExampleCaptions"
                role="button"
                data-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
        </a>

        <section></section>

        <section>
          <br />
          <br />
          <br />
          <br />

          <h1 className="text-center">Latest Products</h1>
          <br />
          <br />

          <div className="row">
            <div
              style={{ height: "99%", background: "white" }}
              className=" col-6 p-0 text-center "
            >
              <img
                style={{ width: "99%" }}
                src="https://i.ibb.co/tZ1P1cK/t1.jpg"
              />
            </div>
            <div
              style={{ height: "99%", background: "white" }}
              className=" col-6  p-0 text-center "
            >
              <img
                style={{ width: "99%" }}
                src="https://i.ibb.co/xhbBxrh/t2.jpg"
              />
            </div>

            <div
              style={{ height: "99%", background: "white" }}
              className=" col-6 p-0 text-center  "
            >
              <img
                style={{ width: "99%" }}
                src="https://i.ibb.co/WB81xdm/t3.jpg"
              />
            </div>

            <div
              style={{ height: "99%", background: "white" }}
              className=" col-6  p-0 text-center shop-now-container "
            >
              <img
                style={{ width: "99%" }}
                src="https://i.ibb.co/TtrbQMJ/t4.jpg"
              />
              <div className="shop-now">
                <h2>Women Flat shoes</h2>
                <a
                  className="btn btn-sm btn-danger text-white"
                  href="/shop/category/women-shoes"
                >
                  {" "}
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </section>

        <section>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          <h1 className="text-center">
            Plastic Cups{" "}
            <a
              className="btn btn-sm btn-danger text-white"
              href="/shop/category/plastic-cups"
            >
              {" "}
              Shop Now
            </a>
          </h1>

          <br />
          <br />

          <div className="row cups-container">
            <div className="col-12 col-md-6 pr-md-1 pb-1">
              <img
                style={{ height: "450px" }}
                className="img-fluid"
                src="https://i.ibb.co/wSDPxDr/DSC-1395.jpg"
                alt="DSC-1395"
              />
            </div>

            <div className="col-12 col-md-6 pl-md-1 pb-1">
              <img
                style={{ height: "450px" }}
                className="img-fluid"
                src="https://i.ibb.co/X7BsJ7D/DSC-1429.jpg"
              />
            </div>

            <div className="col-12 col-md-6 pr-md-1 pt-1">
              <img
                style={{ height: "450px", width: "100%" }}
                className="img-fluid"
                src="https://i.ibb.co/VL601Hw/DSC-1432-1.jpg"
              />
            </div>

            <div className="col-12 col-md-6 pl-md-1 pt-1">
              <img
                style={{ height: "450px", width: "100%" }}
                className="img-fluid"
                src="https://i.ibb.co/PTTVvs0/DSC-1437-1.jpg"
              />
            </div>

            {/* <div className = "cups-shop text-center d-none d-md-block " >
        <h2 className = "text-center" > Plastic Cups</h2>
        <a className = "btn btn-sm btn-danger text-white" href = "/shop/category/plastic-cups" >  Shop Now</a>

      </div> */}

            {/* <div className = "cups-shop-mobile text-center d-block d-md-none " >
        <h1 className = "text-center" > Plastic Cups</h1>
        <a className = "btn btn-sm btn-danger text-white" href = "/shop/category/plastic-cups" >  Shop Now</a>

      </div> */}
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, actions)(Homepage);
