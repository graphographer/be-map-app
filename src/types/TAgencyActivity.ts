import { TEducationLevel } from './EEducationLevel';
import { TAgency } from './TAgency';
import { TAgencyShortDTO } from './TAgencyShort';

export type TSheetsBoolean = 'TRUE' | 'FALSE';

export type TAgencyActivityDTO = {
	Agency: TAgencyShortDTO;
	Country: string;
	'Activity Name': string;
	'Start Year': number | string;
	'End Year': number | string;
	Implementer: string;
	Description: string;
	'Link to Website': string;
	Primary: TSheetsBoolean;
	'Pre-Primary': TSheetsBoolean;
	Secondary: TSheetsBoolean;
	'Workforce Development': TSheetsBoolean;
	'Education Systems Strengthening': TSheetsBoolean;
};

export type TAgencyActivity = {
	Agency: TAgency;
	agency_short: string;
	Country: string;
	'Activity Name': string;
	'Start Year': number | string;
	'End Year': number | string;
	Implementer: string;
	Description: string;
	'Link to Website': string;
	educationLevels: TEducationLevel[];
};
