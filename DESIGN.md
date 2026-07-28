# Design Direction

## Design Goal

Notes System should feel like the simplest possible interface for entering a new field.

The design should combine the clarity and restraint associated with Apple-style product surfaces with the utility and system thinking associated with Google-style knowledge products. The result should be simple, beautiful, readable, and highly usable for long learning sessions.

The product should not look like a generic dashboard, marketing landing page, or decorative note app. It should feel like a calm study environment with a clear map.

## Design Principles

### 1. As Simple As Possible

Every screen should make the next learning action obvious.

Prefer:

- Fewer controls.
- Clear hierarchy.
- Obvious navigation.
- One primary action per view.
- Progressive disclosure for advanced information.

Avoid:

- Dense toolbars.
- Decorative panels that do not help learning.
- Multiple competing calls to action.
- Large hero sections inside the product experience.
- Nested cards.

### 2. Structure Is the Visual Language

The core product value is structure. The interface should make subject structure visible through layout, hierarchy, paths, graphs, outlines, prerequisites, and progress.

Use visual design to answer:

- Where am I in the field?
- What should I learn next?
- What does this topic depend on?
- What concepts does this note contain?
- How much progress have I made?

### 3. Calm Reading Comes First

Notes are long-form learning surfaces. Reading comfort matters more than visual novelty.

Prioritize:

- Comfortable line length.
- Strong typography.
- Quiet spacing.
- High contrast.
- Stable layout while scrolling.
- Clear headings and anchors.
- Good code, table, math, image, and diagram rendering.

### 4. Beauty Through Precision

The design should feel beautiful because spacing, type, color, and interaction are precise, not because the interface is decorative.

Prefer:

- Subtle borders.
- Soft backgrounds.
- Clean iconography.
- Consistent spacing.
- Clear alignment.
- Restrained accent color.

Avoid:

- Large gradients.
- Glassmorphism.
- Heavy shadows.
- Decorative blobs.
- Busy illustrations.
- Excessive color coding.

### 5. AI Should Feel Invisible Until Useful

AI is an enabling layer, not the main visual identity.

Show AI when it helps:

- Explain why a path is recommended.
- Summarize a concept.
- Generate a review prompt.
- Narrate a note.
- Suggest next learning steps.

Do not make the whole interface feel like a chatbot.

## Design Personality

The interface should feel:

- Minimal.
- Serious.
- Helpful.
- Warm.
- Trustworthy.
- Academic without being institutional.
- Modern without being trendy.

It should not feel:

- Childish.
- Gamified by default.
- Corporate training software.
- A raw developer documentation site.
- A social media feed.
- A generic admin dashboard.

## Visual References

### Apple-Inspired Qualities

Use:

- Spacious composition.
- Simple navigation.
- Calm surfaces.
- Strong typography.
- High visual polish.
- Direct, human copy.

Do not copy:

- Marketing hero layouts inside the app.
- Oversized product-page typography for functional panels.
- Decorative device mockups.

### Google-Inspired Qualities

Use:

- Clear information architecture.
- Search as a first-class behavior.
- Knowledge graph and concept relationship patterns.
- Familiar material-like interaction states.
- Useful empty states.

Do not copy:

- Overly colorful surfaces.
- Busy product-suite density.
- Generic card-heavy layouts.

## Information Architecture

### Recommended Top-Level Navigation

- Home.
- Subject Database.
- Career Database.
- Search.
- Profile.

Admin and content operations should be separate from the learner-facing app.
Goal Discovery and Course Studio are Profile-owned tools. Course Community is a later-stage discovery surface and should not be promoted as a first-session destination.

### Learner-Facing Hierarchy

1. Subject.
2. Module or category.
3. Topic or note.
4. Concept.
5. Resource or example.

The UI should consistently show where the learner is in this hierarchy.

## Core Layouts

### Home

Purpose: explain the product and help a first-time learner enter the canonical Subject or Career Database.

Layout:

