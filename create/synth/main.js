let data = {};
let noteIndex = 0;

const notes = ["C", "D", "E", "F", "G", "A", "B"];
let octave = 3;
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
  "ך",
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
  "ת",
  " "
];

//fills data with letter and note
alphabeth.forEach(function(value, index) {
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
const initValueCycleCount= parseFloat(2).toPrecision(2);
const initValueSineDistortAmplitude= parseFloat(0.13).toPrecision(2);
const initValueuNoiseDistortVolatility= parseFloat(7).toPrecision(2);
const initValueuNoiseDistortAmplitude= parseFloat(0.01).toPrecision(2);
const f3= parseFloat(0.5).toPrecision(2);
const initValueDistortPosition= [f3,f3];

const defaultUniforms = {
 uSineDistortCycleCount: initValueCycleCount,
 uSineDistortSpread: f1,
 uSineDistortAmplitude: initValueSineDistortAmplitude,
 uNoiseDistortVolatility: f1,
 uNoiseDistortAmplitude: initValueuNoiseDistortAmplitude,
 uRotation: f1,
 uSpeed: f1,
//  uSpeed: parseFloat(f1).toPrecision(2),
 uDistortPosition: initValueDistortPosition
};

let instrumentForm = document.querySelector("#instrument");
let selectedInstrument = instrumentForm.elements[0].value;
let defaultSoundEffects = {
  instrument: selectedInstrument,
  sAutoWahEffect: f1,
  sPhaserEffect: f1,
  sVibratoEffect: f1,
  sReverbEffect: f1,
  sPitchEffect: f1,
  sDistortionEffect: f1,
  sFeedbackEffect: f1,
  sTremoloEffect: f1
};


$("button#next").click(function() {
  for (let i = 0; i < instrumentForm.elements.length; i++) {
    if (instrumentForm.elements[i].checked) {
      selectedInstrument = instrumentForm.elements[i].value;
      break;
    }
  }
  defaultSoundEffects[Object.keys(defaultSoundEffects)[0]] = selectedInstrument;
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("defaultUniforms", JSON.stringify(defaultUniforms));
  localStorage.setItem(
    "defaultSoundEffects",
    JSON.stringify(defaultSoundEffects)
  );
});
