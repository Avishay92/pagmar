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
  tempo = 100,
  addedNull=0,
  brightModeOn;

initializeEffects();
initializeInstrument();
initializeFilterMode();
$(".word span").css("color", brightModeOn ? "#c9c8c8" : "#202020"); 

var seq = new Tone.Sequence(function(time, note) {
  instrument.triggerAttackRelease(note, "1n");
}, sequence);
let blotter, char;

$("#increase-font-size").click(function() {
  fontSize += 10;
  $("#font-size span").text(fontSize.toString());
  const input = $(".word > canvas");
  if (inputData.length !== 0) {
    for (let i = 0; i < inputData.length; i++) {
      blotter = inputData[i];
      blotter.texts[0].properties.size = fontSize;
      blotter.needsUpdate = true;
    }
  }
});

$("#decrease-font-size").click(function() {
  if (fontSize > 0) {
    fontSize -= 10;
  }
  $("#font-size span").text(fontSize.toString());
  const input = $(".word > canvas");
  if (inputData.length !== 0) {
    for (let i = 0; i < inputData.length; i++) {
      blotter = inputData[i];
      blotter.texts[0].properties.size = fontSize;
      blotter.needsUpdate = true;
    }
  }
});

$("#increase-letter-space").click(function() {
  letterSpace += 5;
  $("#letter-spacing span").text(letterSpace.toString());
  if (inputData.length !== 0) {
    for (let i = 0; i < inputData.length; i++) {
      blotter = inputData[i];

      if (i < inputData.length - 1 && inputData[i + 1].texts[0].value !== " ") {
        blotter.texts[0].properties.paddingRight = letterSpace;
      }
      if (i > 0 && inputData[i - 1].texts[0].value !== " ") {
        blotter.texts[0].properties.paddingLeft = letterSpace;
      }
      blotter.needsUpdate = true;
    }
  }
});

$("#decrease-letter-space").click(function() {
  if (letterSpace > -5) {
    letterSpace -=-5;
  }
  $("#letter-spacing span").text(letterSpace.toString());
  if (inputData.length !== 0) {
    for (let i = 0; i < inputData.length; i++) {
      blotter = inputData[i];
      blotter.texts[0].properties.paddingRight = letterSpace;
      blotter.texts[0].properties.paddingLeft = letterSpace;
      blotter.needsUpdate = true;
    }
  }
});

$("#increase-word-space").click(function() {
  wordSpace += 5;
  addedNull++;
  $("#word-spacing span").text(wordSpace.toString());
  const input = $(".word > canvas");
  for (let i = 0; i < inputData.length; i++) {
    if (inputData[i].texts[0].value === " ") {
        inputData[i-1].texts[0].properties.paddingLeft = wordSpace*(addedNull+1);
        inputData[i-1].needsUpdate=true;
    }
  }
 initPlay();
});

$("#decrease-word-space").click(function() {
  if (wordSpace) {
    wordSpace -= 5;
  }
  $("#word-spacing span").text(wordSpace.toString());
    for (let i = 0; i < inputData.length; i++) {
     if (inputData[i].texts[0].value === " ") {
      inputData[i-1].texts[0].properties.paddingLeft = wordSpace*(addedNull);
      inputData[i-1].needsUpdate=true;
      }
    }
  addedNull--;
  initPlay();
});

$("#darkMode").click(function(){
  switchFilterMode();
  let fill = brightModeOn ? "#202020": "#F4F6FA";
  Object.values(inputData).forEach(function(value) {
      value.texts[0].properties.fill = fill;
      value.needsUpdate = true;
    });
  $(".word span").css("color", brightModeOn ? "#c9c8c8" : "#2a2b2b"); 
});

let tempoRange = document.querySelector("#tempo");
tempoRange.addEventListener("input", function() {
  tempo = event.target.value;
  Tone.Transport.bpm.value = tempo;
});

