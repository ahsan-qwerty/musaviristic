import chapters from "../../../content/chapters.json";

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
  return chapters
    .filter((chapter) => chapter.novelId === novelId)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}

/**
 * Get a single chapter for a novel by chapter number.
 * @param {string} novelId
 * @param {number} chapterNumber
 * @returns {Chapter | undefined}
 */
export function getChapterByNovelAndNumber(novelId, chapterNumber) {
  return chapters.find(
    (chapter) =>
      chapter.novelId === novelId &&
      chapter.chapterNumber === chapterNumber
  );
}


