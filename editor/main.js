const char = localStorage.getItem("char");
const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(localStorage.getItem("defaultSoundEffects"));
let instrument, pitchEffect, distortionEffect, wetEffect;
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
          pitchEffect = new Tone.PitchShift().toMaster();
          wetEffect = new Tone.Effect(0).chain(pitchEffect);
          distortionEffect = new Tone.Distortion(0.8).chain(wetEffect);
  }

  function initializeInstrument() {
    switch (instrument) {
      case "synth":
        instrument = new Tone.Synth().connect(distortionEffect);
        break;
      case "metalSynth":
        instrument = new Tone.MetalSynth().connect(distortionEffect);
        break;
      case "AMSynth":
        instrument = new Tone.AMSynth().connect(distortionEffect);
        break;
      case "monoSynth":
        instrument = new Tone.MonoSynth().connect(distortionEffect);
        break;
      case "polySynth":
        instrument = new Tone.PolySynth().connect(distortionEffect);
        break;
      default:
        instrument = new Tone.Synth().connect(distortionhEffect);
        break;
    }
  }

  function updateInputValue(visualEffect, soundEffect, currentValue, min, max){
    currentValue = convertValueToRange(min, max, currentValue);
    data[char].uniforms[visualEffect] = currentValue;
    const [x, y] = material.uniforms.uDistortPosition.value;
    if (visualEffect==='uDistortPositionX' || visualEffect==='uDistortPositionY'){
        if (visualEffect==='uDistortPositionX'){
            material.uniforms.uDistortPosition.value = [Number(currentValue), y];
        }
        if (visualEffect==='uDistortPositionY'){
            material.uniforms.uDistortPosition.value = [x, Number(currentValue)];
        }
    }
    else{
        material.uniforms[visualEffect].value = currentValue;
    }
    if (soundEffect!=="none"){
        data[char].soundEffects[soundEffect] = currentValue;
    }
    return currentValue;
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
            soundEffect: 'none',
            label: 'Effect',
            rotation: -132,
            color: '#23CDE8',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 1,
            visualEffect: 'uSineDistortSpread',
            soundEffect: 'none',
            label: 'Effect',
            rotation: -132,
            color: '#23F376',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 2,
            visualEffect: 'uSineDistortAmplitude',
            soundEffect: 'sWetEffect',
            label: 'Dry/Wet',
            rotation: -132,
            color: '#FFFB43',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 3,
            visualEffect: 'uNoiseDistortAmplitude',
            soundEffect: 'sDistortionEffect',
            label: 'Distortion',
            rotation: -132,
            color: '#FA9C34',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 4,
            visualEffect: 'uNoiseDistortVolatility',
            soundEffect: 'sPitchEffect',
            label: 'Pitch',
            rotation: -132,
            color: '#21CD92',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 5,
            visualEffect: 'uRotation',
            soundEffect: 'none',
            label: 'Effect',
            rotation: -132,
            color: '#ED31A2',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 6,
            visualEffect: 'uSpeed',
            soundEffect: 'none',
            label: 'Effect',
            rotation: -132,
            color: '#E22',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 7,
            visualEffect: 'uNoiseDistortAmplitude',
            soundEffect: 'none',
            label: 'Effect',
            rotation: -132,
            color: '#23CDE8',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 8,
            visualEffect: 'uDistortPositionX',
            soundEffect: 'none',
            label: 'positionX',
            rotation: -132,
            color: '#23CDE8',
            active: true,
            selected: false,
            style: 1
        },
        {
            id: 9,
            visualEffect: 'uDistortPositionY',
            soundEffect: 'none',
            label: 'positionY',
            rotation: -132,
            color: '#23CDE8',
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
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 7);
                        break;
                    }
                    case 'uSineDistortSpread':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 1);
                        break;
                    }
                    case 'uSineDistortAmplitude':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 1);
                        wetEffect.wet.value = currentValue;
                        break;
                    }
                    case 'uNoiseDistortAmplitude':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 7);
                        distortionEffect.distortion = currentValue;
                        break;
                    }
                    case 'uNoiseDistortVolatility':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 25);
                        pitchEffect.pitch = currentValue;
                        break;
                    }
                    case 'uRotation':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 360);
                        break;
                    }
                    case 'uSpeed':{
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 10);
                        break;
                    }
                    case 'uDistortPositionX': {
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 1);
                        break;
                    }
                    case 'uDistortPositionY': {
                        currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue, 0, 1);
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