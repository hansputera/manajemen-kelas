import {type Client} from 'gampang';

export const revealViewOnceSentCommand = (bot: Client) => {
	bot.command('reveal-vo', async ctx => {
		const reply = ctx.getReply();

		if (!reply) {
			await ctx.reply('Mohon balas pesan yang mengandung media sekali lihat :)');
			return;
		}

		const viewOnceMessage = reply.raw.message?.viewOnceMessageV2?.message;
		if (!viewOnceMessage?.imageMessage && !viewOnceMessage?.videoMessage) {
			await ctx.reply('Pesan yang dibalas invalid, bukan pesan yang mengandung media sekali lihat');
			return;
		}

		if (viewOnceMessage.imageMessage) {
			viewOnceMessage.imageMessage.viewOnce = false;
		}

		if (viewOnceMessage.videoMessage) {
			viewOnceMessage.videoMessage.viewOnce = false;
		}

		await ctx.client.raw?.relayMessage(ctx.raw.key.remoteJid!, viewOnceMessage, {});
	}, {
		aliases: ['rvo'],
	});
};
