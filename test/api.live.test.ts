import { describe, it, expect, beforeAll } from 'vitest';

const API_KEY = process.env.INFERCOM_API_KEY;
const BASE_URL = 'https://api.infercom.ai/v1';

// Skip these tests if no API key is provided
const describeIfApiKey = API_KEY ? describe : describe.skip;

describeIfApiKey('Infercom API Live Tests', () => {
	beforeAll(() => {
		if (!API_KEY) {
			console.log('Skipping live API tests: INFERCOM_API_KEY not set');
		}
	});

	describe('Models Endpoint', () => {
		it('should fetch available models', async () => {
			const response = await fetch(`${BASE_URL}/models`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
				},
			});

			expect(response.ok).toBe(true);
			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.object).toBe('list');
			expect(data.data).toBeInstanceOf(Array);
			expect(data.data.length).toBeGreaterThan(0);

			// Each model should have required fields
			const firstModel = data.data[0];
			expect(firstModel).toHaveProperty('id');
			expect(firstModel).toHaveProperty('object');
			expect(firstModel.object).toBe('model');
		});

		it('should return models with context_length information', async () => {
			const response = await fetch(`${BASE_URL}/models`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
				},
			});

			const data = await response.json();
			const modelsWithContext = data.data.filter((m: { context_length?: number }) => m.context_length);

			// Most models should have context_length
			expect(modelsWithContext.length).toBeGreaterThan(0);
		});
	});

	describe('Chat Completions Endpoint', () => {
		it('should complete a simple chat request', async () => {
			const response = await fetch(`${BASE_URL}/chat/completions`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'Meta-Llama-3.3-70B-Instruct',
					messages: [
						{ role: 'user', content: 'Say "test successful" and nothing else.' },
					],
					max_tokens: 50,
					temperature: 0,
				}),
			});

			expect(response.ok).toBe(true);
			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data).toHaveProperty('id');
			expect(data).toHaveProperty('choices');
			expect(data.choices).toBeInstanceOf(Array);
			expect(data.choices.length).toBeGreaterThan(0);
			expect(data.choices[0].message).toHaveProperty('content');
			expect(data.choices[0].message.role).toBe('assistant');
		});

		it('should respect system messages', async () => {
			const response = await fetch(`${BASE_URL}/chat/completions`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'Meta-Llama-3.3-70B-Instruct',
					messages: [
						{ role: 'system', content: 'You only respond with the word PONG, nothing else.' },
						{ role: 'user', content: 'PING' },
					],
					max_tokens: 10,
					temperature: 0,
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.choices[0].message.content.toLowerCase()).toContain('pong');
		});

		it('should return usage information', async () => {
			const response = await fetch(`${BASE_URL}/chat/completions`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'Meta-Llama-3.3-70B-Instruct',
					messages: [
						{ role: 'user', content: 'Hi' },
					],
					max_tokens: 10,
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();

			expect(data).toHaveProperty('usage');
			expect(data.usage).toHaveProperty('prompt_tokens');
			expect(data.usage).toHaveProperty('completion_tokens');
			expect(data.usage).toHaveProperty('total_tokens');
			expect(data.usage.prompt_tokens).toBeGreaterThan(0);
		});

		it('should respect max_tokens parameter', async () => {
			const response = await fetch(`${BASE_URL}/chat/completions`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'Meta-Llama-3.3-70B-Instruct',
					messages: [
						{ role: 'user', content: 'Count from 1 to 1000' },
					],
					max_tokens: 20,
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();

			// Should stop early due to max_tokens
			expect(data.usage.completion_tokens).toBeLessThanOrEqual(20);
		});

		it('should support JSON response format', async () => {
			const response = await fetch(`${BASE_URL}/chat/completions`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'Meta-Llama-3.3-70B-Instruct',
					messages: [
						{ role: 'user', content: 'Return a JSON object with a single field "status" set to "ok"' },
					],
					max_tokens: 50,
					temperature: 0,
					response_format: { type: 'json_object' },
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();

			// The content should be valid JSON
			const content = data.choices[0].message.content;
			expect(() => JSON.parse(content)).not.toThrow();

			const parsed = JSON.parse(content);
			expect(parsed.status).toBe('ok');
		});
	});

	describe('Error Handling', () => {
		it('should return 401 for invalid API key on chat completions', async () => {
			const response = await fetch(`${BASE_URL}/chat/completions`, {
				method: 'POST',
				headers: {
					Authorization: 'Bearer invalid-api-key-12345',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'Meta-Llama-3.3-70B-Instruct',
					messages: [{ role: 'user', content: 'Hello' }],
				}),
			});

			expect(response.ok).toBe(false);
			expect(response.status).toBe(401);
		});

		it('should return error for invalid model', async () => {
			const response = await fetch(`${BASE_URL}/chat/completions`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'non-existent-model-xyz',
					messages: [
						{ role: 'user', content: 'Hello' },
					],
				}),
			});

			expect(response.ok).toBe(false);
			// Could be 400 or 404 depending on API implementation
			expect([400, 404]).toContain(response.status);
		});

		it('should return error for missing messages', async () => {
			const response = await fetch(`${BASE_URL}/chat/completions`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'Meta-Llama-3.3-70B-Instruct',
					// Missing messages field
				}),
			});

			expect(response.ok).toBe(false);
			expect(response.status).toBe(400);
		});

		it('should return error for empty messages array', async () => {
			const response = await fetch(`${BASE_URL}/chat/completions`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'Meta-Llama-3.3-70B-Instruct',
					messages: [],
				}),
			});

			expect(response.ok).toBe(false);
			expect(response.status).toBe(400);
		});
	});
});
