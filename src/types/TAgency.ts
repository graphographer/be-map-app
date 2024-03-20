export type TAgency =
	| 'USAID'
	| 'Millenium Challenge Corporation'
	| 'The Peace Corps'
	| 'Peace Corps'
	| 'U.S. Department of Agriculture'
	| 'U.S. Department of Labor'
	| 'U.S. Department of State'
	| 'Department of State'
	| 'U.S. Agency for International Development';

export const AGENCIES_LONG: TAgency[] = [
	'Millenium Challenge Corporation',
	'The Peace Corps',
	// 'USAID',
	'U.S. Department of Agriculture',
	'U.S. Department of Labor',
	'U.S. Department of State',
	'U.S. Agency for International Development'
];

export const AGENCIES_LONG_TO_SHORT = {
	USAID: 'USAID',
	'U.S. Agency for International Development': 'USAID',
	'Millenium Challenge Corporation': 'MCC',
	'Peace Corps': 'PC',
	'The Peace Corps': 'PC',
	'U.S. Department of Agriculture': 'USDA',
	'U.S. Department of Labor': 'DOL',
	'U.S. Department of State': 'DOS',
	'Department of State': 'DOS'
};
