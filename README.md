*This project has been created as part of the 42 curriculum by chrleroy, alebdev, tbabou and pgrataco

# ft_transcendence

**Description**
- **Project name:** ft_transcendence
- **Goal:** A social platform prototype implementing posts, likes, follows, and realtime chat features. The project showcases a full-stack implementation (React + NestJS) with a Postgres database managed via Drizzle ORM and Dockerized deployment.
- **Key features:** user auth, posts, likes, follows, dashboard analytics, realtime chat, file storage (MinIO), responsive frontend.

**Instructions**
- **Prerequisites:** Node.js >= 18, pnpm or npm, Docker & Docker Compose, PostgreSQL (or use Docker), environment variables (see `.env.example`).
- **Setup (development):**

```bash
# from repo root
cp secrets/db_password.txt .env # or create .env with required vars
pnpm install
pnpm --filter server dev # or follow Makefile / docker-compose for full stack
pnpm --filter frontend dev
```

- **Setup (docker):**

```bash
docker compose up --build
```

- **Run tests / lint:** see `Makefile` and `server/package.json` scripts.

**Resources**
- Project docs and internal notes: `docs/` folder.
- Drizzle ORM: https://orm.drizzle.team/
- NestJS: https://docs.nestjs.com/
- React + Vite: https://vitejs.dev/
- AI usage: I used an AI assistant to help draft code changes and documentation (refactoring SQL to Drizzle ORM, drafting `README.md`). The AI aided in drafting and refactoring but all code was reviewed and adapted by the team.

**Team Information**
- alebedev — Role: Tech Lead / Developer. Responsibilities: backend architecture, DB schema, Drizzle integration && code reviews.
- `<login2>` — Role: Scrum master && devloper. Responsibilities: Maintining the Trello && Devops
- `<login3>` — Role: Project Manager / Developer. Responsibilities: frontend and backend devlopment.
- chrleroy — Role: Product Owner / Developer Responsabilites: Enforce system design && responsivness of the front-end

**Project Management**
- Task organization: feature branches, GitHub issues (or similar). Sprint cadence: weekly planning + daily syncs.
- Tools: Trello, Discord for chat, PR reviews on GitHub.

**Technical Stack**
- Frontend: React, Vite, TypeScript, PostCSS
- Backend: NestJS, TypeScript, Drizzle ORM (Postgres), socket.io for realtime
- Database: PostgreSQL — chosen for reliability, relational modeling, and window functions used in analytics.
- Storage: MinIO for object storage (avatars, uploads).
- Deployment: Docker + Docker Compose for local/dev and production images.

**Database Schema (overview)**
- `user` — primary user table (id text PK, name, email, ...)
- `post` — posts by users (id, user_id FK, content, created_at, likes cached)
- `post_like` — like events (id, user_id FK, post_id FK, created_at)
- `follow` — follower relationships (follower_id, following_id, created_at)

Relationships: `post.user_id -> user.id`, `post_like.post_id -> post.id`, `post_like.user_id -> user.id`, `follow.* -> user.id`.

**Features List**
- Authentication (email / token) — Backend & Frontend — `alebedev`
- Post creation / feed — Frontend & Backend — `chrleroy`
- Likes system — Backend & Frontend — `Paul`
- Follow system and dashboard analytics — Backend (Drizzle) — `Paul && chrleroy`
- Realtime chat — Backend (socket.io) + Frontend — `alebedev`
- File uploads / avatars (MinIO) — Backend — `Theo`

**Modules and Points**
- Major modules (2 pts each):
  - Authentication (Major) — Reason: core functionality and security.
  - Realtime Chat (Major) — Reason: websocket architecture and state sync.
  - Posts & Feed (Major) — Reason: core UX and DB interactions.
- Minor modules (1 pt each):
  - Likes, Follows, Profile pages, Dashboard charts.

For each module include implementation notes and which team members worked on them.

**Individual Contributions**
- `alebedev`: backend API endpoints, Drizzle schemas, dashboard analytics.
- `chrleroy`: frontend components, theming, responsive layout, chat UI.
- `tbabou`: CI, Dockerfiles, deployment scripts, storage integration.

**Database Schema (detailed)**
- See `server/drizzle/0000_init_tables.sql` and `server/src/*/*.schema.ts` for Drizzle table definitions.
- Important tables and keys:
  - `post(id serial PK, user_id text FK, content text, created_at timestamp)`
  - `post_like(id serial PK, user_id text FK, post_id int FK, created_at timestamp)`
  - `follow(follower_id text, following_id text, created_at timestamp)` (composite PK)

**Known Limitations**
- Some analytics queries use in-memory accumulation instead of window functions for portability.
- Tests coverage: add more integration tests for socket flows and DB migrations.

**How to contribute**
- Fork the repo, create a feature branch, open a PR with description and linked issue.
- Follow commit message conventions and include tests where applicable.

**License & Credits**
- Add your preferred license here.
- Credits to 42 curriculum and all team members.

---

If you want, I can now:
- fill the placeholders with actual team logins if you provide them, or
- shorten/expand any section, or
- generate a contributors table from your git history.
### Bootstrap

See [`docs/dev-bootstrap.md`](https://github.com/arilebedey/ft_transcendence/blob/main/docs/dev-bootstrap.md) to bootstrap this project on your machine!
