const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(
  localStorage.getItem("defaultSoundEffects")
);
$(".back").click(function() {
  localStorage.setItem("data", JSON.stringify(data));
  location.assign("../menu");
});
let fontSize = 16;
let letterSpace = 8;
let wordSpace = 8;

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
  playOn = 1;
let sequence = [];
let index=0;

var seq = new Tone.Sequence(function(time, note) {
  instrument.triggerAttackRelease(note, "1n");
}, sequence);

// $("#increase-font-size").click(function(){
//   fontSize++;
//   $('#font-size span').text(fontSize.toString());
//   $('.number-button').css("font-size", fontSize.toString() + "px");
//   Object.keys(material.uniforms).forEach(function(key, index) {
//     let material = 
//     if (defaultUniforms[key]) {
//     }
//   });

// })

// $("#decrease-font-size").click(function(){
//   if (fontSize!==0){
//     fontSize--;
//   }
//   $('#font-size span').text(fontSize.toString());
//   $('.number-button').css("font-size", fontSize.toString() + "px");
// })

// $("#increase-letter-space").click(function(){
//   letterSpace++;
//   $('#letter-spacing span').text(letterSpace.toString());
//   $(".word span").css("letter-spacing", letterSpace);
// })

// $("#decrease-letter-space").click(function(){
// if (letterSpace!==0){
//   letterSpace--;
// }
//   $('#letter-spacing span').text(letterSpace.toString());
//   $(".word span").css("letter-spacing", letterSpace);
// })

// $("#increase-word-space").click(function(){
//   wordSpace++;
//   $('#word-spacing span').text(wordSpace.toString());
//   $('.number-button').css("word-spacing", wordSpace);
// })

// $("#decrease-word-space").click(function(){
//   if (wordSpace){
//     wordSpace--;
//   }
//   $('#word-spacing span').text(wordSpace.toString());
//   $('.number-button').css("word-spacing", wordSpace);
// })


$("#play").click(function() {
  console.log("hree");
  const input = $('.word').children();
  let img;
  if (input.length !== 0){ //check if empty!
  var playMode;
  let char;
  if (playOn) {
    let note;
    img = "../assets/icons/stopICN.svg";
    playMode = "Stop";
    for (let i = 0; i < input.length; i++) {
      char = input[i].innerHTML;
      note = data[char].note;
      sequence.push(note);
    }
    seq = new Tone.Sequence(function(time, note) {
      char = data[input[index].innerHTML];
      instrument.triggerAttackRelease(note, "16n");
      updateEffects(char.soundEffects);
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
    playMode = "Play";
    index=0;
    img = "../assets/icons/playICN.svg";
  }
  $("#play span").text(playMode);
  playOn = !playOn;
  $("#play-button").attr("src",img);

}
});

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
    if (key == 8 || key == 46) {
      $('.word').children().last().remove();
      if ($('.word').children().length === 0){
        document.querySelector('.word').innerHTML = "<div>Type Something</div>";
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
        scope.appendTo($(".word"));
        Object.values(blotter._scopes)[0].render();

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
        data[char.char].soundEffects = soundEffects;
      }
  
    }
  });
});
