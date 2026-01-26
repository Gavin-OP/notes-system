import { unified } from "unified";
import remarkParse from "remark-parse";

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export function getOutline(markdown) {
  const tree = unified().use(remarkParse).parse(markdown);
  const outline = [];
  function visit(node) {
    if (node.type === "heading") {
      const text = node.children
        .filter((child) => child.type === "text")
        .map((child) => child.value)
        .join("");
      outline.push({
        level: node.depth,
        text,
        id: slugify(text),
      });
    }
    if (node.children) node.children.forEach(visit);
  }
  visit(tree);
  return outline;
}
