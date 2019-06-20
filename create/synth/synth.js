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
  }
});

function initializeInstrument() {
  instruments.push(new Tone.Synth().toMaster());
  instruments.push(new Tone.MembraneSynth().toMaster());
  instruments.push(new Tone.AMSynth().toMaster());
  instruments.push(new Tone.FMSynth().toMaster());
  instruments.push(new Tone.DuoSynth().toMaster());
}

const f1 = parseFloat(0).toPrecision(2);
const f2 = [f1, f1];
const initValueCycleCount = parseFloat(2).toPrecision(2);
const initValueSineDistortAmplitude = parseFloat(0.03).toPrecision(2);
const initValueuNoiseDistortVolatility = parseFloat(7).toPrecision(2);
const initValueuNoiseDistortAmplitude = parseFloat(0).toPrecision(2);
const f3 = parseFloat(0.5).toPrecision(2);
const initValueDistortPosition = [f3, f3];

const defaultUniforms = {
  uSineDistortCycleCount: initValueCycleCount,
  uSineDistortSpread: f1,
  uSineDistortAmplitude: initValueSineDistortAmplitude,
  uNoiseDistortVolatility: initValueuNoiseDistortVolatility,
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
const numberOfSynths = 5;
let isCardAlreadyChecked = 
{
  
  0:{
    tag: "Synth",
    checked: false,
    color:"#ffbc00"
  },
  1:{
    tag: "MembraneSynth",
    checked: false,
    color:"#0ed09b"
  },
  2:{
    tag: "AMSynth",
    checked: false,
    color:"#0057ff"
  },
  3:{
    tag: "FMSynth",
    checked: false,
    color:"#6e00ff"
  },
  4:{
    tag: "DuoSynth",
    checked: false,
    color:"#ff395d"
  }
}

const $btnContainer = $('.next-btn-container');

$(document).ready(function() {
  let isNextActive = false;

  const $inputs = $('#instrument input');
  const inputs = $inputs.toArray();

  const $labels = $('#instrument label');
  const label = $labels.toArray();

  $('#backBtn').click(() => {
    location.assign("/");
  });

  $("#nextBtn").click(({ target }) => {
    const $target = $(target);

    for (let i = 0; i < numberOfSynths; i++) {
      if (isCardAlreadyChecked[i].checked) {
        selectedInstrument = isCardAlreadyChecked[i].tag;
        break;
      }
    }
    defaultSoundEffects[
      Object.keys(defaultSoundEffects)[0]
    ] = selectedInstrument;
    localStorage.setItem("synth", selectedInstrument);
    localStorage.setItem("data", JSON.stringify(data));
    localStorage.setItem("defaultUniforms", JSON.stringify(defaultUniforms));
    localStorage.setItem(
      "defaultSoundEffects",
      JSON.stringify(defaultSoundEffects)
    );
    location.assign("../../menu");
  });
  for (let k=0; k<numberOfSynths; k++){
    $("#"+k).on('click', function(){
      toggleColor(k);

    });  
  }
});

$(instrumentForm).change( () => {
  $btnContainer.removeClass('disable');
})

let oldCheck;
function toggleColor(i){
  oldCheck=isCardAlreadyChecked[i].checked;
    if (!oldCheck){
      isCardAlreadyChecked[i].checked = true;
      $('#'+i).css("background-color", isCardAlreadyChecked[i].color);
      for (let j=0; j<numberOfSynths;j++){
        if (j!==i){
            $('#'+j).css("background-color",grey);
            isCardAlreadyChecked[j].checked = false;
        }
      }
      $btnContainer.removeClass('disable');
    } 
    else {
      isCardAlreadyChecked[i].checked = false;
      $('#'+i).css("background-color",grey);
      $btnContainer.addClass('disable');
    }
  }
  
  instrumentHovered.forEach(function(value, index) {
    $(value).mouseenter(function() {
      let id = value.id;
      instruments[id].triggerAttackRelease("C4", "4n");
      for (let i=0; i< numberOfSynths;i++){
           $('#'+id).css("background-color", colors[id]);
      }
    });
    $(value).mouseleave(function() {
      let id = value.id;
      for (let i=0; i< numberOfSynths;i++){
      if (isCardAlreadyChecked[id].checked === false)
          $('#'+id).css("background-color", grey);
          break;
      }
    });
  });