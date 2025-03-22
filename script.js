import { Conversation } from '@11labs/client'

const startButton = document.getElementById('startButton')
const stopButton = document.getElementById('stopButton')
const connectionStatus = document.getElementById('connectionStatus')
const agentStatus = document.getElementById('agentStatus')

let conversation

async function startConversation() {
  try {
    // Request microphone permission
    await navigator.mediaDevices.getUserMedia({ audio: true })

    // Start the conversation
    conversation = await Conversation.startSession({
      agentId: 'oDfiWsgIaTxAXNdQHN2f', // Replace with your agent ID
      onConnect: () => {
        connectionStatus.textContent = 'Connected'
        startButton.disabled = true
        stopButton.disabled = false
      },
      onDisconnect: () => {
        connectionStatus.textContent = 'Disconnected'
        startButton.disabled = false
        stopButton.disabled = true
      },
      onError: (error) => {
        console.error('Error:', error)
      },
      onModeChange: (mode) => {
        agentStatus.textContent = mode.mode === 'speaking' ? 'speaking' : 'listening'
      },
    })
  } catch (error) {
    console.error('Failed to start conversation:', error)
  }
}

async function stopConversation() {
  if (conversation) {
    await conversation.endSession()
    conversation = null
  }
}

startButton.addEventListener('click', startConversation)
stopButton.addEventListener('click', stopConversation)
