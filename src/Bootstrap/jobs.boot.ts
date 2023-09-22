import {syncPdJob} from '@/Jobs/syncPdJob';
import {consola} from 'consola';

async function bootJobs() {
	consola.warn('Booting jobs');
	await syncPdJob.trigger();
}

void bootJobs();

