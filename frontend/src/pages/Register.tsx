import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Form, Button } from "react-bootstrap";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await api.post("/register", { name, email, password });
			localStorage.setItem("token", response.data.token);
			navigate("/admin");
		} catch (error) {
			alert("Erro ao fazer registro");
			console.error(error);
		}
	};

	return (
		<Container>
			<h1>Registrar</h1>
			<Form onSubmit={handleRegister}>
				<Form.Group className="mb-3">
					<Form.Label>Nome</Form.Label>
					<Form.Control 
						type="text" 
						value={name} 
						onChange={(e) => setName(e.target.value)} 
						required 
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Email</Form.Label>
					<Form.Control 
						type="email" 
						value={email} 
						onChange={(e) => setEmail(e.target.value)} 
						required 
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Senha</Form.Label>
					<Form.Control 
						type="password" 
						value={password} 
						onChange={(e) => setPassword(e.target.value)} 
						required 
					/>
				</Form.Group>
				<Button type="submit">Registrar</Button>
			</Form>
		</Container>
	);
};

export default Register;
