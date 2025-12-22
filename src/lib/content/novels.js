import novels from "../../../content/novels.json";

/**
 * @typedef {Object} Novel
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} description
 * @property {string} coverImage
 * @property {string} authorId
 * @property {string} status
 */

/**
 * Get all novels.
 * @returns {Novel[]}
 */
export function getAllNovels() {
  return novels;
}

/**
 * Get a single novel by its slug.
 * @param {string} slug
 * @returns {Novel | undefined}
 */
export function getNovelBySlug(slug) {
  return novels.find((novel) => novel.slug === slug);
}

/**
 * Get all novels written by a given author.
 * @param {string} authorId
 * @returns {Novel[]}
 */
export function getNovelsByAuthorId(authorId) {
  return novels.filter((novel) => novel.authorId === authorId);
}


