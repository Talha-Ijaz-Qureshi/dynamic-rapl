import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html'
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? process.env.BASE_PATH || '' : ''
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				if (path === '/not-found') return;
				throw new Error(message);
			}
		}
	}
};

export default config;
