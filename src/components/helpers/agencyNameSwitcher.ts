export function agencyNameSwitcher(name: string): string {
	switch (name) {
		case 'USAID':
			return 'USAID';
		case 'MCC':
			return 'Millenium Challenge Corporation';
		case 'Millenium Challenge Corporation':
			return 'MCC';
		case 'PC':
			return 'The Peace Corps';
		case 'The Peace Corps':
			return 'PC';
		case 'Peace Corps':
			return 'PC';
		case 'USDA':
			return 'U.S. Department of Agriculture';
		case 'U.S. Department of Agriculture':
			return 'USDA';
		case 'DOL':
			return 'U.S. Department of Labor';
		case 'U.S. Department of Labor':
			return 'USDA';
		case 'DOS':
			return 'U.S. Department of State';
		case 'U.S. Department of State':
			return 'DOS';
		default:
			throw new Error(`Agency name ${name} does not exist`);
	}
}
