import React from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/ProductApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";

const HomeScreen = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message
          variant="danger"
          children={error?.data?.message || error.error}
        />
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {products.map((el) => {
              return (
                <Col
                  key={el._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                >
                  <Product product={el} />
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
