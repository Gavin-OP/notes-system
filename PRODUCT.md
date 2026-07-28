# Product Context

## Product Name

Notes System

## One-Line Description

Notes System helps motivated learners enter a new discipline through a structured knowledge framework, guided learning paths, readable notes, concept graphs, and AI-assisted content generation.

## Product Thesis

Online resources and AI tools make isolated explanations easier to find, but they do not automatically give learners the structured exposure that a major, curriculum, or disciplinary training path provides.

Notes System exists to lower the barrier to disciplinary education in the AI era. It helps learners see the shape of a field, understand prerequisite relationships, move through topics in a reasonable order, and connect learning with future study or career direction.

The product should not feel like a generic note-taking app. It should feel like a simple, beautiful learning system for entering an unfamiliar field.

## Target Users

### Cross-Disciplinary Students

Students who want to learn a discipline outside their major.

Example: an accounting major trying to learn data science. They may take online courses or read tutorials, but they do not receive the same systematic exposure that a data science major gets through a curriculum.

Their needs:

- Understand the structure of a new field before going deep.
- Know which concepts are foundational, which are advanced, and which can wait.
- Learn through a coherent path rather than disconnected topics.
- Connect new knowledge to their original major and career goals.
- Avoid feeling lost in too many online resources.

### Working Professionals and Non-Specialists

Professionals who want to explore a new field for career development, entrepreneurship, research, or decision-making.

Example: someone working in biology who wants to start a business and needs foundational accounting knowledge.

Their needs:

- Get a practical foundation without enrolling in a full degree.
- Learn enough structure to ask better questions and make better decisions.
- Connect learning to real work, role transitions, or business goals.
- Move efficiently through concepts because time is limited.
- Trust that the learning path is systematic, not random.

## Core User Problem

After leaving school, structured disciplinary education becomes hard to access.

Learners can find courses, videos, papers, tutorials, AI answers, and community posts, but they often struggle with:

- Where to start.
- What order to learn topics in.
- Which concepts matter most.
- How topics connect to one another.
- What level of depth is enough for their goal.
- How the field relates to career paths or real-world use cases.

The product should solve the structure problem, not merely the content problem.

## Product Promise

Notes System gives learners a clear map into a new field:

- A subject outline that reveals the field's structure.
- Notes that explain each topic in approachable language.
- Concept graphs that show relationships and prerequisites.
- Learning paths that help users decide what to learn next.
- Progress tracking that makes the journey visible.
- AI-assisted generation and maintenance workflows that make structured education easier to produce and update.

## Product Differentiation

### 1. Cross-Disciplinary by Default

The product is designed for learners entering a field from the outside. Content should assume intelligence and motivation, but not prior disciplinary context.

### 2. Structure Before Content

The system starts from subject outlines, prerequisites, concept libraries, and graphs. Notes are part of a larger map, not standalone pages.

### 3. Learning Meets Goals

The product should help learners understand why a topic matters and how it supports a chosen career, project, or personal interest. Career remains a specialized goal flow rather than the default purpose of learning.

### 4. AI Lowers the Education Barrier

AI is used to generate outlines, draft notes, verify content, improve pedagogy, maintain content, and create narration. AI should support systematic learning rather than replace the need for structure.

### 5. Simple and Beautiful

The interface should feel calm, trustworthy, and easy to understand. The product should reduce cognitive load instead of becoming another complex learning platform.

## Current Product Signals From the Repositories

The frontend repository currently provides:

- React and Vite based markdown note reading.
- Subject/folder navigation generated from note metadata.
- Markdown rendering with code blocks, math, tables, images, Mermaid diagrams, and heading anchors.
- A collapsible left navigation menu.
- A right-side outline panel for note structure.
- Mobile behavior for menu and outline access.
- Theme and language controls.

The backend repository currently provides:

- A four-layer AI workflow:
  - Layer 1: subject outline generation.
  - Layer 2: authoring with subject-specific RAG, writer, concept agent, verifier, and pedagogy agent.
  - Layer 3: maintenance through structured incremental edits.
  - Layer 4: narration script and audio generation.
- Subject-only RAG retrieval and global style/rules retrieval.
- Concept prior and concept ownership tooling.
- Subject graph generation for mind maps, hierarchical views, radial views, network graphs, and learning paths.
- Tracking events for learning sessions, note views, concept clicks, review mode, and quizzes.
- Progress snapshots for notes, subjects, and concepts.
- Admin APIs for content and system overview.
- TTS APIs for narration audio.

These signals imply the product should evolve from a markdown note viewer into a structured disciplinary learning platform.

## Primary Product Surfaces

### Home

Purpose: explain the product clearly and route learners into the two canonical databases without exposing advanced personal tools too early.

Expected elements:

- Concise product explanation.
- Subject Database and Career Database entry points.
- Search across subjects and notes.
- Disclaimer and contact information.
- One clear starting action for new users.

Personal progress, Goal Discovery, Course Studio, and Course Community belong after sign-in or inside Profile rather than competing on the homepage.

### Subject Page

Purpose: show the structure of a discipline.

Expected elements:

- Subject overview.
- Learning path.
- Topic sequence.
- Prerequisites and difficulty.
- Estimated learning time.
- Concept graph entry point.
- Progress across the subject.
- Available Course packages after the canonical field overview.

The learner-facing hierarchy is `Subject → Course → Module → Note`. A Subject is the stable knowledge identity; a Course is an official or community-authored teaching perspective; a Note is one learning unit inside that Course.

