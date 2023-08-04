import { Howl } from 'howler';

export const SOUNDS = {
	nextSubReady: 'alert_simple.wav',
	nextSubSoon: 'alert_high-intensity.wav',
	periodFinished: 'ringtone_minimal.wav',
	clockStart: 'state-change_confirm-up.wav',
	clockStop: 'state-change_confirm-down.wav',
	resetClock: 'alert_error-02.wav',
	makeSub: 'navigation_forward-selection-minimal.wav',
};

const howls = Object.keys(SOUNDS).reduce((acc, sound) => ({
	...acc,
	[sound]: new Howl({
		src: [`sounds/${SOUNDS[sound]}`]
	}),
}), {});

export const playSound = (sound) => howls[sound].play();
	
export const stopSound = (sound) => howls[sound].stop();
