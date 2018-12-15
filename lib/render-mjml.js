const fs = require('fs-extra')
const getConfig = require('./get-config')
const mjml = require('mjml')

/**
 * Render MJML string to HTML
 * @param {Object} options Function options
 * @param {String} options.path MJML template path
 */
function renderMJML (options) {
  
  // If path argument is not provided, throw error
  if (!options.path) {
    throw new Error('options.path is required')
  }

  // If path argument is not a string, throw error
  if (typeof options.path !== 'string') {
    throw new TypeError('options.path must be of type string')
  }

  // Fetch MJML Options file content
  const mjmlOptions = getConfig()
  mjmlOptions.filePath = options.path

  // Return rendered MJML into HTML
  return mjml(options.template, mjmlOptions)
}

module.exports = renderMJML
