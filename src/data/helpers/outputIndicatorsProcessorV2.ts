import dsv from '@rollup/plugin-dsv';
import { nameToThreeAlphas } from '../countryNameTo3Alpha';

export enum EOutputHeaders {
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Pre-Primary:Males' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Pre-Primary:Males',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Pre-Primary:Females' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Pre-Primary:Females',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Pre-Primary:Individuals with Disabilities' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Pre-Primary:Individuals with Disabilities',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Pre-Primary:Individuals at Risk' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Pre-Primary:Individuals at Risk',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Pre-Primary:Total' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Pre-Primary:Total',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Primary and Secondary:Males' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Primary and Secondary:Males',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Primary and Secondary:Females' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Primary and Secondary:Females',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Primary and Secondary:Individuals with Disabilities' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Primary and Secondary:Individuals with Disabilities',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Primary and Secondary:Individuals at Risk' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Primary and Secondary:Individuals at Risk',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Primary and Secondary:Total' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Primary and Secondary:Total',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Tertiary, Vocational, and Other Workforce:Males' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Tertiary, Vocational, and Other Workforce:Males',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Tertiary, Vocational, and Other Workforce:Females' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Tertiary, Vocational, and Other Workforce:Females',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Tertiary, Vocational, and Other Workforce:Individuals with Disabilities' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Tertiary, Vocational, and Other Workforce:Individuals with Disabilities',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Tertiary, Vocational, and Other Workforce:Individuals at Risk' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Tertiary, Vocational, and Other Workforce:Individuals at Risk',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Tertiary, Vocational, and Other Workforce:Total' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Tertiary, Vocational, and Other Workforce:Total',
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Total - All' = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings:Total - All',
	'Number of children and youth who received health and nutrition services:Males' = 'Number of children and youth who received health and nutrition services:Males',
	'Number of children and youth who received health and nutrition services:Females' = 'Number of children and youth who received health and nutrition services:Females',
	'Number of children and youth who received health and nutrition services:Total' = 'Number of children and youth who received health and nutrition services:Total',
	'Number of schools that received U.S. Government assistance' = 'Number of schools that received U.S. Government assistance',
	'Number of teachers/educators who received training/professional development:Males' = 'Number of teachers/educators who received training/professional development:Males',
	'Number of teachers/educators who received training/professional development:Females' = 'Number of teachers/educators who received training/professional development:Females',
	'Number of teachers/educators who received training/professional development:Trained in Special Education' = 'Number of teachers/educators who received training/professional development:Trained in Special Education',
	'Number of teachers/educators who received training/professional development:Total' = 'Number of teachers/educators who received training/professional development:Total',
	'Number of educational facilities (school, classrooms, libraries, labs, latrines) built or repaired' = 'Number of educational facilities (school, classrooms, libraries, labs, latrines) built or repaired',
	'Number of textbooks and other teaching and learning materials provided' = 'Number of textbooks and other teaching and learning materials provided',
	'Number of learners with increased access to education' = 'Number of learners with increased access to education',
	'Number of individuals with new employment' = 'Number of individuals with new employment',
	'Number of individuals supported by WFD programming with improved soft skills' = 'Number of individuals supported by WFD programming with improved soft skills'
}

const headers = Object.keys(EOutputHeaders);

export const outputIndicatorsProcessorV2 = dsv({
	include: 'src/data/output_indicators_v2.csv',
	processRow(_row) {
		const row = { ..._row } as any;

		const outputIndicators: any = {};
		row.outputIndicators = outputIndicators;

		headers.forEach(header => {
			outputIndicators[header] = parseInt(row[header].replace(/\,/g, '')) || 0;
			delete row[header];
		});

		row.Country = nameToThreeAlphas.get(row.Country);

		return row;
	}
});

// type Header = Array<string | Header>;

// const DATA_STRUCTURE: Header = [
// 	'Country',
// 	[
// 		'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings',
// 		[
// 			'Pre-Primary',
// 			'Males',
// 			'Females',
// 			'Individuals with Disabilities',
// 			'Individuals at Risk',
// 			'Total'
// 		],
// 		[
// 			'Primary and Secondary',
// 			'Males',
// 			'Females',
// 			'Individuals with Disabilities',
// 			'Individuals at Risk',
// 			'Total'
// 		],
// 		[
// 			'Tertiary, Vocational, and Other Workforce',
// 			'Males',
// 			'Females',
// 			'Individuals with Disabilities',
// 			'Individuals at Risk',
// 			'Total'
// 		],
// 		'Total - All'
// 	],
// 	[
// 		'Number of children and youth who received health and nutrition services',
// 		'Males',
// 		'Females',
// 		'Total'
// 	],
// 	'Number of schools that received U.S. Government assistance',
// 	[
// 		'Number of teachers/educators who received training/professional development',
// 		'Males',
// 		'Females',
// 		'Trained in Special Education',
// 		'Total'
// 	],
// 	'Number of educational facilities (school, classrooms, libraries, labs, latrines) built or repaired',
// 	'Number of textbooks and other teaching and learning materials provided',
// 	'Number of learners with increased access to education',
// 	'Number of individuals with new employment',
// 	'Number of individuals supported by WFD programming with improved soft skills',
// 	'Empty row?'
// ];

// function combineHeaders(val: Header | string): string | string[] {
// 	if (typeof val === 'string') {
// 		return val;
// 	}

// 	const [parent, ...children] = val;

// 	// if (typeof parent === 'string') {
// 	return children.flatMap(combineHeaders).map(child => `${parent}:${child}`);
// 	// }
// }

// function createHeaders(dataStructure: Header): string[] {
// 	return dataStructure.flatMap(combineHeaders);
// }

// console.log(createHeaders(DATA_STRUCTURE));

// console.log(HEADERS.map(header => `"${header}"`).join(','));
