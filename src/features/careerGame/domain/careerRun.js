import { CAREER_EVENT_POOL, RARE_EVENT_IDS } from "../config/careerEventPool";
import { LEGACY_BY_ID } from "../config/legacyPool";
import {
  ACHIEVEMENT_THRESHOLDS,
  BEHAVIOR_KEYS,
  ENDING_COPY,
  FIRST_RUN_RARE_EVENT_TURN,
  GAME_VERSION,
  INITIAL_ATTRIBUTES,
  MAX_OVERTIME_TURNS,
  MAX_RARE_EVENTS_PER_RUN,
  MAX_TURNS,
  MIN_ORDINARY_EVENTS_BETWEEN_RARE,
  MIN_ORDINARY_EVENTS_BETWEEN_RARE_CONTINUATIONS,
  PERSONA_COPY,
  PERSONA_PROFILES,
  PITY_BONUSES,
  PROBABILITY_MODELS,
  RARE_EVENT_WEIGHT_MULTIPLIER,
  RARE_ROUTE_CONTINUATION_WEIGHT_MULTIPLIER,
  RESOURCE_TUNING,
  STILL_SEARCHING_VARIANTS,
  STRATEGY_TUNING,
  TURN_TIME_COST,
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
  if (Number.isFinite(requirements.minTurn) && state.turn < requirements.minTurn) return false;
  if (Object.entries(minAttributes).some(([key, value]) => (state.attributes[key] ?? 0) < value)) return false;
  if (Object.entries(maxAttributes).some(([key, value]) => (state.attributes[key] ?? 0) > value)) return false;
  if (Object.entries(minCounters).some(([key, value]) => (state.counters[key] ?? 0) < value)) return false;
  if (Object.keys(requirements.minCountersAny || {}).length
    && !Object.entries(requirements.minCountersAny).some(([key, value]) => (state.counters[key] ?? 0) >= value)) return false;
  if ((requirements.flagsAny || []).length && !requirements.flagsAny.some((flag) => state.flags[flag])) return false;
  if ((requirements.flagsAll || []).some((flag) => !state.flags[flag])) return false;
  if ((requirements.flagsAbsent || []).some((flag) => state.flags[flag])) return false;
  if (Object.entries(requirements.minMetrics || {}).some(([key, value]) => (state.metrics?.[key] ?? 0) < value)) return false;
  if (Object.entries(requirements.minRoutes || {}).some(([key, value]) => (state.routes?.[key] ?? 0) < value)) return false;
  return true;
}

function presentEvent(event, state, { applyIncident = true, incidentDeltas: storedIncidentDeltas = null } = {}) {
  const incidentDeltas = applyIncident
    ? applyIncidentEffects(state, event)
    : clone(storedIncidentDeltas || {});
  state.minimums.energy = Math.min(state.minimums.energy, state.attributes.energy);
  state.minimums.confidence = Math.min(state.minimums.confidence, state.attributes.confidence);
  state.maximums.profile = Math.max(state.maximums.profile, state.attributes.profile);
  state.maximums.network = Math.max(state.maximums.network, state.attributes.network);
  return {
    id: event.id,
    category: event.category,
    title: event.title,
    description: event.description,
    rarity: event.rarity || "standard",
    incidentApplied: true,
    incidentDeltas,
    choices: event.choices.map((item) => ({
      ...clone(item),
      available: meetsRequirements(state, item.requirements),
    })),
  };
}

function isRareRouteContinuation(event, state) {
  const routeRequirements = Object.entries(event.requirements?.minRoutes || {});
  return event.rarity === "rare"
    && routeRequirements.length > 0
    && routeRequirements.every(([key, value]) => (state.routes?.[key] ?? 0) >= value);
}

