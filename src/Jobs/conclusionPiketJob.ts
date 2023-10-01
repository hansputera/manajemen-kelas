import {localComs} from '@/coms';
import {prisma} from '@/prisma';
import {consola} from 'consola';
import {Cron as cron} from 'croner';

export type GroupedData = {
	kelas: string;
	members: string[];
	waJid?: string;
};

export const conclusionPiketJob = cron('0 14 * * *', async () => {
	const currentDate = new Date();

	const kehadiranPiketToday = await prisma.kehadiranPiket.findMany({
		where: {
			waktu: {
				lte: currentDate,
				gte: new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate(),
					5,
					0,
					0,
				),
			},
		},
		include: {
			kelas: true,
			siswa: true,
		},
	});

	if (kehadiranPiketToday.length) {
		consola.info(`Found ${kehadiranPiketToday.length} kehadiranPiket`);

		const groupedKehadiranByClass = kehadiranPiketToday.reduce<GroupedData[]>((result: GroupedData[], a) => {
			const existingGroup = result.find(x => x.kelas === a.kelas.kelas);
			if (existingGroup) {
				existingGroup.members.push(a.siswa.nama);
			} else {
				result.push({kelas: a.kelas.kelas, members: [a.siswa.nama], waJid: a.kelas.whatsappGroupJid ?? undefined});
			}

			return result;
		}, []);

		groupedKehadiranByClass.forEach(group => localComs.emit('conclusionPiket', group));
	}
});
