import {projectConfig} from '@/config';
import {type Context} from 'hono';
import {sign} from 'hono/jwt';

export const createTokenController = async (ctx: Context) => {
	const data = await ctx.req.json<{
		pdId: string;
		nama: string;
	}>();

	const token = await sign(data, projectConfig.JWT_SECRET);
	return ctx.json({
		data: {
			token,
		},
	});
};
