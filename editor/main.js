const char = localStorage.getItem("char");
const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(localStorage.getItem("defaultSoundEffects"));
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

const effectRanges = {
    uSineDistortCycleCount: {
        min: 60,
        max: 200,
    },
    uSineDistortSpread:{
        min: 0.067,
        max: 1,
    },
    uSineDistortAmplitude: {
        min: 0,
        max: 1,
    },
    uNoiseDistortVolatility: {
        min: 1,
        max: 80,
    },
    uNoiseDistortAmplitude: {
        min: 0.008,
        max: 1,
    },
    uRotation: {
        min: 0,
        max: 360,
    },
    uDistortPositionX:{
        min: 0,
        max: 1,
    },
    uDistortPositionY:{
        min: 0,
        max: 1,
    },
}

initializeEffects();
initializeInstrument();

data[char].uniforms = Object.assign(defaultUniforms, data[char].uniforms);
data[char].soundEffects = Object.assign(defaultSoundEffects, data[char].soundEffects);
const note = data[char].note;

var text = new Blotter.Text(char, {
    family: "Frank Ruhl Libre",
    size: 450,
    fill: "white",
});

var material = new Blotter.RollingDistortMaterial();
Object.keys(material.uniforms).forEach(function (key, index) {
    if (defaultUniforms[key]) {
        if (key === "uDistortPosition") {
            material.uniforms[key].value = [Number(data[char].uniforms[key][0]), Number(data[char].uniforms[key][1])];
        } else {
            material.uniforms[key].value = Number(data[char].uniforms[key])
        }
    }
})

var blotter = new Blotter(material, {
    texts: text,
});

var scope = blotter.forText(text);
scope.appendTo(document.querySelector("#char"));


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

  function updateInputValue(visualEffect, soundEffect, currentValue, minVisual, maxVisual, minSound, maxSound){
    let visualValue = convertValueToRange(minVisual, maxVisual, currentValue);
    let soundValue = convertValueToRange(minSound, maxSound, currentValue);
    data[char].uniforms[visualEffect] = visualValue;
    const [x, y] = material.uniforms.uDistortPosition.value;
    if (visualEffect==='uDistortPositionX' || visualEffect==='uDistortPositionY'){
        if (visualEffect==='uDistortPositionX'){
            material.uniforms.uDistortPosition.value = [Number(visualValue), y];
        }
        if (visualEffect==='uDistortPositionY'){
            material.uniforms.uDistortPosition.value = [x, Number(visualValue)];
        }
    }
    else{
        material.uniforms[visualEffect].value = visualValue;
    }
    if (soundEffect!=="none"){
        data[char].soundEffects[soundEffect] = soundValue;
    }
    return soundValue;
}

function convertValueToRange(min, max, value){
    const controllerRange = 264;
    let range, precent;
    value += 132;
    precent = parseFloat(value/controllerRange).toPrecision(3);
    range = Math.abs(min) + Math.abs(max);
    value = parseFloat(range*precent).toPrecision(3);
    if (min < 0){
        value =parseFloat(value)+parseFloat(min);
    }
    if (max < 0){
        value =parseFloat(value)+parseFloat(max);
    }

    if (min===-24){
    console.log("converted: "+value);
    }   
    return value;
}

function convertValueToRotation(effect){
    const controllerRange = 264;
    const min = effectRanges[effect].min;
    const max = effectRanges[effect].max;
    let range, precent, currValue;
    if(effect === 'uDistortPositionX'){
        currValue = data[char].uniforms["uDistortPosition"][0];
    }
    else if(effect === 'uDistortPositionY'){
        currValue = data[char].uniforms["uDistortPosition"][1];
    }
    else {
         currValue = data[char].uniforms[effect];
    }
    if (min < 0){
        currValue =parseFloat(currValue)-parseFloat(min);
    }
    if (max < 0){
        currValue =parseFloat(currValue)-parseFloat(max);
    }
    range = Math.abs(min) + Math.abs(max);
    precent = parseFloat(currValue/range).toPrecision(3);
    currValue = parseFloat(controllerRange*precent).toPrecision(3);
    currValue -= 132;
    return currValue;
}

