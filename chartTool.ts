/**
 * @fileoverview Provides the `chartTool` which generates and saves time series line graphs.
 * It uses Chart.js and node-canvas to create customizable line charts and save them as image files.
 */

import { tool } from 'ai'
import { z } from 'zod'
import { createCanvas } from 'canvas'
import { Chart, ChartConfiguration, registerables } from 'chart.js'
import fs from 'fs'
import path from 'path'

// Register all Chart.js components
Chart.register(...registerables)

// Create a custom background plugin based on Chart.js documentation
const backgroundPlugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart
    ctx.save()
    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = options.color || 'white'
    ctx.fillRect(0, 0, chart.width, chart.height)
    ctx.restore()
  },
}

export const chartTool = tool({
  description: 'Generates and saves a line graph from time series data',
  parameters: z.object({
    x_data: z
      .array(z.union([z.string(), z.number(), z.date()]))
      .describe('The x-axis data points (typically timestamps)'),
    y_data: z.array(z.number()).describe('The y-axis data points'),
    x_label: z.string().describe('The label for the x-axis'),
    y_label: z.string().describe('The label for the y-axis'),
    title: z.string().optional().describe('The title of the chart'),
    output_path: z
      .string()
      .optional()
      .describe('The file path to save the chart (defaults to chart.png in current directory)'),
    line_color: z
      .string()
      .optional()
      .describe('The color of the line (CSS color string, defaults to blue)'),
    background_color: z
      .string()
      .optional()
      .describe('The background color of the chart (CSS color string, defaults to white)'),
  }),
  execute: async ({
    x_data,
    y_data,
    x_label,
    y_label,
    title = 'Time Series Chart',
    output_path = 'chart.png',
    line_color = 'rgb(75, 192, 192)',
    background_color = 'white',
  }) => {
    try {
      // Validate input data
      if (x_data.length !== y_data.length) {
        return `Error: x_data and y_data must have the same length. Got x_data.length=${x_data.length} and y_data.length=${y_data.length}`
      }

      if (x_data.length === 0) {
        return 'Error: Input data arrays cannot be empty'
      }

      // Create a canvas for the chart
      const width = 800
      const height = 500
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d')

      // Create the chart configuration
      const chartConfig: ChartConfiguration = {
        type: 'line',
        data: {
          labels: x_data.map((x) => x.toString()),
          datasets: [
            {
              label: title,
              data: y_data,
              borderColor: line_color,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderWidth: 2,
              tension: 0.1,
              pointRadius: 3,
            },
          ],
        },
        options: {
          responsive: false,
          scales: {
            x: {
              title: {
                display: true,
                text: x_label,
              },
            },
            y: {
              title: {
                display: true,
                text: y_label,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: title,
              font: {
                size: 18,
              },
            },
            legend: {
              display: true,
              position: 'top',
            },
            // Using a type assertion to avoid TypeScript error
            // for the custom plugin option
            // @ts-ignore
            customCanvasBackgroundColor: {
              color: background_color,
            },
          },
        },
        plugins: [backgroundPlugin],
      }

      // Create the chart on the canvas
      new Chart(ctx as any, chartConfig)

      // Save the chart to a file
      const resolvedPath = path.resolve(output_path)
      const buffer = canvas.toBuffer('image/png')
      fs.writeFileSync(resolvedPath, buffer)

      return {
        success: true,
        message: `Chart saved to ${resolvedPath}`,
        path: resolvedPath,
      }
    } catch (error) {
      return {
        success: false,
        message: `Error creating chart: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  },
})
