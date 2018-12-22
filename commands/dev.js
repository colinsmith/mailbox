const chokidar = require('chokidar')
const consola = require('consola')
const express = require('express')
const generateWebSocketScript = require('../lib/generate-weboscket-script')
const getPort = require('../lib/get-port')
const getTestData = require('../lib/get-test-data')
const getTemplates = require('../lib/get-templates')
const getTemplatePath = require('../lib/get-template-path')
const injectScript = require('../lib/inject-script')
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

  // Fetch list of all .mjml files in specified directory
  const templates = getTemplates({
      path: getTemplatePath({
        layout: options.layout,
        location: 'local',
        subfolder: 'layouts',
        returnDir: 'src'
      })
  });

  for (let i = 0; templates.length > i; i++) {

    // Use port flag if provided, otherwise default to port 3000
    const port = (options.port !== 'undefined') ? 3000 : Number(options.port);

    // Set up WebSocket and express dev server
    const serverPort = await getPort(port)
    const socketPort = await getPort(serverPort + 1)

    const server = express()
    const socket = new WebSocket.Server({ port: socketPort })

    const socketScript = generateWebSocketScript({ port: socketPort })

    server.use(express.static(
      getTemplatePath({
        layout: options.layout,
        location: 'local',
        subfolder: 'attachments',
        returnDir: 'src'
      })
    ))

    server.get('/', (request, response) => {
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

      response.send(renderedHTML)
    })

    server.listen(serverPort)

    consola.info( templates[i] + ` running at http://localhost:${serverPort}`)

    chokidar
      .watch([
        getTemplatePath({
          layout: options.layout,
          location: 'local',
          subfolder: 'layouts',
          returnDir: 'src',
          file: '/**/*.mjml'
        }), getTemplatePath({
          layout: options.layout,
          location: 'local',
          subfolder: 'data',
          returnDir: 'src',
          file: '/**/*.json'})
      ], { ignoreInitial: true })
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
