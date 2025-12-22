import {ARTICLES} from "../../../content/articles";

/**
 * @typedef {Object} Article
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} featuredImage
 * @property {string} authorId
 * @property {string} publishDate
 * @property {string[]} [tags]
 */

/**
 * Get all articles.
 * @returns {Article[]}
 */
export function getAllArticles() {
  return ARTICLES;
}

/**
 * Get a single article by its id.
 * @param {string} id
 * @returns {Article | undefined}
 */
export function getArticleById(id) {
  return ARTICLES.find((article) => article.id === id);
}

/**
 * Get all articles written by a given author.
 * @param {string} id
 * @returns {Article | undefined}
 */
export function getArticleByAuthorId(authorId) {
  return ARTICLES.filter((article) => article.authorId === authorId);
}

/**
 * Get all articles written by a given author.
 * @param {string} authorId
 * @returns {Article[]}
 */
export function getArticlesByAuthorId(authorId) {
  return ARTICLES.filter((article) => article.authorId === authorId);
}


