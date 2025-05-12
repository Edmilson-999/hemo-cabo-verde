#  Sistema de Gestão de Hemofílicos - Cabo Verde

Sistema completo para cadastro e acompanhamento de pacientes hemofílicos, com autenticação segura e dashboard médico.

---

## Começando

###  Pré-requisitos

* [Node.js](https://nodejs.org/) (v16+)
* [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* [MongoDB](https://www.mongodb.com/) (Atlas ou local)

---

## 🛠 Configuração Local

### 1. Clone o repositório

```bash
git clone https://github.com/Edmilson-999/projecto-final.git
cd projecto-final
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.mongodb.net/hemo-cv?retryWrites=true&w=majority
JWT_SECRET=seu_segredo_super_forte_aqui
JWT_EXPIRE=24h
PORT=5000
```

### 3. Configurar o Frontend

```bash
cd ../frontend
npm install
```

Crie um arquivo `.env` na pasta `frontend`:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

##  Executando o Sistema

###  Opção 1: Terminal Único (Recomendado)

```bash
cd backend
npm install -g concurrently
npm run dev
```

###  Opção 2: Terminais Separados

```bash
# Terminal 1 (Backend)
cd backend
npm start

# Terminal 2 (Frontend)
cd ../frontend
npm start
```

🔗 Acesse: [http://localhost:3000](http://localhost:3000)

---

##  Primeiro Acesso

1. **Registre um usuário admin**

   * Acesse `/register`
   * Use um e-mail válido e selecione a role "admin"

2. **Funcionalidades disponíveis após login**

   * Cadastro de pacientes
   * Visualização de estatísticas
   * Gestão de usuários (admin)

---

##  Docker (Opcional)

Execute:

```bash
docker-compose up --build
```

🔹 Isso configura automaticamente:

* Backend na porta `5000`
* Frontend na porta `3000`
* MongoDB na porta `27017`

---

##  Solução de Problemas

###  Erro de conexão com MongoDB

Verifique:

* String de conexão no `.env`
* Credenciais no MongoDB Atlas
* IP autorizado em *Network Access*

###  Erros de CORS

Adicione no `backend/server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

##  Estrutura do Projeto

```
projecto-final/
├── backend/
│   ├── controllers/      # Lógica das rotas
│   ├── models/           # Modelos do MongoDB
│   ├── routes/           # Definições de rotas
│   └── server.js         # Ponto de entrada do servidor
├── frontend/
│   ├── public/           # Assets estáticos
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas principais
│   │   └── App.js        # Arquivo principal de rotas
└── README.md
```

---

##  Licença

Este projeto está sob a licença MIT – veja [LICENSE.md](LICENSE.md) para mais detalhes.

---

##  Dicas de Desenvolvimento

```bash
npm install -g nodemon  # Reinício automático do backend
```

-

