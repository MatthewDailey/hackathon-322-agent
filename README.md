# Computer Use Starter

A NodeJS demo of the [Anthropic computer use reference implementation](https://docs.anthropic.com/en/docs/agents-and-tools/computer-use) that runs on your Macbook.

## Warning

This should only be used as a demo to play around with computer use on your own machine. 

You would NEVER let a random stranger from the internet on your computer without supervision. Computer use agents are stangers from the internet in the most literal sense.

We're in an amazing age of technology so have fun exploring and be safe out there.

## Dependencies

- [ai-sdk](https://sdk.vercel.ai/) as the AI library.
- [cliclick](https://github.com/BlueM/cliclick) for MacOS keyboard and mouse control.
- [screenshot-desktop](https://www.npmjs.com/package/screenshot-desktop) to take screenshots.

## Setup

1. Install dependencies

   ```bash
   brew install cliclick
   npm install
   ```

2. Configure API key 

   ```bash
   export ANTHROPIC_API_KEY="your-anthropic-api-key"
   ```

## Tools

- `bash` (anthropic reference) - Execute arbitrary shell commands requires approval. 
- `computer` (anthropic reference) - Take screenshots and provide mouse and keyboard input.
- `say` (custom) - Say something out loud. 

## Getting Started

Run your first computer control session:

```bash
npm start "<prompt>"
```

Try some prompts like

- "What's on my screen?"
- "Say something really nice to me"
- "Open a browser, search for 'cute puppies', and save one of the images"

## License

MIT
