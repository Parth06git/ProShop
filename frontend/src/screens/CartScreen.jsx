import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (item, qty) => {
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkOutHandler = () => {
    navigate('/login?redirect=/shipping')
  }

  return (
    <Row>
      <Col md={8}>
        <Link className="btn btn-dark my-3" to="/">
          Go Back
        </Link>
        <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <>
            <Message children={"Your Cart is empty"} />
          </>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((el) => (
              <ListGroup.Item key={el._id}>
                <Row>
                  <Col md={2} className="my-2 mx-1">
                    <Image src={el.image} alt={el.name} fluid rounded />
                  </Col>
                  <Col md={3} className="my-2 mx-1">
                    <Link className="product-title-link" to={`/products/${el._id}`}>
                      {el.name}
                    </Link>
                  </Col>
                  <Col md={2} className="my-2 mx-1">
                    ${el.price}
                  </Col>
                  <Col md={2} className="my-2 mx-1">
                    <Form.Control
                      as="select"
                      value={el.qty}
                      onChange={(e) => addToCartHandler(el, Number(e.target.value))}
                    >
                      {[...Array(el.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2} className="my-2 mx-1">
                    <Button
                      type="Button"
                      variant="dark"
                      onClick={() => removeFromCartHandler(el._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3> Quantity: {cartItems.reduce((acc, item) => acc + item.qty, 0)} items</h3>
              <b>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</b>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="Button"
                className="btn-block btn-dark"
                disabled={cartItems.length === 0}
                onClick={checkOutHandler}
              >
                Proceed To Pay
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
