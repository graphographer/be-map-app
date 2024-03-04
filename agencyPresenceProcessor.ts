import dsv from '@rollup/plugin-dsv';

export const agencyPresenceProcessor = dsv({
	include: 'src/data/agency_presence.csv',
	processRow(row: any, id) {
		for (const key in row) {
			const val = row[key];
			if (val === 'TRUE') {
				row[key] = true;
				continue;
			}
			if (val === 'FALSE') {
				row[key] = false;
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
