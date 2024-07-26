import React, { useEffect } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useDeleteUserMutation, useGetAllUsersQuery } from "../../slices/userApiSlice";
import { toast } from "react-toastify";

const UserListScreen = () => {
  const { data: users, refetch, isloading, error } = useGetAllUsersQuery();
  const [deleteUser, { isloading: loadingDelete }] = useDeleteUserMutation();

  useEffect(() => {
    if (users) {
      refetch();
    }
  }, [users, refetch]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure, You want to delete the user ${name}`)) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User Deleted Successfully");
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
      </Row>

      {loadingDelete && <Loader />}
      {isloading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <td className="p-3">{user._id}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.isAdmin ? <FaCheck /> : <FaTimes />}</td>
                <td>
                  <LinkContainer to={`/admin/users/${user._id}/edit`}>
                    <Button variant="dark" className="btn-sm m-2">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    onClick={() => handleDelete(user._id, user.name)}
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
      )}
    </>
  );
};

export default UserListScreen;
