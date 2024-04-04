import dsv from '@rollup/plugin-dsv';
import { nameToThreeAlphas } from '../countryNameTo3Alpha';

export const agencyPresenceProcessor = dsv({
	include: 'src/data/agency_presence.csv',
	processRow(row: any) {
		for (const key in row) {
			const val = row[key];

			if (key === 'Agency' && val === 'USAID') {
				row[key] = 'U.S. Agency for International Development';
			}

			if (key === 'Country') {
				row.Country = nameToThreeAlphas.get(val) || row.Country;
			}

			if (val === 'TRUE' || val === 'FALSE') {
				row[key] = val === 'TRUE';
				continue;
			}

			const maybeNumber = parseInt(row[key]);
			if (!Number.isNaN(maybeNumber)) {
				row[key] = maybeNumber;
			}
		}

		return row;
	}
});