var app = new Vue({
    el: '#app',
    data: {
        colorArray: ['#FF395D', '#23F376', '#FFFB43', '#FA9C34', '#21CD92', '#ED31A2', '#E22'],
        knobs: [
        {
            id: 0,
            visualEffect: 'uSineDistortCycleCount',
            soundEffect: 'sPhaserEffect',
            label: 'Phaser',
            rotation: -132,
            color: '#FF395D',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 1,
            visualEffect: 'uSineDistortSpread',
            soundEffect: 'sAutoWahEffect',
            label: 'AutoWah',
            rotation: -132,
            color: '#01ED95',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 2,
            visualEffect: 'uSineDistortAmplitude',
            soundEffect: 'sVibratoEffect',
            label: 'Vibrato',
            rotation: -132,
            color: '#69FFFE',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 3,
            visualEffect: 'uNoiseDistortAmplitude',
            soundEffect: 'sPitchEffect',
            label: 'Pitch shift',
            rotation: -132,
            color: '#EDAC01',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 4,
            visualEffect: 'uNoiseDistortVolatility',
            soundEffect: 'sReverbEffect',
            label: 'Reverb',
            rotation: -132,
            color: '#9256D7',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 5,
            visualEffect: 'uDistortPositionX',
            soundEffect: 'sDistortionEffect',
            label: 'Distortion',
            rotation: -132,
            color: '#ED31A2',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 6,
            visualEffect: 'uDistortPositionY',
            soundEffect: 'sFeedbackEffect',
            label: 'Feedback',
            rotation: -132,
            color: '#23CDE8',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 7,
            visualEffect: 'uRotation',
            soundEffect: 'sTremoloEffect',
            label: 'Tremolo',
            rotation: -132,
            color: '#21CD92',
            active: true,
            selected: false,
            style: 1
        },
        ],
        currentY: 0,
        mousemoveFunction: function (e) {
            var selectedKnob = app.knobs.filter(function (i) {
                return i.selected === true;
            }
            )[0];
            if (selectedKnob) {
                // Knob Rotation
                if (e.pageY - app.currentY !== 0) {
                    selectedKnob.rotation -= (e.pageY - app.currentY);
                }
                app.currentY = e.pageY;

                let knobVisualEffect= selectedKnob.visualEffect;
                let knobSoundEffect= selectedKnob.soundEffect;
                let currentValue = selectedKnob.rotation;
                switch (knobVisualEffect) {
                     case 'uSineDistortCycleCount':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 60, 200, 0, 8);
                        autoWahEffect.baseFrequency = currentValue;
                        break;
                    }
                    case 'uSineDistortSpread':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0.067, 1, 0, 8);
                        phaserEffect.octaves = currentValue;
                        break;
                    }
 
                    case 'uSineDistortAmplitude':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 1, 0 ,10);
                        vibratoEffect.frequency = currentValue;
                        break;
                    }
                    case 'uNoiseDistortAmplitude':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0.008, 1, 0, 24);
                        pitchEffect.pitch = currentValue;
                        break;
                    }
                    case 'uNoiseDistortVolatility':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 1, 80, 0, 2);
                        break;
                    }
                    case 'uRotation':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 360, 0, 10);
                        tremoloEffect.frequency = currentValue;
                        break;
                    }
                    case 'uDistortPositionX': {
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 1, 0, 1);
                        distortionEffect.distortion = currentValue;
                        break;
                    }
                    case 'uDistortPositionY': {
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 1, 0, 1);
                        break;
                    }
                }
                instrument.triggerAttackRelease(note, '16n');
                
                // Setting Max rotation
                if (selectedKnob.rotation >= 132) {
                    selectedKnob.rotation = 132;
                } else if (selectedKnob.rotation <= -132) {
                    selectedKnob.rotation = -132;
                }
            }
        },
        initializeContorllers: function(e){
            app.knobs.forEach(function(knob){
                let rotationValue = convertValueToRotation(knob.visualEffect);
                knob.rotation = rotationValue;
                console.log(rotationValue);
                if(knob.visualEffect === 'uDistortPositionX'){
                    data[char].uniforms["uDistortPosition"][0] = rotationValue;
                    console.log(knob.rotation);
                }
                if(knob.visualEffect === 'uDistortPositionY'){
                    data[char].uniforms["uDistortPosition"][1] = rotationValue;
                }

            })
        }
    },
    methods: {
        unselectKnobs: function () {
            for (var i in this.knobs) {
                this.knobs[i].selected = false;
            }
        }
    }
});

app.initializeContorllers();
window.addEventListener('mousemove', app.mousemoveFunction);

$(window).on("beforeunload", function () {
    localStorage.setItem('data', JSON.stringify(data));
})

$("#back").click(function () {
    localStorage.setItem("data", JSON.stringify(data));
    location.assign("../menu");
});