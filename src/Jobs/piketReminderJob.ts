import {localComs} from '@/coms';
import {prisma} from '@/prisma';
import {Cron as cron} from 'croner';

export const piketReminderJob = cron('0 6 * * *', async () => {
	const currentDate = new Date();
	const currDay = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'][
		currentDate.getDay() - 1
	];

	const nowdayPikets = await prisma.jadwalPiket.findMany({
		where: {
			hari: currDay,
		},
		include: {
			kelas: true,
			anggota: {
				select: {
					nama: true,
				},
			},
		},
	});

	if (nowdayPikets.length) {
		nowdayPikets.forEach(piket => localComs.emit('reminderPiket', piket.kelas.kelas, piket.kelas.whatsappGroupJid, piket.hari, piket.anggota));
	}
});
