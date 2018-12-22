const fs = require('fs-extra')
const path = require('path')

/**
 * Get test data
 * @param {Object} options Function options
 * @param {String} options.test Use data from this test
 * @returns {Object} Test data
 */
function getConfig (options) {
  const data = {}
  
  if (options.test !== 'default') {
    if (fs.existsSync(options.test)) {
      Object.assign(data, JSON.parse(fs.readFileSync(options.test)))
    } else {
      console.log(`WARNING: The test ‘${options.test}’ does not exist! Using default test.`)
    }
  }

  return data
}

module.exports = getConfig
