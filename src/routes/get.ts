import { Router } from 'express';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const files = resolve(process.cwd(), 'files');

const router = Router();

router.get('/i/:id', (request, response) => {
	console.debug(`IP ${request.ip} accessing ${request.params.id}`);
	for(const file of readdirSync(files)) {
		if(request.params.id === file) {
			return response.sendFile(resolve(files, file));
		}
	}
	response.sendStatus(404);
});

export default router;