import chapters from "../../../content/chapters.json";

/**
 * @typedef {Object} Chapter
 * @property {string} id
 * @property {string} novelSlug
 * @property {number} chapterNumber
 * @property {string} title
 * @property {string} content
 * @property {string} publishDate
 */

/**
 * Get all chapters for a given novel, sorted by chapterNumber.
 * @param {string} novelSlug
 * @returns {Chapter[]}
 */
export function getChaptersForNovel(novelSlug) {
  return chapters
    .filter((chapter) => chapter.novelSlug === novelSlug)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}

/**
 * Get a single chapter for a novel by chapter number.
 * @param {string} novelSlug
 * @param {number} chapterNumber
 * @returns {Chapter | undefined}
 */
export function getChapterByNovelAndNumber(novelSlug, chapterNumber) {
  return chapters.find(
    (chapter) =>
      chapter.novelSlug === novelSlug &&
      chapter.chapterNumber === chapterNumber
  );
}


