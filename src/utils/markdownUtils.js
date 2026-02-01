import { unified } from "unified";
import { visit } from "unist-util-visit";
import remarkParse from "remark-parse";
import remarkSlug from "remark-slug";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "");
}

function getOutline(markdown) {
  const tree = unified().use(remarkParse).use(remarkSlug).parse(markdown);
  // 需要再 run 一下 pipeline 让 remark-slug 生效
  unified().use(remarkParse).use(remarkSlug).runSync(tree);

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
        id: node.data?.id, // 用 remark-slug 生成的 id
      });
    }
    if (node.children) node.children.forEach(visit);
  }
  visit(tree);
  return outline;
}

const resolveRelativePath = (base, relative) => {
  const stack = base ? base.split("/") : [];
  const parts = relative.split("/");
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "." || parts[i] === "") continue;
    if (parts[i] === "..") stack.pop();
    else stack.push(parts[i]);
  }
  return stack.join("/");
};

function remarkHighlightMark() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      const regex = /==(.+?)==/g;
      let match;
      let lastIndex = 0;
      const newNodes = [];
      const value = node.value;

      while ((match = regex.exec(value)) !== null) {
        if (match.index > lastIndex) {
          newNodes.push({
            type: "text",
            value: value.slice(lastIndex, match.index),
          });
        }
        newNodes.push({
          type: "html",
          value: `<mark>${match[1]}</mark>`,
        });
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < value.length) {
        newNodes.push({
          type: "text",
          value: value.slice(lastIndex),
        });
      }
      if (newNodes.length) {
        parent.children.splice(index, 1, ...newNodes);
        return index + newNodes.length;
      }
    });
  };
}

export { slugify, getOutline, resolveRelativePath, remarkHighlightMark };
