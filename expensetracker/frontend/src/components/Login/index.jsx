import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./style.css"; // Ensure you have your styling here
import { useNavigate } from "react-router-dom"; // Use useNavigate to navigate

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoader, setIsLoader] = useState(false); // State for handling loader
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Get saved user data from localStorage
  const savedUserData = JSON.parse(localStorage.getItem("userData") || []);

  // Check if saved user data exists
  // useEffect(() => {
  //   if (!savedUserData) {
  //     setErrorMessage("No user found. Please sign up first!");
  //   }
  // }, [savedUserData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoader(true); // Show loader while validating login

    // If no saved user data exists in localStorage, show error
    if (!savedUserData) {
      setErrorMessage("No user found. Please sign up first!");
      setIsLoader(false);
      return;
    }

    // Validate login credentials
    if (
      formData.email === savedUserData.email &&
      formData.password === savedUserData.password
    ) {
      setErrorMessage(""); // Clear any previous error message

      // After successful login, navigate to home page
      console.log("Login successful!");
      navigate("/"); // Redirect to home page (make sure the route is defined)
    } else {
      setErrorMessage("Invalid credentials. Please try again.");
    }

    setIsLoader(false); // Stop loader after checking credentials
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <div className="login-container">
        <div className="login-section">
          <h3 className="login-title">Expense Tracker Login</h3>

          <Form onSubmit={handleSubmit}>
            {/* Email Input */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Password Input */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Error Message */}
            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}

            <Button
              variant="primary"
              type="submit"
              className="login-btn"
              disabled={isLoader}
            >
              Login
            </Button>
            {/* Login Button */}

            {/* Loader */}
            {isLoader && <div className="loader">Loading...</div>}

            {/* Register New Account */}
            <div className="register-link">
              <p>
                New to Expense Tracker?{" "}
                <a href="/register">Create an account</a>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
