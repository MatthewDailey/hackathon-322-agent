/**
 * @fileoverview Provides the `fetchWebServiceTool` tool, which fetches data from a web service at https://hackathon-322-web.onrender.com/.
 * It accepts a path and query parameters, makes the request, and returns response data containing durationMs and text.
 */

import { tool } from 'ai'
import { z } from 'zod'
import fetch from 'node-fetch'
import { printBox } from './print'

/**
 * Pretty prints the response from the fetchWebService tool
 */
export function prettyPrintToolResponse(toolCall: any, result: any) {
  const url = new URL(`https://hackathon-322-web.onrender.com${toolCall.path}`)
  if (toolCall.queryParams) {
    Object.entries(toolCall.queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value as string)
    })
  }

  let responseText = ''
  if (typeof result === 'string') {
    responseText = `Error: ${result}`
  } else {
    responseText = `Request took ${result.durationMs}ms\n\n`
    if (result.data) {
      responseText += `${JSON.stringify(result.data, null, 2).slice(0, 300)}`
      if (JSON.stringify(result.data).length > 300) responseText += '...(truncated)'
    } else if (result.text) {
      responseText += `${result.text.slice(0, 300)}`
      if (result.text.length > 300) responseText += '...(truncated)'
    }
  }

  printBox(`Fetch Web Service Result`, `URL: ${url.toString()}\n${responseText}`)
}

export const fetchWebServiceTool = tool({
  description:
    'Fetches data from the web service at https://hackathon-322-web.onrender.com/. The homepage is at / and there are two apis: /api/ping and /api/search?query=<string>',
  parameters: z.object({
    path: z.string().describe('The path to fetch from (e.g., "/api/data")'),
    queryParams: z
      .record(z.string())
      .optional()
      .describe('Optional query parameters as key-value pairs'),
  }),
  execute: async ({ path, queryParams = {} }) => {
    const startTime = Date.now()
    try {
      // Construct URL with query parameters
      const url = new URL(`https://hackathon-322-web.onrender.com${path}`)

      // Add query parameters
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })

      // Make the request
      const response = await fetch(url.toString())

      if (!response.ok) {
        return `Error: HTTP ${response.status} - ${response.statusText}`
      }

      const text = await response.text()
      try {
        const data = JSON.parse(text)
        return {
          durationMs: Date.now() - startTime,
          data,
        }
      } catch (error) {
        return {
          durationMs: Date.now() - startTime,
          text,
        }
      }
    } catch (error) {
      return `Error: ${error.message}`
    }
  },
})
