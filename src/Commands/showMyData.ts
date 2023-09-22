import {prisma} from '@/prisma';
import {type Client} from 'gampang';

export const showMyDataCommand = (bot: Client) => {
	bot.command('me', async ctx => {
		let myPhoneNumber = ctx.authorNumber;
		if (myPhoneNumber.startsWith('62')) {
			myPhoneNumber = myPhoneNumber.replace('62', '0');
		}

		const pd = await prisma.pesertaDidik.findFirst({
			where: {
				ponsel: myPhoneNumber,
			},
			include: {
				kelas: true,
			},
		});
		if (!pd) {
			await ctx.reply('Ups, nomormu saat ini belum terdaftar dengan data periodik di Dapodik');
			return;
		}

		await ctx.reply(`Nama: ${pd.nama}\nKelas: ${pd.kelas.kelas}\nNISN: ${pd.nisn ?? '-'}\nAgama: ${pd.agama}\nJenis kelamin: ${pd.gender}`);
	}, {
		aliases: ['showmydata', 'showmypddata', 'mypd'],
		category: 'general',
		privateOnly: true,
	});
};
