// const char = localStorage.getItem("char");
// const data = JSON.parse(localStorage.getItem("data"));
// const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
// const defaultSoundEffects = JSON.parse(localStorage.getItem("defaultSoundEffects"));
// let instrument, pitchEffect, distortionEffect, wetEffect;
// instrument = defaultSoundEffects[Object.keys(defaultSoundEffects)[0]];
// initializeEffects();
// initializeInstrument();

// data[char].uniforms = Object.assign(defaultUniforms, data[char].uniforms);
// data[char].soundEffects = Object.assign(defaultSoundEffects, data[char].soundEffects);

// var text = new Blotter.Text(char, {
//     family: "Frank Ruhl Libre",
//     size: 100,
//     fill: "white",
// });

// function setCharDataUniform(uniform, value) {
//     data[char].uniforms[uniform] = value;
// }

// function setCharDataSoundEffect(soundEffect, value) {
//     data[char].soundEffects[soundEffect] = value;
// }

// var material = new Blotter.RollingDistortMaterial();
// Object.keys(material.uniforms).forEach(function (key, index) {
//     if (defaultUniforms[key]) {
//         if (key === "uDistortPosition") {
//             material.uniforms[key].value = [Number(data[char].uniforms[key][0]), Number(data[char].uniforms[key][1])];
//         } else {
//             material.uniforms[key].value = Number(data[char].uniforms[key])
//         }
//     }
// })

// var blotter = new Blotter(material, {
//     texts: text,
// });

// var scope = blotter.forText(text);
// scope.appendTo(document.querySelector("#char"));

// const inputElements = document.querySelectorAll('input');
// const note = data[char].note;
// for (let inputElement of inputElements) {
//     inputElement.addEventListener('input', ({
//         currentTarget
//     }) => {
//         const currentValue = currentTarget.value;
//         const {
//             id: propKey
//         } = currentTarget;
//         switch (propKey) {
//             case 'uDistortPositionY': {
//                 const [x, y] = material.uniforms.uDistortPosition.value;
//                 material.uniforms.uDistortPosition.value = [x, Number(currentValue)];
//                 setCharDataUniform("uDistortPosition", material.uniforms.uDistortPosition.value);
//                 break;
//             }
//             case 'uDistortPositionX': {
//                 const [x, y] = material.uniforms.uDistortPosition.value;
//                 material.uniforms.uDistortPosition.value = [Number(currentValue), y];
//                 setCharDataUniform("uDistortPosition", material.uniforms.uDistortPosition.value);
//                 break;
//             }

//             case 'uNoiseDistortVolatility':{
//                 material.uniforms[propKey].value = currentValue;
//                 setCharDataUniform(propKey, currentValue);
//                 pitchEffect.pitch = currentValue;
//                 setCharDataSoundEffect("sPitchEffect", currentValue);
                  
//                 break;
//             }
//             case 'uSineDistortAmplitude':{
//                 material.uniforms[propKey].value = currentValue;
//                 setCharDataUniform(propKey, currentValue);
//                 wetEffect.wet.value = currentValue;
//                 setCharDataSoundEffect("sWetEffect", currentValue);
//                 console.log(wetEffect.wet.value);
//                 break;
//             }
//             case 'uNoiseDistortAmplitude':{
//                 material.uniforms[propKey].value = currentValue;
//                 setCharDataUniform(propKey, currentValue);
//                 distortionEffect.distortion = currentValue;
//                 setCharDataSoundEffect("sDistortionEffect", currentValue);
//                 console.log(distortionEffect.distortion);
//                 break;
//             }
//             default: {
//                 material.uniforms[propKey].value = currentValue;
//                 setCharDataUniform(propKey, currentValue);
//             }
//         }
//         instrument.triggerAttackRelease(note, '4n');
    
//     })
// }


