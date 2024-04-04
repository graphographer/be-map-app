import { ECountry } from './ECountry';
import { TAgency } from './TAgency';

export type TAgencyPresence = {
	Agency: TAgency;
	Country: ECountry;
	'Agency Support': number;
	'Number of Supporting Agencies': number;
	// 'Coordination Possible': number;
	'Pre-Primary': number;
	Primary: number;
	Secondary: number;
	'Workforce Development': number;
	'Education Systems Strengthening': number;
	'Education Level Not Specified': boolean;
};
