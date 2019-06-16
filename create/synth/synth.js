let data = {};
let noteIndex = 0;
let instruments = [];
const notes = ["C", "D", "E", "F", "G", "A", "B"];
let octave = 3;
let grey = "#202020";
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
  if (value === " ") {
    data[" "].note = null;
    console.log(data);
  }
});

function initializeInstrument() {
  instruments.push(new Tone.Synth().toMaster());
  instruments.push(new Tone.DuoSynth().toMaster());
  instruments.push(new Tone.MembraneSynth().toMaster());
  instruments.push(new Tone.AMSynth().toMaster());
  instruments.push(new Tone.FMSynth().toMaster());
}

const f1 = parseFloat(0).toPrecision(2);
const f2 = [f1, f1];
const initValueCycleCount = parseFloat(2).toPrecision(2);
const initValueSineDistortAmplitude = parseFloat(0.13).toPrecision(2);
const initValueuNoiseDistortVolatility = parseFloat(7).toPrecision(2);
const initValueuNoiseDistortAmplitude = parseFloat(0.01).toPrecision(2);
const f3 = parseFloat(0.5).toPrecision(2);
const initValueDistortPosition = [f3, f3];

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

initializeInstrument();

var instrumentHovered = document.querySelectorAll(".card");

instrumentHovered.forEach(function(value, index) {
  $(value).mouseenter(function() {
    let id = value.id;
    instruments[id].triggerAttackRelease("C4", "4n");
  });
});
// --clr-Synth: #ffbc00;
// --clr-MembraneSynth: #0ed09b;
// --clr-AMSynth: #0057ff;
// --clr-FMSynth: #6e00ff;
// --clr-DuoSynth: #ff395d;

let isCardAlreadyChecked = 
// [true, true, true, true, true];
{
  
  0:{
    tag: "Synth",
    checked: true,
    color:"#ffbc00"
  },
  1:{
    tag: "MembraneSynth",
    checked: true,
    color:"#0ed09b"
  },
  2:{
    tag: "AMSynth",
    checked: true,
    color:"#0057ff"
  },
  3:{
    tag: "FMSynth",
    checked: true,
    color:"#6e00ff"
  },
  4:{
    tag: "DuoSynth",
    checked: true,
    color:"#ff395d"
  },
}
  

$(document).ready(function() {
  let isNextActive = false;
  const $btnContainer = $('.next-btn-container');

  const $inputs = $('#instrument input');
  const inputs = $inputs.toArray();

  const $labels = $('#instrument label');
  const label = $labels.toArray();



    
  $('#backBtn').click(() => {
    location.assign("/");
  });

  $("#nextBtn").click(({ target }) => {
    const $target = $(target);

    for (let i = 0; i < instrumentForm.elements.length; i++) {
      if (instrumentForm.elements[i].checked) {
        selectedInstrument = instrumentForm.elements[i].value;
        break;
      }
    }
    defaultSoundEffects[
      Object.keys(defaultSoundEffects)[0]
    ] = selectedInstrument;
    localStorage.setItem("data", JSON.stringify(data));
    localStorage.setItem("defaultUniforms", JSON.stringify(defaultUniforms));
    localStorage.setItem(
      "defaultSoundEffects",
      JSON.stringify(defaultSoundEffects)
    );
    location.assign("../../menu");
  });


  $(instrumentForm).change( () => {
    $btnContainer.removeClass('disable');
  })
});

let oldCheck;

$(".card").on('click', function() {
  for (let i = 0; i < instrumentForm.elements.length; i++) {
    console.log(isCardAlreadyChecked[i].color);     

    if (instrumentForm.elements[i].checked) {
      oldCheck=isCardAlreadyChecked[i].checked;
      if (oldCheck){
        isCardAlreadyChecked[i].checked = false;
        instrumentForm.elements[i].checked = false;
        console.log('#'+isCardAlreadyChecked[i].tag);
        $('#'+i).css("background-color",grey);

      } 
      else {
        isCardAlreadyChecked[i] = true;

        // $('#'+i).css("background-color",isCardAlreadyChecked[i].color);
      }
      break;  
    }
  }

})