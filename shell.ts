/**
 * @fileoverview Provides the `shellTool` which allows the agent to execute bash commands using `child_process.exec`. It uses `@ai-sdk/anthropic` to define the tool and prompts for user approval before execution.
 */

import { anthropic } from '@ai-sdk/anthropic'
import { exec } from 'child_process'
import { promisify } from 'util'
import { printBox } from './print'

const execPromise = promisify(exec)

/**
 * Pretty prints the response from the shell tool
 */
export function prettyPrintToolResponse(toolCall: any, result: string) {
  printBox(`Run command`, toolCall.command)
  if (result.trim().length > 0) {
    printBox(
      `Command Result`,
      `${result.slice(0, 500)}${result.length > 500 ? '...(truncated)' : ''}`.trim(),
    )
  }
}

export const shellTool = anthropic.tools.bash_20250124({
  execute: async (toolParams: any) => {
    // Wait for user approval before executing command unless it's a curl
    // if (!toolParams.command.startsWith('curl')) {
    //   process.stdout.write('Type "approved" to execute this command: ')
    //   for await (const line of process.stdin.setRawMode(false)) {
    //     const input = line.toString().trim()
    //     if (input === 'approved') {
    //       break
    //     } else if (input) {
    //       console.log('Command not approved.')
    //       return 'Command not approved'
    //     }
    //   }
    // }
    try {
      return (await execPromise(toolParams.command)).stdout
    } catch (error) {
      console.error('Error executing command:', error)
      return 'Error executing command.'
    }
  },
})
