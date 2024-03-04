import { ECountry } from './ECountry';
import { TAgencyShort } from './TAgencyShort';

export type TAgencyActivity = {
	Agency: TAgencyShort;
	Country: ECountry;
	'Activity Name': string;
	'Start Year': number;
	'End Year': number;
	Implementer: string;
	Description: string;
	'Link to Website': string;
	'Pre-Primary': boolean;
	Primary: boolean;
	Secondary: boolean;
	'Workforce Development': boolean;
	'Education Systems Strengthening': boolean;
};
