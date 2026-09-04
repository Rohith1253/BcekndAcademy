export interface PlaygroundLanguageConfig {
  id: string;
  name: string;
  framework: string;
  monacoLanguage: string;
  extension: string;
  badgeColor: string;
  version: string;
  description: string;
  starterCode: string;
}

export const PLAYGROUND_LANGUAGES: Record<string, PlaygroundLanguageConfig> = {
  javascript: {
    id: "javascript",
    name: "JavaScript",
    framework: "Express.js",
    monacoLanguage: "javascript",
    extension: "js",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    version: "Node.js 20 LTS",
    description: "Production REST API server with Express middleware, route handlers, and error handling",
    starterCode: `const express = require('express');
const app = express();

app.use(express.json());

// In-memory data store
const users = [
  { id: 1, name: "Alice", role: "Backend Engineer" },
  { id: 2, name: "Bob", role: "DevOps Architect" }
];

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// GET all users
app.get('/api/users', (req, res) => {
  console.log("Fetching all active users...");
  res.status(200).json({ success: true, count: users.length, data: users });
});

// POST create user
app.post('/api/users', (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: "Missing required name or role" });
  }
  const newUser = { id: users.length + 1, name, role };
  users.push(newUser);
  console.log(\`Created user: \${newUser.name} (\${newUser.role})\`);
  res.status(201).json({ success: true, data: newUser });
});

console.log("Starting Express backend service on port 3000...");
console.log("Ready to accept incoming HTTP requests.");
`
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    framework: "Node.js / Express TS",
    monacoLanguage: "typescript",
    extension: "ts",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    version: "TypeScript 5.4",
    description: "Type-safe backend service with interfaces, generic repository, and async handlers",
    starterCode: `interface User {
  id: string;
  email: string;
  role: "admin" | "engineer" | "analyst";
  createdAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class UserRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    this.create({ email: "lead@backend.dev", role: "engineer" });
  }

  public create(dto: { email: string; role: "admin" | "engineer" | "analyst" }): User {
    const id = \`usr_\${Math.random().toString(36).substring(2, 9)}\`;
    const user: User = { id, ...dto, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  public findById(id: string): User | undefined {
    return this.users.get(id);
  }

  public listAll(): User[] {
    return Array.from(this.users.values());
  }
}

const repo = new UserRepository();
console.log("Initializing TypeScript Backend Engine...");
const user = repo.create({ email: "sarah@cloud.io", role: "admin" });
console.log("Created Type-Safe User:", JSON.stringify(user, null, 2));
console.log("Total Users in Memory:", repo.listAll().length);
`
  },
  python: {
    id: "python",
    name: "Python",
    framework: "FastAPI / Pydantic",
    monacoLanguage: "python",
    extension: "py",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    version: "Python 3.12",
    description: "High-performance async ASGI microservice with Pydantic validation and JWT auth",
    starterCode: `from typing import List, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class ServiceHealth:
    status: str
    uptime_seconds: float
    services_connected: List[str]

class TaskWorker:
    def __init__(self, worker_id: str):
        self.worker_id = worker_id
        self.queue: List[dict] = []

    def enqueue(self, task_name: str, payload: dict) -> str:
        task_id = f"task_{len(self.queue) + 1:04d}"
        self.queue.append({
            "id": task_id,
            "name": task_name,
            "payload": payload,
            "enqueued_at": datetime.utcnow().isoformat()
        })
        print(f"[{self.worker_id}] Enqueued task: {task_name} (ID: {task_id})")
        return task_id

    def process_all(self):
        print(f"[{self.worker_id}] Starting task queue execution...")
        for task in self.queue:
            print(f"  -> Processing {task['id']}: {task['name']} | payload: {task['payload']}")
        print(f"[{self.worker_id}] All {len(self.queue)} tasks successfully executed.")

worker = TaskWorker("worker-alpha")
worker.enqueue("email_notification", {"to": "dev@company.com", "template": "welcome"})
worker.enqueue("generate_analytics_report", {"quarter": "Q3", "format": "pdf"})
worker.process_all()
`
  },
  go: {
    id: "go",
    name: "Go",
    framework: "Gin / Standard Net/HTTP",
    monacoLanguage: "go",
    extension: "go",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    version: "Go 1.22",
    description: "Concurrent backend service with Goroutines, Channels, and HTTP handlers",
    starterCode: `package main

import (
	"fmt"
	"sync"
	"time"
)

type Job struct {
	ID       int
	Resource string
}

func worker(id int, jobs <-chan Job, results chan<- string, wg *sync.WaitGroup) {
	defer wg.Done()
	for job := range jobs {
		fmt.Printf("Worker #%d started processing job %d (%s)\\n", id, job.ID, job.Resource)
		time.Sleep(10 * time.Millisecond) // Simulate I/O work
		results <- fmt.Sprintf("Job %d completed by Worker #%d", job.ID, id)
	}
}

func main() {
	fmt.Println("🚀 Initializing Go High-Throughput Worker Pool...")

	const numJobs = 5
	const numWorkers = 3

	jobs := make(chan Job, numJobs)
	results := make(chan string, numJobs)
	var wg sync.WaitGroup

	for w := 1; w <= numWorkers; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	for j := 1; j <= numJobs; j++ {
		jobs <- Job{ID: j, Resource: fmt.Sprintf("database_shard_%d", j%2)}
	}
	close(jobs)

	wg.Wait()
	close(results)

	fmt.Println("\\n✅ Results gathered from Go channels:")
	for res := range results {
		fmt.Println("  ->", res)
	}
}
`
  },
  rust: {
    id: "rust",
    name: "Rust",
    framework: "Axum / Tokio",
    monacoLanguage: "rust",
    extension: "rs",
    badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    version: "Rust 1.78",
    description: "Memory-safe, zero-cost abstraction asynchronous web server with Tokio runtime",
    starterCode: `#[derive(Debug, Clone)]
struct ConnectionPool {
    max_connections: usize,
    active: usize,
}

impl ConnectionPool {
    fn new(max: usize) -> Self {
        ConnectionPool {
            max_connections: max,
            active: 0,
        }
    }

    fn acquire(&mut self) -> Result<usize, &'static str> {
        if self.active >= self.max_connections {
            Err("Connection pool exhausted: 503 Service Unavailable")
        } else {
            self.active += 1;
            Ok(self.active)
        }
    }

    fn release(&mut self) {
        if self.active > 0 {
            self.active -= 1;
        }
    }
}

fn main() {
    println!("🦀 Rust Axum + Tokio Service Initializing...");

    let mut pool = ConnectionPool::new(3);

    for i in 1..=4 {
        match pool.acquire() {
            Ok(conn_id) => println!("Acquired connection slot #{}, active: {}", conn_id, pool.active),
            Err(e) => println!("Failed to acquire slot {}: {}", i, e),
        }
    }

    println!("Releasing 1 connection...");
    pool.release();
    println!("Pool status: active={}/{}", pool.active, pool.max_connections);
}
`
  },
  java: {
    id: "java",
    name: "Java",
    framework: "Spring Boot 3",
    monacoLanguage: "java",
    extension: "java",
    badgeColor: "bg-red-500/10 text-red-300 border-red-500/30",
    version: "Java 21 LTS",
    description: "Enterprise Spring Boot REST Controller with Dependency Injection and Service Layer",
    starterCode: `import java.util.*;

public class Main {
    static class AccountService {
        private final Map<String, Double> balances = new HashMap<>();

        public AccountService() {
            balances.put("acc-101", 1500.00);
            balances.put("acc-102", 320.50);
        }

        public synchronized boolean transfer(String from, String to, double amount) {
            Double fromBal = balances.get(from);
            Double toBal = balances.get(to);

            if (fromBal == null || toBal == null || fromBal < amount) {
                return false;
            }

            balances.put(from, fromBal - amount);
            balances.put(to, toBal + amount);
            return true;
        }

        public Double getBalance(String acc) {
            return balances.getOrDefault(acc, 0.0);
        }
    }

    public static void main(String[] args) {
        System.out.println("☕ Java 21 Spring Boot Microservice Started");
        AccountService service = new AccountService();

        System.out.println("Initial Balance acc-101: $" + service.getBalance("acc-101"));
        System.out.println("Initial Balance acc-102: $" + service.getBalance("acc-102"));

        boolean ok = service.transfer("acc-101", "acc-102", 500.00);
        System.out.println("Transfer $500: " + (ok ? "SUCCESS" : "FAILED"));

        System.out.println("Updated Balance acc-101: $" + service.getBalance("acc-101"));
        System.out.println("Updated Balance acc-102: $" + service.getBalance("acc-102"));
    }
}
`
  },
  csharp: {
    id: "csharp",
    name: "C# / .NET",
    framework: "ASP.NET Core 8",
    monacoLanguage: "csharp",
    extension: "cs",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    version: ".NET 8 Minimal API",
    description: "ASP.NET Core Minimal APIs with Dependency Injection, Entity Framework records, and LINQ",
    starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

public record Order(int Id, string Customer, decimal Amount, bool IsShipped);

public class OrderRepository
{
    private readonly List<Order> _orders = new()
    {
        new(1, "Acme Corp", 1240.50m, true),
        new(2, "Stark Ind", 8900.00m, false),
        new(3, "Wayne Ent", 450.75m, true)
    };

    public IEnumerable<Order> GetPendingOrders() => _orders.Where(o => !o.IsShipped);
    public decimal GetTotalRevenue() => _orders.Sum(o => o.Amount);
}

public class Program
{
    public static void Main()
    {
        Console.WriteLine("⚡ ASP.NET Core 8 Minimal API Engine Initialized");
        var repo = new OrderRepository();

        Console.WriteLine($"Total Revenue: \${repo.GetTotalRevenue():F2}");
        Console.WriteLine("Pending Orders:");
        foreach (var order in repo.GetPendingOrders())
        {
            Console.WriteLine($"  - [#{order.Id}] {order.Customer}: \${order.Amount:F2}");
        }
    }
}
`
  },
  php: {
    id: "php",
    name: "PHP",
    framework: "Laravel 11",
    monacoLanguage: "php",
    extension: "php",
    badgeColor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
    version: "PHP 8.3 / Laravel",
    description: "Modern PHP 8.3 with Eloquent models, Service Container, and Middleware pipeline",
    starterCode: `<?php

class CacheManager {
    private array $store = [];

    public function remember(string $key, int $ttlSeconds, callable $callback) {
        if (isset($this->store[$key])) {
            echo "[Cache HIT] Key: {$key}\\n";
            return $this->store[$key]['value'];
        }

        echo "[Cache MISS] Executing DB query for {$key}...\\n";
        $value = $callback();
        $this->store[$key] = [
            'value' => $value,
            'expires' => time() + $ttlSeconds
        ];
        return $value;
    }
}

echo "🐘 PHP 8.3 Laravel Backend Environment Ready\\n";

$cache = new CacheManager();

$user1 = $cache->remember('user:42', 60, function() {
    return ['id' => 42, 'name' => 'Taylor', 'role' => 'Architect'];
});

$user2 = $cache->remember('user:42', 60, function() {
    return ['id' => 42, 'name' => 'Taylor', 'role' => 'Architect'];
});

echo "User Name: " . $user1['name'] . "\\n";
`
  },
  ruby: {
    id: "ruby",
    name: "Ruby",
    framework: "Ruby on Rails 7",
    monacoLanguage: "ruby",
    extension: "rb",
    badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    version: "Ruby 3.3 / Rails",
    description: "Rails ActiveSupport and domain model business logic with idiomatic blocks",
    starterCode: `class RateLimiter
  def initialize(max_requests:, window_seconds:)
    @max = max_requests
    @window = window_seconds
    @requests = Hash.new { |h, k| h[k] = [] }
  end

  def allow?(client_ip)
    now = Time.now.to_i
    # Clean old requests
    @requests[client_ip].reject! { |t| now - t > @window }

    if @requests[client_ip].size < @max
      @requests[client_ip] << now
      true
    else
      false
    end
  end
end

puts "💎 Ruby on Rails API Gateway Initializing..."
limiter = RateLimiter.new(max_requests: 2, window_seconds: 60)
ip = "192.168.1.10"

puts "Request 1: #{limiter.allow?(ip) ? 'ALLOWED (200 OK)' : 'RATE LIMITED (429)'}"
puts "Request 2: #{limiter.allow?(ip) ? 'ALLOWED (200 OK)' : 'RATE LIMITED (429)'}"
puts "Request 3: #{limiter.allow?(ip) ? 'ALLOWED (200 OK)' : 'RATE LIMITED (429)'}"
`
  },
  kotlin: {
    id: "kotlin",
    name: "Kotlin",
    framework: "Ktor / Coroutines",
    monacoLanguage: "kotlin",
    extension: "kt",
    badgeColor: "bg-violet-500/10 text-violet-300 border-violet-500/30",
    version: "Kotlin 2.0 / Ktor",
    description: "Asynchronous microservices with Kotlin Coroutines, Flow, and Ktor routing",
    starterCode: `data class MetricEvent(val name: String, val value: Double, val timestamp: Long = System.currentTimeMillis())

class MetricsCollector {
    private val events = mutableListOf<MetricEvent>()

    fun record(name: String, value: Double) {
        val event = MetricEvent(name, value)
        events.add(event)
        println("Recorded metric [$name]: $value")
    }

    fun average(name: String): Double {
        val filtered = events.filter { it.name == name }
        return if (filtered.isEmpty()) 0.0 else filtered.map { it.value }.average()
    }
}

fun main() {
    println("🟣 Kotlin Ktor Coroutine Engine Started")
    val metrics = MetricsCollector()

    metrics.record("http.response_time_ms", 45.2)
    metrics.record("http.response_time_ms", 12.8)
    metrics.record("http.response_time_ms", 88.0)

    println("Avg Response Time: \${metrics.average("http.response_time_ms")} ms")
}
`
  },
  elixir: {
    id: "elixir",
    name: "Elixir",
    framework: "Phoenix / OTP",
    monacoLanguage: "elixir",
    extension: "ex",
    badgeColor: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30",
    version: "Elixir 1.16 / OTP 26",
    description: "Fault-tolerant BEAM processes, GenServer state management, and Phoenix channels",
    starterCode: `defmodule CircuitBreaker do
  def execute(state, action) do
    case state do
      :closed ->
        try do
          {:ok, action.()}
        rescue
          _ -> {:error, :failed, :half_open}
        end
      :open ->
        {:error, :circuit_open}
      :half_open ->
        {:ok, "Canary attempt succeeded"}
    end
  end
end

IO.puts("💧 Elixir Phoenix OTP Supervisor Starting...")

action = fn -> "DB Query Executed Successfully" end
case CircuitBreaker.execute(:closed, action) do
  {:ok, result} -> IO.puts("Result: #{result}")
  {:error, reason} -> IO.puts("Blocked: #{reason}")
end
`
  }
};
