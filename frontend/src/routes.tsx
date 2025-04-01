import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import ProductDetails from "./pages/ProductDetails";
import NavigationBar from "./components/Navbar";
import { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
	const token = localStorage.getItem("token");
	return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
	return (
		<Router>
			<NavigationBar />
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/admin"
					element={
						<PrivateRoute>
							<AdminPanel />
						</PrivateRoute>
					}
				/>
				<Route
					path="/admin/products/:id"
					element={
						<PrivateRoute>
							<ProductDetails />
						</PrivateRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Router>
	);
};

export default AppRoutes;
