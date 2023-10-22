import {NtpTimeSync} from 'ntp-time-sync';
import {readEnvironmentVariables} from './Utilities/env';

export const projectConfig = readEnvironmentVariables<{
	DAPODIK_WEBURL: string;
	DAPODIK_TOKEN: string;
	PORT: number;
	DAPODIK_NPSN: number;
	JWT_SECRET: string;
}>(['DAPODIK_TOKEN', 'DAPODIK_WEBURL', 'PORT', 'DAPODIK_NPSN', 'JWT_SECRET']);

export const timeSync = NtpTimeSync.getInstance({
	servers: [
		'0.id.pool.ntp.org',
		'1.id.pool.ntp.org',
		'2.id.pool.ntp.org',
		'3.id.pool.ntp.org',
		'ntp.bmkg.go.id',
	],
});
