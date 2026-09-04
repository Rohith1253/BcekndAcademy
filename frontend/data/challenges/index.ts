import { HTTP_CHALLENGES } from "./http";
import { NODE_CHALLENGES } from "./node";
import { EXPRESS_CHALLENGES } from "./express";
import { MONGODB_CHALLENGES } from "./mongodb";
import { AUTHENTICATION_CHALLENGES } from "./authentication";
import type { Challenge } from "./http";

export type { Challenge };

export const ALL_CHALLENGES: Record<string, Challenge> = {
  ...HTTP_CHALLENGES,
  ...NODE_CHALLENGES,
  ...EXPRESS_CHALLENGES,
  ...MONGODB_CHALLENGES,
  ...AUTHENTICATION_CHALLENGES,
};

export const CHALLENGES_BY_CATEGORY = {
  HTTP: Object.values(HTTP_CHALLENGES),
  "Node.js": Object.values(NODE_CHALLENGES),
  Express: Object.values(EXPRESS_CHALLENGES),
  MongoDB: Object.values(MONGODB_CHALLENGES),
  Authentication: Object.values(AUTHENTICATION_CHALLENGES),
};

export const getChallengeById = (id: string): Challenge | undefined => {
  return ALL_CHALLENGES[id];
};

export const getChallengesByCategory = (category: string) => {
  return CHALLENGES_BY_CATEGORY[category as keyof typeof CHALLENGES_BY_CATEGORY] || [];
};
