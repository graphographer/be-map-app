// @ts-nocheck

import { defineConfig } from 'vite';
import { agencyActivityProcessor } from './agencyActivityProcessor';
import { agencyPresenceProcessor } from './agencyPresenceProcessor';
import { disbursementByAgencyProcessor } from './disbursementByAgencyProcessor';
import { learningOutcomesProcessor } from './learningOutcomesProcessor';

export default defineConfig({
	plugins: [
		agencyPresenceProcessor,
		agencyActivityProcessor,
		disbursementByAgencyProcessor,
		learningOutcomesProcessor
	]
});
