import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {RolePd} from '@prisma/client';
import {type Client} from 'gampang';

export const showMyDataCommand = (bot: Client) => {
	bot.command('me', async ctx => {
		const m = await ctx.reply('Mohon tunggu!');
		let pd = await prisma.pesertaDidik.findFirst({where: {ponsel: toZeroEightNumber(ctx.authorNumber)}, include: {kelas: true}});

		if (!pd) {
			await m?.edit('Ups, nomormu saat ini belum terdaftar dengan data periodik di Dapodik');
			return;
		}

		if (pd.role === RolePd.ADMINISTRATOR) {
			const asPd = ctx.getOption('asPd');
			if (asPd.length) {
				pd = await prisma.pesertaDidik.findFirst({
					where: {
						nisn: asPd.at(0),
					},
					include: {
						kelas: true,
					},
				});
				if (!pd) {
					await ctx.reply('Tidak dapat menemukan peserta didik dengan NISN tersebut');
					return;
				}
			}
		}

		await m?.edit(`Data terbaru pada ${pd.updatedAt.toLocaleDateString('id-ID', {
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
