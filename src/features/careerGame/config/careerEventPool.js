import { EVENT_POOL } from "./eventPool";
import { RARE_EVENT_POOL } from "./rareEventPool";

export const CAREER_EVENT_POOL = [...EVENT_POOL, ...RARE_EVENT_POOL];
export const RARE_EVENT_IDS = new Set(RARE_EVENT_POOL.map((event) => event.id));
