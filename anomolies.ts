import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFileSync } from 'fs'

/**
 * Analyzes a graph image for anomalous behavior using Google Gemini
 * @param imagePath Path to the image file to analyze
 * @returns Promise with the analysis results
 */
export async function examineGraphForAnomalies(imagePath: string) {
  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set')
  }

  try {
    // Read and encode image as base64
    const imageBuffer = readFileSync(imagePath)
    const imageBase64 = imageBuffer.toString('base64')

    // Initialize the Google Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey)
    const geminiModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash', // Using Gemini's latest model with image capabilities
    })

    // Prepare the prompt and image data
    const promptText = `Please analyze this graph for any anomalous patterns or unusual behavior. 
The image is a graph showing data over time. Please identify and describe any:
- Unexpected spikes or drops
- Unusual trends
- Outliers
- Pattern breaks
- Any other anomalies that stand out

Please be specific about where in the graph you see these anomalies and what makes them notable.`

    // Create parts with prompt and image
    const parts = [
      { text: promptText },
      {
        inlineData: {
          mimeType: 'image/jpeg', // Adjust mime type if needed
          data: imageBase64,
        },
      },
    ]

    // Generate content with image analysis
    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts }],
    })

    return result.response.text()
  } catch (error) {
    console.error('Error analyzing graph:', error)
    throw error
  }
}
