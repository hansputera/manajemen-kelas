/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import {projectConfig} from './config';

export const dapodikRest = axios.create({
	baseURL: projectConfig.DAPODIK_WEBURL,
	headers: {
		Authorization: `Bearer ${projectConfig.DAPODIK_TOKEN}`,
	},
	params: {
		npsn: projectConfig.DAPODIK_NPSN,
	},
	timeout: 5000,
});

