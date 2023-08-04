const audioElement = new Audio();



const SOUNDS = {
	nextSubReady: 'alert_simple.wav',
	nextSubSoon: 'alert_high-intensity.wav',
	periodFinished: 'ringtone_minimal.wav',
	clockStart: 'state-change_confirm-up.wav',
	clockStop: 'state-change_confirm-down.wav',
	resetClock: 'alert_error-02.wav',
	makeSub: 'navigation_forward-selection-minimal.wav',
};

export const playSound = (sound) => {	
	try {
		audioElement.src = `sounds/${SOUNDS[sound]}`;
		audioElement.play().catch(console.error);
	} catch (error) {
		console.error(error);
	}	
}

export const stopSound = () => {
	audioElement.pause();
}