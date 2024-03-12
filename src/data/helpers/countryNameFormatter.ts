import { threeAlphasToName } from '../countryNameTo3Alpha';

const commaSwitcher = new RegExp(/^(.*), (.*)$/g);

export function countryNameFormatter(countryCode: string) {
	const [country] = threeAlphasToName.get(countryCode) || [countryCode];

	return country.match(commaSwitcher)
		? country.replace(commaSwitcher, '$2 $1')
		: country;
}
