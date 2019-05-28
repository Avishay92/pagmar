let data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(
  localStorage.getItem("defaultSoundEffects")
);
let darkModeOn = 0;
let playButton = document.querySelector("#play");
let instrument,
  autoWahEffect,
  phaserEffect,
  vibratoEffect,
  reverbEffect,
  pitchEffect,
  distortionEffect,
  feedbackEffect,
  tremoloEffect;
//initializing instruments and sound effects
instrument = defaultSoundEffects[Object.keys(defaultSoundEffects)[0]];
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
    Object.values(blotter._scopes)[0].render();

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

    Object.values(blotter._scopes)[0].render();

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

//builds blotter and insert pointers to data
$(document).ready(function() {
  document
    .querySelectorAll("[data-blotter]")
    .forEach(function(gridItemElement) {
      const style = {
        family: "Frank Ruhl Libre",
        //weight: "bold",
        fill: "#F4F6FA",
        size: 94,
        paddingLeft:60,
        paddingRight: 60

      };
      const char = gridItemElement.dataset.blotter;
      let material = new Blotter.RollingDistortMaterial();
      const text = new Blotter.Text(char, style);
      const blotter = new Blotter(material, {
        texts: text,
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
      $(playButton).click(function() {
        location.assign("../play");
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

$("#darkMode").click(function(){
  var body = document.querySelector("body");

  var filter, background, mode;
  if(darkModeOn==0){
    filter = "invert(1)";
    background = "white";
    mode = "Dark Mode"
  }
  if(darkModeOn==1){
    filter = "none";
    background = "black";
    mode = "Bright Mode"
  }
  $('.grid').css("filter", filter);
  $(body).css("background", background);
  $('#darkMode span').text(mode);
  darkModeOn = !darkModeOn;
})

$("#resetAll").click(function () {
  Object.keys(data).forEach(function (currChar){
    data[currChar].soundEffects = defaultSoundEffects;
    data[currChar].uniforms = defaultUniforms;
    let blotter= data[currChar].blotter;
    Object.keys(blotter.material.uniforms).forEach(function(key, index) {
        if (defaultUniforms[key]) {
          if (key === "uDistortPosition") {
            blotter.material.uniforms[key].value = [
              Number(defaultUniforms[key][0]),
              Number(defaultUniforms[key][1])
            ];
          } else {
            blotter.material.uniforms[key].value = Number(defaultUniforms[key]);
          }
        }
      });
      Object.values(blotter._scopes)[0].render();
    });
  }

  )
 