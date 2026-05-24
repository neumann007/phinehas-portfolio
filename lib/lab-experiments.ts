export type AnnotationType = 'warning' | 'insight'

export interface Annotation {
  line: number
  short: string
  detail: string
  type: AnnotationType
}

export interface CodeAct {
  filename: string
  language: string
  code: string
  annotations: Annotation[]
}

export interface Experiment {
  id: string
  number: number
  title: string
  tag: string
  brief: string
  naive: CodeAct
  expert: CodeAct
  verdict: string
}

export const experiments: Experiment[] = [
  {
    id: 'rate-limiting',
    number: 1,
    title: 'Rate Limiting',
    tag: 'Python · Security',
    brief: 'An API endpoint with no rate limiting. Any client can hammer it thousands of times per second — an open abuse vector.',
    naive: {
      filename: 'api/email.py',
      language: 'python',
      code: `from fastapi import FastAPI

app = FastAPI()

@app.post("/api/send-email")
async def send_email(payload: dict):
    # Process immediately — no throttle
    await email_service.send(
        to=payload["to"],
        subject=payload["subject"],
        body=payload["body"],
    )
    return {"status": "sent"}`,
      annotations: [
        {
          line: 5,
          short: 'No rate limit',
          detail: 'Any client can call this endpoint thousands of times per second. No guards = abuse vector and email bill shock.',
          type: 'warning',
        },
        {
          line: 7,
          short: 'Comment as non-fix',
          detail: 'Noting there\'s no throttle in a comment doesn\'t fix it. The note will outlive the excuse.',
          type: 'warning',
        },
      ],
    },
    expert: {
      filename: 'api/email.py',
      language: 'python',
      code: `from fastapi import FastAPI, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter

@app.post("/api/send-email")
@limiter.limit("5/minute")
async def send_email(request: Request, payload: dict):
    await email_service.send(
        to=payload["to"],
        subject=payload["subject"],
        body=payload["body"],
    )
    return {"status": "sent"}`,
      annotations: [
        {
          line: 5,
          short: 'Key by IP',
          detail: 'Rate limiting keyed by remote address. One IP can\'t exhaust the endpoint without affecting others.',
          type: 'insight',
        },
        {
          line: 10,
          short: '5 per minute',
          detail: 'SlowAPI enforces this per-IP using Redis or memory. Exceeding it returns 429 automatically — zero extra code.',
          type: 'insight',
        },
      ],
    },
    verdict: 'One decorator, one import. SlowAPI slots into FastAPI without touching business logic. Rate limiting should be the default, not the afterthought.',
  },

  {
    id: 'connection-pooling',
    number: 2,
    title: 'Connection Pooling',
    tag: 'Python · Database',
    brief: 'Opening a new database connection on every HTTP request. Under load, this exhausts OS file descriptors and Postgres connection limits.',
    naive: {
      filename: 'api/users.py',
      language: 'python',
      code: `import psycopg2
from fastapi import FastAPI

app = FastAPI()

DATABASE_URL = "postgres://user:pass@localhost/db"

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE id = %s",
        (user_id,)
    )
    user = cursor.fetchone()
    conn.close()
    return {"user": user}`,
      annotations: [
        {
          line: 10,
          short: 'New connection per request',
          detail: 'Each HTTP request opens a fresh TCP handshake to Postgres. Under load, this exhausts OS file descriptors and DB connection limits.',
          type: 'warning',
        },
        {
          line: 17,
          short: 'Manual close — leaks on error',
          detail: 'If an exception is raised between line 10 and 17, the connection leaks. No context manager, no guarantee.',
          type: 'warning',
        },
      ],
    },
    expert: {
      filename: 'api/users.py',
      language: 'python',
      code: `import asyncpg
from fastapi import FastAPI

app = FastAPI()
pool: asyncpg.Pool = None

@app.on_event("startup")
async def startup():
    global pool
    pool = await asyncpg.create_pool(
        dsn="postgres://user:pass@localhost/db",
        min_size=5,
        max_size=20,
    )

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    async with pool.acquire() as conn:
        user = await conn.fetchrow(
            "SELECT * FROM users WHERE id = $1",
            user_id
        )
    return {"user": dict(user)}`,
      annotations: [
        {
          line: 10,
          short: 'Warm pool at startup',
          detail: '5–20 connections created once at boot. Each request borrows a slot and returns it — zero TCP handshake overhead per request.',
          type: 'insight',
        },
        {
          line: 18,
          short: 'Context manager guarantees return',
          detail: 'Even on exception, `pool.acquire()` releases the connection back. Impossible to leak under any error path.',
          type: 'insight',
        },
      ],
    },
    verdict: 'Connection pools are free performance. A single pool of 20 connections serves thousands of concurrent requests. Opening one per request is burning fuel to stand still.',
  },

  {
    id: 'async-task-queue',
    number: 3,
    title: 'Async Task Queue',
    tag: 'Python · Concurrency',
    brief: 'A 30-second report generation blocking the async event loop. One slow request freezes all other users waiting on the same worker.',
    naive: {
      filename: 'api/reports.py',
      language: 'python',
      code: `from fastapi import FastAPI
import time

app = FastAPI()

def generate_report(user_id: int):
    # Simulates heavy computation
    time.sleep(30)
    return {"report": "done"}

@app.post("/reports/generate")
async def create_report(user_id: int):
    result = generate_report(user_id)
    return result`,
      annotations: [
        {
          line: 8,
          short: 'Blocks event loop',
          detail: '`time.sleep` in an async context blocks the entire event loop. No other requests are served for 30 seconds. One user = downtime.',
          type: 'warning',
        },
        {
          line: 12,
          short: 'Sync call in async handler',
          detail: 'Calling a blocking function from an async handler turns your async framework into a single-threaded bottleneck.',
          type: 'warning',
        },
      ],
    },
    expert: {
      filename: 'api/reports.py',
      language: 'python',
      code: `from fastapi import FastAPI
from celery import Celery

app = FastAPI()
celery = Celery("tasks", broker="redis://localhost:6379/0")

@celery.task
def generate_report(user_id: int):
    # Runs in a worker process — never touches web
    heavy_computation(user_id)

@app.post("/reports/generate")
async def create_report(user_id: int):
    task = generate_report.delay(user_id)
    return {"task_id": task.id, "status": "queued"}`,
      annotations: [
        {
          line: 7,
          short: 'Offloaded to worker',
          detail: 'Celery runs this task in a separate process pool. The web server never waits — it queues and moves on.',
          type: 'insight',
        },
        {
          line: 14,
          short: 'Returns in <1ms',
          detail: '`delay()` pushes to Redis and returns a task ID instantly. Client polls for status. Web stays fully responsive.',
          type: 'insight',
        },
      ],
    },
    verdict: 'If a request takes more than ~200ms, it should be a background job. Return a task ID, let the client poll. Never make users wait for your CPU.',
  },

  {
    id: 'caching-strategy',
    number: 4,
    title: 'Caching Strategy',
    tag: 'TypeScript · Performance',
    brief: 'A product catalog query hitting the database on every page load. Data that barely changes is being fetched thousands of times a day.',
    naive: {
      filename: 'lib/products.ts',
      language: 'typescript',
      code: `import { db } from "./database"

export async function getProductCatalog(): Promise<Product[]> {
  const products = await db.query(
    "SELECT * FROM products " +
    "WHERE active = true " +
    "ORDER BY name ASC"
  )
  return products.rows
}

// Called on every page load — thousands of times/day
export async function handler(req: Request) {
  const catalog = await getProductCatalog()
  return Response.json(catalog)
}`,
      annotations: [
        {
          line: 4,
          short: 'DB hit per request',
          detail: 'A product catalog rarely changes. Hitting Postgres on every page load adds 50–200ms latency and burns unnecessary DB capacity.',
          type: 'warning',
        },
        {
          line: 12,
          short: 'Comment admits the problem',
          detail: 'If you know it\'s called thousands of times a day, the next call should be a cache hit — not a database query.',
          type: 'warning',
        },
      ],
    },
    expert: {
      filename: 'lib/products.ts',
      language: 'typescript',
      code: `import { db } from "./database"
import { redis } from "./redis"

const CACHE_KEY = "product:catalog"
const TTL_SECONDS = 300

export async function getProductCatalog(): Promise<Product[]> {
  const cached = await redis.get(CACHE_KEY)
  if (cached) return JSON.parse(cached)

  const products = await db.query(
    "SELECT * FROM products " +
    "WHERE active = true " +
    "ORDER BY name ASC"
  )

  await redis.setex(CACHE_KEY, TTL_SECONDS, JSON.stringify(products.rows))
  return products.rows
}

export async function handler(req: Request) {
  const catalog = await getProductCatalog()
  return Response.json(catalog)
}`,
      annotations: [
        {
          line: 8,
          short: 'Cache-first',
          detail: 'Redis lookup averages <1ms. The DB query only runs when the cache is cold or expired — a rare event.',
          type: 'insight',
        },
        {
          line: 17,
          short: 'setex = set + expire',
          detail: 'Writes value and TTL atomically. After 5 minutes, the key expires and the next request repopulates — stale data impossible.',
          type: 'insight',
        },
      ],
    },
    verdict: 'Cache what doesn\'t change. A 5-minute TTL reduces DB load by 99%+ for high-traffic read paths. The hardest part is knowing when to invalidate — expiry is a safe default.',
  },

  {
    id: 'jwt-validation',
    number: 5,
    title: 'JWT Validation',
    tag: 'TypeScript · Security',
    brief: 'Decoding a JWT without verifying its signature. Anyone can craft a token claiming any role and gain admin access.',
    naive: {
      filename: 'auth/token.ts',
      language: 'typescript',
      code: `import { atob } from "buffer"

export function getUserFromToken(token: string) {
  const parts = token.split(".")
  const payload = JSON.parse(
    atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
  )
  return payload
}

// In your auth middleware:
const user = getUserFromToken(req.headers.authorization)
if (user.role === "admin") {
  // Grants access based on unverified token
  allowAdminAccess()
}`,
      annotations: [
        {
          line: 5,
          short: 'Decode ≠ verify',
          detail: 'base64 decode reads the payload but never checks the cryptographic signature. Anyone can craft a token with any payload.',
          type: 'warning',
        },
        {
          line: 13,
          short: 'Privilege escalation',
          detail: 'An attacker encodes `{"role":"admin"}` in base64, sends it as a JWT payload. This code accepts it as legitimate.',
          type: 'warning',
        },
      ],
    },
    expert: {
      filename: 'auth/token.ts',
      language: 'typescript',
      code: `import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET!

export function getUserFromToken(token: string) {
  try {
    const payload = jwt.verify(token, SECRET, {
      algorithms: ["HS256"],
      issuer: "api.yourapp.com",
    })
    return payload as UserPayload
  } catch {
    throw new Error("Invalid or expired token")
  }
}

// In your auth middleware:
const user = getUserFromToken(req.headers.authorization)
if (user.role === "admin") {
  allowAdminAccess()
}`,
      annotations: [
        {
          line: 7,
          short: 'Signature verified',
          detail: '`jwt.verify` checks HMAC-SHA256 against your secret. A tampered payload fails cryptographically — no exceptions.',
          type: 'insight',
        },
        {
          line: 8,
          short: 'Algorithm pinned',
          detail: 'Pinning to HS256 prevents the `alg: none` attack where an attacker strips the signature requirement entirely.',
          type: 'insight',
        },
      ],
    },
    verdict: 'Never decode a JWT without verifying it. Decoding is reading — verifying is trusting. The signature is the only thing that separates authentication from impersonation.',
  },

  {
    id: 'go-race-condition',
    number: 6,
    title: 'Race Condition',
    tag: 'Go · Concurrency',
    brief: 'Ten goroutines incrementing a shared counter without synchronization. The result is non-deterministic — run it twice, get two different numbers.',
    naive: {
      filename: 'counter/main.go',
      language: 'go',
      code: `package main

import (
    "fmt"
    "sync"
)

var counter int

func increment(wg *sync.WaitGroup) {
    defer wg.Done()
    for i := 0; i < 1000; i++ {
        counter++
    }
}

func main() {
    var wg sync.WaitGroup
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go increment(&wg)
    }
    wg.Wait()
    fmt.Println(counter) // Rarely 10000
}`,
      annotations: [
        {
          line: 13,
          short: 'Unsynchronized write',
          detail: '`counter++` is read-modify-write — three operations, not one. Ten goroutines race here. `go run -race` will catch this immediately.',
          type: 'warning',
        },
        {
          line: 24,
          short: 'Non-deterministic result',
          detail: 'Final value depends on goroutine scheduling. Could be 7,421. Could be 9,998. Determinism is not luck.',
          type: 'warning',
        },
      ],
    },
    expert: {
      filename: 'counter/main.go',
      language: 'go',
      code: `package main

import (
    "fmt"
    "sync"
    "sync/atomic"
)

var counter int64

func increment(wg *sync.WaitGroup) {
    defer wg.Done()
    for i := 0; i < 1000; i++ {
        atomic.AddInt64(&counter, 1)
    }
}

func main() {
    var wg sync.WaitGroup
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go increment(&wg)
    }
    wg.Wait()
    fmt.Println(counter) // Always 10000
}`,
      annotations: [
        {
          line: 14,
          short: 'Hardware-level atomic',
          detail: '`atomic.AddInt64` compiles to a single CPU instruction (LOCK XADD). No locks, no contention overhead, no races.',
          type: 'insight',
        },
        {
          line: 25,
          short: 'Always 10000',
          detail: 'Every run is deterministic. `go run -race` is silent. The CPU guarantees the increment is indivisible.',
          type: 'insight',
        },
      ],
    },
    verdict: 'The Go race detector is your first line of defense — run it in CI always. For simple counters, `sync/atomic` beats a mutex: no lock overhead, compiler-verified safety.',
  },

  {
    id: 'sql-n-plus-one',
    number: 7,
    title: 'SQL N+1 Query',
    tag: 'Python · Database',
    brief: 'Fetching all users, then querying posts for each one individually. 1,000 users means 1,001 round trips to Postgres.',
    naive: {
      filename: 'queries/users.py',
      language: 'python',
      code: `from models import User, Post
from database import session

def get_users_with_posts():
    users = session.query(User).all()  # 1 query
    result = []
    for user in users:
        posts = (
            session.query(Post)
            .filter(Post.user_id == user.id)
            .all()  # N queries — one per user
        )
        result.append({
            "user": user.name,
            "post_count": len(posts),
        })
    return result`,
      annotations: [
        {
          line: 5,
          short: '1 query here...',
          detail: 'Fetches all users. With 1,000 rows, the loop below will fire 1,000 more queries — one per user.',
          type: 'warning',
        },
        {
          line: 9,
          short: '...N queries here',
          detail: 'For each user, a new round trip to Postgres. 1,000 users = 1,001 total queries. Each costs network latency, parse, and plan overhead.',
          type: 'warning',
        },
      ],
    },
    expert: {
      filename: 'queries/users.py',
      language: 'python',
      code: `from sqlalchemy import func
from models import User, Post
from database import session

def get_users_with_posts():
    rows = (
        session
        .query(User.name, func.count(Post.id))
        .outerjoin(Post, Post.user_id == User.id)
        .group_by(User.id, User.name)
        .all()
    )
    return [
        {"user": name, "post_count": count}
        for name, count in rows
    ]`,
      annotations: [
        {
          line: 7,
          short: '1 query total',
          detail: 'SQLAlchemy emits a single SQL JOIN + GROUP BY. Postgres plans it once and returns all data in one round trip.',
          type: 'insight',
        },
        {
          line: 9,
          short: 'LEFT JOIN handles zero posts',
          detail: '`outerjoin` includes users with no posts — `func.count` returns 0 for them. No data silently dropped.',
          type: 'insight',
        },
      ],
    },
    verdict: 'The N+1 pattern is invisible until production. SQLAlchemy\'s `joinedload` or an explicit JOIN collapses 1,001 queries into 1. Always check what your ORM actually emits.',
  },

  {
    id: 'react-performance',
    number: 8,
    title: 'React Performance',
    tag: 'TypeScript · React',
    brief: 'A product list that re-sorts and creates new event handlers on every parent render — even when the data hasn\'t changed.',
    naive: {
      filename: 'components/ProductList.tsx',
      language: 'typescript',
      code: `function ProductList({ products, onSelect }: Props) {
  const sorted = products
    .filter(p => p.active)
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleClick = (id: string) => {
    analytics.track("product_selected", { id })
    onSelect(id)
  }

  return (
    <ul>
      {sorted.map(p => (
        <ProductRow
          key={p.id}
          product={p}
          onClick={() => handleClick(p.id)}
        />
      ))}
    </ul>
  )
}`,
      annotations: [
        {
          line: 2,
          short: 'Re-runs every render',
          detail: 'filter + sort executes on every parent re-render, even when `products` hasn\'t changed. Expensive with thousands of items.',
          type: 'warning',
        },
        {
          line: 17,
          short: 'New function each render',
          detail: 'Arrow function in JSX creates a new reference every render. Even a memo\'d `ProductRow` re-renders on every parent update.',
          type: 'warning',
        },
      ],
    },
    expert: {
      filename: 'components/ProductList.tsx',
      language: 'typescript',
      code: `import { useMemo, useCallback, memo } from "react"

const ProductRow = memo(function ProductRow(
  { product, onClick }: RowProps
) {
  return <li onClick={() => onClick(product.id)}>{product.name}</li>
})

function ProductList({ products, onSelect }: Props) {
  const sorted = useMemo(
    () => products
      .filter(p => p.active)
      .sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  )

  const handleClick = useCallback((id: string) => {
    analytics.track("product_selected", { id })
    onSelect(id)
  }, [onSelect])

  return (
    <ul>
      {sorted.map(p => (
        <ProductRow key={p.id} product={p} onClick={handleClick} />
      ))}
    </ul>
  )
}`,
      annotations: [
        {
          line: 10,
          short: 'Computed once',
          detail: '`useMemo` memoizes the sort result. Re-runs only when `products` reference changes — not on every parent render.',
          type: 'insight',
        },
        {
          line: 17,
          short: 'Stable reference',
          detail: '`useCallback` returns the same function reference between renders. Memo\'d children skip re-rendering when nothing changed.',
          type: 'insight',
        },
      ],
    },
    verdict: 'Memoization isn\'t premature optimization when the input is large and the parent renders frequently. Profile first — but `useMemo` + `useCallback` + `memo` together is a well-known pattern for list performance.',
  },

  {
    id: 'websocket-resilience',
    number: 9,
    title: 'WebSocket Resilience',
    tag: 'TypeScript · Networking',
    brief: 'A WebSocket client with no reconnection logic. When the server reboots, users are silently disconnected with no way back.',
    naive: {
      filename: 'lib/socket.ts',
      language: 'typescript',
      code: `class SocketClient {
  private ws: WebSocket

  connect(url: string) {
    this.ws = new WebSocket(url)

    this.ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data))
    }

    this.ws.onclose = () => {
      console.log("Connection closed")
      // No reconnection — user silently disconnected
    }

    this.ws.onerror = (err) => {
      console.error("WebSocket error", err)
    }
  }
}`,
      annotations: [
        {
          line: 11,
          short: 'Silent disconnect',
          detail: 'When the server reboots or the connection drops, the client disconnects permanently. User sees a frozen UI with no indication.',
          type: 'warning',
        },
        {
          line: 13,
          short: 'Comment as non-solution',
          detail: 'Acknowledging the absence of a feature in a comment doesn\'t make the feature exist. This will break silently in production.',
          type: 'warning',
        },
      ],
    },
    expert: {
      filename: 'lib/socket.ts',
      language: 'typescript',
      code: `class SocketClient {
  private ws: WebSocket | null = null
  private retries = 0
  private readonly maxRetries = 8

  connect(url: string) {
    this.ws = new WebSocket(url)

    this.ws.onmessage = (event) => {
      this.retries = 0
      this.handleMessage(JSON.parse(event.data))
    }

    this.ws.onclose = () => {
      if (this.retries >= this.maxRetries) return
      const delay = Math.min(1000 * 2 ** this.retries, 30_000)
      setTimeout(() => {
        this.retries++
        this.connect(url)
      }, delay)
    }
  }
}`,
      annotations: [
        {
          line: 16,
          short: 'Exponential backoff',
          detail: 'Delays: 1s, 2s, 4s, 8s… capped at 30s. Prevents thundering herd when a server reboots under load from many clients.',
          type: 'insight',
        },
        {
          line: 10,
          short: 'Reset on success',
          detail: 'A successful message resets the retry counter. The next disconnect starts fresh from 1s — not wherever it left off.',
          type: 'insight',
        },
      ],
    },
    verdict: 'Every persistent connection will drop. The question is whether your client recovers gracefully. Exponential backoff with a cap is the industry standard — implement it once, forget about it forever.',
  },

  {
    id: 'rust-memory',
    number: 10,
    title: 'Rust Memory',
    tag: 'Rust · Performance',
    brief: 'Processing a list of strings with unnecessary clones at every step — allocating three copies of data that could flow through as references.',
    naive: {
      filename: 'src/main.rs',
      language: 'rust',
      code: `fn process_names(names: Vec<String>) -> Vec<String> {
    let mut result = Vec::new();
    for name in names.clone() {
        let upper = name.clone().to_uppercase();
        if upper.len() > 3 {
            result.push(upper.clone());
        }
    }
    result
}

fn main() {
    let names = vec![
        "alice".to_string(),
        "bo".to_string(),
        "charlie".to_string(),
    ];
    let processed = process_names(names.clone());
    println!("{:?}", processed);
}`,
      annotations: [
        {
          line: 3,
          short: 'Clones entire Vec',
          detail: 'Allocates a full copy of the vector on the heap before iteration. The original is never modified — this allocation is wasted.',
          type: 'warning',
        },
        {
          line: 6,
          short: 'Third unnecessary clone',
          detail: '`upper` is owned and unused after this line. `.clone()` here allocates a fourth heap string for no reason.',
          type: 'warning',
        },
      ],
    },
    expert: {
      filename: 'src/main.rs',
      language: 'rust',
      code: `fn process_names(names: &[String]) -> Vec<String> {
    names
        .iter()
        .map(|name| name.to_uppercase())
        .filter(|upper| upper.len() > 3)
        .collect()
}

fn main() {
    let names = vec![
        "alice".to_string(),
        "bo".to_string(),
        "charlie".to_string(),
    ];
    let processed = process_names(&names);
    println!("{:?}", processed);
}`,
      annotations: [
        {
          line: 1,
          short: 'Slice ref — zero cost',
          detail: '`&[String]` borrows the data. No heap allocation, no ownership transfer. Works on Vec, arrays, or any contiguous memory.',
          type: 'insight',
        },
        {
          line: 4,
          short: 'One allocation per result',
          detail: '`.to_uppercase()` allocates only the strings that survive the filter. The iterator chain is lazy — no intermediate Vec.',
          type: 'insight',
        },
      ],
    },
    verdict: 'Rust makes you feel every allocation. That\'s the point. A function that reads data should borrow it — `&[T]` is almost always the right parameter type over `Vec<T>`.',
  },
]
