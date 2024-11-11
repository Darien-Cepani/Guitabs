import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$lib: 'src/lib'
		}
	},
	compilerOptions: {
		sourcemap: true
	}
};

export default config;