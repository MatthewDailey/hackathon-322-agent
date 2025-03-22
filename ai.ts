/**
 * @fileoverview Provides the `doAi` function, which uses the AI SDK to generate text based on a prompt and a set of tools (computer, bash, say). It leverages `generateText` and the `anthropic` model to orchestrate the AI interaction, including tool calls and step-by-step output.
 */

import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { getComputerTool } from './computer'
import { sayTool } from './say'
import { shellTool } from './shell'
import { printBox } from './print'

export async function doAi(prompt: string) {
  let stepCount = 0
  const { text } = await generateText({
    model: anthropic('claude-3-7-sonnet-20250219'),
    prompt: prompt,
    tools: {
      computer: await getComputerTool(),
      bash: shellTool,
      say: sayTool,
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
