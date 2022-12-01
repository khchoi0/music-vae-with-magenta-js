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
		arrow = { left: "ArrowLeft", up: "ArrowUp", right: "ArrowRight", down: "ArrowDown", space: "Space" };

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

var userInNoteSequence = [60, 60, 67, 67, 69, 69, 67, 67, 65, 65, 64, 64, 62, 62, 60,];

// mouse play events
var clickedKey;

document.getElementById('piano').addEventListener('mousedown', (e) => {
	e.target.classList.add('active');
	clickedKey = e.target.id;

	synth.triggerAttack(e.target.dataset.note);

    userInNoteSequence.shift();
    userInNoteSequence.push(toMidi(e.target.dataset.note));

    document.activeElement.blur();

    var melodySelectors = document.querySelectorAll('.drop-down');
    var selector1 = melodySelectors[0];
    updateSelector(selector1, true, true);
    selector1.value = "Customize";
});
document.addEventListener('mouseup', async (e) => {
	synth.triggerRelease();
    // await new Promise(r => setTimeout(r, 100));
	document.getElementById(clickedKey).classList.remove('active');
});

// keyboard play events
var pressingKeys = [],
	keys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'w', 'e', 't', 'y', 'u', 'o', 'p'];

document.addEventListener('keydown', (e) => {
	if (keys.includes(e.key)) {
		document.getElementById(e.key).classList.add('active');
		pressingKeys.push(e.key);

		synth.triggerAttack(document.getElementById(e.key).dataset.note);

        userInNoteSequence.shift();
        userInNoteSequence.push(toMidi(document.getElementById(e.key).dataset.note));

        document.activeElement.blur();

        var melodySelectors = document.querySelectorAll('.drop-down');
        var selector1 = melodySelectors[0];
        updateSelector(selector1, true, true);
        selector1.value = "Customize";
	}
});
document.addEventListener('keyup', async (e) => {
	if (keys.includes(e.key)) {
		if (pressingKeys.includes(e.key)) synth.triggerRelease();
		pressingKeys = pressingKeys.filter((item) => item !== e.key);
        // await new Promise(r => setTimeout(r, 100));
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
