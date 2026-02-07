import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export default function remarkReadingTime() {
  return function transformTree(tree, file) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);

    const minutes = Math.max(1, Math.round(readingTime.minutes));
    file.data.astro.frontmatter.minutesRead = `${minutes}min`;
    file.data.astro.frontmatter.readingTime = {
      minutes: minutes,
      text: `${minutes}min`,
      time: readingTime.time,
      words: readingTime.words,
    };
  };
}
