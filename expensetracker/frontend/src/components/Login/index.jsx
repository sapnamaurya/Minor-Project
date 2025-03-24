import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import "./style.css";
import image from "../../assests/Images/login backgroun.jpeg";
const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const handleUsername = (e) => {
    setUserData({ ...userData, email: e.target.value });
  };
  const handlePassword = (e) => {
    setUserData({ ...userData, password: e.target.value });
  };
  const [showPassword, setShowPassword] = useState(false);
  const [btnSignShow, setBtnSignShow] = useState(false);
  const handleSignBtn = () => {
    setBtnSignShow(true);
  };
  const handleSignButton = () => {
    setShowPassword(true);
  };
  const handleLogin = async () => {
    // navigate("/");

    try {
      // setIsLoader(true);
      const api = "https://dummyjson.com/auth/login";
      const response = await axios.post(api, {
        username: "emilys",
        password: "emilyspass",
      });
      const { data = {} } = response || {};
      if (response?.status === 200) {
        localStorage.setItem("userData", JSON.stringify(data));
        window.location.reload();
        // setIsLoader(false);
      }
    } catch (error) {
      console.error(" facing the problem in api", error);
      // setIsLoader(false);
    }
  };

  return (
    <>
      <div id="background-image-login">
        <div id="image-part-section">
          <div className="image-man">welcome Back</div>
          <div className="login-sec">
            <div className="main-container">
              <div className="head-parent">
                <h1 className="head">Login in</h1>
              </div>
              <div className="email-section">
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label id="mob-label">
                      Email or mobile phone number
                    </Form.Label>
                    <Form.Control
                      className="input-email"
                      type="email"
                      placeholder="enter your email"
                      name="email"
                      value={userData?.email}
                      onChange={(e) => handleUsername(e)}
                      onClick={handleSignBtn}
                    />
                  </Form.Group>
                </Form>
                {btnSignShow
                  ? userData?.email.length < 6 && (
                      <p className="valid-section">
                        Please Enter valid
                        {userData?.email.length < 6 && " Email"}
                      </p>
                    )
                  : null}
              </div>
              <div className="password">
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <div className="pass-parent">
                      <Form.Label id="pass-label">Password</Form.Label>
                      {/* <a id="forget2" onClick={handleForget}> */}
                      Forget Password
                      {/* </a> */}
                    </div>
                    <Form.Control
                      className="input-password"
                      type="password"
                      placeholder=" Enter a password"
                      name="password"
                      value={userData?.password}
                      onChange={(e) => handlePassword(e)}
                      onClick={handleSignButton}
                    />
                  </Form.Group>
                </Form>

                {showPassword
                  ? userData?.email.length < 6 && (
                      <p className="valid-section">
                        Please Enter valid
                        {userData?.email.length < 6 && " password"}
                      </p>
                    )
                  : null}
              </div>
              <div className="btn-container">
                <Button
                  variant="warning"
                  type="button"
                  className="sign-btn"
                  onClick={handleLogin}
                  disabled={
                    userData?.email.length < 6 || userData?.password.length < 6
                  }
                >
                  Sign in
                </Button>
              </div>
              {/* {isLoader && <Loader />} */}
              <div className="text">
                <p className="set-text">
                  By continuing, you agree to Amazon's
                  <span className="conditions"> Conditions of Use</span> and
                  <span className="conditions"> Privacy Notice.</span>
                </p>
              </div>
              <div className="check-box">
                <div className="box1">
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check
                      className="box-set"
                      type="checkbox"
                      label="Keep me signed in."
                    />
                  </Form.Group>
                </div>
                <div className="dropdown">
                  <Dropdown as={ButtonGroup}>
                    <Button variant="link" disabled id="detail">
                      Details
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <div className="line">
                <hr className="hr1" />
                <p className="para1">New to Amazon?</p>
                <hr className="hr2" />
              </div>
              <div className="btn2-container">
                <Button className="create-btn">
                  Create your Amazon account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer-part"></div>
    </>
  );
};
export default Login;
