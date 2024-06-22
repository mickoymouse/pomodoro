import { TimerState } from "@/enum/timer";
import { clear } from "console";
import { useEffect, useState } from "react";

const useTimer = (dashArray: number, duration: number) => {
	const [timer, setTimer] = useState(duration * 60);
	const [initialTimer, setInitialTimer] = useState(duration * 60);
	const [progress, setProgress] = useState(0);
	const [dashOffset, setDashOffset] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [timerState, setTimerState] = useState<TimerState>(TimerState.PAUSED);
	let interval: NodeJS.Timeout;

	useEffect(() => {
		setIsRunning(false);
		setTimerState(TimerState.PAUSED);
		setTimer(duration * 60);
		setInitialTimer(duration * 60);
		setProgress(0);
		setDashOffset(0);
		setIsVisible(false);
		clearInterval(interval);
	}, [duration]);

	useEffect(() => {
		if (!isRunning) {
			return;
		}

		interval = setInterval(() => {
			setTimer((prevState) => {
				if (prevState <= 0) {
					setTimerState(TimerState.FINISHED);
					setIsRunning(false);
					clearInterval(interval);
					return 0;
				}
				return prevState - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning]);

	useEffect(() => {
		setProgress(((initialTimer - timer) / initialTimer) * 100);
	}, [timer]);

	useEffect(() => {
		setDashOffset(dashArray - (dashArray * progress) / 100);
		setIsVisible(true);
	}, [progress, duration]);

	return {
		timer,
		dashOffset,
		timerState,
		isVisible,
		initialTimer,
		setIsRunning,
		setTimerState,
		setTimer,
	};
};

export default useTimer;
