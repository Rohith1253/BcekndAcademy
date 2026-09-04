export type RoadmapStatus = "completed" | "current" | "locked";

export interface RoadmapModule {
  id: number;
  title: string;
  status: RoadmapStatus;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  prerequisites: string[];
  x: number;
  y: number;
}
