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
			keyframes: {
				slideInFromLeft: {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				slideInFromLeft2x: {
					"0%": { transform: "translateX(-200%)" },
					"100%": { transform: "translateX(0)" },
				},
				slideInFromRight: {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
				slideInFromRight2x: {
					"0%": { transform: "translateX(200%)" },
					"100%": { transform: "translateX(0)" },
				},
			},
			animation: {
				slideInFromLeft: "slideInFromLeft 0.5s forwards",
				slideInFromRight: "slideInFromRight 0.5s forwards",
				slideInFromLeft2x: "slideInFromLeft2x 0.5s forwards",
				slideInFromRight2x: "slideInFromRight2x 0.5s forwards",
			},
		},
	},
	plugins: [],
};
export default config;
