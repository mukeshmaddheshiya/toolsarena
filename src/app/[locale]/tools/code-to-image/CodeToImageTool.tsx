'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ImageDown,
  ChevronDown,
  Monitor,
  Apple,
  Square,
  Hash,
  WrapText,
  Type,
  Palette,
  Code2,
  Layers,
} from 'lucide-react';
import { DownloadButton } from '@/components/common/DownloadButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ThemeColors {
  bg: string;
  text: string;
  keyword: string;
  string: string;
  comment: string;
  number: string;
  function: string;
  titlebar: string;
  border: string;
}

interface Theme {
  id: string;
  label: string;
  colors: ThemeColors;
}

interface Background {
  id: string;
  label: string;
  style: string;
  preview: string;
}

type ChromeStyle = 'macos' | 'windows' | 'none';

// ---------------------------------------------------------------------------
// Constants — Themes
// ---------------------------------------------------------------------------

const THEMES: Theme[] = [
  {
    id: 'vs-dark',
    label: 'VS Code Dark',
    colors: {
      bg: '#1e1e1e',
      text: '#d4d4d4',
      keyword: '#569cd6',
      string: '#ce9178',
      comment: '#6a9955',
      number: '#b5cea8',
      function: '#dcdcaa',
      titlebar: '#323233',
      border: '#3c3c3c',
    },
  },
  {
    id: 'github-dark',
    label: 'GitHub Dark',
    colors: {
      bg: '#0d1117',
      text: '#c9d1d9',
      keyword: '#ff7b72',
      string: '#a5d6ff',
      comment: '#8b949e',
      number: '#79c0ff',
      function: '#d2a8ff',
      titlebar: '#161b22',
      border: '#30363d',
    },
  },
  {
    id: 'dracula',
    label: 'Dracula',
    colors: {
      bg: '#282a36',
      text: '#f8f8f2',
      keyword: '#ff79c6',
      string: '#f1fa8c',
      comment: '#6272a4',
      number: '#bd93f9',
      function: '#50fa7b',
      titlebar: '#21222c',
      border: '#44475a',
    },
  },
  {
    id: 'one-dark',
    label: 'One Dark',
    colors: {
      bg: '#282c34',
      text: '#abb2bf',
      keyword: '#c678dd',
      string: '#98c379',
      comment: '#5c6370',
      number: '#d19a66',
      function: '#61afef',
      titlebar: '#21252b',
      border: '#3e4451',
    },
  },
  {
    id: 'nord',
    label: 'Nord',
    colors: {
      bg: '#2e3440',
      text: '#d8dee9',
      keyword: '#81a1c1',
      string: '#a3be8c',
      comment: '#616e88',
      number: '#b48ead',
      function: '#88c0d0',
      titlebar: '#242932',
      border: '#3b4252',
    },
  },
  {
    id: 'monokai',
    label: 'Monokai',
    colors: {
      bg: '#272822',
      text: '#f8f8f2',
      keyword: '#f92672',
      string: '#e6db74',
      comment: '#75715e',
      number: '#ae81ff',
      function: '#a6e22e',
      titlebar: '#1e1f1c',
      border: '#3e3d32',
    },
  },
  {
    id: 'github-light',
    label: 'GitHub Light',
    colors: {
      bg: '#ffffff',
      text: '#24292f',
      keyword: '#cf222e',
      string: '#0a3069',
      comment: '#6e7781',
      number: '#0550ae',
      function: '#8250df',
      titlebar: '#f6f8fa',
      border: '#d0d7de',
    },
  },
  {
    id: 'solarized-dark',
    label: 'Solarized Dark',
    colors: {
      bg: '#002b36',
      text: '#839496',
      keyword: '#859900',
      string: '#2aa198',
      comment: '#586e75',
      number: '#d33682',
      function: '#268bd2',
      titlebar: '#073642',
      border: '#094e5f',
    },
  },
];

// ---------------------------------------------------------------------------
// Constants — Backgrounds
// ---------------------------------------------------------------------------

