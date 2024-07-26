import React, { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col, Card, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useDeleteProfileMutation,
} from "../slices/userApiSlice";
import { useGetMyOrdersQuery } from "../slices/orderApiSlice";
import { setCredentials } from "../slices/authSlice";
import { FaTimes, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  let user = userInfo.data.user;
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: loadingUpdatePassword }] = useUpdatePasswordMutation();
  const [deleteProfile] = useDeleteProfileMutation();

  const { data: orders, isLoading: loadingOrders, error } = useGetMyOrdersQuery();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [setName, setEmail, user]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({ name, email }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Profile Updated");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New Password and Confirm Password doesn't match");
    }
    try {
      const res = await updatePassword({ currentPassword, newPassword, confirmPassword }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Profile Updated");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await deleteProfile({ currentPassword }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Profile Deleted");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Row>
        <Col md={3}>
          <Card className=" my-2 p-2">
            <h4>User Profile</h4>

            <Form onSubmit={handleProfileUpdate}>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="email" className="my-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="dark" className="my-2">
                Update Profile
              </Button>

              {loadingUpdateProfile && <Loader />}
            </Form>
          </Card>

          <Card className=" my-2 p-2">
            <h4>Update your Password</h4>

            <Form onSubmit={handlePasswordUpdate}>
              <Form.Group controlId="currentPassword" className="my-2">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Your Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="newPassword" className="my-2">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="confirmPassword" className="my-2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="dark"
                className="my-2"
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                Update Password
              </Button>

              {loadingUpdatePassword && <Loader />}
            </Form>
          </Card>

          <Button variant="danger" className="my-2" onClick={handleShow}>
            <FaTrash /> Delete Me
          </Button>
        </Col>
        <Col md={9}>
          <h2>My Orders</h2>
          {loadingOrders ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error?.data?.message || error.error}</Message>
          ) : (
            <>
              <Table striped hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/orders/${order._id}`} style={{ textDecoration: "none" }}>
                          <strong>{order._id}</strong>
                        </Link>
                      </td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? `Paid on ${order.paidAt.substring(0, 10)}` : <FaTimes />}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          `Delivered on ${order.deliveredAt.substring(0, 10)}`
                        ) : (
                          <FaTimes />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDelete}>
            <Form.Group controlId="current Password" className="my-2">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Your Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="danger" className="my-2">
              <FaTrash /> Delete Me
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfileScreen;
