import React, { useState } from "react";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    imageUrl: "",
  });

  const [validation, setValidation] = useState({
    name: true,
    price: true,
    description: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));

    setValidation((prevValidation) => ({
      ...prevValidation,
      [name]: true,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct((prevProduct) => ({
      ...prevProduct,
      image: file || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isNameValid = product.name.trim() !== "";
    const isPriceValid = product.price.trim() !== "";
    const isDescriptionValid = product.description.trim() !== "";

    setValidation({
      name: isNameValid,
      price: isPriceValid,
      description: isDescriptionValid,
    });

    if (!isNameValid || !isPriceValid || !isDescriptionValid) {
      console.error("Please fill out all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);

      if (product.image) {
        formData.append("image", product.image);
      }

      if (product.imageUrl) {
        formData.append("imageUrl", product.imageUrl);
      }

      const response = await fetch("http://localhost:3001/addProduct", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Product added successfully!");
        setProduct({
          name: "",
          price: "",
          description: "",
          image: null,
          imageUrl: "",
        });
      } else {
        console.error("Error adding product:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  const handleRemoveProduct = () => {
    setProduct({
      name: "",
      price: "",
      description: "",
      image: null,
      imageUrl: "",
    });

    setValidation({
      name: true,
      price: true,
      description: true,
    });
  };

  return (
    <div className="productform">
      <form className="form" onSubmit={handleSubmit}>
        <p className="form-title">Enter Product Details</p>
        <div className="input-container">
          <input
            type="text"
            id="name"
            placeholder="Enter Product Name"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
          {!validation.name && (
            <span className="warning">Please enter a product name.</span>
          )}
        </div>
        <div className="input-container">
          <input
            type="number"
            id="price"
            placeholder="Enter Price"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
          {!validation.price && (
            <span className="warning">Please enter a valid price.</span>
          )}
        </div>
        <div className="input-container">
          <textarea
            id="description"
            name="description"
            placeholder="Enter Product Description"
            value={product.description}
            onChange={handleChange}
          />
          {!validation.description && (
            <span className="warning">Please enter a product description.</span>
          )}
        </div>
        <div className="input-container-img">
          <label htmlFor="imageUrl">External Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="input-container-img">
          <label htmlFor="image">Local Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {product.image && (
          <div className="input-container-img">
            <p>Selected Image:</p>
            <img
              src={URL.createObjectURL(product.image)}
              alt="Selected Product"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}
        <div className="submit-container">
          <button className="submit" type="submit">
            Add Product
          </button>
          <button
            className="submit-peach"
            type="button"
            onClick={handleRemoveProduct}
          >
            Clear Selection
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
