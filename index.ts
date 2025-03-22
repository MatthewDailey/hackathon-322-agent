/**
 * @fileoverview This file defines the main entry point for the application, parsing command-line arguments using `yargs` and executing the `doAi` function with a given prompt. It supports the 'prompt' command and a placeholder 'oncall' command.
 */

import { doAi } from './ai'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

async function main() {
  const argv = yargs(hideBin(process.argv))
    .command(
      'prompt <text>',
      'Run AI with the given prompt',
      (yargs) => {
        return yargs.positional('text', {
          describe: 'The prompt text to process',
          type: 'string',
          demandOption: true,
        })
      },
      async (argv) => {
        try {
          await doAi(argv.text)
        } catch (error) {
          console.error('Error running computer actions:', error)
        }
      },
    )
    .command(
      'oncall',
      'Start oncall response process',
      (yargs) => {
        return yargs
          .option('runbook', {
            alias: 'r',
            describe: 'Path to the runbook file',
            type: 'string',
            demandOption: true,
          })
          .option('request', {
            alias: 'q',
            describe: 'Specific oncall request',
            type: 'string',
          })
      },
      async (argv) => {
        try {
          const fs = require('fs')
          const runbookContent = fs.readFileSync(argv.runbook, 'utf8')

          const defaultRequest =
            'You are the oncall engineer. You need to check over the health of the system and fix any issues.'
          const request = argv.request || defaultRequest

          const prompt = `
# Oncall Request
${request}

# Runbook
${runbookContent}

# Current time
${new Date().toISOString()}
Use the tools available to handle this oncall request according to the runbook. 
First understand what needs to be checked, then methodically work through the steps.
`

          await doAi(prompt)
        } catch (error) {
          console.error('Error in oncall process:', error)
        }
      },
    )
    .demandCommand(1, 'Please provide a valid command')
    .help().argv

  return argv
}

main()
