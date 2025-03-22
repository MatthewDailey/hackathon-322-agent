/**
 * @fileoverview Provides the `doAi` function, which uses the AI SDK to generate text based on a prompt and a set of tools (computer, bash, say). It leverages `generateText` and the `anthropic` model to orchestrate the AI interaction, including tool calls and step-by-step output.
 */

import { anthropic } from '@ai-sdk/anthropic'
import { generateText, ToolCall } from 'ai'
import {
  getComputerTool,
  prettyPrintToolResponse as prettyPrintComputerToolResponse,
} from './computer'
import { sayTool, prettyPrintToolResponse as prettyPrintSayToolResponse } from './say'
import { shellTool, prettyPrintToolResponse as prettyPrintShellToolResponse } from './shell'
import {
  fetchWebServiceTool,
  prettyPrintToolResponse as prettyPrintFetchWebServiceToolResponse,
} from './fetchWebService'
import { chartTool, prettyPrintToolResponse as prettyPrintChartToolResponse } from './chartTool'
import { saveLogTool, prettyPrintToolResponse as prettyPrintSaveLogToolResponse } from './saveLog'
import { 
  checkGraphForAnomaliesTool, 
  prettyPrintToolResponse as prettyPrintCheckGraphForAnomaliesToolResponse 
} from './checkGraphForAnomalies'
import { printBox } from './print'

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
      saveLog: saveLogTool,
      checkGraphForAnomalies: checkGraphForAnomaliesTool,
    },
    onStepFinish: async (result) => {
      stepCount++
      if (result.toolCalls && result.toolCalls.length > 0) {
        // Process each tool call with its specific pretty print function
        for (const toolCall of result.toolCalls) {
          const toolResult = result.toolResults.find(
            (r) => r.toolCallId === toolCall.toolCallId,
          )?.result

          if (toolResult !== undefined) {
            // Cast toolCall to any to fix type issues
            const toolCallAny = toolCall as any

            switch (toolCallAny.toolName) {
              case 'bash':
                prettyPrintShellToolResponse(toolCallAny.args, toolResult as string)
                break
              case 'say':
                prettyPrintSayToolResponse(toolCallAny.args, toolResult as string)
                break
              case 'fetchWebService':
                prettyPrintFetchWebServiceToolResponse(toolCallAny.args, toolResult as any)
                break
              case 'chart':
                prettyPrintChartToolResponse(toolCallAny.args, toolResult as any)
                break
              case 'saveLog':
                prettyPrintSaveLogToolResponse(toolCallAny.args, toolResult as any)
                break
              case 'checkGraphForAnomalies':
                prettyPrintCheckGraphForAnomaliesToolResponse(toolCallAny.args, toolResult as any)
                break
              // Case for computer is commented out since the computer tool is not currently being used
              // case 'computer':
              //   prettyPrintComputerToolResponse(toolCallAny.args, toolResult as any)
              //   break
              default:
                // Fallback for any tool without a custom pretty print function
                printBox(
                  `${toolCallAny.toolName} Result`,
                  JSON.stringify(toolResult, null, 2).slice(0, 500) +
                    (JSON.stringify(toolResult).length > 500 ? '...(truncated)' : ''),
                )
            }
          }
        }
      }

      console.log('\x1b[32m%s\x1b[0m', result.text)
    },
    maxSteps: 20,
  })

  return { text, totalTokens: cumulativeTokens }
}
