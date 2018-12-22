const consola = require('consola')
const formatMailSuccess = require('../lib/format-mail-success')
const generateAttachments = require('../lib/generate-attachments')
const getTemplateData = require('../lib/get-template-data')
const renderMJML = require('../lib/render-mjml')
const renderNunjucks = require('../lib/render-nunjucks')
const sendMail = require('../lib/send-mail')

/**
 * Send test email
 * @param {Object} options Function options
 * @param {String} options.templatePath Path of MJML template
 * @param {String} options.test Test data
 * @param {String} options.from Email sender
 * @param {String} options.to Email recipient
 */
function test (options) {
  consola.info('Rendering MJML…')

  const testData = getTemplateData({
    test: options.test,
    layout: options.layout
  })
  const mjmlOutput = renderMJML({ path: options.templatePath })

  if (mjmlOutput.errors.length) {
    consola.error(mjmlOutput.errors)
    process.exit(1)
  }

  consola.success('MJML rendered.')

  const nunjucksAttachments = {}

  for (let attachment in testData.attachments) {
    nunjucksAttachments[attachment] = `cid:${attachment}@example.com`
  }

  const nunjucksOutput = renderNunjucks({
    template: mjmlOutput.html,
    context: {
      ...testData,
      attachments: nunjucksAttachments
    }
  })

  const mailAttachments = generateAttachments({
    attachments: testData.attachments,
    layout: options.layout
  })

  consola.info('Sending email…')

  sendMail({
    from: options.from,
    to: options.to,
    subject: testData.subject,
    html: nunjucksOutput,
    attachments: mailAttachments
  }, (error, info) => {
    if (error) {
      consola.error(error.message)
      process.exit(1)
    }

    consola.success(formatMailSuccess({ info }))
  })
}

module.exports = test
