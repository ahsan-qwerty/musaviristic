import poems from "../../../content/poetry.json";

/**
 * @typedef {Object} PoemImage
 * @property {string} id
 * @property {string} image
 */

/**
 * Get all poem images.
 * @returns {PoemImage[]}
 */
export function getAllPoemImages() {
  return poems;
}


