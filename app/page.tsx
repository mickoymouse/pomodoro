"use client";

import Image from "next/image";
import { Kumbh_Sans } from "next/font/google";

import SettingsIcon from "@/public/icon-settings.svg";
import { cn } from "@/lib/utils";
import useTimer from "@/hooks/timer";
import { TimerState } from "@/enum/timer";
import { useEffect, useState } from "react";

const sans = Kumbh_Sans({ subsets: ["latin"] });

enum PomodoroState {
	RUNNING = "Pause",
	PAUSED = "Start",
	FINISHED = "Restart",
}

export default function Home() {
	const radius = 169.5;
	const dashArray = radius * 2 * Math.PI;

	const [tab, setTab] = useState(0);

	// Pomodoro Timer
	const [pomodoroDuration, setPomodoroDuration] = useState(25);
	const {
		timer: pomodoroTimer,
		isVisible: pomodoroIsVisible,
		initialTimer: pomodoroInitialTimer,
		timerState: pomodoroState,
		dashOffset: pomodoroDashOffset,
		setIsRunning: setPomodoroIsRunning,
		setTimerState: setPomodoroState,
		setTimer: setPomodoroTimer,
	} = useTimer(dashArray, pomodoroDuration);

	// short break timer
	const [shortBreakDuration, setShortBreakDuration] = useState(5);
	const {
		timer: shortBreakTimer,
		isVisible: shortBreakIsVisible,
		initialTimer: shortBreakInitialTimer,
		timerState: shortBreakState,
		dashOffset: shortBreakDashOffset,
		setIsRunning: setShortBreakIsRunning,
		setTimerState: setShortBreakState,
		setTimer: setShortBreakTimer,
	} = useTimer(dashArray, shortBreakDuration);

	// long break timer
	const [longBreakDuration, setLongBreakDuration] = useState(15);
	const {
		timer: longBreakTimer,
		isVisible: longBreakIsVisible,
		initialTimer: longBreakInitialTimer,
		timerState: longBreakState,
		dashOffset: longBreakDashOffset,
		setIsRunning: setLongBreakIsRunning,
		setTimerState: setLongBreakState,
		setTimer: setLongBreakTimer,
	} = useTimer(dashArray, longBreakDuration);

	const formatTime = (time: number) => {
		console.log(pomodoroDuration);
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
			2,
			"0"
		)}`;
	};

	const managePomodoroTimer = (state: TimerState) => {
		switch (state) {
			case TimerState.RUNNING:
				setPomodoroIsRunning(false);
				setPomodoroState(TimerState.PAUSED);
				break;
			case TimerState.PAUSED:
				setPomodoroIsRunning(true);
				setPomodoroState(TimerState.RUNNING);

				setShortBreakIsRunning(false);
				setShortBreakState(TimerState.PAUSED);
				setLongBreakIsRunning(false);
				setLongBreakState(TimerState.PAUSED);
				break;
			case TimerState.FINISHED:
				setPomodoroTimer(pomodoroInitialTimer);
				setPomodoroIsRunning(true);
				setPomodoroState(TimerState.RUNNING);
				break;
		}
	};

	const manageShortBreakTimer = (state: TimerState) => {
		switch (state) {
			case TimerState.RUNNING:
				setShortBreakIsRunning(false);
				setShortBreakState(TimerState.PAUSED);
				break;
			case TimerState.PAUSED:
				setShortBreakIsRunning(true);
				setShortBreakState(TimerState.RUNNING);

				setPomodoroIsRunning(false);
				setPomodoroState(TimerState.PAUSED);
				setLongBreakIsRunning(false);
				setLongBreakState(TimerState.PAUSED);
				break;
			case TimerState.FINISHED:
				setShortBreakTimer(shortBreakInitialTimer);
				setShortBreakIsRunning(true);
				setShortBreakState(TimerState.RUNNING);
				break;
		}
	};

	const manageLongBreakTimer = (state: TimerState) => {
		switch (state) {
			case TimerState.RUNNING:
				setLongBreakIsRunning(false);
				setLongBreakState(TimerState.PAUSED);
				break;
			case TimerState.PAUSED:
				setLongBreakIsRunning(true);
				setLongBreakState(TimerState.RUNNING);

				setPomodoroIsRunning(false);
				setPomodoroState(TimerState.PAUSED);
				setShortBreakIsRunning(false);
				setShortBreakState(TimerState.PAUSED);
				break;
			case TimerState.FINISHED:
				setLongBreakTimer(longBreakInitialTimer);
				setLongBreakIsRunning(true);
				setLongBreakState(TimerState.RUNNING);
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
					<li
						className={cn("px-6 py-4 rounded-full cursor-pointer", {
							"bg-lightCoral text-spaceCadet": tab === 0,
						})}
						onClick={() => setTab(0)}
					>
						pomodoro
					</li>
					<li
						className={cn("px-6 py-4 rounded-full cursor-pointer", {
							"bg-lightCoral text-spaceCadet": tab === 1,
						})}
						onClick={() => setTab(1)}
					>
						short break
					</li>
					<li
						className={cn("px-6 py-4 rounded-full cursor-pointer", {
							"bg-lightCoral text-spaceCadet": tab === 2,
						})}
						onClick={() => setTab(2)}
					>
						long break
					</li>
				</ol>
				<div
					className={cn({
						hidden: tab !== 0,
					})}
				>
					<TimerTab
						manageTimer={managePomodoroTimer}
						formatTime={formatTime}
						timer={pomodoroTimer}
						timerState={pomodoroState}
						isVisible={pomodoroIsVisible}
						radius={radius}
						dashArray={dashArray}
						dashOffset={pomodoroDashOffset}
					/>
				</div>
				<div
					className={cn({
						hidden: tab !== 1,
					})}
				>
					<TimerTab
						manageTimer={manageShortBreakTimer}
						formatTime={formatTime}
						timer={shortBreakTimer}
						timerState={shortBreakState}
						isVisible={shortBreakIsVisible}
						radius={radius}
						dashArray={dashArray}
						dashOffset={shortBreakDashOffset}
					/>
				</div>
				<div
					className={cn({
						hidden: tab !== 2,
					})}
				>
					<TimerTab
						manageTimer={manageLongBreakTimer}
						formatTime={formatTime}
						timer={longBreakTimer}
						timerState={longBreakState}
						isVisible={longBreakIsVisible}
						radius={radius}
						dashArray={dashArray}
						dashOffset={longBreakDashOffset}
					/>
				</div>
				<div className="flex items-center justify-center cursor-pointer">
					<SettingsIcon />
				</div>
			</div>
		</main>
	);
}

const TimerTab = ({
	manageTimer,
	formatTime,
	timer,
	timerState,
	isVisible,
	radius,
	dashArray,
	dashOffset,
}: {
	manageTimer: (timerState: TimerState) => void;
	formatTime: (time: number) => string;
	timer: number;
	timerState: TimerState;
	isVisible: boolean;
	radius: number;
	dashArray: number;
	dashOffset: number;
}) => {
	return (
		<div
			className="flex items-center justify-center w-full h-full cursor-pointer"
			onClick={() => manageTimer(timerState)}
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
								"opacity-0": !isVisible,
								"opacity-100": isVisible,
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
									strokeDashoffset: dashOffset,
								}}
								transform={`rotate(-90 ${410 / 2} ${410 / 2})`}
							/>
						</svg>
					</div>
					<div
						className={`${sans.className} flex flex-col h-full w-full items-center justify-center z-50 text-lightPeriwinkle`}
					>
						<p className="tracking-[-5px] text-[100px] font-bold">
							{formatTime(timer)}
						</p>
						<p className="tracking-[15px] text-[16px] uppercase font-bold">
							{timerState}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
