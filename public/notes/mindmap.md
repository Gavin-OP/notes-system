---
slug: mindmap.md
title: Mindmap
order: 0
display: true
tags:
  - mindmap
  - documentation
---

# Mindmap 系统完整实现逻辑

## 一、数据来源：从 Markdown 笔记到结构化数据

### 1.1 笔记文件结构

每个概念都是一个 Markdown 文件，存放在 `public/notes/{学科}/concepts/` 目录下：

```text
public/notes/
└── data-science/
    ├── _index.md          # 学科首页
    └── concepts/
        ├── data-cleaning.md
        ├── data-collection.md
        ├── feature-engineering.md
        └── ...
```

### 1.2 Markdown 文件的 Frontmatter（元数据）

每个笔记文件开头都有一个 YAML 格式的 frontmatter，包含该概念的所有元信息：

```yaml
---
title: "Data Cleaning"
slug: "data-cleaning"
subject: "data-science"

# Mindmap 相关配置
mindmap_category: "Data & Data Handling"
mindmap_importance: "high"   # high / medium / low

# Learning Path 相关
learning_phase: 1            # 学习阶段 (0-3)
learning_order: 2            # 在该阶段的学习顺序
prerequisites: ["data-collection"]

tags:
  - data-science
  - data-cleaning
---
```

### 1.3 双向链接（Bidirectional Links）

在笔记正文中，使用 `[[concept-id]]` 语法来引用其他概念：

```markdown
数据清洗在 [[data-collection]] 之后进行。
清洗后的数据会被用于 [[feature-engineering]]。
```

双向链接表示概念之间的关联关系：

- `prerequisites` 字段：表示前置知识（必须先学）
- `[[...]]` 链接：表示相关概念（有关联但不是强制顺序）

### 1.4 数据提取与转换

通过一个脚本（通常是 Node.js）扫描所有 Markdown 文件，提取 frontmatter 和 `[[...]]` 链接，生成结构化 JSON：

```text
Markdown 笔记 → 脚本解析 → data-science-graph.json
```

生成的 JSON 文件存放在：

```text
public/graphs/data-science-graph.json
```

## 二、数据结构：Graph JSON 的组成

```text
┌─────────────────────────────────────────────────────────────┐
│                    data-science-graph.json                  │
├─────────────────────────────────────────────────────────────┤
│  meta: {                                                    │
│    subjectId, subjectName, nodeCount, edgeCount, ...        │
│  }                                                          │
├─────────────────────────────────────────────────────────────┤
│  categories: [                 ← 分类信息                    │
│    { id, name, color, order, nodes: [...] }                 │
│  ]                                                          │
├─────────────────────────────────────────────────────────────┤
│  nodes: [                      ← 所有概念节点                 │
│    {                                                        │
│      id, title, noteUrl,                                    │
│      category,                                              │
│      importance,                                            │
│      prerequisites: [...],                                  │
│      linkedConcepts: [...]                                  │
│    }                                                        │
│  ]                                                          │
├─────────────────────────────────────────────────────────────┤
│  edges: [                      ← 所有连线                    │
│    {                                                        │
│      source, target,                                        │
│      type: "prerequisite" | "related",                      │
│      strength, bidirectional                                │
│    }                                                        │
│  ]                                                          │
└─────────────────────────────────────────────────────────────┘
```

## 三、三种 Mindmap 视图的实现

### 图 1：层级视图（Hierarchical View）

适合场景：初学者入门，理解整体知识结构

技术栈：React Flow + 自定义正交布局

数据流程：

```text
graph.json
  → loadGraphData()
  → calculateOrthogonalMindmapLayout()
  → convertToHierarchicalFormat()
  → ReactFlow 渲染
```

布局逻辑：

```text
                    Center (Subject)
                          |
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
       Category        Category        Category
           |              |              |
       Concept         Concept         Concept
```

特点：

- 三层结构：中心 → 分类 → 概念
- 分类左右分布，概念在外侧
- 仅显示层级关系边
- 节点不可拖动
- 使用 Bezier 曲线连接

### 图 2：径向视图（Radial View）

适合场景：整体概览、展示型可视化

技术栈：Apache ECharts（radial tree）

数据流程：

```text
graph.json
  → graphToRadialTree()
  → makeRadialTreeOption()
  → ECharts 渲染
```

布局逻辑：

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

特点：

- 从中心向外辐射
- 自动计算角度与层级
- 支持动画与缩放
- 非编辑型视图，偏展示

### 图 3：网络视图（Network View）

适合场景：深入学习，理解复杂关系

技术栈：React Flow + D3-force

数据流程：

```text
graph.json
  → convertToNetworkFormat()
  → D3 force simulation
  → React Flow 渲染
```

布局逻辑：

```text
    ●────●────●
    │\   │\   │
    │ ●──●──● │
    │/   │/   │
    ●────●────●
```

特点：

- 显示所有关系边（prerequisite + related）
- 节点大小与重要度相关
- Hover 高亮局部关系
- 支持拖动
- Obsidian 风格视觉

## 四、技术栈总结

| 模块 | 技术 | 用途 |
|-----|------|------|
| 数据存储 | Markdown + YAML | 内容与元数据 |
| 数据提取 | Node.js 脚本 | 生成 JSON |
| 层级视图 | React Flow | 结构化展示 |
| 正交布局 | 自定义算法 | 稳定布局 |
| 径向视图 | Apache ECharts | 展示型可视化 |
| 网络视图 | React Flow + D3-force | 关系探索 |
| 样式 | CSS Variables | 主题与暗色模式 |

## 五、完整数据流示意

```text
Markdown 笔记
   ↓
脚本解析
   ↓
graph.json
   ↓
┌─────────────┬─────────────┬─────────────┐
│ 层级视图     │ 径向视图     │ 网络视图      │
│ React Flow  │ ECharts     │ RF + D3     │
└─────────────┴─────────────┴─────────────┘
```

## 六、核心代码结构

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
 

