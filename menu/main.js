let data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(
  localStorage.getItem("defaultSoundEffects")
);

//html string for all letters
let letterElements = Object.values(data)
  .map(function(value, index) {
    return `<div class="grid__item" data-blotter="${value.char}">
        </div>`;
  })
  .join("");

//let pitchEffect = new Tone.PitchShift().toMaster();
// instrument = new Tone.Synth().toMaster();
// var env = new Tone.Envelope({
//   "attack": 0.5,
//   "decay": 0.5,
//   "sustain": 0.2,
//   "release": 0.2,
// });

let instrument = defaultSoundEffects[Object.keys(defaultSoundEffects)[0]];
initializeEffects();
initializeInstrument();

const gridElement = (document.querySelector(
  ".grid"
).innerHTML = letterElements);

function resetChar(char) {
  let blotter = data[char] && data[char].blotter;
  if (blotter) {
    let material = blotter.material;
    Object.keys(material.uniforms).forEach(function(key, index) {
      if (defaultUniforms[key]) {
        if (key === "uDistortPosition") {
          material.uniforms[key].value = [
            Number(defaultUniforms[key][0]),
            Number(defaultUniforms[key][1])
          ];
        } else {
          material.uniforms[key].value = Number(defaultUniforms[key]);
        }
      }
    });
    blotter.needsUpdate = true;
    var gridItem = document.querySelector(`[data-blotter=${data[char].char}]`);
    $(gridItem).css("opacity", "0.2");
    instrument.triggerRelease();
  }
}

function activateChar(char) {
  let blotter = data[char] && data[char].blotter;
  if (blotter) {
    let material = blotter.material;
    let uniforms = Object.assign(
      Object.assign({}, defaultUniforms),
      data[char].uniforms
    );
    Object.keys(material.uniforms).forEach(function(key, index) {
      if (defaultUniforms[key]) {
        if (key === "uDistortPosition") {
          material.uniforms[key].value = [
            Number(uniforms[key][0]),
            Number(uniforms[key][1])
          ];
        } else {
          material.uniforms[key].value = Number(uniforms[key]);
        }
      }
    });
    blotter.needsUpdate = true;
    const note = data[char].note;
    Tone.context.resume().then(() => {
      instrument.triggerAttackRelease(note);
    });
    var gridItem = document.querySelector(`[data-blotter=${data[char].char}]`);
    $(gridItem).css("opacity", "1");
  }
}

//builds blotter and insert pointers to data
$(document).ready(function() {
  document
    .querySelectorAll("[data-blotter]")
    .forEach(function(gridItemElement) {
      const style = {
        family: "Frank Ruhl Libre",
        //weight: "bold",
        fill: "#fff",
        size: 100
      };
      const char = gridItemElement.dataset.blotter;
      let material = new Blotter.RollingDistortMaterial();
      const text = new Blotter.Text(char, style);
      const blotter = new Blotter(material, {
        texts: text
      });
      data[char].blotter = blotter;
      //data[char].soundEffects = defaultSoundEffects;
      resetChar(char);
      const scope = blotter.forText(text);
      scope.appendTo(gridItemElement);
      $(gridItemElement).mouseenter(function() {
        activateChar(char);
      });
      $(gridItemElement).mouseleave(function() {
        resetChar(char);
      });
      $(gridItemElement).click(function() {
        localStorage.setItem("char", char);
        location.assign("../editor");
      });
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

$("#logo").click(function() {
  location.assign("../");
});

function initializeInstrument() {
  switch (instrument) {
    case "synth":
      instrument = new Tone.Synth().connect(pitchEffect);
      break;
    case "metalSynth":
      instrument = new Tone.MetalSynth().connect(pitchEffect);
      break;
    case "AMSynth":
      instrument = new Tone.AMSynth().connect(pitchEffect);
      break;
    default:
      instrument = new Tone.Synth().connect(pitchEffect);
      break;
  }
}

function initializeEffects() {
  Object.keys(defaultSoundEffects).forEach(function(key, index) {
    console.log("got here");
    if (defaultSoundEffects[key]) {
      if (key === "pitchEffect") {
        pitchEffect = new Tone.PitchShift().toMaster();
        console.log(pitchEffect.pitch);
      }
      if (key === "wetEffect") {
        wetEffect = new Tone.Effect(0.9).chain(pitchEffect);
      }
      if (key === "distortionEffect") {
        distortionEffect = new Tone.Distortion(0.8).chain(wetEffect);
      }
    }
  });
}
