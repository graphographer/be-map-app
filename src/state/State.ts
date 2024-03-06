import { HighlightableMap } from 'highlightable-map';
import { groupBy, mapKeys, mapValues } from 'lodash';
import { makeAutoObservable, observable } from 'mobx';
import { nameToThreeAlphas } from '../data/countryNameTo3Alpha';
import { EEducationLevel } from '../types/EEducationLevel';
import { TAgency } from '../types/TAgency';
import { TAgencyActivity } from '../types/TAgencyActivity';
import { TAgencyPresence } from '../types/TAgencyPresence';
import { TDisbursementByAgency } from '../types/TDisbursementByAgency';
import { TLearningOutcome } from '../types/TLearningOutcome';

export class State {
	constructor() {
		makeAutoObservable(this, { data: false, filter: observable.ref });
	}
	data: {
		agency_presence: TAgencyPresence[];
		disbursement_by_agency: TDisbursementByAgency[];
		agency_activity: TAgencyActivity[];
		learning_outcomes: TLearningOutcome[];
	} = {} as State['data'];

	highlightableMap!: HighlightableMap;

	filter: {
		educationLevel?: EEducationLevel;
		agency?: TAgency;
	} = {
		agency: undefined,
		educationLevel: undefined
	};

	get agenciesInCountry(): { [k: string]: TAgency[] } {
		return this.data.agency_presence.reduce((acc, presence) => {
			const { Country, Agency, 'Agency Support': support } = presence;

			if (!support) return acc;

			const country3Alpha = nameToThreeAlphas.get(Country) || '';

			if (!acc[country3Alpha]) {
				acc[country3Alpha] = [];
			}

			acc[country3Alpha].push(Agency);

			return acc;
		}, {} as { [k: string]: TAgency[] });
	}

	get numberOfAgencies() {
		return mapValues(this.agenciesInCountry, 'length');
	}

	get countries() {
		return Object.keys(this.agenciesInCountry);
	}

	get activitesByCountry(): { [k: string]: TAgencyActivity[] } {
		return mapKeys(
			groupBy(this.data.agency_activity, 'Country'),
			(_val, key) => {
				return nameToThreeAlphas.get(key);
			}
		);
	}

	get filteredCountries() {
		const { educationLevel, agency } = this.filter;

		if (!educationLevel && !agency) return this.countries;

		let filtered = [...Object.entries(this.activitesByCountry)];

		if (educationLevel) {
			filtered = filtered.filter(([, activities]) => {
				return activities.find(activity =>
					activity.educationLevels.includes(educationLevel)
				);
			});
		}
		if (agency) {
			filtered = filtered.filter(([, activities]) => {
				return activities.find(activity => activity.Agency === agency);
			});
		}

		return filtered.map(([country]) => country);
	}

	selectedCountry: string = 'MOZ';

	setCountry(country: string) {
		this.selectedCountry = country;
	}
	setFilter(filter: Partial<State['filter']>) {
		this.filter = { ...this.filter, ...filter };
	}
}
