const nunjucks = require('nunjucks')

/**
 * Render Nunjucks with optional context
 * @param {Object} options Function options
 * @param {String} options.template Nunjucks template
 * @param {String} [options.context] Optional context data
 * @returns {String} Rendered template
 */
function renderNunjucks (options) {
  
  // If template name argument is not provided, throw error
  if (!options.template) {
    throw new Error('options.template is required')
  }

  // If template name argument is not a string, throw error
  if (typeof options.template !== 'string') {
    throw new TypeError('options.template must be of type string')
  }

  // Return compiled Nunjucks template
  nunjucks.configure({ autoescape: false })
  return nunjucks.renderString(options.template, options.context)
}

module.exports = renderNunjucks
