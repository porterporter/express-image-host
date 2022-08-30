import { Router } from 'express';
import { isNullOrUndefined } from '../utils/isNullOrUndefined';

import { prisma } from '../database';
import { generateApiKey } from '../utils/generateApiKey';


const router = Router();

router.get('/createUser', async (request, response) => {
	const authorization = request.get('authorization');
	if(isNullOrUndefined(authorization)) return response.sendStatus(401);

	const user = await prisma.user.findFirst({
		where: { apiKey: authorization },
	});

	if(isNullOrUndefined(user) || user.admin) return response.sendStatus(401);

	const newUser = await prisma.user.create({
		data: {
			apiKey: generateApiKey(),
		},
	});

	response.json({
		success: true,
		...newUser,
	});

	console.debug(`Admin: ${user.id} created a new user. New user id: ${newUser.id}`);

	return;
});

export default router;
