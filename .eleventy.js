const { DateTime } = require("luxon");
const MarkdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
  });

  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getFilteredByGlob("./_posts/*.md").sort((a, b) => b.date - a.date);
  });

  const md = new MarkdownIt({ html: true, linkify: true });
  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return md.render(content);
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_includes/layouts",
      output: "_site"
    }
  };
};
