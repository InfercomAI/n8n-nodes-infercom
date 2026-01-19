import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class InfercomApi implements ICredentialType {
	name = 'infercomApi';

	displayName = 'Infercom API';

	icon: Icon = { light: 'file:../icons/infercom.svg', dark: 'file:../icons/infercom.dark.svg' };

	documentationUrl = 'https://docs.infercom.ai';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your Infercom API key for EU-sovereign AI inference. Get your API key from <a href="https://cloud.infercom.ai" target="_blank">infercom.ai</a>.',
			hint: 'Sign up at cloud.infercom.ai to get your API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.infercom.ai',
			url: '/v1/models',
			method: 'GET',
		},
	};
}