const BACKGROUNDS: Background[] = [
  {
    id: 'dark-ocean',
    label: 'Dark Ocean',
    style: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    preview: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    style: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'ocean-blue',
    label: 'Ocean Blue',
    style: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'emerald',
    label: 'Emerald',
    style: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  {
    id: 'candy',
    label: 'Candy',
    style: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    preview: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
  {
    id: 'gold',
    label: 'Gold',
    style: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    preview: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    style: '#0a0a0a',
    preview: '#0a0a0a',
  },
  {
    id: 'twitter',
    label: 'Twitter',
    style: 'linear-gradient(135deg, #1da1f2 0%, #0d8ecf 100%)',
    preview: 'linear-gradient(135deg, #1da1f2 0%, #0d8ecf 100%)',
  },
  {
    id: 'custom',
    label: 'Custom',
    style: '#6366f1',
    preview: '#6366f1',
  },
];

// ---------------------------------------------------------------------------
// Constants — Language keywords & samples
// ---------------------------------------------------------------------------

const LANGUAGE_KEYWORDS: Record<string, Set<string>> = {
  javascript: new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'break', 'continue', 'class', 'extends', 'new', 'this', 'super',
    'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'finally',
    'throw', 'typeof', 'instanceof', 'in', 'of', 'delete', 'void', 'null', 'undefined',
    'true', 'false', 'static', 'get', 'set', 'yield', 'debugger',
  ]),
  typescript: new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'break', 'continue', 'class', 'extends', 'new', 'this', 'super',
    'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'finally',
    'throw', 'typeof', 'instanceof', 'in', 'of', 'delete', 'void', 'null', 'undefined',
    'true', 'false', 'static', 'get', 'set', 'yield', 'type', 'interface', 'enum',
    'implements', 'abstract', 'readonly', 'as', 'keyof', 'namespace', 'declare',
    'module', 'never', 'any', 'unknown', 'string', 'number', 'boolean', 'object',
  ]),
  python: new Set([
    'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not',
    'and', 'or', 'is', 'import', 'from', 'as', 'pass', 'break', 'continue', 'try',
    'except', 'finally', 'raise', 'with', 'lambda', 'yield', 'global', 'nonlocal',
    'del', 'assert', 'True', 'False', 'None', 'async', 'await',
  ]),
  html: new Set([
    'html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 'form',
    'input', 'button', 'select', 'option', 'textarea', 'script', 'style', 'link',
    'meta', 'title', 'nav', 'header', 'footer', 'main', 'section', 'article',
    'aside', 'canvas', 'video', 'audio', 'source', 'iframe',
  ]),
  css: new Set([
    'display', 'flex', 'grid', 'block', 'none', 'inline', 'absolute', 'relative',
    'fixed', 'sticky', 'static', 'color', 'background', 'margin', 'padding',
    'border', 'width', 'height', 'font', 'text', 'position', 'top', 'left',
    'right', 'bottom', 'overflow', 'z-index', 'opacity', 'transform', 'transition',
    'animation', 'var', 'calc', 'important',
  ]),
  java: new Set([
    'public', 'private', 'protected', 'class', 'interface', 'extends', 'implements',
    'new', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
    'continue', 'try', 'catch', 'finally', 'throw', 'throws', 'import', 'package',
    'static', 'final', 'abstract', 'void', 'int', 'long', 'double', 'float', 'boolean',
    'char', 'byte', 'short', 'null', 'true', 'false', 'this', 'super', 'instanceof',
    'synchronized', 'volatile', 'transient', 'native', 'enum',
  ]),
  go: new Set([
    'func', 'return', 'if', 'else', 'for', 'range', 'switch', 'case', 'break',
    'continue', 'var', 'const', 'type', 'struct', 'interface', 'map', 'chan',
    'go', 'defer', 'select', 'import', 'package', 'nil', 'true', 'false',
    'make', 'new', 'len', 'cap', 'append', 'copy', 'delete', 'close', 'panic',
    'recover', 'print', 'println', 'error', 'string', 'int', 'int64', 'float64',
    'bool', 'byte', 'rune',
  ]),
  rust: new Set([
    'fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'impl', 'trait',
    'use', 'mod', 'pub', 'return', 'if', 'else', 'match', 'for', 'while', 'loop',
    'break', 'continue', 'in', 'as', 'where', 'type', 'self', 'Self', 'super',
    'crate', 'extern', 'unsafe', 'async', 'await', 'move', 'ref', 'true', 'false',
    'Some', 'None', 'Ok', 'Err', 'Box', 'Vec', 'String', 'str', 'bool', 'i32',
    'u32', 'i64', 'u64', 'f32', 'f64', 'usize',
  ]),
  php: new Set([
    'function', 'return', 'if', 'else', 'elseif', 'for', 'foreach', 'while', 'do',
    'switch', 'case', 'break', 'continue', 'class', 'extends', 'implements', 'new',
    'echo', 'print', 'var', 'public', 'private', 'protected', 'static', 'abstract',
    'interface', 'trait', 'namespace', 'use', 'try', 'catch', 'finally', 'throw',
    'null', 'true', 'false', 'array', 'list', 'isset', 'empty', 'unset',
  ]),
  sql: new Set([
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
    'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'COLUMN', 'INDEX',
    'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER',
    'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT', 'AS', 'AND', 'OR',
    'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL', 'PRIMARY', 'KEY', 'FOREIGN',
    'REFERENCES', 'DEFAULT', 'CONSTRAINT', 'UNIQUE', 'AUTO_INCREMENT',
    'select', 'from', 'where', 'insert', 'into', 'values', 'update', 'set',
    'delete', 'create', 'table', 'drop', 'alter', 'join', 'inner', 'left',
    'right', 'group', 'order', 'by', 'having', 'limit', 'union', 'distinct', 'as',
  ]),
  bash: new Set([
    'if', 'then', 'else', 'elif', 'fi', 'for', 'do', 'done', 'while', 'until',
    'case', 'esac', 'function', 'return', 'exit', 'echo', 'printf', 'read',
    'export', 'source', 'local', 'declare', 'readonly', 'unset', 'shift', 'set',
    'true', 'false', 'test', 'in', 'select',
  ]),
  cpp: new Set([
    'int', 'long', 'short', 'char', 'float', 'double', 'bool', 'void', 'auto',
    'const', 'static', 'extern', 'register', 'volatile', 'inline', 'virtual',
    'class', 'struct', 'union', 'enum', 'namespace', 'template', 'typename',
    'public', 'private', 'protected', 'return', 'if', 'else', 'for', 'while',
    'do', 'switch', 'case', 'break', 'continue', 'new', 'delete', 'this',
    'operator', 'sizeof', 'nullptr', 'true', 'false', 'try', 'catch', 'throw',
    'using', 'typedef', 'include', 'define',
  ]),
  csharp: new Set([
    'public', 'private', 'protected', 'internal', 'class', 'interface', 'struct',
    'enum', 'namespace', 'using', 'return', 'if', 'else', 'for', 'foreach', 'while',
    'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'base', 'static',
    'readonly', 'const', 'abstract', 'virtual', 'override', 'sealed', 'async',
    'await', 'try', 'catch', 'finally', 'throw', 'null', 'true', 'false', 'var',
    'void', 'int', 'long', 'double', 'float', 'bool', 'string', 'object', 'out',
    'ref', 'in', 'params', 'delegate', 'event', 'get', 'set',
  ]),
  ruby: new Set([
    'def', 'end', 'class', 'module', 'do', 'if', 'elsif', 'else', 'unless',
    'while', 'until', 'for', 'in', 'begin', 'rescue', 'ensure', 'raise', 'return',
    'yield', 'self', 'super', 'require', 'require_relative', 'include', 'extend',
    'attr_accessor', 'attr_reader', 'attr_writer', 'nil', 'true', 'false', 'and',
    'or', 'not', 'then', 'case', 'when', 'break', 'next', 'lambda', 'proc',
  ]),
  json: new Set(['true', 'false', 'null']),
};

