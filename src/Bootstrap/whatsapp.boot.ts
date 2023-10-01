import {cariSiswaCommand} from '@/Commands/Administrator/cariSiswa';
import {piketCommand} from '@/Commands/Normal/piket';
import {registerGroupCommand} from '@/Commands/Operator/registerGroup';
import {setRoleCommand} from '@/Commands/Administrator/setRole';
import {showMyDataCommand} from '@/Commands/Normal/showMyData';
import {statsDataCommand} from '@/Commands/Normal/statsData';
import {uploadPiketCommand} from '@/Commands/Operator/uploadPiket';
import {registerSiswaCommand} from '@/Commands/Administrator/registerSiswa';
import {triggerConclusionJobCommand} from '@/Commands/Administrator/triggerConclusionJob';

import {consola} from 'consola';
import {Client, SessionManager} from 'gampang';
import * as path from 'path';

import {incomingMessage} from '@/Events/incomeMessage';
import {localComs} from '@/coms';
import {type GroupedData} from '@/Jobs/conclusionPiketJob';
import {revealViewOnceSentCommand} from '@/Commands/Normal/revealViewOnce';
import {prisma} from '@/prisma';

async function bootWhatsappBot() {
	consola.warn('Booting whatsapp bot');
	const session = new SessionManager(path.resolve(__dirname, '..', 'assets', 'sessions'), 'folder');
	const client = new Client(session, {
		qr: {
			store: 'file',
			options: {
				dest: path.resolve(__dirname, '..', 'assets', 'qr.png'),
			},
		},
		prefixes: ['s!'],
	});

	client.on('ready', () => {
		consola.info('WhatsApp Bot is ready to serve');
	});

	localComs.on('conclusionPiket', async (group: GroupedData) => {
		if (group.waJid) {
			const tidakBertugas = await prisma.pesertaDidik.findMany({
				where: {
					nama: {
						in: group.members,
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
	});

	showMyDataCommand(client);
	statsDataCommand(client);
	setRoleCommand(client);
	registerGroupCommand(client);
	uploadPiketCommand(client);
	piketCommand(client);
	cariSiswaCommand(client);
	registerSiswaCommand(client);
	triggerConclusionJobCommand(client);
	revealViewOnceSentCommand(client);

	incomingMessage(client);

	await client.launch();
}

void bootWhatsappBot();