function initPlay(){
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
      $('#line').hide();
      playModeText = "Stop";
      for (let i = 0; i < inputData.length; i++) {

        char = inputData[i].texts[0].value;
        note = data[char].note;
        if (char === " "){
          spaces = 0;

          while (spaces < addedNull){
            sequence.push(note);
            spaces++;
          }
        }
        sequence.push(note);
      }

      Tone.Transport.bpm.value = tempo;
      seq = new Tone.Sequence(function(time, note) {
      let currentIndex = index;
      char = data[input[index].innerHTML];
      stop = (4 / 16) * (60 / tempo) * 1000;
      // if (char.char === " "){
      //   stop = (4 / 16) * (60 / tempo)*6000;
      // }
      
      setTimeout(function() {
        inputData[currentIndex].material.uniforms.uSpeed.value = 0.0;
      }, stop);
      // if (char.char !== " "){
        inputData[currentIndex].material.uniforms.uSpeed.value = 0.08;
      // }
      instrument.triggerAttackRelease(note, "16n");
      updateEffects(inputData[index].soundEffects);
      index++;
      if (index === inputData.length) {
        index = 0;
        }
      }, sequence);
      seq.start();
      Tone.Transport.start();
      while (sequence.length > 0 ){
        sequence.pop();
      }      
    }
    else {
      seq.stop();
      playModeText = "Play";
      index = 0;
      img = "../assets/icons/playICN.svg";
      $('#line').show();
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
  fill: brightModeOn ? "#202020": "#F4F6FA",
  size: 200
};


WebFont.load({
    google: {
      families: ["Frank Ruhl Libre" ]
    },
    custom: {
        families: [font],
        urls: ['../../fonts/fonts.css']
    },
    active: function (){


$(document).ready(function() {

  $('#back').click( () => {
    localStorage.setItem("brightMode", brightModeOn);
    location.assign("../menu");
  });



  $(document).keydown(function(event) {
    const key = event.keyCode;
    let size = inputData.length;
    if (key == 8 || key == 46) {
      $(".word > canvas").last().remove();
      if ($(".word > canvas").length === 0) {
        document.querySelector(".word").innerHTML = "<div>Type Something</div>";
console.log(document.querySelector(".word"));
console.log(document.querySelector(".word"));

        $(".word span").css("color", brightModeOn ? "#c9c8c8" : "#3c3d3d"); 
      }
      if (inputData[inputData.length-1].texts[0].value===" "){
        inputData[inputData.length-2].texts[0].properties.paddingLeft = letterSpace;
        inputData[inputData.length-2].needsUpdate = true;
      }
      inputData.pop();
      if (!playPressed) {
        if (inputData.length !== 0) {
          initPlay();
        }else{
        switchPlayMode();
        }
      }
    } else {
      var char = data[event.key]; // charCode will contain the code of the character inputted
      if (char) {
       let blotter = buildBlotter(char);
      inputData.push(blotter);
      initPlay();

      if (char.char === " ") {
        inputData[size - (addedNull+1)].texts[0].properties.paddingLeft = wordSpace*(addedNull+1);
        inputData[size - (addedNull+1)].needsUpdate = true;
        inputData[size].needsUpdate = true;
      }
      }
    }
  });
});
    }});

    function buildBlotter(char){
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
      blotter.texts[0].properties.paddingRight = letterSpace;
      blotter.texts[0].properties.paddingLeft = letterSpace;

      if (char!== " "){
      scope.appendTo($(".word"));
      // add blink
      $(".word").append("<span id='line'></span>")
      Object.values(blotter._scopes)[0].render();

    }
      return blotter;
    }

    const ipt = document.querySelector('input[type=range]')
// ipt.onchange = function () {
ipt.oninput = function (e) {
  const val = e.target.value, progress = ((val - 60)/(60))*100 + "%";
  document.getElementById("tempo-val").innerHTML = val;
  document.documentElement.style.setProperty('--progress', progress)
}
ipt.onfocus = function() {
  return false;
}