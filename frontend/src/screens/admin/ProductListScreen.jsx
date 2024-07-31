import React from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useDeleteProductMutation, useGetProductsQuery } from "../../slices/ProductApiSlice";
import { Link, useParams } from "react-router-dom";
import CreateProductModal from "../../components/CreateProductModal";
import { toast } from "react-toastify";
import Paginate from "../../components/Pagination";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, refetch, isloading, error } = useGetProductsQuery({ pageNumber });
  const [deleteProduct, { isloading: loadingDelete }] = useDeleteProductMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure, You want to delete this product")) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success("Product Deleted Successfully");
      } catch (error) {
        toast.error(error.error);
      }
    }
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

      {loadingDelete && <Loader />}
      {isloading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.message}</Message>
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
              {data?.products?.map((product) => (
                <tr key={product._id}>
                  <td className="p-3">
                    <Link to={`/products/${product._id}`} style={{ textDecoration: "none" }}>
                      <strong>{product._id}</strong>
                    </Link>
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{product.brand}</td>
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
          <Paginate pages={data?.pages} page={data?.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
