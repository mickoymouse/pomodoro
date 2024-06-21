import Image from "next/image";
import { Kumbh_Sans } from "next/font/google";

const sans = Kumbh_Sans({ subsets: ["latin"] });
export default function Home() {
	const radius = 169.5;
	const dashArray = radius * 2 * Math.PI;
	const dashOffset = dashArray - (dashArray * 100) / 100;

	return (
		<main className="flex min-h-screen flex-col items-center justify-center">
			<div className="container w-full flex flex-col gap-8">
				<div className="w-full flex items-center justify-center">
					<Image src="logo.svg" width={157} height={40} alt="pomodoro logo" />
				</div>
				<ol className="flex justify-center gap-6">
					<li>pomodoro</li>
					<li>short break</li>
					<li>long break</li>
				</ol>
				<div className="flex items-center justify-center w-full h-full">
					<div className="relative aspect-square w-[300px] md:w-[410px]">
						<div className="absolute inset-0 flex items-center justify-center">
							<svg width={410} height={410} viewBox="0 0 410 410">
								<circle
									cx={410 / 2}
									cy={410 / 2}
									strokeWidth="15px"
									r={radius}
									className="cb"
								/>
								<circle
									cx={410 / 2}
									cy={410 / 2}
									strokeWidth="15px"
									r={radius}
									className="cp"
									style={{
										strokeDasharray: dashArray,
										strokeDashoffset: dashOffset,
									}}
									transform={`rotate(-90 410/2 410/2)`}
								/>
							</svg>
						</div>
						<div
							className={`${sans.className} flex flex-col h-full w-full items-center justify-center z-50`}
						>
							<p className="tracking-[-5px] text-[100px] font-bold">17:59</p>
							<p className="tracking-[15px] text-[16px] uppercase font-bold">
								pause
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
