export type Topic = {
  slug: string;
  title: string;
  prerequisites: string[];
  learning_objectives: string[];
  core_explanation: string;
  worked_examples: string[];
  common_pitfalls: string[];
  practice_tasks: string[];
  tags: string[];
  difficulty: number;
  estimated_time_minutes: number;
};

export type VerifierIssue = {
  severity: "blocker" | "major" | "minor";
  location: string;
  message: string;
  suggested_fix: string;
  confidence: number;
};

export type VerifierReport = {
  issues: VerifierIssue[];
  summary: {
    blocker: number;
    major: number;
    minor: number;
  };
};

export type PedagogyIssue = Omit<VerifierIssue, "severity"> & {
  severity: "major" | "minor";
};

export type PedagogyReport = {
  alignment_score: number;
  issues: PedagogyIssue[];
  summary: {
    major: number;
    minor: number;
  };
};

export type AgentModels = {
  writer_model: string;
  verifier_model: string;
  pedagogy_model: string;
  editor_model: string;
};

export type TopicOutline = {
  slug: string;
  title: string;
  prerequisites?: string[];
  learning_objectives?: string[];
  tags?: string[];
  difficulty?: number;
  estimated_time_minutes?: number;
  notes?: string;
};
