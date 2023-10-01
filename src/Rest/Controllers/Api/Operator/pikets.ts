import {prisma} from '@/prisma';
import {type Context} from 'hono';
import {homedir} from 'os';

export const showKehadiranPiketsController = async (ctx: Context) => {
	const kehadiranPikets = await prisma.kehadiranPiket.findMany({
		where: {
			kelas: {
				kelas: ctx.get('jwtPayload').kelas as string,
			},
		},
	});

	return ctx.json({data: kehadiranPikets.map(x => ({...x, proofPhoto: x.proofPhoto.replace(homedir(), '')}))}, 200);
};
