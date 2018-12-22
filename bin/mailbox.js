#!/usr/bin/env node

const build = {
  command: 'build [project]',
  desc: 'Render MJML template',
  builder (yargs) {
    yargs
      .positional('layout', {
        describe: 'Email layout',
        default: 'default',
        type: 'string'
      })
      .options('test', {
        describe: 'Optional test data',
        default: 'default',
        requiresArg: true,
        type: 'string'
      })
      .option('output', {
        alias: 'o',
        describe: 'Output path',
        requiresArg: true,
        type: 'string'
      })
  },
  handler (argv) {
    process.env.NODE_ENV = 'production'

    require('../commands/build') ({
      outputOverride: argv.output,
      test: argv.test,
      layout: argv.layout
    })
  }
}

const create = {
  command: 'create [project]',
  desc: 'Initialize a new project',
  builder (yargs) {
    yargs
      .positional('folder', {
        describe: 'Create project in this folder',
        default: 'default',
        type: 'string'
      })
      .options('name', {
        alias: 'n',
        describe: 'Project name',
        default: 'mailbox-project',
        requiresArg: true,
        type: 'string'
      })
      .options('template', {
        alias: 't',
        describe: 'Local template',
        requiresArg: false,
        type: 'string'
      })
  },
  handler (argv) {
    require('../commands/create') ({
      folder: argv.folder,
      name: argv.name,
      template: argv.template
    })
  }
}

const dev = {
  command: 'dev [project]',
  desc: 'Start dev server with auto-reload',
  builder (yargs) {
    yargs
      .positional('layout', {
        describe: 'Email layout',
        default: 'default',
        type: 'string'
      })
      .options('test', {
        describe: 'Optional test data',
        default: 'default',
        requiresArg: true,
        type: 'string'
      })
      .options('port', {
        describe: 'Port number',
        default: '3000',
        requiresArg: false,
        type: 'number'
      })
  },
  handler (argv) {
    process.env.NODE_ENV = 'development'

    require('../commands/dev') ({
      layout: argv.layout,
      test: argv.test,
      port: argv.port
    })
  }
}

const test = {
  command: 'test [layout]',
  desc: 'Send test email',
  builder (yargs) {
    yargs
      .positional('layout', {
        describe: 'Email layout',
        default: 'default',
        type: 'string'
      })
      .options('test', {
        describe: 'Test data',
        default: 'default',
        requiresArg: true,
        type: 'string'
      })
      .options('from', {
        describe: 'Email sender',
        default: 'test@example.com',
        requiresArg: true,
        type: 'string'
      })
      .option('to', {
        describe: 'Email recipient',
        demandOption: true,
        requiresArg: true,
        type: 'string'
      })
  },
  handler (argv) {
    process.env.NODE_ENV = 'development'

    require('../commands/test') ({
      layout: argv.layout,
      test: argv.test,
      from: argv.from,
      to: argv.to
    })
  }
}

require('yargs')
  .command(create)
  .command(dev)
  .command(build)
  // .command(test)
  .strict(true)
  .demandCommand()
  .recommendCommands()
  .showHelpOnFail(true)
  .parse()
