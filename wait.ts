/**
 * @fileoverview Provides the `waitTool` which allows the agent to pause execution for a specified duration.
 * The tool accepts a duration in seconds and returns after that time has passed.
 */

import { tool } from 'ai'
import { z } from 'zod'
import { printBox } from './print'

/**
 * Pretty prints the response from the wait tool
 */
export function prettyPrintToolResponse(toolCall: any, result: any) {
  printBox(`Waited`, `${toolCall.duration} seconds`)
}

export const waitTool = tool({
  description:
    'Pauses execution for the specified duration in seconds. Use this when you need to wait before performing the next action.',
  parameters: z.object({
    duration: z
      .number()
      .positive()
      .describe(
        'The duration to wait in seconds. Maximum allowed value is 300 seconds (5 minutes).',
      ),
  }),
  execute: async ({ duration }) => {
    // Limit maximum wait time to 5 minutes (300 seconds)
    const limitedDuration = Math.min(duration, 300)

    // If user tried to wait longer than the limit, note it in the result
    const wasLimited = duration > limitedDuration

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          duration: limitedDuration,
          message: wasLimited
            ? `Waited for ${limitedDuration} seconds (limited from ${duration} seconds)`
            : `Waited for ${limitedDuration} seconds`,
        })
      }, limitedDuration * 1000)
    })
  },
})
