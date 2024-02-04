import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userId", userData._id); // Store user ID

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error);
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error during login:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="signin">
      <form className="form" onSubmit={handleSignIn}>
        <p className="form-title">Sign in to your account</p>
        <div className="input-container">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign in"}
        </button>
        {error && <p className="error-message">{error}</p>}
        <p className="signup-link">
          Don't have an account?{" "}
          <Link to="/signup" className="link_style">
            <span className="signin__text">Sign up</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
