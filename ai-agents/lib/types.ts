export type Topic = {
  slug: string;
  title: string;
  prerequisites: string[];
  learning_objectives: string[];
  introduction_markdown: string;
  concept_sections: Array<{
    heading: string;
    content_markdown: string;
  }>;
  conclusion_markdown?: string;
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
  narration_writer_model: string;
  narration_verifier_model: string;
  narration_pedagogy_model: string;
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
