/**
 * Source files excluded from conversion.
 *
 * Medium's data model treats a reply to someone else's article as a story, so
 * the official export mixes them in with real posts — with identical markup and
 * no in-reply-to marker to tell them apart. They carry no draft flag either, so
 * without this list they would publish as real pages and enter the sitemap.
 *
 * Every entry below was read in full before being listed. Length alone is not
 * the criterion: short posts with actual content stay in.
 */
export const EXCLUDED_FILES = new Set([
  // Replies left on other people's articles
  "2019-03-25_-------4ba82c7c35ef.html", // 「這篇寫得很好」
  "2019-05-28_----XD-3f57ef522716.html", // 「我讀完了XD」
  "2019-05-29_---------------f0b4be49293c.html", // 「你好，謝謝你的關注以及支持。」— 授權轉載的回覆
  "2019-06-04_-----118fd4fa3001.html", // 「謝謝稱讚」
  "2019-12-02_--------------------------6b1c42904521.html", // 「推這句「二十歲的一年跟三十歲的一年是不一樣的。」」
  "2020-05-27_-----------------------------------render-----react-----------------key-becc2881e5ba.html", // 回覆讀者關於 React key 的提問
  "2022-02-21_----5aa5df8389d6.html", // 「謝謝！」
  "2023-06-28_-------55dd102ace3.html", // 「感謝你的鼓勵」
  "2025-09-03_-------------------d555c3cff63f.html", // 「謝謝你的鼓勵，能幫到你，我感覺很開心」

  // Test posts
  "2019-03-25_text-ff9ebc87c12e.html", // 標題與內文皆為 "text 測試"
  "2020-05-31_--adbe8b5014b6.html", // 標題與內文皆為 "?"
]);
