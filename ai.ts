/**
 * @fileoverview Provides the `doAi` function, which uses the AI SDK to generate text based on a prompt and a set of tools (computer, bash, say). It leverages `generateText` and the `anthropic` model to orchestrate the AI interaction, including tool calls and step-by-step output.
 */

import { anthropic } from '@ai-sdk/anthropic'
import { generateText, ToolCall } from 'ai'
import { getComputerTool } from './computer'
import { sayTool } from './say'
import { shellTool } from './shell'
import { fetchWebServiceTool } from './fetchWebService'
import { printBox } from './print'

export async function doAi(prompt: string) {
  let stepCount = 0
  const { text } = await generateText({
    model: anthropic('claude-3-5-sonnet-latest'),
    prompt: prompt,
    tools: {
      // computer: await getComputerTool(),
      bash: shellTool,
      // say: sayTool,
      fetchWebService: fetchWebServiceTool,
    },
    onStepFinish: (result) => {
      stepCount++
      printBox(`Agent (step=${stepCount})`, result.text)
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
    },
    maxSteps: 20,
  })

  return { text }
}

function getResultStringForToolCall(toolCall: ToolCall<string, any>, result: any) {
  const r = result.toolResults.find((r) => r.toolCallId === toolCall.toolCallId)?.result
  if (typeof r === 'string') {
    return r.slice(0, 100)
  }
  return JSON.stringify(r, null, 2).slice(0, 100)
}
