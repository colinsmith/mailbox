const consola = require('consola')
const fs = require('fs-extra')
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

  let inputPath, outputPath = '';

  if (!options.template) {
    
    console.log('2');
    // use default project
    inputPath = path.join(__dirname, '../', 'template')
    outputPath = path.join(process.cwd(), options.folder)

  } else {
    console.log('1');
    // local template is specified
    inputPath = path.join(process.cwd(), '/templates/', options.template)
    outputPath = path.join(process.cwd(), options.folder)
  }

  consola.info('Copying template…')

  try {
    fs.copySync(inputPath, outputPath)
  } catch (error) {
    consola.error(error.message)
    process.exit(1)
  }

  consola.success('Template copied.')

  consola.info('Generating .gitignore and package.json…')

  const gitignore = generateGitignore()
  const packageJSON = generatePackageJSON({ name: options.name })

  try {
    fs.writeFileSync(path.join(outputPath, '.gitignore'), gitignore)
    fs.writeFileSync(path.join(outputPath, 'package.json'), packageJSON)
  } catch (error) {
    consola.error(error.message)
    process.exit(1)
  }

  consola.success('.gitignore and package.json generated.')
}

module.exports = create
