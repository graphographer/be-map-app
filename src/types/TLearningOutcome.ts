export type TLearningOutcome = {
	Country: string;
	'Grade Level Measured': '2' | '3' | '6' | 'Age 10-15' | '2 & 4';
	'Overlay #': number;
	Subject: string;
	'Baseline Year': number;
	outcomes: [number, number][];
};
