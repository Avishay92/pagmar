let data = {};
let noteIndex = 0;

const notes = ["C", "D", "E", "F", "G", "A", "B"];
let octave = 4;
const alphabeth = [
    "א",
    "ב",
    "ג",
    "ד",
    "ה",
    "ו",
    "ז",
    "ח",
    "ט",
    "י",
    "כ",
    "ל",
    "מ",
    "ם",
    "נ",
    "ן",
    "ס",
    "ע",
    "פ",
    "ף",
    "צ",
    "ץ",
    "ק",
    "ר",
    "ש",
    "ת"
];

//fills data with letter and note
alphabeth.forEach(function (value, index) {
    Object.assign(data, {
        [value]: {
            note: `${notes[noteIndex]}${octave}`,
            effects: [],
            char: value
        }
    });
    if (noteIndex === notes.length - 1) {
        noteIndex = 0;
        octave++;
    } else {
        noteIndex++;
    }
});

const f1 = parseFloat(0).toPrecision(2);
const f2 = [f1, f1];

const defaultUniforms = {
    uSineDistortCycleCount: f1,
    uSineDistortSpread: f1,
    uSineDistortAmplitude: f1,
    uNoiseDistortVolatility: f1,
    uNoiseDistortAmplitude: f1,
    uRotation: f1,
    uSpeed: f1,
    uDistortPosition: f2,
}

const defaultSoundEffects= {instrument:"synth", pitchEffect:f1 , wetEffect:f1, distortionEffect:f1};

$("button").click(function () {
    localStorage.setItem("data", JSON.stringify(data));
    localStorage.setItem("defaultUniforms", JSON.stringify(defaultUniforms));
    localStorage.setItem("defaultSoundEffects", JSON.stringify(defaultSoundEffects));
    location.assign("../menu");
});
