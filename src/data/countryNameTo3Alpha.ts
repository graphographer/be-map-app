import country3Alphas from './country_3alpha.json';

export const threeAlphasToName = Object.entries(country3Alphas).reduce(
	(acc, [name, code]) => {
		if (acc.has(code)) {
			acc.get(code)!.push(name);
		} else {
			acc.set(code, [name]);
		}
		return acc;
	},
	new Map<string, string[]>()
);

export const nameToThreeAlphas = new Map<string, string>(
	Object.entries(country3Alphas).map(([name, code]) => [name, code])
);
