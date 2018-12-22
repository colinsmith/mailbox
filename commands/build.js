const consola = require('consola')
const fs = require('fs-extra')
const path = require('path')
const getTemplates = require('../lib/get-templates')
const getTemplatePath = require('../lib/get-template-path')
const renderEmail = require('../lib/render-email')

/**
 * Build and write mail template
 * @param {Object} options Function options
 * @param {String} options.templatePath Path of MJML template
 * @param {String} localOutputPath Path for HTML output
 */
function build (options) {
  consola.info('Rendering MJML…')

  // Track rendered templates
  let renderedTemplates = Array();

  // Fetch list of all .mjml files in specified directory
  const templates = getTemplates({
      path: getTemplatePath({
        layout: options.layout,
        location: 'local',
        returnDir: 'src',
        subfolder: 'layouts'
      })
  });

  // Iterate over each .mjml file
  for (let i = 0; templates.length > i; i++) {
    
    renderedTemplates.push(templates[i]);

    const dataDirectory = getTemplatePath({
      layout: options.layout,
      location: 'local',
      subfolder: 'test',
      returnDir: 'src'
    });

    // Render MJML to HTML
    const renderedHTML = renderEmail({
      layout: options.layout,
      templatePath: getTemplatePath({
        layout: options.layout,
        location: 'local',
        subfolder: 'layouts',
        returnDir: 'src',
        file: templates[i]
      }),
      templateData: getTemplatePath({
        layout: options.layout,
        location: 'local',
        subfolder: 'data',
        returnDir: 'src',
        file: options.test + '.json'
      })
    });

    // Write compiled MJML to file
    try {
      // Verify directory
      fs.ensureFileSync(getTemplatePath({
        layout: options.layout,
        location: 'local',
        subfolder: 'layouts',
        returnDir: 'dist'
      }))

      // Write rendered MJML to destination
      fs.writeFileSync(getTemplatePath({
        layout: options.layout,
        location: 'local',
        returnDir: 'dist',
        file: path.join(path.basename(templates[i], '.mjml') + '.html' )
      }), renderedHTML)

      // Copy assets 1:1 to destination
      fs.copySync(getTemplatePath({
        layout: options.layout,
        location: 'local',
        subfolder: 'attachments',
        returnDir: 'src'
      }), getTemplatePath({
        layout: options.layout,
        location: 'local',
        subfolder: 'attachments',
        returnDir: 'dist'
      }))

    } catch (error) {
      // If fail, show error
      consola.error(error.message)
      process.exit(1)
    }
  }

  consola.success(`Build successful! [${renderedTemplates.join(', ')}]`)

}

module.exports = build
