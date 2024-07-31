import React from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/ProductApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import Paginate from "../components/Pagination.jsx";
import ProductCarousel from "../components/ProductCarousel.jsx";
import { Link, useParams } from "react-router-dom";
import Meta from "../components/Meta.jsx";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link className="btn btn-dark my-3" to="/">
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" children={error?.data?.message || error.error} />
      ) : (
        <>
          <Meta />
          <h1>Latest Products</h1>
          <Row style={{ justifyContent: "space-around" }}>
            {data.products.map((el) => {
              return (
                <Col key={el._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={el} />
                </Col>
              );
            })}
          </Row>
          <Paginate pages={data.pages} page={data.page} keyword={keyword} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
