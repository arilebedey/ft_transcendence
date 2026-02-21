## Points Summary

### Chosen modules

| Module                                    | Type  | Points |
| ----------------------------------------- | ----- | ------ |
| Framework (Frontend)                      | Minor | 1      |
| Framework (Backend)                       | Minor | 1      |
| Real-time Features (WebSockets)           | Major | 2      |
| User Interaction (chat, profile, friends) | Major | 2      |
| Public API                                | Major | 2      |
| Custom Design System                      | Minor | 1      |
| ORM                                       | Minor | 1      |
| Standard user management                  | Major | 2      |
| OAuth                                     | Minor | 1      |
| Multiple Languages                        | Minor | 1      |
| Activity analytics dashboard              | Minor | 1      |
| Additional Browsers (2)                   | Minor | 1      |
| Advanced Search                           | Minor | 1      |
| 2FA                                       | Minor | 1      |
| Infrastructure for log management (ELK)   | Major | 2      |

**Total: 20 points**

### Possible modules to get 125/100 (19 pts)

| Module                                 | Type  | Points |
| -------------------------------------- | ----- | ------ |
| Monitoring with Prometheus and Grafana | Major | 2      |
| Strict WAF + HashCorp Vault            | Major | 2      |
| Content moderation AI                  | Minor | 1      |
| Notification System                    | Minor | 1      |
| Server-Side Rendering (SSR)            | Minor | 1      |

---

## Mandatory Requirements

- [x] Web application (frontend + backend + database)
- [x] Git with meaningful commits from all members
- [x] Multi-user support (concurrent sessions handled)
- [ ] Dockerized deployment
- [ ] One command launches the project
- [ ] Privacy Policy & Terms of Service pages
- [ ] No console errors/warnings
- [ ] Responsive design
- [x] Email/password authentication
- [x] Input validation (frontend + backend) -> test w/ big payload
- [ ] .env.example file (no actual secrets)

---

## Feature Tasks - Chosen Modules (outdated - more added)

### Backend Framework (NestJS) - Minor - 1pt

- [ ] Set up environment configuration (.env.example)
- [ ] Implement global exception filter and error handling
- [ ] Add request logging middleware
- [ ] Configure CORS and security headers

### Frontend Framework (React) - Minor - 1pt

- [ ] Set up routing (React Router v6+)
- [ ] Set up state management (Zustand)
- [ ] Create base layout component (header, footer, navigation)
- [ ] Configure API client (TanStack Query)
- [ ] Add environment configuration (.env.example)
- [ ] Set up automated tests (Vitest/Jest) ?

### ORM (DrizzleORM) - Minor - 1pt

- [ ] Define core schema (users, posts, followers, messages)
- [ ] Generate migrations for schema
- [ ] Create type-safe query builders
- [ ] Set up database seeding script
- [ ] Test schema relationships and constraints
- [ ] Document database structure

### Standard User Management & Authentication - Major - 2pts

- [ ] Design user table schema (email, password_hash, created_at, etc.)
- [ ] Implement signup endpoint with validation (email format, password strength)
- [ ] Implement logout endpoint (token invalidation)
- [ ] Add profile retrieval endpoint (`GET /users/:id`)
- [ ] Implement profile update endpoint with authorization check
- [ ] Add avatar upload support with file validation
- [ ] Create user profile page (frontend)

### OAuth 2.0 Authentication - Minor - 1pt

- [ ] Register application with OAuth provider (Google)
- [ ] Implement OAuth flow handler in backend/better-auth
- [ ] Choose whether to link OAuth accounts to existing users or create new accounts
- [ ] Add OAuth login button to frontend
- [ ] Handle OAuth errors gracefully

### User Interaction (Chat + Profile + Friends) - Major - 2pts

**Profile Feature:**

- [ ] Create user profile page component
- [ ] Implement profile viewing (followers, following, stats)
- [ ] Add profile edit form (bio, avatar, preferences)
- [ ] Display user posts on profile

**Friends/Followers System:**

- [ ] Create followers/following table schema
- [ ] Implement follow endpoint (`POST /users/:id/follow`)
- [ ] Implement unfollow endpoint (`DELETE /users/:id/follow`)
- [ ] Create followers list endpoint (`GET /users/:id/followers`)
- [ ] Add follow/unfollow UI buttons and lists

**Basic Chat:**

- [ ] Design messages table schema
- [ ] Create chat conversation list UI
- [ ] Implement message history endpoint (pagination)

### Real-time Features (WebSockets) - Major - 2pts

**WebSocket Setup:**

- [ ] Install Socket.IO or WS library
- [ ] Configure WebSocket server in NestJS gateway
- [ ] Implement WebSocket connection/disconnection handling
- [ ] Add authentication to WebSocket connections

