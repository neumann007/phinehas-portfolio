'use client'

import { useEffect, useRef, useState } from 'react'

type Snippet = { filename: string; language: string; code: string }

const snippets: Snippet[] = [
  {
    filename: 'rate_limiter.py',
    language: 'python',
    code: `import redis
from fastapi import HTTPException

async def rate_limit(user_id: str, limit: int = 100) -> bool:
    key = f"rate:{user_id}:{get_window()}"
    count = await redis_client.incr(key)

    if count == 1:
        await redis_client.expire(key, 60)

    if count > limit:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Slow down."
        )
    return True`
  },
  {
    filename: 'cache_aside.py',
    language: 'python',
    code: `from functools import wraps
import pickle

def cache_aside(ttl: int = 300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{hash(args)}"
            cached = await redis.get(key)

            if cached:
                return pickle.loads(cached)

            result = await func(*args, **kwargs)
            await redis.setex(key, ttl, pickle.dumps(result))
            return result
        return wrapper
    return decorator`
  },
  {
    filename: 'train_model.py',
    language: 'python',
    code: `import torch
import torch.nn as nn

class SignatureNet(nn.Module):
    def __init__(self, input_dim: int, hidden: int = 256):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, hidden),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden, 64)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.encoder(x)

    def similarity(self, a, b) -> float:
        return nn.functional.cosine_similarity(
            self.forward(a), self.forward(b)
        )`
  },
  {
    filename: 'scrape_async.py',
    language: 'python',
    code: `import asyncio
import aiohttp
from bs4 import BeautifulSoup

async def harvest(urls: list[str]) -> list[dict]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    return [r for r in results if not isinstance(r, Exception)]

async def fetch(session, url: str) -> dict:
    async with session.get(url, timeout=10) as res:
        html = await res.text()
        soup = BeautifulSoup(html, "lxml")
        return {
            "url": url,
            "title": soup.title.string,
            "status": res.status
        }`
  },
  {
    filename: 'auth_middleware.py',
    language: 'python',
    code: `from django.http import JsonResponse
import jwt

class TokenAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt = {"/api/auth/login", "/api/health"}

    def __call__(self, request):
        if request.path in self.exempt:
            return self.get_response(request)

        token = request.headers.get("Authorization", "").split(" ")[-1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            request.user_id = payload["sub"]
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired"}, status=401)

        return self.get_response(request)`
  },
  {
    filename: 'task_queue.py',
    language: 'python',
    code: `from celery import shared_task
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    max_retries=3
)
def process_signature(self, signature_id: str):
    try:
        sig = Signature.objects.get(id=signature_id)
        vector = encode_signature(sig.svg_data)
        sig.embedding = vector
        sig.save(update_fields=["embedding"])
        logger.info(f"Processed {signature_id}")
    except Signature.DoesNotExist:
        logger.warning(f"Signature {signature_id} vanished")`
  },
  {
    filename: 'useWebSocket.ts',
    language: 'typescript',
    code: `import { useEffect, useRef, useState } from "react"

export function useWebSocket<T>(url: string) {
    const ws = useRef<WebSocket | null>(null)
    const [data, setData] = useState<T | null>(null)
    const [status, setStatus] = useState<"connecting" | "open" | "closed">("connecting")

    useEffect(() => {
        ws.current = new WebSocket(url)

        ws.current.onopen = () => setStatus("open")
        ws.current.onmessage = (e) => setData(JSON.parse(e.data))
        ws.current.onclose = () => setStatus("closed")

        return () => ws.current?.close()
    }, [url])

    return { data, status }
}`
  },
  {
    filename: 'DeckCard.tsx',
    language: 'typescript',
    code: `interface CardProps {
    signature: string
    author: string
    thought: string
    onFlip?: () => void
}

export const DeckCard = ({ signature, author, thought, onFlip }: CardProps) => {
    const [flipped, setFlipped] = useState(false)

    const handleFlip = () => {
        setFlipped(f => !f)
        onFlip?.()
    }

    return (
        <motion.div
            className="deck-card"
            onClick={handleFlip}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        />
    )
}`
  },
  {
    filename: 'useOptimistic.ts',
    language: 'typescript',
    code: `import { useState, useCallback } from "react"

export function useOptimisticUpdate<T extends { id: string }>(
    items: T[],
    mutate: (item: T) => Promise<T>
) {
    const [optimistic, setOptimistic] = useState<T[]>(items)

    const update = useCallback(async (item: T) => {
        setOptimistic(prev =>
            prev.map(i => i.id === item.id ? item : i)
        )

        try {
            const updated = await mutate(item)
            setOptimistic(prev =>
                prev.map(i => i.id === updated.id ? updated : i)
            )
        } catch {
            setOptimistic(items) // rollback
        }
    }, [items, mutate])

    return { optimistic, update }
}`
  },
  {
    filename: 'animations.ts',
    language: 'typescript',
    code: `import { Variants } from "framer-motion"

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
}

export const fadeSlideUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.34, 1.56, 0.64, 1]
        }
    }
}`
  },
  {
    filename: 'worker_pool.go',
    language: 'go',
    code: `package worker

import "sync"

type Pool struct {
    jobs    chan Job
    results chan Result
    wg      sync.WaitGroup
}

func NewPool(workers int) *Pool {
    p := &Pool{
        jobs:    make(chan Job, 100),
        results: make(chan Result, 100),
    }
    for i := 0; i < workers; i++ {
        p.wg.Add(1)
        go p.run()
    }
    return p
}

func (p *Pool) run() {
    defer p.wg.Done()
    for job := range p.jobs {
        p.results <- job.Execute()
    }
}`
  },
  {
    filename: 'circuit_breaker.go',
    language: 'go',
    code: `package resilience

import (
    "errors"
    "sync/atomic"
    "time"
)

type CircuitBreaker struct {
    failures  atomic.Int32
    threshold int32
    timeout   time.Duration
    openAt    atomic.Int64
}

func (cb *CircuitBreaker) Call(fn func() error) error {
    if cb.isOpen() {
        return errors.New("circuit open: service unavailable")
    }

    if err := fn(); err != nil {
        cb.failures.Add(1)
        if cb.failures.Load() >= cb.threshold {
            cb.openAt.Store(time.Now().UnixNano())
        }
        return err
    }

    cb.failures.Store(0)
    return nil
}`
  },
  {
    filename: 'router.go',
    language: 'go',
    code: `package api

import (
    "net/http"
    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
)

func NewRouter(h *Handler) http.Handler {
    r := chi.NewRouter()

    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    r.Use(middleware.RealIP)
    r.Use(rateLimiter(100))

    r.Route("/api/v1", func(r chi.Router) {
        r.Use(authenticate)
        r.Get("/signatures", h.ListSignatures)
        r.Post("/signatures", h.CreateSignature)
        r.Get("/signatures/{id}", h.GetSignature)
    })

    return r
}`
  },
  {
    filename: 'event_bus.go',
    language: 'go',
    code: `package events

import "sync"

type Bus struct {
    mu          sync.RWMutex
    subscribers map[string][]chan Event
}

func (b *Bus) Subscribe(topic string) <-chan Event {
    b.mu.Lock()
    defer b.mu.Unlock()

    ch := make(chan Event, 32)
    b.subscribers[topic] = append(b.subscribers[topic], ch)
    return ch
}

func (b *Bus) Publish(topic string, event Event) {
    b.mu.RLock()
    defer b.mu.RUnlock()

    for _, ch := range b.subscribers[topic] {
        select {
        case ch <- event:
        default:
            // drop if subscriber is slow
        }
    }
}`
  },
  {
    filename: 'connection_pool.rs',
    language: 'rust',
    code: `use std::sync::{Arc, Mutex};
use std::collections::VecDeque;

pub struct Pool<T> {
    connections: Arc<Mutex<VecDeque<T>>>,
    max_size: usize,
}

impl<T> Pool<T> {
    pub fn new(max_size: usize) -> Self {
        Self {
            connections: Arc::new(Mutex::new(VecDeque::new())),
            max_size,
        }
    }

    pub fn acquire(&self) -> Option<T> {
        self.connections.lock().unwrap().pop_front()
    }

    pub fn release(&self, conn: T) {
        let mut pool = self.connections.lock().unwrap();
        if pool.len() < self.max_size {
            pool.push_back(conn);
        }
    }
}`
  },
  {
    filename: 'tokenizer.rs',
    language: 'rust',
    code: `#[derive(Debug, PartialEq)]
pub enum Token {
    Ident(String),
    Number(f64),
    Str(String),
    Punct(char),
    EOF,
}

pub fn tokenize(input: &str) -> Vec<Token> {
    let mut tokens = Vec::new();
    let mut chars = input.chars().peekable();

    while let Some(&ch) = chars.peek() {
        match ch {
            'a'..='z' | 'A'..='Z' | '_' => {
                let ident: String = chars
                    .by_ref()
                    .take_while(|c| c.is_alphanumeric() || *c == '_')
                    .collect();
                tokens.push(Token::Ident(ident));
            }
            _ => { chars.next(); }
        }
    }
    tokens
}`
  },
  {
    filename: 'bloom_filter.rs',
    language: 'rust',
    code: `use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

pub struct BloomFilter {
    bits: Vec<bool>,
    k: usize,
}

impl BloomFilter {
    pub fn new(size: usize, k: usize) -> Self {
        Self { bits: vec![false; size], k }
    }

    pub fn insert<T: Hash>(&mut self, item: &T) {
        for seed in 0..self.k {
            let idx = self.hash(item, seed) % self.bits.len();
            self.bits[idx] = true;
        }
    }

    pub fn contains<T: Hash>(&self, item: &T) -> bool {
        (0..self.k).all(|seed| {
            self.bits[self.hash(item, seed) % self.bits.len()]
        })
    }
}`
  },
  {
    filename: 'analytics.sql',
    language: 'sql',
    code: `WITH daily_signups AS (
    SELECT
        DATE_TRUNC('day', created_at) AS day,
        COUNT(*) AS signups,
        COUNT(DISTINCT visitor_token) AS unique_visitors
    FROM deck_signatures
    WHERE created_at > NOW() - INTERVAL '30 days'
    GROUP BY 1
),
rolling AS (
    SELECT
        day,
        signups,
        AVG(signups) OVER (
            ORDER BY day
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS rolling_7d
    FROM daily_signups
)
SELECT * FROM rolling
ORDER BY day DESC;`
  },
  {
    filename: 'materialized_view.sql',
    language: 'sql',
    code: `CREATE MATERIALIZED VIEW project_stats AS
SELECT
    p.id,
    p.title,
    p.stack,
    COUNT(DISTINCT v.visitor_id) AS views,
    COUNT(DISTINCT s.id) AS stars,
    MAX(c.created_at) AS last_activity,
    ROUND(
        COUNT(DISTINCT s.id)::numeric /
        NULLIF(COUNT(DISTINCT v.visitor_id), 0) * 100,
        2
    ) AS conversion_rate
FROM projects p
LEFT JOIN project_views v ON v.project_id = p.id
LEFT JOIN project_stars s ON s.project_id = p.id
LEFT JOIN project_comments c ON c.project_id = p.id
GROUP BY p.id, p.title, p.stack;

CREATE UNIQUE INDEX ON project_stats(id);`
  },
  {
    filename: 'partitioned_logs.sql',
    language: 'sql',
    code: `CREATE TABLE api_logs (
    id          BIGSERIAL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    method      TEXT NOT NULL,
    path        TEXT NOT NULL,
    status      INT NOT NULL,
    duration_ms INT NOT NULL,
    user_id     UUID
) PARTITION BY RANGE (created_at);

CREATE TABLE api_logs_2025_q1
    PARTITION OF api_logs
    FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');

CREATE INDEX ON api_logs (created_at, status)
    WHERE status >= 400;

CREATE INDEX ON api_logs (user_id, created_at)
    WHERE user_id IS NOT NULL;`
  },
]

