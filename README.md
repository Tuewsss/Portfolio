# 🎧 Portfólio

> Portfólio pessoal feito com **Django** no backend e **React + Next.js** no frontend, consumindo a **API do Spotify** e a **API do GitHub**.

---

## 🇧🇷 Português

E aí! Esse é um projeto do meu portfólio. Fica à vontade pra dar uma olhada, clonar e rodar na sua máquina. Abaixo deixei o passo a passo pra subir tudo certinho.

### 🧩 Tecnologias

- **Backend:** Django (Python)
- **Frontend:** Next.js (React)
- **APIs:** Spotify + GitHub

### 📁 Estrutura

O projeto é dividido em duas pastas:

```
nome-do-projeto/
├── backend/    # Django
└── frontend/   # Next.js
```

### ✅ Antes de começar

Você vai precisar de:

- Python 3.12+ e pip (o Django 6 exige 3.12 ou mais novo)
- Node.js 18+ e npm
- Git

### 📥 Clonando o projeto

```bash
git clone https://github.com/seu-usuario/nome-do-projeto.git
cd nome-do-projeto
```

### ⚙️ Backend (Django)

1. Entra na pasta do backend:

```bash
cd backend
```

2. Cria e ativa o ambiente virtual:

```bash
# criar
python -m venv venv

# ativar (Linux / macOS)
source venv/bin/activate

# ativar (Windows)
venv\Scripts\activate
```

3. Instala as dependências (o famoso `requirements.txt`):

```bash
pip install -r requirements.txt
```

