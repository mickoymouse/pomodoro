"use client";

import { Kumbh_Sans, Roboto_Slab, Space_Mono } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

import { TimerState } from "@/enum/timer";
import useTimer from "@/hooks/timer";
import { cn } from "@/lib/utils";
import SettingsIcon from "@/public/icon-settings.svg";
import CloseIcon from "@/public/icon-close.svg";
import { Font } from "@/enum/font";
import { Color } from "@/enum/color";

const sans = Kumbh_Sans({ subsets: ["latin"] });
const slab = Roboto_Slab({ subsets: ["latin"] });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });

interface Settings {
	pomodoro: number;
	shortBreak: number;
	longBreak: number;
	font: Font;
	color: Color;
}

interface SettingsModalProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	settings: Settings;
	setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export default function Home() {
	const radius = 169.5;
	const dashArray = radius * 2 * Math.PI;

	const [tab, setTab] = useState(0);
	const [prevTab, setPrevTab] = useState(0);
	const [animate, setAnimate] = useState("");

	const handleTabChange = (tab: number) => {
		if (prevTab === tab) {
			return;
		}

		if (prevTab < tab) setAnimate("animate-slideInFromLeft");
		else setAnimate("animate-slideInFromRight");

		setTab(tab);
		setPrevTab(tab);
	};

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

	const [settingsIsOpen, setSettingsIsOpen] = useState(false);

	const [settinngs, setSettings] = useState<Settings>({
		pomodoro: 15,
		shortBreak: 3,
		longBreak: 5,
		font: Font.sans,
		color: Color.lightCoral,
	});

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-spaceCadet">
			<div className="container w-full flex flex-col gap-20 items-center">
				<div className="w-full flex items-center justify-center">
					<Image src="logo.svg" width={157} height={40} alt="pomodoro logo" />
				</div>
				<nav>
					<ul className="flex justify-between items-center p-2 bg-gunmetal rounded-full text-lightPeriwinkle font-bold text-[12px] md:text-[14px]">
						<li className="relative">
							<p
								className={cn(
									"z-10 relative p-4 md:p-6 text-[12px] md:text-[14px] cursor-pointer",
									{
										"text-spaceCadet": tab === 0,
									}
								)}
								onClick={() => handleTabChange(0)}
							>
								pomodoro
							</p>
							<div
								className={cn(
									"h-full w-full absolute top-0 left-0 z-0 rounded-full",
									{
										"bg-lightCoral": tab === 0,
										[animate]: tab === 0,
									}
								)}
							></div>
						</li>
						<li className="relative">
							<p
								className={cn(
									"z-10 relative p-4 md:p-6 text-[12px] md:text-[14px] cursor-pointer",
									{
										"text-spaceCadet": tab === 1,
									}
								)}
								onClick={() => handleTabChange(1)}
							>
								short break
							</p>
							<div
								className={cn(
									"h-full w-full absolute top-0 left-0 z-0 rounded-full",
									{
										"bg-lightCoral": tab === 1,
										[animate]: tab === 1,
									}
								)}
							></div>
						</li>
						<li className="relative">
							<p
								className={cn(
									"z-10 relative p-4 md:p-6 text-[12px] md:text-[14px] cursor-pointer",
									{
										"text-spaceCadet": tab === 2,
									}
								)}
								onClick={() => handleTabChange(2)}
							>
								long break
							</p>
							<div
								className={cn(
									"h-full w-full absolute top-0 left-0 z-0 rounded-full",
									{
										"bg-lightCoral": tab === 2,
										[animate]: tab === 2,
									}
								)}
							></div>
						</li>
					</ul>
				</nav>
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
				<div
					className="flex items-center justify-center cursor-pointer"
					onClick={() => {
						setSettingsIsOpen(true);
					}}
				>
					<SettingsIcon />
				</div>
			</div>
			<SettingsModal
				isOpen={settingsIsOpen}
				setIsOpen={setSettingsIsOpen}
				settings={settinngs}
				setSettings={setSettings}
			/>
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
						className={`${sans.className} flex flex-col h-full w-full items-center justify-center text-lightPeriwinkle`}
					>
						<p className="tracking-[-5px] text-[80px] md:text-[100px] font-bold">
							{formatTime(timer)}
						</p>
						<p className="tracking-[15px] text-[14px] md:text-[16px] uppercase font-bold">
							{timerState}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const ArrowUpComponent = ({ opacity }: { opacity: number }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="7">
			<path
				fill="none"
				stroke="#1E213F"
				strokeOpacity={opacity}
				strokeWidth="2"
				d="M1 6l6-4 6 4"
			/>
		</svg>
	);
};

