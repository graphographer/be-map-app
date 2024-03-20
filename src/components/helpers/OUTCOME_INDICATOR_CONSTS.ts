import { TLearningOutcome } from '../../types/TLearningOutcome';

export const SUBJECT_POINT_STYLES: Record<string, string> = {
	Reading: 'circle',
	Math: 'triangle',
	'Reading Disability': 'rect'
};

export const LEVEL_POINT_STYLES: Record<string, string> = {
	'2': 'circle',
	'3': 'triangle',
	'6': 'rect',
	'Age 10-15': 'star',
	'2 & 4': 'rectRot'
};

export const LEVEL_COLORS: Record<
	TLearningOutcome['Grade Level Measured'],
	string
> = {
	'2': '#002F6C',
	'3': '#0067B9',
	'6': '#A7C6ED',
	'Age 10-15': '#205493',
	'2 & 4': '#205493'
};

export const SUBJECT_COLORS: Record<string, string> = {
	Reading: '#002F6C',
	Math: '#A7C6ED',
	'Reading Disability': '#205493'
};