4. Cria o arquivo `.env` na raiz do backend (veja a seção [Variáveis de ambiente](#-variáveis-de-ambiente-env) abaixo).

5. Roda as migrations:

```bash
python manage.py migrate
```

6. Sobe o servidor:

```bash
python manage.py runserver
```

O backend vai rodar em `http://127.0.0.1:8000`.

### 💻 Frontend (Next.js)

Essa parte é bem mais simples. Em outro terminal:

1. Entra na pasta do frontend:

```bash
cd frontend
```

2. Instala as dependências:

```bash
npm install
```

3. Sobe o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend vai rodar em `http://localhost:3000`.

> 💡 Mantenha o backend e o frontend rodando ao mesmo tempo (cada um no seu terminal).

### 🔐 Variáveis de ambiente (`.env`)

Crie um arquivo `.env` dentro da pasta `backend/` com o seguinte conteúdo:

```dotenv
DJANGO_SECRET_KEY=
DJANGO_DEBUG=
DJANGO_ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
CSRF_TRUSTED_ORIGINS=
DATABASE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=
GITHUB_USERNAME=
GITHUB_TOKEN=
```

O que colocar em cada uma:

| Variável | O que é |
|---|---|
| `DJANGO_SECRET_KEY` | Chave secreta do Django. Gera uma nova (não use a do GitHub público!). |
| `DJANGO_DEBUG` | `True` em desenvolvimento, `False` em produção. |
| `DJANGO_ALLOWED_HOSTS` | Hosts permitidos. Em dev: `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | De onde o front pode acessar o back. Em dev: `http://localhost:3000` |
| `CSRF_TRUSTED_ORIGINS` | Necessário só em produção (HTTPS atrás de proxy). Deixa vazio em dev. |
| `DATABASE_URL` | Connection string de Postgres. Deixa vazio em dev — cai pro SQLite local automaticamente. |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Credenciais do [Cloudinary](https://cloudinary.com) (storage de mídia). Deixa vazio em dev — as imagens vão pro disco local. |
| `SPOTIFY_CLIENT_ID` | ID do app no Spotify (veja abaixo). |
| `SPOTIFY_CLIENT_SECRET` | Secret do app no Spotify (veja abaixo). |
| `SPOTIFY_REDIRECT_URI` | Redirect URI cadastrada no app do Spotify. Em dev: `http://127.0.0.1:8000/api/spotify/callback/` |
| `GITHUB_USERNAME` | Seu nome de usuário do GitHub. |
| `GITHUB_TOKEN` | Token pessoal do GitHub (veja abaixo). |

> Pra gerar uma `DJANGO_SECRET_KEY` rapidinho:
> ```bash
> python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
> ```

### 🎵 Configurando a API do Spotify

1. Acessa o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) e faz login.
2. Clica em **Create app**.
3. Dá um nome e descrição qualquer pro app.
4. Em **Redirect URI**, adiciona algo como `http://localhost:8000/callback` (ajuste pra rota que o seu projeto usa).
5. Depois de criar, entra em **Settings** do app.
6. Copia o **Client ID** → cola em `SPOTIFY_CLIENT_ID`.
7. Clica em **View client secret**, copia o **Client Secret** → cola em `SPOTIFY_CLIENT_SECRET`.

> ⚠️ O **Client Secret** é sensível. Nunca commita ele no GitHub. É por isso que ele fica no `.env`.

### 🐙 Configurando o token do GitHub

1. Acessa [github.com/settings/tokens](https://github.com/settings/tokens).
2. Clica em **Generate new token** (pode usar o *fine-grained* ou o *classic*).
3. Dá um nome e define uma validade.
4. Pra ler repositórios públicos, a permissão de leitura de repositórios públicos já basta.
5. Gera o token, copia ele → cola em `GITHUB_TOKEN`.
6. Coloca o seu usuário em `GITHUB_USERNAME`.

> ⚠️ O token aparece **só uma vez**. Copia na hora. E, de novo: nunca commita ele.

### 🚀 Deploy em produção

O site no ar usa quatro serviços, todos no plano gratuito:

| Camada | Serviço | Observação |
|---|---|---|
| Frontend (Next.js) | [Vercel](https://vercel.com) | Root Directory = `frontend` |
| Backend (Django API) | [Render](https://render.com) | Root Directory = `backend`; "dorme" após 15 min sem tráfego e acorda sozinho no próximo acesso (~30-60s) |
| Banco de dados | [Neon](https://neon.com) (Postgres) | Free tier sem expiração |
| Mídia (imagens dos projetos) | [Cloudinary](https://cloudinary.com) | Free tier de 25GB/mês |

Não dá pra hospedar tudo no Vercel: as funções serverless dele têm disco efêmero, então SQLite e imagens enviadas pelo admin seriam perdidos a cada deploy/cold start — por isso o banco e o storage de mídia ficam em serviços externos.

### 🚫 Não esquece do `.gitignore`

Garante que o `.env` não vá pro repositório:

```
.env
venv/
node_modules/
```

---

## 🇺🇸 English

Hey! This is a project from my portfolio. Feel free to take a look, clone it, and run it locally. Below is the step-by-step to get everything up and running.

### 🧩 Tech stack

- **Backend:** Django (Python)
- **Frontend:** Next.js (React)
- **APIs:** Spotify + GitHub

### 📁 Structure

The project is split into two folders:

```
project-name/
├── backend/    # Django
└── frontend/   # Next.js
```

### ✅ Before you start

You'll need:

- Python 3.12+ and pip (Django 6 requires 3.12 or newer)
- Node.js 18+ and npm
- Git

### 📥 Cloning the project

```bash
git clone https://github.com/your-username/project-name.git
cd project-name
```

### ⚙️ Backend (Django)

1. Go into the backend folder:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
# create
python -m venv venv

# activate (Linux / macOS)
source venv/bin/activate

# activate (Windows)
venv\Scripts\activate
```

3. Install the dependencies (the good old `requirements.txt`):

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend root (see [Environment variables](#-environment-variables-env) below).

5. Run the migrations:

```bash
python manage.py migrate
```

6. Start the server:

```bash
python manage.py runserver
```

The backend runs at `http://127.0.0.1:8000`.

### 💻 Frontend (Next.js)

This part is much simpler. In another terminal:

1. Go into the frontend folder:

```bash
cd frontend
```

2. Install the dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000`.

> 💡 Keep both backend and frontend running at the same time (each in its own terminal).

### 🔐 Environment variables (`.env`)

Create a `.env` file inside the `backend/` folder with the following content:

```dotenv
DJANGO_SECRET_KEY=
DJANGO_DEBUG=
DJANGO_ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
CSRF_TRUSTED_ORIGINS=
DATABASE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=
GITHUB_USERNAME=
GITHUB_TOKEN=
```

What goes in each one:

| Variable | What it is |
|---|---|
| `DJANGO_SECRET_KEY` | Django's secret key. Generate a fresh one (don't use the one from your public repo!). |
| `DJANGO_DEBUG` | `True` in development, `False` in production. |
| `DJANGO_ALLOWED_HOSTS` | Allowed hosts. In dev: `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Where the frontend can reach the backend from. In dev: `http://localhost:3000` |
| `CSRF_TRUSTED_ORIGINS` | Only needed in production (HTTPS behind a proxy). Leave empty in dev. |
| `DATABASE_URL` | Postgres connection string. Leave empty in dev — falls back to local SQLite automatically. |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | [Cloudinary](https://cloudinary.com) credentials (media storage). Leave empty in dev — files go to local disk instead. |
| `SPOTIFY_CLIENT_ID` | Your Spotify app ID (see below). |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify app secret (see below). |
| `SPOTIFY_REDIRECT_URI` | Redirect URI registered on the Spotify app. In dev: `http://127.0.0.1:8000/api/spotify/callback/` |
| `GITHUB_USERNAME` | Your GitHub username. |
| `GITHUB_TOKEN` | Your GitHub personal access token (see below). |

> To quickly generate a `DJANGO_SECRET_KEY`:
> ```bash
> python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
> ```

### 🎵 Setting up the Spotify API

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in.
2. Click **Create app**.
3. Give it any name and description.
4. Under **Redirect URI**, add something like `http://localhost:8000/callback` (match whatever route your project uses).
5. After creating it, open the app's **Settings**.
6. Copy the **Client ID** → paste it into `SPOTIFY_CLIENT_ID`.
7. Click **View client secret**, copy the **Client Secret** → paste it into `SPOTIFY_CLIENT_SECRET`.

> ⚠️ The **Client Secret** is sensitive. Never commit it to GitHub. That's exactly why it lives in `.env`.

### 🐙 Setting up the GitHub token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens).
2. Click **Generate new token** (either *fine-grained* or *classic* works).
3. Give it a name and set an expiration date.
4. To read public repos, read-only access to public repositories is enough.
5. Generate the token, copy it → paste it into `GITHUB_TOKEN`.
6. Put your username in `GITHUB_USERNAME`.

> ⚠️ The token is shown **only once**. Copy it right away. And again: never commit it.

### 🚀 Production deploy

The live site runs across four free-tier services:

| Layer | Service | Note |
|---|---|---|
| Frontend (Next.js) | [Vercel](https://vercel.com) | Root Directory = `frontend` |
| Backend (Django API) | [Render](https://render.com) | Root Directory = `backend`; sleeps after 15 min idle and auto-wakes on the next request (~30-60s) |
| Database | [Neon](https://neon.com) (Postgres) | Free tier, no expiry |
| Media (project images) | [Cloudinary](https://cloudinary.com) | 25GB/month free tier |

Everything can't live on Vercel alone: its serverless functions have an ephemeral filesystem, so SQLite and admin-uploaded images would be wiped on every deploy/cold start — that's why the database and media storage are external services.

### 🚫 Don't forget the `.gitignore`

Make sure `.env` never reaches your repo:

```
.env
venv/
node_modules/
```

---

Feito com ☕ e 🎶 / Made with ☕ and 🎶
