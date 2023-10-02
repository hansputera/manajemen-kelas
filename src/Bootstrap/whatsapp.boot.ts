import {cariSiswaCommand} from '@/Commands/Administrator/cariSiswa';
import {piketCommand} from '@/Commands/Normal/piket';
import {registerGroupCommand} from '@/Commands/Operator/registerGroup';
import {setRoleCommand} from '@/Commands/Administrator/setRole';
import {showMyDataCommand} from '@/Commands/Normal/showMyData';
import {statsDataCommand} from '@/Commands/Normal/statsData';
import {uploadPiketCommand} from '@/Commands/Operator/uploadPiket';
import {registerSiswaCommand} from '@/Commands/Administrator/registerSiswa';
import {triggerConclusionJobCommand} from '@/Commands/Administrator/triggerConclusionJob';
import {revealViewOnceSentCommand} from '@/Commands/Normal/revealViewOnce';

import {consola} from 'consola';
import {Client, SessionManager} from 'gampang';
import * as path from 'path';

import {incomingMessage} from '@/Events/incomeMessage';
import {localComs} from '@/coms';
import {type GroupedData} from '@/Jobs/conclusionPiketJob';
import {conclusionPiketEvent} from '@/Events/LocalComs/conclusionPiket';
import {reminderPiketEvent} from '@/Events/LocalComs/reminderPiket';

import {type ParametersExceptFirst} from '@/Typings/common';

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
		prefixes: ['s!', '.'],
	});

	client.on('ready', () => {
		consola.info('WhatsApp Bot is ready to serve');
	});

	localComs.on('conclusionPiket', async (group: GroupedData) => conclusionPiketEvent(client, group));
	localComs.on('reminderPiket', async (...args: ParametersExceptFirst<typeof reminderPiketEvent>) => reminderPiketEvent(client, ...args));

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
