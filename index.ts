import { doAi } from './ai'

async function main() {
  const prompt = process.argv[2]
  if (!prompt) {
    console.error('Please provide a prompt as a command line argument')
    process.exit(1)
  }

  try {
    await doAi(prompt)
  } catch (error) {
    console.error('Error running computer actions:', error)
  }
}

main()
