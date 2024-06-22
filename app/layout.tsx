import type { Metadata } from "next";
import { Kumbh_Sans } from "next/font/google";
import "./globals.css";

const font = Kumbh_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Pomodora",
	description: "Make the most of your time with Pomodora",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={font.className}>{children}</body>
		</html>
	);
}
