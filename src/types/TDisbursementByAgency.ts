import { TAgency } from './TAgency';
import { ECountry } from './ECountry';

export type TDisbursementByAgency = {
	Country: ECountry;
	Agency: TAgency;
	Disbursements: [number, number][];
};
