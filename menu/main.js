const font = localStorage.getItem("font");
const synth = localStorage.getItem("synth");
let data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(
  localStorage.getItem("defaultSoundEffects")
);
const brightMode = localStorage.getItem("brightMode");
let blotters = {},
    brightModeOn;
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
  "-", 
  " "
];

let pressed = [];

//fills data with letter and note
alphabeth.forEach(function(value, index) {
  if (![" ", "-"].includes(value)){
    Object.assign(blotters, {
      [value]: {
        blotter: null
      }
    });
  }
});
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
$("#instrument span").text(instrument);
initializeEffects();
initializeInstrument();
initializeFilterMode();
//html string for all letters
let letterElements = Object.values(data)
  .map(function(value, index) {
    if (![" ", "-"].includes(value)){
    return `<div class="grid__item" data-blotter="${value.char}">
        </div>`;
    }
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
  let blotter;
  let soundEffects;
  if (data[char] && blotters[char]) {
    blotter = blotters[char].blotter;
    soundEffects = data[char].soundEffects;
  }
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
    if (![" ", "-"].includes(char)) {
      var gridItem = document.querySelector(
        `[data-blotter=${data[char].char}]`
      );
      $(gridItem).css("opacity", "0.2");
    }
  }
  if (soundEffects) {
    Object.keys(soundEffects).forEach(function(key, index) {
      if (defaultSoundEffects[key]) {
        let newSound = data[char].soundEffects;
        soundEffects[key] = Number(newSound[key]);
      }
    });
  }
  instrument.triggerRelease(data[char].note);
}

function activateChar(char) {
  let blotter;
  let soundEffects;
  if (data[char]) {
    blotter = blotters[char].blotter;
    soundEffects = data[char].soundEffects;
  }
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
    if (!["-", " "].includes(char)) {
      var gridItem = document.querySelector(
        `[data-blotter=${data[char].char}]`
      );
      $(gridItem).css("opacity", "1");
    }
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

  instrument.triggerAttack(data[char].note);
}

WebFont.load({
  google: {
    families: ["Frank Ruhl Libre:bold"]
  },
  custom: {
      families: [font],
      urls: ['../../fonts/fonts.css']
  },
  active: function (){
  //builds blotter and insert pointers to data
  $(document).ready(function() {

    document.getElementById("font").innerHTML = font;
    document.getElementById("synth").innerHTML = synth;
    document
      .querySelectorAll("[data-blotter]")
      .forEach(function(gridItemElement) {
        const style = {
          family: font,
          weight: font === "Frank Ruhl Libre" ? "bold" : "normal",
          fill: "#F4F6FA",
          size: 94,
          paddingLeft: 60,
          paddingRight: 60
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
        if (blotters[char]){
          blotters[char].blotter = blotter;
        }

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
          localStorage.setItem("data", JSON.stringify(data));
          location.assign("../editor");
        });
        $(playButton).click(function() {
          localStorage.setItem("brightMode", brightModeOn);
          location.assign("../play");
        });
      });
  });

  $(window).on("beforeunload", function() {
    localStorage.setItem("data", JSON.stringify(data));
  });


  $(document).keydown(function(event) {
    var char = event.key; // charCode will contain the code of the character inputted
      if ("א" <= char && char <= "ת") {
        const index = pressed.indexOf(char);
        if (index === -1) {
          pressed.push(char);
       }
          activateChar(char);
      }
  });

  $(document).keyup(function(event) {
      var char = event.key; // charCode will contain the code of the character inputted
      if ("א" <= char && char <= "ת") {

       const index = pressed.indexOf(char);
       if (index > -1) {
         pressed.splice(index, 1);
      }
        resetChar(char);
      }
  });

  $("#backBtn").click(function() {
    location.assign("../create/synth");
  });

  $("#logo").click(function() {
    location.assign("../");
  });

  $("#darkMode").click(function(){
    switchFilterMode();
  });

  $("#resetAll").click(function() {
    Object.keys(data).forEach(function(currChar, index) {
      data[currChar].soundEffects = Object.assign({}, defaultSoundEffects);
      data[currChar].uniforms = Object.assign({}, defaultUniforms);
      let blotter = blotters[currChar].blotter;
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
  });
}});
