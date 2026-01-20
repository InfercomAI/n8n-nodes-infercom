# n8n-nodes-infercom

This is an n8n community node for [Infercom](https://www.infercom.ai) - an EU-sovereign AI inference platform powered by SambaNova technology.

Infercom provides high-performance AI inference with full EU data sovereignty. All infrastructure is hosted in EU datacenters, ensuring your data never leaves EU jurisdiction. The API is fully OpenAI-compatible, making it easy to integrate into existing workflows while meeting GDPR and European regulatory requirements.

This node enables n8n users to leverage powerful open-source AI models like Llama, DeepSeek, and Mistral for chat completions, with plans to expand to embeddings, audio transcription, and more. Whether you're building customer support automation, content generation pipelines, or intelligent data processing workflows, Infercom delivers enterprise-grade AI inference with the sovereignty guarantees European businesses need.

## Features

- **EU Data Sovereignty**: Your data stays within EU jurisdiction (hosted in EU)
- **GDPR Compliant**: Built for European regulatory requirements
- **High Performance**: Powered by SambaNova's dataflow architecture
- **OpenAI-Compatible**: Drop-in replacement for OpenAI workflows

## Supported Operations

### Chat Completions
Send messages to AI models and receive intelligent responses. Supports:
- Multiple open-source AI models (e.g., Llama, DeepSeek)
- System, user, and assistant message roles
- Configurable parameters (temperature, max_tokens, top_p, etc.)

### Response Data
The node returns the full API response, including:
- `choices[0].message.content` - The AI's response text
- `model` - The model used
- `usage.prompt_tokens` / `usage.completion_tokens` - Token counts for cost tracking
- `usage.time_to_first_token` - Latency until first token (typically <100ms)
- `usage.completion_tokens_per_sec` - Token generation throughput
- `usage.total_latency` - Total response time

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

## Example Workflows

Example workflows are available in the [examples](./examples) folder:

- [basic-chat-workflow.json](./examples/basic-chat-workflow.json) - Simple chat completion with system and user messages

To use an example:
1. Download the JSON file
2. In n8n, go to **Workflows** > **Import from File**
3. Select the downloaded file
4. Update the credentials to use your Infercom API key
5. Select a model from the dropdown

## Resources

- [Infercom Documentation](https://docs.infercom.ai)
- [Infercom Website](https://www.infercom.ai)
- [Infercom Cloud Dashboard](https://cloud.infercom.ai)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT License - see [LICENSE.md](LICENSE.md)
