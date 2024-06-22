"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Kumbh_Sans } from "next/font/google";

import SettingsIcon from "@/public/icon-settings.svg";
import { cn } from "@/lib/utils";

const sans = Kumbh_Sans({ subsets: ["latin"] });

enum PomodoroState {
	RUNNING = "Pause",
	PAUSED = "Start",
	FINISHED = "Restart",
}

export default function Home() {
	const radius = 169.5;
	const dashArray = radius * 2 * Math.PI;

	// Pomodoro Timer
	const [pomodoroTimer, setPomodoroTimer] = useState(1 * 60);
	const [initialPomodoroTimer, setInitialPomodoroTimer] = useState(1 * 60);
	const [pomodoroProgress, setPomodoroProgress] = useState(0);
	const [pomodoroDashOffset, setPomodoroDashOffset] = useState(0);
	const [pomodoroIsRunning, setPomodoroIsRunning] = useState(false);
	const [pomodoroIsVisible, setPomodoroIsVisible] = useState(false);
	const [pomodoroState, setPomodoroState] = useState<PomodoroState>(
		PomodoroState.PAUSED
	);

	let interval: NodeJS.Timeout;
	useEffect(() => {
		console.log("pomodoroIsRunning", pomodoroIsRunning);
		console.log("pomodoroState", pomodoroState);
		console.log("pomodoroTimer", pomodoroTimer);
		console.log("initialPomodoroTimer", initialPomodoroTimer);
		console.log("pomodoroProgress", pomodoroProgress);
		console.log("pomodoroDashOffset", pomodoroDashOffset);
		console.log("pomodoroIsVisible", pomodoroIsVisible);
		console.log("dashArray", dashArray);
		console.log("radius", radius);
		console.log("interval", interval);

		if (!pomodoroIsRunning) {
			return;
		}

		interval = setInterval(() => {
			setPomodoroTimer((prevState) => {
				if (prevState <= 0) {
					setPomodoroState(PomodoroState.FINISHED);
					setPomodoroProgress(0);
					setPomodoroIsRunning(false);
					clearInterval(interval);
					return 0;
				}
				return prevState - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [pomodoroIsRunning]);

	useEffect(() => {
		setPomodoroProgress(
			((initialPomodoroTimer - pomodoroTimer) / initialPomodoroTimer) * 100
		);
	}, [pomodoroTimer]);

	useEffect(() => {
		setPomodoroDashOffset(dashArray - (dashArray * pomodoroProgress) / 100);
		setPomodoroIsVisible(true);
	}, [pomodoroProgress]);

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
			2,
			"0"
		)}`;
	};

	const managePomodoroTimer = (state: PomodoroState) => {
		switch (pomodoroState) {
			case PomodoroState.RUNNING:
				setPomodoroIsRunning(false);
				setPomodoroState(PomodoroState.PAUSED);
				break;
			case PomodoroState.PAUSED:
				setPomodoroIsRunning(true);
				setPomodoroState(PomodoroState.RUNNING);
				break;
			case PomodoroState.FINISHED:
				clearInterval(interval);
				setPomodoroTimer(initialPomodoroTimer);
				setPomodoroIsRunning(true);
				setPomodoroState(PomodoroState.RUNNING);
				break;
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-spaceCadet">
			<div className="container w-full flex flex-col gap-20 items-center">
				<div className="w-full flex items-center justify-center">
					<Image src="logo.svg" width={157} height={40} alt="pomodoro logo" />
				</div>
				<ol className="flex justify-center items-center p-3 bg-gunmetal rounded-full text-lightPeriwinkle font-bold text-[14px]">
					<li className="bg-lightCoral px-6 py-4 rounded-full text-spaceCadet cursor-pointer">
						pomodoro
					</li>
					<li className="px-6 py-4 rounded-full cursor-pointer">short break</li>
					<li className="px-6 py-4 rounded-full cursor-pointer">long break</li>
				</ol>
				<div
					className="flex items-center justify-center w-full h-full cursor-pointer"
					onClick={() => managePomodoroTimer(pomodoroState)}
				>
					<div
						className="flex items-center justify-center relative aspect-square w-[300px] md:w-[410px] rounded-full bg-gradient-to-tl from-[#2e325a] to-[#0e112a]"
						style={{
							boxShadow:
								"-50px -50px 100px 0px #272C5A, 50px 50px 100px 0px #121530",
						}}
					>
						<div className="aspect-square w-full bg-gunmetal rounded-full m-4 ">
							<div className="absolute inset-0 flex items-center justify-center">
								<svg
									width={410}
									height={410}
									viewBox="0 0 410 410"
									className={cn({
										"opacity-0": !pomodoroIsVisible,
										"opacity-100": pomodoroIsVisible,
									})}
								>
									<circle
										cx={410 / 2}
										cy={410 / 2}
										strokeWidth="10px"
										r={radius}
										className="cb stroke-gunmetal"
									/>
									<circle
										cx={410 / 2}
										cy={410 / 2}
										strokeWidth="10px"
										r={radius}
										className="cp stroke-lightCoral"
										style={{
											strokeDasharray: dashArray,
											strokeDashoffset: pomodoroDashOffset,
										}}
										transform={`rotate(-90 ${410 / 2} ${410 / 2})`}
									/>
								</svg>
							</div>
							<div
								className={`${sans.className} flex flex-col h-full w-full items-center justify-center z-50 text-lightPeriwinkle`}
							>
								<p className="tracking-[-5px] text-[100px] font-bold">
									{formatTime(pomodoroTimer)}
								</p>
								<p className="tracking-[15px] text-[16px] uppercase font-bold">
									{pomodoroState}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-center cursor-pointer">
					<SettingsIcon />
				</div>
			</div>
		</main>
	);
}
