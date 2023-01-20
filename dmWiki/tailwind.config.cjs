/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	safelist: [
		{
			pattern: /col-span-./
		},
		{
			pattern: /row-span-./
		}
	],
	plugins: [require('daisyui')]
};
