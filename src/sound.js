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

const audioElement = new Audio();

export const playSound = (sound) => {
	// no sound, do nothing
	if (!SOUNDS[sound]) return null;

	audioElement.src = SOUNDS[sound];
	
	try {
		audioElement.play();
	} catch (err) {
		// do nothing
	}
}

export const stopSound = () => audioElement.pause();


