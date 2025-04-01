# Catálogo de E-commerce

Projeto de catálogo de e-commerce simples, desenvolvido com:

- **Backend:** Laravel (utilizando padrões Service & Repository, Response Collections e autenticação via Laravel Sanctum)
- **Frontend:** React com TypeScript e Bootstrap
- **Banco de Dados:** MySQL
- **Containerização:** Docker e Docker Compose

---

## Funcionalidades

- **Exibição de Produtos:** Visualize produtos com detalhes, filtros por categoria e pesquisa.
- **API RESTful:** Endpoints para listagem, exibição, criação, atualização e exclusão de produtos e categorias.
- **Autenticação:** Sistema de registro e login utilizando Laravel Sanctum.
- **Administração:** Interface para gerenciamento de produtos e categorias.
- **Ambiente Containerizado:** Ambiente completo com backend, frontend, banco de dados e phpMyAdmin para gerenciamento do MySQL.

---

## Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Git (opcional, para clonar o repositório)

---

## Instruções de Execução

### 1. Clonando o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Configurando o Backend

1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```
2. Copie o arquivo de exemplo de variáveis de ambiente e ajuste as configurações, se necessário:
   ```bash
   cp .env.example .env
   ```
   As configurações de conexão com o banco devem ser as seguintes:
   ```
   DB_CONNECTION=mysql
   DB_HOST=db
   DB_PORT=3306
   DB_DATABASE=ecommerce_db
   DB_USERNAME=user
   DB_PASSWORD=password
   ```

### 3. Subindo os Containers com Docker Compose

No diretório raiz do projeto, execute:

```bash
docker-compose up -d --build
```

Este comando irá:
- Construir e iniciar os containers para o backend, frontend, MySQL e phpMyAdmin.
- No container do backend, executar os comandos para instalação das dependências, migrações e iniciar o servidor Laravel.

### 4. Acessando a Aplicação

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **phpMyAdmin:** [http://localhost:8081](http://localhost:8081)  
  (Usuário: `root`, Senha: `root`)

---

## Estrutura de Dockerização

### Arquivo `docker-compose.yml`

O arquivo orquestra os seguintes serviços:

- **backend:**  
  - Baseado em `php:8.2-fpm`
  - Executa os comandos: `composer install`, migrações e inicia o servidor Laravel na porta 8000.
  
- **frontend:**  
  - Baseado em `node:18`
  - Instala as dependências e inicia o servidor de desenvolvimento React na porta 3000.
  
- **db:**  
  - Utiliza a imagem `mysql:8.0` com as credenciais e banco de dados configurados.
  - Inclui um healthcheck para garantir que o serviço esteja pronto.
  
- **phpmyadmin:**  
  - Permite gerenciar o banco de dados MySQL via interface web, disponível na porta 8081.

### Dockerfiles

- **Backend:**  
  - Instala extensões PHP necessárias e o Composer.
  - Configura permissões para as pastas de armazenamento e cache.
  
- **Frontend:**  
  - Baseado em Node.js, copia os arquivos do projeto e instala as dependências com npm.

---

## Considerações Finais

Este projeto demonstra boas práticas de desenvolvimento e separação de responsabilidades, além de uma infraestrutura simplificada e escalável utilizando Docker. A containerização facilita a configuração do ambiente de desenvolvimento e pode ser facilmente adaptada para produção.