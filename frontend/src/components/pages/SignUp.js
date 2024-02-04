import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);

        console.log(
          "User registered successfully! Username & Email:",
          formData.userName,
          formData.email
        );
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
        console.error("Error during registration:", errorMessage);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error during registration:", error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="signup">
      <form className="form" onSubmit={handleSubmit}>
        <p className="form-title">Register your account</p>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter username"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
          />
        </div>
        <div className="input-container">
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        {error && <p className="error-message">{error}</p>}
        <p className="signup-link">
          Already have an account?{" "}
          <Link to="/login" className="link_style">
            <span className="signin__text">Sign in</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
