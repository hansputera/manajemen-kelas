import {existsSync, promises} from 'fs';
import {type Context} from 'hono';
import * as path from 'path';

export const showQrController = async (ctx: Context) => {
	const qrPath = path.resolve(__dirname, '..', 'assets', 'qr.png');

	if (!existsSync(qrPath)) {
		return ctx.text('qr not found', 404);
	}

	return ctx.body(await promises.readFile(qrPath));
};
