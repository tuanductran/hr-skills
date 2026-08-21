export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },
	modules: ['@nuxt/ui', '@vueuse/nuxt'],
	css: ['~/assets/css/main.css'],
	ui: {
		theme: {
			colors: ['primary', 'neutral', 'success', 'warning', 'error'],
			defaultVariants: {
				color: 'primary',
				size: 'md',
			},
			transitions: true,
		},
		experimental: {
			componentDetection: true,
		},
	},
	typescript: {
		strict: true,
		typeCheck: true,
	},
	app: {
		head: {
			title: 'JD Builder — HR Skills',
			meta: [
				{
					name: 'description',
					content:
						'Build inclusive, structured job descriptions with HR Skills.',
				},
			],
		},
	},
});
