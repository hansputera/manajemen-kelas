import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {processPiketExcelFile} from '@/Utilities/processPiketExcelFile';
import {prisma} from '@/prisma';
import {RolePd} from '@prisma/client';
import {type Client} from 'gampang';
import {writeFile} from 'node:fs/promises';
import * as path from 'node:path';
import prettyBytes from 'pretty-bytes';

export const uploadPiketCommand = (bot: Client) => {
	bot.command('upload-piket', async ctx => {
		const pd = await prisma.pesertaDidik.findFirst({where: {ponsel: toZeroEightNumber(ctx.authorNumber)}, include: {kelas: true}});
		if (pd && pd.role === RolePd.OPERATOR_KELAS) {
			// Prioritize document on message
			const replied = ctx.getReply();

			const document = ctx.document ?? replied?.document;
			const m = await ctx.reply('Mohon tunggu!');

			if (!document || document.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || !document.raw.fileName) {
				await m?.edit('Dokumen tidak ditemukan pada pesan ini ataupun yang direply, dan pastikan format file adalah .xlsx, .xls, atau .csv');
				return;
			}

			const piketFileBuf = await document.retrieveFile('document');
			const processResults = await processPiketExcelFile(piketFileBuf, pd.kelas.kelas);
			if (!processResults) {
				await m?.edit('Proses validasi terhadap file gagal, mohon berikan format file yang valid!');
				return;
			}

			const piketFilePath = path.resolve(__dirname, '..', 'assets', 'pikets', pd.kelas.id.concat('.', document.raw.fileName.split('.').at(-1)!));

			await writeFile(piketFilePath, piketFileBuf);
			await m?.edit(`File piket anda telah terupload dengan ukuran ${prettyBytes(piketFileBuf.byteLength)} serta telah terimport dengan ${processResults.success} data sukses, dan ${processResults.fails} data gagal.\n\nNama-nama siswa yang tidak ditemukan:\n${processResults.notFoundNameList.length ? processResults.notFoundNameList.join('\n') : '-'}\n\nNama siswa yang gagal terimport:\n${processResults.failNameList.length ? processResults.failNameList.join('\n') : '-'}`);
		}
	});
};
