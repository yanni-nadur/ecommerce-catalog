import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import api from "../services/api";

interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	image_url: string;
	category_id: number;
}

const ProductDetails = () => {
	const { id } = useParams();
	const [product, setProduct] = useState<Product | null>(null);

	useEffect(() => {
		api.get(`/products/${id}`)
		.then(response => {
			setProduct(response.data.data);
		})
		.catch(error => console.error("Erro ao carregar produto", error));
	}, [id]);

	if (!product) return <p>Carregando...</p>;

	return (
		<Container className="my-5">
			<Row className="justify-content-center">
				<Col md={8}>
					<Card className="shadow">
						<Card.Img 
							variant="top" 
							src={product.image_url} 
							alt={product.name} 
							className="img-fluid" 
							style={{ objectFit: "cover", height: "400px" }}
						/>
						<Card.Body>
							<Card.Title className="text-center mb-3">{product.name}</Card.Title>
							<Card.Text>{product.description}</Card.Text>

							<Card.Text className="h4 text-center text-primary my-3">
								R$ {Number(product.price).toFixed(2)}
							</Card.Text>
							
							<div className="d-flex justify-content-center">
								<Link to="/admin">
									<Button variant="secondary">Voltar</Button>
								</Link>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default ProductDetails;
