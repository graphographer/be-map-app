import { threeAlphasToName } from '../../data/countryNameTo3Alpha';

const commaSwitcher = new RegExp(/^(.*), (.*)$/g);

export function countryNameFormatter(countryCode: string) {
	const [country] = threeAlphasToName.get(countryCode) || [''];

	return country.match(commaSwitcher)
		? country.replace(commaSwitcher, '$2 $1')
		: country;
}
