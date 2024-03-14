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

export type TOutputIndicator = {
	Country: string;
	indicators: { title: string; value: number }[];
};
