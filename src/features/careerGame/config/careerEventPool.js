import { EVENT_POOL } from "./eventPool";
import { RARE_EVENT_POOL } from "./rareEventPool";

export const CAREER_EVENT_POOL = [...EVENT_POOL, ...RARE_EVENT_POOL];
