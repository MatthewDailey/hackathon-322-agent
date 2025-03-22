/**
 * @fileoverview Provides the `saveLogTool` which allows the agent to save log data to a file with a timestamp in the filename.
 * The tool takes content and an optional prefix for the filename, then writes the data to disk.
 */

import { tool } from 'ai'
import fs from 'fs/promises'
import { z } from 'zod'
import { printBox } from './print'

/**
 * Pretty prints the response from the saveLog tool
 */
export function prettyPrintToolResponse(toolCall: any, result: any) {
  if (result.success) {
    printBox(`Save Log Result`, result.filename)
  } else {
    printBox(`Save Log Error`, `Failed to save log: ${result.message}\n${result.error || ''}`)
  }
}

export const saveLogTool = tool({
  description:
    'Saves content to a log file with a timestamp in the filename. This should only be used to save a final log after all tasks have been completed.',
  parameters: z.object({
    content: z.string().describe('The content to save to the log file. This should be markdown.'),
    prefix: z
      .string()
      .optional()
      .describe('Optional prefix for the log filename (default: "notes")'),
  }),
  execute: async ({ content, prefix = 'notes' }) => {
    try {
      // Create timestamp with format YYYY-MM-DD_HH-MM-SS
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .split('.')[0]

      const filename = `${prefix}_${timestamp}.md`

      await fs.writeFile(filename, content)
      return {
        success: true,
        filename,
        message: `Log successfully saved to ${filename}`,
      }
    } catch (error) {
      console.error('Error saving log:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to save log file',
      }
    }
  },
})
