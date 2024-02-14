import {type Client} from 'gampang';
import {handleLaporPiket} from './Executors/laporPiket';

export const incomingMessage = (bot: Client) => {
	bot.on('message', async ctx => {
		const laporPiketRegex = /^lapor piket(?:\s)?([A-Za-z\s]+)?$/gi;

		if (ctx.isPM && (laporPiketRegex.test(ctx.text?.trim()) || ctx.image?.caption)) {
			await handleLaporPiket(ctx, laporPiketRegex);
		}
	});
};
