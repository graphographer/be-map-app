import { TAgency } from '../../types/TAgency';
import { TAgencyShortDTO } from '../../types/TAgencyShort';

export function agencyShortToLong(name: TAgencyShortDTO): TAgency {
	switch (name) {
		case 'USAID':
			return 'USAID';
		case 'MCC':
			return 'Millenium Challenge Corporation';
		case 'Peace Corps':
			return 'The Peace Corps';
		case 'USDA':
			return 'U.S. Department of Agriculture';
		case 'DOL':
			return 'U.S. Department of Labor';
		case 'DOS':
			return 'U.S. Department of State';
		default:
			throw new Error(`Agency name ${name} does not exist`);
	}
}