const SAMPLE_CODE: Record<string, string> = {
  javascript: `// Fibonacci with memoization
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

const results = Array.from({ length: 10 }, (_, i) =>
  fibonacci(i)
);

console.log('Fibonacci sequence:', results);`,

  typescript: `// Generic repository pattern
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  private cache = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }
    const user = await db.users.findOne({ id });
    if (user) this.cache.set(id, user);
    return user;
  }

  async save(user: User): Promise<User> {
    const saved = await db.users.upsert(user);
    this.cache.set(saved.id, saved);
    return saved;
  }
}`,

  python: `# Decorator for retry logic
import time
import functools

def retry(max_attempts=3, delay=1.0, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            attempt = 0
            while attempt < max_attempts:
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    attempt += 1
                    if attempt == max_attempts:
                        raise
                    print(f"Attempt {attempt} failed: {e}")
                    time.sleep(delay * attempt)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5, exceptions=(ConnectionError,))
def fetch_data(url: str) -> dict:
    response = requests.get(url, timeout=5)
    return response.json()`,

  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header">
      <nav class="navbar">
        <a href="/" class="logo">MyApp</a>
        <ul class="nav-links">
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <h1>Welcome to MyApp</h1>
      <p>Build something amazing.</p>
    </main>
    <script src="app.js"></script>
  </body>
</html>`,

  css: `/* Modern card component */
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.card__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card__body {
  color: var(--text-secondary);
  line-height: 1.6;
}`,

  java: `// Builder pattern example
public class HttpRequest {
    private final String url;
    private final String method;
    private final Map<String, String> headers;
    private final String body;
    private final int timeout;

    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.headers = Collections.unmodifiableMap(builder.headers);
        this.body = builder.body;
        this.timeout = builder.timeout;
    }

    public static class Builder {
        private String url;
        private String method = "GET";
        private Map<String, String> headers = new HashMap<>();
        private String body;
        private int timeout = 30;

        public Builder url(String url) {
            this.url = url;
            return this;
        }

        public Builder header(String key, String value) {
            this.headers.put(key, value);
            return this;
        }

        public HttpRequest build() {
            if (url == null) throw new IllegalStateException("URL required");
            return new HttpRequest(this);
        }
    }
}`,

  go: `// Concurrent worker pool
package main

import (
    "fmt"
    "sync"
)

type Job struct {
    ID   int
    Data string
}

func workerPool(numWorkers int, jobs <-chan Job) <-chan string {
    results := make(chan string, len(jobs))
    var wg sync.WaitGroup

    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            for job := range jobs {
                result := fmt.Sprintf("Worker %d processed job %d", id, job.ID)
                results <- result
            }
        }(i)
    }

    go func() {
        wg.Wait()
        close(results)
    }()

    return results
}`,

  rust: `// Async HTTP client with error handling
