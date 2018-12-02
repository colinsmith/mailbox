const consola = require('consola')
const fs = require('fs-extra')
const path = require('path')
const getTestData = require('../lib/get-test-data')
const renderMJML = require('../lib/render-mjml')
const renderNunjucks = require('../lib/render-nunjucks')

/**
 * Build and write mail template
 * @param {Object} options Function options
 * @param {String} options.templatePath Path of MJML template
 * @param {String} options.outputPath Path for HTML output
 */
function build (options) {
  consola.info('Rendering MJML…')

  const mjmlOutput = renderMJML({ path: options.templatePath })

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

  console.log(nunjucksOutput);

  consola.success('MJML rendered.')

  consola.info('Writing HTML file and copying attachments…')

  try {
    fs.ensureFileSync(options.outputPath)
    fs.writeFileSync(options.outputPath, nunjucksOutput)
    fs.copySync(path.join(process.cwd(), `${options.layout}/src/attachments`), path.dirname(options.outputPath))
  } catch (error) {
    consola.error(error.message)
    process.exit(1)
  }

  consola.success('HTML written and attachments copied.')
}

module.exports = build
