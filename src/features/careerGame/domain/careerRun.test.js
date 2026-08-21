import { describe, expect, it } from "vitest";

import {
  advanceCareerRun,
  createCareerRun,
  restoreCareerRun,
  summarizeCareerRun,
} from "./careerRun";
import { CAREER_EVENT_POOL } from "../config/careerEventPool";
import { RARE_EVENT_POOL } from "../config/rareEventPool";
import { MAX_OVERTIME_TURNS, MAX_TURNS, RARE_EVENT_WEIGHT_MULTIPLIER } from "../config/gameConfig";
import { LEGACY_POOL } from "../config/legacyPool";

function availableChoices(state) {
  return state.currentEvent?.choices.filter((choice) => choice.available !== false) ?? [];
}

function finishRun(seed, choose) {
  let state = createCareerRun({ seed });
  let safety = 0;

  while (state.status !== "complete" && safety < 30) {
    const choices = availableChoices(state);
    expect(choices.length).toBeGreaterThanOrEqual(2);
    const choice = choose(choices, state) ?? choices[0];
    state = advanceCareerRun(state, choice.id);
    safety += 1;
  }

  expect(safety).toBeLessThan(30);
  expect(state.status).toBe("complete");
  return state;
}

describe("Career Run public behavior", () => {
  it("keeps the approved regular-event Choice set in sync with the authored source", () => {
    const expectedChoices = {
      "market-crossroads": ["research", "apply", "profile", "pace"],
      "resume-first-draft": ["ship", "tailor", "rest"],
      "linkedin-cleanup": ["rewrite", "benchmark", "minimum"],
      "portfolio-weekend": ["build", "curate", "skip"],
      "mentor-review": ["specific", "open"],
      "dream-job-deadline": ["direct", "tailor", "referral"],
      "graduate-program-window": ["research", "apply", "skip"],
      "batch-application-night": ["batch", "shortlist", "recover"],
      "crowded-role": ["apply", "fit", "move"],
      "alumni-reply": ["prepare", "ask-referral"],
      "career-fair": ["target", "explore", "online"],
      "coffee-chat-reply": ["curious", "pitch"],
      "oa-invitation": ["practice", "start", "withdraw"],
      "hr-screening": ["prepare", "natural"],
      "technical-interview": ["drill", "fundamentals", "wing"],
      "behavioral-interview": ["stories", "match"],
      "group-interview": ["facilitate", "lead", "observe"],
      "final-round": ["deep", "authentic"],
      "rejection-wave": ["review", "apply", "pause"],
      waitlist: ["follow", "continue"],
      "ordinary-offer": ["accept", "decline"],
      "referral-conclusion": ["finish", "pressure", "steady"],
      "surprise-track": ["explore", "focus"],
      "group-interview-linkedin": ["coffee-chat", "withdraw", "focus"],
      "direction-doubt": ["broaden", "industry-chat", "continue"],
      "wrong-resume-version": ["correct", "leave"],
      "instant-rejection": ["inspect", "keep-applying", "self-doubt"],
      "networking-silence": ["rewrite", "known-contacts", "profile-focus"],
      "group-interruption": ["wait-turn", "reclaim"],
      "great-interview-rejection": ["accept", "request-feedback", "self-doubt"],
    };

    Object.entries(expectedChoices).forEach(([eventId, choiceIds]) => {
      const event = CAREER_EVENT_POOL.find((candidate) => candidate.id === eventId);
      expect(event?.choices.map((choice) => choice.id), eventId).toEqual(choiceIds);
    });
  });

  it("starts every player from the configured Graduate baseline", () => {
    const state = createCareerRun({ seed: 1953 });

    expect(state.status).toBe("playing");
    expect(state.role).toBe("graduate");
    expect(state.turn).toBe(0);
    expect(state.attributes).toEqual({
      time: 100,
      energy: 60,
      confidence: 45,
      profile: 15,
      network: 10,
    });
    expect(state.currentEvent.id).toBe("market-crossroads");
    expect(state.currentEvent.choices.length).toBeGreaterThanOrEqual(2);
    expect(state.currentEvent.choices.length).toBeLessThanOrEqual(4);
  });

  it("uses the approved opening and LinkedIn networking configuration", () => {
    const opening = CAREER_EVENT_POOL.find((event) => event.id === "market-crossroads");
    const linkedin = CAREER_EVENT_POOL.find((event) => event.id === "linkedin-cleanup");
    const connections = linkedin.choices.find((choice) => choice.id === "benchmark");

    expect(opening).toMatchObject({
      title: "求职季开始了。打开电脑，第一件事你打算做什么？",
      description: "岗位、材料和时间线都需要梳理，但今天只需要选一件最值得推进的事。",
    });
    expect(linkedin.title).toBe("你打开 LinkedIn，发现除了头像全是空白");
    expect(connections).toMatchObject({
      label: "快速补充一些经历，然后就去发展 connections",
      effects: { time: -6, energy: -4, profile: 4, network: 8 },
      behaviorEffects: { networking: 3, action: 2 },
    });
  });

  it("turns the third Technical Interview strategy into deliberate recovery", () => {
    const technical = CAREER_EVENT_POOL.find((event) => event.id === "technical-interview");
    const recovery = technical.choices.find((choice) => choice.id === "wing");

    expect(technical.title).toBe("收到了一场 Technical Interview 邀请，就在下周");
    expect(recovery).toMatchObject({
      label: "头脑清醒才是关键，这周需要多休息，而不是在脑海里塞满知识点",
      effects: { time: -4, energy: 8 },
      behaviorEffects: { pacing: 4, resilience: 2 },
      successModel: "technical_interview",
    });
    expect(recovery.probabilityBonus).toBeUndefined();
  });

  it("keeps the approved standard recruiting Event journey", () => {
    const standardEvents = CAREER_EVENT_POOL.filter((event) => event.rarity !== "rare");
    const documentedTitles = [
      "求职季开始了。打开电脑，第一件事你打算做什么？",
      "第一版简历从哪里写起？",
      "你打开 LinkedIn，发现除了头像全是空白",
      "周末限定任务：要不要做一个作品集？",
      "你询问了前辈，获得了一次真人 Review 简历的机会",
      "距离 Dream Job 的投递截止日期只剩两天了！",
      "大公司的 Graduate Programme 开放了申请入口",
      "收藏的岗位越来越多，今晚投哪些？",
      "打开一个岗位，发现已经有 1000+ 人申请了",
      "叮——昨天联系的校友回复了你的消息",
      "参加了一场 Career Fair，会场人山人海",
      "Coffee Chat 邀请被行业里的前辈接受了",
      "你收到了一份在线测试邀请",
      "HR 来电，这是一次 Screening Call",
      "收到了一场 Technical Interview 邀请，就在下周",
      "Behavioral Question 问到你“曾经的一次失败经历”，要怎么讲呢？",
      "你参加了一场 Group Interview，总共八个人围着一张桌子坐下",
      "披荆斩棘，你终于来到了终面现场",
      "拒信今天选择组团抵达",
      "公司通知你进入 Waitlist",
      "一份不完美、但可以接受的 Offer",
      "Referral 真的把你送到了最后一关。这场面试成功，你的 Offer 就会到手",
      "一个 HR 发来消息，是你从没考虑过的岗位方向",
    ];

    expect(standardEvents.map((event) => event.title)).toEqual(expect.arrayContaining(documentedTitles));
    expect(standardEvents.find((event) => event.id === "assessment-centre-group")).toBeUndefined();
  });

  it("runs a full recruiting season before normal or pipeline closing", () => {
    expect(MAX_TURNS).toBe(20);
    const state = finishRun(20260818, (choices) => choices.toSorted(
      (a, b) => (b.effects?.energy || 0) - (a.effects?.energy || 0),
    )[0]);

    expect(state.history.length).toBeGreaterThanOrEqual(20);
    expect(state.history.length).toBeLessThanOrEqual(MAX_OVERTIME_TURNS);
    expect(state.stage).toBe("closing");
  });

  it("surfaces an earned interview opportunity before it can silently expire", () => {
    const state = createCareerRun({ seed: 1953 });
    state.turn = 8;
    state.stage = "application";
    state.counters.interviewLeads = 1;
    state.opportunityAges.interview = 2;

    const next = advanceCareerRun(state, "research");

    expect(next.currentEvent.category).toBe("interview");
    expect(next.currentEvent.id).toMatch(/screening|interview/);
  });

  it("keeps an Offer pending until the player accepts or declines it", () => {
    const state = createCareerRun({ seed: 31 });
    state.turn = 17;
    state.currentEvent = {
      id: "ordinary-offer",
      choices: [],
    };
    state.counters.pendingOffers = 1;

    const accepted = advanceCareerRun(state, "accept");

    expect(accepted.counters.offers).toBeGreaterThanOrEqual(1);
    expect(accepted.counters.acceptedOffers).toBe(1);
    expect(accepted.counters.pendingOffers).toBe(0);
  });

  it("ends the run immediately when Time or Energy reaches zero", () => {
    const noTime = createCareerRun({ seed: 12 });
    noTime.attributes.time = 1;
    const timeEnding = advanceCareerRun(noTime, "research");

    const noEnergy = createCareerRun({ seed: 13 });
    noEnergy.currentEvent = { id: "resume-first-draft", choices: [] };
    noEnergy.attributes.energy = 1;
    const energyEnding = advanceCareerRun(noEnergy, "ship");

    expect(timeEnding).toMatchObject({ status: "complete", stage: "closing" });
    expect(timeEnding.attributes.time).toBe(0);
    expect(energyEnding).toMatchObject({ status: "complete", stage: "burnout" });
    expect(energyEnding.attributes.energy).toBe(0);
  });

  it("applies one equipped Legacy to a new run", () => {
    const networkRun = createCareerRun({ seed: 22, legacyId: "senior-contact" });
    const boundaryRun = createCareerRun({ seed: 22, legacyId: "boundaries" });

    expect(networkRun.attributes.network).toBeGreaterThan(createCareerRun({ seed: 22 }).attributes.network);
    expect(boundaryRun.attributes.energy).toBeGreaterThan(createCareerRun({ seed: 22 }).attributes.energy);
    expect(networkRun.legacy.id).toBe("senior-contact");
  });

  it("keeps the complete twenty-one-item Legacy catalog within the approved strength bands", () => {
    expect(LEGACY_POOL).toHaveLength(21);
    expect(LEGACY_POOL.map((legacy) => legacy.title)).toEqual(expect.arrayContaining([
      "校友的联系方式",
      "教授的 Meeting 邀请",
      "超级舒服的枕头",
      "大容量充电宝",
      "七倍浓缩美式",
      "“我真的投过这家公司吗？”",
      "E人面具",
    ]));
    const routeWeights = LEGACY_POOL.flatMap((legacy) => Object.entries(legacy.modifiers || {})
      .filter(([key]) => key.endsWith("Weight"))
      .map(([, value]) => value));
    expect(routeWeights).toEqual([1.3, 1.3, 1.3, 1.3, 1.3]);
  });

  it("fires the low-Energy power bank only once and records the underlying resource pressure", () => {
    let state = createCareerRun({ seed: 91, legacyId: "power-bank" });
    state.attributes.energy = 22;
    state.currentEvent = { id: "resume-first-draft", choices: [] };

    state = advanceCareerRun(state, "ship");
    const firstEnergy = state.attributes.energy;
    expect(state.legacyUsage.powerBankUsed).toBe(true);
    expect(state.minimums.energy).toBeLessThanOrEqual(20);
    expect(firstEnergy).toBeGreaterThan(20);

    state.attributes.energy = 22;
    state.currentEvent = { id: "resume-first-draft", choices: [] };
    state.seenEventIds = state.seenEventIds.filter((id) => id !== "resume-first-draft");
    state = advanceCareerRun(state, "ship");
    expect(state.attributes.energy).toBeLessThan(firstEnergy);
  });

  it("applies one-shot Final Round and interview-format probability bonuses", () => {
    const play = (legacyId, eventId, choiceId) => {
      const state = createCareerRun({ seed: 100, legacyId });
      state.currentEvent = { id: eventId, choices: [] };
      state.counters.interviewLeads = 1;
      state.counters.offerLeads = 1;
      return advanceCareerRun(state, choiceId);
    };

    const finalBaseline = play(null, "final-round", "deep");
    const finalBoosted = play("comfortable-pillow", "final-round", "deep");
    const groupBaseline = play(null, "group-interview", "facilitate");
    const groupBoosted = play("extrovert-mask", "group-interview", "facilitate");

    expect(finalBoosted.lastOutcome.probability - finalBaseline.lastOutcome.probability).toBeCloseTo(0.04, 5);
    expect(finalBoosted.attributes.energy - finalBaseline.attributes.energy).toBe(4);
    expect(finalBoosted.legacyUsage.pillowUsed).toBe(true);
    expect(groupBoosted.lastOutcome.probability - groupBaseline.lastOutcome.probability).toBeCloseTo(0.07, 5);
  });

  it("gives Campus Celebrity a deterministic opportunity or its Network fallback", () => {
    const runs = [1, 1972].map((seed) => createCareerRun({
      seed,
      legacyId: "campus-celebrity",
    }));

    expect(runs.some((state) => state.counters.networkingOpportunities === 1)).toBe(true);
    runs.forEach((state) => {
      expect(state.counters.networkingOpportunities === 1 || state.attributes.network === 12).toBe(true);
    });
  });

  it("turns the first interview failure into one review bonus for the next interview", () => {
    let failedRun;
    for (let seed = 1; seed < 3000 && !failedRun; seed += 1) {
      const candidate = createCareerRun({ seed, legacyId: "interview-review" });
      candidate.currentEvent = { id: "behavioral-interview", choices: [] };
      candidate.counters.interviewLeads = 1;
      const next = advanceCareerRun(candidate, "stories");
      if (next.lastOutcome.succeeded === false) failedRun = next;
    }

    expect(failedRun).toBeTruthy();
    expect(failedRun.legacyUsage.interviewReviewUsed).toBe(true);
    expect(failedRun.legacyUsage.nextInterviewBonus).toBe(0.05);
    failedRun.currentEvent = { id: "technical-interview", choices: [] };
    failedRun.counters.interviewLeads = 1;
    const reviewed = advanceCareerRun(failedRun, "wing");
    expect(reviewed.legacyUsage.nextInterviewBonus).toBe(0);
  });

  it("caps the free Application Legacy at two extra Applications per run", () => {
    let state = createCareerRun({ seed: 1972, legacyId: "application-amnesia" });
    for (let index = 0; index < 80; index += 1) {
      state.status = "playing";
      state.turn = 1;
      state.attributes.time = 100;
      state.attributes.energy = 100;
      state.currentEvent = { id: "dream-job-deadline", choices: [] };
      state.seenEventIds = [];
      state = advanceCareerRun(state, "direct");
    }

    expect(state.legacyUsage.bonusApplications).toBe(2);
  });

  it("can unlock E人面具 through two Group Interview experiences", () => {
    let state = createCareerRun({ seed: 1500 });
    state.currentEvent = { id: "group-interview", choices: [] };
    state.counters.interviewLeads = 2;
    state = advanceCareerRun(state, "facilitate");
    state.currentEvent = { id: "group-interview", choices: [] };
    state.counters.interviewLeads = Math.max(1, state.counters.interviewLeads);
    state = advanceCareerRun(state, "lead");
    state.status = "complete";
    state.currentEvent = null;

    expect(state.counters.groupInterviews).toBe(2);
    expect(summarizeCareerRun(state).unlockedLegacyIds).toContain("extrovert-mask");
  });

  it("applies transparent pity support after repeated screening failures", () => {
    const baseline = createCareerRun({ seed: 99 });
    baseline.turn = 6;
    baseline.currentEvent = { id: "dream-job-deadline", choices: [] };
    const supported = structuredClone(baseline);
    supported.failureStreaks.application = 6;

    const first = advanceCareerRun(baseline, "direct");
    const second = advanceCareerRun(supported, "direct");

    expect(second.lastOutcome.probability - first.lastOutcome.probability).toBeCloseTo(0.18, 5);
  });

  it("gives the four core strategies different leverage without bypassing their pipeline stage", () => {
    const play = (eventId, choiceId, setup = () => {}) => {
      const state = createCareerRun({ seed: 4242 });
      state.currentEvent = { id: eventId, choices: [] };
      setup(state);
      return advanceCareerRun(state, choiceId);
    };

    const batch = play("batch-application-night", "batch");
    const tailored = play("batch-application-night", "shortlist");
    expect(batch.counters.applications).toBe(4);
    expect(tailored.counters.applications).toBe(2);
    expect(batch.attributes.energy).toBeLessThan(tailored.attributes.energy);
    expect(batch.lastOutcome.probability).toBeLessThan(tailored.lastOutcome.probability);

    const lowNetwork = play("alumni-reply", "ask-referral", (state) => { state.attributes.network = 10; });
    const developedNetwork = play("alumni-reply", "ask-referral", (state) => { state.attributes.network = 60; });
    expect(developedNetwork.lastOutcome.probability).toBeGreaterThan(lowNetwork.lastOutcome.probability);

    const weakProfile = play("dream-job-deadline", "direct", (state) => { state.attributes.profile = 15; });
    const developedProfile = play("dream-job-deadline", "direct", (state) => { state.attributes.profile = 70; });
    expect(developedProfile.lastOutcome.probability).toBeGreaterThan(weakProfile.lastOutcome.probability);

    const unprepared = play("technical-interview", "wing", (state) => {
      state.counters.interviewLeads = 1;
      state.strategyProgress = { interviewPreparation: 0 };
    });
    const practiced = play("technical-interview", "wing", (state) => {
      state.counters.interviewLeads = 1;
      state.strategyProgress = { interviewPreparation: 2 };
    });
    expect(practiced.lastOutcome.probability - unprepared.lastOutcome.probability).toBeCloseTo(0.06, 5);
    expect(practiced.counters.applications).toBe(unprepared.counters.applications);
  });

  it("resolves a developed alternative route without losing Personalized Path output", () => {
    const state = createCareerRun({ seed: 8 });
    state.status = "complete";
    state.currentEvent = null;
    state.flags.startupReady = true;
    state.routes.startup = 82;
    state.metrics.alternativePath = 55;

    const result = summarizeCareerRun(state);

    expect(result.ending.id).toBe("startup_founder");
    expect(result.path.profile).toMatchObject({
      profile_branches: expect.any(Array),
      search_branches: expect.any(Array),
    });
    expect(result.path.signals.some((signal) => signal.includes("项目"))).toBe(true);
  });

  it("grows the Content Creator story through four configured rare Events", () => {
    const creatorEvents = ["creator-essay", "creator-readers", "creator-commission", "creator-crossroads"]
      .map((id) => CAREER_EVENT_POOL.find((event) => event.id === id));

    expect(creatorEvents.every(Boolean)).toBe(true);
    expect(creatorEvents.every((event) => event.rarity === "rare")).toBe(true);
    expect(creatorEvents.map((event) => event.requirements?.minRoutes?.creator || 0)).toEqual([0, 1, 2, 3]);
  });

  it("keeps a hidden-route opener scarce while allowing an earned continuation after one ordinary Event", () => {
    let continuationSeen = false;
    let openerSeen = false;

    for (let seed = 1; seed <= 3000 && !continuationSeen; seed += 1) {
      const continuing = createCareerRun({ seed });
      continuing.turn = 8;
      continuing.stage = "application";
      continuing.routes.creator = 1;
      continuing.nextTags = ["creator"];
      continuing.history = [{ eventId: "creator-essay", rarity: "rare", category: "profile" }];
      continuing.seenEventIds = ["creator-essay"];
      continuing.currentEvent = { id: "mentor-review", choices: [] };
      const continued = advanceCareerRun(continuing, "specific");
      continuationSeen ||= continued.currentEvent?.id === "creator-readers";

      const opening = createCareerRun({ seed });
      opening.turn = 8;
      opening.stage = "application";
      opening.counters.rejections = 1;
      opening.history = [{ eventId: "late-recruiter-message", rarity: "rare", category: "application" }];
      opening.seenEventIds = ["late-recruiter-message"];
      opening.currentEvent = { id: "mentor-review", choices: [] };
      const next = advanceCareerRun(opening, "specific");
      openerSeen ||= next.currentEvent?.id === "creator-essay";
    }

    expect(continuationSeen).toBe(true);
    expect(openerSeen).toBe(false);
  });

  it("resolves Content Creator only after the player explicitly commits to the route", () => {
    const playCreatorChoice = (state, eventId, choiceId) => {
      const next = structuredClone(state);
      next.currentEvent = { id: eventId, choices: [] };
      return advanceCareerRun(next, choiceId);
    };
    let state = createCareerRun({ seed: 20260819 });
    state.turn = 8;
    state.stage = "application";
    state.counters.rejections = 2;
    state = playCreatorChoice(state, "creator-essay", "write-again");
    state = playCreatorChoice(state, "creator-readers", "broader-stories");
    state = playCreatorChoice(state, "creator-commission", "keep-voice");
    state = playCreatorChoice(state, "creator-crossroads", "try-creator-path");
    state.status = "complete";
    state.currentEvent = null;

    const result = summarizeCareerRun(state);

    expect(state.routes.creator).toBe(4);
    expect(result.ending.id).toBe("content_creator");
    expect(result.path.profile.profile_branches).toEqual(expect.arrayContaining(["portfolio", "personal_site"]));
  });

  it("configures the approved second-round rare Event set", () => {
    const rareEvents = CAREER_EVENT_POOL.filter((event) => event.rarity === "rare");
    expect(rareEvents).toHaveLength(18);
    expect(rareEvents.map((event) => event.title)).toEqual(expect.arrayContaining([
      "你的专业技能吸引到了来谈合作的人",
      "你在社交平台上发布的一篇求职随笔意外火了",
    ]));
    expect(rareEvents.map((event) => event.id)).not.toEqual(expect.arrayContaining([
      "late-recruiter-message",
      "family-question",
      "classmate-offer",
      "unexpected-interview-question",
      "process-cancelled",
      "blank-saturday",
    ]));
    expect(CAREER_EVENT_POOL.find((event) => event.id === "late-recruiter-message").choices).toHaveLength(2);
    expect(CAREER_EVENT_POOL.find((event) => event.id === "creator-crossroads").choices.map((choice) => choice.id))
      .toEqual(["try-creator-path", "keep-personal"]);
  });

  it("applies seeded incident effects before the player's response effects", () => {
    const play = (seed, eventId, choiceId, turn = 6) => {
      const state = createCareerRun({ seed });
      state.turn = turn;
      state.currentEvent = { id: eventId, choices: [] };
      return advanceCareerRun(state, choiceId);
    };

    const first = play(20260821, "instant-rejection", "inspect");
    const repeated = play(20260821, "instant-rejection", "inspect");

    expect(first.lastOutcome.deltas).toEqual(repeated.lastOutcome.deltas);
    expect(first.lastOutcome.deltas.time).toBeLessThan(0);
    expect(first.lastOutcome.deltas.confidence).toBeLessThan(-2);
    expect(first.lastOutcome.deltas.profile).toBe(4);
    expect(first.counters.rejections).toBe(1);
  });

  it("uses a later incident profile for repeated interview pressure", () => {
    const event = CAREER_EVENT_POOL.find((candidate) => candidate.id === "group-interruption");

    expect(event.lateFromTurn).toBe(11);
    expect(event.lateIncidentEffects.confidence.max)
      .toBeLessThan(event.incidentEffects.confidence.max);
    expect(event.lateIncidentEffects.energy.max)
      .toBeLessThan(event.incidentEffects.energy.max);
  });

  it("configures recurring ordinary recruiting events with finite caps", () => {
    const repeatableEvents = [
      "instant-rejection",
      "networking-silence",
      "group-interruption",
      "great-interview-rejection",
      "batch-application-night",
      "oa-invitation",
      "technical-interview",
      "behavioral-interview",
      "group-interview",
    ];

    repeatableEvents.forEach((eventId) => {
      const event = CAREER_EVENT_POOL.find((candidate) => candidate.id === eventId);
      expect(event?.rarity ?? "standard", eventId).toBe("standard");
      expect(event?.repeatable?.maxOccurrences, eventId).toBe(2);
    });
  });

  it("ends the run as Pause the Search when Confidence is depleted", () => {
    const state = createCareerRun({ seed: 1953 });
    state.attributes.confidence = 2;
    state.currentEvent = { id: "family-question", choices: [] };

    const completed = advanceCareerRun(state, "spiral");
    const result = summarizeCareerRun(completed);

    expect(completed.status).toBe("complete");
    expect(completed.attributes.time).toBeGreaterThan(0);
    expect(completed.attributes.energy).toBeGreaterThan(0);
    expect(result.ending.id).toBe("paused_search");
    expect(result.ending.title).toBe("暂时退出求职季");
  });

  it("closes the startup route after a failed unilateral push without deleting earned evidence", () => {
    const state = createCareerRun({ seed: 1500 });
    state.currentEvent = { id: "partner-disagreement", choices: [] };
    state.routes.startup = 40;
    state.attributes.confidence = 30;
    state.behavior.networking = 0;
    state.attributes.profile = 25;

    const next = advanceCareerRun(state, "push");

    expect(next.lastOutcome.probability).toBeCloseTo(0.6, 5);
    expect(next.lastOutcome.succeeded).toBe(false);
    expect(next.flags.startupClosed).toBe(true);
    expect(next.attributes.profile).toBeGreaterThanOrEqual(30);
    expect(next.currentEvent?.id).not.toMatch(/friend-project|first-user|incubator-invite|partner-disagreement/);
  });

  it("changes editorial and improvised-interview probabilities with current state", () => {
    const editorial = createCareerRun({ seed: 1500 });
    editorial.currentEvent = { id: "creator-commission", choices: [] };
    editorial.routes.creator = 2;
    editorial.attributes.confidence = 35;
    const lowConfidenceDraft = advanceCareerRun(editorial, "keep-voice");

    const improvised = createCareerRun({ seed: 1500 });
    improvised.currentEvent = { id: "unexpected-interview-question", choices: [] };
    improvised.counters.interviewLeads = 1;
    improvised.attributes.energy = 25;
    improvised.behavior.expression = 0;
    const pressuredAnswer = advanceCareerRun(improvised, "improvise");

    expect(lowConfidenceDraft.lastOutcome.probability).toBeCloseTo(0.6, 5);
    expect(pressuredAnswer.lastOutcome.probability).toBeCloseTo(0.55, 5);
    expect(lowConfidenceDraft.history.at(-1).outcome).toBe("failure");
    expect(pressuredAnswer.history.at(-1).outcome).toBe("failure");
  });

  it("resolves the final Creator Choice into the stronger hidden branch", () => {
    const resolveCreator = (careerCreator, writingCreator) => {
      const state = createCareerRun({ seed: 3 });
      state.currentEvent = { id: "creator-crossroads", choices: [] };
      state.routes.creator = 3;
      state.routes.careerCreator = careerCreator;
      state.routes.writingCreator = writingCreator;
      const next = advanceCareerRun(state, "try-creator-path");
      next.status = "complete";
      next.currentEvent = null;
      return summarizeCareerRun(next);
    };

    expect(resolveCreator(4, 1).ending.id).toBe("career_creator");
    expect(resolveCreator(1, 4).ending.id).toBe("content_creator");
  });

  it("replays the same Events and outcomes for the same seed and choices", () => {
    const play = () => finishRun(20260811, (choices) => choices[0]);

    const first = play();
    const second = play();

    expect(second.history).toEqual(first.history);
    expect(second.attributes).toEqual(first.attributes);
    expect(summarizeCareerRun(second)).toEqual(summarizeCareerRun(first));
  });

  it("spaces repeated fallback Events and allows repeated pipeline decisions", () => {
    const state = finishRun(88, (choices) => choices.at(-1));
    const eventIds = state.history.map((entry) => entry.eventId);

    eventIds.forEach((eventId, index) => {
      if (index === 0) return;
      const previousIndex = eventIds.lastIndexOf(eventId, index - 1);
      if (previousIndex >= 0 && !["final-round", "ordinary-offer"].includes(eventId)) {
        expect(index - previousIndex).toBeGreaterThan(5);
      }
    });
    Object.values(state.attributes).forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    });
  });

  it("rejects unknown and unavailable Choices without mutating the run", () => {
    const state = createCareerRun({ seed: 7 });
    const snapshot = structuredClone(state);

    expect(() => advanceCareerRun(state, "not-a-choice")).toThrow(/choice/i);
    expect(state).toEqual(snapshot);
  });

  it("rebuilds the current Event from config when restoring an older browser snapshot", () => {
    const saved = createCareerRun({ seed: 1953 });
    saved.currentEvent = {
      id: "market-crossroads",
      title: "stale title",
      choices: [{ id: "removed-choice", label: "stale choice" }],
    };

    const restored = restoreCareerRun(JSON.parse(JSON.stringify(saved)));

    expect(restored.currentEvent.title).toBe("求职季开始了。打开电脑，第一件事你打算做什么？");
    expect(restored.currentEvent.choices.some((choice) => choice.id === "research")).toBe(true);
    expect(() => advanceCareerRun(restored, "research")).not.toThrow();
  });

  it("configures a concrete consequence for every playable Choice", () => {
    CAREER_EVENT_POOL.forEach((event) => {
      event.choices.forEach((choice) => {
        if (choice.successModel || choice.probabilityRule) {
          expect(choice.success?.message, `${event.id}/${choice.id} success`).toBeTruthy();
          expect(choice.failure?.message, `${event.id}/${choice.id} failure`).toBeTruthy();
        } else if (choice.conditionalOutcomes) {
          expect(choice.conditionalOutcomes.every((item) => item.outcome?.message), `${event.id}/${choice.id} conditional outcomes`).toBe(true);
        } else {
          expect(choice.outcome?.message, `${event.id}/${choice.id} outcome`).toBeTruthy();
        }
      });
    });
  });

  it("resolves an Ending and hidden strategy signals without returning a personality result", () => {
    const state = finishRun(4096, (choices) => {
      return choices.find((choice) => choice.behaviorEffects?.analysis) ?? choices[0];
    });
    const result = summarizeCareerRun(state);

    expect(result.ending).toMatchObject({ id: expect.any(String), title: expect.any(String) });
    expect(result.persona).toBeUndefined();
    expect(result.stats).toEqual({
      applications: expect.any(Number),
      interviews: expect.any(Number),
      referrals: expect.any(Number),
      offers: expect.any(Number),
    });
    expect(result.path.signals.length).toBeGreaterThan(0);
    expect(result.path.profile).toMatchObject({
      stage: expect.any(String),
      jobti_type: expect.any(String),
      candidate_background: "student",
      profile_branches: expect.any(Array),
      search_branches: expect.any(Array),
      interview_branches: expect.any(Array),
    });
    expect(result.achievements.length).toBeGreaterThan(0);
    expect(result.legacyChoices).toHaveLength(3);
    expect(result.runStory).toEqual(expect.any(String));
  });

  it("explains distinct Still Searching journeys from the completed run evidence", () => {
    const summarizeVariant = (setup) => {
      const state = createCareerRun({ seed: 8080 });
      state.status = "complete";
      state.currentEvent = null;
      setup(state);
      return summarizeCareerRun(state).ending;
    };

    expect(summarizeVariant((state) => { state.counters.interviewLeads = 1; })).toMatchObject({
      id: "still_searching", variant: "active_pipeline",
    });
    expect(summarizeVariant((state) => { state.counters.applications = 10; })).toMatchObject({
      id: "still_searching", variant: "screening_gap",
    });
    expect(summarizeVariant((state) => { state.counters.interviews = 4; })).toMatchObject({
      id: "still_searching", variant: "interview_conversion",
    });
    expect(summarizeVariant((state) => {
      state.counters.applications = 2;
      state.maximums.profile = 75;
    })).toMatchObject({ id: "still_searching", variant: "prepared_not_exposed" });
    expect(summarizeVariant(() => {})).toMatchObject({
      id: "still_searching", variant: "continuing",
    });
  });

  it("lists every encountered Rare Event in encounter order", () => {
    const state = finishRun(20260820, (choices) => choices[0]);
    const firstRare = RARE_EVENT_POOL[0];
    const secondRare = RARE_EVENT_POOL[1];
    state.history.push(
      { eventId: firstRare.id, eventTitle: firstRare.title, rarity: "rare" },
      { eventId: secondRare.id, eventTitle: secondRare.title, rarity: "rare" },
    );

    const result = summarizeCareerRun(state);

    expect(result.runRecord.rareEvents).toEqual(
      state.history
        .filter((entry) => RARE_EVENT_POOL.some((event) => event.id === entry.eventId))
        .map((entry) => entry.eventTitle),
    );
    expect(result.runRecord.rareEvents.slice(-2)).toEqual([firstRare.title, secondRare.title]);
  });

  it("keeps Rare Events below their authored base weight", () => {
    expect(RARE_EVENT_WEIGHT_MULTIPLIER).toBeGreaterThan(0);
    expect(RARE_EVENT_WEIGHT_MULTIPLIER).toBeLessThan(1);
  });

  it("treats a successful Final Round as pending until the Offer is accepted", () => {
    const finalRound = CAREER_EVENT_POOL.find((event) => event.id === "final-round");
    const acceptedOffer = CAREER_EVENT_POOL.find((event) => event.id === "ordinary-offer")
      .choices.find((choice) => choice.id === "accept");

    finalRound.choices.forEach((choice) => {
      expect(choice.success.counters).toMatchObject({ pendingOffers: 1 });
      expect(choice.success.counters.offers).toBeUndefined();
    });
    expect(acceptedOffer.counters).toMatchObject({ offers: 1 });
  });

  it("derives the expanded Achievement set from recorded run facts", () => {
    const state = finishRun(271828, (choices) => choices[0]);
    state.counters.acceptedOffers = 1;
    state.counters.offers = 1;
    state.counters.rejections = 3;
    state.counters.referrals = 1;
    state.counters.waitlists = 2;
    state.minimums.energy = 35;
    state.maximums.profile = 75;
    state.maximums.network = 60;
    state.previousFailedRun = true;
    state.history.push({ eventId: "paid-freelance", choiceId: "take", outcome: "neutral" });

    const achievements = summarizeCareerRun(state).achievements;
    const ids = achievements.map((achievement) => achievement.id);

    expect(ids).toEqual(expect.arrayContaining([
      "side-income",
      "energy-manager",
      "network-transformation",
      "waiting-room-regular",
      "late-bloomer-growth",
      "comeback-win",
      "play-again",
    ]));
    expect(achievements).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "warm-connection", title: "人脉就是财富" }),
      expect.objectContaining({ id: "offer-accepted", title: "上岸" }),
    ]));
  });

  it("reserves Profile growth Achievements for a clearly developed Profile", () => {
    const achievementIdsAt = (maximumProfile) => {
      const state = createCareerRun({ seed: 70 });
      state.status = "complete";
      state.currentEvent = null;
      state.maximums.profile = maximumProfile;
      return summarizeCareerRun(state).achievements.map((achievement) => achievement.id);
    };

    expect(achievementIdsAt(69)).not.toContain("profile-builder");
    expect(achievementIdsAt(69)).not.toContain("late-bloomer-growth");
    expect(achievementIdsAt(70)).toEqual(expect.arrayContaining([
      "profile-builder",
      "late-bloomer-growth",
    ]));
  });

  it("awards a rejection-free Offer run with 一路绿灯", () => {
    const state = finishRun(161803, (choices) => choices[0]);
    state.counters.acceptedOffers = 1;
    state.counters.offers = 1;
    state.counters.rejections = 0;

    expect(summarizeCareerRun(state).achievements).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "green-light", title: "一路绿灯" }),
    ]));
  });

  it("only awards growth Achievements when the run starts from a low baseline", () => {
    const state = finishRun(141421, (choices) => choices[0]);
    state.startingAttributes = { ...state.startingAttributes, profile: 60, network: 60 };
    state.maximums.profile = 70;
    state.maximums.network = 70;

    const ids = summarizeCareerRun(state).achievements.map((achievement) => achievement.id);

    expect(ids).not.toContain("network-transformation");
    expect(ids).not.toContain("late-bloomer-growth");
  });

  it("uses behavioral trajectory, rather than Offer count alone, for Persona scoring", () => {
    const actionRun = finishRun(314159, (choices) => {
      return choices.toSorted((a, b) =>
        (b.behaviorEffects?.action ?? 0) - (a.behaviorEffects?.action ?? 0)
      )[0];
    });
    const reflectiveRun = finishRun(314159, (choices) => {
      return choices.toSorted((a, b) =>
        ((b.behaviorEffects?.reflection ?? 0) + (b.behaviorEffects?.pacing ?? 0)) -
        ((a.behaviorEffects?.reflection ?? 0) + (a.behaviorEffects?.pacing ?? 0))
      )[0];
    });

    const actionResult = summarizeCareerRun(actionRun);
    const reflectiveResult = summarizeCareerRun(reflectiveRun);

    expect(actionResult.path.profile.jobti_type).not.toBe(reflectiveResult.path.profile.jobti_type);
  });

  it("keeps seeded runs varied without making resource exhaustion the default ending", () => {
    const endings = {};
    let timeExhausted = 0;
    let energyExhausted = 0;
    let confidencePressure = 0;
    for (let seed = 1; seed <= 200; seed += 1) {
      const state = finishRun(seed, (choices, run) => choices[(seed + run.turn) % choices.length]);
      const ending = summarizeCareerRun(state).ending.id;
      endings[ending] = (endings[ending] || 0) + 1;
      if (state.attributes.time === 0) timeExhausted += 1;
      if (state.attributes.energy === 0) energyExhausted += 1;
      if (state.minimums.confidence <= 30) confidencePressure += 1;
    }

    expect(Object.keys(endings).length).toBeGreaterThanOrEqual(5);
    expect(endings.burnout || 0).toBeLessThan(60);
    expect(timeExhausted).toBeGreaterThan(5);
    expect(energyExhausted).toBeGreaterThanOrEqual(5);
    expect(confidencePressure).toBeGreaterThan(12);
  });
});
