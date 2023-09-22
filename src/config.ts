import {readEnvironmentVariables} from './Utilities/env';

export const projectConfig = readEnvironmentVariables<{
	DAPODIK_WEBURL: string;
	DAPODIK_TOKEN: string;
	PORT: number;
	DAPODIK_NPSN: number;
	JWT_SECRET: string;
}>(['DAPODIK_TOKEN', 'DAPODIK_WEBURL', 'PORT', 'DAPODIK_NPSN', 'JWT_SECRET']);
