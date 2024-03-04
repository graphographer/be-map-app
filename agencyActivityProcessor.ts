import dsv from '@rollup/plugin-dsv';
import { EEducationLevel } from './src/types/EEducationLevel';
import { TAgencyActivity } from './src/types/TAgencyActivity';

export const agencyActivityProcessor = dsv({
	include: 'src/data/agency_activity.csv',
	processRow(_row, id) {
		const row = { ..._row } as unknown as TAgencyActivity;
		const educationLevels: EEducationLevel[] = [];

		for (const key in row) {
			const val = row[key];

			if (key in EEducationLevel) {
				if (row[key] === 'TRUE') {
					educationLevels.push(key as EEducationLevel);
				}
				delete row[key];
			}

			row.educationLevels = educationLevels;
		}
		return row;
	}
});
