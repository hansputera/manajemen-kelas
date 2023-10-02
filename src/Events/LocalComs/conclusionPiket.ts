import {type GroupedData} from '@/Jobs/conclusionPiketJob';
import {prisma} from '@/prisma';
import {type Client} from 'gampang';

export const conclusionPiketEvent = async (client: Client, group: GroupedData) => {
	if (group.waJid) {
		const tidakBertugas = await prisma.pesertaDidik.findMany({
			where: {
				nama: {
					notIn: group.members,
				},
				kelas: {
					kelas: group.kelas,
				},
				hariPiket: group.hari,
			},
		});
		const membersText = group.members.map((m, i) => `${i + 1}. ${m}`).join('\n');
		const tidakBertugasText = tidakBertugas.map((m, i) => `${i + 1}. ${m.nama}`).join('\n');
		await client.raw?.sendMessage(group.waJid, {
			text: `Laporan bertugas piket hari ini kelas *${group.kelas}*:\n\n${membersText}\n\n*Tidak bertugas (denda: Rp.${group.denda * tidakBertugas.length}):*\n${tidakBertugasText}`,
			contextInfo: {
				isForwarded: true,
				externalAdReply: {
					title: `LPK ${group.kelas}`,
					body: `Waktu: ${new Date().toLocaleDateString('id-ID', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}`,
					thumbnailUrl: 'https://raw.githubusercontent.com/smantriplw/assets_git/main/logo%20biasa.png',
				},
			},
		});
	}
};
