import { AUTHORS } from "../../../content/authors.js";

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
  return AUTHORS;
}

/**
 * Get a single author by id.
 * @param {string} id
 * @returns {Author | undefined}
 */
export function getAuthorById(id) {
  return AUTHORS.find((author) => author.id === id);
}
