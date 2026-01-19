import { config } from '@n8n/node-cli/eslint';

export default [
	{
		ignores: ['test/**', 'coverage/**', 'vitest.config.ts'],
	},
	...config,
];
