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
    .command('oncall', 'TODO: Implement oncall functionality', () => {
      console.log('oncall command not yet implemented')
    })
    .demandCommand(1, 'Please provide a valid command')
    .help().argv

  return argv
}

main()