// ── Status bar data ───────────────────────────────────────────────────────

const statusByLang: Record<string, string[]> = {
  python: [
    'FastAPI · Uvicorn running on port 8000',
    'Django · Migrations: 24 applied · 0 pending',
    'Celery · 3 workers active · Queue depth: 0',
    'PyTorch · CUDA available · GPU: RTX 3060',
    'Redis · Connected · 0ms latency',
  ],
  typescript: [
    'TypeScript · No type errors · ESLint clean',
    'Next.js · HMR active · Page compiled in 214ms',
    'React · 0 hook violations · Bundle: 142kb',
    'Vite · Dev server ready · Hot reload active',
  ],
  go: [
    'Go · go vet passed · No race conditions',
    'Go · goroutines: 4 · heap: 2.1 MB',
    'Go · Build succeeded · Binary: 6.2 MB',
  ],
  rust: [
    'Rust · cargo check · 0 warnings',
    'Rust · cargo build · Compiling (3/8 crates)',
    'Rust · Clippy clean · No unsafe blocks',
  ],
  sql: [
    'PostgreSQL · Query cost: 0.42 · Seq scan avoided',
    'PostgreSQL · Index hit rate: 99.1%',
    'PostgreSQL · EXPLAIN ANALYZE · Planning time: 0.3ms',
  ],
}

