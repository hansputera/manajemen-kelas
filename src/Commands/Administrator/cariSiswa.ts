import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {RolePd} from '@prisma/client';
import {type Client} from 'gampang';

export const cariSiswaCommand = (bot: Client) => {
	bot.command('cari-siswa', async ctx => {
		const pd = await prisma.pesertaDidik.findFirst({
			where: {
				ponsel: toZeroEightNumber(ctx.authorNumber),
			},
		});

		if (pd && pd.role === RolePd.ADMINISTRATOR && ctx.args.length) {
			const pdTarget = ctx.args.join(' ');
			const targetPds = await prisma.pesertaDidik.findMany({
				where: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					OR: [{
						nama: {
							contains: pdTarget,
						},
					}, {
						nisn: {
							equals: pdTarget,
						},
					}],
				},
			});

			if (!targetPds.length) {
				await ctx.reply('Tidak dapat menemukan peserta didik satupun');
				return;
			}

			const targetPdText = targetPds.map((t, i) => `${i + 1}. ${t.nama} (${t.nisn})`).join('\n');
			await ctx.reply(`Peserta didik yang ditemukan (${targetPds.length})\n${targetPdText}`);
		}
	}, {
		aliases: ['carisiswa'],
	});
};
