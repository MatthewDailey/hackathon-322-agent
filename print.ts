export function printBox(title: string, text: string) {
  const targetLength = 40
  const minPadding = 4
  const totalPaddingNeeded = Math.max(targetLength - title.length, minPadding * 2)
  const padding = '='.repeat(totalPaddingNeeded / 2)
  const extraEquals = title.length % 2 === 1 ? '=' : ''
  const topBottom = `${padding} ${title} ${padding}${extraEquals}`
  console.log(topBottom)
  console.log(text)
  console.log('='.repeat(topBottom.length))
}
