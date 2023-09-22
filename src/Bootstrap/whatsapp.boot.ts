import {consola} from 'consola';
import {Client, SessionManager} from 'gampang';
import * as path from 'path';

async function bootWhatsappBot() {
	const session = new SessionManager(path.resolve(__dirname, '..', 'assets', 'sessions'), 'folder');
	const client = new Client(session, {
		qr: {
			store: 'file',
			options: {
				dest: path.resolve(__dirname, '..', 'assets', 'qr.png'),
			},
		},
	});

	client.on('ready', () => {
		consola.info('WhatsApp Bot is ready to serve');
	});

	await client.launch();
}

void bootWhatsappBot();
