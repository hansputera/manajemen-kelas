import { prisma } from '@/prisma';
import { consola } from 'consola';
import {Cron as cron} from 'croner';
import { readdir } from 'fs/promises';
import path from 'path';
import jimp from 'jimp';

export const syncProofPhotoHash = cron('0 0 * * *', async () => {
    const files = await readdir(path.resolve(__dirname, '..', 'assets', 'images'));
    const onlyImages = files.filter(x => x.endsWith('.png') || x.endsWith('.jpeg') || x.endsWith('.jpg'))
        .map(x => path.resolve(__dirname, '..', 'assets', 'images', x));

    const imagesOnDatabase = await prisma.kehadiranPiket.findMany({
        where: {
            proofPhoto: {
                in: onlyImages,
            },
        },
        select: {
            id: true,
            proofPhoto: true,
            proofPhotoHash: true,
        },
    });

    if (!imagesOnDatabase.length) {
        consola.error('[syncProofPhotoHashJob]: There\'s no saved images on database');
        return;
    }

    for (const image of imagesOnDatabase) {
        const jimpImage = await jimp.read(image.proofPhoto);
        const hash = jimpImage.pHash();

        if (image.proofPhotoHash && image.proofPhotoHash !== hash) {
            consola.warn('[syncProofPhotoHashJob]: This image %s has different hash with saved hash on db', image.id);
            return;
        }

        await prisma.kehadiranPiket.update({
            where: {
                id: image.id,
            },
            data: {
                proofPhotoHash: hash,
            },
        });
    }

    consola.info('[syncProofPhotoHashJob]: successfuly synced proof photo hash for %d images', imagesOnDatabase.length);
});