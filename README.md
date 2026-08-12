# 📘 Book Manager — Full-Stack

Aplicação full-stack para gerenciamento de livros com autenticação JWT. Cada usuário gerencia sua própria biblioteca: cria, edita, busca e remove livros, além de cadastrar autores reutilizáveis.

## Tecnologias

### Backend
- Java 21 + Spring Boot 4
- Spring Security + JWT (jjwt 0.13)
- Spring Data JPA + Liquibase (migrations)
- MySQL 8.4
- Lombok
- SpringDoc OpenAPI 3 (Swagger UI)

### Frontend
- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- React Router DOM 6
- Axios

### Infraestrutura
- Docker + Docker Compose
- Deploy backend: Render (com `docker-compose.aiven.yml` para banco externo Aiven)
- Deploy frontend: Vercel

---

## Funcionalidades implementadas

- Cadastro e login de usuários com JWT
- CRUD completo de livros (cada usuário vê e edita apenas os próprios livros)
- CRUD de autores (compartilhado entre usuários)
- Busca de livros por título (parcial, case-insensitive)
- Paginação na listagem de livros
- Proteção de rotas no frontend e backend
- Documentação da API via Swagger UI
- Versionamento do banco com Liquibase
- Dockerização do backend e do banco de dados


## Como executar com Docker (recomendado)

### Pré-requisitos
- Docker e Docker Compose instalados

### 1. Configure as variáveis de ambiente

Copie o `.env.example` para `.env` e ajuste os valores:

```bash
cp .env.example .env
```

```env

SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/bookmanager
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=Teste123**
MYSQL_ROOT_PASSWORD=Teste123**
JWT_SECRET=minha-secreta-para-o-desafio-book-manager
```

### 2. Suba os containers

```bash
docker compose up --build
```

A API estará disponível em `http://localhost:8080`.

O Liquibase cria as tabelas automaticamente na primeira execução.

---

## Como executar o frontend

### Pré-requisitos
- Node.js 18+

### 1. Instale as dependências

```bash
cd frontend
npm install
```

### 2. Configure a URL da API

Crie o arquivo `frontend/.env` (se não existir):

```env
VITE_API_URL=http://localhost:8080
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## Endpoints da API

A documentação completa e interativa está disponível via Swagger UI em:

```
http://localhost:8080/swagger-ui.html
```

### Autenticação (`/auth`)
| Método | Rota             | Descrição              | Auth |
|--------|------------------|------------------------|------|
| POST   | /auth/register   | Cadastrar usuário      | Não  |
| POST   | /auth/login      | Login e retorno do JWT | Não  |

### Livros (`/books`) — requer JWT
| Método | Rota          | Descrição                                  |
|--------|---------------|--------------------------------------------|
| GET    | /books        | Listar livros do usuário (paginado, busca por `title`) |
| POST   | /books/create | Criar livro                                |
| GET    | /books/{id}   | Buscar livro por ID                        |
| PUT    | /books/{id}   | Atualizar livro                            |
| DELETE | /books/{id}   | Excluir livro                              |

### Autores (`/authors`) — requer JWT
| Método | Rota            | Descrição          |
|--------|-----------------|--------------------|
| GET    | /authors        | Listar autores     |
| POST   | /authors        | Criar autor        |
| GET    | /authors/{id}   | Buscar por ID      |
| PUT    | /authors/{id}   | Atualizar autor    |
| DELETE | /authors/{id}   | Excluir autor      |

---

## Modelo de dados

![Diagrama do banco](docs/bookmanagerSchema.png)

---

## Banco de dados

O versionamento do banco é gerenciado pelo **Liquibase**. As migrations ficam em:

```
backend/src/main/resources/db/changelog/
```

Ao subir a aplicação, as tabelas são criadas automaticamente.

---

## Variáveis de ambiente

| Variável                   | Descrição                        |
|----------------------------|----------------------------------|
| `SPRING_DATASOURCE_URL`    | URL JDBC do banco de dados       |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco               |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco                 |
| `MYSQL_ROOT_PASSWORD`      | Senha root do MySQL (Docker)     |
| `JWT_SECRET`               | Chave secreta para assinar o JWT |

---

## Coleção Postman

O arquivo `book-manager.postman_collection.json` na raiz do projeto contém todas as requisições configuradas para testar a API localmente.
