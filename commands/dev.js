const chokidar = require('chokidar')
const consola = require('consola')
const express = require('express')
const generateWebSocketScript = require('../lib/generate-weboscket-script')
const getPort = require('../lib/get-port')
const getTestData = require('../lib/get-test-data')
const getTemplates = require('../lib/get-templates')
const injectScript = require('../lib/inject-script')
const renderMJML = require('../lib/render-mjml')
const renderNunjucks = require('../lib/render-nunjucks')
const renderEmail = require('../lib/render-email')
const path = require('path')
const WebSocket = require('ws')

/**
 * Start dev server with hot reload
 * @param {Object} options Function options
 * @param {Number} [options.port=3000] Server port
 * @param {String} options.templatePath Path of MJML template
 * @param {String} [options.test] Optional test data
 */
async function dev (options) {

  const templates = getTemplates(options);

  for (let i = 0; templates.length > i; i++) {

    let localTemplatePath = path.join( path.dirname(options.templatePath), templates[i] );
    let localOutputPath = path.join( path.dirname(options.templatePath), '../../dist/', path.basename(templates[i], '.mjml') + '.html' );

    if (!options.templatePath) {
      throw new Error('options.templatePath is required')
    }

    if (typeof options.templatePath !== 'string') {
      throw new TypeError('options.templatePath must be of type string')
    }

    if (options.port && typeof options.port !== 'number') {
      throw new TypeError('options.port must be of type number')
    }

    if (options.test && typeof options.test !== 'string') {
      throw new TypeError('options.test must be of type string')
    }

    const serverPort = await getPort(options.port)
    const socketPort = await getPort(serverPort + 1)

    const server = express()
    const socket = new WebSocket.Server({ port: socketPort })

    const socketScript = generateWebSocketScript({ port: socketPort })

    server.use(express.static('src/attachments'))

    server.get('/', (request, response) => {

      const renderedHTML = renderEmail({
        layout: options.layout,
        templatePath: localTemplatePath,
        templateData: options.test
      });

      response.send(renderedHTML)
    })

    server.listen(serverPort)

    consola.info( templates[i] + ` running at http://localhost:${serverPort}`)

    chokidar
      .watch(['src/**/*.mjml', 'test/*.json'], { ignoreInitial: true })
      .on('all', () => {
        socket.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send('window-reload')
          }
        })
      })
  }
}

module.exports = dev
