import {conclusionPiketJob} from '@/Jobs/conclusionPiketJob';
import {piketReminderJob} from '@/Jobs/piketReminderJob';
import {syncPdJob} from '@/Jobs/syncPdJob';
import { syncProofPhotoHash } from '@/Jobs/syncProofPhotoHash';
import {consola} from 'consola';

async function bootJobs() {
	consola.warn('Booting jobs');
	await syncPdJob.trigger();
	await syncProofPhotoHash.trigger();

	consola.info('SyncPdJob status: %s', syncPdJob.isRunning() ? 'running' : 'nonactive');
	consola.info('ConclusionPiketJob status: %s', conclusionPiketJob.isRunning() ? 'running' : 'nonactive');
	consola.info('PiketReminderJob status: %s', piketReminderJob.isRunning() ? 'running' : 'nonactive');
	consola.info('SyncProofPhotoHash status: %s', syncProofPhotoHash.isRunning() ? 'running' : 'nonactive');
}

void bootJobs();

