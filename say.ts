import { tool } from 'ai'
import { z } from 'zod'
import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

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
