/**
 * @fileoverview Provides the `sayTool` tool, which uses the macOS `say` command to speak text. It defines the tool's description, input parameters (using Zod), and execution logic. The `sayTool` function takes text as input and returns a success or error message.
 */

import { tool } from 'ai'
import { z } from 'zod'
import { exec } from 'child_process'
import { promisify } from 'util'
import { printBox } from './print'
import path from 'path'
import { writeFileSync } from 'fs'

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

export async function sayWithRime(text: string) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'audio/mp3',
      Authorization: `Bearer ${process.env.RIME_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: `{"speaker":"geoff","text":"${text}","modelId":"mistv2","lang": "eng", "samplingRate":22050,"speedAlpha":1.1,"reduceLatency":false}`,
  }

  const response = await fetch('https://users.rime.ai/v1/rime-tts', options)
  const buffer = await response.arrayBuffer()
  writeFileSync('rime.mp3', Buffer.from(buffer))
  await execPromise('afplay rime.mp3')
}
