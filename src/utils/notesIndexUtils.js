function normalizeUrl(url) {
  if (typeof url !== "string") return url;
  return url.endsWith("/") && url.length > 1 ? url.replace(/\/+$/, "") : url;
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
    .map((item) => {
      const iconType = getIconType(item);

      if (item.type === "folder" && item.children && item.children.length > 0) {
        return {
          key: item.url,
          label: item.title || item.name,
          iconType: iconType,
          children: buildMenuItems(item.children),
        };
      }
      return {
        key: item.url,
        label: item.title || item.name,
        iconType: iconType,
      };
    });
}

export { normalizeUrl, findMeta, buildMenuItems };
