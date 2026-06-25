export function resolveQuizQuestions(payload) {
  const candidate =
    payload?.questions ||
    payload?.quiz ||
    payload?.items ||
    payload?.data?.questions ||
    payload?.data?.items ||
    [];

  if (!Array.isArray(candidate)) return [];
  return candidate.map((item, idx) => {
    if (typeof item === "string") {
      return {
        id: `quiz-${idx + 1}`,
        type: "short_answer",
        text: item,
        options: [],
        rawQuestion: item,
      };
    }
    const type = item?.question_type || item?.type || "short_answer";
    return {
      id: item?.id || `quiz-${idx + 1}`,
      type,
      text: item?.text || item?.question || item?.prompt || "",
      options: Array.isArray(item?.options) ? item.options : [],
      rawQuestion: item,
    };
  });
}

export function normalizeQuizEvaluation(payload) {
  const source = payload?.data && typeof payload.data === "object" ? payload.data : payload;
  return {
    is_correct: Boolean(source?.is_correct),
    score: typeof source?.score === "number" ? source.score : source?.score ?? null,
    feedback: source?.feedback || "",
    suggested_answer: source?.suggested_answer || "",
  };
}
