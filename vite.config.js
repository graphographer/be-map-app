// @ts-nocheck

import { defineConfig } from 'vite';
import { agencyActivityProcessor } from './agencyActivityProcessor';
import { agencyPresenceProcessor } from './agencyPresenceProcessor';
import { disbursementByAgencyProcessor } from './disbursementByAgencyProcessor';

export default defineConfig({
	plugins: [
		agencyPresenceProcessor,
		agencyActivityProcessor,
		disbursementByAgencyProcessor
	]
});
