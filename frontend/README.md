# Book Manager — Frontend

Interface web do sistema de gerenciamento de livros, desenvolvida com **React + TypeScript + Tailwind CSS**.

🔗 **[Acessar aplicação](https://book-manager-inky-theta.vercel.app/)**

> **Nota sobre o ambiente de demonstração:** o backend está hospedado no Render em um plano que pode suspender a aplicação após um período de inatividade (*cold start*). Quando isso ocorre, a primeira requisição pode levar alguns segundos enquanto a API é inicializada. Após a inicialização, a aplicação funciona normalmente.

A aplicação consome a API REST do backend utilizando autenticação JWT.

---

## Funcionalidades

* Cadastro e login de usuários
* Autenticação com JWT
* CRUD de livros
* CRUD de autores
* Associação de autores aos livros
* Paginação e busca por título
* Proteção de rotas autenticadas
* Validação de formulários
* Tratamento de erros da API
* Layout responsivo

---

## Tecnologias

* React 18
* TypeScript
* Vite
* React Router
* Axios
* Tailwind CSS

---

## Pré-requisitos

* Node.js 18+
* npm 9+
* Backend da aplicação em execução

---

## Configuração

Crie um arquivo `.env` na pasta `frontend`:

```env
VITE_API_URL=http://localhost:8080
```

O valor deve apontar para a URL da API backend.

---

## Executando localmente

Certifique-se de estar na pasta `frontend` antes de executar os comandos abaixo.

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```


A aplicação estará disponível em:

```text
http://localhost:5173
```

---

## Scripts

| Comando           | Descrição                            |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Inicia o servidor de desenvolvimento |
| `npm run build`   | Gera o build de produção             |
| `npm run preview` | Executa o build localmente           |

---

## Rotas

| Rota              | Acesso      | Descrição                  |
| ----------------- | ----------- | -------------------------- |
| `/register`       | Público     | Cadastro de usuário        |
| `/login`          | Público     | Login                      |
| `/books`          | Autenticado | Listagem e busca de livros |
| `/books/new`      | Autenticado | Cadastro de livro          |
| `/books/:id/edit` | Autenticado | Edição de livro            |
| `/authors`        | Autenticado | Gerenciamento de autores   |

---

## Autenticação

O frontend utiliza JWT fornecido pelo backend.

Após o login, o token é armazenado no `localStorage` e enviado automaticamente nas requisições autenticadas.

Rotas protegidas redirecionam usuários não autenticados para `/login`.

---


## Backend

O backend da aplicação está disponível na pasta:

```text
../backend
```

Consulte o [README do backend](../backend/README.md) para instruções de configuração e execução.

---

## Autor

**Diogo Lemos**

Projeto desenvolvido como parte de um desafio técnico de processo seletivo.
