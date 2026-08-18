import { CAREER_EVENT_POOL } from "../config/careerEventPool";
import {
  BEHAVIOR_KEYS,
  ENDING_COPY,
  GAME_VERSION,
  INITIAL_ATTRIBUTES,
  MAX_OVERTIME_TURNS,
  MAX_TURNS,
  PERSONA_COPY,
  PERSONA_PROFILES,
  PITY_BONUSES,
  PROBABILITY_MODELS,
  stageForTurn,
} from "../config/gameConfig";

const EVENT_BY_ID = new Map(CAREER_EVENT_POOL.map((event) => [event.id, event]));
const ATTRIBUTE_KEYS = Object.keys(INITIAL_ATTRIBUTES);
const PERSONA_ORDER = Object.keys(PERSONA_PROFILES);

function clone(value) {
  return structuredClone(value);
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function nextRandom(randomState) {
  const next = (Math.imul(randomState >>> 0, 1664525) + 1013904223) >>> 0;
  return { randomState: next, value: next / 4294967296 };
}

function meetsRequirements(state, requirements = {}) {
  const minAttributes = requirements.minAttributes || {};
  const maxAttributes = requirements.maxAttributes || {};
  const minCounters = requirements.minCounters || {};
  if (Object.entries(minAttributes).some(([key, value]) => (state.attributes[key] ?? 0) < value)) return false;
  if (Object.entries(maxAttributes).some(([key, value]) => (state.attributes[key] ?? 0) > value)) return false;
  if (Object.entries(minCounters).some(([key, value]) => (state.counters[key] ?? 0) < value)) return false;
  if ((requirements.flagsAny || []).length && !requirements.flagsAny.some((flag) => state.flags[flag])) return false;
  if ((requirements.flagsAll || []).some((flag) => !state.flags[flag])) return false;
  if ((requirements.flagsAbsent || []).some((flag) => state.flags[flag])) return false;
  if (Object.entries(requirements.minMetrics || {}).some(([key, value]) => (state.metrics?.[key] ?? 0) < value)) return false;
  if (Object.entries(requirements.minRoutes || {}).some(([key, value]) => (state.routes?.[key] ?? 0) < value)) return false;
  return true;
}

function presentEvent(event, state) {
  return {
    id: event.id,
    category: event.category,
    title: event.title,
    description: event.description,
    choices: event.choices.map((item) => ({
      ...clone(item),
      available: meetsRequirements(state, item.requirements),
    })),
  };
}

function eventWeight(event, state) {
  let weight = event.baseWeight || 1;
  const tags = new Set(event.tags || []);
  if ((event.tags || []).some((tag) => state.nextTags.includes(tag))) weight *= 1.8;
  if (tags.has("networking")) weight *= 0.7 + state.attributes.network / 65;
  if (tags.has("profile")) weight *= state.attributes.profile < 55 ? 1.35 : 0.8;
  if (tags.has("deadline") && state.attributes.time < 45) weight *= 1.6;
  if (tags.has("interview") && state.counters.interviewLeads > 0) weight *= 1.4;
  if (tags.has("offer") && state.counters.offerLeads > 0) weight *= 1.5;
  const previousCategory = state.history.at(-1)?.category;
  if (previousCategory === event.category) weight *= 0.72;
  return Math.max(0.05, weight);
}

function selectNextEvent(state) {
  const stage = stageForTurn(state.turn);
  state.stage = stage;
  const forcedId = state.counters.pendingOffers > 0
    ? "ordinary-offer"
    : state.counters.offerLeads > 0 && state.opportunityAges.final >= 2
      ? "final-round"
      : state.counters.interviewLeads > 0 && state.opportunityAges.interview >= 2
        ? ["hr-screening", "technical-interview", "behavioral-interview", "group-interview"]
          .find((id) => !state.seenEventIds.includes(id))
        : null;
  if (forcedId) {
    const forced = EVENT_BY_ID.get(forcedId);
    if (forced && meetsRequirements(state, forced.requirements)) {
      state.currentEvent = presentEvent(forced, state);
      return true;
    }
  }
  const eligible = CAREER_EVENT_POOL.filter((event) => {
    if (state.seenEventIds.includes(event.id)) return false;
    if (!event.stages.includes(stage) && !(stage === "closing" && event.stages.includes("decision"))) return false;
    if (!meetsRequirements(state, event.requirements)) return false;
    return !(event.cooldownTags || []).some((tag) => (state.cooldowns[tag] || 0) > 0);
  });
  const candidates = eligible.length
    ? eligible
    : CAREER_EVENT_POOL.filter((event) => !state.seenEventIds.includes(event.id) && meetsRequirements(state, event.requirements));
  if (!candidates.length) return false;

  const weighted = candidates.map((event) => ({ event, weight: eventWeight(event, state) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  const random = nextRandom(state.randomState);
  state.randomState = random.randomState;
  let cursor = random.value * total;
  const selected = weighted.find((item) => {
    cursor -= item.weight;
    return cursor <= 0;
  })?.event || weighted.at(-1).event;
  state.currentEvent = presentEvent(selected, state);
  return true;
}

function applyAttributes(state, effects = {}) {
  Object.entries(effects).forEach(([key, amount]) => {
    if (!ATTRIBUTE_KEYS.includes(key)) return;
    state.attributes[key] = clamp((state.attributes[key] || 0) + amount);
  });
}

function applyCounters(state, effects = {}) {
  Object.entries(effects).forEach(([key, amount]) => {
    state.counters[key] = Math.max(0, (state.counters[key] || 0) + amount);
  });
}

function applyFlags(state, flags = []) {
  flags.forEach((flag) => { state.flags[flag] = true; });
}

function applyFailureTags(state, tags = []) {
  tags.forEach((tag) => { state.failureTags[tag] = (state.failureTags[tag] || 0) + 1; });
}

function applyChoicePayload(state, payload = {}) {
  applyAttributes(state, payload.effects);
  applyCounters(state, payload.counters);
  applyFlags(state, payload.flags);
  applyFailureTags(state, payload.failureTags);
  Object.entries(payload.metrics || {}).forEach(([key, amount]) => {
    state.metrics[key] = clamp((state.metrics[key] || 0) + amount);
  });
  Object.entries(payload.routes || {}).forEach(([key, amount]) => {
    state.routes[key] = clamp((state.routes[key] || 0) + amount);
  });
  state.nextTags = [...new Set([...(payload.nextTags || [])])];
}

function successProbability(state, choice) {
  const model = PROBABILITY_MODELS[choice.successModel];
  if (!model) return null;
  let probability = model.base + (choice.probabilityBonus || 0);
  ATTRIBUTE_KEYS.forEach((key) => {
    if (model[key]) probability += state.attributes[key] * model[key];
  });
  const streak = model.pity ? state.failureStreaks[model.pity] || 0 : 0;
  const pity = (PITY_BONUSES[model.pity] || []).find(([threshold]) => streak >= threshold)?.[1] || 0;
  return clamp(probability + pity, 0.08, model.cap || 0.92);
}

function visibleDeltas(before, after) {
  return Object.fromEntries(ATTRIBUTE_KEYS.map((key) => [key, after[key] - before[key]]).filter(([, value]) => value));
}

function reduceCooldowns(state) {
  Object.keys(state.cooldowns).forEach((tag) => {
    state.cooldowns[tag] -= 1;
    if (state.cooldowns[tag] <= 0) delete state.cooldowns[tag];
  });
}

function shouldComplete(state) {
  if (state.attributes.energy <= 0) return true;
  if (state.turn < MAX_TURNS) return false;
  const unresolvedPipeline = state.counters.pendingOffers > 0 || state.counters.offerLeads > 0 || state.counters.interviewLeads > 0;
  return !unresolvedPipeline || state.turn >= MAX_OVERTIME_TURNS;
}

function normalizeState(state) {
  state.counters = {
    applications: 0, interviews: 0, referrals: 0, offers: 0, rejections: 0,
    interviewLeads: 0, offerLeads: 0, pendingOffers: 0, acceptedOffers: 0,
    declinedOffers: 0, waitlists: 0,
    ...(state.counters || {}),
  };
  state.metrics = { careerMomentum: 0, alternativePath: 0, lifeSatisfaction: 50, ...(state.metrics || {}) };
  state.routes = { startup: 0, freelance: 0, academic: 0, travel: 0, stall: 0, startupEmployee: 0, hiddenCareer: 0, ...(state.routes || {}) };
  state.opportunityAges = { interview: 0, final: 0, ...(state.opportunityAges || {}) };
  state.failureStreaks = { application: 0, interview: 0, final: 0, ...(state.failureStreaks || {}) };
  return state;
}

function ageOpportunities(state) {
  state.opportunityAges.interview = state.counters.interviewLeads > 0 ? state.opportunityAges.interview + 1 : 0;
  state.opportunityAges.final = state.counters.offerLeads > 0 ? state.opportunityAges.final + 1 : 0;
}

function recordPipelineResolution(state, event, succeeded, choice) {
  const model = PROBABILITY_MODELS[choice.successModel];
  const streakKey = model?.pity;
  if (streakKey && succeeded !== null) state.failureStreaks[streakKey] = succeeded ? 0 : state.failureStreaks[streakKey] + 1;
  if (event.category === "interview" && event.id !== "final-round" && choice.id !== "reschedule") {
    state.counters.interviewLeads = Math.max(0, state.counters.interviewLeads - 1);
    state.opportunityAges.interview = 0;
  }
  if (event.id === "final-round") {
    state.counters.offerLeads = Math.max(0, state.counters.offerLeads - 1);
    state.opportunityAges.final = 0;
  }
  if (event.id === "ordinary-offer" && choice.id === "accept") {
    state.counters.pendingOffers = Math.max(0, state.counters.pendingOffers - 1);
    state.counters.acceptedOffers += 1;
  }
  if (event.id === "ordinary-offer" && choice.id === "decline") {
    state.counters.pendingOffers = Math.max(0, state.counters.pendingOffers - 1);
    state.counters.declinedOffers += 1;
  }
}

export function createCareerRun({ seed = Date.now() } = {}) {
  const normalizedSeed = Number(seed) >>> 0 || 1;
  const state = {
    version: GAME_VERSION,
    seed: normalizedSeed,
    randomState: normalizedSeed,
    status: "playing",
    role: "graduate",
    stage: "preparation",
    turn: 0,
    attributes: clone(INITIAL_ATTRIBUTES),
    counters: {},
    behavior: Object.fromEntries(BEHAVIOR_KEYS.map((key) => [key, 0])),
    history: [],
    seenEventIds: [],
    cooldowns: {},
    nextTags: [],
    failureTags: {},
    flags: {},
    lastOutcome: null,
    currentEvent: null,
  };
  normalizeState(state);
  const opening = EVENT_BY_ID.get("market-crossroads");
  state.currentEvent = presentEvent(opening, state);
  return state;
}

export function restoreCareerRun(savedState) {
  if (!savedState || savedState.status !== "playing" || !savedState.currentEvent?.id) return null;
  const event = EVENT_BY_ID.get(savedState.currentEvent.id);
  if (!event) return null;
  try {
    const state = normalizeState(clone(savedState));
    if (!ATTRIBUTE_KEYS.every((key) => Number.isFinite(state.attributes?.[key]))) return null;
    if (!state.counters || !state.behavior || !Array.isArray(state.history)) return null;
    state.version = GAME_VERSION;
    state.currentEvent = presentEvent(event, state);
    state.lastOutcome = null;
    return state;
  } catch {
    return null;
  }
}

export function advanceCareerRun(currentState, choiceId) {
  if (!currentState || currentState.status !== "playing" || !currentState.currentEvent) {
    throw new Error("Career Run is not available for a Choice.");
  }
  const state = clone(currentState);
  normalizeState(state);
  const event = EVENT_BY_ID.get(state.currentEvent.id);
  const choice = event?.choices.find((item) => item.id === choiceId);
  if (!choice) throw new Error(`Unknown Choice: ${choiceId}`);
  if (!meetsRequirements(state, choice.requirements)) throw new Error(`Choice is unavailable: ${choiceId}`);

  const before = clone(state.attributes);
  reduceCooldowns(state);
  applyChoicePayload(state, choice);
  Object.entries(choice.behaviorEffects || {}).forEach(([key, amount]) => {
    state.behavior[key] = (state.behavior[key] || 0) + amount;
  });
  if (choice.intensity === "high" && before.energy < 30) applyAttributes(state, { energy: -3, confidence: -1 });

  const probability = successProbability(state, choice);
  let selectedOutcome = choice.outcome || null;
  let succeeded = null;
  if (probability !== null) {
    const random = nextRandom(state.randomState);
    state.randomState = random.randomState;
    succeeded = random.value <= probability;
    selectedOutcome = succeeded ? choice.success : choice.failure;
  }
  if (!selectedOutcome) throw new Error(`Choice is missing a configured outcome: ${event.id}/${choice.id}`);
  applyChoicePayload(state, selectedOutcome);
  applyFlags(state, choice.flags);
  recordPipelineResolution(state, event, succeeded, choice);
  (event.cooldownTags || []).forEach((tag) => { state.cooldowns[tag] = 2; });
  state.seenEventIds.push(event.id);
  state.turn += 1;
  if (state.turn % 3 === 0) applyAttributes(state, { energy: 3 });
  if (state.metrics.lifeSatisfaction >= 70 && state.turn % 4 === 0) applyAttributes(state, { confidence: 2 });
  if (state.metrics.lifeSatisfaction <= 25 && choice.intensity === "high") applyAttributes(state, { energy: -2 });
  ageOpportunities(state);
  state.lastOutcome = {
    id: selectedOutcome.id,
    message: selectedOutcome.message,
    succeeded,
    probability,
    deltas: visibleDeltas(before, state.attributes),
  };
  state.history.push({
    eventId: event.id,
    eventTitle: event.title,
    category: event.category,
    choiceId: choice.id,
    choiceLabel: choice.label,
    outcomeId: selectedOutcome.id,
    outcomeMessage: selectedOutcome.message,
    succeeded,
    deltas: state.lastOutcome.deltas,
  });

  if (shouldComplete(state) || !selectNextEvent(state)) {
    state.status = "complete";
    state.stage = state.attributes.energy <= 0 ? "burnout" : "closing";
    state.currentEvent = null;
  }
  return state;
}

function resolvePersona(state) {
  const scores = Object.fromEntries(PERSONA_ORDER.map((key) => {
    const score = Object.entries(PERSONA_PROFILES[key]).reduce(
      (sum, [dimension, weight]) => sum + (state.behavior[dimension] || 0) * weight,
      0,
    );
    return [key, score];
  }));
  const ranked = [...PERSONA_ORDER].sort((a, b) => scores[b] - scores[a] || PERSONA_ORDER.indexOf(a) - PERSONA_ORDER.indexOf(b));
  const key = ranked[0];
  return { key, ...PERSONA_COPY[key], secondaryKey: ranked[1], scores };
}

function resolveEnding(state) {
  const accepted = state.counters.acceptedOffers || state.counters.offers;
  let id = "still_searching";
  if (state.flags.startupReady && state.routes.startup >= 70) id = "startup_founder";
  else if (state.flags.freelanceReady && state.routes.freelance >= 60) id = "freelancer";
  else if (state.flags.academicReady && state.routes.academic >= 60) id = "academic";
  else if (state.flags.travelReady && state.routes.travel >= 65) id = "world_travel";
  else if (state.routes.travel >= 35 && state.metrics.lifeSatisfaction >= 55) id = "gap_year";
  else if (state.flags.stallReady && state.routes.stall >= 70) id = "stall_business";
  else if (accepted > 0 && state.flags.dreamOffer) id = "dream_offer";
  else if (accepted > 0 && state.flags.graduateTrack) id = "graduate_program";
  else if (accepted > 0 && state.flags.unexpectedOffer) id = "unexpected_offer";
  else if (state.flags.startupEmployeeReady && state.routes.startupEmployee >= 55) id = "startup_employee";
  else if (accepted > 0 && state.flags.referralOffer) id = "referral_success";
  else if (accepted >= 2) id = "multiple_offers";
  else if (accepted > 0 && state.behavior.action >= state.behavior.analysis + 3) id = "batch_winner";
  else if (accepted > 0 && state.behavior.analysis > state.behavior.action) id = "precision_application";
  else if (accepted > 0) id = "steady_landing";
  else if (state.counters.declinedOffers > 0 || state.flags.declinedOffer) id = "declined_offer";
  else if (state.attributes.energy <= 0) id = "burnout";
  return { id, ...ENDING_COPY[id] };
}

function strongestBehavior(state) {
  return [...BEHAVIOR_KEYS].sort((a, b) => state.behavior[b] - state.behavior[a])[0];
}

function buildPath(state, persona) {
  const profileBranches = [];
  const searchBranches = [];
  const skillBranches = [];
  const interviewBranches = [];
  const signals = [];
  if (state.attributes.profile < 55 || state.failureTags.profile_screen) {
    profileBranches.push("linkedin", "cover_letter");
    signals.push("本局的 Profile 或简历筛选表现仍有提升空间，Path 会提前安排材料准备。");
  }
  const alternativeProgress = Math.max(...Object.values(state.routes || {}));
  if (alternativeProgress >= 30) {
    profileBranches.push("portfolio", "personal_site");
    signals.push("本局有一条项目或非传统路线持续生长，Path 会加入项目集与个人主页，帮助你保留真实成果。 ");
  }
  if (state.attributes.network < 35 || state.behavior.networking >= 5) {
    searchBranches.push("networking");
    signals.push("人脉资源仍偏少，或你多次主动连接他人，Path 会加入 Coffee Chat / Networking。");
  }
  if (state.behavior.analysis >= state.behavior.action) {
    searchBranches.push("ai_job_search");
    signals.push("你更常先研究再行动，Path 会强化岗位研究、JD 拆解与精准投递。");
  } else {
    signals.push("你用行动维持机会流动，Path 会强化批量规划、Tracker 与版本管理。");
  }
  if (state.failureTags.technical_interview) {
    skillBranches.push("technical");
    interviewBranches.push("technical");
    signals.push("Technical Interview 出现过明确卡点，Path 会加入专项准备。");
  }
  if (state.attributes.confidence < 35 || state.metrics.lifeSatisfaction < 30) {
    signals.push("信心或生活状态在本局明显承压。Path 会保留面试复盘主线，也提醒你把恢复当成持续求职的一部分。 ");
  }
  if (state.failureTags.hr_interview) interviewBranches.push("hr");
  if (state.failureTags.group_interview) interviewBranches.push("group");
  if (!interviewBranches.length) interviewBranches.push("hr");
  if (!signals.length) signals.push("本局表现较均衡，Path 会从通用主线开始，并保留随时调整的空间。");

  return {
    signals,
    profile: {
      stage: state.counters.acceptedOffers || state.counters.offers ? "offer" : state.counters.interviews ? "interviewing" : state.counters.applications ? "applying" : "materials",
      jobti_type: persona.key,
      candidate_background: "student",
      profile_branches: [...new Set(profileBranches)],
      search_branches: [...new Set(searchBranches)],
      skill_branches: [...new Set(skillBranches)],
      interview_branches: [...new Set(interviewBranches)],
      application_strategy: state.behavior.action > state.behavior.analysis ? "batch" : "precision",
      information_style: state.behavior.networking > state.behavior.analysis ? "social" : "independent",
      career_direction: state.behavior.exploration > state.behavior.analysis ? "exploring" : "focused",
      profile_competitiveness: state.attributes.profile < 45 ? "unsure" : "competitive",
      experience_level: alternativeProgress >= 30 || state.attributes.profile >= 55 ? "established" : "limited",
      certificate_interest: false,
    },
  };
}

export function summarizeCareerRun(state) {
  if (!state || state.status !== "complete") throw new Error("Complete the Career Run before requesting a summary.");
  const persona = resolvePersona(state);
  const orderedAttributes = [...ATTRIBUTE_KEYS].sort((a, b) => state.attributes[b] - state.attributes[a]);
  const weakestAttribute = [...ATTRIBUTE_KEYS].sort((a, b) => state.attributes[a] - state.attributes[b])[0];
  return {
    ending: resolveEnding(state),
    persona,
    stats: {
      applications: state.counters.applications,
      interviews: state.counters.interviews,
      referrals: state.counters.referrals,
      offers: state.counters.offers,
    },
    attributes: clone(state.attributes),
    strongestStrategy: strongestBehavior(state),
    strength: orderedAttributes[0],
    bottleneck: weakestAttribute,
    path: buildPath(state, persona),
  };
}
