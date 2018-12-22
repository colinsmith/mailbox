const fs = require('fs-extra')
const path = require('path')

/**
 * Get templates to render
 * @param {Object} options Function options
 * @returns {Array} List of all templates detected, to be rendered
 */
function getTemplates (options) {
  
  // If path not provided, throw error and exit
  if (options.path.length <= 0) {
      process.exit(-1);
  }

  // Get directory name and scan for .mjml templates
  // const path = path.dirname(options.path);
  const templates = fs.readdirSync(options.path).filter(fn => fn.endsWith('.mjml'));

  // Return array of detected template
  return templates
}

module.exports = getTemplates
