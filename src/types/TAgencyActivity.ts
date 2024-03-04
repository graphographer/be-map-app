import { ECountry } from './ECountry';
import { EEducationLevel } from './EEducationLevel';
import { TAgencyShort } from './TAgencyShort';

export type TAgencyActivity = {
	Agency: TAgencyShort;
	Country: ECountry;
	'Activity Name': string;
	'Start Year': number | string;
	'End Year': number | string;
	Implementer: string;
	Description: string;
	'Link to Website': string;
	educationLevels: EEducationLevel[];
};
