import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { SiteLayout } from './components/SiteLayout';

const CatalogPage = lazy(() =>
	import('./pages/CatalogPage').then((module) => ({ default: module.CatalogPage })),
);
const MapPage = lazy(() =>
	import('./pages/MapPage').then((module) => ({ default: module.MapPage })),
);
const SkillPage = lazy(() =>
	import('./pages/SkillPage').then((module) => ({ default: module.SkillPage })),
);

function RouteLoader({ children }: { children: React.ReactNode }) {
	return (
		<Suspense
			fallback={
				<div className='grid min-h-[calc(100vh-3.75rem)] place-items-center bg-slate-100 p-6'>
					<div className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[.82rem] text-slate-500 shadow-sm'>
						<span className='size-2 animate-pulse rounded-full bg-blue-600' />
						Loading workspace…
					</div>
				</div>
			}>
			{children}
		</Suspense>
	);
}

function asShortString(value: unknown) {
	return typeof value === 'string' && value.trim().length <= 180
		? value.trim()
		: undefined;
}

interface ExplorerSearch {
	q?: string;
	domain?: string;
	view?: 'all' | 'worklist';
}

interface CanvasSearch {
	stage?: string;
	q?: string;
}

const rootRoute = createRootRoute({ component: SiteLayout });
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: () => (
		<RouteLoader>
			<CatalogPage />
		</RouteLoader>
	),
	validateSearch: (search: Record<string, unknown>): ExplorerSearch => {
		const q = asShortString(search.q);
		const domain = asShortString(search.domain);
		const view =
			search.view === 'worklist'
				? 'worklist'
				: search.view === 'all'
					? 'all'
					: undefined;
		return {
			...(q ? { q } : {}),
			...(domain ? { domain } : {}),
			...(view ? { view } : {}),
		};
	},
});
const mapRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/map',
	component: () => (
		<RouteLoader>
			<MapPage />
		</RouteLoader>
	),
	validateSearch: (search: Record<string, unknown>): CanvasSearch => {
		const stage = asShortString(search.stage);
		const q = asShortString(search.q);
		return { ...(stage ? { stage } : {}), ...(q ? { q } : {}) };
	},
});
const skillRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/skills/$skillId',
	component: () => (
		<RouteLoader>
			<SkillPage />
		</RouteLoader>
	),
});
const routeTree = rootRoute.addChildren([indexRoute, mapRoute, skillRoute]);

export const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	basepath: import.meta.env.BASE_URL,
});
