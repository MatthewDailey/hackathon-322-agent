/**
 * @fileoverview This file defines the `printBox` function, which formats and prints a title and text within a box of equals signs to the console. It aims to create visually distinct output for improved readability.
 */

export function printBox(title: string, text: string, color?: string) {
  const targetLength = 40
  const minPadding = 4
  const totalPaddingNeeded = Math.max(targetLength - title.length, minPadding * 2)
  const padding = '='.repeat(totalPaddingNeeded / 2)
  const extraEquals = title.length % 2 === 1 ? '=' : ''
  const topBottom = `${padding} ${title} ${padding}${extraEquals}`

  const colorCode = color ? getColorCode(color) : ''
  const resetCode = color ? '\x1b[0m' : ''

  console.log(`${colorCode}${topBottom}${resetCode}`)
  console.log(`${colorCode}${typeof text === 'string' ? text : JSON.stringify(text)}${resetCode}`)
  console.log(`${colorCode}${'='.repeat(topBottom.length)}${resetCode}`)
}

function getColorCode(color: string): string {
  const colors: Record<string, string> = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  }
  return colors[color.toLowerCase()] || ''
}
