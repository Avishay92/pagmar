const font = localStorage.getItem("font");
document.getElementById("font").innerHTML = font;
document.getElementById("synth").innerHTML = localStorage.getItem("synth");

$.get("../how/index.html", function(data){
  $("body").children("#how").html(data);
});

let data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(
  localStorage.getItem("defaultSoundEffects")
);
const brightMode = localStorage.getItem("brightMode");
let blotters = {},
    brightModeOn,
    lastChar = null;
 
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

//fills data with letter and note
alphabeth.forEach(function(value, index) {
  Object.assign(blotters, {
    [value]: {
      blotter: null
    }
  });
});
let playButton = document.querySelector("#play");
let instrument,
  autoWahEffect,
  phaserEffect,
  vibratoEffect,
  pitchEffect,
  distortionEffect,
  chorusEffect;

//initializing instruments and sound effects
instrument = defaultSoundEffects[Object.keys(defaultSoundEffects)[0]];
$("#instrument span").text(instrument);
initializeEffects();
initializeInstrument();
initializeFilterMode();
//html string for all letters
let letterElements = Object.values(data)
  .map(function(value, index) {
    if (!["-",""].includes(value.char)){
      return `<div class="grid__item" data-blotter="${value.char}">
      </div>`;
    }
  })
  .join("");

const gridElement = (document.querySelector(
  ".grid"
).innerHTML = letterElements);

function resetChar(char) {
  let blotter;
  let soundEffects;
  if (data[char]) {
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
  instrument.triggerRelease();
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
    if (!["", "-"].includes(char)) {
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

  Tone.context.resume().then(() => {
      instrument.triggerAttackRelease(data[char].note);
  });
}

WebFont.load({
  google: {
    families: ["Frank Ruhl Libre:700"]
  },
  custom: {
      families: [font],
      urls: ['../../fonts/fonts.css']
  },
  active: function (){
  //builds blotter and insert pointers to data
  $(document).ready(function() {
    const fontSize = 94;
    document
      .querySelectorAll("[data-blotter]")
      .forEach(function(gridItemElement) {
        const style = {
          family: font,
          weight: font === "Frank Ruhl Libre" ? "700" : "normal",
          fill: "#F4F6FA",
          size: fontSize,
          paddingLeft: fontSize / 2,
          paddingRight: fontSize / 2
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
          sChorusEffect: f1
        };
        data[char].soundEffects = Object.assign(
          Object.assign({}, soundEffects),
          data[char].soundEffects
        );
        blotters[char].blotter = blotter;

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
          localStorage.setItem("brightMode", brightModeOn);
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
        if (
          defaultSoundEffects[Object.keys(defaultSoundEffects)[0]] ===
          "MembraneSynth"
        ) {
          if (lastChar !== char) {
            activateChar(char);
            lastChar = char;
          }
        } else {
          activateChar(char);
        }
      }
  });

  $(document).keyup(function(event) {
      var char = event.key; // charCode will contain the code of the character inputted
      if ("א" <= char && char <= "ת") {
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

  $("#info").click(function(){
    $("#how").show();
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