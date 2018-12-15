const consola = require('consola')
const fs = require('fs-extra')
const path = require('path')
const getTemplates = require('../lib/get-templates')
const renderEmail = require('../lib/render-email')

/**
 * Build and write mail template
 * @param {Object} options Function options
 * @param {String} options.templatePath Path of MJML template
 * @param {String} localOutputPath Path for HTML output
 */
function build (options) {
  consola.info('Rendering MJML…')
  
  const templates = getTemplates(options);

  for (let i = 0; templates.length > i; i++) {
    consola.info('Rendering: ' + templates[i]);

    let localTemplatePath = path.join( path.dirname(options.templatePath), templates[i] );
    let localOutputPath = path.join( path.dirname(options.templatePath), '../../dist/', path.basename(templates[i], '.mjml') + '.html' );
    
    const renderedHTML = renderEmail({
      layout: options.layout,
      templatePath: localTemplatePath,
      templateData: options.test
    });

    consola.success('MJML rendered.')

    consola.info('Writing HTML file and copying attachments…')

    try {
      fs.ensureFileSync(localOutputPath)
      fs.writeFileSync(localOutputPath, renderedHTML)
      fs.copySync(path.join(process.cwd(), `${options.layout}/src/attachments`), path.dirname(localOutputPath))
    } catch (error) {
      consola.error(error.message)
      process.exit(1)
    }

    consola.success('HTML written and attachments copied.')
  }
}

module.exports = build
