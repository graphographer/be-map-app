import dsv from '@rollup/plugin-dsv';
import { nameToThreeAlphas } from '../countryNameTo3Alpha';

const EXCLUDE = [
	'Number of parent-teacher associations (PTAs) or community-based school governance structures engaged in primary or secondary education supported with USG assistance',
	'Number of family and community members who received training or services to support school attendance and student learning',
	'Number of new or reformed public-sector laws, policies, regulations and/or administrative procedures that support increased access and/or learning adopted ',
	'Number of education administrators and officials who complete professional development activities'
];

export const outputIndicatorsProcessor = dsv({
	include: 'src/data/output_indicators.csv',
	processRow(_row) {
		const row = { ..._row } as any;
		const indicators = [];

		EXCLUDE.forEach(key => {
			delete row[key];
		});

		for (const key in row) {
			if (key === 'Country') {
				row.Country = nameToThreeAlphas.get(row.Country) || row.Country;
				continue;
			}

			const number = parseInt(row[key].replace(/\,/g, ''));
			const value = Number.isNaN(number) ? 0 : number;

			indicators.push({ title: key, value });
			delete row[key];
		}

		row.indicators = indicators;

		return row;
	}
});
