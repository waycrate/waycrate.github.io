module.exports = function(eleventyConfig) {
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addPassthroughCopy('css')
  eleventyConfig.addPassthroughCopy('js')
  return {
    passthroughFileCopy: true
  }
}

