---
slug: mindmap.md
title: Mindmap
order: 0
display: true
tags:
  - mindmap
  - documentation
---

# Complete Mindmap System Implementation Logic

## Part 1: Data Source - From Markdown Notes to Structured Data

### 1.1 Note File Structure

Each concept is a Markdown file stored in the `public/notes/{subject}/concepts/` directory:

```text
public/notes/
└── data-science/
    ├── _index.md          # Subject homepage
    └── concepts/
        ├── data-cleaning.md
        ├── data-collection.md
        ├── feature-engineering.md
        └── ...
```

### 1.2 Markdown File Frontmatter (Metadata)

Each note file begins with a YAML-formatted frontmatter containing all metadata for that concept:

```yaml
---
title: "Data Cleaning"
slug: "data-cleaning"
subject: "data-science"

# Mindmap configuration
mindmap_category: "Data & Data Handling"
mindmap_importance: "high"   # high / medium / low

# Learning Path configuration
learning_phase: 1            # Learning phase (0-3)
learning_order: 2            # Order within this phase
prerequisites: ["data-collection"]

tags:
  - data-science
  - data-cleaning
---
```

### 1.3 Bidirectional Links

In the note body, use `[[concept-id]]` syntax to reference other concepts:

```markdown
Data cleaning is performed after [[data-collection]].
Cleaned data will be used for [[feature-engineering]].
```

Bidirectional links represent relationships between concepts:

- `prerequisites` field: Represents prerequisite knowledge (must be learned first)
- `[[...]]` links: Represents related concepts (connected but not mandatory order)

### 1.4 Data Extraction and Conversion

A script (typically Node.js) scans all Markdown files, extracts frontmatter and `[[...]]` links, and generates structured JSON:

```text
Markdown notes → Script parsing → data-science-graph.json
```

The generated JSON file is stored at:

```text
public/graphs/data-science-graph.json
```

## Part 2: Data Structure - Graph JSON Composition

```text
┌─────────────────────────────────────────────────────────────┐
│                    data-science-graph.json                  │
├─────────────────────────────────────────────────────────────┤
│  meta: {                                                    │
│    subjectId, subjectName, nodeCount, edgeCount, ...        │
│  }                                                          │
├─────────────────────────────────────────────────────────────┤
│  categories: [                 ← Category information       │
│    { id, name, color, order, nodes: [...] }                 │
│  ]                                                          │
├─────────────────────────────────────────────────────────────┤
│  nodes: [                      ← All concept nodes           │
│    {                                                        │
│      id, title, noteUrl,                                    │
│      category,                                              │
│      importance,                                            │
│      prerequisites: [...],                                  │
│      linkedConcepts: [...]                                  │
│    }                                                        │
│  ]                                                          │
├─────────────────────────────────────────────────────────────┤
│  edges: [                      ← All connections             │
│    {                                                        │
│      source, target,                                        │
│      type: "prerequisite" | "related",                      │
│      strength, bidirectional                                │
│    }                                                        │
│  ]                                                          │
└─────────────────────────────────────────────────────────────┘
```

## Part 3: Implementation of Three Mindmap Views

### View 1: Hierarchical View

**Use case**: Beginners learning, understanding overall knowledge structure

**Tech stack**: React Flow + Custom orthogonal layout

**Data flow**:

```text
graph.json
  → loadGraphData()
  → calculateOrthogonalMindmapLayout()
  → convertToHierarchicalFormat()
  → ReactFlow rendering
```

**Layout logic**:

```text
                    Center (Subject)
                          |
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
       Category        Category        Category
           |              |              |
       Concept         Concept         Concept
```

**Features**:

- Three-layer structure: Center → Category → Concept
- Categories distributed left/right, concepts on the outer side
- Only shows hierarchical relationship edges
- Nodes are not draggable
- Uses Bezier curves for connections

### View 2: Radial View

**Use case**: Overall overview, presentation-style visualization

**Tech stack**: Apache ECharts (radial tree)

**Data flow**:

```text
graph.json
  → graphToRadialTree()
  → makeRadialTreeOption()
  → ECharts rendering
```

**Layout logic**:

```text
                Concept
               /
        Category ── Concept
       /        \
Center            Concept
       \        /
        Category ── Concept
               \
                Concept
```

**Features**:

- Radiates outward from center
- Automatically calculates angles and levels
- Supports animation and zoom
- Non-editable view, presentation-focused

### View 3: Network View

**Use case**: Deep learning, understanding complex relationships

**Tech stack**: React Flow + D3-force

**Data flow**:

```text
graph.json
  → convertToNetworkFormat()
  → D3 force simulation
  → React Flow rendering
```

**Layout logic**:

```text
    ●────●────●
    │\   │\   │
    │ ●──●──● │
    │/   │/   │
    ●────●────●
```

**Features**:

- Shows all relationship edges (prerequisite + related)
- Node size related to importance
- Hover highlights local relationships
- Supports dragging
- Obsidian-style visuals

## Part 4: Tech Stack Summary

| Module | Technology | Purpose |
|-----|------|------|
| Data Storage | Markdown + YAML | Content and metadata |
| Data Extraction | Node.js scripts | Generate JSON |
| Hierarchical View | React Flow | Structured display |
| Orthogonal Layout | Custom algorithm | Stable layout |
| Radial View | Apache ECharts | Presentation visualization |
| Network View | React Flow + D3-force | Relationship exploration |
| Styling | CSS Variables | Theme and dark mode |

## Part 5: Complete Data Flow Diagram

```text
Markdown notes
   ↓
Script parsing
   ↓
graph.json
   ↓
┌─────────────┬─────────────┬─────────────┐
│ Hierarchical│ Radial View  │ Network View│
│ React Flow  │ ECharts     │ RF + D3     │
└─────────────┴─────────────┴─────────────┘
```

## Part 6: Core Code Structure

```text
src/common/components/mindmap/
├── MindmapView.jsx
├── MindmapToolbar.jsx
├── RadialMindmapView.jsx
├── NetworkMindmapView.jsx
├── nodes/
│   ├── CenterNode.jsx
│   ├── CategoryNode.jsx
│   ├── ConceptNode.jsx
│   ├── NetworkNode.jsx
│   └── nodes.css
└── utils/
    ├── graphLoader.js
    ├── layoutUtils.js
    ├── radialTreeUtils.js
    ├── networkGraphLoader.js
    ├── networkLayoutUtils.js
    └── normalize.js
```
