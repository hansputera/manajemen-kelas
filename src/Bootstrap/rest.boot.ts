import {Hono} from 'hono';
import {serve} from '@hono/node-server';
import {logger} from 'hono/logger';
import {jwt} from 'hono/jwt';
import {cors} from 'hono/cors';
import {consola} from 'consola';

import {projectConfig} from '@/config';
import {createTokenValidation} from '@/Rest/Validators/createToken';
import {createTokenController} from '@/Rest/Controllers/createToken';
import {randomUUID} from 'crypto';
import {showQrController} from '@/Rest/Controllers/showQr';

async function bootRest() {
	consola.warn('Booting web rest');
	const app = new Hono();

	const randomQrRoute = randomUUID();
	consola.info(`WhatsApp QR Route: /${randomQrRoute}`);

	app.use('*', logger(consola.info));
	app.use('*', cors());

	app.get(`/${randomQrRoute}`, showQrController);
	app.use('/api/*', jwt({
		secret: projectConfig.JWT_SECRET,
	}));

	app.post('/token', createTokenValidation, createTokenController);
	app.get('/', ctx => ctx.text('Manajemen Kelas v0.1'));
	serve({
		...app,
		port: projectConfig.PORT ?? 8080,
	});
}

void bootRest();