- Compact product explanation.
- Top search bar.
- Subject Database entry.
- Career Database entry.
- Disclaimer and contact links.

Design notes:

- Keep the explanation direct and functional rather than campaign-like.
- Do not expose Goal Discovery, Course Studio, Course Community, or Podcast generation as homepage-level actions.
- Returning-user continuation may be a secondary shortcut, but must not turn Home into another Profile dashboard.

### Subject Page

Purpose: understand the discipline before reading individual notes.

Layout:

- Subject title and concise description.
- Primary action: Start learning or Continue.
- Learning path timeline.
- Topic groups by module.
- Graph preview.
- Key concepts.
- Available courses with Official or Community course source identity.
- Estimated total time and difficulty distribution.

Design notes:

- This should feel like a curriculum map.
- Lead with the canonical field overview, then ask the learner to choose a complete Course package.
- Do not bury prerequisites in small metadata.
- Use difficulty and estimated time sparingly, as orientation signals.

### Note Page

Purpose: read and learn one topic.

Recommended desktop layout:

- Left: subject navigation, 280 to 320 px.
- Center: note content, max readable width around 760 to 860 px.
- Right: in-note outline, concepts, and next steps, 280 to 320 px.

Recommended mobile layout:

- Single reading column.
- Top bar with subject switcher and search.
- Drawer for subject navigation.
- Floating or bottom action for outline.
- Next step section after the note.

Design notes:

- The reading column should remain visually quiet.
- Avoid making the note content look trapped inside a decorative card.
- The outline should support orientation without competing with content.

### Graph Page

Purpose: visualize the field.

Layout:

- Full-width graph canvas or structured map.
- Simple view switcher: Path, Map, Network.
- Side panel for selected node details.
- Search and filter.

Design notes:

- The graph should be useful, not ornamental.
- Use color to identify categories or status, not decoration.
- Selected nodes need clear note links and prerequisites.

### Progress Page

Purpose: help learners continue.

Layout:

- Current subject progress.
- Recently viewed notes.
- Recommended next notes.
- Concepts to review.
- Completed topics.

Design notes:

- Keep the page motivational but not game-like.
- Progress should be calm and factual.

## Component Guidelines

### Navigation

- Use a persistent sidebar on desktop when reading.
- Collapse navigation on mobile.
- Use icons only when they are familiar and clarify scanning.
- Highlight the current note and current subject clearly.

### Search

Search should be visible and dependable.

Search should support:

- Notes.
- Subjects.
- Concepts.
- Tags.

Search results should show:

- Title.
- Subject.
- Short excerpt.
- Result type.
- Matching concept or heading when available.

### Learning Path

Use a simple vertical or horizontal path depending on viewport.

Each topic item may show:

- Title.
- Difficulty.
- Estimated time.
- Completion state.
- Prerequisites.
- Key concepts.

Avoid turning the path into a playful game board.

### Note Content

Use markdown rendering as a first-class design surface.

Must support:

- Headings.
- Code blocks.
- Inline code.
- Math.
- Tables.
- Mermaid diagrams.
- Images.
- Blockquotes.
- Task lists.
- Heading copy links.

Content styling should be consistent across light and dark themes.

### Concept Tags

Concepts should feel more important than generic tags.

Use:

- Compact chips.
- Clear selected states.
- Hover or click detail panels.
- Links to graph nodes or concept pages.

Avoid:

- Large colorful pills everywhere.
- Too many competing tag colors.

### Progress Indicators

Use understated progress indicators:

- Thin progress bars.
- Checkmarks.
- Completion text.
- Last viewed timestamp.

Avoid:

- Badges as the main motivation mechanism.
- Loud celebratory UI.

### Empty States

Empty states should guide action.

Examples:

- No subject selected: "Choose a field to start building your map."
- No search results: "No results. Try a concept, topic, or subject name."
- No progress yet: "Start one note to begin your learning path."

Keep copy short.

## Typography

