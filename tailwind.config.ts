import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				lightCoral: "#f87070",
				electricBlue: "#70f3f8",
				lavender: "#d881f8",
				lightPeriwinkle: "#d7e0ff",
				spaceCadet: "#1e213f",
				lavenderMist: "#eff1fa",
				gunmetal: "#161932",
			},
		},
	},
	plugins: [],
};
export default config;
