import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { chatCompletionDescription } from './resources/chat';

export class Infercom implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infercom',
		name: 'infercom',
		icon: 'file:infercom.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'EU-sovereign AI inference powered by SambaNova - OpenAI-compatible API',
		defaults: {
			name: 'Infercom',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'infercomApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.infercom.ai/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat',
						value: 'chat',
						description: 'Chat completions with AI models',
					},
				],
				default: 'chat',
			},
			...chatCompletionDescription,
		],
	};
}
