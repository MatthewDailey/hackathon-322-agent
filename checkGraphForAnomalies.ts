/**
 * @fileoverview Provides the `checkGraphForAnomaliesTool` which allows the agent to analyze graph images for anomalous patterns using Claude.
 */

import { tool } from 'ai'
import { z } from 'zod'
import { examineGraphForAnomalies } from './anomolies'
import { printBox } from './print'

/**
 * Pretty prints the response from the graph analysis tool
 */
export function prettyPrintToolResponse(toolCall: any, result: any) {
  printBox(
    `Graph Analysis Result`,
    `Analysis of ${toolCall.imagePath}\n\n${result.slice(0, 500)}${
      result.length > 500 ? '...(truncated)' : ''
    }`,
  )
}

export const checkGraphForAnomaliesTool = tool({
  description:
    'Analyzes a graph image to identify anomalies, unusual patterns, or outliers. Use in combination with the chartTool to generate charts and analyze them for anomalies.',
  parameters: z.object({
    imagePath: z
      .string()
      .describe('The file path to the graph image that should be analyzed for anomalies'),
  }),
  execute: async ({ imagePath }) => {
    try {
      const analysisResult = await examineGraphForAnomalies(imagePath)
      return analysisResult
    } catch (error) {
      return {
        success: false,
        message: `Error analyzing graph: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  },
})
