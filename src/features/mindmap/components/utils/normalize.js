/**
 * Normalization utilities for mindmap data
 */

/**
 * Normalize category ID from category name string
 * 
 * Converts human-readable category names to URL-safe identifiers:
 * - "Statistics & Probability" → "statistics-probability"
 * - "Data & Data Handling" → "data-data-handling"
 * 
 * @param {string} categoryName - Category name to normalize
 * @returns {string} Normalized category ID
 */
export function normalizeCategoryId(categoryName) {
  return categoryName
    .toLowerCase()
    .replace(/\s+&\s+/g, "-")
    .replace(/\s+/g, "-");
}

