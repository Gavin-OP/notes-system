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

export { findMeta };
