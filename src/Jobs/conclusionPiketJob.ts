import {localComs} from '@/coms';
import {timeSync} from '@/config';
import {prisma} from '@/prisma';
import {Cron as cron} from 'croner';

export type GroupedData = {
	kelas: string;
	members: string[];
	hari: string;
	denda: number;
	waJid?: string;
};

export const conclusionPiketJob = cron('0 14 * * *', async () => {
	const currentDate = new Date((await timeSync.getTime()).now);
	const currDay = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'][
		currentDate.getDay() - 1
	];

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
		const groupedKehadiranByClass = kehadiranPiketToday.reduce<GroupedData[]>((result: GroupedData[], a) => {
			const existingGroup = result.find(x => x.kelas === a.kelas.kelas);
			if (existingGroup) {
				existingGroup.members.push(a.siswa.nama);
			} else {
				result.push({denda: Number(a.kelas.dendaPiket), hari: currDay, kelas: a.kelas.kelas, members: [a.siswa.nama], waJid: a.kelas.whatsappGroupJid ?? undefined});
			}

			return result;
		}, []);

		groupedKehadiranByClass.forEach(group => localComs.emit('conclusionPiket', group));
	}
});
