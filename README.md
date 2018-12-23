# Mailbox

A modern approach to email development, testing and deployment. Built for speed, open to everyone!

This project is still a work in progress and builds on the amazing work of [Fynn Becker](https://github.com/mvsde/mailbox). Please refer to the [todo list](#todo-list) for a snapshot of development progress.


## Installation

1. Install [Node.js v10+](https://nodejs.org)
2. Install Mail Box CLI:

```bash
# npm
npm install -g https://github.com/colinsmith/mailbox.git

# Yarn
yarn global add https://github.com/colinsmith/mailbox.git
```

## Commands

The CLI supports three CLI commands: `mailbox create`, `mailbox dev` and `mailbox build`

### Create

Create and enter a new or directory for your campaigns with:

`mkdir <campaigns> && cd <campaigns>`

Create a new project with:

`mailbox create <project name>`

Optionally, you can have a `templates` folder in your working directory, which will allow you to build a new project from a template. To do this use the `--template` flag:

`mailbox create <project name> --template <my template>`

### Develop

A small local development server (using express.js) can be started with:

`mailbox dev <project name>`

By default, port 3000 is used. If you want to specify a new port, you can use the `--port` flag:

`mailbox dev --port <my port>`

### Build

Building templates can be done with the `build` command:

`mailbox build <project name>`


## Project Structure

Ideally, a working directory should look something like this:

+-- campaigns
|   +-- templates
|       +-- my-template     
|           +-- src
|               +-- attachments
|                   +-- img.jpg
|               +-- data
|                   +-- data.json
|               +-- includes
|                   +-- partial.mjml
|               +-- layouts
|                   +-- index.mjml
|   +-- my-email
|       +-- src
|           +-- attachments
|               +-- img.jpg
|           +-- data
|               +-- data.json
|           +-- includes
|               +-- partial.mjml
|           +-- layouts
|               +-- index.mjml
|       +-- dist
|           +-- attachments
|               +-- img.jpg
|           +-- index.html


## Todo list

- [x] Feature: Support multiple root template rendering
- [x] Enhancement: Support optional port value
- [x] Feature: Add template support in `create` command
- [x] Enhancement: Improve handling of serving multiple root templates
- [x] Feature: Add Nunjuck support in MJML attributes
- [x] Feature: Clean up path handling (abstract into it's own class)
- [x] Improve documentation

- [ ] Re-integrate Nodemailer support
- [ ] Fix websocket live reloading in dev mode
- [ ] Feature: Add global config files (environment settings, defaults)
- [ ] Feature: Start base theme repo (project-level)
- [ ] Add unit tests