const branchByLang: Record<string, string[]> = {
  python:     ['main', 'feat/cache-layer', 'feat/ml-pipeline', 'feat/auth', 'feat/task-queue'],
  typescript: ['main', 'feat/deck-ui', 'feat/react-native', 'feat/animations'],
  go:         ['main', 'feat/worker-pool', 'feat/router'],
  rust:       ['main', 'feat/bloom-filter', 'feat/tokenizer'],
  sql:        ['main', 'feat/analytics', 'feat/partitioning'],
}

// ── Syntax highlighting ────────────────────────────────────────────────────

const KEYWORDS = new Set([
  'if', 'else', 'elif', 'return', 'async', 'await', 'def', 'fn', 'func',
  'const', 'let', 'var', 'mut', 'type', 'interface', 'class', 'import',
  'from', 'export', 'default', 'struct', 'impl', 'pub', 'use', 'for', 'in',
  'match', 'true', 'false', 'None', 'null', 'self', 'new', 'try', 'catch',
  'finally', 'throw', 'while', 'break', 'continue', 'switch', 'case',
  'package', 'defer', 'go', 'chan', 'select', 'range', 'map',
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON',
  'WITH', 'INSERT', 'UPDATE', 'DELETE', 'INTO', 'SET', 'AS', 'DISTINCT',
  'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'CREATE', 'TABLE', 'INDEX',
  'OVER', 'ROWS', 'BETWEEN', 'PRECEDING', 'CURRENT', 'ROW', 'PARTITION',
  'VALUES', 'NOT', 'IS', 'OR', 'AND', 'UNIQUE', 'PRIMARY', 'KEY',
  'MATERIALIZED', 'VIEW', 'REFERENCES', 'DEFAULT', 'NULL',
])

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightLine(line: string): string {
  let result = ''
  let i = 0

  while (i < line.length) {
    const ch = line[i]

    // Line comments: //, --, or # (but not #[ for Rust attributes)
    if (
      (ch === '/' && line[i + 1] === '/') ||
      (ch === '-' && line[i + 1] === '-') ||
      (ch === '#' && line[i + 1] !== '[')
    ) {
      result += `<span class="hl-comment">${escapeHtml(line.slice(i))}</span>`
      break
    }

    // f/r/b-string prefix (Python)
    if (
      (ch === 'f' || ch === 'r' || ch === 'b') &&
      (line[i + 1] === '"' || line[i + 1] === "'")
    ) {
      const quote = line[i + 1]
      let j = i + 2
      while (j < line.length && line[j] !== quote) j++
      result += `<span class="hl-string">${escapeHtml(line.slice(i, j + 1))}</span>`
      i = j + 1
      continue
    }

    // Strings
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1
      while (j < line.length) {
        if (line[j] === ch && line[j - 1] !== '\\') { j++; break }
        j++
      }
      result += `<span class="hl-string">${escapeHtml(line.slice(i, j))}</span>`
      i = j
      continue
    }

    // Numbers
    if (/[0-9]/.test(ch) && (i === 0 || !/[a-zA-Z_]/.test(line[i - 1]))) {
      let j = i
      while (j < line.length && /[0-9._]/.test(line[j])) j++
      result += `<span class="hl-number">${escapeHtml(line.slice(i, j))}</span>`
      i = j
      continue
    }

    // Words: keywords, function calls, PascalCase types, identifiers
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++
      const word = line.slice(i, j)
      // Look ahead past whitespace for (
      let k = j
      while (k < line.length && line[k] === ' ') k++
      const followedByParen = line[k] === '('

      if (KEYWORDS.has(word)) {
        result += `<span class="hl-keyword">${escapeHtml(word)}</span>`
      } else if (followedByParen) {
        result += `<span class="hl-function">${escapeHtml(word)}</span>`
      } else if (/^[A-Z]/.test(word)) {
        result += `<span class="hl-type">${escapeHtml(word)}</span>`
      } else {
        result += escapeHtml(word)
      }
      i = j
      continue
    }

    result += escapeHtml(ch)
    i++
  }

  return result
}

