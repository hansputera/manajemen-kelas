import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {type Client} from 'gampang';

export const showMyDataCommand = (bot: Client) => {
	bot.command('me', async ctx => {
		const pd = await prisma.pesertaDidik.findFirst({where: {ponsel: toZeroEightNumber(ctx.authorNumber)}, include: {kelas: true}});

		if (!pd) {
			await ctx.reply('Ups, nomormu saat ini belum terdaftar dengan data periodik di Dapodik');
			return;
		}

		await ctx.reply(`Data terbaru pada ${pd.updatedAt.toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}).replace(/\./g, ':')} WITA\n\nID: *${pd.id.split('-').at(0)}*\nNama: ${pd.nama}\nKelas: ${pd.kelas.kelas}\nNISN: ${pd.nisn ?? '-'}\nAgama: ${pd.agama}\nJenis kelamin: ${pd.gender}`);
	}, {
		aliases: ['showmydata', 'showmypddata', 'mypd'],
		category: 'general',
		privateOnly: true,
	});
};
