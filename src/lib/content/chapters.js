import { CHAPTERS } from "../../../content/chapters.js";

/**
 * @typedef {Object} Chapter
 * @property {string} id
 * @property {string} novelId
 * @property {number} chapterNumber
 * @property {string} title
 * @property {string} content
 * @property {string} publishDate
 */

/**
 * Get all chapters for a given novel, sorted by chapterNumber.
 * @param {string} novelId
 * @returns {Chapter[]}
 */
export function getChaptersForNovel(novelId) {
  return CHAPTERS.filter((chapter) => chapter.novelId === novelId).sort(
    (a, b) => a.chapterNumber - b.chapterNumber
  );
}

/**
 * Get a single chapter by its chapterId.
 * @param {string} chapterId
 * @returns {Chapter | undefined}
 */
export function getChapterById(chapterId) {
  return CHAPTERS.find((chapter) => chapter.chapterId === chapterId);
}

/**
 * Get a single chapter for a novel by chapter number.
 * @param {string} novelId
 * @param {number} chapterNumber
 * @returns {Chapter | undefined}
 */
export function getChapterByNovelAndNumber(novelId, chapterNumber) {
  return CHAPTERS.find(
    (chapter) =>
      chapter.novelId === novelId && chapter.chapterNumber === chapterNumber
  );
}
