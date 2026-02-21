## Deduplication Options

The core problem: when you send a message, you get it back from both the `POST` response **and** the `newMessage` socket event.

### Option 1: Skip own echoes on socket

```text
socket.on('newMessage') → if msg.senderId === myId, ignore
```

- **Pros:** Simplest, zero overhead
- **Cons:** If the POST fails silently or the response is lost (network hiccup), you miss your own message. Also means you rely entirely on the REST response for your own messages.

### Option 2: Deduplicate by `message.id` in a Set

Store a `Set<string>` of message IDs per conversation. Before inserting, check membership.

- **Pros:** Bulletproof, works for any source (REST, socket, pagination)
- **Cons:** Slight memory overhead (negligible for chat)

### Option 3: Deduplicate by `seq` (ordered Map)

Use a `Map<number, ChatMessage>` keyed by `seq` instead of an array. Render by iterating in `seq` order.

- **Pros:** Dedup is implicit (same `seq` = same slot), ordering is always correct, cursor pagination merges naturally (just add to the Map), no sorting needed
- **Cons:** Slightly more complex store shape

### Option 4: Optimistic UI + reconciliation

Insert a temp message (with a client-generated temp ID) on send. When the socket event arrives, replace the temp with the real one.

- **Pros:** Instant perceived send, best UX
- **Cons:** Most complex — need temp ID tracking, rollback on failure, visual state for "pending"

---

## Recommendation

**Option 3** (`Map<seq, message>` per conversation). Reasons:

- `seq` is already unique per conversation (DB unique index enforces it)
- Pagination merges are free — just spread older messages into the Map
- Ordering is always correct without sorting
- Socket echoes are harmlessly overwritten
- Minimal complexity compared to option 4, more robust than option 1

If you later want instant feedback (option 4), you can layer it on top by reserving a temp `seq = Infinity` and swapping it out.
