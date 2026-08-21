import type { MetadataRoute } from 'next';
import { siteUrl } from './lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = siteUrl;
	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
	];
}
