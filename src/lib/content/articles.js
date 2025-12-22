import articles from "../../content/articles.json";

/**
 * @typedef {Object} Article
 * @property {string} id
 * @property {string} title
 * @property {string} slug
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
  return articles;
}

/**
 * Get a single article by its slug.
 * @param {string} slug
 * @returns {Article | undefined}
 */
export function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

/**
 * Get all articles written by a given author.
 * @param {string} authorId
 * @returns {Article[]}
 */
export function getArticlesByAuthorId(authorId) {
  return articles.filter((article) => article.authorId === authorId);
}