function eventWeight(event, state) {
  let weight = event.baseWeight || 1;
  if (event.rarity === "rare") {
    weight *= isRareRouteContinuation(event, state)
      ? RARE_ROUTE_CONTINUATION_WEIGHT_MULTIPLIER
      : RARE_EVENT_WEIGHT_MULTIPLIER;
  }
  const tags = new Set(event.tags || []);
  if ((event.tags || []).some((tag) => state.nextTags.includes(tag))) weight *= 1.8;
  if (tags.has("networking")) weight *= 0.7 + state.attributes.network / 65;
  if (tags.has("profile")) weight *= state.attributes.profile < 55 ? 1.35 : 0.8;
  if (tags.has("deadline") && state.attributes.time < 45) weight *= 1.6;
  if (tags.has("interview") && state.counters.interviewLeads > 0) weight *= 1.4;
  if (tags.has("offer") && state.counters.offerLeads > 0) weight *= 1.5;
  if (tags.has("alternative")) weight *= Math.min(1.25, 1 + (state.behavior.exploration || 0) / 80);
  if (event.category === "application") weight *= Math.min(1.25, 1 + (state.behavior.action || 0) / 80);
  if (tags.has("wellbeing")) weight *= Math.min(1.25, 1 + (state.behavior.pacing || 0) / 80);
  if (tags.has("travel")) weight *= state.modifiers.travelWeight || 1;
  if (tags.has("freelance")) weight *= state.modifiers.freelanceWeight || 1;
  if (tags.has("startup")) weight *= state.modifiers.startupWeight || 1;
  if (tags.has("stall")) weight *= state.modifiers.stallWeight || 1;
  if (tags.has("academic")) weight *= state.modifiers.academicWeight || 1;
  if (tags.has("networking") && state.counters.networkingOpportunities > 0) weight *= 1.3;
  const previousCategory = state.history.at(-1)?.category;
  if (previousCategory === event.category) weight *= 0.72;
  return Math.max(event.rarity === "rare" ? 0.001 : 0.05, weight);
}

function rareEventFitsRunRhythm(event, state) {
  if (event.rarity !== "rare") return true;
  const rareIndexes = state.history
    .map((entry, index) => entry.rarity === "rare" ? index : -1)
    .filter((index) => index >= 0);
  if (state.firstRunRareEventMode) {
    if (rareIndexes.length >= 1) return false;
    if (state.turn < FIRST_RUN_RARE_EVENT_TURN) return false;
  }
  if (rareIndexes.length >= MAX_RARE_EVENTS_PER_RUN) return false;
  const lastRareIndex = rareIndexes.at(-1);
  if (!Number.isFinite(lastRareIndex)) return true;
  const minimumSpacing = isRareRouteContinuation(event, state)
    ? MIN_ORDINARY_EVENTS_BETWEEN_RARE_CONTINUATIONS
    : MIN_ORDINARY_EVENTS_BETWEEN_RARE;
  return state.history.length - lastRareIndex - 1 >= minimumSpacing;
}

function eventOccurrenceCount(state, eventId) {
  return state.history.filter((entry) => entry.eventId === eventId).length;
}

function eventCanAppear(event, state) {
  const occurrences = eventOccurrenceCount(state, event.id);
  if (occurrences === 0) return true;
  if (event.rarity === "rare") return false;
  return occurrences < (event.repeatable?.maxOccurrences || 1);
}

