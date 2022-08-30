import { Router } from 'express';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { isNullOrUndefined } from '../utils/isNullOrUndefined';
import { default as fileUpload, type UploadedFile } from 'express-fileupload';

import { rateLimitManager } from '../utils/ratelimit';

import { prisma } from '../database';

const files = resolve(process.cwd(), 'files');

const router = Router();

router.post('/upload/', fileUpload({ limits: { fileSize: 10_485_760 }, debug: true }), async (request, response) => {
	const authorization = request.get('authorization');
	if(isNullOrUndefined(authorization)) return response.sendStatus(401);

	const user = await prisma.user.findFirst({
		where: { apiKey: authorization },
	});

	if(!user) return response.sendStatus(401);

	const ratelimit = rateLimitManager.acquire(user.id);

	if(ratelimit.limited) return response.sendStatus(429);

	if(isNullOrUndefined(request.files)) return response.sendStatus(422);
	const image = Object.values(request.files)[0] as UploadedFile;

	const name = existsSync(resolve(files, encodeURI(image.name))) ? `${generateRandomString()}_${encodeURI(image.name)}` : encodeURI(image.name);

	writeFileSync(resolve(files, name), image.data);

	response.json({
		name: name,
		success: true,
		url: `/i/${name}`,
		fullURL: `${request.get('host')}/i/${name}`,
	});

	ratelimit.consume();

	await prisma.user.update({
		where: { id: user.id },
		data: { uploads: { increment: 1 } },
	});

	console.debug(`User: ${user.id} uploaded an image. Total images uploaded by user: ${user.uploads + 1}`);

	return;
});

export default router;

const generateRandomString = (): string => {
	const str = (Math.random() + 1).toString(36).substring(7);
	if(existsSync(str)) return generateRandomString();
	return str;
};