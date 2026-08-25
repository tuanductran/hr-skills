import { defineConfig, presetWebFonts, presetWind3 } from 'unocss';

export default defineConfig({
	content: {
		filesystem: ['./src/**/*.{ts,tsx}', './index.html'],
	},
	presets: [
		presetWind3(),
		presetWebFonts({
			provider: 'google',
			fonts: {
				sans: 'Inter:400,500,600,700',
				heading: 'Manrope:500,600,700,800',
				mono: 'Fira Code:400,500,600',
			},
		}),
	],
	theme: {
		animation: {
			'workspace-dialog-in':
				'workspace-dialog-in 180ms cubic-bezier(0.23, 1, 0.32, 1) both',
			'workspace-dialog-out':
				'workspace-dialog-out 140ms cubic-bezier(0.77, 0, 0.175, 1) both',
			'workspace-overlay-in':
				'workspace-overlay-in 160ms cubic-bezier(0.23, 1, 0.32, 1) both',
			'workspace-overlay-out':
				'workspace-overlay-out 120ms cubic-bezier(0.77, 0, 0.175, 1) both',
			'workspace-sheet-in':
				'workspace-sheet-in 200ms cubic-bezier(0.23, 1, 0.32, 1) both',
			'workspace-sheet-out':
				'workspace-sheet-out 150ms cubic-bezier(0.77, 0, 0.175, 1) both',
		},
		fontFamily: {
			heading: 'Manrope, Inter, system-ui, sans-serif',
			sans: 'Inter, system-ui, sans-serif',
			mono: 'Fira Code, ui-monospace, monospace',
		},
		keyframes: {
			'workspace-dialog-in': {
				from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.985)' },
				to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
			},
			'workspace-dialog-out': {
				from: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
				to: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.985)' },
			},
			'workspace-overlay-in': { from: { opacity: '0' }, to: { opacity: '1' } },
			'workspace-overlay-out': { from: { opacity: '1' }, to: { opacity: '0' } },
			'workspace-sheet-in': {
				from: { opacity: '0', transform: 'translateX(-1rem)' },
				to: { opacity: '1', transform: 'translateX(0)' },
			},
			'workspace-sheet-out': {
				from: { opacity: '1', transform: 'translateX(0)' },
				to: { opacity: '0', transform: 'translateX(-1rem)' },
			},
		},
	},
});
