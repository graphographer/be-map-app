import { computed, observable } from 'mobx';
import { ECountries } from './ECountries';
import { HighlightableMap } from 'highlightable-map';

enum EAgency {
	'USAID',
	'Millenium Challenge Corporation',
	'Peace Corps',
	'U.S. Department of Agriculture',
	'U.S. Department of Labor',
	'U.S. Department of State'
}

export type AgencyPresence = {
	Agency: EAgency;
	Country: ECountries;
	'Agency Support': number;
	'Number of Supporting Agencies': number;
	'Coordination Possible': number;
	'Pre-Primary Education Support': number;
	'Primary Education Support': number;
	'Secondary Education Support': number;
	'WFD Support': number;
	'Systems Strengthening Support': number;
};

export class State {
	@observable data: {
		agency_presence: AgencyPresence[];
	} = {} as State['data'];

	@observable
	highlightableMap!: HighlightableMap;

	@computed
	get numberOfAgencies() {
		return this.data.agency_presence.reduce((acc, row) => {
			const { Country } = row;
			const supportSum = acc[Country];
			const currentSupport = row['Agency Support'];

			if (typeof supportSum !== 'number') {
				acc[Country] = 0;
			}

			if (typeof currentSupport === 'number') {
				acc[Country] += row['Agency Support'];
			}

			return acc;
		}, {} as Record<Partial<ECountries>, number>);
	}
}
