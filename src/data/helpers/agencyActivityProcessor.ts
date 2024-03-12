import dsv from '@rollup/plugin-dsv';
import { pick } from 'lodash-es';
import { EDUCATION_LEVELS, TEducationLevel } from '../../types/EEducationLevel';
import {
	TAgencyActivity,
	TAgencyActivityDTO
} from '../../types/TAgencyActivity';
import { agencyShortToLong } from './agencyNameSwitcher';

export const agencyActivityProcessor = dsv({
	include: 'src/data/agency_activity.csv',
	processRow(_row) {
		const dto = { ..._row } as unknown as TAgencyActivityDTO;
		const row = {} as TAgencyActivity;

		row.Agency = agencyShortToLong(dto.Agency);

		const educationLevels: TEducationLevel[] = Object.entries(
			pick(dto, EDUCATION_LEVELS)
		)
			.filter(([_level, val]) => {
				return val === 'TRUE';
			})
			.map(([level]) => level as TEducationLevel);

		row.educationLevels = educationLevels;
		return row;
	}
});
