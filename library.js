
function initializeInstrument() {
    switch (instrument) {
      case "synth":
        instrument = new Tone.Synth().connect(tremoloEffect);
        break;
      case "DuoSynth":
        instrument = new Tone.DuoSynth().connect(tremoloEffect);
        break;
      case "MembraneSynth":
        instrument = new Tone.MembraneSynth().connect(tremoloEffect);
        break;
      case "AMSynth":
        instrument = new Tone.AMSynth().connect(tremoloEffect);
        break;
      case "FMSynth":
        instrument = new Tone.FMSynth().connect(tremoloEffect);
        break;
      default:
        instrument = new Tone.Synth().connect(tremoloEffect);
        break;
    }
  }

  function initializeEffects() {
    autoWahEffect = new Tone.AutoWah(50, 6, -30).toMaster();
    phaserEffect = new Tone.Phaser(15, 5, 1000).chain(autoWahEffect);
    vibratoEffect = new Tone.Vibrato(5, 0.1).chain(phaserEffect);
    // reverbEffect = new Tone.Reverb(0).chain(vibratoEffect);
    pitchEffect= new Tone.PitchShift().chain(vibratoEffect);
    distortionEffect = new Tone.Distortion(0.8).chain(pitchEffect);
    //feedbackEffect = new Tone.FeedbackEffect(0.125).chain(distortionEffect);
    tremoloEffect = new Tone.Tremolo(9, 0.75).chain(distortionEffect);
  }

  function updateEffects(soundEffects) {
    Object.keys(soundEffects).forEach(function(key, index) {
      switch (key) {
        case "sAutoWahEffect":
          autoWahEffect.octaves.value = soundEffects[key];
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

  $("#applyAll").click(function () {
    console.log(data);
    Object.keys(data).forEach(function (currChar){
        data[currChar].uniforms = data[char].uniforms;
        data[currChar].soundEffects = data[char].soundEffects;
    })
  });

