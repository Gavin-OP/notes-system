import { EVENT_POOL } from "../config/eventPool";
import {
  BEHAVIOR_KEYS,
  ENDING_COPY,
  GAME_VERSION,
  INITIAL_ATTRIBUTES,
  MAX_TURNS,
  PERSONA_COPY,
  PERSONA_PROFILES,
  PROBABILITY_MODELS,
  stageForTurn,
} from "../config/gameConfig";

const EVENT_BY_ID = new Map(EVENT_POOL.map((event) => [event.id, event]));
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
  const minCounters = requirements.minCounters || {};
  if (Object.entries(minAttributes).some(([key, value]) => (state.attributes[key] ?? 0) < value)) return false;
  if (Object.entries(minCounters).some(([key, value]) => (state.counters[key] ?? 0) < value)) return false;
  if ((requirements.flagsAny || []).length && !requirements.flagsAny.some((flag) => state.flags[flag])) return false;
  if ((requirements.flagsAll || []).some((flag) => !state.flags[flag])) return false;
  if ((requirements.flagsAbsent || []).some((flag) => state.flags[flag])) return false;
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
  const eligible = EVENT_POOL.filter((event) => {
    if (state.seenEventIds.includes(event.id)) return false;
    if (!event.stages.includes(stage)) return false;
    if (!meetsRequirements(state, event.requirements)) return false;
    return !(event.cooldownTags || []).some((tag) => (state.cooldowns[tag] || 0) > 0);
  });
  const candidates = eligible.length
    ? eligible
    : EVENT_POOL.filter((event) => !state.seenEventIds.includes(event.id) && meetsRequirements(state, event.requirements));
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
  state.nextTags = [...new Set([...(payload.nextTags || [])])];
}

function successProbability(state, choice) {
  const model = PROBABILITY_MODELS[choice.successModel];
  if (!model) return null;
  let probability = model.base + (choice.probabilityBonus || 0);
  ATTRIBUTE_KEYS.forEach((key) => {
    if (model[key]) probability += (state.attributes[key] - 50) * model[key];
  });
  return clamp(probability, 0.08, 0.92);
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
  return state.turn >= MAX_TURNS || state.attributes.time <= 0 || state.attributes.energy <= 0;
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
    counters: { applications: 0, interviews: 0, referrals: 0, offers: 0, rejections: 0, interviewLeads: 0, offerLeads: 0 },
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
  const opening = EVENT_BY_ID.get("market-crossroads");
  state.currentEvent = presentEvent(opening, state);
  return state;
}

export function advanceCareerRun(currentState, choiceId) {
  if (!currentState || currentState.status !== "playing" || !currentState.currentEvent) {
    throw new Error("Career Run is not available for a Choice.");
  }
  const state = clone(currentState);
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
  if (!selectedOutcome) {
    selectedOutcome = { id: "resolved", message: "你做出了选择，求职地图继续展开。" };
  }
  applyChoicePayload(state, selectedOutcome);
  applyFlags(state, choice.flags);
  (event.cooldownTags || []).forEach((tag) => { state.cooldowns[tag] = 2; });
  state.seenEventIds.push(event.id);
  state.turn += 1;
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
  let id = "no_offer";
  if (state.flags.dreamOffer) id = "dream_offer";
  else if (state.counters.offers >= 2) id = "multiple_offers";
  else if (state.flags.referralOffer) id = "referral_success";
  else if (state.counters.offers > 0 && state.counters.rejections >= 3) id = "late_bloomer";
  else if (state.flags.unexpectedOffer) id = "unexpected_offer";
  else if (state.attributes.energy <= 0) id = "burnout";
  else if (state.counters.offers > 0) id = "unexpected_offer";
  else if (state.counters.applications > 0 || state.counters.interviews > 0) id = "still_searching";
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
  if (state.failureTags.hr_interview) interviewBranches.push("hr");
  if (state.failureTags.group_interview) interviewBranches.push("group");
  if (!interviewBranches.length) interviewBranches.push("hr");
  if (!signals.length) signals.push("本局表现较均衡，Path 会从通用主线开始，并保留随时调整的空间。");

  return {
    signals,
    profile: {
      stage: state.counters.offers ? "offer" : state.counters.interviews ? "interviewing" : state.counters.applications ? "applying" : "materials",
      jobti_type: persona.key,
      candidate_background: "student",
      profile_branches: [...new Set(profileBranches)],
      search_branches: [...new Set(searchBranches)],
      skill_branches: [...new Set(skillBranches)],
      interview_branches: [...new Set(interviewBranches)],
      application_strategy: state.behavior.action > state.behavior.analysis ? "batch" : "precision",
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