use reqwest::Client;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("HTTP error: {0}")]
    Http(#[from] reqwest::Error),
    #[error("Not found: {resource}")]
    NotFound { resource: String },
}

#[derive(Deserialize, Serialize, Debug)]
pub struct User {
    pub id: u64,
    pub name: String,
    pub email: String,
}

pub async fn fetch_user(client: &Client, id: u64) -> Result<User, ApiError> {
    let url = format!("https://api.example.com/users/{}", id);
    let response = client.get(&url).send().await?;

    if response.status() == 404 {
        return Err(ApiError::NotFound {
            resource: format!("user/{}", id),
        });
    }

    Ok(response.json::<User>().await?)
}`,

  php: `<?php
// Simple dependency injection container
class Container {
    private array $bindings = [];
    private array $instances = [];

    public function bind(string $abstract, callable $factory): void {
        $this->bindings[$abstract] = $factory;
    }

    public function singleton(string $abstract, callable $factory): void {
        $this->bindings[$abstract] = function() use ($abstract, $factory) {
            if (!isset($this->instances[$abstract])) {
                $this->instances[$abstract] = $factory($this);
            }
            return $this->instances[$abstract];
        };
    }

    public function make(string $abstract): mixed {
        if (isset($this->bindings[$abstract])) {
            return ($this->bindings[$abstract])($this);
        }
        throw new RuntimeException("No binding for {$abstract}");
    }
}

$container = new Container();
$container->singleton(Database::class, fn($c) => new Database(
    host: $_ENV['DB_HOST'],
    name: $_ENV['DB_NAME'],
));`,

  sql: `-- Monthly revenue report with window functions
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', created_at) AS month,
        product_id,
        SUM(amount) AS revenue,
        COUNT(DISTINCT customer_id) AS unique_customers
    FROM orders
    WHERE
        status = 'completed'
        AND created_at >= NOW() - INTERVAL '12 months'
    GROUP BY 1, 2
),
ranked AS (
    SELECT
        month,
        product_id,
        revenue,
        unique_customers,
        ROW_NUMBER() OVER (
            PARTITION BY month
            ORDER BY revenue DESC
        ) AS rank,
        SUM(revenue) OVER (PARTITION BY month) AS total_monthly
    FROM monthly_sales
)
SELECT
    month,
    product_id,
    revenue,
    ROUND(revenue / total_monthly * 100, 2) AS pct_of_total,
    unique_customers
FROM ranked
WHERE rank <= 5
ORDER BY month DESC, revenue DESC;`,

  bash: `#!/usr/bin/env bash
# Deploy script with health check

set -euo pipefail

APP_NAME="myapp"
DEPLOY_DIR="/var/www/\${APP_NAME}"
BACKUP_DIR="/var/backups/\${APP_NAME}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

log() { echo "[\$(date '+%H:%M:%S')] $*"; }

backup_current() {
    if [ -d "$DEPLOY_DIR" ]; then
        log "Backing up current deployment..."
        mkdir -p "$BACKUP_DIR"
        cp -r "$DEPLOY_DIR" "\${BACKUP_DIR}/\${TIMESTAMP}"
    fi
}

health_check() {
    local url="http://localhost:3000/health"
    local retries=5
    for i in $(seq 1 $retries); do
        if curl -sf "$url" > /dev/null; then
            log "Health check passed"
            return 0
        fi
        log "Health check attempt $i/$retries failed, retrying..."
        sleep 3
    done
    return 1
}

backup_current
log "Deploying \${APP_NAME}..."
rsync -av --delete ./dist/ "$DEPLOY_DIR/"
systemctl restart "$APP_NAME"

if health_check; then
    log "Deployment successful!"
else
    log "Health check failed, rolling back..."
    cp -r "\${BACKUP_DIR}/\${TIMESTAMP}/." "$DEPLOY_DIR/"
    systemctl restart "$APP_NAME"
    exit 1
fi`,

  cpp: `#include <iostream>
#include <vector>
#include <memory>
#include <algorithm>

// Observer pattern implementation
template<typename EventData>
class EventEmitter {
public:
    using Handler = std::function<void(const EventData&)>;

    void on(const std::string& event, Handler handler) {
        listeners_[event].push_back(std::move(handler));
    }

    void emit(const std::string& event, const EventData& data) {
        auto it = listeners_.find(event);
        if (it != listeners_.end()) {
            for (const auto& handler : it->second) {
                handler(data);
            }
        }
    }

    void off(const std::string& event) {
        listeners_.erase(event);
    }

private:
    std::unordered_map<std::string, std::vector<Handler>> listeners_;
};

int main() {
    EventEmitter<std::string> emitter;
    emitter.on("message", [](const std::string& msg) {
        std::cout << "Received: " << msg << std::endl;
    });
    emitter.emit("message", "Hello, World!");
    return 0;
}`,

  csharp: `// Minimal API with dependency injection
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRepository<User>, UserRepository>();

var app = builder.Build();

