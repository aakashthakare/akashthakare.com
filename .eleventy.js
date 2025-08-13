const { DateTime } = require("luxon");
const readingTime = require('reading-time');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
     return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
  });

  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getFilteredByGlob("./writing/*.md").filter(post => !post.data.draft).sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("currentYear", () => {
    return DateTime.now().toFormat("yyyy");
  });

  eleventyConfig.addFilter("readingTime", function (text) {
    const stats = readingTime(text);
    return Math.ceil(stats.minutes) + " min read";
  });

  eleventyConfig.addTransform("mermaidWrapperFix", function(content, outputPath) {
    if(outputPath && outputPath.endsWith(".html")) {
      return content.replace(
        /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
        (_match, p1) => `<pre class="mermaid">${p1}</pre>`
      );
    }
    return content;
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