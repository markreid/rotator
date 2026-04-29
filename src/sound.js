import AlertSimple from './sounds/alert_simple.mp3';
import AlertHighIntensity from './sounds/alert_high-intensity.mp3';
import RingtoneMinimal from './sounds/ringtone_minimal.mp3';
import StateChangeConfirmUp from './sounds/state-change_confirm-up.mp3';

export const SOUNDS = {
	nextSubReady: AlertSimple,
	nextSubSoon: AlertHighIntensity,
	periodFinished: RingtoneMinimal,
	clockStart: StateChangeConfirmUp,	
};

let currentAudio = null;

export const playSound = (sound) => {
	if (!SOUNDS[sound]) return null;

	if (currentAudio) {
		currentAudio.pause();
		currentAudio = null;
	}

	const audio = new Audio(SOUNDS[sound]);
	currentAudio = audio;
	audio.play().catch(() => {});
}

export const stopSound = () => {
	if (currentAudio) {
		currentAudio.pause();
		currentAudio = null;
	}
};


