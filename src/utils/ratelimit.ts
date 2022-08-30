import { RateLimitManager } from '@sapphire/ratelimits';

export const rateLimitManager = new RateLimitManager(60_000, 5);