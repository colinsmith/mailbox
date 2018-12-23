const consola = require('consola')
const fs = require('fs-extra')
const getTemplatePath = require('../lib/get-template-path')
const generateGitignore = require('../lib/generate-gitignore')
const generatePackageJSON = require('../lib/generate-package-json')
const path = require('path')

/**
 * Create new project
 * @param {Object} options Function options
 * @param {String} options.folder Create project in this folder
 * @param {String} options.name Project name
 */
function create (options) {

  if (!options.folder) {
    // Throw error if folder location parameter is missing
    throw new Error('Folder is required')
  }

  consola.info('Copying template…')

  const gitignore = generateGitignore()
  const packageJSON = generatePackageJSON({ name: options.name })

  if (options.template) {

    try {
      // Copy template content
      fs.copySync(getTemplatePath({
        location: 'local',
        subfolder: path.join('templates/', options.template)
      }), getTemplatePath({
        location: 'local',
        subfolder: options.folder
      }))

    } catch (error) {
      consola.error(error.message)
      process.exit(1)
    }

    consola.success(`New project created from template [template: ${options.template}]`)

  } else {

    try {
      // Copy template content
      fs.copySync(getTemplatePath({
        location: 'global',
        subfolder: 'template/default/'
      }), getTemplatePath({
        location: 'local',
        subfolder: options.folder
      }))

    } catch (error) {
      consola.error(error.message)
      process.exit(1)
    }

    consola.success('New project created')
  }
}

module.exports = create
