import novels from "../../../content/novels.json";

/**
 * @typedef {Object} Novel
 * @property {string} id
 * @property {string} title
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
 * Get a single novel by its id.
 * @param {string} id
 * @returns {Novel | undefined}
 */
export function getNovelById(id) {
  return novels.find((novel) => novel.id === id);
}

/**
 * Get all novels written by a given author.
 * @param {string} id
 * @returns {Novel | undefined}
 */
export function getNovelByAuthorId(id) {
  return novels.find((novel) => novel.id === id);
}

/**
 * Get all novels written by a given author.
 * @param {string} authorId
 * @returns {Novel[]}
 */
export function getNovelsByAuthorId(authorId) {
  return novels.filter((novel) => novel.authorId === authorId);
}


