import React from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetProductsQuery } from "../../slices/ProductApiSlice";
import { Link } from "react-router-dom";
import CreateProductModal from "../../components/CreateProductModal";

const ProductListScreen = () => {
  const { data: products, refetch, isloading, error } = useGetProductsQuery();

  const handleDelete = (id) => {
    console.log("Hi", id);
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <CreateProductModal fn={refetch} />
        </Col>
      </Row>

      {isloading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Caterory</th>
                <th>Brand</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {products?.map((product) => (
                <tr key={product._id}>
                  <td>
                    <Link to={`/products/${product._id}`} style={{ textDecoration: "none" }}>
                      <strong>{product._id}</strong>
                    </Link>
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/products/${product._id}/edit`}>
                      <Button variant="dark" className="btn-sm m-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      onClick={() => handleDelete(product._id)}
                      variant="danger"
                      className="btn-sm"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
