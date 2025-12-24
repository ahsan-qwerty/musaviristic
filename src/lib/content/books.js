import {BOOKS} from "../../../content/books";

/**
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} title
 * @property {string} url
 * @property {string} description
 * @property {string} coverImage
 * @property {string} authorId
 */

/**
 * Get all books.
 * @returns {Book[]}
 */
export function getAllBooks() {
  return BOOKS;
}

/**
 * Get a single book by its id.
 * @param {string} id
 * @returns {Book | undefined}
 */
export function getBookById(id) {
  return BOOKS.find((book) => book.id === id);
}

/**
 * Get all books written by a given author.
 * @param {string} id
 * @returns {Book | undefined}
 */
export function getBookByAuthorId(authorId) {
  return BOOKS.filter((book) => book.authorId === authorId);
}

/**
 * Get all books written by a given author.
 * @param {string} authorId
 * @returns {Book[]}
 */
export function getBooksByAuthorId(authorId) {
  return BOOKS.filter((book) => book.authorId === authorId);
}


