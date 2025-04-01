import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Category {
	id: number;
	name: string;
}

interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	category_id: number;
	image_url: string;
}

const AdminPanel = () => {
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("list");

	const [categories, setCategories] = useState<Category[]>([]);
	const [categoryName, setCategoryName] = useState("");
	const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

	const [products, setProducts] = useState<Product[]>([]);
	const [productForm, setProductForm] = useState({
		id: 0,
		name: "",
		description: "",
		price: 0,
		category_id: 0,
		image_url: ""
	});
	const [editingProductId, setEditingProductId] = useState<number | null>(null);

	const [searchQuery, setSearchQuery] = useState("");
	const [filterCategory, setFilterCategory] = useState("");

	useEffect(() => {
		fetchCategories();
		fetchProducts();
	}, []);

	const fetchCategories = async () => {
		try {
			const response = await api.get("/categories");
			setCategories(response.data.data.categories || []);
		} catch (error) {
			console.error("Erro ao carregar categorias", error);
		}
	};

	const createCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.post("/categories", { name: categoryName });
			setCategoryName("");
			fetchCategories();
		} catch (error) {
			alert("Erro ao criar categoria");
		}
	};

	const startEditCategory = (cat: Category) => {
		setEditingCategoryId(cat.id);
		setCategoryName(cat.name);
		// Muda para a aba "Gerenciar"
		setActiveTab("manage");
	};

	const updateCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingCategoryId) return;
		try {
			await api.put(`/categories/${editingCategoryId}`, { name: categoryName });
			setEditingCategoryId(null);
			setCategoryName("");
			fetchCategories();
		} catch (error) {
			alert("Erro ao atualizar categoria");
		}
	};

	const deleteCategory = async (id: number) => {
		if (!window.confirm("Deseja realmente deletar esta categoria?")) return;
		try {
			await api.delete(`/categories/${id}`);
			fetchCategories();
		} catch (error) {
			alert("Erro ao deletar categoria");
		}
	};

	const fetchProducts = async () => {
		try {
			let queryParams = "";
			if (filterCategory) {
				queryParams += `?category=${filterCategory}`;
			}
			if (searchQuery) {
				queryParams += queryParams ? `&search=${searchQuery}` : `?search=${searchQuery}`;
			}
			const response = await api.get(`/products${queryParams}`);
			setProducts(response.data.data.products || response.data.data || []);
		} catch (error) {
			console.error("Erro ao carregar produtos", error);
		}
	};

	const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		setProductForm({ ...productForm, [e.target.name]: e.target.value });
	};

	const createProduct = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.post("/products", {
				name: productForm.name,
				description: productForm.description,
				price: productForm.price,
				category_id: productForm.category_id,
				image_url: productForm.image_url
			});
			resetProductForm();
			fetchProducts();
		} catch (error) {
			alert("Erro ao criar produto");
		}
	};

	const startEditProduct = (prod: Product) => {
		setEditingProductId(prod.id);
		setProductForm({
			id: prod.id,
			name: prod.name,
			description: prod.description,
			price: prod.price,
			category_id: prod.category_id,
			image_url: prod.image_url
		});
		// Muda para a aba "Gerenciar"
		setActiveTab("manage");
	};

	const updateProduct = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingProductId) return;
		try {
			await api.put(`/products/${editingProductId}`, {
				name: productForm.name,
				description: productForm.description,
				price: productForm.price,
				category_id: productForm.category_id,
				image_url: productForm.image_url
			});
			resetProductForm();
			fetchProducts();
		} catch (error) {
			alert("Erro ao atualizar produto");
		}
	};

	const deleteProduct = async (id: number) => {
		if (!window.confirm("Deseja realmente deletar este produto?")) return;
		try {
			await api.delete(`/products/${id}`);
			fetchProducts();
		} catch (error) {
			alert("Erro ao deletar produto");
		}
	};

	const resetProductForm = () => {
		setEditingProductId(null);
		setProductForm({
			id: 0,
			name: "",
			description: "",
			price: 0,
			category_id: 0,
			image_url: ""
		});
	};

	return (
		<Container>
			<h1 className="mb-4">Painel de Administração</h1>

			<Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || "list")} id="admin-tabs" className="mb-4">
				<Tab eventKey="list" title="Listar">
					<Row className="mb-4">
						<Col md={4}>
							<Form.Group>
								<Form.Label>Filtrar por Categoria</Form.Label>
								<Form.Select
									value={filterCategory}
									onChange={(e) => setFilterCategory(e.target.value)}
								>
									<option value="">Todas as categorias</option>
									{categories.map(cat => (
										<option key={cat.id} value={cat.id}>{cat.name}</option>
									))}
								</Form.Select>
							</Form.Group>
						</Col>
						<Col md={4}>
							<Form.Group>
								<Form.Label>Buscar Produto</Form.Label>
								<Form.Control
									type="text"
									placeholder="Digite nome ou descrição"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</Form.Group>
						</Col>
						<Col md={4} className="d-flex align-items-end">
							<Button onClick={fetchProducts}>Filtrar / Buscar</Button>
						</Col>
					</Row>

					<Row>
						<Col md={6}>
							<h2>Categorias</h2>
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>ID</th>
										<th>Nome</th>
										<th>Ações</th>
									</tr>
								</thead>
								<tbody>
									{categories.map(cat => (
										<tr key={cat.id}>
											<td>{cat.id}</td>
											<td>{cat.name}</td>
											<td>
												<Button variant="warning" size="sm" onClick={() => startEditCategory(cat)}>
													Editar
												</Button>{" "}
												<Button variant="danger" size="sm" onClick={() => deleteCategory(cat.id)}>
													Deletar
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Col>
						<Col md={6}>
							<h2>Produtos</h2>
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>ID</th>
										<th>Nome</th>
										<th>Preço</th>
										<th>Categoria</th>
										<th>Ações</th>
									</tr>
								</thead>
								<tbody>
									{products.map(prod => (
										<tr key={prod.id}>
											<td>{prod.id}</td>
											<td>{prod.name}</td>
											<td>R$ {Number(prod.price).toFixed(2)}</td>
											<td>{prod.category_id}</td>
											<td>
												<Button variant="info" size="sm" onClick={() => navigate(`/admin/products/${prod.id}`)}>
													Detalhes
												</Button>{" "}
												<Button variant="warning" size="sm" onClick={() => startEditProduct(prod)}>
													Editar
												</Button>{" "}
												<Button variant="danger" size="sm" onClick={() => deleteProduct(prod.id)}>
													Deletar
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Col>
					</Row>
				</Tab>

				<Tab eventKey="manage" title="Gerenciar">
					<Row>
						<Col md={6}>
							<h2>Gerenciar Categorias</h2>
							<Form onSubmit={editingCategoryId ? updateCategory : createCategory} className="mb-4">
								<Form.Group className="mb-2">
									<Form.Label>Nome da Categoria</Form.Label>
									<Form.Control
										value={categoryName}
										onChange={e => setCategoryName(e.target.value)}
										required
									/>
								</Form.Group>
								<Button type="submit" variant="primary">
									{editingCategoryId ? "Atualizar Categoria" : "Criar Categoria"}
								</Button>
								{editingCategoryId && (
									<Button variant="secondary" className="ms-2" onClick={() => {
										setEditingCategoryId(null);
										setCategoryName("");
									}}>
										Cancelar
									</Button>
								)}
							</Form>
						</Col>
						<Col md={6}>
							<h2>Gerenciar Produtos</h2>
							<Form onSubmit={editingProductId ? updateProduct : createProduct} className="mb-4">
								<Form.Group className="mb-2">
									<Form.Label>Nome</Form.Label>
									<Form.Control
										name="name"
										value={productForm.name}
										onChange={handleProductChange}
										required
									/>
								</Form.Group>
								<Form.Group className="mb-2">
									<Form.Label>Descrição</Form.Label>
									<Form.Control
										name="description"
										value={productForm.description}
										onChange={handleProductChange}
										required
									/>
								</Form.Group>
								<Form.Group className="mb-2">
									<Form.Label>Preço</Form.Label>
									<Form.Control
										type="number"
										step="0.01"
										name="price"
										value={productForm.price}
										onChange={handleProductChange}
										required
									/>
								</Form.Group>
								<Form.Group className="mb-2">
									<Form.Label>Categoria</Form.Label>
									<Form.Select
										name="category_id"
										value={productForm.category_id}
										onChange={handleProductChange}
										required
									>
										<option value="">Selecione uma categoria</option>
										{categories.map(cat => (
											<option key={cat.id} value={cat.id}>{cat.name}</option>
										))}
									</Form.Select>
								</Form.Group>
								<Form.Group className="mb-2">
									<Form.Label>URL da Imagem</Form.Label>
									<Form.Control
										name="image_url"
										value={productForm.image_url}
										onChange={handleProductChange}
										required
									/>
								</Form.Group>
								<Button type="submit" variant="primary">
									{editingProductId ? "Atualizar Produto" : "Criar Produto"}
								</Button>
								{editingProductId && (
									<Button variant="secondary" className="ms-2" onClick={resetProductForm}>
										Cancelar
									</Button>
								)}
							</Form>
						</Col>
					</Row>
				</Tab>
			</Tabs>
		</Container>
	);
};

export default AdminPanel;
