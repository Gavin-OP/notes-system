# AI Agents Pipeline (Phase 1)

This folder contains a modular 4-agent GenAI pipeline that generates structured topic artifacts for the Notes System frontend.

## What it does

For each topic in `ai-agents/inputs/<course>/outline.json`, the pipeline runs:
1. Writer -> creates `v1_draft.json`
2. Verifier -> creates `v{i}_verifier.json`
3. Pedagogy Reviewer -> creates `v{i}_pedagogy.json`
4. Editor -> creates `v{i}_final.json`

It iterates up to 3 rounds (configurable with `--max-iters`) and stops early when:
- `tech_blockers == 0`
- `tech_major <= 1`
- `pedagogy_major <= 1`
- `alignment_score >= 0.85`

Artifacts are written to:
- `ai-agents/outputs/<course>/<topic_slug>/`

Public notes output is markdown only:
- `public/notes/<course>/<topic_slug>.md`

Generated files include:
- `v1_draft.json`
- `v{i}_verifier.json`
- `v{i}_pedagogy.json`
- `v{i}_final.json`
- `quiz.json` (extracted from latest final)
- `image_spec.json`
- `mindmap_node.json`
- `audit.json`
- and one final markdown file in `public/notes/<course>/<topic_slug>.md`

## Setup

Create `.env.local` in repo root:

```bash
OPENAI_API_KEY=
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=
```

Current MVP provider is Gemini. Model mapping is configured in:
- `ai-agents/config/models.json`

## Run one topic

```bash
npm run ai-agents:topic -- --course python --topic python-variables
```

## Run full batch for a course

```bash
npm run ai-agents:batch -- --course python
```
