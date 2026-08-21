const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const vercelSiteUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: undefined;

export const siteUrl = (
	configuredSiteUrl ??
	vercelSiteUrl ??
	'https://hr-skills-web.vercel.app'
).replace(/\/$/, '');
