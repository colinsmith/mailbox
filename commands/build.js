const consola = require('consola')
const fs = require('fs-extra')
const path = require('path')
const getTestData = require('../lib/get-test-data')
const getTemplates = require('../lib/get-templates')
const renderMJML = require('../lib/render-mjml')
const renderNunjucks = require('../lib/render-nunjucks')

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

    const mjmlOutput = renderMJML({ path: localTemplatePath })

    if (mjmlOutput.errors.length) {
      consola.error(mjmlOutput.errors)
      process.exit(1)
    }

    const testData = getTestData({
      test: options.test,
      layout: options.layout
    })
    
    const nunjucksOutput = renderNunjucks({
      template: mjmlOutput.html,
      context: testData
    })

    consola.success('MJML rendered.')

    consola.info('Writing HTML file and copying attachments…')

    try {
      fs.ensureFileSync(localOutputPath)
      fs.writeFileSync(localOutputPath, nunjucksOutput)
      fs.copySync(path.join(process.cwd(), `${options.layout}/src/attachments`), path.dirname(localOutputPath))
    } catch (error) {
      consola.error(error.message)
      process.exit(1)
    }

    consola.success('HTML written and attachments copied.')
  }
}

module.exports = build
