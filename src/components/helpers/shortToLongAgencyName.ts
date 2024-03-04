import { TAgency } from '../../types/TAgency';

export function shortToLongAgencyName(shortName: string): TAgency {
	switch (shortName) {
		case 'USAID':
			return 'USAID';
		case 'MCC':
			return 'Millenium Challenge Corporation';
		case 'Peace Corps':
			return 'Peace Corps';
		case 'USDA':
			return 'U.S. Department of Agriculture';
		case 'DOL':
			return 'U.S. Department of Labor';
		case 'DOS':
			return 'U.S. Department of State';
		default:
			throw new Error(`Short agency name ${shortName} does not exist`);
	}
}
