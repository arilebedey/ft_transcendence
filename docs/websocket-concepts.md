### Heartbeat

Server periodically sends a `ping` frame, client replies `pong`. If no pong within `pingTimeout`, the connection is considered dead and severed.

**Why it matters:** TCP alone won't tell you a client silently disappeared (user closed laptop lid, network died mid-packet). Without heartbeat, you'd have ghost connections sitting in your client registry forever — you dealt with this in ft_irc with `PING`/`PONG`.

socket.io does this automatically. With raw `ws`, you write your own `setInterval` + tracking.

---

### Binary Support with Automatic Serialization

When you do:

```ts
socket.emit("file", { name: "photo.png", data: someArrayBuffer });
```

socket.io detects the `ArrayBuffer` inside the object, **splits** the payload into a JSON part + binary attachments, sends them as separate frames, and **reassembles** them on the other side transparently.

With raw `ws`, you'd have to decide on a framing protocol yourself — e.g., first 4 bytes = JSON length, then JSON, then raw binary. Basically what you did in ft_irc when mixing text commands with data, except here it's handled for you.

---

### Acknowledgements (Request-Response over WS)

WebSocket is fire-and-forget by design. There's no built-in "response to this specific message." socket.io adds that:

```ts
// Client
socket.emit('createRoom', { name: 'general' }, (response) => {
  // this callback fires when the server explicitly "responds"
  console.log(response); // { id: 42, status: 'ok' }
});

// Server
@SubscribeMessage('createRoom')
handleCreate(@MessageBody() data) {
  const room = this.roomService.create(data);
  return { id: room.id, status: 'ok' }; // ← this goes to the callback
}
```

Under the hood, socket.io attaches a unique packet ID, the server sends back a packet referencing that ID, and the client resolves the right callback. It's essentially what you'd do in IRC with numeric reply codes mapped to commands — but automated.

Without this, you'd manually implement correlation IDs:

```ts
// DIY with raw ws — painful
ws.send(JSON.stringify({ correlationId: 'abc123', event: 'createRoom', ... }));
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.correlationId === 'abc123') { /* match response to request */ }
};
```

---

### Multiplexing (Namespaces)

One TCP connection, multiple independent logical channels:

```ts
// Server
@WebSocketGateway({ namespace: "/chat" })
export class ChatGateway {
  /* ... */
}

@WebSocketGateway({ namespace: "/notifications" })
export class NotifGateway {
  /* ... */
}

// Client
const chat = io("http://localhost:3000/chat");
const notif = io("http://localhost:3000/notifications");
```

`chat` and `notif` share **one underlying WebSocket connection**, but they have:

- Separate event handlers
- Separate rooms
- Separate middleware/auth (you could require auth on `/chat` but not `/notifications`)
- Independent connect/disconnect lifecycle

Think of it like IRC's concept of multiple channels over one TCP socket, but elevated to fully isolated sub-protocols. Without this, you'd either open multiple WS connections (expensive — new TCP handshake + TLS each) or manually prefix/route every message yourself.

---

### Redis Adapter (Scaling)

**The problem:** You deploy 4 NestJS instances behind a load balancer. User A connects to instance 1, user B connects to instance 3. They're in the same room. User A sends a message → instance 1 has no idea user B exists.

**The solution:**

```ts
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

server.adapter(createAdapter(pubClient, subClient));
```

Now every `emit` publishes to Redis pub/sub. All instances subscribe. When instance 1 emits to a room, Redis fans it out to instances 2, 3, 4, which deliver to their local clients.

With raw `ws`, you'd build this entire pub/sub relay yourself — Redis streams, SUBSCRIBE/PUBLISH, client-instance mapping, message deduplication. It's doable (and you'd know how given ft_irc), but it's a significant amount of infra code for something that's a 3-line setup with socket.io.
