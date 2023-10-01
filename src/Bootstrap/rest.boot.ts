import {Hono} from 'hono';
import {serve} from '@hono/node-server';
import {logger} from 'hono/logger';
import {jwt} from 'hono/jwt';
import {cors} from 'hono/cors';
import {consola} from 'consola';
import {serveStatic} from '@hono/node-server/serve-static';

import {projectConfig} from '@/config';
import {createTokenValidation} from '@/Rest/Validators/createToken';
import {createTokenController} from '@/Rest/Controllers/createToken';
import {randomUUID} from 'crypto';
import {showQrController} from '@/Rest/Controllers/showQr';
import {RolePd} from '@prisma/client';

async function bootRest() {
	consola.warn('Booting web rest');
	const app = new Hono();

	const randomQrRoute = randomUUID();
	consola.info(`WhatsApp QR Route: /${randomQrRoute}`);

	app.use('*', logger(consola.info));
	app.use('*', cors());
	app.use('/assets/images/*', serveStatic({
		root: './assets/images',
	}));

	app.get(`/${randomQrRoute}`, showQrController);
	app.use('/api/*', jwt({
		secret: projectConfig.JWT_SECRET,
	}));
	app.use('/api/operator/*', async (ctx, next) => {
		if (!(Reflect.get(ctx.get('jwtPayload'), 'role') in [RolePd.ADMINISTRATOR, RolePd.OPERATOR_KELAS])) {
			return ctx.json({error: 'Permission denied'}, 403);
		}

		return next();
	});

	app.post('/token', createTokenValidation, createTokenController);
	app.get('/', ctx => ctx.text('Manajemen Kelas v0.1'));
	serve({
		...app,
		port: projectConfig.PORT ?? 8080,
	});
}

void bootRest();
