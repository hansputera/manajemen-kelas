import {showMyDataCommand} from '@/Commands/showMyData';
import {statsDataCommand} from '@/Commands/statsData';
import {consola} from 'consola';
import {Client, SessionManager} from 'gampang';
import * as path from 'path';

async function bootWhatsappBot() {
	consola.info('Booting whatsapp bot');
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

	await client.launch();
}

void bootWhatsappBot();