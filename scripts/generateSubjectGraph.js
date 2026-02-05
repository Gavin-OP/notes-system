/**
 * Generate knowledge graph JSON for a subject
 * 
 * This script scans concept notes in a subject folder, extracts:
 * - Front matter metadata (category, phase, prerequisites, etc.)
 * - Bidirectional links [[concept-slug]]
 * 
 * Output: public/graphs/{subject}-graph.json
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Utils ======
function logInfo(message) {
  const timestamp = new Date().toISOString();
  console.log(`[INFO] [${timestamp}] ${message}`);
}

function logError(message) {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR] [${timestamp}] ${message}`);
}

// ====== Extract bidirectional links from markdown content ======
function extractBidirectionalLinks(content) {
  // Match [[slug]] or [[slug|display text]]
  const linkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const slug = match[1].trim();
    if (slug && !links.includes(slug)) {
      links.push(slug);
    }
  }
  
  return links;
}

// ====== Process a single concept note ======
function processConceptNote(filePath, subjectId, notesDir) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const { data: frontMatter, content: markdownContent } = matter(content);
    
    const fileName = path.basename(filePath, ".md");
    const slug = frontMatter.slug || fileName;
    
    // Extract bidirectional links from content
    const linkedConcepts = extractBidirectionalLinks(markdownContent);
    
    // Build node object
    const node = {
      id: slug,
      title: frontMatter.title || fileName,
      displayTitle: frontMatter.displayTitle || frontMatter.title || fileName,
      
      // Note URL for linking back to the note
      noteUrl: `/note/${subjectId}/concepts/${slug}`,
      filePath: `${subjectId}/concepts/${fileName}.md`,
      
      // Mindmap related
      category: frontMatter.mindmap_category || "Uncategorized",
      subcategory: frontMatter.mindmap_subcategory || null,
      importance: frontMatter.mindmap_importance || "medium",
      position: frontMatter.mindmap_position || null,
      
      // Learning path related
      learningPhase: frontMatter.learning_phase !== undefined ? frontMatter.learning_phase : -1,
      learningOrder: frontMatter.learning_order !== undefined ? frontMatter.learning_order : -1,
      prerequisites: Array.isArray(frontMatter.prerequisites) ? frontMatter.prerequisites : [],
      estimatedMinutes: frontMatter.estimated_minutes || null,
      difficulty: frontMatter.difficulty || "medium",
      
      // Metadata
      tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
      description: frontMatter.description || "",
      keywords: Array.isArray(frontMatter.keywords) ? frontMatter.keywords : [],
      
      // Linked concepts (from content)
      linkedConcepts: linkedConcepts,
    };
    
    return node;
  } catch (e) {
    logError(`Failed to process ${filePath}: ${e.message}`);
    return null;
  }
}

// ====== Build edges from nodes ======
function buildEdges(nodes) {
  const edges = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  let edgeId = 0;
  
  nodes.forEach(sourceNode => {
    // Process prerequisites
    sourceNode.prerequisites.forEach(prereqId => {
      if (nodeMap.has(prereqId)) {
        edges.push({
          id: `edge-${edgeId++}`,
          source: prereqId,
          target: sourceNode.id,
          type: "prerequisite",
          label: "前置知识",
          strength: 1.0,
          bidirectional: false,
        });
      }
    });
    
    // Process linked concepts
    sourceNode.linkedConcepts.forEach(targetId => {
      if (nodeMap.has(targetId)) {
        // Avoid duplicate edges
        const existingEdge = edges.find(
          e => (e.source === sourceNode.id && e.target === targetId) ||
               (e.source === targetId && e.target === sourceNode.id)
        );
        
        if (!existingEdge) {
          edges.push({
            id: `edge-${edgeId++}`,
            source: sourceNode.id,
            target: targetId,
            type: "related",
            label: "相关概念",
            strength: 0.7,
            bidirectional: true,
          });
        }
      }
    });
  });
  
  return edges;
}

// ====== Extract categories from nodes ======
function extractCategories(nodes) {
  const categoryMap = new Map();
  
  // Define category colors (can be customized)
  const categoryColors = {
    "Foundations": "#FF7675",
    "Data & Data Handling": "#FF9A76",
    "Statistics & Probability": "#74D3AE",
    "Machine Learning": "#5DBBDB",
    "Modeling & Evaluation": "#4A9FF5",
    "Ethics & Applications": "#FFA94D",
    "Uncategorized": "#95A5A6",
  };
  
  nodes.forEach(node => {
    const cat = node.category;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, {
        id: cat.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-"),
        name: cat,
        displayName: cat,
        color: categoryColors[cat] || "#95A5A6",
        order: categoryMap.size + 1,
        description: "",
        nodes: [],
      });
    }
    categoryMap.get(cat).nodes.push(node.id);
  });
  
  return Array.from(categoryMap.values());
}

// ====== Extract learning phases from nodes ======
function extractLearningPhases(nodes) {
  const phaseMap = new Map();
  
  const phaseNames = {
    0: "入门阶段",
    1: "基础阶段",
    2: "进阶阶段",
    3: "高级阶段",
  };
  
  const phaseDescriptions = {
    0: "了解基本概念和定义",
    1: "掌握核心知识和技能",
    2: "深入学习高级技术",
    3: "综合应用和优化",
  };
  
  nodes.forEach(node => {
    const phase = node.learningPhase;
    if (phase >= 0 && !phaseMap.has(phase)) {
      phaseMap.set(phase, {
        phase: phase,
        name: phaseNames[phase] || `阶段 ${phase}`,
        description: phaseDescriptions[phase] || "",
        estimatedHours: 0, // Can be calculated from nodes
      });
    }
  });
  
  return Array.from(phaseMap.values()).sort((a, b) => a.phase - b.phase);
}

// ====== Main function ======
function generateSubjectGraph(subjectId) {
  const notesDir = path.join(__dirname, "../public/notes");
  const subjectDir = path.join(notesDir, subjectId);
  const conceptsDir = path.join(subjectDir, "concepts");
  const outputDir = path.join(__dirname, "../public/graphs");
  const outputFile = path.join(outputDir, `${subjectId}-graph.json`);
  
  // Check if subject exists
  if (!fs.existsSync(subjectDir)) {
    logError(`Subject directory not found: ${subjectDir}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(conceptsDir)) {
    logError(`Concepts directory not found: ${conceptsDir}`);
    process.exit(1);
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  logInfo(`Generating graph for subject: ${subjectId}`);
  
  // Process all concept notes
  const conceptFiles = fs.readdirSync(conceptsDir)
    .filter(file => file.endsWith(".md") && file !== ".meta.yaml");
  
  const nodes = [];
  conceptFiles.forEach(file => {
    const filePath = path.join(conceptsDir, file);
    const node = processConceptNote(filePath, subjectId, notesDir);
    if (node) {
      nodes.push(node);
    }
  });
  
  logInfo(`Processed ${nodes.length} concept notes`);
  
  // Build edges
  const edges = buildEdges(nodes);
  logInfo(`Generated ${edges.length} edges`);
  
  // Extract categories and phases
  const categories = extractCategories(nodes);
  const learningPhases = extractLearningPhases(nodes);
  
  // Build complete graph object
  const graph = {
    meta: {
      subjectId: subjectId,
      subjectName: subjectId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      version: "1.0.0",
      lastGenerated: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
    },
    
    categories: categories,
    learningPhases: learningPhases,
    nodes: nodes,
    edges: edges,
    
    layouts: {
      radial: {
        centerX: 500,
        centerY: 400,
        mainRadius: 300,
        subRadius: 150,
      },
      hierarchical: {
        direction: "TB",
        levelSeparation: 150,
        nodeSeparation: 100,
      },
    },
    
    viewConfigs: {
      mindmap: {
        defaultLayout: "radial",
        showLabels: true,
        showEdges: true,
        nodeSize: {
          high: 80,
          medium: 60,
          low: 40,
        },
      },
      learningPath: {
        defaultLayout: "hierarchical",
        showPrerequisites: true,
        showEstimatedTime: true,
        groupByPhase: true,
      },
    },
  };
  
  // Write to file
  fs.writeFileSync(outputFile, JSON.stringify(graph, null, 2), "utf8");
  logInfo(`Graph generated successfully: ${outputFile}`);
  logInfo(`Statistics: ${nodes.length} nodes, ${edges.length} edges, ${categories.length} categories`);
}

// ====== CLI ======
const args = process.argv.slice(2);
const subjectId = args[0] || "data-science";

generateSubjectGraph(subjectId);

