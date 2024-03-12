export type TAgencyShortDTO =
	| 'USAID'
	| 'Peace Corps'
	| 'DOS'
	| 'USDA'
	| 'MCC'
	| 'DOL';

export const AGENCIES_SHORT = ['USAID', 'MCC', 'PC', 'USDA', 'DOL', 'DOS'];

export const AGENCIES_SHORT_TO_LONG = {
	USAID: 'USAID',
	MCC: 'Millenium Challenge Corporation',
	PC: 'The Peace Corps',
	USDA: 'U.S. Department of Agriculture',
	DOL: 'U.S. Department of Labor',
	DOS: 'U.S. Department of State'
};
