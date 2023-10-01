import {prisma} from '@/prisma';
import {validator} from 'hono/validator';
import {z} from 'zod';

const createTokenSchema = z.object({
	pdId: z.string().min(10).max(255),
	nama: z.string(),
	password: z.string(),
});

export const createTokenValidation = validator('json', async (value, ctx) => {
	const parsed = await createTokenSchema.safeParseAsync(value);
	if (!parsed.success) {
		return ctx.text('data invalid', 403);
	}

	const pd = await prisma.pesertaDidik.findUnique({
		where: {
			id: parsed.data.pdId,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			AND: {
				nama: parsed.data.nama,
				passwordAuth: parsed.data.password,
			},
		},
	});

	if (!pd) {
		return ctx.text('pd not found', 401);
	}

	return parsed.data;
});
