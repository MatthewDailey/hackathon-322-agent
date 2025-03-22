/**
 * Example script demonstrating the use of the chartTool to generate time series graphs
 */

import { doAi } from './ai'

async function runChartExample() {
  // Example prompt showing how to use the chart tool
  const prompt = `
Generate a line graph showing monthly temperature data.
Use the following data:
- Months: Jan, Feb, Mar, Apr, May, Jun
- Temperatures (°C): 5, 7, 12, 18, 23, 28

The x-axis should be labeled "Month" and the y-axis should be labeled "Temperature (°C)".
Title the chart "Monthly Temperature Trends".
Save the chart to "temperature_chart.png".
`

  try {
    const result = await doAi(prompt)
    console.log('Chart generation completed!')
  } catch (error) {
    console.error('Error running chart example:', error)
  }
}

// Run the example
runChartExample()
