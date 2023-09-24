import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {RolePd} from '@prisma/client';
import {MessageCollector, type Client} from 'gampang';

export const registerGroupCommand = (bot: Client) => {
	bot.command('register-group', async ctx => {
		const pd = await prisma.pesertaDidik.findFirst({where: {ponsel: toZeroEightNumber(ctx.authorNumber)}, include: {kelas: true}});
		if (pd && (pd.role === RolePd.ADMINISTRATOR || pd.role === RolePd.OPERATOR_KELAS)) {
			let {kelas} = pd;
			if (pd.role === RolePd.ADMINISTRATOR) {
				const kelasInput = ctx.args.at(0);
				if (!kelasInput?.length) {
					await ctx.reply('Mohon masukan kelas:');
					const m = new MessageCollector(ctx, {
						max: 1,
						time: 10_000,
						async validation(ctx) {
							const kelasOut = await prisma.kelas.findFirst({where: {kelas: ctx.text.trim().toUpperCase()}});
							if (!kelasOut) {
								await ctx.reply('Kelas tidak terdaftar, coba ulangi kembali');
							}

							if (kelasOut) {
								kelas = kelasOut;
							}

							return Boolean(kelasOut);
						},
					});

					m.start();
					await m.wait();
					if (!m.contexts.length) {
						await ctx.reply('Ups, waktu menginput kelas sudah habis. Coba dilain waktu ya!');
						return;
					}
				}
			}

			const changeResult = await prisma.kelas.update({
				where: {
					id: kelas.id,
				},
				data: {
					whatsappGroupJid: ctx.getCurrentJid(),
				},
			});

			await ctx.syncGroup();
			const group = ctx.getGroup();
			await ctx.reply(`Grup ${group?.name} untuk kelas *${kelas.kelas}* telah ter-registrasi dengan chat id ${changeResult.whatsappGroupJid} oleh ${pd.nama}`);
		}
	}, {
		groupOnly: true,
	});
};
