import {retrievePdDapodik} from '@/Utilities/dapodik';
import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {RolePd} from '@prisma/client';
import {consola} from 'consola';
import {Cron as cron} from 'croner';

export const syncPdJob = cron('0 0 * * *', async () => {
	const pds = await retrievePdDapodik().catch((e: Error) => {
		consola.error('[syncPdJob.retrievePdDapodik]: %s', e.message);
		return undefined;
	});
	if (!pds) {
		consola.error('[syncPdJob]: fail to retrieve peserta didik from Dapodik');
		return;
	}

	const results = await Promise.all(pds.map(async pd => prisma.pesertaDidik.upsert({
		create: {
			id: pd.peserta_didik_id,
			nama: pd.nama?.replace(/\./g, ''),
			nisn: pd.nisn,
			ponsel: pd.nomor_telepon_seluler?.trim().length ? toZeroEightNumber(pd.nomor_telepon_seluler?.trim()) : undefined,
			kelas: {
				connectOrCreate: {
					where: {
						id: pd.rombongan_belajar_id,
					},
					create: {
						id: pd.rombongan_belajar_id,
						kelas: pd.nama_rombel,
					},
				},
			},
			agama: pd.agama_id_str.toLowerCase(),
			role: RolePd.NORMAL,
			gender: pd.jenis_kelamin,
		},
		update: {
			id: pd.peserta_didik_id,
			nama: pd.nama?.replace(/\./g, ''),
			nisn: pd.nisn,
			ponsel: pd.nomor_telepon_seluler,
			kelas: {
				connectOrCreate: {
					where: {
						id: pd.rombongan_belajar_id,
						kelas: pd.nama_rombel,
					},
					create: {
						id: pd.rombongan_belajar_id,
						kelas: pd.nama_rombel,
					},
				},
			},
			agama: pd.agama_id_str.toLowerCase(),
			gender: pd.jenis_kelamin,
			...pd.nomor_telepon_seluler?.trim().replace(/\s+/g, '').length ? {
				ponsel: pd.nomor_telepon_seluler?.trim(),
			} : {},
		},
		where: {
			id: pd.peserta_didik_id,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			OR: [{
				nisn: pd.nisn,
			}],
		},
		include: {
			kelas: true,
		},
	})));

	consola.info('[syncPdJob]: success sync for %d rows data', results.length);
});
