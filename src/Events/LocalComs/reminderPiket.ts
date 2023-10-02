import {getGreetCondition} from '@/Utilities/getGreetCondition';
import {getReminderMessage} from '@/Utilities/getReminderMessage';
import {toCapitalCase} from '@/Utilities/toCapitalCase';
import {type Client} from 'gampang';

export const reminderPiketEvent = async (client: Client, kelas: string, waJid: string, hari: string, anggota: Array<{nama: string}>) => {
	if (waJid) {
		await client.raw?.sendMessage(waJid, {
			text: getReminderMessage('piket', {
				class: kelas,
				greet: getGreetCondition(),
				day: hari,
				members: anggota.map((m, i) => `${i + 1}. ${m.nama}`).join('\n'),
			})!,
			contextInfo: {
				isForwarded: true,
				externalAdReply: {
					thumbnailUrl: 'https://raw.githubusercontent.com/smantriplw/assets_git/main/logo%20biasa.png',
					title: `Reminder Piket ${toCapitalCase(hari)} ${kelas}`,
					body: `Waktu: ${new Date().toLocaleDateString('id-ID', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}`,
				},
			},
		});
		await client.raw?.sendMessage(waJid, {
			text: getReminderMessage('piket_addition', {})!,
		});
	}
};
