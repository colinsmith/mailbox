const fs = require('fs-extra')
const getTestData = require('../lib/get-test-data')
const renderMJML = require('../lib/render-mjml')
const renderNunjucks = require('../lib/render-nunjucks')

/**
 * Render Email with optional context
 * @param {Object} options Function options
 * @param {String} options.layout target layout
 * @param {String} options.templatePath source template path
 * @param {String} options.templateData source of template data to inject
 * @returns {String} Rendered template (Nunjucks and MJML)
 */
function renderEmail (options) {

	// Read template content
	const fileBinary = fs.readFileSync(options.templatePath).toString()

	// Fetch test data
  const templateData = getTestData({
    test: options.templateData,
    layout: options.layout
  })

  // Inject Nunjucks.js template variables BEFORE rendering MJML
  const nunjucksOutput = renderNunjucks({
    template: fileBinary,
    context: templateData
  })

  // Render MJML with rendered Nunjucks.js response
  const mjmlOutput = renderMJML({
    template: nunjucksOutput,
    path: options.templatePath
  })

  // Throw error if 
  if (mjmlOutput.errors.length) {
    consola.error(mjmlOutput.errors)
    process.exit(1)
  }

  // Return rendered MJML as HTML
	return mjmlOutput.html
}

module.exports = renderEmail
