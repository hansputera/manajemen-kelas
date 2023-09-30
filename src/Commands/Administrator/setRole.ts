import {prisma} from '@/prisma';
import {toZeroEightNumber} from '@/Utilities/toZeroEightNumber';
import {RolePd} from '@prisma/client';
import {type Client} from 'gampang';

export const setRoleCommand = (bot: Client) => {
	bot.command('setRole', async ctx => {
		const pd = await prisma.pesertaDidik.findFirst({where: {ponsel: toZeroEightNumber(ctx.authorNumber)}});
		if (pd && pd.role === RolePd.ADMINISTRATOR && ctx.args.length > 1) {
			const roleSpecified = ctx.args.at(0);
			if (!roleSpecified || roleSpecified.toUpperCase() === RolePd.ADMINISTRATOR) {
				return;
			}

			if (Reflect.has(RolePd, roleSpecified.toUpperCase())) {
				let mentionedJids = ctx.raw.message?.extendedTextMessage?.contextInfo?.mentionedJid;
				if (!mentionedJids) {
					await ctx.reply('Saya tidak dapat menemukan orang yang dimention dalam pesan ini..');
					return;
				}

				if (typeof mentionedJids === 'string') {
					mentionedJids = [mentionedJids];
				}

				mentionedJids = mentionedJids.map(toZeroEightNumber).filter(p => typeof p === 'string') as string[];
				const updateRoles = await prisma.pesertaDidik.updateMany({
					where: {
						ponsel: {
							in: mentionedJids.map(x => x.match(/[0-9]+/g)?.at(0)) as string[],
						},
						role: {
							not: RolePd.ADMINISTRATOR,
						},
					},
					data: {
						role: roleSpecified.toUpperCase() as RolePd,
					},
				});

				await ctx.reply(`Affected rows: ${updateRoles.count} rows\nAffected phone numbers: ${mentionedJids.map(x => x.match(/[0-9]+/g)?.at(0)).join(', ')}`);
			}
		}
	}, {
		aliases: ['set-role'],
	});
};
