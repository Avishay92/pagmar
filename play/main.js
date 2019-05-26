
// const char = localStorage.getItem("char");
const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(
  localStorage.getItem("defaultSoundEffects")
);
$(".back").click(function() {
  localStorage.setItem("data", JSON.stringify(data));
  location.assign("../menu");
});

let instrument,
  autoWahEffect,
  phaserEffect,
  vibratoEffect,
  reverbEffect,
  pitchEffectEffect,
  distortionEffect,
  feedbackEffect,
  tremoloEffect;
instrument = defaultSoundEffects[Object.keys(defaultSoundEffects)[0]];

initializeEffects();
initializeInstrument();

let input,
  playOn = 1;
let sequence = [];

var seq = new Tone.Sequence(function(time, note) {
  instrument.triggerAttackRelease(note, "1n");
  console.log(note);
}, sequence);

$("#play").click(function() {
  var playMode;
  if (playOn) {
    let note;
    playMode = "Stop";
    const input = document.querySelector("#input-text").value;
    console.log(input);

    for (let i = 0; i < input.length; i++) {
      let char = input[i];
      note = data[char].note;
      sequence.push(note);
      updateEffects(data[char].soundEffects);
     }
    seq = new Tone.Sequence(function(time, note) {
      instrument.triggerAttackRelease(note, "16n");
    }, sequence);
    seq.start();
    Tone.Transport.start();
    emptySequence(input);
  } else {
    seq.stop();
    playMode = "Play";
  }
  $("#play span").text(playMode);
  playOn = !playOn;
});

function emptySequence(input) {
  for (let i = 0; i < input.length; i++) {
    let char = input[i];
    note = data[char].note;
    sequence.pop();
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

    Object.values(blotter._scopes)[0].render();
  }
}

$(document).ready(function() {

  const style = {
    family: "Frank Ruhl Libre",
    //weight: "bold",
    fill: "#F4F6FA",
    size: 94
  };
  
  $("#input-text").on("input", function() {
    const { value } = this;
    $('.char-view').empty();

    for(let i = 0; i < value.length; i++){
      let char = value[i];
      let material = new Blotter.RollingDistortMaterial();
      const text = new Blotter.Text(char, style);
      const blotter = new Blotter(material, { texts: text });
      activateChar(char);
      const scope = blotter.forText(text);
      scope.appendTo($('.char-view'));
    }
  });
});
