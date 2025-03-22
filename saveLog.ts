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
      await uploadLogToKnowledgeBase(filename, filename)
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
/**
 * Uploads a log file to the ElevenLabs knowledge base
 */
export async function uploadLogToKnowledgeBase(filename: string, name?: string) {
  try {
    const apiKey = process.env.ELEVEN_LABS_API_KEY
    if (!apiKey) {
      throw new Error('ELEVEN_LABS_API_KEY environment variable not set')
    }

    const form = new FormData()
    const fileContent = await fs.readFile(filename)

    if (name) {
      form.append('name', name)
    } else {
      form.append('name', '')
    }

    // Add empty URL as per API format
    form.append('url', '')

    // Add file with proper format
    form.append('file', new Blob([fileContent], { type: 'text/plain' }), filename)

    const response = await fetch('https://api.elevenlabs.io/v1/convai/knowledge-base', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: form,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Failed to upload to knowledge base: ${response.status} ${response.statusText} - ${errorText}`,
      )
    }

    const result = await response.json()
    return {
      success: true,
      id: result.id,
      message: `Log successfully uploaded to knowledge base with ID: ${result.id}`,
    }
  } catch (error) {
    console.error('Error uploading to knowledge base:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'Failed to upload log to knowledge base',
    }
  }
}
