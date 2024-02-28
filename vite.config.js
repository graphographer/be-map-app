// @ts-nocheck

import { defineConfig } from 'vite';
import dsv from '@rollup/plugin-dsv';

export default defineConfig({
	plugins: [
		dsv({
			processRow(row, id) {
				for (const key in row) {
					const maybeNumber = parseInt(row[key]);
					if (!Number.isNaN(maybeNumber)) {
						row[key] = maybeNumber;
					}
				}
				return row;
			}
		})
	]
});
