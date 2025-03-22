/**
 * @fileoverview Provides the `doAi` function, which uses the AI SDK to generate text based on a prompt and a set of tools (computer, bash, say). It leverages `generateText` and the `anthropic` model to orchestrate the AI interaction, including tool calls and step-by-step output.
 */

import { anthropic } from '@ai-sdk/anthropic'
import { generateText, ToolCall } from 'ai'
import { getComputerTool } from './computer'
import { sayTool } from './say'
import { shellTool } from './shell'
import { fetchWebServiceTool } from './fetchWebService'
import { chartTool } from './chartTool'
import { printBox } from './print'

// Track token usage over time
const tokenUsageWindow = {
  tokens: 0,
  startTime: Date.now(),
  reset() {
    this.tokens = 0
    this.startTime = Date.now()
  },
}

// Token rate limit constants
const TOKEN_LIMIT_PER_MINUTE = 80000
const RATE_LIMIT_WINDOW_MS = 60000 // 1 minute

export async function doAi(prompt: string) {
  let stepCount = 0
  let cumulativeTokens = 0

  const { text } = await generateText({
    model: anthropic('claude-3-5-sonnet-latest'),
    prompt: prompt,
    tools: {
      // computer: await getComputerTool(),
      bash: shellTool,
      say: sayTool,
      fetchWebService: fetchWebServiceTool,
      chart: chartTool,
    },
    onStepFinish: async (result) => {
      stepCount++

      // Track token usage
      const currentStepTokens = result.usage?.promptTokens || 0
      cumulativeTokens += currentStepTokens
      tokenUsageWindow.tokens += currentStepTokens

      // Check if we're approaching rate limits
      const elapsedTime = Date.now() - tokenUsageWindow.startTime
      const projectedTokensPerMinute =
        (tokenUsageWindow.tokens / elapsedTime) * RATE_LIMIT_WINDOW_MS

      printBox(
        `Agent (step=${stepCount}, tokens=${currentStepTokens}, cumulative=${cumulativeTokens})`,
        result.text,
      )

      if (result.toolCalls && result.toolCalls.length > 0) {
        printBox(
          `Tool calls (step=${stepCount})`,
          JSON.stringify(
            result.toolCalls.map((toolCall) => ({
              name: toolCall.toolName,
              args: toolCall.args,
              result: getResultStringForToolCall(toolCall, result),
            })),
            null,
            2,
          ),
        )
      }

      // If we're approaching the rate limit, pause execution temporarily
      if (projectedTokensPerMinute > TOKEN_LIMIT_PER_MINUTE * 0.8) {
        console.log(
          `Approaching token rate limit (${projectedTokensPerMinute.toFixed(0)} tokens/min). Pausing execution...`,
        )
        const timeToWaitMs = calculateTimeToWait(tokenUsageWindow.tokens, elapsedTime)
        if (timeToWaitMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, timeToWaitMs))
          console.log(`Resumed execution after ${(timeToWaitMs / 1000).toFixed(1)}s pause`)
        }
      }

      // Reset window if it's been more than a minute
      if (elapsedTime > RATE_LIMIT_WINDOW_MS) {
        tokenUsageWindow.reset()
      }
    },
    maxSteps: 20,
  })

  return { text, totalTokens: cumulativeTokens }
}

function getResultStringForToolCall(toolCall: ToolCall<string, any>, result: any) {
  const r = result.toolResults.find((r) => r.toolCallId === toolCall.toolCallId)?.result
  if (typeof r === 'string') {
    return r.slice(0, 100)
  }
  return JSON.stringify(r, null, 2).slice(0, 100)
}

// Calculate how long to wait based on current token usage rate
function calculateTimeToWait(tokens: number, elapsedMs: number): number {
  if (elapsedMs < 1000) return 1000 // Minimum wait of 1 second if we have very little data

  const tokensPerMs = tokens / elapsedMs
  const msToReachLimit = TOKEN_LIMIT_PER_MINUTE / tokensPerMs

  // If we're projected to hit the limit before the minute is up,
  // wait long enough to get back under 80% of the limit
  if (msToReachLimit < RATE_LIMIT_WINDOW_MS) {
    return Math.max(0, RATE_LIMIT_WINDOW_MS - elapsedMs)
  }

  return 0 // No need to wait
}
