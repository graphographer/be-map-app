import { ECountry } from './ECountry';
import { TAgency } from './EAgency';

export type TAgencyPresence = {
	Agency: TAgency;
	Country: ECountry;
	'Agency Support': number;
	'Number of Supporting Agencies': number;
	'Coordination Possible': number;
	'Pre-Primary Education Support': number;
	'Primary Education Support': number;
	'Secondary Education Support': number;
	'WFD Support': number;
	'Systems Strengthening Support': number;
};
