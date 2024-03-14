import dsv from '@rollup/plugin-dsv';
import { nameToThreeAlphas } from '../countryNameTo3Alpha';

export const outputIndicatorsProcessor = dsv({
	include: 'src/data/output_indicators.csv',
	processRow(_row) {
		const row = { ..._row } as any;
		const indicators = [];

		for (const key in row) {
			if (key === 'Country') {
				row.Country = nameToThreeAlphas.get(row.Country) || row.Country;
				continue;
			}

			const number = parseInt(row[key]);
			const value = Number.isNaN(number) ? 0 : number;

			indicators.push({ title: key, value });
			delete row[key];
		}

		row.indicators = indicators;

		return row;
	}
});
