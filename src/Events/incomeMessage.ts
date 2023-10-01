import {type Client} from 'gampang';
import {handleLaporPiket} from './Executors/laporPiket';

export const incomingMessage = (bot: Client) => {
	bot.on('message', async ctx => {
		const laporPiketRegex = /lapor piket(?:\s)?([a-zA-Z\s]+)?/i;

		if (ctx.isPM && (laporPiketRegex.test(ctx.text) || ctx.image?.caption)) {
			await handleLaporPiket(ctx, laporPiketRegex);
		}
	});
};
