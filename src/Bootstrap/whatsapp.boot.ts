import {cariSiswaCommand} from '@/Commands/cariSiswa';
import {piketCommand} from '@/Commands/piket';
import {registerGroupCommand} from '@/Commands/registerGroup';
import {setRoleCommand} from '@/Commands/setRole';
import {showMyDataCommand} from '@/Commands/showMyData';
import {statsDataCommand} from '@/Commands/statsData';
import {uploadPiketCommand} from '@/Commands/uploadPiket';
import {consola} from 'consola';
import {Client, SessionManager} from 'gampang';
import * as path from 'path';

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

	showMyDataCommand(client);
	statsDataCommand(client);
	setRoleCommand(client);
	registerGroupCommand(client);
	uploadPiketCommand(client);
	piketCommand(client);
	cariSiswaCommand(client);

	await client.launch();
}

void bootWhatsappBot();
