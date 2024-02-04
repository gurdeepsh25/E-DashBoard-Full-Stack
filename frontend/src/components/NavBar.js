import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const auth = localStorage.getItem("user");
  const user = auth ? JSON.parse(auth) : null;
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    // Open the confirmation modal
    setModalOpen(true);
  };

  const handleStayHere = () => {
    // Close the confirmation modal
    setModalOpen(false);
  };

  const handleLogoutConfirm = () => {
    // Perform logout actions here
    localStorage.removeItem("user");
    navigate("/signup");

    // Close the confirmation modal
    setModalOpen(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <span>
          <Link className="link">EcoMetrics</Link>
        </span>
      </div>
      <div className="navbar-ul">
        <ul>
          {auth ? (
            <>
              <Link className="link" to="/">
                <li>Home</li>
              </Link>
              <Link className="link" to="/product">
                <li>Add Product</li>
              </Link>
              <Link className="link" to="/about">
                <li>About</li>
              </Link>
              <Link className="link" to="/contact">
                <li>Contact</li>
              </Link>
              <li>
                <span onClick={handleLogout} className="link">
                  {` Logout (${user.userName})`}
                </span>
              </li>
              <Link className="link" to="/profile">
                <li>Profile</li>
              </Link>
            </>
          ) : (
            <>
              <Link className="link" to="/signup">
                <li>SignUp</li>
              </Link>
              <Link className="link" to="/login">
                <li>SignIn</li>
              </Link>
              <Link className="link" to="/profile">
                <li>Profile</li>
              </Link>
            </>
          )}
        </ul>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-logout">
            <p>Are you sure you want to logout?</p>
            <div className="modal-logout-sub">
              <button className="submit-peach" onClick={handleLogoutConfirm}>
                Logout
              </button>
              <button className="submit" onClick={handleStayHere}>
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
