function normalizeUrl(url) {
  if (typeof url !== "string") return url;
  return url.endsWith("/") && url.length > 1 ? url.replace(/\/+$/, "") : url;
}

function toLearningOrder(value) {
  const numericValue =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(numericValue) ? numericValue : Number.MAX_SAFE_INTEGER;
}

function isIndexNoteItem(item) {
  if (!item || item.type !== "file") return false;
  const slug = String(item.slug || "").toLowerCase();
  const name = String(item.name || "").toLowerCase();
  const url = String(item.url || "").toLowerCase();
  return slug === "index" || name === "_index.md" || url.endsWith("/index");
}

function normalizeNoteRoute(noteUrl) {
  if (typeof noteUrl !== "string" || noteUrl.trim() === "") return null;
  const trimmed = noteUrl.trim();
  const [rawPath, rawHash = ""] = trimmed.split("#");
  let path = rawPath;
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  if (!path.startsWith("/note/")) {
    path = `/note${path}`;
  }
  const hash = rawHash ? `#${rawHash}` : "";
  return `${path}${hash}`;
}

function findMeta(data, key) {
  if (!data) return null;
  const normKey = normalizeUrl(key);
  for (const item of data) {
    const normItemUrl = normalizeUrl(item.url);
    if (normItemUrl === normKey) return item;
    if (item.children) {
      const found = findMeta(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

// Helper function to determine icon type
function getIconType(item) {
  const name = (item.name || "").toLowerCase();
  const title = (item.title || "").toLowerCase();

  if (isIndexNoteItem(item)) {
    return "index";
  } else
  if (name === "disclaimer.md" || title === "disclaimer") {
    return "info";
  } else if (item.type === "folder") {
    return "folder";
  } else {
    return "file";
  }
}

function buildMenuItems(data) {
  if (!data) return [];
  return data
    .filter((item) => item.display !== false)
    .sort((a, b) => {
      const aIsIndex = isIndexNoteItem(a);
      const bIsIndex = isIndexNoteItem(b);
      if (aIsIndex !== bIsIndex) return aIsIndex ? -1 : 1;
      const orderA = toLearningOrder(a.learningOrder);
      const orderB = toLearningOrder(b.learningOrder);
      if (orderA !== orderB) return orderA - orderB;
      return (a.title || a.name || "").localeCompare(b.title || b.name || "");
    })
    .map((item) => {
      const iconType = getIconType(item);
      const label =
        item.type === "file"
          ? (item.title || "Untitled Note")
          : (item.title || item.name);

      if (item.type === "folder" && item.children && item.children.length > 0) {
        return {
          key: item.url,
          label,
          iconType: iconType,
          children: buildMenuItems(item.children),
        };
      }
      return {
        key: item.url,
        label,
        iconType: iconType,
      };
    });
}

function buildNotesIndexFromGraphNotes(graphNotesIndex = []) {
  if (!Array.isArray(graphNotesIndex) || graphNotesIndex.length === 0) {
    return [];
  }

  const root = [];
  const folderMap = new Map();
  // Backends may return one notesIndex row per concept anchor in the same note.
  // Collapse to one sidebar item per note path.
  const dedupedEntryByPath = new Map();
  graphNotesIndex.forEach((entry) => {
    const normalizedRoute = normalizeNoteRoute(entry?.noteUrl);
    if (!normalizedRoute) return;
    const [notePath] = normalizedRoute.split("#");
    if (!notePath) return;

    const existing = dedupedEntryByPath.get(notePath);
    const nextOrder = toLearningOrder(entry?.learningOrder);
    if (!existing) {
      dedupedEntryByPath.set(notePath, {
        ...entry,
        noteUrl: notePath,
        learningOrder: nextOrder,
      });
      return;
    }

    const existingOrder = toLearningOrder(existing.learningOrder);
    dedupedEntryByPath.set(notePath, {
      ...existing,
      title: existing.title || entry?.title,
      // Keep deterministic earliest learning order when duplicates exist.
      learningOrder: Math.min(existingOrder, nextOrder),
    });
  });

  const sortedEntries = [...dedupedEntryByPath.values()].sort((a, b) => {
    const orderA = toLearningOrder(a?.learningOrder);
    const orderB = toLearningOrder(b?.learningOrder);
    if (orderA !== orderB) return orderA - orderB;
    return String(a?.title || a?.slug || "").localeCompare(String(b?.title || b?.slug || ""));
  });

  const getOrCreateFolder = (segments, container) => {
    const path = segments.join("/");
    if (folderMap.has(path)) return folderMap.get(path);
    const folder = {
      type: "folder",
      name: segments[segments.length - 1],
      title: segments[segments.length - 1],
      url: `/note/${path}`,
      directory: segments.slice(0, -1).join("/") || ".",
      children: [],
      learningOrder: Number.MAX_SAFE_INTEGER,
    };
    folderMap.set(path, folder);
    container.push(folder);
    return folder;
  };

  sortedEntries.forEach((entry) => {
    const normalizedRoute = normalizeNoteRoute(entry?.noteUrl);
    if (!normalizedRoute) return;
    const [notePath] = normalizedRoute.split("#");
    const pathWithoutPrefix = notePath.replace(/^\/note\//, "");
    if (!pathWithoutPrefix) return;
    const segments = pathWithoutPrefix.split("/").filter(Boolean);
    if (segments.length === 0) return;

    const fileName = segments[segments.length - 1];
    let container = root;
    for (let i = 0; i < segments.length - 1; i += 1) {
      const folder = getOrCreateFolder(segments.slice(0, i + 1), container);
      container = folder.children;
    }

    container.push({
      type: "file",
      name: fileName,
      title: entry?.title || "Untitled Note",
      slug: entry?.slug || fileName.replace(/\.md$/i, ""),
      url: notePath,
      noteUrl: normalizedRoute,
      directory: segments.slice(0, -1).join("/") || ".",
      learningOrder: toLearningOrder(entry?.learningOrder),
    });
  });

  return root;
}

function replaceSubjectFolderWithGraphNotes(baseNotesIndex = [], subjectId, graphNotesIndex = []) {
  if (!Array.isArray(baseNotesIndex) || !subjectId) {
    return Array.isArray(baseNotesIndex) ? baseNotesIndex : [];
  }

  const graphTree = buildNotesIndexFromGraphNotes(graphNotesIndex);
  const subjectFolderUrl = `/note/${subjectId}`;

  const findFolderByUrl = (items, targetUrl) => {
    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      if (item.type === "folder" && normalizeUrl(item.url) === normalizeUrl(targetUrl)) {
        return item;
      }
      if (Array.isArray(item.children) && item.children.length > 0) {
        const found = findFolderByUrl(item.children, targetUrl);
        if (found) return found;
      }
    }
    return null;
  };

  const graphSubjectFolder = findFolderByUrl(graphTree, subjectFolderUrl);
  if (!graphSubjectFolder) {
    return baseNotesIndex;
  }

  const mergeChildrenPreservingIndex = (baseChildren = [], graphChildren = []) => {
    const graphByUrl = new Map();
    graphChildren.forEach((child) => {
      if (!child || typeof child !== "object") return;
      graphByUrl.set(normalizeUrl(child.url), child);
    });

    const preservedIndexItems = baseChildren.filter(
      (child) =>
        child &&
        typeof child === "object" &&
        isIndexNoteItem(child) &&
        !graphByUrl.has(normalizeUrl(child.url))
    );

    return [...preservedIndexItems, ...graphChildren];
  };

  const replaceFolder = (items) =>
    items.map((item) => {
      if (!item || typeof item !== "object") return item;
      if (item.type === "folder" && normalizeUrl(item.url) === normalizeUrl(subjectFolderUrl)) {
        return {
          ...item,
          children: mergeChildrenPreservingIndex(
            Array.isArray(item.children) ? item.children : [],
            Array.isArray(graphSubjectFolder.children) ? graphSubjectFolder.children : []
          ),
        };
      }
      if (Array.isArray(item.children) && item.children.length > 0) {
        return {
          ...item,
          children: replaceFolder(item.children),
        };
      }
      return { ...item };
    });

  return replaceFolder(baseNotesIndex);
}

function mergeGraphNotesIntoNotesIndex(baseNotesIndex = [], graphNotesIndex = [], subjectId) {
  if (!Array.isArray(baseNotesIndex)) return [];
  if (!Array.isArray(graphNotesIndex) || graphNotesIndex.length === 0 || !subjectId) {
    return baseNotesIndex;
  }

  const subjectPrefix = `/note/${subjectId}/`;
  const graphMetaByRoute = new Map();
  graphNotesIndex.forEach((entry) => {
    const normalizedRoute = normalizeNoteRoute(entry?.noteUrl);
    if (!normalizedRoute) return;
    const [pathOnly] = normalizedRoute.split("#");
    graphMetaByRoute.set(normalizeUrl(pathOnly), entry);
  });

  const mergeNode = (node) => {
    if (!node || typeof node !== "object") return node;

    if (node.type === "folder" && Array.isArray(node.children)) {
      return {
        ...node,
        children: node.children.map(mergeNode),
      };
    }

    if (node.type !== "file") {
      return { ...node };
    }

    const normalizedNodeUrl = normalizeUrl(node.url);
    if (typeof normalizedNodeUrl !== "string" || !normalizedNodeUrl.startsWith(subjectPrefix)) {
      return { ...node };
    }

    const graphMeta = graphMetaByRoute.get(normalizedNodeUrl);
    if (!graphMeta) {
      return { ...node };
    }

    return {
      ...node,
      title: graphMeta.title || node.title || node.name,
      learningOrder: Number.isFinite(graphMeta.learningOrder)
        ? graphMeta.learningOrder
        : node.learningOrder,
      noteUrl: normalizeNoteRoute(graphMeta.noteUrl) || node.noteUrl,
    };
  };

  return baseNotesIndex.map(mergeNode);
}

export {
  normalizeUrl,
  normalizeNoteRoute,
  findMeta,
  buildMenuItems,
  buildNotesIndexFromGraphNotes,
  replaceSubjectFolderWithGraphNotes,
  mergeGraphNotesIntoNotesIndex,
};
