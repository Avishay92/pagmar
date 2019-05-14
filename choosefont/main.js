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

const defaultUniforms = {
  uSineDistortSpread: 0.354,
  uSineDistortCycleCount: 5,
  uSineDistortAmplitude: 0,
  uNoiseDistortVolatility: 0,
  uNoiseDistortAmplitude: 0.168,
  uDistortPosition: [0.38, 0.68],
  uRotation: 48,
  uSpeed: 0.421
};

let data = {};
let noteIndex = 0;

let pitchTry = new Tone.PitchShift().toMaster();
let synth = new Tone.Synth().connect(pitchTry);

//fills data with letter and note
alphabeth.forEach(function(value, index) {
  Object.assign(data, {
    [value]: { note: `${notes[noteIndex]}${octave}`, effects: [], char: value }
  });
  if (noteIndex === notes.length - 1) {
    noteIndex = 0;
    octave++;
  } else {
    noteIndex++;
  }
});

//html string for all letters
let letterElements = Object.values(data)
  .map(function(value, index) {
    return `<div class="grid__item" data-blotter="${value.char}">
      </div>`;
  })
  .join("");

const gridElement = (document.querySelector(
  ".grid"
).innerHTML = letterElements);

function resetChar(char) {
  let blotter = data[char] && data[char].blotter;
  if (blotter) {
    let material = blotter.material;
    material.uniforms.uSineDistortCycleCount.value = 0;
    material.uniforms.uSineDistortSpread.value = 0;
    material.uniforms.uSineDistortAmplitude.value = 0;
    material.uniforms.uNoiseDistortVolatility.value = 0;
    material.uniforms.uNoiseDistortAmplitude.value = 0;
    material.uniforms.uDistortPosition.value = [0, 0]; // this is the [X,Y] position;
    material.uniforms.uRotation.value = 0;
    material.uniforms.uSpeed.value = 0;
    blotter.needsUpdate = true;
    var gridItem = document.querySelector(`[data-blotter=${data[char].char}]`);
    $(gridItem).css('opacity', '0.7');
  }
}

function activateChar(char) {
  let blotter = data[char] && data[char].blotter;
  if (blotter) {
    let material = blotter.material;
    material.uniforms.uSineDistortCycleCount.value = 10;
    material.uniforms.uSineDistortSpread.value = 0.0;
    material.uniforms.uSineDistortAmplitude.value = 1;
    material.uniforms.uNoiseDistortVolatility.value = 90.0;
    material.uniforms.uNoiseDistortAmplitude.value = 0.09;
    material.uniforms.uDistortPosition.value = [7, 0.03]; // this is the [X,Y] position;
    material.uniforms.uRotation.value = 370.0;
    material.uniforms.uSpeed.value = 0.18;
    blotter.needsUpdate = true;
    const note = data[char].note;
    Tone.context.resume().then(()=>{
        synth.triggerAttackRelease(note, '4n');
    })
    var gridItem = document.querySelector(`[data-blotter=${data[char].char}]`);
    $(gridItem).css('opacity', '1');
  }
}

//builds blotter and insert pointers to data
$(document).ready(function() {
  document
    .querySelectorAll("[data-blotter]")
    .forEach(function(gridItemElement) {
      const style = {
        family: "Frank Ruhl Libre",
        fill: "#fff",
        size: 140
      };
      const char = gridItemElement.dataset.blotter;
      let material = new Blotter.RollingDistortMaterial();
      const text = new Blotter.Text(char, style);
      const blotter = new Blotter(material, { texts: text });
      data[char].blotter = blotter;
      resetChar(char);
      const scope = blotter.forText(text);
      scope.appendTo(gridItemElement);
      $(gridItemElement).mouseenter(function() {
        activateChar(char);
      });
      $(gridItemElement).mouseleave(function() {
        resetChar(char);
      });
      $(gridItemElement).click(function(){
        // localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("char", char);
        location.assign("../editor")
      })
    });
});

$(document).keydown(function(event) {
  var char = event.key; // charCode will contain the code of the character inputted
  activateChar(char);
});

$(document).keyup(function(event) {
  var char = event.key; // charCode will contain the code of the character inputted
  resetChar(char);
});
