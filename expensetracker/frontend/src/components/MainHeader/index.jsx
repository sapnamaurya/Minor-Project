import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import logo from "../../assests/Icons/logo.jpg";
import Navbar from "react-bootstrap/Navbar";
import { useLocation, useNavigate } from "react-router";
import "./style.css";
import { useState } from "react";
//import Home from "../Home";

const MainHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const { name = [], image = [] } = user || {};
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    setUser();
  };
  const handleLogin = () => {
    navigate("/login");
  };
  const handleHome = () => {
    navigate("/mainpage");
  };
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary navbar">
        <Container fluid className="backgound">
          <Navbar.Brand href="#">
            <img className="logo " src={logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link className="links" onClick={handleHome}>
                Home
              </Nav.Link>
              <Nav.Link href="#action2" className="links">
                Personal
              </Nav.Link>

              <Nav.Link href="#" className="links">
                Business
              </Nav.Link>
              <Nav.Link href="#" className="links">
                About
              </Nav.Link>
              <Nav.Link href="#" className="links">
                Help
              </Nav.Link>
            </Nav>
            {!user?.email && location.pathname !== "/login" && (
              <Button
                variant="outline-success"
                className="btn"
                onClick={handleLogin}
              >
                Login
              </Button>
            )}
            <div className="user-cont">
              <img className="user-img" src={image} />
              <p className="username">{name}</p>
            </div>
            {user?.email && (
              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <Home /> */}
    </>
  );
};

export default MainHeader;
