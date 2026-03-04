# AI Agents Pipeline (Phase 1)

This folder contains a modular 3-agent GenAI pipeline that generates markdown-first course notes and lightweight metadata artifacts.

## What it does

For each topic in `ai-agents/inputs/<course>/outline.json`, the pipeline runs:
1. Writer -> creates `v1_draft.md`
2. Verifier -> revises draft into `v1_verifier.md`
3. Pedagogy Reviewer -> revises verifier output into `v1_final.md`

Artifacts are written to:
- `ai-agents/outputs/<course>/<topic_slug>/`

Public notes output is markdown only:
- `public/notes/<course>/<Topic Title>.md`

Generated files include:
- `v1_draft.md`
- `v1_verifier.md`
- `v1_final.md`
- `metadata.json`
- `image_spec.json`
- `mindmap_node.json`
- `audit.json`
- and one final markdown file in `public/notes/<course>/<Topic Title>.md`

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
npm run ai-agents:topic -- --course Python --topic introduction-to-base-python-part-1
```

## Run full batch for a course

```bash
npm run ai-agents:batch -- --course Python
```

## Regenerate notes index and mindmap graphs

After notes are generated/renamed, rebuild index and all subject graphs (Python, Data Science, etc.):

```bash
npm run generate:all
```

Or run individually:

```bash
npm run generate:notes
npm run generate:graph              # discovers and generates all subjects
npm run generate:graph -- python   # generate only Python
npm run generate:graph -- data-science
```
