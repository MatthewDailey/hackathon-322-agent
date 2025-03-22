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
    .command('oncall', 'Start oncall response process', (yargs) => {
      return yargs.option('runbook', {
        alias: 'r',
        describe: 'Path to the runbook file',
        type: 'string',
        demandOption: true
      })
    }, async (argv) => {
      console.log(`Starting oncall process with runbook: ${argv.runbook}`)
      // TODO: Implement actual oncall functionality
    })
    .demandCommand(1, 'Please provide a valid command')
    .help().argv

  return argv
}

main()
