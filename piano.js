// generates an array where indices correspond to midi notes
var everyNote = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B,'.repeat(20).split(',').map( function(x,i) {
    return x + '' + Math.floor(i/12);
});

//returns the midi pitch value for the given note.
//returns -1 if not found
function toMidi(note) {
    return everyNote.indexOf(note);
}

const synth = new Tone.Synth();

var type = ['sine', 'triangle', 'square', 'sawtooth'],
	partial = 0,
	enablePartial = false,
	vol = 50;

function changeType(type, enablePartial = false, partial = '') {
	if (!enablePartial) partial = '';
	synth.oscillator.type = type + partial;
	// document.getElementById('type').textContent = synth.oscillator.type.toUpperCase();
}

changeType(type[0], enablePartial, partial);
synth.volume.value -= 20;
// document.getElementById('vol').textContent = vol;

document.addEventListener('keydown', (e) => {
	var keyCode = e.code,
		arrow = { left: 37, up: 38, right: 39, down: 40, space: 32 };

	switch (keyCode) {
		case arrow.up:
			if (vol < 100) {
				synth.volume.value += 2;
				vol += 5;
			}
			break;
		case arrow.down:
			if (vol > 10) {
				synth.volume.value -= 2;
				vol -= 5;
			}
			break;
		case arrow.left:
			type.unshift(type.pop());
			break;
		case arrow.right:
			type.push(type.shift());
			break;
		default:
			return;
	}
	changeType(type[0], enablePartial);
	document.getElementById('vol').textContent = vol;
});

synth.toDestination();

// mouse play events
var clickedKey;

document.getElementById('piano').addEventListener('mousedown', (e) => {
	synth.triggerAttack(e.target.dataset.note);
	clickedKey = e.target.id;
	e.target.classList.add('active');
});
document.addEventListener('mouseup', (e) => {
	synth.triggerRelease();
	document.getElementById(clickedKey).classList.remove('active');
});

var userInNoteSequence = [32, 64, 32, 64, 32, 64, 32, 64, 32, 64, 32, 64, 32, 64, 32, 64];

// keyboard play events
var pressingKeys = [],
	keys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'w', 'e', 't', 'y', 'u', 'o', 'p'];

document.addEventListener('keydown', (e) => {
	if (keys.includes(e.key)) {
		synth.triggerAttack(document.getElementById(e.key).dataset.note);

        userInNoteSequence.pop();
        userInNoteSequence.unshift(toMidi(document.getElementById(e.key).dataset.note));

        melodySelectors.forEach(function(selector){
            updateSelector(selector, true, true);
        });

		pressingKeys.push(e.key);
		document.getElementById(e.key).classList.add('active');
	}
});
document.addEventListener('keyup', (e) => {
	if (keys.includes(e.key)) {
		if (pressingKeys.includes(e.key)) synth.triggerRelease();
		pressingKeys = pressingKeys.filter((item) => item !== e.key);
		document.getElementById(e.key).classList.remove('active');
	}
});

// lab requirement: use z x c v to tune the oscillations
// here changes the oscillations' partial count
// intentionally hidden from user
document.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'z':
			changeType(type[0], true, 4);
			return;
		case 'x':
			changeType(type[0], true, 8);
			return;
		case 'c':
			changeType(type[0], true, 16);
			return;
		case 'v':
			changeType(type[0], true, 32);
			return;
	}
});
