"use client";

import { useMemo, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import RoadmapLegend from "@/components/roadmap/RoadmapLegend";
import RoadmapNode from "@/components/roadmap/RoadmapNode";
import RoadmapPath from "@/components/roadmap/RoadmapPath";
import ProgressTracker from "@/components/roadmap/ProgressTracker";
import ModuleCard from "@/components/roadmap/ModuleCard";
import type { RoadmapModule } from "@/components/roadmap/types";

const roadmapModules: RoadmapModule[] = [
  {
    id: 1,
    title: "Introduction to Backend",
    status: "completed",
    description: "Understand the backend landscape, architecture, and career pathways.",
    duration: "20 min",
    difficulty: "Beginner",
    skills: ["Backend fundamentals", "Architecture overview"],
    prerequisites: [],
    x: 0,
    y: 0,
  },
  {
    id: 2,
    title: "Internet Basics",
    status: "completed",
    description: "Learn network fundamentals, DNS, IPs, and how the internet transports data.",
    duration: "30 min",
    difficulty: "Beginner",
    skills: ["Networking", "DNS", "HTTP basics"],
    prerequisites: ["Introduction to Backend"],
    x: 220,
    y: 0,
  },
  {
    id: 3,
    title: "HTTP & HTTPS",
    status: "current",
    description: "Master HTTP request/response flow, secure transport, and REST conventions.",
    duration: "40 min",
    difficulty: "Beginner",
    skills: ["HTTP methods", "Status codes", "SSL/TLS"],
    prerequisites: ["Internet Basics"],
    x: 440,
    y: 0,
  },
  {
    id: 4,
    title: "Client-Server Architecture",
    status: "locked",
    description: "Build a mental model of client and server responsibilities in modern apps.",
    duration: "25 min",
    difficulty: "Beginner",
    skills: ["Client-server", "Request flow"],
    prerequisites: ["HTTP & HTTPS"],
    x: 660,
    y: 0,
  },
  {
    id: 5,
    title: "Node.js",
    status: "locked",
    description: "Setup Node.js, explore runtime behavior, and build your first server.",
    duration: "35 min",
    difficulty: "Intermediate",
    skills: ["JavaScript runtime", "Server basics"],
    prerequisites: ["Client-Server Architecture"],
    x: 0,
    y: 180,
  },
  {
    id: 6,
    title: "NPM",
    status: "locked",
    description: "Manage packages, scripts, and dependencies with the Node package ecosystem.",
    duration: "25 min",
    difficulty: "Intermediate",
    skills: ["Package management", "Dependencies"],
    prerequisites: ["Node.js"],
    x: 220,
    y: 180,
  },
  {
    id: 7,
    title: "Express.js",
    status: "locked",
    description: "Create middleware, routes, and REST endpoints using Express.js.",
    duration: "45 min",
    difficulty: "Intermediate",
    skills: ["Express", "Routing", "Middleware"],
    prerequisites: ["NPM"],
    x: 440,
    y: 180,
  },
  {
    id: 8,
    title: "REST APIs",
    status: "locked",
    description: "Design API resources, versioning, and best practices for web services.",
    duration: "40 min",
    difficulty: "Intermediate",
    skills: ["REST", "API design"],
    prerequisites: ["Express.js"],
    x: 660,
    y: 180,
  },
  {
    id: 9,
    title: "MongoDB",
    status: "locked",
    description: "Store and query JSON-like data with MongoDB collections and models.",
    duration: "45 min",
    difficulty: "Intermediate",
    skills: ["NoSQL", "Data modeling"],
    prerequisites: ["REST APIs"],
    x: 0,
    y: 360,
  },
  {
    id: 10,
    title: "SQL Databases",
    status: "locked",
    description: "Learn relational schema design, queries, and transactions using SQL.",
    duration: "50 min",
    difficulty: "Intermediate",
    skills: ["SQL", "Relationships", "Transactions"],
    prerequisites: ["MongoDB"],
    x: 220,
    y: 360,
  },
  {
    id: 11,
    title: "Authentication (JWT, Sessions, OAuth)",
    status: "locked",
    description: "Protect routes with secure login flows and token-based authentication.",
    duration: "55 min",
    difficulty: "Advanced",
    skills: ["Auth", "JWT", "OAuth"],
    prerequisites: ["SQL Databases"],
    x: 440,
    y: 360,
  },
  {
    id: 12,
    title: "File Uploads",
    status: "locked",
    description: "Handle user uploads safely with multipart form handling and storage.",
    duration: "30 min",
    difficulty: "Intermediate",
    skills: ["File handling", "Storage"],
    prerequisites: ["Authentication (JWT, Sessions, OAuth)"],
    x: 660,
    y: 360,
  },
  {
    id: 13,
    title: "WebSockets",
    status: "locked",
    description: "Build real-time features using socket connections and push updates.",
    duration: "40 min",
    difficulty: "Advanced",
    skills: ["Real-time", "Sockets"],
    prerequisites: ["File Uploads"],
    x: 0,
    y: 540,
  },
  {
    id: 14,
    title: "Caching (Redis)",
    status: "locked",
    description: "Speed up backend responses with caching strategies using Redis.",
    duration: "35 min",
    difficulty: "Advanced",
    skills: ["Caching", "Redis"],
    prerequisites: ["WebSockets"],
    x: 220,
    y: 540,
  },
  {
    id: 15,
    title: "Docker",
    status: "locked",
    description: "Containerize services for consistent environments and deployment.",
    duration: "45 min",
    difficulty: "Advanced",
    skills: ["Containers", "Dockerfiles"],
    prerequisites: ["Caching (Redis)"],
    x: 440,
    y: 540,
  },
  {
    id: 16,
    title: "CI/CD",
    status: "locked",
    description: "Automate builds and deployments with CI/CD pipelines.",
    duration: "40 min",
    difficulty: "Advanced",
    skills: ["Automation", "Pipelines"],
    prerequisites: ["Docker"],
    x: 660,
    y: 540,
  },
  {
    id: 17,
    title: "Cloud Deployment",
    status: "locked",
    description: "Deploy services to cloud providers with reliability and scaling.",
    duration: "50 min",
    difficulty: "Advanced",
    skills: ["Cloud", "Deployment"],
    prerequisites: ["CI/CD"],
    x: 0,
    y: 720,
  },
  {
    id: 18,
    title: "Microservices",
    status: "locked",
    description: "Design reusable services with clear boundaries and communication.",
    duration: "55 min",
    difficulty: "Advanced",
    skills: ["Microservices", "API design"],
    prerequisites: ["Cloud Deployment"],
    x: 220,
    y: 720,
  },
  {
    id: 19,
    title: "System Design",
    status: "locked",
    description: "Evaluate scalability, fault tolerance, and architecture tradeoffs.",
    duration: "60 min",
    difficulty: "Advanced",
    skills: ["Design patterns", "Scalability"],
    prerequisites: ["Microservices"],
    x: 440,
    y: 720,
  },
  {
    id: 20,
    title: "Final Capstone Project",
    status: "locked",
    description: "Ship a full backend project that demonstrates everything you learned.",
    duration: "90 min",
    difficulty: "Advanced",
    skills: ["Project planning", "Deployment"],
    prerequisites: ["System Design"],
    x: 660,
    y: 720,
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function RoadmapPage() {
  const [selectedId, setSelectedId] = useState(3);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const selectedModule = roadmapModules.find((module) => module.id === selectedId) ?? roadmapModules[2];

  const stats = useMemo(() => {
    const completedModules = roadmapModules.filter((module) => module.status === "completed").length;
    return {
      completion: Math.round((completedModules / roadmapModules.length) * 100),
      completedModules,
      xpEarned: 8200,
      level: 6,
    };
  }, []);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setScale((current) => clamp(current - event.deltaY * 0.0012, 0.8, 1.4));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX - pan.x, y: event.clientY - pan.y };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    setPan({ x: event.clientX - dragStart.current.x, y: event.clientY - dragStart.current.y });
  };

  const handlePointerUp = () => {
    dragStart.current = null;
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-24 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <ProgressTracker
          completion={stats.completion}
          completedModules={stats.completedModules}
          xpEarned={stats.xpEarned}
          level={stats.level}
        />

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-slate-400">Interactive roadmap</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Backend path map</h2>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                Click a completed or current node to review details. Locked modules require prior completion.
              </p>
            </div>

            <div className="mb-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300 shadow-inner shadow-white/5">
              <p className="font-medium text-slate-100">Interactions</p>
              <ul className="mt-3 space-y-2 text-slate-400">
                <li>• Pan the roadmap by dragging the map area.</li>
                <li>• Zoom with the mouse wheel for a closer view.</li>
                <li>• Hover node cards for smooth motion.</li>
              </ul>
            </div>

            <div
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.8)]"
              style={{ touchAction: "none" }}
            >
              <div className="absolute inset-x-0 top-6 flex justify-between px-4 text-xs uppercase tracking-[0.24em] text-slate-500 sm:px-8">
                <span>Drag to pan</span>
                <span>Scroll to zoom</span>
              </div>
              <div className="pointer-events-none absolute inset-x-6 top-16 h-px bg-white/5" />
              <div
                className="relative h-[860px] w-full"
                style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`, transformOrigin: "0 0" }}
              >
                {roadmapModules.slice(0, roadmapModules.length - 1).map((module, index) => (
                  <RoadmapPath key={`${module.id}-${index}`} from={module} to={roadmapModules[index + 1]} />
                ))}

                {roadmapModules.map((module) => (
                  <RoadmapNode
                    key={module.id}
                    module={module}
                    selected={selectedId === module.id}
                    onSelect={() => setSelectedId(module.id)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <RoadmapLegend />
            </div>
          </section>

          <section className="space-y-6">
            <ModuleCard module={selectedModule} />
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Roadmap snapshot</p>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <p>
                  <span className="font-semibold text-white">Current phase:</span> {selectedModule.title}
                </p>
                <p>
                  <span className="font-semibold text-white">Locked modules:</span> {roadmapModules.filter((module) => module.status === "locked").length}
                </p>
                <p>
                  <span className="font-semibold text-white">Next unlock:</span> {roadmapModules.find((module) => module.status === "locked")?.title}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
