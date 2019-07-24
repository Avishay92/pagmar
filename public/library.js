const white = "#ffffff";
const black = "#161616";
const lightGrey = "#c9c8c8";
const darkGrey = "#202020";
function initializeInstrument() {
  switch (instrument) {
    case "synth":
      instrument = new Tone.Synth().connect(reverbEffect);
      break;
    case "DuoSynth":
      instrument = new Tone.DuoSynth().connect(reverbEffect);
      break;
    case "MembraneSynth":
      instrument = new Tone.MembraneSynth().connect(reverbEffect);
      break;
    case "AMSynth":
      instrument = new Tone.AMSynth().connect(reverbEffect);
      break;
    case "FMSynth":
      instrument = new Tone.FMSynth().connect(reverbEffect);
      break;
    default:
      instrument = new Tone.Synth().connect(reverbEffect);
      break;
  }
}

function initializeEffects() {
  autoWahEffect = new Tone.AutoWah(50, 6, -30).toMaster();
  phaserEffect = new Tone.Phaser(15, 5, 1000).chain(autoWahEffect);
  vibratoEffect = new Tone.Vibrato(5, 0.1).chain(phaserEffect);
  pitchEffect= new Tone.PitchShift().chain(vibratoEffect);
  distortionEffect = new Tone.Distortion(0).chain(pitchEffect);
  reverbEffect = new Tone.Freeverb({
    roomSize  : 0.2 ,
    dampening  : 1000
    }).chain(distortionEffect);
}

function updateEffects(soundEffects) {
  Object.keys(soundEffects).forEach(function(key, index) {
    switch (key) {
      case "sAutoWahEffect":
        autoWahEffect.baseFrequency.value = soundEffects[key];
        break;
      case "sPhaserEffect":
        phaserEffect.octaves = soundEffects[key];
        break;
      case "sVibratoEffect":
        vibratoEffect.frequency = soundEffects[key];
        break;
      case "sPitchEffect":
        pitchEffect.pitch = soundEffects[key];
        break;
      case "sDistortionEffect":
        distortionEffect.distortion = soundEffects[key];
        break;
      case "sReverbEffect":
        reverbEffect.roomSize.input.value = soundEffects[key];
        // reverbEffect.dampening.input.value = 10000;
        break;
    }
  });
}

const effectRanges = {
  uSineDistortSpread:{   //autoWah
      minVisual: 0.067,
      maxVisual: 0.9,
      minSound: 3,
      maxSound: 10,
  },
  uSineDistortCycleCount: { //phaser
      minVisual: 0,
      maxVisual: 200,
      minSound: 0,
      maxSound: 8,
  },
  uSineDistortAmplitude: { //vibrato
      minVisual: 0,
      maxVisual: 0.3,
      minSound: 0,
      maxSound: 10,
  },
  uNoiseDistortVolatility: { //reverb
      minVisual: 1,
      maxVisual: 30,
      minSound: 0,
      maxSound: 1,
  },
  uNoiseDistortAmplitude: { //pitch
      minVisual: 0.008,
      maxVisual: 1,
      minSound: 0,
      maxSound: 24,
  },
  uRotation: { //Reverb
      minVisual: 1,
      maxVisual: 180,
      minSound: 0,
      maxSound: 0.6,
  },
  uDistortPositionX:{ //Distortion
      minVisual: 0,
      maxVisual: 1,
      minSound: 0,
      maxSound: 1,
  },
  uDistortPositionY:{ //Feedback
      minVisual: 0,
      maxVisual: 1,
      minSound: 0,
      maxSound: 1,
  },
}

const f1 = parseFloat(0).toPrecision(2);



function initializeFilterMode(){
  if(brightMode==="true"){
    brightModeOn = 0;
  }
  else{
    brightModeOn = 1;
  }
  switchFilterMode();
}

function switchFilterMode() {
  brightModeOn = !brightModeOn;
  $(".word div").css("color", brightModeOn ? lightGrey : darkGrey);
  let remove = 'bright-mode',
  add = 'dark-mode';
  if (brightModeOn){
    remove = 'dark-mode';
    add = 'bright-mode';
  }
  $("body").removeClass(remove);
  $("body").addClass(add);
  $(".grid").css("filter", brightModeOn ? "invert(1)" : "none");
  $("#darkMode span").text(brightModeOn ? "Bright Mode" : "Dark Mode");
}