import {conclusionPiketJob} from '@/Jobs/conclusionPiketJob';
import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {prisma} from '@/prisma';
import {RolePd} from '@prisma/client';
import {type Client} from 'gampang';

export const triggerConclusionJobCommand = (bot: Client) => {
	bot.command('trigger-conclusion-job', async ctx => {
		const pd = await prisma.pesertaDidik.findFirst({
			where: {
				ponsel: toZeroEightNumber(ctx.authorNumber),
			},
		});

		if (pd && pd.role === RolePd.ADMINISTRATOR) {
			await ctx.reply('Triggering...');
			await conclusionPiketJob.trigger();
		}
	}, {
		aliases: ['tcj', 'trigger-conclusion'],
	});
};