**Real-time Chat:**

- [ ] Implement message broadcasting to recipient
- [ ] Add typing indicator event
- [ ] Implement online/offline status updates
- [ ] Create real-time chat message UI with Socket.IO listener

### Custom Design System - Minor - 1pt

- [ ] Define Tailwind color palette (brand colors, semantic colors)
- [ ] Create reusable Button component (variants: primary, secondary, danger)
- [ ] Create Input component with validation states
- [ ] Create Card component for content containers
- [ ] Add more reusable components as we go
- [ ] Create Avatar component ?
- [ ] Create Modal/Dialog component ?

### Public API with API Key - Major - 2pts

**API Endpoints (5+ CRUD operations):**

- [ ] Implement `GET /api/users` (list users with pagination)
- [ ] Implement `GET /api/users/:id` (get user by ID)
- [ ] Implement `POST /api/posts` (create post via API)
- [ ] Implement `GET /api/posts` (list posts with filters)
- [ ] Implement `DELETE /api/posts/:id` (delete post via API)

**API Key Management:**

- [ ] Create API key table schema (Better Auth has a module for this)
- [ ] Implement API key generation endpoint
- [ ] Add API key validation middleware
- [ ] Implement rate limiting (e.g., 100 req/hour)
- [ ] Document API in Swagger/OpenAPI format ?

### Multiple Languages (i18n) - Minor - 1pt

- [ ] Install i18n library (i18next or similar)
- [ ] Create translation files for 3+ languages (EN, FR, ES)
- [ ] Implement language switcher component
- [ ] Create language selector in settings/header

### User Activity Analytics Dashboard - Minor - 1pt

- [ ] Create analytics retrieval endpoints
- [ ] Build basic stats (total users, posts, messages)
- [ ] Create dashboard component with charts

---

## Additional Features to reach 19 pts (outdated)

**WAF/ModSecurity + HashiCorp Vault (Cybersecurity - Major - 2pts)**

- [ ] Configure strict ModSecurity/WAF rules
- [ ] Block malicious requests (SQL injection, XSS, etc.)
- [ ] HashiCorp Vault integration for secrets management
- [ ] Store OAuth secrets, API keys in Vault (encrypted)
- [ ] Secure credential isolation

**Infrastructure for Log Management (DevOps - Major - 2pts)**

- [ ] Elasticsearch setup for log storage and indexing
- [ ] Logstash pipeline for log collection and transformation
- [ ] Kibana dashboards for visualization
- [ ] Log retention and archiving policies
- [ ] Secure access to all components

**Monitoring System (DevOps - Major - 2pts)**

- [ ] Prometheus setup for metrics collection
- [ ] Configure exporters and integrations
- [ ] Create custom Grafana dashboards
- [ ] Set up alerting rules
- [ ] Secure access to Grafana

**Two-Factor Authentication (User Management - Minor - 1pt)**

- [ ] (TODO) Choose 2FA method (backup codes, TOTP, email sent code)
- [ ] 2FA enable/disable in user settings

**Content Moderation AI (Artificial Intelligence - Minor - 1pt)**

- [ ] With Deepseek 5$ plan?
- [ ] Profanity and inappropriate content detection on posts
- [ ] Auto-warning or auto-delete AI flagged content

**Notification System - HARD (Web - Minor - 1pt)**

- [ ] Real-time notifications for post creation/updates/deletions for followed posts
- [ ] Notification persistence in database
- [ ] WebSocket or HTTP delivery to connected clients
- [ ] Notification read/unread state
- [ ] Broadcast user follow/unfollow events
- [ ] Broadcast post creation events to followers
- [ ] Implement notification center in frontend

**Additional Browsers Support (Accessibility - Minor - 1pt)**

- [ ] Full compatibility with Firefox, Safari, and Edge
- [ ] Cross-browser testing of all features
- [ ] No console errors or warnings
- [ ] Consistent UI/UX across all browsers

**Advanced Search - Minor - 1pt**

- [ ] Create search index for posts (username, content)
- [ ] Implement backend search endpoint with filters
- [ ] Add search UI with debouncing
- [ ] Implement filter options (by user, date range, etc.)
- [ ] Add pagination to search results
- [ ] Add "no results" and error states
- [ ] Optimize search queries for performance

**Server-Side Rendering (SSR) - Minor - 1pt**

- [ ] Set up Next.js OR configure React with Express SSR
- [ ] Create SSR-enabled pages (homepage, user profiles)
- [ ] Implement data fetching for SSR (`getServerSideProps` or equivalent)
- [ ] Set up static generation for public content
- [ ] Optimize bundle size for SSR
- [ ] Test SSR performance and hydration

---
