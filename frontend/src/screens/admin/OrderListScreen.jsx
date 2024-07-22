import React from "react";
import { Table } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetAllOrdersQuery } from "../../slices/orderApiSlice";
import { Link } from "react-router-dom";

const OrderListScreen = () => {
  const { data: orders, isloading, error } = useGetAllOrdersQuery();

  return (
    <>
      <h1>Orders</h1>
      {isloading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <td>
                  <Link to={`/orders/${order._id}`} style={{ textDecoration: "none" }}>
                    <strong>{order._id}</strong>
                  </Link>
                </td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : <FaTimes />}</td>
                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <FaTimes />}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