Recommended direction:

- Use a clean sans-serif for UI.
- Use a highly readable text style for notes.
- Keep note body between 16 and 18 px.
- Keep UI labels between 12 and 14 px.
- Use clear heading scale, but avoid oversized headings inside app panels.

Rules:

- Do not scale font size with viewport width.
- Do not use negative letter spacing.
- Keep long titles from breaking layouts.
- Allow multilingual content, including English and Chinese.

## Color

Recommended palette direction:

- Neutral background.
- Strong readable text.
- One primary accent.
- Limited semantic colors.
- Subtle borders.

Example roles:

- Background: app canvas.
- Surface: sidebar and panels.
- Text primary.
- Text secondary.
- Border.
- Accent.
- Success.
- Warning.
- Error.
- Graph category colors.

Rules:

- Avoid a one-note palette.
- Avoid dominant purple-blue gradients.
- Avoid beige or brown academic nostalgia.
- Avoid using graph category colors as general UI decoration.
- Ensure contrast is accessible in light and dark modes.

## Spacing and Shape

Use an 8 px spacing system.

Recommended:

- 4 px for tiny internal gaps.
- 8 px for compact component spacing.
- 16 px for normal section spacing.
- 24 px for larger layout spacing.
- 32 px for major view separation.

Border radius:

- 6 to 8 px for buttons, inputs, and cards.
- Avoid overly rounded pills unless the component is truly a chip.

Cards:

- Use cards for repeated subject/topic items or modal-like surfaces.
- Do not put cards inside cards.
- Do not turn every section into a floating card.

## Interaction States

Every interactive element should have:

- Default.
- Hover.
- Focus.
- Active.
- Disabled.
- Loading.

Learning-specific states:

- Not started.
- In progress.
- Completed.
- Recommended.
- Locked by prerequisite, if applicable.
- Error loading content.
- Offline or unavailable.

## Accessibility

Minimum requirements:

- Keyboard navigable navigation, search, graph selection, and note outline.
- Visible focus states.
- Sufficient contrast in light and dark themes.
- Meaningful labels for icon buttons.
- Responsive layout down to 360 px wide.
- No text overlap with controls.
- No horizontal scrolling except inside code, tables, math, or graph canvases.

## Responsive Behavior

Desktop:

- Three-panel learning layout is acceptable.
- Sidebar and outline can be persistent.
- Graph can be full canvas with detail panel.

Tablet:

- Keep content readable.
- Collapse one secondary panel.
- Use drawers for outline or navigation.

Mobile:

- One primary column.
- Navigation and outline become drawers.
- Search remains accessible.
- Primary next action appears near top and after content.

## Design System Tokens

Create tokens for:

- Color roles.
- Typography scale.
- Spacing.
- Border radius.
- Shadows.
- Z-index.
- Motion duration.
- Graph category colors.
- Progress states.

Do not hard-code feature colors in individual components when a token should exist.

## Motion

Motion should be functional and quiet.

Use motion for:

- Drawer open and close.
- Outline reveal.
- Selected graph node transition.
- Progress update.

Avoid:

- Decorative motion.
- Large page animations.
- Constantly moving graph elements while reading.

## Copy Guidelines

Use short, direct labels.

Preferred:

- Start learning.
- Continue.
- Recommended next.
- Prerequisites.
- Core concepts.
- Learning path.
- View map.
- Review.
- Listen.

Avoid:

- "Unlock your potential."
- "Master this instantly."
- "AI-powered revolution."
- "Dive into a world of knowledge."

## Frontend Improvement Priorities

Based on the current frontend repository, prioritize:

1. Replace the temporary home page with a learner-centered subject home.
2. Make search visible and functional rather than hover-only.
3. Clarify the product identity in the note layout.
4. Add subject overview and learning path surfaces.
5. Add graph entry points from subject and note pages.
6. Improve note metadata display: difficulty, estimated time, prerequisites, concepts.
7. Strengthen mobile reading and navigation.
8. Unify markdown, sidebar, outline, and theme styling under shared tokens.

