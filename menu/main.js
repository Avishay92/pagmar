let data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(
  localStorage.getItem("defaultSoundEffects")
);
let instrument,
  autoWahEffect,
  phaserEffect,
  vibratoEffect,
  reverbEffect,
  pitchEffectEffect,
  distortionEffect,
  feedbackEffect,
  tremoloEffect;
//initializing instruments and sound effects
instrument = defaultSoundEffects[Object.keys(defaultSoundEffects)[0]];
console.log(instrument);
initializeEffects();
initializeInstrument();

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
  let soundEffects = data[char] && data[char].soundEffects;
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
  }
  if (soundEffects) {
    Object.keys(soundEffects).forEach(function(key, index) {
      if (defaultSoundEffects[key]) {
        let newSound = data[char].soundEffects;
        soundEffects[key] = Number(newSound[key]);
      }
    });
  }
  updateEffects(soundEffects);
  instrument.triggerRelease();
}

function activateChar(char) {
  let blotter = data[char] && data[char].blotter;
  let soundEffects = data[char] && data[char].soundEffects;
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

    var gridItem = document.querySelector(`[data-blotter=${data[char].char}]`);
    $(gridItem).css("opacity", "1");
  }

  if (soundEffects) {
    let savedSoundEffects = Object.assign(
      Object.assign({}, defaultSoundEffects),
      data[char].soundEffects
    );
    Object.keys(soundEffects).forEach(function(key, index) {
      if (defaultSoundEffects[key]) {
        soundEffects[key] = Number(savedSoundEffects[key]);
      }
    });
  }
  updateEffects(soundEffects);
  const note = data[char].note;
  Tone.context.resume().then(() => {
    instrument.triggerAttackRelease(note);
  });
}
const f1 = parseFloat(0).toPrecision(2);

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
      let soundEffects = {
        sAutoWahEffect: f1,
        sPhaserEffect: f1,
        sVibratoEffect: f1,
        sReverbEffect: f1,
        sPitchEffect: f1,
        sDistortionEffect: f1,
        sFeedbackEffect: f1,
        sTremoloEffect: f1
      };
      data[char].soundEffects = Object.assign(
        Object.assign({}, soundEffects),
        data[char].soundEffects
      );
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

function initializeEffects() {
  autoWahEffect = new Tone.AutoWah(50, 6, -30).toMaster();
  phaserEffect = new Tone.Phaser(15, 5, 1000).chain(autoWahEffect);
  vibratoEffect = new Tone.Vibrato(5, 0.1).chain(phaserEffect);
  // reverbEffect = new Tone.Reverb(0).chain(vibratoEffect);
  pitchEffect= new Tone.PitchShift().chain(vibratoEffect);
  distortionEffect = new Tone.Distortion(0.8).chain(pitchEffect);
  //feedbackEffect = new Tone.FeedbackEffect(0.125).chain(distortionEffect);
  tremoloEffect = new Tone.Tremolo(9, 0.75).chain(distortionEffect);
}

function initializeInstrument() {
  switch (instrument) {
    case "synth":
      instrument = new Tone.Synth().connect(tremoloEffect);
      break;
    case "metalSynth":
      instrument = new Tone.MetalSynth().connect(tremoloEffect);
      break;
    case "AMSynth":
      instrument = new Tone.AMSynth().connect(tremoloEffect);
      break;
    case "monoSynth":
      instrument = new Tone.MonoSynth().connect(tremoloEffect);
      break;
    case "polySynth":
      instrument = new Tone.PolySynth().connect(tremoloEffect);
      break;
    default:
      instrument = new Tone.Synth().connect(tremoloEffect);
      break;
  }
}

function updateEffects(soundEffects) {
  Object.keys(soundEffects).forEach(function(key, index) {
    switch(key){
      case "sAutoWahEffect":
      autoWahEffect.octaves.value = soundEffects[key];
        break;
      case "sPhaserEffect":
        phaserEffect.octaves = soundEffects[key];
        break;
      case "sVibratoEffect":
        vibratoEffect.frequency = soundEffects[key];
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
      case "sTremoloEffect":
        tremoloEffect.frequency = soundEffects[key];
        break;
    }
  });
}
