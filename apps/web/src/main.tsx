import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { WorklistProvider } from './components/WorklistProvider';
import { router } from './router';
import 'virtual:uno.css';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { staleTime: Infinity, retry: 2, refetchOnWindowFocus: false },
	},
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById('root');

if (!rootElement) {
	throw new Error('HR Skills app root element is missing.');
}

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<WorklistProvider>
				<RouterProvider router={router} />
				<Toaster
					position='bottom-right'
					toastOptions={{
						duration: 3600,
						className:
							'!rounded-lg !border !border-slate-700 !bg-slate-900 !font-sans !text-slate-50 !shadow-lg !shadow-slate-950/20',
					}}
				/>
			</WorklistProvider>
		</QueryClientProvider>
	</StrictMode>,
);
