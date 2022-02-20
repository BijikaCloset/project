/**
 *
 * ProductList
 *
 */

import React from "react";

import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const ProductList = (props) => {
  const { products } = props;

  const showProduct = () => {
    // console.log(products);
  };

  return (
    <div className="product-list">
      {console.log(products)}
      <Row>
        {products.map((product, index) => (
          <Col
            onLoad={showProduct()}
            xs="12"
            md="4"
            lg="3"
            key={index}
            className="mb-3"
          >
            {console.log(product)}
            <div className="product-container">
              <div className="item-box">
                <div className="item-details">
                  <img className="img-thumbnail" src={product.image} />
                  <br />
                  <div className="item-body">
                    <Link to={`/product/${product.slug}`} className="item-link">
                      <h1 className="item-name">{product.name}</h1>
                      {product.brand && (
                        <p className="by">
                          By <span>{product.brand.name}</span>
                        </p>
                      )}
                      <p className="item-desc">{product.description}</p>
                    </Link>
                  </div>
                  <div className="item-footer">
                    <p className="price">${product.price}</p>
                    {product.quantity > 0 ? (
                      <p className="stock in-stock">In stock</p>
                    ) : (
                      <p className="stock out-of-stock">Out of stock</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