### Note Page

Purpose: teach one topic clearly.

Expected elements:

- Readable markdown content.
- Topic title and learning objectives.
- Left navigation across the subject.
- Right outline within the note.
- Concept links.
- Prerequisite and next-topic hints.
- Progress state.
- Audio or narration entry when available.

### Graph Page

Purpose: reveal how the field is connected.

Expected elements:

- Subject graph view.
- Learning path view.
- Concept network view.
- Clickable nodes that open notes or concepts.
- Visual distinction between foundational, core, and advanced concepts.

### Review and Progress

Purpose: help learners continue intentionally.

Expected elements:

- Started, completed, and recommended notes.
- Concept mastery or review counts.
- Recently viewed items.
- Suggestions based on prerequisites and user progress.
- Multiple saved Learning Sets, each pairing one Goal with a complete Course package, Learning Path, resources, and progress.

### Admin and Content Operations

Purpose: support content generation, review, maintenance, and publishing.

Expected elements:

- Subject status.
- Generated outline review.
- Note authoring status.
- RAG and source status.
- Graph generation status.
- System health.
- Human review checkpoints.

## Core Jobs To Be Done

1. When I enter a new field, I want to see its structure so I can stop guessing where to start.
2. When I read a topic, I want to know what it depends on and what it unlocks.
3. When I have limited time, I want a guided path that tells me what matters first.
4. When I encounter unfamiliar concepts, I want definitions and relationships without losing my place.
5. When I learn for a career, project, or personal interest, I want the path and course recommendations to reflect that outcome.
6. When I return later, I want to continue from where I left off.
7. When content is AI-generated, I want confidence that it was structured, checked, and reviewed.

## MVP Scope

### Must Have

- Subject catalog.
- Subject overview with learning path.
- Markdown note reader.
- Sidebar subject navigation.
- In-note outline.
- Search across notes and concepts.
- Subject graph or learning map.
- Progress tracking for notes and subjects.
- Clear next-step recommendation.
- Responsive desktop and mobile layouts.

### Should Have

- Concept detail panels.
- Prerequisite badges.
- Estimated learning time.
- Audio narration.
- Bookmark or save for later.
- Review mode.
- Lightweight quizzes or self-check prompts.
- Admin overview for content status.

### Could Have

- Career path mapping.
- User goal onboarding.
- Personalized paths by background.
- AI tutor chat grounded in the current subject.
- Import external learning resources.
- Community-curated subject maps.

### Not For Now

- Full social network features.
- Heavy gamification.
- Complex course marketplace mechanics.
- A general-purpose document editor.
- A personal notes database as the main product identity.

## Product Principles

### 1. Show the Map First

The learner should quickly understand the subject's structure, not just land on a pile of notes.

### 2. Teach From the Outside In

Assume the learner is smart but new to the discipline. Avoid unexplained insider context.

### 3. Make Prerequisites Visible

Every major topic should make its dependencies and next steps easy to see.

### 4. Keep AI Grounded

AI output should be tied to outlines, sources, RAG evidence, verifier steps, and human review.

### 5. Reduce Choice Overload

The product should recommend a path without hiding the larger map.

### 6. Make Progress Feel Real

Progress should reflect meaningful learning behavior: reading, review, concept interaction, quizzes, and completed notes.

### 7. Be Simple Enough To Trust

The interface should feel calm and direct. Learners should feel oriented, not entertained.

## Success Metrics

### Activation

- Percentage of users who choose a subject.
- Percentage of users who start the recommended first note.
- Time from landing to first meaningful learning action.

### Learning Engagement

- Notes started per subject.
- Notes completed per subject.
- Return rate after first session.
- Average session duration.
- Concept graph interactions.
- Search-to-note success rate.

### Learning Progress

- Subject completion percentage.
- Concept review counts.
- Quiz completion and performance.
- Prerequisite path completion.

### Content Quality

- Human review pass rate.
- Verification issues per generated note.
- Maintenance edits applied.
- Broken links or graph contract failures.
- RAG source coverage per subject.

## Product Voice

The product voice should be:

- Clear.
- Calm.
- Encouraging.
- Precise.
- Respectful of the learner's intelligence.

Avoid:

- Overly cute motivation.
- Marketing-heavy copy.
- Academic gatekeeping language.
- AI hype.
- Vague promises such as "master anything instantly."

Preferred copy style:

- "Start with the foundations."
- "This topic unlocks..."
- "Recommended next."
- "You may want this before..."
- "Estimated time."
- "Core concept."
- "Career relevance."

## Positioning Statement

For students and professionals entering a field from the outside, Notes System is a structured learning platform that turns a discipline into a navigable map of topics, concepts, notes, and learning paths. Unlike generic note apps, video playlists, or one-off AI answers, Notes System helps learners understand the shape of a field and move through it systematically.

## Current Discovery Model

- The homepage has one catalog entry: **Explore Our Database**.
- The database has three views: Subject Database, Career Database, and Course Package Database.
- Goal Discovery currently supports Career and Interest. Project is intentionally deferred.
- Interest selection uses the same visual hierarchy as Career and proceeds from **My Interest** to **Recommended Course Package**.
- A recommended package card shows only its title, Domain, Learning Archetype, and source identity.
- Every package has a dedicated page limited to Domain, Learning Archetypes, source, author, included courses, and recommended learning path.
- Deleting a goal is permanent after explicit confirmation; goals are not archived.
