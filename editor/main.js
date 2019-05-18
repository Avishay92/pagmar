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

function setCharDataUniform(uniform, value) {
    data[char].uniforms[uniform] = value;
}

function setCharDataSoundEffect(soundEffect, value) {
    data[char].soundEffects[soundEffect] = value;
}

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
    inputElement.addEventListener('input', ({
        currentTarget
    }) => {
        const currentValue = currentTarget.value;
        const {
            id: propKey
        } = currentTarget;
        instrument.triggerAttackRelease(note, '4n');
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

$("button").click(function () {
    localStorage.setItem("data", JSON.stringify(data));
    location.assign("../menu");
});

function initializeInstrument() {
    switch (instrument) {
      case "synth":
        instrument = new Tone.Synth().connect(pitchEffect);
        break;
      case "metalSynth":
        instrument = new Tone.MetalSynth().connect(pitchEffect);
        break;
      case "AMSynth":
        instrument = new Tone.AMSynth().connect(pitchEffect);
        break;
      default:
        instrument = new Tone.Synth().connect(pitchEffect);
        break;
    }
  }
  
  function initializeEffects() {
    Object.keys(defaultSoundEffects).forEach(function(key, index) {
      if (defaultSoundEffects[key]) {
        if (key === "sPitchEffect") {
          pitchEffect = new Tone.PitchShift().toMaster();
        }
        if (key === "sWetEffect") {
          wetEffect = new Tone.Effect(0.9).chain(pitchEffect);
        }
        if (key === "sDistortionEffect") {
          distortionEffect = new Tone.Distortion(0.8).chain(wetEffect);
        }
      }
    });
  }