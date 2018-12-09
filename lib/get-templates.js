const fs = require('fs-extra')
const path = require('path')

/**
 * Get templates to render
 * @param {Object} options Function options
 * @returns {Array} List of all templates detected, to be rendered
 */
function getTemplates (options) {
  
  if (options.templatePath.length <= 0) {
      process.exit(-1);
  }

  const templatePath = path.dirname(options.templatePath);
  const templates = fs.readdirSync(templatePath).filter(fn => fn.endsWith('.mjml'));

  return templates
}

module.exports = getTemplates
