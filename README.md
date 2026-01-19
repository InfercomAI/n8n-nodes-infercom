# n8n-nodes-infercom

This is an n8n community node for [Infercom](https://www.infercom.ai) - an EU-sovereign AI inference platform powered by SambaNova technology.

## Features

- **EU Data Sovereignty**: Your data stays within EU jurisdiction (hosted in EU)
- **GDPR Compliant**: Built for European regulatory requirements
- **High Performance**: Powered by SambaNova's dataflow architecture
- **OpenAI-Compatible**: Drop-in replacement for OpenAI workflows

## Supported Operations

### Chat Completions
Send messages to AI models and receive intelligent responses. Supports:
- Multiple Open Source AI models (e.g. gpt-oss-120b, DeepSeek)
- System, user, and assistant message roles
- Configurable parameters (temperature, max_tokens, top_p, etc.)

## Installation

### In n8n Desktop/Self-hosted

1. Go to **Settings** > **Community Nodes**
2. Click **Install a community node**
3. Enter `n8n-nodes-infercom`
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-infercom
```

## Configuration

1. Get your API key from the [Infercom Cloud](https://cloud.infercom.ai)
2. In n8n, go to **Credentials** > **New Credential**
3. Search for "Infercom API"
4. Enter your API key

## Usage Example

1. Add the **Infercom** node to your workflow
2. Select your credentials
3. Choose a model (e.g., "Llama 3.3 (70B)")
4. Add messages:
   - System message: Define the AI's behavior
   - User message: Your question or prompt
5. Configure options (temperature, max_tokens, etc.)
6. Execute the workflow

## Available Models

Models are **fetched dynamically** from the Infercom API, so you always have access to the latest models. Current models include:

- **Meta-Llama-3.3-70B-Instruct** - Meta's Llama 3.3 70B instruction-tuned model
- **DeepSeek-V3-0324-cb** - DeepSeek V3 model
- **gpt-oss-120b** - Open-source 120B parameter model

Check [docs.infercom.ai](https://docs.infercom.ai) for the current model catalog.

## Resources

- [Infercom Documentation](https://docs.infercom.ai)
- [Infercom Website](https://www.infercom.ai)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT License - see [LICENSE.md](LICENSE.md)
