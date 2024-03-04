import dsv from '@rollup/plugin-dsv';
import { EEducationLevel } from './src/types/EEducationLevel';
import { TAgencyActivity } from './src/types/TAgencyActivity';

export const agencyActivityProcessor = dsv({
	include: 'src/data/agency_activity.csv',
	processRow(_row, id) {
		const row = { ..._row } as unknown as TAgencyActivity;
		for (const key in row) {
			const val = row[key];
			if (EEducationLevel[key]) {
				row[key] = val === 'TRUE' ? true : false;
			}
		}
		return row;
	}
});
