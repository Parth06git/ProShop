import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../slices/cartSlice";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      return toast.error("Please fill complete details");
    } else {
      dispatch(saveShippingAddress({ address, city, postalCode, country }));
      navigate("/payment");
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <Card className="px-3 py-3">
        <h1>Shipping Details</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="address" className="my-2">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              placeholder="Enter your Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="city" className="my-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              value={city}
              placeholder="Enter your City"
              onChange={(e) => setCity(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="postalCode" className="my-2">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              value={postalCode}
              placeholder="Enter your Postal Code"
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="country" className="my-2">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              value={country}
              placeholder="Enter your Country"
              onChange={(e) => setCountry(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button type="submit" variant="dark" className="my-2 ">
              Continue
            </Button>
          </div>
        </Form>
      </Card>
    </FormContainer>
  );
};

export default ShippingScreen;
