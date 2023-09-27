import {prisma} from '@/prisma';
import xlsx from 'node-xlsx';

export const processPiketExcelFile = async (excelFile: string | Buffer, kelas: string) => {
	const file = xlsx.parse(excelFile, {
		sheets: kelas,
	});
	const payloads: string[][] | undefined = file.at(0)?.data.filter(d => d.length === 3);
	if (!payloads) {
		return undefined;
	}

	const headers = payloads.at(0)?.map(x => x.toLowerCase());
	if (headers?.at(0) !== 'no' || headers?.at(1) !== 'nama' || typeof headers.at(2) !== 'string') {
		return undefined;
	}

	const names = payloads.slice(3).map(n => n[1]);
	const siswa = await prisma.$transaction(
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		names.map(n => prisma.pesertaDidik.findFirst({
			where: {
				nama: {
					contains: n,
				},
				kelas: {
					kelas: {
						equals: kelas,
					},
				},
			},
		})),
	);

	const resultsChange = await Promise.allSettled(
		siswa.filter(x => typeof x !== 'undefined' && x).map(async (s, index) => prisma.pesertaDidik.update({
			where: {
				id: s?.id,
			},
			data: {
				piket: {
					connectOrCreate: {
						create: {
							hari: payloads.slice(3)[index][2],
							rombel: s!.rombel,
						},
						where: {
							rombel: s!.rombel,
							hari: payloads.slice(3)[index][2],
						},
					},
				},
			},
			include: {
				piket: true,
			},
		})),
	);

	return {
		success: resultsChange.filter(s => s.status === 'fulfilled').length,
		fails: resultsChange.filter(s => s.status === 'rejected').length,
	};
};
