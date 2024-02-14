import {compareTodayDate} from '@/Utilities/compareTodayDate';
import {toCapitalCase} from '@/Utilities/toCapitalCase';
import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {writeFile} from 'fs/promises';
import {type Context} from 'gampang';
import jimp from 'jimp';
import path from 'path';

const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

export const handleLaporPiket = async (ctx: Context, laporPiketRegex: RegExp) => {
	const piketProofImage = ctx.image ?? ctx.getReply()?.image;

	if (!piketProofImage) {
		return;
	}

	const reportPdName = ctx.text.trim().match(laporPiketRegex)?.at(1);
	const currDay = days[new Date().getDay() - 1];

	if (currDay === 'sabtu' || currDay === 'minggu') {
		return;
	}

	const pd = await prisma.pesertaDidik.findFirst({
		where: {
			ponsel: toZeroEightNumber(ctx.authorNumber),
		},
		include: {
			kelas: true,
			kehadiranPiket: true,
		},
	});

	if (!pd?.kelas.whatsappGroupJid) {
		return;
	}

	if (reportPdName) {
		const reportPd = await prisma.pesertaDidik.findFirst({
			where: {
				nama: {
					contains: reportPdName.trim().toLowerCase(),
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

		if (reportPd.hariPiket !== currDay) {
			await ctx.reply(`*${reportPd.nama}* piket dihari ${toCapitalCase(reportPd.hariPiket!)}, bukan hari ini ya`);
			return;
		}

		const kehadiranToday = reportPd.kehadiranPiket.filter(x => compareTodayDate(x.waktu));
		if (kehadiranToday.length) {
			await ctx.reply(`*${reportPd.nama}* sudah melaporkan piketnya hari ini, laporan piket berikutnya untuk hari ini tidak diperlukan lagi`);
			return;
		}

		const bufReportPhoto = await piketProofImage.retrieveFile('image');
		const jimpImage = await jimp.read(bufReportPhoto);

		const similarImages = (await prisma.kehadiranPiket.findMany({
			where: {
				rombel: pd.rombel,
				proofPhotoHash: {
					not: null,
				},
			},
			select: {
				proofPhotoHash: true,
			},
		})).filter(x => jimpImage.distanceFromHash(x.proofPhotoHash ?? '') < 0.15);
		
		if (similarImages.length) {
			await ctx.reply(`Gambar ini tidak diterima karena memiliki kesamaan yang hampir sama dengan ${similarImages.length} gambar lainnya yang pernah dikirim, dimohon mengirim gambar yang berbeda ya, upayakan foto dengan angle berbeda`);
			return;
		}

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
		const kehadiranToday = pd.kehadiranPiket.filter(x => compareTodayDate(x.waktu));
		if (kehadiranToday.length) {
			await ctx.reply('Kamu udah melaporkan piket pada hari ini ya, terimakasih :)');
			return;
		}

		if (pd.hariPiket !== currDay) {
			await ctx.reply('Kamu tidak piket hari ini seharusnya, mungkin kamu ingin mengirim laporan piket temanmu? Karena kamu tuh piket di hari ' + toCapitalCase(pd.hariPiket!));
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
};
