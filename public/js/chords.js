// Creates a light show based on piano chord input
// Displays a distinct color for every chord. The colors are randomly
// initialized on startup, but each chord corresponds to a specific color.
// This extends to n hue lights. For example, if you have 2 hue lights,
// the 'A' chord could show up as 'pink' and 'blue'. The 'D#7' chord could
// show up as 'green' and 'orange'.

// stores notes currently held down on piano
var keys = new Set();

// notes -> name
var chords = {};

// chord -> color
var sessionChordColors = {};

// stores velocity of MIDI input to drive intensity of hue lights
var recentVelocities = [];

const MIDI_LOW_A = 21;
const CHORD_ANALYSIS_MINIMUM_SIZE = 3;
const MIDI_MAX_RAW_VELOCIY = 127;

var playing = false;

// Listen to MIDI input
function registerMidiListener() {
	WebMidi.enable(function (err) {
		if (err) {
			console.log("WebMidi could not be enabled.", err);
			return;
		} 

		var input = WebMidi.inputs[0];
		if (input == null) {
			console.log("Could not find midi input");
			return;
		}

		input.addListener('noteon', "all",
			function (e) {
				removeStartMessage();

				var keyNumber = e.note.number-MIDI_LOW_A;
				keys.add(keyNumber);
				recentVelocities.push(e.rawVelocity);
				analyzeKeys();
			}
		);

		input.addListener('noteoff', "all",
			function (e) {
				var keyNumber = e.note.number-MIDI_LOW_A;
				keys.delete(keyNumber);
				recentVelocities.shift();
			}
		);
	});
}

// Given a set of keys, find the chord that it matches to
function analyzeKeys() {
	if (keys.size >= CHORD_ANALYSIS_MINIMUM_SIZE) {
		var candidate = normalize(keys);
		var chordName = "";

		if (candidate.length < CHORD_ANALYSIS_MINIMUM_SIZE) {
			return;
		}

		if (candidate in chords) {
			chordName = chords[candidate];
		} else {
			chordName = candidate.join('-');
		}

		displayChord(chordName);
	}
}

// Given a chord, sort, remove duplicates, and bring into 0-12 range
function normalize(notes) {
	var result = new Set();

	notes.forEach(function(element) {
		if (element >= 12) {
			element = element % 12;
		}

		result.add(element);
	});

	return Array.from(result).sort();
}

// Generate a chord object (name, notes) given a starting note
// and instructions for generating the chord
function generateChord(start, instructions, name) {
	instructions = instructions.map(n => start + n);
	return {'name': name, 'notes': normalize(instructions)};
}

// Add a new chord to the set of chords already defined
function addChord(chord) {
	if (chord.notes in chords) {
		chords[chord.notes].push(chord.name);
	} else {
		chords[chord.notes] = [chord.name];
	}
}

/*
0 4 7 - major 
0 4 7 11 - major seventh
0 3 7 - minor
0 3 7 10 - minor seventh
0 3 6 - diminished
0 3 6 (9) - diminished 9
0 4 8 - augmented
0 4 7 10 - dominant seventh
0 4 7 9 - major sixth
0 3 7 9 - minor sixth
*/
function getChords() {
	for (startingNote=0; startingNote<12; startingNote++) {
		addChord(generateChord(startingNote, [0, 4, 7], getKey(startingNote) + ' major'));
		addChord(generateChord(startingNote, [0, 4, 7, 11], getKey(startingNote) + ' major seventh'));
		addChord(generateChord(startingNote, [0, 3, 7], getKey(startingNote) + ' minor'));
		addChord(generateChord(startingNote, [0, 3, 7, 10], getKey(startingNote) + ' minor seventh'));
		addChord(generateChord(startingNote, [0, 3, 6], getKey(startingNote) + ' diminished'));
		addChord(generateChord(startingNote, [0, 3, 6, 9], getKey(startingNote) + ' dimished 9'));
		addChord(generateChord(startingNote, [0, 4, 8], getKey(startingNote) + ' augmented'));
		addChord(generateChord(startingNote, [0, 4, 7, 10], getKey(startingNote) + ' dominant seventh'));
		addChord(generateChord(startingNote, [0, 4, 7, 9], getKey(startingNote) + ' major sixth'));
		addChord(generateChord(startingNote, [0, 3, 7, 9], getKey(startingNote) + ' minor sixth'));
	}
}

// Get a random color set (one for every light)
function getNewColors() {
	var colors = [];
	for (var color = 0; color < numLights; color++) {
		colors.push(getRandomColor());
	}
	return colors;
}

// Sets randoms colors on app start for each chord
function initializeRandomChordColors() {
	for (var key in chords) {
		var name = chords[key];
		sessionChordColors[name] = getNewColors();
	}
}

function getChordColor(chordName) {
	if (!(chordName in sessionChordColors)) {
		sessionChordColors[chordName] = getNewColors();
	}

	return sessionChordColors[chordName];
}

function getChordVolumePercentage() {
	var sumVelocity = 0;
	recentVelocities.forEach(function(e) {
		sumVelocity += e;
	});
	return (sumVelocity / recentVelocities.length) / MIDI_MAX_RAW_VELOCIY;
}

// Communicate with hue lights
function displayChord(chordName) {
	//console.log('chord', chordName);

	var colors = getChordColor(chordName);

	// display
	document.body.style.backgroundColor = colors[0];

	// lights
	var colorCies = [];
	colors.forEach(function(color) {
		colorCies.push(getHueColor(color));
	});

	changeLight(colorCies, getChordVolumePercentage());
}

function removeStartMessage() {
	if (playing) {
		return;
	}

	document.getElementById('startMessage').style.visibility  = 'hidden'; 
	playing = true;
}

getBridgeUrl();
getBridgeUser();
getColorLights();
getChords();
registerMidiListener();