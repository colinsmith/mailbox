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

  const fallbackPath = path.join(process.cwd(), 'test/default.json')
  const dataPath = path.join(process.cwd(), `test/${options.test}.json`)

  if (fs.existsSync(fallbackPath)) {
    Object.assign(data, JSON.parse(fs.readFileSync(fallbackPath)))
  } else {
    throw new Error('The default test does not exist. Aborting test.')
  }

  if (options.test !== 'default') {
    if (fs.existsSync(dataPath)) {
      Object.assign(data, JSON.parse(fs.readFileSync(dataPath)))
    } else {
      console.log(`WARNING: The test ‘${options.test}’ does not exist! Using default test.`)
    }
  }

  return data
}

module.exports = getConfig