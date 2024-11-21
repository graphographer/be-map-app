// @ts-nocheck

import minifyHTML from 'rollup-plugin-minify-html-literals';
import { defineConfig } from 'vite';
import { agencyActivityProcessor } from './src/data/helpers/agencyActivityProcessor';
import { agencyPresenceProcessor } from './src/data/helpers/agencyPresenceProcessor';
import { disbursementByAgencyProcessor } from './src/data/helpers/disbursementByAgencyProcessor';
import { learningOutcomesProcessor } from './src/data/helpers/learningOutcomesProcessor';
import { outputIndicatorsProcessor } from './src/data/helpers/outputIndicatorsProcessor';
import { outputIndicatorsProcessorV2 } from './src/data/helpers/outputIndicatorsProcessorV2';
import dtsPlugin from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
	base: '',
	plugins: [
		agencyPresenceProcessor,
		agencyActivityProcessor,
		disbursementByAgencyProcessor,
		learningOutcomesProcessor,
		outputIndicatorsProcessor,
		outputIndicatorsProcessorV2,
		dtsPlugin({ include: ['lib'] })
	],
	build: {
		copyPublicDir: false,
		lib: {
			name: 'BeMapApp',
			entry: path.resolve(__dirname, 'lib/BeMapApp.ts'),
			fileName: (format, name) => `${name}.${format}.js`,
			formats: ['es', 'iife', 'umd']
		},
		rollupOptions: {
			plugins: [minifyHTML.default()]
		}
	},
	define: {
		process: {
			env: 'PRODUCTION'
		}
	}
});
