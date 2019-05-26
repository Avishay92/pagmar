const char = localStorage.getItem("char");
const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(localStorage.getItem("defaultSoundEffects"));
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

  let input, playOn = 1;
  let sequence = [];

  var seq = new Tone.Sequence(function(time, note){
    instrument.triggerAttackRelease(note, "1n");
    console.log(note);
  }, sequence);
 
  $('#play').click(function(){
    var playMode;
    if (playOn){
    let note;
    playMode = "Stop";
    input = document.querySelector("#input-text").value;
    for (let i =0; i<input.length; i++){
      let char = input[i];
      note = data[char].note;
      sequence.push(note);

      // updateEffects(data[char].soundEffects);
      }
      seq = new Tone.Sequence(function(time, note){
        instrument.triggerAttackRelease(note, "16n");
      }, sequence);
      seq.start();
      Tone.Transport.start();
      emptySequence(input)
    }
    else{
      seq.stop();
      playMode = "Play";
    }
    $('#play span').text(playMode);
    playOn = !playOn;
  })

   function emptySequence(input){
    for (let i =0; i<input.length; i++){
      let char = input[i];
      note = data[char].note;
      sequence.pop();
     }
   }