function highlight(code: string): string {
  return code.split('\n').map(highlightLine).join('\n')
}

// ── Component ──────────────────────────────────────────────────────────────

export default function CodeTypewriter () {
  const [idx, setIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)

    setDisplayed('')
    setVisible(false)

    timerRef.current = setTimeout(() => {
      setVisible(true)
      const code = snippets[idx].code
      let pos = 0

      intervalRef.current = setInterval(() => {
        pos++
        setDisplayed(code.slice(0, pos))

        if (pos >= code.length) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null

          timerRef.current = setTimeout(() => {
            setVisible(false)
            timerRef.current = setTimeout(() => {
              setIdx(prev => (prev + 1) % snippets.length)
            }, 500)
          }, 12000)
        }
      }, 85)
    }, 500)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [idx])

  const snippet = snippets[idx]

  const langMessages = statusByLang[snippet.language] ?? ['Ready']
  const langBranches = branchByLang[snippet.language] ?? ['main']
  const currentMessage = langMessages[idx % langMessages.length]
  const currentBranch = langBranches[idx % langBranches.length]

  const displayedLines = displayed.split('\n')
  const currentLineIndex = displayedLines.length
  const currentCol = displayedLines[displayedLines.length - 1].length + 1
  const langLabel =
    snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)

  const visibleLineNumbers = Array.from(
    { length: currentLineIndex },
    (_, i) => i + 1
  )

  return (
    <div className={`code-typewriter${visible ? ' code-typewriter--visible' : ''}`}>
      <div className='code-typewriter__titlebar'>
        <div className='code-typewriter__titlebar-dots'>
          <span className='code-typewriter__dot' style={{ background: '#FF5F57' }} />
          <span className='code-typewriter__dot' style={{ background: '#FEBC2E' }} />
          <span className='code-typewriter__dot' style={{ background: '#28C840' }} />
        </div>
        <span className='code-typewriter__titlebar-text'>phinehas — editor</span>
        <div />
      </div>
      <div className='code-typewriter__tabbar'>
        <div className='code-typewriter__tab code-typewriter__tab--active'>
          <span className='code-typewriter__tab-dot' />
          {snippet.filename}
        </div>
      </div>
      <div className='code-typewriter__body'>
        <div className='code-typewriter__lines' aria-hidden='true'>
          {visibleLineNumbers.map(n => (
            <div key={n}>{n}</div>
          ))}
        </div>
        <code
          className='code-typewriter__code'
          dangerouslySetInnerHTML={{
            __html:
              highlight(displayed) +
              '<span class="code-typewriter__cursor"></span>'
          }}
        />
      </div>
      <div className='code-typewriter__statusbar'>
        <span className='code-typewriter__status-item code-typewriter__status-item--branch'>
          ⎇  {currentBranch}
        </span>
        <span className='code-typewriter__status-item code-typewriter__status-item--message'>
          {currentMessage}
        </span>
        <span className='code-typewriter__status-item code-typewriter__status-item--right'>
          {langLabel}
        </span>
        <span className='code-typewriter__status-item code-typewriter__status-item--right'>
          Ln {currentLineIndex}, Col {currentCol}
        </span>
        <span className='code-typewriter__status-item code-typewriter__status-item--right'>
          UTF-8  LF
        </span>
      </div>
    </div>
  )
}
