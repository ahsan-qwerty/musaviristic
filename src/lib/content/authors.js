import authors from "../../../content/authors.json";

/**
 * @typedef {Object} Author
 * @property {string} id
 * @property {string} name
 * @property {string} bio
 * @property {string} profileImage
 */

/**
 * Get all authors.
 * @returns {Author[]}
 */
export function getAllAuthors() {
  return authors;
}

/**
 * Get a single author by id.
 * @param {string} id
 * @returns {Author | undefined}
 */
export function getAuthorById(id) {
  return authors.find((author) => author.id === id);
}