app.MapGet("/users/{id:int}", async (int id, IUserService svc) =>
{
    var user = await svc.GetByIdAsync(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});

app.MapPost("/users", async (CreateUserDto dto, IUserService svc) =>
{
    var user = await svc.CreateAsync(dto);
    return Results.Created($"/users/{user.Id}", user);
});

app.MapDelete("/users/{id:int}", async (int id, IUserService svc) =>
{
    var deleted = await svc.DeleteAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

await app.RunAsync();`,

  ruby: `# Pub/Sub event bus
module Events
  class Bus
    def initialize
      @subscribers = Hash.new { |h, k| h[k] = [] }
    end

    def subscribe(event, &handler)
      @subscribers[event] << handler
      self
    end

    def publish(event, payload = {})
      @subscribers[event].each { |handler| handler.call(payload) }
      self
    end

    def unsubscribe(event)
      @subscribers.delete(event)
      self
    end
  end
end

bus = Events::Bus.new

bus.subscribe(:user_created) do |payload|
  puts "New user: #{payload[:name]} (#{payload[:email]})"
  WelcomeMailer.send(payload[:email])
end

bus.subscribe(:user_created) do |payload|
  Analytics.track('user_signed_up', user_id: payload[:id])
end

bus.publish(:user_created, id: 42, name: "Jane", email: "jane@example.com")`,

  json: `{
  "name": "my-app",
  "version": "2.1.0",
  "description": "A modern full-stack application",
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "test": "jest --coverage"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^12.0.0",
    "lucide-react": "^0.575.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "@types/node": "^22.0.0",
    "tailwindcss": "^4.0.0",
    "eslint": "^9.0.0"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}`,
};

// ---------------------------------------------------------------------------
// Syntax Highlighter
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightCode(code: string, lang: string, colors: ThemeColors): string {
  const keywords = LANGUAGE_KEYWORDS[lang] ?? new Set<string>();

  const lines = code.split('\n');
  const highlightedLines: string[] = [];

  let inBlockComment = false;
  let inHtmlComment = false;

  for (const line of lines) {
    let result = '';
    let i = 0;
    const len = line.length;

    if (inBlockComment) {
      const closeIdx = line.indexOf('*/');
      if (closeIdx === -1) {
        result += `<span style="color:${colors.comment}">${escapeHtml(line)}</span>`;
        highlightedLines.push(result);
        continue;
      } else {
        result += `<span style="color:${colors.comment}">${escapeHtml(line.slice(0, closeIdx + 2))}</span>`;
        i = closeIdx + 2;
        inBlockComment = false;
      }
    }

    if (inHtmlComment) {
      const closeIdx = line.indexOf('-->');
      if (closeIdx === -1) {
        result += `<span style="color:${colors.comment}">${escapeHtml(line)}</span>`;
        highlightedLines.push(result);
        continue;
      } else {
        result += `<span style="color:${colors.comment}">${escapeHtml(line.slice(0, closeIdx + 3))}</span>`;
        i = closeIdx + 3;
        inHtmlComment = false;
      }
    }

    while (i < len) {
      const ch = line[i];
      const rest = line.slice(i);

      // Single-line comment: //
      if (
        rest.startsWith('//') &&
        ['javascript', 'typescript', 'java', 'go', 'rust', 'cpp', 'csharp', 'php'].includes(lang)
      ) {
        result += `<span style="color:${colors.comment}">${escapeHtml(rest)}</span>`;
        i = len;
        continue;
      }

      // Single-line comment: #
      if (ch === '#' && ['python', 'bash', 'ruby'].includes(lang)) {
        result += `<span style="color:${colors.comment}">${escapeHtml(rest)}</span>`;
        i = len;
        continue;
      }

      // Block comment /* ... */
      if (rest.startsWith('/*') && lang !== 'html') {
        const closeIdx = rest.indexOf('*/', 2);
        if (closeIdx === -1) {
          result += `<span style="color:${colors.comment}">${escapeHtml(rest)}</span>`;
          i = len;
          inBlockComment = true;
        } else {
          const segment = rest.slice(0, closeIdx + 2);
          result += `<span style="color:${colors.comment}">${escapeHtml(segment)}</span>`;
          i += segment.length;
        }
        continue;
      }

      // HTML comment <!-- ... -->
      if (rest.startsWith('<!--') && lang === 'html') {
        const closeIdx = rest.indexOf('-->');
        if (closeIdx === -1) {
          result += `<span style="color:${colors.comment}">${escapeHtml(rest)}</span>`;
          i = len;
          inHtmlComment = true;
        } else {
          const segment = rest.slice(0, closeIdx + 3);
          result += `<span style="color:${colors.comment}">${escapeHtml(segment)}</span>`;
          i += segment.length;
        }
        continue;
      }

      // SQL single-line comment: --
      if (rest.startsWith('--') && lang === 'sql') {
        result += `<span style="color:${colors.comment}">${escapeHtml(rest)}</span>`;
        i = len;
        continue;
      }

      // Template literal
      if (ch === '`' && ['javascript', 'typescript'].includes(lang)) {
        let j = i + 1;
        while (j < len && line[j] !== '`') {
          if (line[j] === '\\') j++;
          j++;
        }
        const segment = line.slice(i, j + 1);
        result += `<span style="color:${colors.string}">${escapeHtml(segment)}</span>`;
        i = j + 1;
        continue;
      }

      // String: double or single quote
      if (ch === '"' || ch === "'") {
        let j = i + 1;
        while (j < len) {
          if (line[j] === '\\') { j += 2; continue; }
          if (line[j] === ch) { j++; break; }
          j++;
        }
        const segment = line.slice(i, j);
        result += `<span style="color:${colors.string}">${escapeHtml(segment)}</span>`;
        i = j;
        continue;
      }

      // Number
      if (/[0-9]/.test(ch) && (i === 0 || !/[a-zA-Z_$]/.test(line[i - 1]))) {
        let j = i;
        while (j < len && /[0-9._xXa-fA-FbBoO]/.test(line[j])) j++;
        const segment = line.slice(i, j);
        result += `<span style="color:${colors.number}">${escapeHtml(segment)}</span>`;
        i = j;
        continue;
      }

      // Word: keyword or function call
      if (/[a-zA-Z_$]/.test(ch)) {
        let j = i;
        while (j < len && /[a-zA-Z0-9_$]/.test(line[j])) j++;
        const word = line.slice(i, j);
        const afterWord = line[j];

        if (afterWord === '(') {
          result += `<span style="color:${colors.function}">${escapeHtml(word)}</span>`;
        } else if (keywords.has(word)) {
          result += `<span style="color:${colors.keyword}">${escapeHtml(word)}</span>`;
        } else {
          result += escapeHtml(word);
        }
        i = j;
        continue;
      }

      result += escapeHtml(ch);
      i++;
    }

    highlightedLines.push(result);
  }

  return highlightedLines.join('\n');
}

