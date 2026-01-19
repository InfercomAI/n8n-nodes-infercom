import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChatComplete = {
	operation: ['complete'],
	resource: ['chat'],
};

export const chatCompletionCreateDescription: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForChatComplete,
		},
		default: '',
		description: 'The AI model to use for the completion. Models are fetched dynamically from the Infercom API.',
		typeOptions: {
			loadOptions: {
				routing: {
					request: {
						method: 'GET',
						url: '/models',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
							{
								type: 'setKeyValue',
								properties: {
									name: '={{$responseItem.id}}',
									value: '={{$responseItem.id}}',
									description: '={{$responseItem.context_length ? "Context: " + $responseItem.context_length + " tokens" : ""}}',
								},
							},
							{
								type: 'sort',
								properties: {
									key: 'name',
								},
							},
						],
					},
				},
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'model',
			},
		},
	},
	{
		displayName: 'Messages',
		name: 'messages',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		required: true,
		displayOptions: {
			show: showOnlyForChatComplete,
		},
		default: { messageValues: [{ role: 'user', content: '' }] },
		description: 'The messages to send to the model',
		options: [
			{
				name: 'messageValues',
				displayName: 'Message',
				values: [
					{
						displayName: 'Role',
						name: 'role',
						type: 'options',
						options: [
							{
								name: 'Assistant',
								value: 'assistant',
								description: 'Previous assistant response (for multi-turn conversations)',
							},
							{
								name: 'System',
								value: 'system',
								description: 'Set the behavior and context for the assistant',
							},
							{
								name: 'User',
								value: 'user',
								description: 'The user message or question',
							},
						],
						default: 'user',
					},
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'The content of the message',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'messages',
				value: '={{$value.messageValues}}',
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: showOnlyForChatComplete,
		},
		default: {},
		description: 'Additional options for the completion. Note: Some options may not affect all models. See docs.infercom.ai for model-specific capabilities.',
		// Alphabetically sorted by displayName as required by n8n linter
		options: [
			{
				displayName: 'Frequency Penalty',
				name: 'frequency_penalty',
				type: 'number',
				typeOptions: {
					minValue: -2,
					maxValue: 2,
					numberPrecision: 2,
				},
				default: 0,
				description: 'Penalizes tokens based on their frequency in the text so far. Positive values decrease repetition.',
				routing: {
					send: {
						type: 'body',
						property: 'frequency_penalty',
					},
				},
			},
			{
				displayName: 'Max Tokens',
				name: 'max_tokens',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 4096,
				description: 'Maximum number of tokens to generate. Limited by the model\'s max_completion_tokens.',
				routing: {
					send: {
						type: 'body',
						property: 'max_tokens',
					},
				},
			},
			{
				displayName: 'Presence Penalty',
				name: 'presence_penalty',
				type: 'number',
				typeOptions: {
					minValue: -2,
					maxValue: 2,
					numberPrecision: 2,
				},
				default: 0,
				description: 'Penalizes tokens based on whether they appear in the text so far. Positive values encourage new topics.',
				routing: {
					send: {
						type: 'body',
						property: 'presence_penalty',
					},
				},
			},
			{
				displayName: 'Reasoning Effort',
				name: 'reasoning_effort',
				type: 'options',
				options: [
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Medium',
						value: 'medium',
					},
					{
						name: 'High',
						value: 'high',
					},
				],
				default: 'medium',
				description: 'Controls reasoning depth for supported models (e.g., reasoning models). May not affect all models.',
				routing: {
					send: {
						type: 'body',
						property: 'reasoning_effort',
					},
				},
			},
			{
				displayName: 'Response Format',
				name: 'response_format',
				type: 'options',
				options: [
					{
						name: 'Text',
						value: 'text',
						description: 'Standard text response',
					},
					{
						name: 'JSON Object',
						value: 'json_object',
						description: 'Response will be valid JSON. Prompt must mention JSON.',
					},
				],
				default: 'text',
				description: 'Format of the model\'s response. JSON mode requires mentioning JSON in your prompt.',
				routing: {
					send: {
						type: 'body',
						property: 'response_format',
						value: '={{ { "type": $value } }}',
					},
				},
			},
			{
				displayName: 'Stop Sequences',
				name: 'stop',
				type: 'string',
				default: '',
				description: 'Comma-separated list of sequences where the model will stop generating (max 4)',
				routing: {
					send: {
						type: 'body',
						property: 'stop',
						value: '={{$value ? $value.split(",").map(s => s.trim()).filter(s => s) : undefined}}',
					},
				},
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
					numberPrecision: 2,
				},
				default: 0.7,
				description: 'Controls randomness (0-2). Lower = more focused, higher = more creative. Default: 0.7.',
				routing: {
					send: {
						type: 'body',
						property: 'temperature',
					},
				},
			},
			{
				displayName: 'Top K',
				name: 'top_k',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				description: 'Limits token selection to the K most likely tokens (1-100)',
				routing: {
					send: {
						type: 'body',
						property: 'top_k',
					},
				},
			},
			{
				displayName: 'Top P',
				name: 'top_p',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberPrecision: 2,
				},
				default: 1,
				description: 'Nucleus sampling: considers tokens comprising the top P probability mass (0-1)',
				routing: {
					send: {
						type: 'body',
						property: 'top_p',
					},
				},
			},
		],
	},
];
