/**
 * @fileoverview Provides the `sayTool` tool, which uses the macOS `say` command to speak text. It defines the tool's description, input parameters (using Zod), and execution logic. The `sayTool` function takes text as input and returns a success or error message.
 */

import { tool } from 'ai'
import { z } from 'zod'
import { exec } from 'child_process'
import { promisify } from 'util'
import { printBox } from './print'

const execPromise = promisify(exec)

/**
 * Pretty prints the response from the say tool
 */
export function prettyPrintToolResponse(toolCall: any, result: string) {
  console.log(`Spoke: "${toolCall.text}"`)
}

export const sayTool = tool({
  description: 'Speaks the provided text using the macOS say command',
  parameters: z.object({
    text: z.string().describe('The text to be spoken'),
  }),
  execute: async ({ text }) => {
    const command = `say "${text.replace(/"/g, '\\"')}"`
    const { stdout, stderr } = await execPromise(command)
    if (stderr) {
      return `Error: ${stderr}`
    }
    return `Successfully spoke: "${text}"`
  },
})
