import { describe, it, expect } from 'vitest';
import { InfercomApi } from '../credentials/InfercomApi.credentials';

describe('InfercomApi Credentials', () => {
	const credentials = new InfercomApi();

	describe('Credential Configuration', () => {
		it('should have correct name', () => {
			expect(credentials.name).toBe('infercomApi');
		});

		it('should have correct display name', () => {
			expect(credentials.displayName).toBe('Infercom API');
		});

		it('should have documentation URL pointing to Infercom docs', () => {
			expect(credentials.documentationUrl).toBe('https://docs.infercom.ai');
		});

		it('should have icon configuration for light and dark modes', () => {
			expect(credentials.icon).toEqual({
				light: 'file:../icons/infercom.svg',
				dark: 'file:../icons/infercom.dark.svg',
			});
		});
	});

	describe('API Key Property', () => {
		it('should have API key property', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp).toBeDefined();
		});

		it('should mark API key as required', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp?.required).toBe(true);
		});

		it('should mask API key as password', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp?.typeOptions?.password).toBe(true);
		});

		it('should have helpful description with link', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp?.description).toContain('cloud.infercom.ai');
		});

		it('should have hint for users', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp?.hint).toBeDefined();
			expect(apiKeyProp?.hint).toContain('cloud.infercom.ai');
		});
	});

	describe('Authentication', () => {
		it('should use Bearer token authentication', () => {
			expect(credentials.authenticate.type).toBe('generic');
			expect(credentials.authenticate.properties.headers?.Authorization).toContain('Bearer');
		});

		it('should reference apiKey credential in Authorization header', () => {
			expect(credentials.authenticate.properties.headers?.Authorization).toContain('$credentials?.apiKey');
		});
	});

	describe('Credential Test', () => {
		it('should test against Infercom API', () => {
			expect(credentials.test.request.baseURL).toBe('https://api.infercom.ai');
		});

		it('should use /v1/models endpoint for testing', () => {
			expect(credentials.test.request.url).toBe('/v1/models');
		});

		it('should use GET method for testing', () => {
			expect(credentials.test.request.method).toBe('GET');
		});
	});
});
