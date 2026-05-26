# Muvin Imóveis

Plataforma imobiliária completa para gestão de imóveis, corretores e leads. O sistema é composto por uma API REST em ASP.NET Core 10, um frontend SPA em React 19 e um banco de dados PostgreSQL 17.

---

## Sumário

- [Requisitos](#requisitos)
- [Rodando localmente](#rodando-localmente)
- [Rodando com Docker](#rodando-com-docker)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Arquitetura](#arquitetura)
- [Estrutura do projeto](#estrutura-do-projeto)
- [API Reference](#api-reference)
- [Deploy](#deploy)

---

## Requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas e nas versões corretas:

| Ferramenta | Versão mínima | Como verificar |
|---|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download/dotnet/10.0) | **10.0** | `dotnet --version` |
| [Node.js](https://nodejs.org/) | **22.x (LTS)** | `node --version` |
| [npm](https://www.npmjs.com/) | **10.x** | `npm --version` |
| [PostgreSQL](https://www.postgresql.org/download/) | **17** | `psql --version` |
| [Docker + Docker Compose](https://docs.docker.com/get-docker/) | **26+** | `docker --version` |
| [EF Core CLI](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) | **10.0** | `dotnet ef --version` |
| Git | qualquer | `git --version` |

> **Nota:** PostgreSQL e Docker são alternativos. Se for rodar localmente sem Docker, você precisa do PostgreSQL instalado. Se for usar Docker, não precisa instalar o PostgreSQL diretamente.

---

## Rodando localmente

Este guia mostra como rodar o projeto do zero em ambiente de desenvolvimento, sem Docker.

### 1. Clone o repositório

```bash
git clone https://github.com/luccasirineu/Muvin.git
cd Muvin
```

### 2. Configure o banco de dados

Certifique-se de que o PostgreSQL está rodando na sua máquina. Crie o banco de dados que será usado pela aplicação:

```sql
-- Conecte ao PostgreSQL como superusuário
psql -U postgres

-- Crie o usuário e o banco (substitua os valores conforme preferir)
CREATE USER muvin_user WITH PASSWORD 'sua_senha_forte';
CREATE DATABASE muvin OWNER muvin_user;
GRANT ALL PRIVILEGES ON DATABASE muvin TO muvin_user;

\q
```

### 3. Configure as variáveis do backend

Navegue até a pasta do backend e copie o arquivo de exemplo:

```bash
cd backend/muvinBackend/muvinBackend
cp appsettings.Development.example.json appsettings.Development.json
```

Abra o arquivo `appsettings.Development.json` e preencha todos os campos marcados com `PREENCHA`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=muvin;Username=muvin_user;Password=sua_senha_forte"
  },
  "Jwt": {
    "SecretKey": "gere-uma-string-aleatoria-com-no-minimo-32-caracteres"
  },
  "CorretorSeed": {
    "Senha": "senha-do-admin-inicial"
  },
  "Email": {
    "Usuario": "seu_email@gmail.com",
    "Senha": "app-password-16-chars-do-gmail"
  },
  "DigitalOcean": {
    "SpacesAccessKey": "sua-do-access-key",
    "SpacesSecretKey": "sua-do-secret-key"
  }
}
```

> **Dica — JWT Secret Key:** Gere uma chave segura com o comando:
> ```bash
> # Linux/macOS
> openssl rand -base64 32
>
> # Windows (PowerShell)
> [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
> ```

> **Dica — Gmail App Password:** Para o campo `Email.Senha`, você **não deve usar sua senha do Google**. Gere um App Password em [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). O resultado é uma string de 16 caracteres.

> **Importante:** O `appsettings.Development.json` está no `.gitignore` e nunca deve ser commitado. Ele contém credenciais sensíveis.

### 4. Instale a ferramenta EF Core CLI (se ainda não tiver)

```bash
dotnet tool install --global dotnet-ef
```

### 5. Execute as migrations

As migrations **não são aplicadas automaticamente** — precisam ser rodadas manualmente antes de subir o servidor pela primeira vez (ou sempre que houver uma nova migration).

```bash
# A partir da pasta backend/muvinBackend/muvinBackend
dotnet ef database update
```

Isso criará todas as tabelas no banco e deixará o schema na versão mais recente.

### 6. Suba o servidor backend

```bash
# A partir da pasta backend/muvinBackend
dotnet run --project muvinBackend --launch-profile Development
```

O servidor estará disponível em: `http://localhost:5000`

Na primeira execução, o sistema cria automaticamente a conta de administrador com as credenciais definidas em `CorretorSeed` no arquivo `appsettings.json`:

| Campo | Valor padrão |
|---|---|
| E-mail | `admin@muvin.com.br` |
| Senha | o valor que você definiu em `CorretorSeed.Senha` |

> **Importante:** Altere a senha do administrador assim que fizer o primeiro login.

### 7. Configure e suba o frontend

Em outro terminal, navegue até a pasta do frontend:

```bash
cd frontend/muvin-frontend
```

Instale as dependências:

```bash
npm install
```

O frontend já está configurado para fazer proxy de requisições `/api` para `http://localhost:5000` via Vite. Nenhuma variável de ambiente adicional é necessária em desenvolvimento.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

### 8. Verifique se tudo está funcionando

| Serviço | URL | O que você deve ver |
|---|---|---|
| Frontend | `http://localhost:5173` | Página inicial do site |
| Painel admin | `http://localhost:5173/admin` | Tela de login |
| API (health) | `http://localhost:5000/api/imoveis` | JSON com lista de imóveis (vazia inicialmente) |

---

## Rodando com Docker

Se preferir não instalar PostgreSQL e .NET localmente, você pode subir toda a stack com Docker Compose.

### 1. Clone o repositório

```bash
git clone https://github.com/luccasirineu/Muvin.git
cd Muvin
```

### 2. Configure as variáveis de ambiente

Navegue até a pasta do backend e copie o arquivo `.env.example`:

```bash
cd backend/muvinBackend
cp .env.example .env
```

Abra o `.env` e preencha todos os valores:

```env
POSTGRES_DB=muvin
POSTGRES_USER=muvin_user
POSTGRES_PASSWORD=senha_forte_aqui

JWT_SECRET_KEY=sua-chave-jwt-minimo-32-caracteres

EMAIL_USUARIO=seu_email@gmail.com
EMAIL_SENHA=app-password-16-chars

DO_ACCESS_KEY=sua-do-access-key
DO_SECRET_KEY=sua-do-secret-key

SEED_SENHA=senha-do-admin-inicial
```

> **Importante:** O `.env` está no `.gitignore`. Nunca o commite no repositório.

### 3. Suba os containers

```bash
# A partir da pasta backend/muvinBackend
docker compose up --build
```

Para rodar em segundo plano:

```bash
docker compose up --build -d
```

O Docker Compose irá:
1. Criar e iniciar o container do PostgreSQL 17
2. Aguardar o banco estar saudável (health check)
3. Buildar e iniciar o container do backend ASP.NET Core
4. Buildar e iniciar o container do frontend (React + Nginx)

### 4. Acesse a aplicação

| Serviço | URL |
|---|---|
| Frontend | `http://localhost:3001` |
| API | `http://localhost:5000` |
| Banco de dados | `localhost:5432` |

### Comandos úteis do Docker

```bash
# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f muvin-backend

# Parar todos os containers
docker compose down

# Parar e remover volumes (apaga os dados do banco)
docker compose down -v

# Reconstruir apenas um serviço
docker compose up --build muvinbackend
```

---

## Variáveis de ambiente

### Backend (`.env` / `appsettings.Development.json`)

| Variável | Obrigatório | Descrição |
|---|---|---|
| `POSTGRES_DB` | Sim | Nome do banco de dados |
| `POSTGRES_USER` | Sim | Usuário do banco |
| `POSTGRES_PASSWORD` | Sim | Senha do banco |
| `JWT_SECRET_KEY` | Sim | Chave de assinatura JWT (mínimo 32 chars) |
| `EMAIL_USUARIO` | Sim | Conta Gmail para envio de e-mails |
| `EMAIL_SENHA` | Sim | App Password do Gmail (16 chars) |
| `DO_ACCESS_KEY` | Sim | Access Key do DigitalOcean Spaces |
| `DO_SECRET_KEY` | Sim | Secret Key do DigitalOcean Spaces |
| `SEED_SENHA` | Sim | Senha do administrador criado na 1ª execução |
| `BACKEND_PORT` | Não | Porta exposta pelo backend (padrão: `5000`) |
| `CORS_ORIGIN` | Não | Origem permitida pelo CORS (padrão: `http://localhost:5173`) |

### Frontend

| Variável | Obrigatório | Descrição |
|---|---|---|
| `VITE_API_URL` | Não (dev) / Sim (prod) | URL base da API. Em dev, o proxy do Vite cuida disso automaticamente. Em produção, deve apontar para a URL pública da API. |

---

## Arquitetura

```
                    ┌─────────────────┐
                    │   Navegador      │
                    └────────┬────────┘
                             │ HTTP
                    ┌────────▼────────┐
                    │  React 19 SPA   │  :5173 (dev) / :3001 (Docker)
                    │  Vite / Nginx   │
                    └────────┬────────┘
                             │ /api/* (proxy)
                    ┌────────▼────────┐
                    │ ASP.NET Core 10 │  :5000 / :8080 (interno Docker)
                    │   REST API      │
                    └────────┬────────┘
                             │
               ┌─────────────┼──────────────┐
               │             │              │
     ┌─────────▼──────┐  ┌───▼──────┐  ┌───▼──────────────┐
     │  PostgreSQL 17  │  │  Gmail   │  │ DigitalOcean     │
     │   (dados)       │  │  SMTP    │  │ Spaces (fotos)   │
     └────────────────┘  └──────────┘  └──────────────────┘
```

### Stack tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend | React + TypeScript | 19.x / 6.x |
| Build tool | Vite | 8.x |
| Backend | ASP.NET Core | 10.0 |
| ORM | Entity Framework Core | 10.0 |
| Banco de dados | PostgreSQL | 17 |
| Autenticação | JWT via HTTP-only cookies | — |
| Hash de senha | BCrypt.Net | 4.x |
| Armazenamento | DigitalOcean Spaces (S3-compatible) | — |
| E-mail | Gmail SMTP | — |
| Containerização | Docker + Docker Compose | 26+ |
| Servidor web (prod) | Nginx | Alpine |

---

## Estrutura do projeto

```
Muvin/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: build + deploy no Droplet
│
├── backend/
│   └── muvinBackend/
│       ├── muvinBackend/        # Projeto ASP.NET Core
│       │   ├── Controllers/     # Endpoints da API
│       │   ├── Data/            # DbContext e Seeder
│       │   ├── DTOs/            # Objetos de transferência de dados
│       │   ├── Enums/           # Enumerações de domínio
│       │   ├── Interfaces/      # Contratos de serviço
│       │   ├── Migrations/      # Histórico de migrations do EF Core
│       │   ├── Models/          # Entidades do banco
│       │   ├── Services/        # Lógica de negócio
│       │   ├── Program.cs       # Entry point e configuração da aplicação
│       │   ├── appsettings.json
│       │   └── appsettings.Development.json  # (não commitado)
│       ├── .env                 # (não commitado)
│       ├── .env.example         # Template de variáveis
│       └── compose.yaml         # Docker Compose
│
├── frontend/
│   └── muvin-frontend/
│       ├── src/
│       │   ├── admin/           # Painel administrativo
│       │   ├── components/      # Componentes reutilizáveis
│       │   ├── screens/         # Páginas públicas
│       │   ├── services/
│       │   │   └── api.ts       # Cliente HTTP centralizado
│       │   ├── types.ts         # Interfaces TypeScript
│       │   ├── App.tsx          # Roteamento principal
│       │   └── index.css        # Design tokens / variáveis CSS
│       ├── vite.config.ts       # Config do Vite + proxy
│       └── package.json
│
└── nginx-host.conf              # Config Nginx para o servidor de produção
```

---

## API Reference

Todos os endpoints são prefixados com `/api`.

### Autenticação

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `POST` | `/corretor/login` | Público | Login com e-mail e senha |
| `POST` | `/corretor/logout` | Autenticado | Logout (invalida o cookie) |
| `GET` | `/corretor/check` | Autenticado | Verifica se a sessão é válida |
| `POST` | `/corretor/esqueci-senha` | Público | Envia nova senha por e-mail |

### Corretor (Admin)

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `GET` | `/corretor/perfil` | Autenticado | Retorna dados do corretor logado |
| `PATCH` | `/corretor/{uuid}` | Autenticado | Atualiza perfil do corretor |

### Imóveis

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `GET` | `/imoveis` | Público | Lista imóveis com paginação |
| `GET` | `/imoveis/busca` | Público | Busca avançada com filtros |
| `GET` | `/imoveis/destaque` | Público | Imóveis em destaque |
| `GET` | `/imoveis/bairros` | Público | Top bairros com mais imóveis |
| `GET` | `/imoveis/{uuid}` | Público | Detalhe de um imóvel |
| `GET` | `/imoveis/{uuid}/proximos` | Público | Imóveis similares/próximos |
| `POST` | `/imoveis` | Autenticado | Cadastra novo imóvel |
| `PUT` | `/imoveis/{uuid}` | Autenticado | Atualiza imóvel |
| `DELETE` | `/imoveis/{uuid}` | Autenticado | Remove imóvel |
| `PATCH` | `/imoveis/{uuid}/destaque` | Autenticado | Altera status de destaque |

### Leads

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `POST` | `/leads` | Público | Cadastra novo lead (contato) |
| `GET` | `/leads` | Autenticado | Lista todos os leads |
| `PATCH` | `/leads/{uuid}/status` | Autenticado | Atualiza status do lead |

### Dashboard

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `GET` | `/dashboard/stats` | Autenticado | Estatísticas gerais |
| `GET` | `/dashboard/funil` | Autenticado | Funil de vendas por status de lead |

### Upload

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `POST` | `/upload/foto` | Autenticado | Faz upload de foto para o Spaces |

---

## Deploy

O deploy é feito via **GitHub Actions** para um **Droplet na DigitalOcean** usando Docker Compose.

### Pipeline (`deploy.yml`)

O pipeline possui dois jobs que rodam em sequência:

1. **validate** — Executa em cada push na branch `main`:
   - Instala dependências e faz build do frontend
   - Faz build do backend em modo Release
   - Se qualquer etapa falhar, o deploy é bloqueado

2. **deploy** — Só roda se `validate` passar:
   - Conecta ao Droplet via SSH
   - Faz `git pull` no servidor
   - Roda `docker compose up --build -d`
   - Remove imagens antigas com `docker image prune`

### Secrets necessários no GitHub

Configure os seguintes secrets em **Settings > Secrets and variables > Actions** do repositório:

| Secret | Descrição |
|---|---|
| `DROPLET_HOST` | IP ou hostname do Droplet |
| `DROPLET_USER` | Usuário SSH (ex: `root`) |
| `DROPLET_SSH_KEY` | Chave SSH privada para acesso ao Droplet |
| `DROPLET_PROJECT_PATH` | Caminho absoluto do projeto no servidor (ex: `/opt/muvin`) |

### Setup inicial no servidor

Na primeira vez que configurar o servidor:

```bash
# No Droplet, navegue até a pasta do projeto
cd /opt/muvin/backend/muvinBackend

# Crie o arquivo .env com as variáveis de produção
nano .env

# Suba os containers pela primeira vez
docker compose up --build -d
```

---

## Contribuindo

1. Crie uma branch a partir de `main`: `git checkout -b feature/nome-da-feature`
2. Faça suas alterações e commit
3. Abra um Pull Request para `main`
4. O pipeline de validação (build frontend + build backend) precisa passar antes do merge
