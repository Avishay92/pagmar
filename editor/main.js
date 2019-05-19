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
initializeEffects();
initializeInstrument();

data[char].uniforms = Object.assign(defaultUniforms, data[char].uniforms);
data[char].soundEffects = Object.assign(defaultSoundEffects, data[char].soundEffects);

var text = new Blotter.Text(char, {
    family: "Frank Ruhl Libre",
    size: 100,
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

const inputElements = document.querySelectorAll('input');
const note = data[char].note;
for (let inputElement of inputElements) {
    inputElement.addEventListener('input', ({currentTarget}) => {
        const currentValue = currentTarget.value;
        const {
            id: propKey
        } = currentTarget;
        switch (propKey) {
            case 'uDistortPositionY': {
                const [x, y] = material.uniforms.uDistortPosition.value;
                material.uniforms.uDistortPosition.value = [x, Number(currentValue)];
                setCharDataUniform("uDistortPosition", material.uniforms.uDistortPosition.value);
                break;
            }
            case 'uDistortPositionX': {
                const [x, y] = material.uniforms.uDistortPosition.value;
                material.uniforms.uDistortPosition.value = [Number(currentValue), y];
                setCharDataUniform("uDistortPosition", material.uniforms.uDistortPosition.value);
                break;
            }

            case 'uNoiseDistortVolatility':{
                material.uniforms[propKey].value = currentValue;
                setCharDataUniform(propKey, currentValue);
                pitchEffect.pitch = currentValue;
                setCharDataSoundEffect("sPitchEffect", currentValue);
                  
                break;
            }
            case 'uSineDistortAmplitude':{
                material.uniforms[propKey].value = currentValue;
                setCharDataUniform(propKey, currentValue);
                wetEffect.wet.value = currentValue;
                setCharDataSoundEffect("sWetEffect", currentValue);
                console.log(wetEffect.wet.value);
                break;
            }
            case 'uNoiseDistortAmplitude':{
                material.uniforms[propKey].value = currentValue;
                setCharDataUniform(propKey, currentValue);
                distortionEffect.distortion = currentValue;
                setCharDataSoundEffect("sDistortionEffect", currentValue);
                console.log(distortionEffect.distortion);
                break;
            }
            default: {
                material.uniforms[propKey].value = currentValue;
                setCharDataUniform(propKey, currentValue);
            }
        }
        instrument.triggerAttackRelease(note, '4n');
    
    })
}


$(document).ready(function () {
    inputElements.forEach(function (inputElement) {
        switch (inputElement.id) {
            case 'uDistortPositionY': {
                const [x, y] = data[char].uniforms.uDistortPosition;
                inputElement.value = Number(y);
                break;
            }
            case 'uDistortPositionX': {
                const [x, y] = data[char].uniforms.uDistortPosition;
                inputElement.value = Number(x);
                break;
            }
            default: {
                inputElement.value = Number(data[char].uniforms[inputElement.id]);
            }
        }
    })
});

$(window).on("beforeunload", function () {
    localStorage.setItem('data', JSON.stringify(data));
})

$("#back").click(function () {
    localStorage.setItem("data", JSON.stringify(data));
    location.assign("../menu");
});


  
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
      case "metalSynth":
        instrument = new Tone.MetalSynth().connect(tremoloEffect);
        break;
      case "AMSynth":
        instrument = new Tone.AMSynth().connect(tremoloEffect);
        break;
      case "monoSynth":
        instrument = new Tone.MonoSynth().connect(tremoloEffect);
        break;
      case "polySynth":
        instrument = new Tone.PolySynth().connect(tremoloEffect);
        break;
      default:
        instrument = new Tone.Synth().connect(tremoloEffect);
        break;
    }
  }

  function updateInputValue(visualEffect, soundEffect, currentValue, minVisual, maxVisual, minSound, maxSound){
    visualValue = convertValueToRange(minVisual, maxVisual, currentValue);
    soundValue = convertValueToRange(minSound, maxSound, currentValue);
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

  function setCharDataUniform(uniform, value) {
    data[char].uniforms[uniform] = value;
}

function setCharDataSoundEffect(soundEffect, value) {
    data[char].soundEffects[soundEffect] = value;
}

  var app = new Vue({
    el: '#app',
    data: {
        colorArray: ['#23CDE8', '#23F376', '#FFFB43', '#FA9C34', '#21CD92', '#ED31A2', '#E22'],
        knobs: [
        {
            id: 0,
            visualEffect: 'uSineDistortCycleCount',
            soundEffect: 'sPhaserEffect',
            label: 'Phaser',
            rotation: -132,
            color: '#23CDE8',
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
            color: '#23F376',
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
            color: '#FFFB43',
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
            color: '#FA9C34',
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
            color: '#21CD92',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 5,
            visualEffect: 'uSpeed',
            soundEffect: 'none',
            label: 'Speed',
            rotation: -132,
            color: '#ED31A2',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 6,
            visualEffect: 'uDistortPositionX',
            soundEffect: 'sDistortionEffect',
            label: 'Distortion',
            rotation: -132,
            color: '#E22',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 7,
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
            id: 8,
            visualEffect: 'uRotation',
            soundEffect: 'sTremoloEffect',
            label: 'Tremolo',
            rotation: -132,
            color: '#23F376',
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
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 7, 0, 8);
                        autoWahEffect.octaves.value = currentValue;
                        break;
                    }
                    case 'uSineDistortSpread':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 1, 0, 8);
                        phaserEffect.octaves = currentValue;
                        break;
                    }
                    case 'uSineDistortAmplitude':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 1, 0 ,10);
                        vibratoEffect.frequency = currentValue;
                        break;
                    }
                    case 'uNoiseDistortAmplitude':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 7, -24, 32);
                        pitchEffect.pitch = currentValue;
                        break;
                    }
                    case 'uNoiseDistortVolatility':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 25, 0, 2);
                        break;
                    }
                    case 'uRotation':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 360, 0, 10);
                        tremoloEffect.frequency = currentValue;
                        break;
                    }
                    case 'uSpeed':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 10, 0, 0);
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
                instrument.triggerAttackRelease(note, '4n');
                // Setting Max rotation
                if (selectedKnob.rotation >= 132) {
                    selectedKnob.rotation = 132;
                } else if (selectedKnob.rotation <= -132) {
                    selectedKnob.rotation = -132;
                }
            }
        },
    },
    methods: {
        unselectKnobs: function () {
            for (var i in this.knobs) {
                this.knobs[i].selected = false;
            }
        }
    }
});

function convertValueToRange(min, max, value){
    const controllerRange = 264;
    let range, precent;
    value += 132;
    precent = parseFloat(value/controllerRange).toPrecision(3);
    min = Math.abs(min);
    max = Math.abs(max);
    range = min + max;
    value = parseFloat(range*precent).toPrecision(3);
    return value;
}

window.addEventListener('mousemove', app.mousemoveFunction);