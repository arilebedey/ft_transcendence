# ELK Logging Events Reference

All events are sent to Logstash via TCP (port `5101`) by the `CustomLogger` class and indexed in Elasticsearch under `ft_transcendence-logs-YYYY.MM.dd`.

Events with `level: "event"` are **structured business/security events** that can be filtered and visualized in Kibana.  
Events with `level: "log" | "warn" | "error"` are standard NestJS log output also forwarded to Logstash.

**Kibana quick filter for all structured events:**
```kql
level : "event"
```

---

## Table of Contents

- [Authentication](#authentication)
- [Security](#security)
- [Posts](#posts)
- [Likes](#likes)
- [Follows](#follows)
- [Common Fields](#common-fields)

---

## Authentication

> Source: `server/src/auth/auth-config.module.ts` — context: `AuthHook`

### `auth.signin`

Fired when a user successfully signs in.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"auth.signin"` |
| `userId` | `string` | Better Auth user ID |
| `userName` | `string` | Username |
| `email` | `string` | User email |
| `userProfileUrl` | `string` | Link to the user's profile |
| `ip` | `string` | Client IP address (supports `x-forwarded-for`) |
| `userAgent` | `string` | Browser / client User-Agent string |

```kql
event_type : "auth.signin"
```

---

### `auth.signin_failed`

Fired when a sign-in attempt fails (wrong email or wrong password). No session is created.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"auth.signin_failed"` |
| `reason` | `string` | Always `"invalid_credentials"` |
| `attemptedEmail` | `string` | Email submitted in the request |
| `ip` | `string` | Client IP address |
| `userAgent` | `string` | Browser / client User-Agent string |
| `severity` | `string` | `"high"` |

```kql
event_type : "auth.signin_failed"
```

> **Brute-force detection tip:** Multiple `auth.signin_failed` events from the same `ip` in a short time window indicate a brute-force attack. Create a Kibana alert on this pattern.

---

### `auth.signup`

Fired when a new account is successfully created.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"auth.signup"` |
| `userId` | `string` | Newly created user ID |
| `userName` | `string` | Username chosen by the user |
| `email` | `string` | Email address |
| `userProfileUrl` | `string` | Link to the user's profile |
| `ip` | `string` | Client IP address |
| `userAgent` | `string` | Browser / client User-Agent string |

```kql
event_type : "auth.signup"
```

---

### `auth.signup_failed`

Fired when a sign-up attempt is rejected due to a validation rule.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"auth.signup_failed"` |
| `reason` | `string` | See reasons below |
| `ip` | `string` | Client IP address |
| `userAgent` | `string` | Browser / client User-Agent string |

**Possible `reason` values:**

| `reason` | Extra fields | Description |
|---|---|---|
| `username_already_taken` | `attemptedUsername: string` | The username is already in use |
| `missing_required_fields` | `missingFields: string` | Comma-separated list of missing fields (e.g. `"username, email"`) |

```kql
event_type : "auth.signup_failed"
```

```kql
# See which rule was violated
event_type : "auth.signup_failed" AND reason : "username_already_taken"
```

---

## Security

> Source: `auth-config.module.ts`, `posts.service.ts`, `follow.service.ts`

### `security.unauthorized_post_update`

Fired when a user attempts to edit a post they do not own.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"security.unauthorized_post_update"` |
| `attackerId` | `string` | ID of the user making the attempt |
| `attackerName` | `string` | Username of the attacker |
| `attackerProfileUrl` | `string` | Profile link |
| `postId` | `number` | Target post ID |
| `postUrl` | `string` | Direct link to the post |
| `ownerId` | `string` | ID of the actual post owner |
| `severity` | `string` | `"high"` |

```kql
event_type : "security.unauthorized_post_update"
```

---

### `security.unauthorized_post_delete`

Fired when a user attempts to delete a post they do not own.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"security.unauthorized_post_delete"` |
| `attackerId` | `string` | ID of the user making the attempt |
| `attackerName` | `string` | Username of the attacker |
| `attackerProfileUrl` | `string` | Profile link |
| `postId` | `number` | Target post ID |
| `postUrl` | `string` | Direct link to the post |
| `ownerId` | `string` | ID of the actual post owner |
| `severity` | `string` | `"high"` |

```kql
event_type : "security.unauthorized_post_delete"
```

---

### `security.self_follow_attempt`

Fired when a user attempts to follow themselves.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"security.self_follow_attempt"` |
| `userId` | `string` | ID of the user |
| `userName` | `string` | Username |
| `userProfileUrl` | `string` | Profile link |
| `severity` | `string` | `"medium"` |

```kql
event_type : "security.self_follow_attempt"
```

---

### `security.duplicate_follow_attempt`

Fired when a user attempts to follow someone they already follow.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"security.duplicate_follow_attempt"` |
| `followerId` | `string` | ID of the follower |
| `followerName` | `string` | Username of the follower |
| `followingId` | `string` | ID of the target user |
| `followingName` | `string` | Username of the target |
| `severity` | `string` | `"low"` |

```kql
event_type : "security.duplicate_follow_attempt"
```

---

## Posts

> Source: `server/src/posts/posts.service.ts` — context: `PostsService`

### `post.created`

Fired when a post is successfully published.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"post.created"` |
| `userId` | `string` | Author's ID |
| `userName` | `string` | Author's username |
| `userProfileUrl` | `string` | Author's profile link |
| `postId` | `number` | Newly created post ID |
| `postUrl` | `string` | Direct link to the post |

```kql
event_type : "post.created"
```

---

### `post.updated`

Fired when a post is successfully edited by its owner.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"post.updated"` |
| `userId` | `string` | Editor's ID |
| `userName` | `string` | Editor's username |
| `userProfileUrl` | `string` | Editor's profile link |
| `postId` | `number` | Updated post ID |
| `postUrl` | `string` | Direct link to the post |

```kql
event_type : "post.updated"
```

---

### `post.deleted`

Fired when a post is successfully deleted by its owner.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"post.deleted"` |
| `userId` | `string` | Deleter's ID |
| `userName` | `string` | Deleter's username |
| `userProfileUrl` | `string` | Deleter's profile link |
| `postId` | `number` | Deleted post ID |
| `postUrl` | `string` | Direct link to the post |

```kql
event_type : "post.deleted"
```

---

## Likes

> Source: `server/src/likes/likes.service.ts` — context: `LikesService`

### `post.liked`

Fired when a user likes a post.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"post.liked"` |
| `userId` | `string` | User ID |
| `userName` | `string` | Username |
| `userProfileUrl` | `string` | Profile link |
| `postId` | `number` | Liked post ID |
| `postUrl` | `string` | Direct link to the post |
| `totalLikes` | `number` | New total like count on the post |

```kql
event_type : "post.liked"
```

---

### `post.unliked`

Fired when a user removes their like from a post.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"post.unliked"` |
| `userId` | `string` | User ID |
| `userName` | `string` | Username |
| `userProfileUrl` | `string` | Profile link |
| `postId` | `number` | Unliked post ID |
| `postUrl` | `string` | Direct link to the post |
| `totalLikes` | `number` | New total like count on the post |

```kql
event_type : "post.unliked"
```

---

## Follows

> Source: `server/src/follow/follow.service.ts` — context: `FollowService`

### `user.followed`

Fired when a user successfully follows another user.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"user.followed"` |
| `followerId` | `string` | ID of the follower |
| `followerName` | `string` | Username of the follower |
| `followerProfileUrl` | `string` | Follower's profile link |
| `followingId` | `string` | ID of the followed user |
| `followingName` | `string` | Username of the followed user |
| `followingProfileUrl` | `string` | Followed user's profile link |

```kql
event_type : "user.followed"
```

---

### `user.unfollowed`

Fired when a user unfollows another user.

| Field | Type | Description |
|---|---|---|
| `event_type` | `string` | `"user.unfollowed"` |
| `followerId` | `string` | ID of the unfollower |
| `followerName` | `string` | Username of the unfollower |
| `followerProfileUrl` | `string` | Unfollower's profile link |
| `followingId` | `string` | ID of the unfollowed user |
| `followingName` | `string` | Username of the unfollowed user |
| `followingProfileUrl` | `string` | Unfollowed user's profile link |

```kql
event_type : "user.unfollowed"
```

---

## Common Fields

Every structured event (regardless of category) always includes these fields:

| Field | Type | Description |
|---|---|---|
| `level` | `string` | Always `"event"` for structured events |
| `event_type` | `string` | Dot-separated identifier (e.g. `auth.signin`) |
| `message` | `string` | Human-readable summary (e.g. `[event] auth.signin`) |
| `context` | `string` | NestJS service that emitted the event (e.g. `LikesService`) |
| `@timestamp` | `date` | ISO 8601 timestamp parsed by Logstash |
| `tags` | `string[]` | Always `["nestjs", "ft_transcendence"]` |

---

## Kibana Dashboard Suggestions

### Security Dashboard
```kql
# All high-severity security events
severity : "high"

# All security events
event_type : security.*

# All auth failures
event_type : "auth.signin_failed" OR event_type : "auth.signup_failed"

# Potential brute force: many failed sign-ins from same IP
event_type : "auth.signin_failed" AND ip : "<suspect_ip>"
```

### Activity Dashboard
```kql
# All user-generated events
event_type : post.* OR event_type : user.*

# Most active users (aggregate by userName.keyword)
level : "event"
```
