import type { INodeProperties } from 'n8n-workflow';
import { chatCompletionCreateDescription } from './create';

const showOnlyForChat = {
	resource: ['chat'],
};

export const chatCompletionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForChat,
		},
		options: [
			{
				name: 'Complete',
				value: 'complete',
				action: 'Send a chat completion request',
				description: 'Send messages to an AI model and get a response',
				routing: {
					request: {
						method: 'POST',
						url: '/chat/completions',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'choices',
								},
							},
						],
					},
				},
			},
		],
		default: 'complete',
	},
	...chatCompletionCreateDescription,
];
