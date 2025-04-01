import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Form, Button } from "react-bootstrap";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await api.post("/login", { email, password });
			localStorage.setItem("token", response.data.token);
			navigate("/admin");
		} catch (error) {
			alert("Erro ao fazer login");
		}
	};

	return (
		<Container>
			<h1>Login</h1>
			<Form onSubmit={handleLogin}>
				<Form.Group className="mb-3">
					<Form.Label>Email</Form.Label>
					<Form.Control 
						type="email" 
						value={email} 
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
						required 
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Senha</Form.Label>
					<Form.Control 
						type="password" 
						value={password} 
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
						required 
					/>
				</Form.Group>
				<Button type="submit">Entrar</Button>
			</Form>
		</Container>
	);
};

export default Login;
