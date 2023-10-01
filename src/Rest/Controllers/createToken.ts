import {projectConfig} from '@/config';
import {type RolePd} from '@prisma/client';
import {type Context} from 'hono';
import {sign} from 'hono/jwt';

export const createTokenController = async (ctx: Context) => {
	const data = await ctx.req.json<{
		id: string;
		nama: string;
		role: RolePd;
		kelas: string;
	}>();

	const token = await sign(data, projectConfig.JWT_SECRET);
	return ctx.json({
		data: {
			token,
		},
	});
};
