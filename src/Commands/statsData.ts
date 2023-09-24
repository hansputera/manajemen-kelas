import {prisma} from '@/prisma';
import {type Client} from 'gampang';

export const statsDataCommand = (bot: Client) => {
	bot.command('stats', async ctx => {
		const [jumlahPd, jumlahKelas] = await prisma.$transaction([
			prisma.pesertaDidik.count(),
			prisma.kelas.count(),
		]);

		await ctx.reply(`*Jumlah tarikan data:*\nJumlah Siswa/i terdaftar: ${jumlahPd} siswa/i\nJumlah Kelas: ${jumlahKelas}`);
	});
};