const ArrowDownComponent = ({ opacity }: { opacity: number }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="7">
			<path
				fill="none"
				stroke="#1E213F"
				strokeOpacity={opacity}
				strokeWidth="2"
				d="M1 1l6 4 6-4"
			/>
		</svg>
	);
};

const CheckComponent = () => {
	return (
		<svg
			width="15"
			height="11"
			viewBox="0 0 15 11"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1 5.5L4.95263 9.45263L13.4053 1"
				stroke="#161932"
				strokeWidth="2"
			/>
		</svg>
	);
};

const InputComponent = ({
	m,
	id,
	label,
	min,
	max,
	minutes,
	setMinutes,
}: {
	m: number;
	id: string;
	label: string;
	min: number;
	max: number;
	minutes: number;
	setMinutes: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const [opacity, setOpacity] = useState(0.25);

	return (
		<div className="flex items-center w-full justify-between">
			<label className="text-[12px] font-bold text-spaceCadet" htmlFor={id}>
				{label}
			</label>
			<div
				className="flex items-center relative cursor-pointer"
				onMouseEnter={() => setOpacity(1)}
				onMouseLeave={() => setOpacity(0.25)}
			>
				<input
					type="number"
					name={id}
					id={id}
					min={min}
					max={max}
					value={minutes}
					onChange={(e) => {
						setMinutes(Number(e.target.value));
					}}
					onBlur={() => {
						if (minutes < 15) {
							setMinutes(15);
						} else if (minutes > 25) {
							setMinutes(25);
						}
					}}
					className="appearance-none w-[140px] h-[40px] border rounded-[10px] py-2 px-3 bg-lavenderMist text-spaceCadet text-[14px] font-bold leading-tight focus:outline-none focus:shadow-outline"
				/>
				<div className="flex flex-col absolute gap-2 right-0 mx-4 cursor-pointer">
					<button
						className={cn({
							disabled: minutes === 25,
						})}
						onClick={() => {
							if (minutes < 25) {
								setMinutes(minutes + 1);
							}
						}}
					>
						<ArrowUpComponent opacity={opacity} />
					</button>
					<button
						className={cn({
							disabled: minutes === 25,
						})}
						onClick={() => {
							if (minutes > 15) {
								setMinutes(minutes - 1);
							}
						}}
					>
						<ArrowDownComponent opacity={opacity} />
					</button>
				</div>
			</div>
		</div>
	);
};

const SettingsModal = ({
	isOpen,
	setIsOpen,
	settings,
	setSettings,
}: SettingsModalProps) => {
	const [pomodoro, setPomodoro] = useState<number>(settings.pomodoro);
	const [shortBreak, setShortBreak] = useState<number>(settings.shortBreak);
	const [longBreak, setLongBreak] = useState<number>(settings.longBreak);
	const [fontButton, setFontButton] = useState<Font>(settings.font);
	const [color, setColor] = useState<Color>(settings.color);

	const hoverStyle = `hover:border-2 hover:border-white hover:outline hover:outline-1 hover:outline-lavenderMist`;
	const fontListStyle = `w-[40px] h-[40px] bg-lavenderMist rounded-full text-spaceCadet text-[15px] flex items-center justify-center cursor-pointer`;
	const colorListStyle = `w-[40px] h-[40px] rounded-full text-spaceCadet text-[15px] flex items-center justify-center cursor-pointer`;

	const SaveSettings = () => {
		setSettings({
			pomodoro,
			shortBreak,
			longBreak,
			font: fontButton,
			color,
		});
		setIsOpen(false);
	};

	return (
		<div
			className={cn(
				"min-h-screen min-w-full inset-0 z-50 fixed flex items-center justify-center",
				{
					hidden: !isOpen,
				}
			)}
		>
			<div
				className="min-h-screen min-w-full inset-0 z-40 fixed bg-gray-400 opacity-30 "
				onClick={() => {
					setIsOpen(false);
				}}
			></div>
			<div className="w-[327px] bg-white rounded-[15px] z-[999]">
				<div className="flex justify-between items-center p-6 z-[999]">
					<h2 className={cn("font-bold text-[20px]", `${sans.className}`)}>
						Settings
					</h2>
					<div
						className="cursor-pointer"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						<CloseIcon />
					</div>
				</div>
				<hr />
				<div className="my-6 flex flex-col px-4 gap-4 mb-14">
					<div className="flex flex-col gap-6">
						<h3 className="text-center text-[11px] font-bold tracking-[4.23px] uppercase">
							time (minutes)
						</h3>
						<div className="flex flex-col gap-2">
							<InputComponent
								m={15}
								id="pomodoro"
								label="pomodoro"
								min={15}
								max={25}
								minutes={pomodoro}
								setMinutes={setPomodoro}
							/>
							<InputComponent
								m={3}
								id="short-break"
								label="short break"
								min={3}
								max={5}
								minutes={shortBreak}
								setMinutes={setShortBreak}
							/>
							<InputComponent
								m={5}
								id="long-break"
								label="long break"
								min={5}
								max={15}
								minutes={longBreak}
								setMinutes={setLongBreak}
							/>
						</div>
					</div>
					<hr />
					<div className="flex flex-col items-center gap-4">
						<h3 className="text-[11px] tracking-[4.23px] font-bold text-gunmetal uppercase">
							font
						</h3>
						<ul className="flex items-center justify-center gap-4">
							<li
								className={cn(
									`${fontListStyle} ${sans.className} ${hoverStyle}`,
									{
										"bg-gunmetal text-white": fontButton === Font.sans,
									}
								)}
							>
								<button onClick={() => setFontButton(Font.sans)}>Aa</button>
							</li>
							<li
								className={cn(
									`${fontListStyle} ${slab.className} ${hoverStyle}`,
									{
										"bg-gunmetal text-white": fontButton === Font.slab,
									}
								)}
							>
								<button onClick={() => setFontButton(Font.slab)}>Aa</button>
							</li>
							<li
								className={cn(
									`${fontListStyle} ${mono.className} ${hoverStyle}`,
									{
										"bg-gunmetal text-white": fontButton === Font.mono,
									}
								)}
							>
								<button onClick={() => setFontButton(Font.mono)}>Aa</button>
							</li>
						</ul>
					</div>
					<hr />
					<div className="flex flex-col items-center gap-4">
						<h3 className="text-[11px] tracking-[4.23px] font-bold text-gunmetal uppercase">
							color
						</h3>
						<ul className="flex items-center justify-center gap-4">
							<li
								className={cn(
									` bg-lightCoral ${colorListStyle} ${sans.className} ${hoverStyle}`
								)}
								onClick={() => setColor(Color.lightCoral)}
							>
								{color === Color.lightCoral ? <CheckComponent /> : null}
							</li>
							<li
								className={cn(
									` bg-electricBlue ${colorListStyle} ${slab.className} ${hoverStyle}`
								)}
								onClick={() => setColor(Color.electricBlue)}
							>
								{color === Color.electricBlue ? <CheckComponent /> : null}
							</li>
							<li
								className={cn(
									` bg-lavender ${colorListStyle} ${mono.className} ${hoverStyle}`
								)}
								onClick={() => setColor(Color.lavender)}
							>
								{color === Color.lavender ? <CheckComponent /> : null}
							</li>
						</ul>
					</div>
				</div>
				<div className="relative w-full">
					<div className="absolute bottom-0 left-1/2 translate-x-[-50%] translate-y-[50%]">
						<button
							className="w-[140px] h-[53px] bg-lightCoral rounded-full text-[16px] text-white font-bold cursor-pointer relative"
							onClick={() => {
								SaveSettings();
							}}
						>
							Apply
							<span className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-full"></span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
