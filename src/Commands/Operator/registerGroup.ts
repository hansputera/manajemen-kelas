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
					const message = await ctx.reply('Mohon masukan kelas:');
					const m = new MessageCollector(ctx, {
						max: 1,
						time: 10_000,
						async validation(ctx) {
							const kelasOut = await prisma.kelas.findFirst({where: {kelas: ctx.text.trim().toUpperCase()}});
							if (!kelasOut) {
								await message?.edit('Kelas tidak terdaftar, coba ulangi kembali');
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
						await message?.edit('Ups, waktu menginput kelas sudah habis. Coba dilain waktu ya!');
						return;
					}
				}
			} else if (pd.role === RolePd.OPERATOR_KELAS) {
				if (kelas.whatsappGroupJid?.length) {
					await ctx.reply('Mohon maaf, operator kelas tidak dapat mengubah grup yang telah terdaftar. Silahkan hubungi Administrator untuk mengganti');
					return;
				}

				const confirmMessage = await ctx.reply('Kamu selaku operator kelas hanya berhak mengubah dan meregistrasikan grup ini sekali saja, dan tidak dapat dirubah kembali. Apakah kamu yakin untuk mendaftarkan grup ini untuk kelas *' + kelas.kelas + '* ?\nBalas pesan ini dengan *ya* atau *tidak*');
				const yesOrNoFunc = (input: string) => {
					if (/((i)?y(es|a|o)?)/gi.test(input)) {
						return 'y';
					}

					if (/(n(o(pe)?|ah)?|tidak|ndak|ga|ogah)/gi.test(input)) {
						return 'n';
					}

					return undefined;
				};

				const confirmationCol = new MessageCollector(ctx, {
					max: 1,
					time: 30_000,
					validation(ctx) {
						return Boolean(yesOrNoFunc(ctx.text.trim()));
					},
				});

				confirmationCol.start();
				await confirmationCol.wait();

				if (!confirmationCol.contexts.length) {
					await confirmMessage?.edit('Wah sepertinya waktu konfirmasimu sudah habis, coba lain kali ya');
					return;
				}

				const confirmBool = yesOrNoFunc(confirmationCol.contexts[0].text.trim());
				if (confirmBool === 'n') {
					await confirmMessage?.edit('Konfirmasi telah ditolak');
					return;
				}

				await confirmMessage?.edit(`Anda memilih ${confirmBool}`);
			}

			const changeResult = await prisma.kelas.update({
				where: {
					id: kelas.id,
				},
				data: {
					whatsappGroupJid: ctx.raw.key.remoteJid,
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
