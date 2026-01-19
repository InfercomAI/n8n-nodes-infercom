import { describe, it, expect } from 'vitest';
import { Infercom } from '../nodes/Infercom/Infercom.node';

describe('Infercom Node', () => {
	const node = new Infercom();

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(node.description.displayName).toBe('Infercom');
		});

		it('should have correct internal name', () => {
			expect(node.description.name).toBe('infercom');
		});

		it('should be usable as a tool', () => {
			expect(node.description.usableAsTool).toBe(true);
		});

		it('should require infercomApi credentials', () => {
			expect(node.description.credentials).toEqual([
				{
					name: 'infercomApi',
					required: true,
				},
			]);
		});

		it('should have correct API base URL', () => {
			expect(node.description.requestDefaults?.baseURL).toBe('https://api.infercom.ai/v1');
		});

		it('should have correct headers', () => {
			expect(node.description.requestDefaults?.headers).toEqual({
				Accept: 'application/json',
				'Content-Type': 'application/json',
			});
		});

		it('should have chat resource', () => {
			const resourceProperty = node.description.properties.find((p) => p.name === 'resource');
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.type).toBe('options');

			const options = resourceProperty?.options as Array<{ name: string; value: string }>;
			const chatOption = options?.find((o) => o.value === 'chat');
			expect(chatOption).toBeDefined();
			expect(chatOption?.name).toBe('Chat');
		});
	});

	describe('Chat Completion Properties', () => {
		it('should have model property with dynamic loading', () => {
			const modelProperty = node.description.properties.find((p) => p.name === 'model');
			expect(modelProperty).toBeDefined();
			expect(modelProperty?.required).toBe(true);
			expect(modelProperty?.typeOptions?.loadOptions).toBeDefined();
			expect(modelProperty?.typeOptions?.loadOptions?.routing?.request?.url).toBe('/models');
		});

		it('should have messages property', () => {
			const messagesProperty = node.description.properties.find((p) => p.name === 'messages');
			expect(messagesProperty).toBeDefined();
			expect(messagesProperty?.required).toBe(true);
			expect(messagesProperty?.type).toBe('fixedCollection');
		});

		it('should have messages with role options (system, user, assistant)', () => {
			const messagesProperty = node.description.properties.find((p) => p.name === 'messages');
			const messageValues = (messagesProperty?.options as Array<{ name: string; values: Array<{ name: string; options?: Array<{ value: string }> }> }>)?.[0];
			const roleField = messageValues?.values?.find((v) => v.name === 'role');
			const roleOptions = roleField?.options?.map((o) => o.value);

			expect(roleOptions).toContain('system');
			expect(roleOptions).toContain('user');
			expect(roleOptions).toContain('assistant');
		});

		it('should have options collection with all expected parameters', () => {
			const optionsProperty = node.description.properties.find((p) => p.name === 'options');
			expect(optionsProperty).toBeDefined();
			expect(optionsProperty?.type).toBe('collection');

			const optionNames = (optionsProperty?.options as Array<{ name: string }>)?.map((o) => o.name);
			expect(optionNames).toContain('temperature');
			expect(optionNames).toContain('max_tokens');
			expect(optionNames).toContain('top_p');
			expect(optionNames).toContain('top_k');
			expect(optionNames).toContain('frequency_penalty');
			expect(optionNames).toContain('presence_penalty');
			expect(optionNames).toContain('stop');
			expect(optionNames).toContain('response_format');
			expect(optionNames).toContain('reasoning_effort');
		});
	});

	describe('Parameter Constraints', () => {
		it('should have temperature between 0 and 2', () => {
			const optionsProperty = node.description.properties.find((p) => p.name === 'options');
			const temperatureOption = (optionsProperty?.options as Array<{ name: string; typeOptions?: { minValue: number; maxValue: number } }>)?.find(
				(o) => o.name === 'temperature',
			);

			expect(temperatureOption?.typeOptions?.minValue).toBe(0);
			expect(temperatureOption?.typeOptions?.maxValue).toBe(2);
		});

		it('should have top_p between 0 and 1', () => {
			const optionsProperty = node.description.properties.find((p) => p.name === 'options');
			const topPOption = (optionsProperty?.options as Array<{ name: string; typeOptions?: { minValue: number; maxValue: number } }>)?.find(
				(o) => o.name === 'top_p',
			);

			expect(topPOption?.typeOptions?.minValue).toBe(0);
			expect(topPOption?.typeOptions?.maxValue).toBe(1);
		});

		it('should have frequency_penalty between -2 and 2', () => {
			const optionsProperty = node.description.properties.find((p) => p.name === 'options');
			const freqPenaltyOption = (optionsProperty?.options as Array<{ name: string; typeOptions?: { minValue: number; maxValue: number } }>)?.find(
				(o) => o.name === 'frequency_penalty',
			);

			expect(freqPenaltyOption?.typeOptions?.minValue).toBe(-2);
			expect(freqPenaltyOption?.typeOptions?.maxValue).toBe(2);
		});

		it('should have max_tokens with minimum of 1', () => {
			const optionsProperty = node.description.properties.find((p) => p.name === 'options');
			const maxTokensOption = (optionsProperty?.options as Array<{ name: string; typeOptions?: { minValue: number } }>)?.find(
				(o) => o.name === 'max_tokens',
			);

			expect(maxTokensOption?.typeOptions?.minValue).toBe(1);
		});

		it('should have reasoning_effort with low/medium/high options', () => {
			const optionsProperty = node.description.properties.find((p) => p.name === 'options');
			const reasoningOption = (optionsProperty?.options as Array<{ name: string; options?: Array<{ value: string }> }>)?.find(
				(o) => o.name === 'reasoning_effort',
			);
			const values = reasoningOption?.options?.map((o) => o.value);

			expect(values).toContain('low');
			expect(values).toContain('medium');
			expect(values).toContain('high');
		});

		it('should have response_format with text and json_object options', () => {
			const optionsProperty = node.description.properties.find((p) => p.name === 'options');
			const formatOption = (optionsProperty?.options as Array<{ name: string; options?: Array<{ value: string }> }>)?.find(
				(o) => o.name === 'response_format',
			);
			const values = formatOption?.options?.map((o) => o.value);

			expect(values).toContain('text');
			expect(values).toContain('json_object');
		});
	});
});