function selectNextEvent(state) {
  const stage = stageForTurn(state.turn);
  state.stage = stage;
  const recentEventIds = new Set(state.history.slice(-5).map((entry) => entry.eventId));
  const forcedId = state.counters.pendingOffers > 0
    ? "ordinary-offer"
    : state.counters.offerLeads > 0 && state.opportunityAges.final >= 2
      ? "final-round"
      : state.counters.interviewLeads > 0 && state.opportunityAges.interview >= 2
        ? ["hr-screening", "technical-interview", "behavioral-interview", "group-interview"]
          .find((id) => !state.seenEventIds.includes(id))
        : null;
  const firstRunRareDue = state.firstRunRareEventMode
    && !state.history.some((entry) => entry.rarity === "rare")
    && state.turn >= FIRST_RUN_RARE_EVENT_TURN;
  if (forcedId && !firstRunRareDue) {
    const forced = EVENT_BY_ID.get(forcedId);
    if (forced && meetsRequirements(state, forced.requirements)) {
      state.currentEvent = presentEvent(forced, state);
      return true;
    }
  }
  const stageEligible = CAREER_EVENT_POOL.filter((event) => {
    if (!eventCanAppear(event, state)) return false;
    if (recentEventIds.has(event.id)) return false;
    if (!event.stages.includes(stage) && !(stage === "closing" && event.stages.includes("decision"))) return false;
    if (!meetsRequirements(state, event.requirements)) return false;
    if (!rareEventFitsRunRhythm(event, state)) return false;
    return true;
  });
  const eligible = stageEligible.filter((event) =>
    !(event.cooldownTags || []).some((tag) => (state.cooldowns[tag] || 0) > 0));
  const firstRunRareCandidates = firstRunRareDue
    ? eligible.filter((event) => event.rarity === "rare")
    : [];
  if (firstRunRareCandidates.length) {
    const weightedRare = firstRunRareCandidates.map((event) => ({ event, weight: eventWeight(event, state) }));
    const totalRareWeight = weightedRare.reduce((sum, item) => sum + item.weight, 0);
    const random = nextRandom(state.randomState);
    state.randomState = random.randomState;
    let rareCursor = random.value * totalRareWeight;
    const selectedRare = weightedRare.find((item) => {
      rareCursor -= item.weight;
      return rareCursor <= 0;
    })?.event || weightedRare.at(-1).event;
    state.currentEvent = presentEvent(selectedRare, state);
    return true;
  }
  const hasOrdinaryEligible = eligible.some((event) => event.rarity !== "rare");
  const ordinaryFallback = CAREER_EVENT_POOL.filter((event) => event.rarity !== "rare"
    && eventCanAppear(event, state)
    && meetsRequirements(state, event.requirements)
    && !recentEventIds.has(event.id));
  const candidates = hasOrdinaryEligible ? eligible : [...eligible, ...ordinaryFallback];
  if (!candidates.length || candidates.every((event) => event.rarity === "rare")) return false;

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

function tunedAmount(key, amount, tuneChoiceEffects) {
  if (!tuneChoiceEffects) return amount;
  if (key === "time") return 0;
  if (key === "energy" && amount > 0) return Math.max(1, Math.round(amount * RESOURCE_TUNING.positiveEnergyMultiplier));
  if (key === "confidence" && amount > 0) return Math.max(1, Math.round(amount * RESOURCE_TUNING.positiveConfidenceMultiplier));
  return amount;
}

function applyAttributes(state, effects = {}, tuneChoiceEffects = false) {
  Object.entries(effects).forEach(([key, amount]) => {
    if (!ATTRIBUTE_KEYS.includes(key)) return;
    state.attributes[key] = clamp((state.attributes[key] || 0) + tunedAmount(key, amount, tuneChoiceEffects));
  });
}

function resolveIncidentAmount(state, configuredAmount) {
  if (Number.isFinite(configuredAmount)) return configuredAmount;
  const min = Math.ceil(configuredAmount?.min ?? 0);
  const max = Math.floor(configuredAmount?.max ?? min);
  if (max <= min) return min;
  const random = nextRandom(state.randomState);
  state.randomState = random.randomState;
  return min + Math.floor(random.value * (max - min + 1));
}

function applyIncidentEffects(state, event) {
  const lateEffects = Number.isFinite(event.lateFromTurn) && state.turn >= event.lateFromTurn
    ? event.lateIncidentEffects || {}
    : {};
  const configuredEffects = { ...(event.incidentEffects || {}), ...lateEffects };
  const effects = Object.fromEntries(
    Object.entries(configuredEffects).map(([key, amount]) => [key, resolveIncidentAmount(state, amount)]),
  );
  applyAttributes(state, effects);
  return effects;
}

function applyCounters(state, effects = {}) {
  Object.entries(effects).forEach(([key, amount]) => {
    state.counters[key] = Math.max(0, (state.counters[key] || 0) + amount);
    if (key === "rejections" && amount > 0) {
      state.attributes.confidence = clamp(state.attributes.confidence - amount * RESOURCE_TUNING.rejectionConfidenceCost);
    }
  });
}

function applyFlags(state, flags = []) {
  flags.forEach((flag) => { state.flags[flag] = true; });
}

function applyFailureTags(state, tags = []) {
  tags.forEach((tag) => { state.failureTags[tag] = (state.failureTags[tag] || 0) + 1; });
}

function applyChoicePayload(state, payload = {}) {
  applyAttributes(state, payload.effects, true);
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

function successProbability(state, event, choice) {
  if (choice.probabilityRule) {
    if (choice.probabilityRule === "startup_push") {
      const lowNetworking = (state.behavior.networking || 0) < 6;
      const lowConfidence = state.attributes.confidence < 35;
      if (lowNetworking && lowConfidence) return 0.6;
      if (lowNetworking || lowConfidence) return 0.7;
      return 0.95;
    }
    if (choice.probabilityRule === "editorial_voice") {
      return state.attributes.confidence < 40 ? 0.6 : 0.9;
    }
    if (choice.probabilityRule === "interview_improv") {
      const lowEnergy = state.attributes.energy < 30;
      const lowExpression = (state.behavior.expression || 0) < 6;
      if (lowEnergy && lowExpression) return 0.55;
      if (lowEnergy || lowExpression) return 0.7;
      return 0.9;
    }
  }
  const model = PROBABILITY_MODELS[choice.successModel];
  if (!model) return null;
  let probability = model.base + (choice.probabilityBonus || 0);
  ATTRIBUTE_KEYS.forEach((key) => {
    if (model[key]) probability += state.attributes[key] * model[key];
  });
  const streak = model.pity ? state.failureStreaks[model.pity] || 0 : 0;
  const pity = (PITY_BONUSES[model.pity] || []).find(([threshold]) => streak >= threshold)?.[1] || 0;
  const legacyBonus = choice.successModel === "network_outreach" || choice.successModel === "referral"
    ? state.modifiers.networkingProbability || 0
    : choice.successModel?.includes("interview") || choice.successModel === "offer_decision"
      ? state.modifiers.interviewProbability || 0
      : 0;
  let situationalBonus = 0;
  if (event.category === "interview") {
    situationalBonus += Math.min(
      STRATEGY_TUNING.interviewPreparationBonusCap,
      (state.strategyProgress?.interviewPreparation || 0)
        * STRATEGY_TUNING.interviewPreparationBonusPerChoice,
    );
  }
  if (event.id === "final-round" && !state.legacyUsage.pillowUsed) {
    situationalBonus += state.modifiers.finalRoundProbability || 0;
  }
  if (event.category === "interview" && state.legacyUsage.nextInterviewBonus) {
    situationalBonus += state.legacyUsage.nextInterviewBonus;
  }
  if (["behavioral-interview", "case-interview"].includes(event.id) && !state.legacyUsage.interviewerApprovalUsed) {
    situationalBonus += state.modifiers.authenticInterviewProbability || 0;
  }
  if (choice.successModel === "group_interview") situationalBonus += state.modifiers.groupInterviewProbability || 0;
  return clamp(probability + pity + legacyBonus + situationalBonus, 0.08, model.cap || 0.92);
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
  if (state.attributes.time <= 0 || state.attributes.energy <= 0 || state.attributes.confidence <= 0) return true;
  if (state.turn < MAX_TURNS) return false;
  const unresolvedPipeline = state.counters.pendingOffers > 0 || state.counters.offerLeads > 0 || state.counters.interviewLeads > 0;
  return !unresolvedPipeline || state.turn >= MAX_OVERTIME_TURNS;
}

function normalizeState(state) {
  state.counters = {
    applications: 0, interviews: 0, referrals: 0, offers: 0, rejections: 0,
    interviewLeads: 0, offerLeads: 0, pendingOffers: 0, acceptedOffers: 0,
    declinedOffers: 0, waitlists: 0,
    networkingOpportunities: 0, groupInterviews: 0, lowEnergyEvents: 0,
    ...(state.counters || {}),
  };
  state.metrics = { careerMomentum: 0, alternativePath: 0, lifeSatisfaction: 50, ...(state.metrics || {}) };
  state.strategyProgress = { interviewPreparation: 0, ...(state.strategyProgress || {}) };
  state.routes = {
    startup: 0, freelance: 0, academic: 0, travel: 0, stall: 0,
    creator: 0, careerCreator: 0, writingCreator: 0,
    startupEmployee: 0, hiddenCareer: 0, ...(state.routes || {}),
  };
  state.opportunityAges = { interview: 0, final: 0, ...(state.opportunityAges || {}) };
  state.failureStreaks = { application: 0, interview: 0, final: 0, ...(state.failureStreaks || {}) };
  state.modifiers = { ...(state.modifiers || {}) };
  state.legacyUsage = {
    pillowUsed: false,
    powerBankUsed: false,
    interviewReviewUsed: false,
    nextInterviewBonus: 0,
    interviewerApprovalUsed: false,
    bonusApplications: 0,
    espressoDrains: 0,
    ...(state.legacyUsage || {}),
  };
  state.restChoices = state.restChoices || 0;
  state.minimums = {
    energy: state.attributes?.energy ?? INITIAL_ATTRIBUTES.energy,
    confidence: state.attributes?.confidence ?? INITIAL_ATTRIBUTES.confidence,
    ...(state.minimums || {}),
  };
  state.previousFailedRun = Boolean(state.previousFailedRun);
  state.firstRunRareEventMode = Boolean(state.firstRunRareEventMode);
  state.startingAttributes = {
    ...INITIAL_ATTRIBUTES,
    ...(state.startingAttributes || {}),
  };
  state.maximums = {
    profile: state.attributes?.profile ?? INITIAL_ATTRIBUTES.profile,
    network: state.attributes?.network ?? INITIAL_ATTRIBUTES.network,
    ...(state.maximums || {}),
  };
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

export function createCareerRun({ seed = Date.now(), legacyId = null, previousFailedRun = false, firstRun = false } = {}) {
  const normalizedSeed = Number(seed) >>> 0 || 1;
  const state = {
    version: GAME_VERSION,
    seed: normalizedSeed,
    randomState: normalizedSeed,
    status: "playing",
    role: "graduate",
    stage: "preparation",
    previousFailedRun: Boolean(previousFailedRun),
    firstRunRareEventMode: Boolean(firstRun),
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
    legacy: null,
  };
  normalizeState(state);
  const legacy = LEGACY_BY_ID.get(legacyId);
  if (legacy) {
    state.legacy = clone(legacy);
    state.modifiers = clone(legacy.modifiers || {});
    applyAttributes(state, legacy.initialEffects || {});
    state.minimums.energy = state.attributes.energy;
    state.minimums.confidence = state.attributes.confidence;
    if (legacy.id === "campus-celebrity") {
      const random = nextRandom(state.randomState);
      state.randomState = random.randomState;
      if (random.value < (state.modifiers.networkingOpportunityChance || 0)) {
        state.counters.networkingOpportunities += 1;
      } else {
        applyAttributes(state, { network: state.modifiers.networkingFallback || 0 });
      }
      state.maximums.network = state.attributes.network;
    }
  }
  state.startingAttributes = clone(state.attributes);
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
    if (savedState.currentEvent.incidentApplied) {
      state.currentEvent = presentEvent(event, state, {
        applyIncident: false,
        incidentDeltas: savedState.currentEvent.incidentDeltas,
      });
    } else {
      state.currentEvent = presentEvent(event, state);
    }
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
  applyAttributes(state, { time: -TURN_TIME_COST });
  if (event.id === "final-round" && state.modifiers.finalRoundEnergy && !state.legacyUsage.pillowUsed) {
    applyAttributes(state, { energy: state.modifiers.finalRoundEnergy });
  }
  applyChoicePayload(state, choice);
  if (state.legacy?.id === "portfolio-made" && event.tags?.includes("portfolio")) applyAttributes(state, { time: state.modifiers.portfolioTimeDiscount || 0 });
  if (state.legacy?.id === "jd-reader" && (choice.id === "research" || choice.id === "fit" || choice.id === "benchmark")) applyAttributes(state, { profile: state.modifiers.researchProfileBonus || 0 });
  Object.entries(choice.behaviorEffects || {}).forEach(([key, amount]) => {
    state.behavior[key] = (state.behavior[key] || 0) + amount;
  });
  if (choice.intensity === "high" && before.energy < 30) applyAttributes(state, { energy: -3, confidence: -1 });

  const probability = successProbability(state, event, choice);
  const conditionalOutcome = choice.conditionalOutcomes?.find((candidate) => {
    if (!candidate.when) return true;
    if (candidate.when.routeGreaterThan) {
      const [left, right] = candidate.when.routeGreaterThan;
      return (state.routes[left] || 0) > (state.routes[right] || 0);
    }
    return false;
  })?.outcome;
  let selectedOutcome = conditionalOutcome || choice.outcome || null;
  let succeeded = null;
  if (probability !== null) {
    const random = nextRandom(state.randomState);
    state.randomState = random.randomState;
    succeeded = random.value <= probability;
    selectedOutcome = succeeded ? choice.success : choice.failure;
  }
  if (!selectedOutcome) throw new Error(`Choice is missing a configured outcome: ${event.id}/${choice.id}`);
  applyChoicePayload(state, selectedOutcome);
  Object.entries(choice.strategyEffects || {}).forEach(([key, amount]) => {
    state.strategyProgress[key] = Math.max(0, (state.strategyProgress[key] || 0) + amount);
  });
  applyFlags(state, choice.flags);
  recordPipelineResolution(state, event, succeeded, choice);
  if (event.id === "final-round" && state.modifiers.finalRoundEnergy && !state.legacyUsage.pillowUsed) {
    state.legacyUsage.pillowUsed = true;
  }
  if (event.category === "interview" && event.id !== "final-round" && choice.id !== "reschedule") {
    if (state.legacyUsage.nextInterviewBonus) state.legacyUsage.nextInterviewBonus = 0;
    if (succeeded === false && state.modifiers.interviewFailureProfile && !state.legacyUsage.interviewReviewUsed) {
      applyAttributes(state, { profile: state.modifiers.interviewFailureProfile });
      state.legacyUsage.interviewReviewUsed = true;
      state.legacyUsage.nextInterviewBonus = state.modifiers.nextInterviewProbability || 0;
    }
  }
  if (["behavioral-interview", "case-interview"].includes(event.id)) {
    if (succeeded && ["stories", "honest", "explore", "authentic"].includes(choice.id)) {
      state.flags.authenticInterviewSuccess = true;
    }
    if (state.modifiers.authenticInterviewProbability && !state.legacyUsage.interviewerApprovalUsed) {
      state.legacyUsage.interviewerApprovalUsed = true;
    }
  }
  if (choice.successModel === "group_interview") state.counters.groupInterviews += 1;
  if (event.id === "final-round" && choice.id === "protect") state.flags.restedBeforeFinal = true;
  if (event.id === "rejection-wave" && choice.id === "review"
    && Object.keys(state.failureTags).some((tag) => tag.includes("interview"))) {
    state.flags.reviewedInterviewFailure = true;
  }
  if (event.category === "networking" && state.counters.networkingOpportunities > 0) {
    state.counters.networkingOpportunities -= 1;
  }
  if (event.category === "application" && state.modifiers.bonusApplicationChance
    && state.legacyUsage.bonusApplications < (state.modifiers.maxBonusApplications || 0)) {
    const random = nextRandom(state.randomState);
    state.randomState = random.randomState;
    if (random.value < state.modifiers.bonusApplicationChance) {
      state.counters.applications += 1;
      state.legacyUsage.bonusApplications += 1;
    }
  }
  const rawLowEnergy = state.attributes.energy <= 20;
  if (rawLowEnergy) state.counters.lowEnergyEvents += 1;
  state.minimums.energy = Math.min(state.minimums.energy, state.attributes.energy);
  if (state.attributes.energy > 0 && state.attributes.energy <= (state.modifiers.lowEnergyThreshold || -1)
    && !state.legacyUsage.powerBankUsed) {
    applyAttributes(state, { energy: state.modifiers.lowEnergyRecovery || 0 });
    state.legacyUsage.powerBankUsed = true;
  }
  if (state.modifiers.postEventEnergyDrainChance && state.attributes.energy > 0) {
    const random = nextRandom(state.randomState);
    state.randomState = random.randomState;
    if (random.value < state.modifiers.postEventEnergyDrainChance) {
      state.attributes.energy = Math.max(1, state.attributes.energy - (state.modifiers.postEventEnergyDrain || 0));
      state.legacyUsage.espressoDrains += 1;
    }
  }
  const resourcesDepleted = state.attributes.time <= 0 || state.attributes.energy <= 0;
  (event.cooldownTags || []).forEach((tag) => { state.cooldowns[tag] = 2; });
  state.seenEventIds.push(event.id);
  state.turn += 1;
  const isRestChoice = (choice.behaviorEffects?.pacing || 0) >= 3 && (choice.effects?.energy || 0) > 0;
  if (isRestChoice && !resourcesDepleted) {
    state.restChoices += 1;
    if (state.restChoices === 1) applyAttributes(state, { energy: 3 });
    else applyChoicePayload(state, { metrics: { careerMomentum: -2 } });
  }
  if (!resourcesDepleted && state.turn % 3 === 0) applyAttributes(state, { energy: 2 });
  if (!resourcesDepleted && state.metrics.lifeSatisfaction >= 70) applyAttributes(state, { confidence: 1 });
  if (state.metrics.lifeSatisfaction <= 25 && choice.intensity === "high") applyAttributes(state, { energy: -2 });
  ageOpportunities(state);
  state.minimums.energy = Math.min(state.minimums.energy, state.attributes.energy);
  state.minimums.confidence = Math.min(state.minimums.confidence, state.attributes.confidence);
  state.maximums.profile = Math.max(state.maximums.profile, state.attributes.profile);
  state.maximums.network = Math.max(state.maximums.network, state.attributes.network);
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
    rarity: event.rarity || "standard",
    choiceId: choice.id,
    choiceLabel: choice.label,
    outcomeId: selectedOutcome.id === "resolved"
      ? succeeded === null ? "neutral" : succeeded ? "success" : "failure"
      : selectedOutcome.id,
    outcome: succeeded === null ? "neutral" : succeeded ? "success" : "failure",
    outcomeMessage: selectedOutcome.message,
    succeeded,
    deltas: state.lastOutcome.deltas,
    incidentDeltas: clone(state.currentEvent.incidentDeltas || {}),
  });

  if (shouldComplete(state) || !selectNextEvent(state)) {
    state.status = "complete";
    state.stage = state.attributes.energy <= 0
      ? "burnout"
      : state.attributes.confidence <= 0
        ? "paused"
        : "closing";
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
  if (state.flags.careerCreatorReady && state.routes.creator >= 4) id = "career_creator";
  else if (state.flags.creatorReady && state.routes.creator >= 4) id = "content_creator";
  else if (state.flags.startupReady && state.routes.startup >= 70) id = "startup_founder";
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
  else if (state.attributes.confidence <= 0) id = "paused_search";
  if (id !== "still_searching") return { id, ...ENDING_COPY[id] };

  const hasActivePipeline = state.counters.pendingOffers > 0
    || state.counters.offerLeads > 0
    || state.counters.interviewLeads > 0;
  const variant = hasActivePipeline
    ? "active_pipeline"
    : state.counters.interviews >= 3
      ? "interview_conversion"
      : state.counters.applications >= 8 && state.counters.interviews <= 1
        ? "screening_gap"
        : state.maximums.profile >= 70 && state.counters.applications < 4
          ? "prepared_not_exposed"
          : "continuing";
  return {
    id,
    ...ENDING_COPY[id],
    variant,
    description: STILL_SEARCHING_VARIANTS[variant],
  };
}

function strongestBehavior(state) {
  return [...BEHAVIOR_KEYS].sort((a, b) => state.behavior[b] - state.behavior[a])[0];
}

function resolveAchievements(state, ending) {
  const achievements = [];
  const add = (id, title, description) => achievements.push({ id, title, description });
  if (state.counters.applications >= 8) add("application-engine", "申请流水线", `这一局送出了 ${state.counters.applications} 份申请。`);
  if (state.counters.interviews >= 3) add("interview-veteran", "面试老兵", `完成了 ${state.counters.interviews} 轮真实面试。`);
  if (state.counters.referrals > 0) add("warm-connection", "人脉就是财富", "通过真诚交流获得了 Referral 或内部信息。");
  if (state.maximums.profile >= ACHIEVEMENT_THRESHOLDS.developedProfile) add("profile-builder", "个人档案馆", `Profile 最高成长到 ${state.maximums.profile}。`);
  if (state.maximums.network >= 45) add("network-builder", "社交达人", `Network 最高成长到 ${state.maximums.network}。`);
  if (state.counters.rejections >= 3 && state.attributes.energy > 0) add("rejection-resilience", "拒信耐受训练", "经历多次拒绝后仍然完成了这一局。");
  if (state.metrics.alternativePath >= 20) add("alternative-route", "不走寻常路", "认真推进过至少一条非传统职业路线。");
  if (state.restChoices >= 2) add("rest-is-strategy", "会休息也是策略", "不止一次选择休息选项。");
  if (state.counters.acceptedOffers > 0) add("offer-accepted", "上岸", "核实条件后接受了一份 Offer。");
  if (state.counters.declinedOffers > 0) add("offer-declined", "拒绝的勇气", "听从自己的判断，拒绝了 Offer。");
  if (ending.id === "burnout") add("burnout-seen", "燃尽了", "精力提前耗尽了。");

  const earnedIncome = state.history.some((entry) => {
    const paidChoices = new Set([
      "paid-freelance:take",
      "freelance-referral:accept",
      "first-stall-day:review",
      "first-stall-day:one-off",
      "social-buyer:open",
      "creator-commission:accept-commission",
    ]);
    if (paidChoices.has(`${entry.eventId}:${entry.choiceId}`)) return true;
    return entry.eventId === "creator-commission" && entry.choiceId === "keep-voice" && entry.outcome === "success";
  });
  if (earnedIncome) add("side-income", "赚得比工资多", "通过 Freelance、摆摊或内容创作获得了实际收入或订单。");
  if (state.minimums.energy >= 30) add("energy-manager", "电量管理大师", "整局都将 Energy 保持在相对安全的水平。");
  const networkTransformed = state.startingAttributes.network <= 20
    && state.maximums.network >= 55;
  if (networkTransformed) add("network-transformation", "I人变E人", "Network 从较低水平成长到了较高水平。");
  const stalledProcesses = state.history.filter((entry) => ["quiet", "wait"].includes(entry.outcomeId)
    || ["waitlist", "process-cancelled"].includes(entry.eventId)).length;
  if (state.counters.waitlists >= 2 || stalledProcesses >= 2) add("waiting-room-regular", "爱的号码牌", "多次经历长期无回复、Waitlist 或流程停滞。");
  const profileGrewFromLow = state.startingAttributes.profile <= 25
    && state.maximums.profile >= ACHIEVEMENT_THRESHOLDS.developedProfile;
  const networkGrewFromLow = state.startingAttributes.network <= 20
    && state.maximums.network >= ACHIEVEMENT_THRESHOLDS.developedNetwork;
  if (profileGrewFromLow || networkGrewFromLow) add("late-bloomer-growth", "低开高走", "开局 Profile 或 Network 较低，最终成长到了较高水平。");
  if (state.counters.acceptedOffers > 0
    && (state.counters.rejections >= 3 || state.minimums.energy <= 20 || state.attributes.time <= 15)) {
    add("comeback-win", "打赢逆风局", "经历拒绝、低 Energy 或时间压力后仍然获得了 Offer。");
  }
  if (state.counters.acceptedOffers > 0 && state.counters.rejections === 0) add("green-light", "一路绿灯", "从申请到 Offer 的流程中没有经历拒绝。");
  if (state.previousFailedRun) add("play-again", "再来一轮", "经历过失败结局后，再次完成了一局游戏。");
  if (!achievements.length) add("first-run", "完成第一局", "你已经比开局时更清楚自己会怎样做选择。");
  return achievements;
}

function unlockedLegacyIds(state, ending) {
  const ids = [];
  if (state.maximums.network >= 25 || state.counters.referrals > 0) ids.push("senior-contact");
  if (state.maximums.profile >= 35) ids.push("readable-resume");
  if (state.counters.rejections >= 3) ids.push("rejection-calm");
  if (state.behavior.networking >= 5) ids.push("coffee-chat");
  if (state.counters.interviews > 0) ids.push("interview-notes");
  if (state.seenEventIds.includes("portfolio-weekend")) ids.push("portfolio-made");
  if (state.behavior.analysis >= 5) ids.push("jd-reader");
  if (ending.id === "burnout") ids.push("boundaries");
  if (["gap_year", "world_travel"].includes(ending.id)) ids.push("airport-regular");
  if (ending.id === "freelancer") ids.push("first-client");
  if (ending.id === "startup_founder") ids.push("first-user");
  if (ending.id === "stall_business") ids.push("stall-pass");
  if (ending.id === "academic") ids.push("professor-meeting");
  if (state.flags.restedBeforeFinal) ids.push("comfortable-pillow");
  if (state.minimums.energy <= 15 && ending.id !== "burnout") ids.push("power-bank");
  if (state.maximums.network >= 60) ids.push("campus-celebrity");
  if (state.counters.lowEnergyEvents >= 3) ids.push("seven-shot-americano");
  if (state.flags.reviewedInterviewFailure) ids.push("interview-review");
  if (state.counters.applications >= 15) ids.push("application-amnesia");
  if (state.flags.authenticInterviewSuccess) ids.push("interviewer-approval");
  if (state.counters.groupInterviews >= 2) ids.push("extrovert-mask");
  const fallback = ["senior-contact", "readable-resume", "rejection-calm", "jd-reader"];
  fallback.forEach((id) => { if (ids.length < 3 && !ids.includes(id)) ids.push(id); });
  return ids;
}

function selectLegacyChoices(state, ending) {
  const eligible = unlockedLegacyIds(state, ending);
  const offset = state.seed % eligible.length;
  const rotated = [...eligible.slice(offset), ...eligible.slice(0, offset)].slice(0, 3);
  return rotated.map((id) => clone(LEGACY_BY_ID.get(id))).filter(Boolean);
}

function buildRunStory(state, ending) {
  const decisions = [];
  if (state.counters.applications) decisions.push(`投出 ${state.counters.applications} 份申请`);
  if (state.counters.interviews) decisions.push(`完成 ${state.counters.interviews} 轮面试`);
  if (state.counters.referrals) decisions.push(`获得 ${state.counters.referrals} 次 Referral 或关键连接`);
  if (state.counters.declinedOffers) decisions.push(`拒绝 ${state.counters.declinedOffers} 份不够合适的 Offer`);
  if (state.metrics.alternativePath >= 20) decisions.push("认真走进了一条主线之外的可能");
  const body = decisions.length ? decisions.join("，") : "尝试了不同的准备、申请与恢复方式";
  return `你${body}。这一局走向「${ending.title}」，也留下了一条可以继续调整的求职 Path。`;
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
  const alternativeProgress = Math.max(
    ...Object.entries(state.routes || {}).map(([key, value]) => key === "creator" ? value * 25 : value),
  );
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
  const ending = resolveEnding(state);
  const orderedAttributes = [...ATTRIBUTE_KEYS].sort((a, b) => state.attributes[b] - state.attributes[a]);
  const weakestAttribute = [...ATTRIBUTE_KEYS].sort((a, b) => state.attributes[a] - state.attributes[b])[0];
  const rareEvents = state.history
    .filter((entry) => RARE_EVENT_IDS.has(entry.eventId))
    .map((entry) => entry.eventTitle);
  return {
    ending,
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
    achievements: resolveAchievements(state, ending),
    legacyChoices: selectLegacyChoices(state, ending),
    unlockedLegacyIds: unlockedLegacyIds(state, ending),
    runStory: buildRunStory(state, ending),
    runRecord: {
      minimumEnergy: state.minimums.energy,
      maximumProfile: state.maximums.profile,
      maximumNetwork: state.maximums.network,
      lifeSatisfaction: state.metrics.lifeSatisfaction,
      rareEvents,
    },
    path: buildPath(state, persona),
  };
}