## Backend-Driven UI Opportunities

Use backend capabilities to power:

- Subject maps from generated graph JSON.
- Learning paths from outlines and prerequisites.
- Progress pages from user progress snapshots.
- Note completion from tracking events.
- Concept interactions from graph and note clicks.
- Narration from Layer 4 and TTS output.
- Admin status from content and system APIs.

## Quality Checklist Before Shipping UI

Check each major screen with:

- A new learner with no progress.
- A returning learner with partial progress.
- A subject with many topics.
- A note with long headings.
- A note with code, math, table, image, and Mermaid diagram.
- A graph with many concepts.
- Mobile width under 390 px.
- Dark theme.
- Chinese and English labels.
- Loading and error states.
- No search results.

## North Star

The user should always feel:

"I understand where I am, why this matters, and what to learn next."

## Database and Goal Discovery IA

- Use one homepage action, **Explore Our Database**, for all public catalogs.
- Preserve deep links while redirecting the legacy `/subjects` route to `/database?view=subjects`.
- Keep Subject, Career, and Course Package as sibling database tabs.
- Keep recommended course-package cards compact; details belong on the package page.
- Interest follows the same section rhythm as Career: personal direction first, recommendation second.
- Destructive goal actions say **Delete**, explain that deletion cannot be undone, and use a danger confirmation.
- Audio and Note Version use the same compact dropdown-trigger treatment in the note workspace.


## Brand Color Direction

Use a calm but richer academic palette grounded in knowledge, clarity, trust, and interdisciplinary learning. The interface should feel more expressive than a default Ant Design prototype, but still restrained and production-ready.

### Core Palette

- Primary Blue: #4F8CC9
- Deep Blue: #2F5F8F
- Wisdom Gold: #F4D06F
- Sage Green: #7BAE7F
- Academic Teal: #4FA3A5
- Clay Coral: #D9826B
- Soft Lavender: #9B8ACB
- Ink: #1F2933
- Slate: #52616B
- Mist: #EEF4FA
- Paper: #F8FAFC
- Surface: #FFFFFF
- Line: #D9E2EC

Use Primary Blue for main actions, links, current selection, focus states, and active navigation. Use Deep Blue for text on primary-blue tinted surfaces or high-emphasis academic labels. Use Wisdom Gold sparingly for highlights, achievement, important knowledge markers, and medium-strength match states.

Do not use purple as the default accent. Soft Lavender may be used only as a controlled semantic color for communication, strategy, humanities, or reflection-related knowledge areas.

### Semantic Color Roles

Career level:

- Beginner: Sage Green
- Intermediate: Wisdom Gold
- Advanced: Clay Coral

Knowledge areas:

- Data / Technical: Primary Blue
- Business / Career: Wisdom Gold
- Research / Science: Academic Teal
- Communication / Strategy: Soft Lavender
- Tools / Practice: Sage Green
- Risk / Challenge / Gap: Clay Coral

Match percentage:

- High match: Sage Green
- Medium match: Wisdom Gold
- Low match or unknown match: Slate

Progress and learning state:

- Not started: Slate
- In progress: Primary Blue
- Completed: Sage Green
- Review or attention needed: Wisdom Gold
- Error or blocked: Clay Coral

### Tag And Chip Treatment

Tags, career levels, knowledge areas, concept chips, and match indicators should use subtle tinted chips, not saturated badges.

Preferred treatment:

- Light tinted background.
- One-pixel border.
- Dark readable text.
- No gradients.
- No random per-item colors.
- No large solid-color pills unless the element is a primary action.

For implementation, derive chips from semantic tokens with roughly:

- 10-14% color tint in the background.
- 28-40% color tint in the border.
- 70-80% color tint mixed with Ink for text.

This keeps the palette richer without making the product look like a prototype, dashboard template, or AI-generated landing page.
