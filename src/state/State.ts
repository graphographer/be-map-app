import { HighlightableMap } from 'highlightable-map';
import { mapValues } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { ECountry } from '../types/ECountry';
import { TAgency } from '../types/TAgency';
import { TAgencyActivity } from '../types/TAgencyActivity';
import { TAgencyPresence } from '../types/TAgencyPresence';
import { TDisbursementByAgency } from '../types/TDisbursementByAgency';

export class State {
	constructor() {
		makeAutoObservable(this);
	}
	data: {
		agency_presence: TAgencyPresence[];
		disbursement_by_agency: TDisbursementByAgency[];
		agency_activity: TAgencyActivity[];
	} = {} as State['data'];

	highlightableMap!: HighlightableMap;

	get agenciesInCountry(): Record<ECountry, TAgency[]> {
		return this.data.agency_presence.reduce((acc, presence) => {
			const { Country, Agency, 'Agency Support': support } = presence;

			if (!support) return acc;

			if (!acc[Country]) {
				acc[Country] = [];
			}

			acc[Country].push(Agency);

			return acc;
		}, {} as Record<ECountry, TAgency[]>);
	}

	get numberOfAgencies() {
		return mapValues(this.agenciesInCountry, 'length');
	}

	get countries() {
		return Object.keys(this.agenciesInCountry);
	}

	selectedCountry: string = '';

	setCountry(country: string) {
		this.selectedCountry = country;
	}
}
