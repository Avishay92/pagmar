const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(
  localStorage.getItem("defaultSoundEffects")
);
const brightMode = localStorage.getItem("brightMode");
$(".back").click(function () {
  localStorage.setItem("data", JSON.stringify(data));
  location.assign("../menu");
});
$(".word").children().length = 0;

let instrument,
  autoWahEffect,
  phaserEffect,
  vibratoEffect,
  reverbEffect,
  pitchEffect,
  distortionEffect,
  feedbackEffect,
  tremoloEffect;
instrument = defaultSoundEffects[Object.keys(defaultSoundEffects)[0]];

let input,
  playPressed = 1,
  inputData = [],
  index = 0,
  fontSize = 200,
  letterSpace = 0,
  wordSpace = 50,
  tempo = 80,
  addedNull = 0,
  addedSpace = 0,
  brightModeOn,
  tempoRange = document.querySelector("#tempo");

tempoRange.value = tempo;
document.getElementById("tempo-val").innerHTML = tempo;
colorRange(tempo);
initializeEffects();
initializeInstrument();
initializeFilterMode();

let blotter, char;


function updateFontSize(fontSize) {
  $("#font-size").val((fontSize / 10));
  if (inputData.length !== 0) {
    for (let i = 0; i < inputData.length; i++) {
      inputData[i].texts[0].properties.size = fontSize;
      inputData[i].needsUpdate = true;
    }
  }
}

function updateLetterSpace(letterSpace) {
  addedNull = parseInt(letterSpace / 10);
  $("#letter-spacing").val(letterSpace.toString());
  if (inputData.length !== 0) {
    for (let i = 0; i < inputData.length; i++) {
      inputData[i].texts[0].properties.paddingLeft = letterSpace;
      inputData[i].needsUpdate = true;
    }
  }
}

document.querySelector("#letter-spacing").addEventListener("input", function () {
  letterSpace = event.target.value;
  if (letterSpace < -10) {
    letterSpace = -10;
  }
  updateLetterSpace(letterSpace);
});

document.querySelector("#font-size").addEventListener("input", function () {
  fontSize = event.target.value;
  if (fontSize < 40) {
    fontSize = event.target.value * 10;
  }
  else {
    fontSize = 400;
  }
  updateFontSize(fontSize);
});

$("#increase-font-size").click(function () {
  if (fontSize < 400) {
    fontSize += 10;
    updateFontSize(fontSize);
  }
});

$("#decrease-font-size").click(function () {
  if (fontSize > 100) {
    fontSize -= 10;
  }
  updateFontSize(fontSize);
});

$("#increase-letter-space").click(function () {
  letterSpace += 10;
  updateLetterSpace(letterSpace);
});

$("#decrease-letter-space").click(function () {
  if (letterSpace > -10) {
    letterSpace -= 10;
  }
  updateLetterSpace(letterSpace);
});



$("#darkMode").click(function () {
  let fill;
  switchFilterMode();
  if ($(".word > canvas").length !== 0) {
    fill = brightModeOn ? darkGrey : white;
    Object.values(inputData).forEach(function (value) {
      value.texts[0].properties.fill = fill;
      value.needsUpdate = true;
    });
  }
});

tempoRange.addEventListener("input", function () {
  tempo = event.target.value;
  Tone.Transport.bpm.value = tempo;
});



function startPlay() {
  $("#play").addClass("active");
  $("#line").css('visibility', 'hidden');
  $("#play > img").attr("src", "../assets/icons/stopICN.svg");
  Tone.Transport.stop()
  Tone.Transport.bpm.value = tempo;
  if (inputData.length !== 0) {
    let sequenceData = [];
    for (let i = 0; i < inputData.length; i++) {
      let char = inputData[i].texts[0].value;
      let note = data[char].note;
      sequenceData.push({ char: char, note: note, time: i, blotter: inputData[i] });
    }
    var sequence = new Tone.Sequence(function (time, event) {
      stop = (4 / 8) * (60 / tempo) * 1000;
      setTimeout(function () {
        event.blotter.material.uniforms.uSpeed.value = 0.0;
      }, stop);
      event.blotter.material.uniforms.uSpeed.value = 0.08;
      updateEffects(inputData[index].soundEffects);
      event.note && instrument.triggerAttackRelease(event.note, "16n")
    }, sequenceData);
    sequence.start(0)
    sequence.loop = true;
    Tone.Transport.start();
  }
}

$("#play").click(function () {
  if ($("#play").hasClass("active")) {
    stopPlay();
  } else {
    startPlay();
  }
});

function stopPlay() {
  Tone.Transport.stop();
  $("#play").removeClass("active");
  $("#play > img").attr("src", "../assets/icons/playICN.svg");
  $("#line").css('visibility', 'visible');
}

const font = localStorage.getItem("font");

const style = {
  family: font,
  weight: font === "Frank Ruhl Libre" ? "700" : "normal",
  fill: brightModeOn ? darkGrey : white,
  size: fontSize
};

WebFont.load({
  google: {
    families: ["Frank Ruhl Libre:700"]
  },
  custom: {
    families: [font],
    urls: ["../../fonts/fonts.css"]
  },
  active: function () {
    $(document).ready(function () {
      $("#back").click(() => {
        localStorage.setItem("brightMode", brightModeOn);
        location.assign("../menu");
      });

      $(document).keydown(function (event) {
        const key = event.keyCode;
        var char = data[event.key]; // charCode will contain the code of the character inputted
        if ($("#play").hasClass("active") && char) {
          stopPlay();
        }
        if (key == 8 || key == 46) {
          $(".word > canvas")
            .last()
            .remove();
          if ($(".word > canvas").length === 0) {
            document.querySelector(".word").innerHTML = "<div>Type Something</div>";
            $(".word div").css("color", brightModeOn ? lightGrey : darkGrey);
          }
          inputData.pop();
        } else {
          if (char) {
            inputData.push(buildBlotter(char));
          }
        }
      });
    });
  }
});

function buildBlotter(char) {
  $(".word > div").remove();
  $(".word > span").remove();
  let material = new Blotter.RollingDistortMaterial();
  let uniforms = Object.assign(
    Object.assign({}, defaultUniforms),
    char.uniforms
  );
  Object.keys(material.uniforms).forEach(function (key, index) {
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
  if (char.char === " ") {
    char.char = "-";
  }
  // style.fill = brightModeOn ? darkGrey : white;
  const text = new Blotter.Text(char.char, style);
  const blotter = new Blotter(material, {
    texts: text
  });
  const scope = blotter.forText(text);

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
  soundEffects = Object.assign(
    Object.assign({}, defaultSoundEffects),
    data[char.char].soundEffects
  );
  blotter.soundEffects = soundEffects;
  blotter.texts[0].properties.size = fontSize;
  blotter.texts[0].properties.paddingLeft = letterSpace;

  scope.appendTo($(".word"));
  if (char.char === "-") {
    scope.domElement.className = "empty-space";
  }
  $(".word").append("<span id='line'></span>");
  Object.values(blotter._scopes)[0].render();
  (function blink() {
    $("#line").fadeOut(500).fadeIn(500, blink);
  })();
  return blotter;
}

const ipt = document.querySelector("input[type=range]");
ipt.oninput = function (e) {
  const val = e.target.value;
  colorRange(val);
}

function colorRange(val) {
  progress = ((val - 60) / 60) * 100 + "%";
  document.getElementById("tempo-val").innerHTML = val;
  document.documentElement.style.setProperty("--progress", progress);
};

ipt.onfocus = function () {
  return false;
};