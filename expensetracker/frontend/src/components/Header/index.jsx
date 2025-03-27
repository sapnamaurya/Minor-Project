import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import logo from "../../assests/Icons/logo.jpg";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useLocation, useNavigate } from "react-router";
import "./style.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogin = () => {
    navigate("/login");
  };
  return (
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
            <Nav.Link href="#action1" className="links" disabled>
              Home
            </Nav.Link>
            <Nav.Link href="#action2" disabled className="links">
              Personal
            </Nav.Link>

            <Nav.Link href="#" disabled className="links">
              Business
            </Nav.Link>
            <Nav.Link href="#" disabled className="links">
              About
            </Nav.Link>
            <Nav.Link href="#" disabled className="links">
              Help
            </Nav.Link>
          </Nav>
          {location.pathname !== "/login" && (
            <Button
              variant="outline-success"
              className="btn"
              onClick={handleLogin}
            >
              Login
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
