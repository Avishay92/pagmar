const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(
  localStorage.getItem("defaultSoundEffects")
);
$(".back").click(function() {
  localStorage.setItem("data", JSON.stringify(data));
  location.assign("../menu");
});
$('.word').children().length = 0;

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

initializeEffects();
initializeInstrument();

let input,
  playPressed = 1;
let sequence = [];
let inputData = [];
let index=0;
let fontSize = 200;
let letterSpace = 8;
let wordSpace = 50;
let tempo = 100;

var seq = new Tone.Sequence(function(time, note) {
  instrument.triggerAttackRelease(note, "1n");
}, sequence);
let blotter, char;

$("#increase-font-size").click(function(){
  fontSize+=10;
  $('#font-size span').text(fontSize.toString());
  const input = $('.word').children();
  if (inputData.length !== 0){
    for (let i = 0; i < input.length; i++) {
      blotter = inputData[i];
      blotter.texts[0].properties.size = fontSize;
      blotter.needsUpdate= true;
    }
  }
})

$("#decrease-font-size").click(function(){
  if (fontSize!==0){
    fontSize -=10;
  }
  $('#font-size span').text(fontSize.toString());
  const input = $('.word').children();
  if (inputData.length !== 0){
    for (let i = 0; i < input.length; i++) {
      blotter = inputData[i];
      blotter.texts[0].properties.size = fontSize;
      blotter.needsUpdate= true;
    }
  }
})

$("#increase-letter-space").click(function(){
  letterSpace+=5;
  $('#letter-spacing span').text(letterSpace.toString());
  const input = $('.word').children();
  if (inputData.length !== 0){
    for (let i = 0; i < input.length; i++) {
      blotter = inputData[i];
      
      if(i < input.length-1 && inputData[i+1].texts[0].value !== " "){
        console.log("before space: chnage right", i);
        blotter.texts[0].properties.paddingRight = letterSpace;
      }
      if(i > 0 && inputData[i-1].texts[0].value !== " "){
        console.log("after space: chnage left", i);
        blotter.texts[0].properties.paddingLeft = letterSpace;
      }
      blotter.needsUpdate= true;
    }
  }
})

$("#decrease-letter-space").click(function(){
if (letterSpace!==0){
  letterSpace-=5;
  if (letterSpace < -30){
    letterSpace = -30;
  }
}
  $('#letter-spacing span').text(letterSpace.toString());
  const input = $('.word').children();
  if (inputData.length !== 0){
    for (let i = 0; i < input.length; i++) {
      blotter = inputData[i];
      blotter.texts[0].properties.paddingRight = letterSpace;
      blotter.texts[0].properties.paddingLeft = letterSpace;
      blotter.needsUpdate= true;
    }
  }
})

$("#increase-word-space").click(function(){
  wordSpace+=5;
  $('#word-spacing span').text(wordSpace.toString());
  const input = $('.word').children();
  if (inputData.length !== 0){
    for (let i = 0; i < input.length; i++) {
      blotter = inputData[i];
      if (blotter.texts[0].value===" "){
      //  inputData[i+1].texts[0].properties.paddingRight = wordSpace;
      //  inputData[i+1].needsUpdate= true;
       inputData[i-1].texts[0].properties.paddingLeft = wordSpace;
       inputData[i-1].needsUpdate= true;
      }
    }
  }
})

$("#decrease-word-space").click(function(){
  if (wordSpace){
    wordSpace-=5;
  }
  $('#word-spacing span').text(wordSpace.toString());
  const input = $('.word').children();
  if (inputData.length !== 0){
    for (let i = 0; i < input.length; i++) {
      blotter = inputData[i];
      if (blotter.texts[0].value===" "){
      //  inputData[i+1].texts[0].properties.paddingRight = wordSpace;
      //  inputData[i+1].needsUpdate= true;
       inputData[i-1].texts[0].properties.paddingLeft = wordSpace;
       inputData[i-1].needsUpdate= true;
      }
    }
  }
})

let tempoRange = document.querySelector('#tempo'); 
  tempoRange.addEventListener("input", function() {
  tempo = event.target.value;
  Tone.Transport.bpm.value = tempo;
});




$("#play").click(switchPlayMode);

function switchPlayMode() {
  const input = $('.word').children();
  let img;
  if (inputData.length !== 0 || !playPressed){ //check if empty!
  var playModeText;
  let char;
  if (playPressed) {
    let note;
    img = "../assets/icons/stopICN.svg";
    playModeText = "Stop";
    for (let i = 0; i < input.length; i++) {
      char = input[i].innerHTML;
      if (char!==" "){
        note = data[char].note;
        sequence.push(note);
      }
    }
      Tone.Transport.bpm.value = tempo;
      seq = new Tone.Sequence(function(time, note) {
      char = data[input[index].innerHTML];
      instrument.triggerAttackRelease(note, "16n");
      updateEffects(inputData[index].soundEffects);
      index++;
      if (index===input.length){
        index=0;
      }
    }, sequence);
    seq.start();
    Tone.Transport.start();
    emptySequence(input.length);
  } else {
    seq.stop();
    playModeText = "Play";
    index=0;
    img = "../assets/icons/playICN.svg";
  }
  playPressed = !playPressed;
  $("#play span").text(playModeText);
  $("#play-button").attr("src",img);
  }
}

function emptySequence(length) {
  for (let i = 0; i < length; i++) {
     sequence.pop();
  }
}



$(document).ready(function() {
  const style = {
    family: "Frank Ruhl Libre",
    //weight: "bold",
    fill: "#F4F6FA",
    size: 200
  };

  $(document).keydown(function(event) {
    const key = event.keyCode;
    let size = inputData.length;
    if (key == 8 || key == 46) {
      $('.word').children().last().remove();
      if ($('.word').children().length === 0){
        document.querySelector('.word').innerHTML = "<div>Type Something</div>";
      }
      inputData.pop();
      if (!playPressed){
        if (inputData.length !== 0){
          playPressed=!playPressed;
          seq.stop();
          index=0;
          Tone.Transport.bpm.value = tempo;
        }
        switchPlayMode();
      }
    } else {
      var char = data[event.key]; // charCode will contain the code of the character inputted
      if (char) {
        $('.word > div').remove();
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
        data[char.char].soundEffects);
        blotter.soundEffects = soundEffects;
        blotter.texts[0].properties.size = fontSize;
        blotter.texts[0].properties.paddingRight = letterSpace;
        blotter.texts[0].properties.paddingLeft = letterSpace;

        inputData.push(blotter)
        scope.appendTo($(".word"));
        Object.values(blotter._scopes)[0].render();
        if (char.char === " "){
          console.log(size);
          console.log(inputData[size-1].texts[0]);
          inputData[size-1].texts[0].properties.paddingLeft = wordSpace;
          inputData[size-1].needsUpdate= true;
          inputData[size].needsUpdate= true;
        }
      }
    }
  });
});
