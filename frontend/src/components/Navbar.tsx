import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const NavigationBar = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/");
	};

	return (
		<Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
			<Container>
				<Navbar.Brand as={Link} to="/">E-Commerce</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						{!token ? (
							<>
								<Link to="/login" className="btn btn-primary me-2">
									Login
								</Link>
								<Link to="/register" className="btn btn-success">
									Registrar
								</Link>
							</>
						) : (
							<Button variant="outline-light" onClick={handleLogout}>
								Logout
							</Button>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavigationBar;
