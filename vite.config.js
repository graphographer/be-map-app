// @ts-nocheck

import { defineConfig } from 'vite';
import { agencyActivityProcessor } from './src/data/helpers/agencyActivityProcessor';
import { agencyPresenceProcessor } from './src/data/helpers/agencyPresenceProcessor';
import { disbursementByAgencyProcessor } from './src/data/helpers/disbursementByAgencyProcessor';
import { learningOutcomesProcessor } from './src/data/helpers/learningOutcomesProcessor';
import { outputIndicatorsProcessor } from './src/data/helpers/outputIndicatorsProcessor';

export default defineConfig({
	base: '',
	plugins: [
		agencyPresenceProcessor,
		agencyActivityProcessor,
		disbursementByAgencyProcessor,
		learningOutcomesProcessor,
		outputIndicatorsProcessor
	]
});
