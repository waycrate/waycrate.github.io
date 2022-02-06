module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addPassthroughCopy('css')
  return {
    passthroughFileCopy: true
  }
}

