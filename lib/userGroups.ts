import type { HealthRecommendations } from "@/lib/types";

/**
 * The seven audiences AirIQ tailors guidance for. Each maps to a field in Google's
 * Air Quality `healthRecommendations`, so the selected group's advice can be shown
 * first. Labels are localized in i18n; this module owns only ids + the mapping.
 */

export type UserGroupId =
  | "general"
  | "children"
  | "elderly"
  | "asthma"
  | "heart"
  | "pregnant"
  | "athlete";

export const USER_GROUP_IDS: UserGroupId[] = [
  "general",
  "children",
  "elderly",
  "asthma",
  "heart",
  "pregnant",
  "athlete",
];

export const DEFAULT_USER_GROUP: UserGroupId = "general";

const HEALTH_KEY: Record<UserGroupId, keyof HealthRecommendations> = {
  general: "generalPopulation",
  children: "children",
  elderly: "elderly",
  asthma: "lungDiseasePopulation",
  heart: "heartDiseasePopulation",
  pregnant: "pregnantWomen",
  athlete: "athletes",
};

export function healthKeyFor(group: UserGroupId): keyof HealthRecommendations {
  return HEALTH_KEY[group];
}

export function isUserGroupId(value: unknown): value is UserGroupId {
  return typeof value === "string" && (USER_GROUP_IDS as string[]).includes(value);
}
