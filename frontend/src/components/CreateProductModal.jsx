import React, { useState } from "react";
import {
  useCreatedProductMutation,
  useUploadProductImageMutation,
} from "../slices/ProductApiSlice";
import { toast } from "react-toastify";
import { Button, Form, Modal } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import Loader from "./Loader";
import { useSelector } from "react-redux";

const CreateProductModal = ({ fn }) => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);

  // Model Control
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [createProduct, { isloading: loadingCreateProduct }] = useCreatedProductMutation();
  const [uploadProductImage, { isLoading: loadingUploadImage }] = useUploadProductImageMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleCreate = async () => {
    if (window.confirm("Are you sure. You want to create new Product?")) {
      try {
        await createProduct({
          name,
          brand,
          category,
          image,
          description,
          price,
          countInStock,
          user: userInfo.data.user._id,
        }).unwrap();
        fn();
        toast.success("Product created");
        setShow(false);
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Button className="btn-sm m-3" variant="dark" onClick={handleShow}>
        <FaEdit /> Create Product
      </Button>

      {loadingCreateProduct && <Loader />}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Caterory</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Image"
                readOnly
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <Form.Control
                label="Choose File"
                className="my-2"
                onChange={uploadFileHandler}
                accept="image/*"
                type="file"
              />
              {loadingUploadImage && <Loader />}
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                rows={4}
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Product Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Count in Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Product count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="dark"
              className="my-2"
              disabled={!name || !brand || !category || !image || !description}
            >
              Create Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateProductModal;
