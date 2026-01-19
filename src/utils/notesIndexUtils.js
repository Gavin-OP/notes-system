function findMeta(data, key) {
  if (!data) return null;
  for (const item of data) {
    if (item.url === key) return item;
    if (item.children) {
      const found = findMeta(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

export { findMeta };
