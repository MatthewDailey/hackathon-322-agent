import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { readFileSync } from 'fs'

/**
 * Analyzes a graph image for anomalous behavior using Claude
 * @param imagePath Path to the image file to analyze
 * @returns Promise with the analysis results
 */
export async function examineGraphForAnomalies(imagePath: string) {
  // Read and encode image as base64
  const imageBuffer = readFileSync(imagePath)
  const base64Image = imageBuffer.toString('base64')

  const { text } = await generateText({
    model: anthropic('claude-3-5-sonnet-latest'),
    messages: [
      {
        role: 'user',
        content: `Please analyze this graph for any anomalous patterns or unusual behavior. 
The image is a graph showing data over time. Please identify and describe any:
- Unexpected spikes or drops
- Unusual trends
- Outliers
- Pattern breaks
- Any other anomalies that stand out

Please be specific about where in the graph you see these anomalies and what makes them notable.`,
      },
      {
        role: 'user',
        content: base64Image,
      },
    ],
  })

  return text
}
