import {type PesertaDidikDapodik} from '@/Typings/dapodik';
import {dapodikRest} from '@/dapodik';

export const retrievePdDapodik = async () => {
	const response = await dapodikRest.get<{
		rows: PesertaDidikDapodik[];
	}>('./getPesertaDidik');

	return response.data.rows;
};
