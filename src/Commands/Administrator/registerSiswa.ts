import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {RolePd} from '@prisma/client';
import {type Client} from 'gampang';
import {randomUUID} from 'node:crypto';

export const registerSiswaCommand = (bot: Client) => {
	bot.command('register-siswa', async ctx => {
		const pd = await prisma.pesertaDidik.findFirst({
			where: {
				ponsel: toZeroEightNumber(ctx.authorNumber),

			},
		});

		if (pd && pd.role === RolePd.ADMINISTRATOR && ctx.args.length >= 6) {
			const tempMessage = await ctx.reply('Mohon tunggu!');

			const nisnInput = ctx.args.at(0)!;
			const nama = ctx.args.at(1)!;
			const kelas = ctx.args.at(2)!;
			const agama = ctx.args.at(3)!;
			const ponsel = ctx.args.at(4)!;
			const gender = ctx.args.at(5)!;

			const pd = await prisma.pesertaDidik.findFirst({
				where: {
					nisn: {
						equals: nisnInput,
					},
				},
			});

			if (pd) {
				await tempMessage?.edit('NISN yang kamu masukan telah ter-registrasi dengan peserta didik lain dengan atas nama ' + pd.nama);
				return;
			}

			const kelasOnDb = await prisma.kelas.findFirst({
				where: {
					kelas,
				},
			});

			if (!kelasOnDb) {
				await tempMessage?.edit('Kelas yang kamu masukan tidak tersedia');
				return;
			}

			const phoneAvailableOnWa = await ctx.client.raw?.onWhatsApp(ponsel.concat('@s.whatsapp.net'));
			if (!phoneAvailableOnWa) {
				await tempMessage?.edit('Tidak dapat mengecek ketersediaan nomor ponsel di WhatsApp');
				return;
			}

			const phoneAvailableInfo = phoneAvailableOnWa.find(p => p.jid === ponsel.concat('@s.whatsapp.net'));
			if (!phoneAvailableInfo?.exists) {
				await tempMessage?.edit('Nomor ponsel yang didaftarkan tidak tersedia di WhatsApp');
				return;
			}

			const pdC = await prisma.pesertaDidik.create({
				data: {
					agama,
					ponsel: toZeroEightNumber(ponsel),
					gender,
					nisn: nisnInput,
					id: randomUUID(),
					kelas: {
						connect: {
							id: kelasOnDb.id,
						},
					},
					nama,
				},
				include: {
					kelas: true,
				},
			});

			await tempMessage?.edit(`*${pdC.nama}* telah terdaftar dengan NISN *${pdC.nisn}*`);
		}
	}, {
		aliases: ['registersiswa'],
	});
};
