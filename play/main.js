const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(
  localStorage.getItem("defaultSoundEffects")
);
const brightMode = localStorage.getItem("brightMode");
$(".back").click(function() {
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
  sequence = [],
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

var seq = new Tone.Sequence(function(time, note) {
  instrument.triggerAttackRelease(note, "1n");
}, sequence);
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

function updateLetterSpace(letterSpace){
  addedNull = parseInt(letterSpace/10);
  $("#letter-spacing").val(letterSpace.toString());
  if (inputData.length !== 0) {
    for (let i = 0; i < inputData.length; i++) {
      inputData[i].texts[0].properties.paddingLeft = letterSpace;
      inputData[i].needsUpdate = true;
    }
  }
  initPlay();
}

document.querySelector("#letter-spacing").addEventListener("input", function(){
  letterSpace = event.target.value;
  if (letterSpace < -10) {
    letterSpace = -10;
  }
  updateLetterSpace(letterSpace);
});

document.querySelector("#font-size").addEventListener("input", function(){
  fontSize = event.target.value;
  if (fontSize < 40) {
    fontSize = event.target.value*10;
  }
  else{
    fontSize = 400;
  }
  updateFontSize(fontSize);
});

$("#increase-font-size").click(function(){
  if (fontSize < 400) {
    fontSize += 10;
    updateFontSize(fontSize);
    }
});

$("#decrease-font-size").click(function() {
  if (fontSize > 100) {
    fontSize -= 10;
  }
  updateFontSize(fontSize);
});

$("#increase-letter-space").click(function() {
  letterSpace += 10;
  addedNull++;
  updateLetterSpace(letterSpace);
});

$("#decrease-letter-space").click(function() {
  if (letterSpace > -10) {
    letterSpace -= 10;
  }
  addedNull--;
  updateLetterSpace(letterSpace);
});



$("#darkMode").click(function() {
  switchFilterMode();
  let fill ;
  if ($(".word > canvas").length === 0){
    $(".word div").css("color", brightModeOn ? lightGrey : darkGrey);
  }
  fill = brightModeOn ? darkGrey : white;
  Object.values(inputData).forEach(function(value) {
    value.texts[0].properties.fill = fill;
    value.needsUpdate = true;
  });
});

tempoRange.addEventListener("input", function() {
  tempo = event.target.value;
  Tone.Transport.bpm.value = tempo;
});

function initPlay() {
  if (!playPressed) {
    playPressed = !playPressed;
    seq.stop();
    index = 0;
    Tone.Transport.bpm.value = tempo;
    switchPlayMode();
  }
}

$("#play").click(switchPlayMode);

function switchPlayMode() {
  const input = $(".word > canvas");
  let img;
  if (inputData.length !== 0 || !playPressed) {
    var playModeText;
    let char, spaces;
    if (playPressed) {
      let note, stop;
      img = "../assets/icons/stopICN.svg";
      $("#line").css('visibility', 'hidden');
      playModeText = "Stop";
      for (let i = 0; i < inputData.length; i++) {
        char = inputData[i].texts[0].value;
        note = data[char].note;
        sequence.push(note);
        spaces = 0;
        while (spaces < addedNull) {
          sequence.push(null);
          spaces++;
        }
      }
      sequence.push(null);

      console.log(sequence);
      Tone.Transport.bpm.value = tempo;
      seq = new Tone.Sequence(function(time, note) {
        let currentIndex = index;
        char = data[input[index].innerHTML];
        stop = (4 / 8) * (60 / tempo) * 1000;

        setTimeout(function() {
          inputData[currentIndex].material.uniforms.uSpeed.value = 0.0;
        }, stop);
        inputData[currentIndex].material.uniforms.uSpeed.value = 0.08;
        console.log(char.note);
        if (char.note) {
          instrument.triggerAttackRelease(char.note, "8n");
        }
        updateEffects(inputData[index].soundEffects);
        index++;
        if (index === inputData.length) {
          index = 0;
        }
      }, sequence);
      seq.start();
      Tone.Transport.start();
      console.log(sequence);

      while (sequence.length > 0) {
        sequence.pop();
      }
    } else {
      seq.stop();
      playModeText = "Play";
      index = 0;
      img = "../assets/icons/playICN.svg";
      $("#line").css('visibility', 'visible');
    }
    playPressed = !playPressed;
    $("#play span").text(playModeText);
    $("#play-button").attr("src", img);
  }
}

const font = localStorage.getItem("font");

const style = {
  family: font,
  weight: font === "Frank Ruhl Libre" ? "bold" : "normal",
  fill: brightModeOn ? darkGrey : white,
  size: 200
};

WebFont.load({
  google: {
    families: ["Frank Ruhl Libre"]
  },
  custom: {
    families: [font],
    urls: ["../../fonts/fonts.css"]
  },
  active: function() {
    $(document).ready(function() {
      $("#back").click(() => {
        localStorage.setItem("brightMode", brightModeOn);
        location.assign("../menu");
      });

      $(document).keydown(function(event) {
        const key = event.keyCode;
        if (key == 8 || key == 46) {
          $(".word > canvas")
            .last()
            .remove();
          if ($(".word > canvas").length === 0) {
            document.querySelector(".word").innerHTML = "<div>Type Something</div>";
            $(".word div").css("color", brightModeOn ? lightGrey : darkGrey);
          }
          inputData.pop();
          if (!playPressed) {
            if (inputData.length !== 0) {
              initPlay();
            } else {
              switchPlayMode();
            }
          }
        } else {
          var char = data[event.key]; // charCode will contain the code of the character inputted
          if (char) {
            inputData.push(buildBlotter(char));
            initPlay();
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
  if (char.char === " ") {
    char.char = "-";
  }
  style.fill = brightModeOn ? darkGrey : white;
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
ipt.oninput = function(e){
  const val = e.target.value;
  colorRange(val);
} 

function colorRange(val) {
  progress = ((val - 60) / 60) * 100 + "%";
  document.getElementById("tempo-val").innerHTML = val;
  document.documentElement.style.setProperty("--progress", progress);
};

ipt.onfocus = function() {
  return false;
};