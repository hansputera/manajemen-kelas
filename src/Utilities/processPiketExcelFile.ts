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

	const names = payloads.slice(1).map(n => n[1]);
	const siswa = await prisma.$transaction(
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		names.map(n => prisma.pesertaDidik.findFirst({
			where: {
				nama: {
					contains: n.replace(/\./g, ''),
				},
				kelas: {
					kelas: {
						contains: kelas,
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

	const notFoundNameListPoses = siswa.map((x, i) => x ? undefined : names[i])
		.filter(n => typeof n !== 'undefined');

	return {
		success: resultsChange.filter(s => s.status === 'fulfilled').length,
		fails: resultsChange.filter(s => s.status === 'rejected').length,
		notFoundNameList: notFoundNameListPoses.map((x, i) => `${i + 1}. ${x}`),
		failNameList: resultsChange.filter(x => x.status === 'rejected').map((_, i) => `${i + 1}. ${siswa[i]?.nama ?? names[i]}`),
	};
};
