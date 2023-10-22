import {localComs} from '@/coms';
import {timeSync} from '@/config';
import {prisma} from '@/prisma';
import {Cron as cron} from 'croner';

export const piketReminderJob = cron('0 6 * * *', async () => {
	const currentDate = new Date((await timeSync.getTime()).now);
	const currDay = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'][
		currentDate.getDay() - 1
	];

	if (currDay === 'sabtu' || currDay === 'minggu') {
		return;
	}

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
