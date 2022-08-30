import { randomBytes } from 'node:crypto';

export const generateApiKey = () => {
	return randomBytes(16).toString('hex');
};