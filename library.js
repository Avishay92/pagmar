const white = "#ffffff";
const black = "#161616";
const lightGrey = "#c9c8c8";
const darkGrey = "#202020";
function initializeInstrument() {
  switch (instrument) {
    case "synth":
      instrument = new Tone.Synth().connect(chorusEffect);
      break;
    case "DuoSynth":
      instrument = new Tone.DuoSynth().connect(chorusEffect);
      break;
    case "MembraneSynth":
      instrument = new Tone.MembraneSynth().connect(chorusEffect);
      break;
    case "AMSynth":
      instrument = new Tone.AMSynth().connect(chorusEffect);
      break;
    case "FMSynth":
      instrument = new Tone.FMSynth().connect(chorusEffect);
      break;
    default:
      instrument = new Tone.Synth().connect(chorusEffect);
      break;
  }
}

function initializeEffects() {
  autoWahEffect = new Tone.AutoWah(50, 6, -30).toMaster();
  phaserEffect = new Tone.Phaser(15, 5, 1000).chain(autoWahEffect);
  vibratoEffect = new Tone.Vibrato(5, 0.1).chain(phaserEffect);
  pitchEffect= new Tone.PitchShift().chain(vibratoEffect);
  distortionEffect = new Tone.Distortion(0.8).chain(pitchEffect);
  chorusEffect = new Tone.Effect(0).chain(distortionEffect);
}

function updateEffects(soundEffects) {
  Object.keys(soundEffects).forEach(function(key, index) {
    switch (key) {
      case "sAutoWahEffect":
        autoWahEffect.octaves = soundEffects[key];
        break;
      case "sPhaserEffect":
        phaserEffect.octaves = soundEffects[key];
        
        break;
      case "sVibratoEffect":
        vibratoEffect.depth.value = soundEffects[key];
        break;
      case "sReverbEffect":
        break;
      case "sPitchEffect":
        pitchEffect.pitch = soundEffects[key];

        break;
      case "sDistortionEffect":
        distortionEffect.distortion = soundEffects[key];
        break;
      case "sFeedbackEffect":
        break;
    case "sChorusEffect":
      chorusEffect.order = soundEffects[key];
        break;
    }
  });
}

const effectRanges = {
  uSineDistortSpread:{   //autoWah
      minVisual: 0.067,
<<<<<<< HEAD
      maxVisual: 1,
      minSound: 3,
      maxSound: 10,
=======
      maxVisual: 0.90,
      minSound: 4,
      maxSound: 8,
>>>>>>> 1a5fad64165ed60aa037d0f7b1636f4643ffa060
  },
  uSineDistortCycleCount: { //phaser
      minVisual: 60,
      maxVisual: 200,
      minSound: 0,
      maxSound: 8,
  },
  uSineDistortAmplitude: { //vibrato
      minVisual: 0,
      maxVisual: 1,
      minSound: 0,
      maxSound: 10,
  },
  uNoiseDistortVolatility: { //reverb
      minVisual: 1,
<<<<<<< HEAD
      maxVisual: 80,
=======
      maxVisual: 30,
>>>>>>> 1a5fad64165ed60aa037d0f7b1636f4643ffa060
      minSound: 0,
      maxSound: 2,
  },
  uNoiseDistortAmplitude: { //pitch
      minVisual: 0.008,
      maxVisual: 1,
      minSound: 0,
      maxSound: 24,
  },
  uRotation: { //chorus
      minVisual: 0,
      maxVisual: 180,
      minSound: 0,
      maxSound: 0.8,
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