// ---------------------------------------------------------------------------
// Subcomponents — Window chrome
// ---------------------------------------------------------------------------

function MacOSChrome({ filename, theme }: { filename: string; theme: Theme }) {
  return (
    <div
      style={{
        backgroundColor: theme.colors.titlebar,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-t-lg"
    >
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
      </div>
      {filename && (
        <span
          style={{ color: theme.colors.comment }}
          className="text-xs flex-1 text-center font-medium truncate"
        >
          {filename}
        </span>
      )}
    </div>
  );
}

function WindowsChrome({ filename, theme }: { filename: string; theme: Theme }) {
  return (
    <div
      style={{
        backgroundColor: theme.colors.titlebar,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
      className="flex items-center justify-between px-4 py-2.5 rounded-t-lg"
    >
      <span style={{ color: theme.colors.comment }} className="text-xs font-medium truncate">
        {filename || 'code.txt'}
      </span>
      <div className="flex items-center gap-3">
        <div style={{ color: theme.colors.comment }} className="text-sm leading-none select-none">&mdash;</div>
        <div style={{ color: theme.colors.comment }} className="text-sm leading-none select-none">&#9633;</div>
        <div className="text-sm leading-none select-none text-red-400">&times;</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CodePreview
// ---------------------------------------------------------------------------

interface CodePreviewProps {
  code: string;
  language: string;
  theme: Theme;
  background: Background;
  customBg: string;
  chromeStyle: ChromeStyle;
  filename: string;
  fontFamily: string;
  fontSize: number;
  padding: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  captureRef?: React.Ref<HTMLDivElement>;
}

function CodePreview({
  code,
  language,
  theme,
  background,
  customBg,
  chromeStyle,
  filename,
  fontFamily,
  fontSize,
  padding,
  lineNumbers,
  wordWrap,
  captureRef,
}: CodePreviewProps) {
  const highlighted = useMemo(
    () => highlightCode(code || ' ', language, theme.colors),
    [code, language, theme]
  );

  const bgStyle =
    background.id === 'custom'
      ? customBg
      : background.style;

  const isGradient = bgStyle.startsWith('linear-gradient');
  const outerStyle: React.CSSProperties = isGradient
    ? { backgroundImage: bgStyle }
    : { backgroundColor: bgStyle };

  const lines = (code || '').split('\n');

  return (
    <div
      ref={captureRef}
      style={{ ...outerStyle, padding }}
      className="w-full"
    >
      <div
        style={{
          backgroundColor: theme.colors.bg,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {chromeStyle === 'macos' && <MacOSChrome filename={filename} theme={theme} />}
        {chromeStyle === 'windows' && <WindowsChrome filename={filename} theme={theme} />}

        <div style={{ padding: '20px 24px', overflowX: 'auto' }}>
          {lineNumbers ? (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <tbody>
                {lines.map((_, idx) => (
                  <tr key={idx}>
                    <td
                      style={{
                        color: theme.colors.comment,
                        fontSize: `${fontSize}px`,
                        fontFamily,
                        lineHeight: '1.7',
                        paddingRight: '20px',
                        textAlign: 'right',
                        userSelect: 'none',
                        opacity: 0.5,
                        verticalAlign: 'top',
                        whiteSpace: 'nowrap',
                        minWidth: '2em',
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      style={{
                        color: theme.colors.text,
                        fontSize: `${fontSize}px`,
                        fontFamily,
                        lineHeight: '1.7',
                        whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                        wordBreak: wordWrap ? 'break-word' : 'normal',
                        verticalAlign: 'top',
                        width: '100%',
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          highlightCode(lines[idx], language, theme.colors) || '&nbsp;',
                      }}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre
              style={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                color: theme.colors.text,
                fontFamily,
                fontSize: `${fontSize}px`,
                lineHeight: '1.7',
                whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                wordBreak: wordWrap ? 'break-word' : 'normal',
                overflowX: wordWrap ? 'visible' : 'auto',
              }}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers — UI
// ---------------------------------------------------------------------------

const FONT_FAMILIES = [
  { label: 'JetBrains Mono', value: "'JetBrains Mono', 'Courier New', monospace" },
  { label: 'Fira Code', value: "'Fira Code', 'Courier New', monospace" },
  { label: 'Cascadia Code', value: "'Cascadia Code', 'Courier New', monospace" },
  { label: 'Courier New', value: "'Courier New', monospace" },
];

const PADDING_OPTIONS = [
  { label: 'S', value: 24 },
  { label: 'M', value: 40 },
  { label: 'L', value: 64 },
  { label: 'XL', value: 80 },
];

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'html', 'css',
  'java', 'go', 'rust', 'php', 'sql', 'bash', 'cpp', 'csharp', 'ruby', 'json',
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CodeToImageTool() {
  const [code, setCode] = useState(SAMPLE_CODE['javascript']);
  const [language, setLanguage] = useState('javascript');
  const [themeId, setThemeId] = useState('vs-dark');
  const [backgroundId, setBackgroundId] = useState('dark-ocean');
  const [customBg, setCustomBg] = useState('#6366f1');
  const [chromeStyle, setChromeStyle] = useState<ChromeStyle>('macos');
  const [filename, setFilename] = useState('index.js');
  const [fontFamilyValue, setFontFamilyValue] = useState(FONT_FAMILIES[0].value);
  const [fontSize, setFontSize] = useState(14);
  const [padding, setPadding] = useState(40);
  const [lineNumbers, setLineNumbers] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const activeBackground = BACKGROUNDS.find((b) => b.id === backgroundId) ?? BACKGROUNDS[0];

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    setCode(SAMPLE_CODE[lang] ?? '// Start typing your code here...');
    const extMap: Record<string, string> = {
      javascript: 'index.js', typescript: 'index.ts', python: 'script.py',
      html: 'index.html', css: 'styles.css', java: 'Main.java', go: 'main.go',
      rust: 'main.rs', php: 'index.php', sql: 'query.sql', bash: 'script.sh',
      cpp: 'main.cpp', csharp: 'Program.cs', ruby: 'app.rb', json: 'package.json',
    };
    setFilename(extMap[lang] ?? 'code.txt');
  }, []);

  const handleExport = useCallback(async () => {
    if (!captureRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(captureRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${filename.replace(/\.[^.]+$/, '') || 'code'}-snippet.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, filename]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 py-6">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* ================================================================
            LEFT PANEL — Controls
        ================================================================ */}
        <div className="xl:w-2/5 flex flex-col gap-5">

          {/* Code Editor */}
          <div className="bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary-400" />
                <SectionLabel>Code</SectionLabel>
              </div>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="appearance-none bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-56 bg-slate-900 dark:bg-slate-950 text-slate-200 text-sm font-mono rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 border border-slate-700 leading-relaxed"
              placeholder="Paste or type your code here..."
              spellCheck={false}
            />
          </div>

          {/* Theme Picker */}
          <div className="bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-primary-400" />
              <SectionLabel>Theme</SectionLabel>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  title={t.label}
                  className={`relative rounded-lg p-1.5 border-2 transition-all ${
                    themeId === t.id
                      ? 'border-primary-500 scale-105'
                      : 'border-slate-600 hover:border-slate-400'
                  }`}
                >
                  <div
                    className="w-full h-8 rounded"
                    style={{ backgroundColor: t.colors.bg }}
                  >
                    <div className="flex gap-0.5 p-1">
                      <div className="h-1 rounded w-3" style={{ backgroundColor: t.colors.keyword }} />
                      <div className="h-1 rounded w-4" style={{ backgroundColor: t.colors.string }} />
                      <div className="h-1 rounded w-2" style={{ backgroundColor: t.colors.function }} />
                    </div>
                    <div className="flex gap-0.5 px-1">
                      <div className="h-1 rounded w-5" style={{ backgroundColor: t.colors.comment }} />
                      <div className="h-1 rounded w-2" style={{ backgroundColor: t.colors.number }} />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center mt-1 truncate leading-tight">
                    {t.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Background Picker */}
          <div className="bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-primary-400" />
              <SectionLabel>Background</SectionLabel>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBackgroundId(bg.id)}
                  title={bg.label}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    backgroundId === bg.id
                      ? 'border-primary-500 scale-105'
                      : 'border-slate-600 hover:border-slate-400'
                  }`}
                >
                  <div
                    className="w-full h-9"
                    style={
                      bg.id === 'custom'
                        ? { backgroundColor: customBg }
                        : bg.preview.startsWith('linear-gradient')
                        ? { backgroundImage: bg.preview }
                        : { backgroundColor: bg.preview }
                    }
                  />
                  <p className="text-[9px] text-slate-400 text-center py-0.5 leading-tight px-0.5 truncate">
                    {bg.label}
                  </p>
                </button>
              ))}
            </div>
            {backgroundId === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-slate-600 bg-transparent"
                />
                <input
                  type="text"
                  value={customBg}
                  onChange={(e) => {
                    if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) {
                      setCustomBg(e.target.value);
                    }
                  }}
                  className="flex-1 bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="#6366f1"
                  maxLength={7}
                />
              </div>
            )}
          </div>

          {/* Window Chrome + Filename */}
          <div className="bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="w-4 h-4 text-primary-400" />
              <SectionLabel>Window Style</SectionLabel>
            </div>
            <div className="flex gap-2 mb-4">
              {(
                [
                  { id: 'macos', label: 'macOS', icon: Apple },
                  { id: 'windows', label: 'Windows', icon: Monitor },
                  { id: 'none', label: 'None', icon: Square },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setChromeStyle(id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                    chromeStyle === id
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Filename</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="index.js"
              />
            </div>
          </div>

          {/* Font + Size */}
          <div className="bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-primary-400" />
              <SectionLabel>Font</SectionLabel>
            </div>
            <div className="mb-4">
              <div className="relative">
                <select
                  value={fontFamilyValue}
                  onChange={(e) => setFontFamilyValue(e.target.value)}
                  className="w-full appearance-none bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.label} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-400">Font Size</label>
                <span className="text-xs font-mono text-slate-300 bg-slate-700 px-2 py-0.5 rounded">
                  {fontSize}px
                </span>
              </div>
              <input
                type="range"
                min={12}
                max={22}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-primary-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>12px</span>
                <span>22px</span>
              </div>
            </div>
          </div>

          {/* Padding + Toggles */}
          <div className="bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl p-4">
            <SectionLabel>Options</SectionLabel>
            <div className="mb-4">
              <label className="text-xs text-slate-400 mb-2 block">Padding</label>
              <div className="flex gap-2">
                {PADDING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPadding(opt.value)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      padding === opt.value
                        ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                        : 'border-slate-600 text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />
                  <span className="text-sm text-slate-300">Line Numbers</span>
                </div>
                <button
                  role="switch"
                  aria-checked={lineNumbers}
                  onClick={() => setLineNumbers((v) => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    lineNumbers ? 'bg-primary-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      lineNumbers ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <WrapText className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />
                  <span className="text-sm text-slate-300">Word Wrap</span>
                </div>
                <button
                  role="switch"
                  aria-checked={wordWrap}
                  onClick={() => setWordWrap((v) => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    wordWrap ? 'bg-primary-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      wordWrap ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Download Button (mobile) */}
          <div className="xl:hidden">
            <DownloadButton
              onClick={handleExport}
              label={isExporting ? 'Exporting\u2026' : 'Download PNG'}
              className="w-full"
            />
          </div>
        </div>

        {/* ================================================================
            RIGHT PANEL — Live Preview
        ================================================================ */}
        <div className="xl:w-3/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Live Preview</h3>
              <p className="text-xs text-slate-400 mt-0.5">3&times; retina export quality</p>
            </div>
            <div className="hidden xl:block">
              <DownloadButton
                onClick={handleExport}
                label={isExporting ? 'Exporting\u2026' : 'Download PNG'}
              />
            </div>
          </div>

          <motion.div
            layout
            className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl"
          >
            <div className="overflow-auto max-h-[75vh]">
              <CodePreview
                code={code}
                language={language}
                theme={activeTheme}
                background={activeBackground}
                customBg={customBg}
                chromeStyle={chromeStyle}
                filename={filename}
                fontFamily={fontFamilyValue}
                fontSize={fontSize}
                padding={padding}
                lineNumbers={lineNumbers}
                wordWrap={wordWrap}
                captureRef={captureRef}
              />
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ImageDown className="w-3.5 h-3.5" />
              PNG &middot; 3&times; scale
            </span>
            <span>&middot;</span>
            <span>{(code || '').split('\n').length} lines</span>
            <span>&middot;</span>
            <span>{activeTheme.label}</span>
            <span>&middot;</span>
            <span>{activeBackground.label} bg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
