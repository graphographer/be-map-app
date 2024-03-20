import dsv from '@rollup/plugin-dsv';
import { nameToThreeAlphas } from '../countryNameTo3Alpha';

export const learningOutcomesProcessor = dsv({
	include: 'src/data/learning_outcomes.csv',
	processRow(_row) {
		const row = { ..._row } as any;

		const outcomes: [number, number][] = [];
		row.outcomes = outcomes;

		for (const key in row) {
			switch (key) {
				case 'Country':
					row[key] = nameToThreeAlphas.get(row[key]) || '';
					break;
				case 'Baseline Year':
					const year = parseInt(_row[key]);
					if (!Number.isNaN(year)) {
						row[key] = year;
					}
					break;
				case 'Grade Level Measured':
				case 'Subject':
					row[key] = row[key].trim();
					break;
			}

			if (key.startsWith('FY')) {
				const year = parseInt(key.replace('FY', '20'));
				const outcome = parseInt(row[key]);
				outcomes.push([year, outcome]);
				delete row[key];
			}
		}

		return row;
	}
});
