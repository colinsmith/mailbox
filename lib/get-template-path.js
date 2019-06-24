
const path = require('path')

/**
 * Intelligently return fetch/build/file paths
 * @param {String} options.layout via <project folder name>,
 * @param {String} options.location via [global <npm>, local <working directory>]
 * @param {String} options.subfolder via <folder name> [template, data, src, assets, dist, root]
 * @param {String} options.returnDir via [input, output]
 * @param {String} options.file via <file name>
 * @returns {String} Generated template/file path
 */

function getTemplatePath (options) {
  if (!options.location) {
    // Throw error if folder location parameter is missing
    throw new Error('Folder location is required [global, local]')
  }

  // Get Yarn/NPM template directory if global, use local directory if local
  const baseDir = (options.location == 'global') ? path.join(__dirname, '../../', '/mailbox/') : process.cwd()

  // OPTIONAL: Determine if src or dist directory is being targeted
  const layout = (typeof options.layout !== 'undefined') ? options.layout : ''

  // OPTIONAL: Determine if src or dist directory is being targeted
  const returnDir = (typeof options.returnDir !== 'undefined') ? options.returnDir : ''

  // OPTIONAL: Determine if src or dist directory is being targeted
  const subfolder = (typeof options.subfolder !== 'undefined') ? options.subfolder : ''

  // OPTIONAL: Determine if src or dist directory is being targeted
  const fileName = (typeof options.file !== 'undefined') ? options.file : ''

  // Return final combined file path
  const filePath = path.join(path.resolve('./'), `${returnDir}`, `${subfolder}`, `${fileName}`) 

  return filePath
}

module.exports = getTemplatePath
