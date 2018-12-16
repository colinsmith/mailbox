const mjmlCore = require('mjml-core/lib/includeExternal')

/**
 * Render MJML string to HTML
 * @param {Object} options Function options
 * @param {String} options.path MJML template path
 */
function prerenderMJML (options) {

  const prerenderedMJML = mjmlCore.default( options.template + '.mjml', { 
    filePath: options.path
  });

  // Return rendered MJML into HTML
  return prerenderedMJML
}

module.exports = prerenderMJML
