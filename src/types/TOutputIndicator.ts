import { isArray } from 'lodash-es';

export type TOutputIndicatorDTO = {
	Country: string;
	'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings': number;
	'Number of children and youth who received health and nutrition services': number;
	'Number of schools that received U.S. Government assistance': number;
	'Number of teachers/educators who received training/professional development': number;
	'Number of educational facilities (school, classrooms, libraries, labs, latrines) built or repaired': number;
	'Number of parent-teacher associations (PTAs) or community-based school governance structures engaged in primary or secondary education supported with USG assistance': number;
	'Number of family and community members who received training or services to support school attendance and student learning,Number of textbooks and other teaching and learning materials provided': number;
	'Number of new or reformed public-sector laws, policies, regulations and/or administrative procedures that support increased access and/or learning adopted': number;
	'Number of education administrators and officials who complete professional development activities,Number of learners with increased access to education,Number of individuals with new employment': number;
};

export type TIndicatorsV1 = { title: string; value: number }[];

enum EIndicatorHeader {
	Intervention = 'Number of individuals (children, youth, and adults) who received education interventions in formal and non-formal settings',
	Health = 'Number of children and youth who received health and nutrition services',
	GovAssitance = 'Number of schools that received U.S. Government assistance',
	ProDev = 'Number of teachers/educators who received training/professional development',
	FacilitiesRepaired = 'Number of educational facilities (school, classrooms, libraries, labs, latrines) built or repaired',
	LearningMaterials = 'Number of textbooks and other teaching and learning materials provided',
	IncreasedAccess = 'Number of learners with increased access to education',
	NewEmployment = 'Number of individuals with new employment',
	SoftSkills = 'Number of individuals supported by WFD programming with improved soft skills'
}

enum EDemographic {
	Males = 'Males',
	Females = 'Females',
	Disabilities = 'Individuals with Disabilities',
	AtRisk = 'Individuals at Risk'
}

enum EIndicatorEducationLevel {
	PrePrimary = 'Pre-Primary',
	PrimarySecondary = 'Primary and Secondary',
	TertiaryVocationOther = 'Tertiary, Vocational, and Other Workforce'
}

enum EIndicatorSectionHeader {
	Reached = 'Learners Reached',
	Inputs = 'Learning Inputs',
	Outcomes = 'Learner Outcomes'
}

export type TIndicatorLayout = [
	[
		[EIndicatorSectionHeader.Reached],
		[
			[[EIndicatorHeader.Intervention], number],
			[[EIndicatorHeader.Health], number],
			[[EIndicatorHeader.GovAssitance], number]
		]
	],
	[
		[EIndicatorSectionHeader.Inputs],
		[
			[[EIndicatorHeader.ProDev], number],
			[[EIndicatorHeader.FacilitiesRepaired], number],
			[[EIndicatorHeader.LearningMaterials], number]
		]
	],
	[
		[EIndicatorSectionHeader.Outcomes],
		[
			[[EIndicatorHeader.IncreasedAccess], number],
			[[EIndicatorHeader.NewEmployment], number],
			[[EIndicatorHeader.SoftSkills], number]
		]
	]
];

export type TOutputIndicatorLayout = [
	string,
	(
		| (string | TOutputIndicatorLayout | TOutputIndicatorLayout[])[]
		| (string | TOutputIndicatorLayout | TOutputIndicatorLayout[])
	)
];

export const INDICATOR_LAYOUT: TOutputIndicatorLayout[] = [
	[
		EIndicatorSectionHeader.Reached,
		[
			EIndicatorHeader.Intervention,
			[
				[
					EIndicatorEducationLevel.PrePrimary,
					[
						EDemographic.Males,
						EDemographic.Females,
						EDemographic.Disabilities,
						EDemographic.AtRisk,
						'Total'
					]
				],
				[
					EIndicatorEducationLevel.PrimarySecondary,
					[
						EDemographic.Males,
						EDemographic.Females,
						EDemographic.Disabilities,
						EDemographic.AtRisk,
						'Total'
					]
				],
				[
					EIndicatorEducationLevel.TertiaryVocationOther,
					[
						EDemographic.Males,
						EDemographic.Females,
						EDemographic.Disabilities,
						EDemographic.AtRisk,
						'Total'
					]
				],
				'Total - All'
			]
		]
	],
	[
		EIndicatorSectionHeader.Inputs,
		[
			[
				EIndicatorHeader.Health,
				[EDemographic.Males, EDemographic.Females, 'Total']
			],
			EIndicatorHeader.GovAssitance,
			[
				EIndicatorHeader.ProDev,
				[EDemographic.Males, EDemographic.Females, 'Total']
			],
			EIndicatorHeader.FacilitiesRepaired,
			EIndicatorHeader.LearningMaterials
		]
	],
	[
		EIndicatorSectionHeader.Outcomes,
		[
			EIndicatorHeader.IncreasedAccess,
			EIndicatorHeader.NewEmployment,
			EIndicatorHeader.SoftSkills
		]
	]
];

export type TIndicatorsV2 = {
	[EIndicatorHeader.Intervention]: {
		[EIndicatorEducationLevel.PrePrimary]: {
			[EDemographic.Males]: number;
			[EDemographic.Females]: number;
			[EDemographic.Disabilities]: number;
			[EDemographic.AtRisk]: number;
			Total: number;
		};
		[EIndicatorEducationLevel.PrimarySecondary]: {
			[EDemographic.Males]: number;
			[EDemographic.Females]: number;
			[EDemographic.Disabilities]: number;
			[EDemographic.AtRisk]: number;
			Total: number;
		};
		[EIndicatorEducationLevel.TertiaryVocationOther]: {
			[EDemographic.Males]: number;
			[EDemographic.Females]: number;
			[EDemographic.Disabilities]: number;
			[EDemographic.AtRisk]: number;
			Total: number;
		};
		'Total - All': number;
	};
	[EIndicatorHeader.Health]: {
		[EDemographic.Males]: number;
		[EDemographic.Females]: number;
		Total: number;
	};
	[EIndicatorHeader.GovAssitance]: number;
	[EIndicatorHeader.ProDev]: {
		[EDemographic.Males]: number;
		[EDemographic.Females]: number;
		Total: number;
	};
	[EIndicatorHeader.FacilitiesRepaired]: number;
	[EIndicatorHeader.LearningMaterials]: number;
	[EIndicatorHeader.IncreasedAccess]: number;
	[EIndicatorHeader.NewEmployment]: number;
	[EIndicatorHeader.SoftSkills]: number;
};

export type TOutputIndicator = {
	Country: string;
	outputIndicators: { [k: string]: number };
};
