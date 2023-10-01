import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {writeFile} from 'fs/promises';
import {type Client} from 'gampang';
import path from 'path';

const timeCompareFunc = (compareDate: Date): boolean => {
	const currentDate = new Date();

	return compareDate <= currentDate && compareDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
};

export const incomingMessage = (bot: Client) => {
	bot.on('message', async ctx => {
		const laporPiketRegex = /lapor piket(?:\s)?([a-zA-Z\s]+)?/gi;

		if (ctx.isPM && (laporPiketRegex.test(ctx.text) || ctx.image?.caption)) {
			const piketProofImage = ctx.image ?? ctx.getReply()?.image;

			if (!piketProofImage) {
				return;
			}

			const reportPdName = laporPiketRegex.exec(ctx.text)?.at(1);
			const pd = await prisma.pesertaDidik.findFirst({
				where: {
					ponsel: toZeroEightNumber(ctx.authorNumber),
				},
				include: {
					kelas: true,
					kehadiranPiket: true,
				},
			});

			if (!pd) {
				return;
			}

			if (reportPdName) {
				const reportPd = await prisma.pesertaDidik.findFirst({
					where: {
						nama: {
							contains: reportPdName.trim(),
						},
						kelas: {
							id: pd.rombel,
						},
					},
					include: {
						kehadiranPiket: true,
					},
				});

				if (!reportPd) {
					await ctx.reply(`Nama *${reportPdName}* tidak ditemukan di kelas *${pd.kelas.kelas}*, coba cek lagi deh namanya`);
					return;
				}

				const kehadiranToday = reportPd.kehadiranPiket.filter(x => timeCompareFunc(x.waktu));
				if (kehadiranToday.length) {
					await ctx.reply(`*${reportPd.nama}* sudah melaporkan piketnya hari ini, laporan piket berikutnya untuk hari ini tidak diperlukan lagi`);
					return;
				}

				const bufReportPhoto = await piketProofImage.retrieveFile('image');
				const reportPhotoPath = path.resolve(__dirname, '..', 'assets', 'images', reportPd.id.concat('_', new Date().toISOString(), '.', piketProofImage.mimeType.split('/')[1]));
				await writeFile(reportPhotoPath, bufReportPhoto);

				await prisma.kehadiranPiket.create({
					data: {
						kelas: {
							connect: {
								id: reportPd.rombel,
							},
						},
						siswa: {
							connect: {
								id: reportPd.id,
							},
						},
						messageId: ctx.getReply()?.id ?? ctx.id,
						ponselPelapor: toZeroEightNumber(ctx.authorNumber),
						proofPhoto: reportPhotoPath,
						waktu: new Date(),
					},
					include: {
						kelas: true,
						siswa: true,
					},
				});
				await ctx.reply(`*${reportPd.nama}* udah tercatat piket ya, makasih ^_`);
			} else {
				const kehadiranToday = pd.kehadiranPiket.filter(x => timeCompareFunc(x.waktu));
				if (kehadiranToday.length) {
					await ctx.reply('Kamu udah melaporkan piket pada hari ini ya, terimakasih :)');
					return;
				}

				const bufReportPhoto = await piketProofImage.retrieveFile('image');
				const reportPhotoPath = path.resolve(__dirname, '..', 'assets', 'images', pd.id.concat('_', new Date().toISOString(), '.', piketProofImage.mimeType.split('/')[1]));
				await writeFile(reportPhotoPath, bufReportPhoto);

				await prisma.kehadiranPiket.create({
					data: {
						kelas: {
							connect: {
								id: pd.rombel,
							},
						},
						siswa: {
							connect: {
								id: pd.id,
							},
						},
						messageId: ctx.getReply()?.id ?? ctx.id,
						ponselPelapor: toZeroEightNumber(ctx.authorNumber),
						proofPhoto: reportPhotoPath,
						waktu: new Date(),
					},
					include: {
						kelas: true,
						siswa: true,
					},
				});
				await ctx.reply('Sudah tercatat ya, thank you udah melapor piket');
			}
		}
	});
};
