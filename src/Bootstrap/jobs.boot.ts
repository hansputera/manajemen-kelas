import {conclusionPiketJob} from '@/Jobs/conclusionPiketJob';
import {syncPdJob} from '@/Jobs/syncPdJob';
import {consola} from 'consola';

async function bootJobs() {
	consola.warn('Booting jobs');
	await syncPdJob.trigger();

	consola.info('SyncPdJob status: %s', syncPdJob.isRunning() ? 'running' : 'nonactive');
	consola.info('ConclusionPiketJob status: %s', conclusionPiketJob.isRunning() ? 'running' : 'nonactive');
}

void bootJobs();