// $(document).ready(function () {
//     inputElements.forEach(function (inputElement) {
//         switch (inputElement.id) {
//             case 'uDistortPositionY': {
//                 const [x, y] = data[char].uniforms.uDistortPosition;
//                 inputElement.value = Number(y);
//                 break;
//             }
//             case 'uDistortPositionX': {
//                 const [x, y] = data[char].uniforms.uDistortPosition;
//                 inputElement.value = Number(x);
//                 break;
//             }
//             default: {
//                 inputElement.value = Number(data[char].uniforms[inputElement.id]);
//             }
//         }
//     })
// });

// $(window).on("beforeunload", function () {
//     localStorage.setItem('data', JSON.stringify(data));
// })

// $("#back").click(function () {
//     localStorage.setItem("data", JSON.stringify(data));
//     location.assign("../menu");
// });


  
//   function initializeEffects() {
//           pitchEffect = new Tone.PitchShift().toMaster();
//           wetEffect = new Tone.Effect(0).chain(pitchEffect);
//           distortionEffect = new Tone.Distortion(0.8).chain(wetEffect);
//   }

//   function initializeInstrument() {
//     switch (instrument) {
//       case "synth":
//         instrument = new Tone.Synth().connect(distortionEffect);
//         break;
//       case "metalSynth":
//         instrument = new Tone.MetalSynth().connect(distortionEffect);
//         break;
//       case "AMSynth":
//         instrument = new Tone.AMSynth().connect(distortionEffect);
//         break;
//       case "monoSynth":
//         instrument = new Tone.MonoSynth().connect(distortionEffect);
//         break;
//       case "polySynth":
//         instrument = new Tone.PolySynth().connect(distortionEffect);
//         break;
//       default:
//         instrument = new Tone.Synth().connect(distortionhEffect);
//         break;
//     }
//   }

  





// --- Notes ---
// https://mir-s3-cdn-cf.behance.net/project_modules/disp/1dd3e221774089.56307491c7600.png
// https://www.surrealmachines.com/wp-content/uploads/xmodnetic-laptop.png.pagespeed.ic.EB89gLdCx-.webp

// - To Do -
// Make components for the knobs
// Need to make two way knobs
// - for this i have to figure out how to have the svg break point in the middle of the arc

// - Vue Stuff -
// var app = new Vue({
//     el: '#app',
//     data: {
//         colorArray: ['#23CDE8', '#23F376', '#FFFB43', '#FA9C34', '#21CD92', '#ED31A2', '#E22'],
//         effects: [],
//         knobs: [{
//             id: 0,
//             label: 'Test Knob',
//             rotation: -132,
//             color: '#FA9C34',
//             active: true,
//             selected: false,
//             style: 1
//         },
//         {
//             id: 1,
//             label: 'Test Knob',
//             rotation: -132,
//             color: '#ED31A2',
//             active: true,
//             selected: false,
//             style: 1
//         },
//      ],
//         currentY: 0,
//         mousemoveFunction: function (e) {
//             var selectedKnob = app.knobs.filter(function (i) {
//                 return i.selected === true;
//             })[0];
//             if (selectedKnob) {
//                 // Knob Rotation
//                 if (e.pageY - app.currentY !== 0) {
//                     selectedKnob.rotation -= (e.pageY - app.currentY);
//                 }
//                 app.currentY = e.pageY;

//                 // Setting Max rotation
//                 if (selectedKnob.rotation >= 132) {
//                     selectedKnob.rotation = 132;
//                 } else if (selectedKnob.rotation <= -132) {
//                     selectedKnob.rotation = -132;
//                 }
//             }
//         },
//     },
//     methods: {
//         unselectKnobs: function () {
//             for (var i in this.knobs) {
//                 this.knobs[i].selected = false;
//             }
//             for (var i in this.effects) {
//                 for (var j in this.effects[i].knobs) {
//                     this.effects[i].knobs[j].selected = false;
//                 }
//                 this.effects[i].selected = false;
//             }
//         }
//     }
// });

// window.addEventListener('mousemove', app.mousemoveFunction);