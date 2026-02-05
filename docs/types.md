## Core Types

### User

```ts
interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
  is_public: boolean;
}
```

Represents a user account. `avatar_url` and `bio` are optional profile customizations.

### Post

```ts
interface Post {
  id: string;
  author_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  like_count: number;
}
```

User-generated content. `author_id` references the Post creator. `like_count` tracks engagement.

### Follow

```ts
interface Follow {
  follower_id: string;
  following_id: string;
  created_at: Date;
}
```

Relationship between users. `follower_id` follows `following_id`. Primary key: `(follower_id, following_id)`.

### Message

```ts
interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: Date;
  read: boolean;
}
```

Real-time chat messages between two users. `read` flag indicates if recipient viewed the message.

## Search & API Types

### SearchResult

```ts
interface SearchResult {
  type: "user" | "post";
  id: string;
  title: string;
  preview: string;
  relevance: number;
}
```

Unified search response. `relevance` is a score (0-1) for result ranking. `type` determines how to render the result.

### ApiResponse

```ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
```

Generic API response wrapper. `T` is the payload type. `error` populated only on failure.

## Authentication Types

### OAuth2Token

```ts
interface OAuth2Token {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: "Bearer";
}
```

OAuth 2.0 token response from provider. `expires_in` in seconds.

### AuthSession

```ts
interface AuthSession {
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}
```

Server-side session after authentication. Used for route protection and API authorization.

## WebSocket Types

### ChatMessage

```ts
interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: Date;
  read: boolean;
}
```

Real-time chat event payload. Sent over WebSocket connection.

### UserPresence

```ts
interface UserPresence {
  user_id: string;
  status: "online" | "offline" | "away";
  last_seen: Date;
}
```

User online status. Broadcast to followers on connection/disconnection.

### FeedUpdate

```ts
interface FeedUpdate {
  type: "new_post" | "deleted_post";
  post_id: string;
  author_id: string;
  timestamp: Date;
}
```

Real-time feed event for followed users' activities.

## Pagination

### PaginationParams

```ts
interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: "created_at" | "like_count";
  sort_order?: "asc" | "desc";
}
```

Query parameters for paginated endpoints.

### PaginatedResponse

```ts
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
```

Paginated data wrapper. `pages` = ceiling(total / limit).

## Localization

### I18nConfig

```ts
interface I18nConfig {
  locale: "en" | "fr" | "de" | "es";
  fallback: "en";
}
```

Supported languages. Add more locales as needed.
