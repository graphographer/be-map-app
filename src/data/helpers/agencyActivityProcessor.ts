import dsv from '@rollup/plugin-dsv';
import { omit, pick } from 'lodash-es';
import { EDUCATION_LEVELS, TEducationLevel } from '../../types/EEducationLevel';
import {
	TAgencyActivity,
	TAgencyActivityDTO
} from '../../types/TAgencyActivity';
import { agencyShortToLong } from './agencyNameSwitcher';
import { nameToThreeAlphas } from '../countryNameTo3Alpha';

export const agencyActivityProcessor = dsv({
	include: 'src/data/agency_activity.csv',
	processRow(_row) {
		const dto = { ..._row } as unknown as TAgencyActivityDTO;
		const row = { ..._row } as unknown as TAgencyActivity;

		row.Agency = agencyShortToLong(dto.Agency);
		row.Country = nameToThreeAlphas.get(row.Country) || row.Country;

		const educationLevels: TEducationLevel[] = Object.entries(
			pick(dto, EDUCATION_LEVELS)
		)
			.filter(([_level, val]) => {
				return val === 'TRUE';
			})
			.map(([level]) => level as TEducationLevel);

		row.educationLevels = educationLevels;
		return omit(row, ...EDUCATION_LEVELS);
	}
});
