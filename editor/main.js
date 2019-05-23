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

const f1 = parseFloat(0).toPrecision(2);
const f2 = [f1, f1];
const initValueCycleCount= parseFloat(2).toPrecision(2);
const initValueSineDistortAmplitude= parseFloat(0.13).toPrecision(2);
const initValueuNoiseDistortVolatility= parseFloat(20).toPrecision(2);
const initValueuNoiseDistortAmplitude= parseFloat(0.01).toPrecision(2);
const f3= parseFloat(0.5).toPrecision(2);
const initValueDistortPosition= [f3,f3];

const effectRanges = {
    uSineDistortSpread:{   //autoWah
        minVisual: 0.067,
        maxVisual: 1,
        minSound: 0,
        maxSound: 8,
    },
    uSineDistortCycleCount: { //phaser
        minVisual: 60,
        maxVisual: 200,
        minSound: 0,
        maxSound: 8,
    },
    uSineDistortAmplitude: { //vibrato
        minVisual: 0,
        maxVisual: 1,
        minSound: 0,
        maxSound: 10,
    },
    uNoiseDistortVolatility: { //reverb
        minVisual: 1,
        maxVisual: 80,
        minSound: 0,
        maxSound: 2,
    },
    uNoiseDistortAmplitude: { //pitch
        minVisual: 0.008,
        maxVisual: 1,
        minSound: 0,
        maxSound: 24,
    },
    uRotation: { //tremolo
        minVisual: 0,
        maxVisual: 360,
        minSound: 0,
        maxSound: 10,
    },
    uDistortPositionX:{ //Distortion
        minVisual: 0,
        maxVisual: 1,
        minSound: 0,
        maxSound: 1,
    },
    uDistortPositionY:{ //Feedback
        minVisual: 0,
        maxVisual: 1,
        minSound: 0,
        maxSound: 1,
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
    const [x, y] = material.uniforms.uDistortPosition.value;
    if (visualEffect==='uDistortPositionX' || visualEffect==='uDistortPositionY'){
        if (visualEffect==='uDistortPositionX'){
            material.uniforms.uDistortPosition.value[0] = Number(visualValue);
            data[char].uniforms.uDistortPosition[0] = Number(visualValue);
        }
        if (visualEffect==='uDistortPositionY'){
            material.uniforms.uDistortPosition.value[1] = Number(visualValue);
            data[char].uniforms.uDistortPosition[1] = Number(visualValue);
        }
        data[char].uniforms[visualEffect] = Number(visualValue);
    }
    else{
        material.uniforms[visualEffect].value = visualValue;
        data[char].uniforms[visualEffect] = visualValue;
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
    return value;
}

function convertValueToRotation(effect){
    const controllerRange = 264;
    const min = effectRanges[effect].minVisual;
    const max = effectRanges[effect].maxVisual;
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
                currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, currentValue,
                    effectRanges[knobVisualEffect].minVisual, effectRanges[knobVisualEffect].maxVisual,
                    effectRanges[knobVisualEffect].minSound, effectRanges[knobVisualEffect].maxSound,
                    );
                    console.log(material.uniforms);

                switch (knobVisualEffect) {
                     case 'uSineDistortCycleCount':{
                        autoWahEffect.baseFrequency = currentValue;
                        break;
                    }
                    case 'uSineDistortSpread':{
                        phaserEffect.octaves = currentValue;
                        break;
                    }
 
                    case 'uSineDistortAmplitude':{
                        vibratoEffect.frequency = currentValue;
                        break;
                    }
                    case 'uNoiseDistortAmplitude':{
                        pitchEffect.pitch = currentValue;
                        break;
                    }
                    case 'uNoiseDistortVolatility':{
                        break;
                    }
                    case 'uRotation':{
                        tremoloEffect.frequency = currentValue;
                        break;
                    }
                    case 'uDistortPositionX': {
                        console.log(currentValue);
                        console.log(data[char].uniforms.uDistortPosition);

                        distortionEffect.distortion = currentValue;
                        break;
                    }
                    case 'uDistortPositionY': {
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

$("#reset").click(function () {
    Object.keys(data[char].soundEffects).forEach(function(key){
       data[char].soundEffects[key]= f1;
   })

   Object.keys(data[char].uniforms).forEach(function(key){
       switch(key){
           case 'uSineDistortCycleCount':{
               data[char].uniforms[key] = initValueCycleCount;
               break;
           }
           case 'uSineDistortAmplitude':{
               data[char].uniforms[key] = initValueSineDistortAmplitude;
               break;
           }
           case 'uNoiseDistortAmplitude':{
               data[char].uniforms[key] = initValueuNoiseDistortAmplitude;
               break;
           }
           case 'uNoiseDistortVolatility':{
               data[char].uniforms[key] = initValueuNoiseDistortVolatility;
               break;
           }
           case 'uDistortPositionY': {
               data[char].uniforms["uDistortPosition"] = initValueDistortPosition;
               break;
           }
           case 'uDistortPositionX': {
            data[char].uniforms["uDistortPosition"] = initValueDistortPosition;
            break;
        }
            default: {
               data[char].uniforms[key] = f1;
               break;
           }
           
       }
   })
   console.log(data[char].uniforms);
   app.initializeContorllers();
   app.mousemoveFunction();
   blotter.needsUpdate = true;
});