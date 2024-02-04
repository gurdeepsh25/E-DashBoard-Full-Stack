import React, { useState, useEffect } from "react";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    imageFile: null,
  });

  // New state for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/getProducts");
      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
      } else {
        setError(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setError(`Error fetching products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdate = (product) => {
    setUpdateProduct(product);
    setUpdateFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl || "",
      imageFile: null,
    });
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      console.log("Updating product:", updateProduct._id, updateFormData);
  
      const response = await fetch(
        `http://localhost:3001/updateProduct/${updateProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateFormData),
        }
      );
  
      console.log("Update response:", response);
  
      if (response.ok) {
        // Update the product in the state
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === updateProduct._id ? { ...p, ...updateFormData } : p
          )
        );
        console.log("Product updated successfully");
        setUpdateModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error(`Error updating product: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = (productId) => {
    // Open the delete confirmation modal
    setDeleteModalOpen(true);
    setDeleteProductId(productId);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/deleteProduct/${deleteProductId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted product from the state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== deleteProductId)
        );
        console.log("Product deleted successfully");
      } else {
        const errorData = await response.json();
        console.error(`Error deleting product: ${errorData.error}`);
      }

      // Close the delete confirmation modal
      setDeleteModalOpen(false);
      setDeleteProductId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const cancelDelete = () => {
    // Close the delete confirmation modal without deleting
    setDeleteModalOpen(false);
    setDeleteProductId(null);
  };

  return (
    <div className="home">
      <h2>Explore Our Diverse Range of High-Quality Products</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product">
            {product.imageFile ? (
              <img
                src={`http://localhost:3001${product.imageFile}`}
                alt={product.name}
              />
            ) : (
              <img src={product.imageUrl} alt={product.name} />
            )}
            <h3>{product.name}</h3>
            <p className="home-price">₹{product.price}</p>
            <p>{product.description}</p>
            <button
              className="products-update-btn"
              onClick={() => handleUpdate(product)}
            >
              Update
            </button>
            <button
              className="products-delete-btn"
              onClick={() => handleDelete(product._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {updateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setUpdateModalOpen(false)}>
              &times;
            </span>
            <div className="modalform">
              <h3>Update Product</h3>
              <form className="" onSubmit={handleUpdateSubmit}>
                <div className="input-container-img">
                  <label>
                    Name:
                    <input
                      type="text"
                      name="name"
                      placeholder="Product name"
                      value={updateFormData.name}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          name: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div className="input-container-img">
                  <label>
                    Price:
                    <input
                      type="number"
                      name="price"
                      value={updateFormData.price}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          price: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div className="input-container-img">
                  <label>
                    Description:
                    <textarea
                      type="text"
                      name="description"
                      value={updateFormData.description}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          description: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div className="input-container-img">
                  <label>
                    Image URL:
                    <input
                      type="text"
                      name="imageUrl"
                      value={updateFormData.imageUrl}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          imageUrl: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div className="input-container-img">
                  <label>
                    Image File:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          imageFile: e.target.files[0],
                        })
                      }
                    />
                  </label>
                </div>
                <button className="submit" type="submit">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={cancelDelete}>
              &times;
            </span>
            <div className="modalform">
              <h3>Delete Product</h3>
              <p>Are you sure you want to delete this product?</p>
              <div className="delete-btns">
                <button className="products-update-btn" onClick={confirmDelete}>
                  Yes
                </button>
                <button className="products-delete-btn" onClick={cancelDelete}>
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
