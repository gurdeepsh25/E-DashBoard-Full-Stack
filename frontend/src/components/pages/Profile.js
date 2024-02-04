import React, { useState } from "react";

function Profile() {
  const auth = localStorage.getItem("user");
  const currentUser = auth ? JSON.parse(auth) : null;
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    userName: currentUser ? currentUser.userName : "",
    email: currentUser ? currentUser.email : "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("User ID is undefined.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/updateUser/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (response.ok) {
        console.log("User information updated successfully!");

        const updatedUser = {
          ...currentUser,
          userName: formData.userName,
          email: formData.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setTimeout(() => {
          setLoading(false);
          setSuccessMessage("Profile updated successfully!");
          setTimeout(() => {
            setSuccessMessage(null);
          }, 2000);
        }, 2000);
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
        console.error("Error updating user information:", errorMessage);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error updating user information:", error);
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        {currentUser ? (
          <form className="form" onSubmit={handleSubmit}>
            <h2 className="form-title">Edit Profile</h2>
            <div className="input-container-img">
              <label htmlFor="userName">Username:</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
            <div className="input-container-img">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-container-img">
              <label htmlFor="password">New Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button className="submit" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
            {error && <p className="error-message">{error}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
          </form>
        ) : (
          <p>Please log in to view and edit your profile.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
