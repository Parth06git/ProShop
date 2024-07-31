import React from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/ProductApiSlice";

const ProductCarousel = () => {
  const { data: products, isloading, error } = useGetTopProductsQuery();

  return isloading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.message}</Message>
  ) : (
    <Carousel className="bg-primary mb-4">
      {products?.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/products/${product._id}`}>
            <Image src={product.image} alt={product.name} style={{maxHeight: '600px'}}/>
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
