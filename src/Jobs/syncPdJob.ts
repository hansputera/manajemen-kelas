import {retrievePdDapodik} from '@/Utilities/dapodik';
import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {RolePd} from '@prisma/client';
import {consola} from 'consola';
import {Cron as cron} from 'croner';

export const syncPdJob = cron('0 0 * * *', async () => {
	const pds = await retrievePdDapodik().catch(() => undefined);
	if (!pds) {
		consola.error('[syncPdJob]: fail to retrieve peserta didik from Dapodik');
		return;
	}

	const results = await Promise.all(pds.map(async pd => prisma.pesertaDidik.upsert({
		create: {
			id: pd.peserta_didik_id,
			nama: pd.nama,
			nisn: pd.nisn,
			ponsel: pd.nomor_telepon_seluler?.length ? toZeroEightNumber(pd.nomor_telepon_seluler) : undefined,
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
			nama: pd.nama,
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
		},
		where: {
			id: pd.peserta_didik_id,
		},
		include: {
			kelas: true,
		},
	})));

	consola.info('[syncPdJob]: success sync for %d rows data', results.length);
});
