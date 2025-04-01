# Catálogo de E-commerce

Este projeto é um catálogo simples de e-commerce que permite a exibição de produtos, listagem por categoria e pesquisa de produtos. O projeto foi desenvolvido utilizando:

- **Backend:** Laravel (com padrões Service & Repository, Response Collections e autenticação via Laravel Sanctum)
- **Frontend:** React (usando TypeScript e Bootstrap para a interface)
- **Banco de Dados:** MySQL
- **Containerização:** Docker e Docker Compose

O código segue boas práticas de desenvolvimento, com separação de responsabilidades e organização do projeto. O repositório contém um README com instruções claras para rodar toda a aplicação.

---

## 📋 Escopo do Projeto

### Backend (Laravel + MySQL)
1. **Criação de API RESTful:**
   - **Produtos:**
     - `GET /api/products`: Listar todos os produtos com paginação.
     - `GET /api/products/{id}`: Exibir detalhes de um produto específico.
     - `GET /api/products?category={id}`: Listar produtos por categoria.
     - `GET /api/products?search={query}`: Buscar produtos por nome ou descrição.
   - **Categorias:**
     - `GET /api/categories`: Listar todas as categorias de produtos.
   - **Autenticação:**
     - `POST /api/register`: Registrar um novo usuário (nome, e-mail e senha).
     - `POST /api/login`: Autenticar usuário e gerar token de acesso.
     - `POST /api/logout`: Efetuar logout (endpoint protegido).
   - **Proteção de Endpoints:**
     - Endpoints para criação, edição e exclusão de produtos e categorias são protegidos pelo middleware `auth:sanctum`.

2. **Padrões de Design (Service & Repository):**
   - **Repositories:** Camada de acesso aos dados (ex.: `ProductRepository`, `CategoryRepository`).
   - **Services:** Lógica de negócios (ex.: `ProductService`, `CategoryService`).
   - **Controllers:** Camada de apresentação que recebe as requisições e retorna as respostas utilizando **Response Collections** e **Resources**.

3. **Response Collections:**
   - As respostas da API são padronizadas utilizando **Resources** e **Collections** (ex.: `ProductResource`, `ProductCollection`, `CategoryResource`, `CategoryCollection`).

4. **Banco de Dados:**
   - Tabelas para **produtos**, **categorias** e **usuários**.
   - **População inicial:** O projeto inclui seeders para popular o banco de dados com algumas categorias e produtos, facilitando os testes.

### Frontend (React)
1. **Interface de Usuário:**
   - **Homepage:** Exibe um título de boas-vindas.
   - **Navbar:** Mostra botões de Login e Registro (se o usuário não estiver autenticado) ou Logout (se estiver autenticado).
   - **Login e Registro:** Páginas para autenticação de usuários. Após sucesso, o usuário é redirecionado para o painel administrativo.
   - **Admin Panel:** Páginas para gerenciamento de categorias e produtos:
     - **Aba "Listar":** Exibe listas de categorias e produtos, com filtro por categoria e busca por nome ou descrição.
     - **Aba "Gerenciar":** Permite cadastro/edição de categorias e produtos.
   - **Product Details:** Exibe informações completas de um produto selecionado.

2. **Integração com Backend:**
   - O frontend consome a API do Laravel utilizando **Axios**.
   - O token JWT é armazenado no `localStorage` e é enviado automaticamente nas requisições através de um interceptor.

3. **Estilização:**
   - Utiliza **Bootstrap** e **React-Bootstrap** para uma interface responsiva e simples.

### Docker e Docker Compose
- O projeto é containerizado, com containers separados para o backend, frontend e banco de dados.
- O arquivo `docker-compose.yml` orquestra todos os serviços, facilitando a execução e configuração do ambiente.

---

## 🚀 Instruções para Execução

### Pré-requisitos
- Docker e Docker Compose instalados (veja [Docker](https://www.docker.com/))
- Git (opcional, para clonar o repositório)

### 1. Clonar o Repositório
```bash
git clone https://github.com/yanni-nadur/ecommerce-catalog
cd ecommerce-catalog
```

### 2. Configurar o Backend
1. **Acesse a pasta do backend:**
   ```bash
   cd backend
   ```
2. **Configurar as variáveis de ambiente:**
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Certifique-se de que as configurações do banco estejam corretas no .env:
     ```
     DB_CONNECTION=mysql
     DB_HOST=db
     DB_PORT=3306
     DB_DATABASE=ecommerce_db
     DB_USERNAME=user
     DB_PASSWORD=password
     ```
3. **Suba os containers com Docker Compose (do diretório raiz):**
   ```bash
   docker-compose up -d --build
   ```
4. **Instale as dependências do Laravel (se necessário):**
   ```bash
   docker exec -it laravel_app bash
   composer install
   ```
5. **Gerar a chave da aplicação:**
   ```bash
   php artisan key:generate
   ```
6. **Rodar as migrations e seeders:**
   ```bash
   php artisan migrate --seed
   ```

### 3. Configurar o Frontend
1. **Acesse a pasta do frontend:**
   ```bash
   cd frontend
   ```
2. **Instale as dependências do React:**
   ```bash
   npm install
   ```
3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   - O app será iniciado na URL: `http://localhost:3000`.

### 4. Testar a Aplicação
- Acesse `http://localhost:3000/` e siga os passos descritos na seção **Fluxo para Testar o Projeto**.

---

## 📦 Dockerização do Projeto

### Exemplo de `docker-compose.yml`:

```yaml
version: '3.8'

version: '3.8'

services:
  backend:
    build:
      context: ./backend
    container_name: laravel_app
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./backend:/var/www
    ports:
      - "8000:8000"
    networks:
      - app-network
    depends_on:
      db:
        condition: service_healthy
    command: ["sh", "-c", "composer install && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000"]
    

  frontend:
    build:
      context: ./frontend
    container_name: react_app
    restart: unless-stopped
    working_dir: /app
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    networks:
      - app-network
    depends_on:
      - backend
    environment:
      - CHOKIDAR_USEPOLLING=true
    command: ["npm", "start"]

  db:
    image: mysql:8.0
    container_name: mysql_db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ecommerce_db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - dbdata:/var/lib/mysql
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: phpmyadmin
    restart: unless-stopped
    environment:
      PMA_HOST: db
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "8081:80"
    networks:
      - app-network
    depends_on:
      - db

networks:
  app-network:
    driver: bridge

volumes:
  dbdata:
```

---

## 📖 Conclusão
Este README detalhado cobre a configuração, execução e fluxo de uso do projeto completo (backend e frontend). O projeto atende aos requisitos do escopo e está preparado para ser enviado a um repositório público para avaliação.
