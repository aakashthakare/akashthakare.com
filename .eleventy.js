const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
     return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
  });

  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getFilteredByGlob("./writing/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("currentYear", () => {
    return DateTime.now().toFormat("yyyy");
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
