/**
 * @fileoverview Test script to upload a file to the ElevenLabs knowledge base
 * Usage: tsx testKnowledgeBase.ts <filename>
 */

import { uploadLogToKnowledgeBase } from './saveLog'

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.error('Error: Please provide a filename as an argument')
    console.log('Usage: tsx testKnowledgeBase.ts <filename>')
    process.exit(1)
  }

  const filename = args[0]
  console.log(`Uploading ${filename} to knowledge base...`)
  
  try {
    const result = await uploadLogToKnowledgeBase(filename, filename)
    
    if (result.success) {
      console.log('Upload successful!')
      console.log(`Knowledge base ID: ${result.id}`)
    } else {
      console.error('Upload failed:', result.message)
      if (result.error) {
        console.error('Error details:', result.error)
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

main()