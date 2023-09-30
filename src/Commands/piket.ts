import {toCapitalCase} from '@/Utilities/toCapitalCase';
import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {type Client} from 'gampang';

export const piketCommand = (client: Client) => {
	client.command('piket', async ctx => {
		const pd = await prisma.pesertaDidik.findFirst({
			where: {
				ponsel: toZeroEightNumber(ctx.authorNumber),
			},
			include: {
				kelas: {
					select: {
						kelas: true,
					},
				},
			},
		});

		if (!pd) {
			await ctx.reply('Nomormu belum terdaftar di Dapodik saat ini, silahkan hubungi Administrator');
			return;
		}

		if (!pd.hariPiket) {
			await ctx.reply(`Kamu kelas *${pd.kelas.kelas}* ya? Sepertinya jadwal piket kelasmu belum diatur, silahkan hubungi perangkat kelas atau ketua kelasmu ya`);
			return;
		}

		await ctx.reply(`Kamu kelas *${pd.kelas.kelas}* dengan nama *${pd.nama}* piket pada hari _${toCapitalCase(pd.hariPiket)}_`);
	});
};
