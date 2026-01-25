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

function buildMenuItems(data) {
  if (!data) return [];
  return (
    data
      // .filter((item) => item.display !== false) // 可选：只显示 display 不为 false 的
      .map((item) => {
        if (
          item.type === "folder" &&
          item.children &&
          item.children.length > 0
        ) {
          return {
            key: item.url,
            label: item.title || item.name,
            children: buildMenuItems(item.children),
          };
        }
        return {
          key: item.url,
          label: item.title || item.name,
        };
      })
  );
}

export { normalizeUrl, findMeta, buildMenuItems };
